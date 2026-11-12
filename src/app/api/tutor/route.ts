import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { conversations, messages, profiles, activity } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { freeReply, runScenario, llmReply, TutorReply } from "@/lib/tutor";
import { scenarioById } from "@/lib/data/scenarios";
import { todayKey, studyLevel } from "@/lib/levels";

function convoSystemPrompt(level: string, dialect: string) {
  return `Du bist ein professioneller C2-Deutschlehrer für arabische (ägyptische) Muttersprachler, Niveau des Lernenden: ${level}.
Regeln: Antworte IMMER als JSON: {"german": "...", "arabic": "...", "correction": null|string, "tip": null|string}.
- "german": deine Antwort auf Deutsch, passend zum Niveau (kurz und einfach bei A1/A2).
- "arabic": Übersetzung/Erklärung auf ${dialect === "egyptian" ? "Ägyptisch-Arabisch" : "Hocharabisch"}.
- Korrigiere Fehler des Lernenden freundlich in "correction" (auf Arabisch), sonst null.
- Stelle oft eine einfache Frage, um das Gespräch am Laufen zu halten.
- Sprich natürliches Hochdeutsch, kein Roboterdeutsch.`;
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });

  try {
    const body = await req.json();
    const message = String(body.message ?? "").slice(0, 2000);
    const mode: "free" | "scenario" = body.mode === "scenario" ? "scenario" : "free";
    const scenarioId = body.scenarioId ? String(body.scenarioId) : null;
    let conversationId = body.conversationId ? Number(body.conversationId) : null;

    const profRows = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
    const profile = profRows[0];
    const level = profile ? studyLevel(profile.currentLevel) : "A1";
    const dialect = profile?.dialect ?? "egyptian";

    // Load or create conversation
    let step = 0;
    let mistakes: string[] = [];
    let turn = 0;
    if (conversationId) {
      const conv = await db.select().from(conversations).where(eq(conversations.id, conversationId)).limit(1);
      if (!conv[0] || conv[0].userId !== user.id) return NextResponse.json({ error: "المحادثة مش موجودة" }, { status: 404 });
      try {
        const meta = conv[0].meta ? JSON.parse(conv[0].meta) : {};
        step = meta.step ?? 0;
        mistakes = meta.mistakes ?? [];
      } catch { /* fresh meta */ }
      const historyRows = await db.select({ role: messages.role }).from(messages).where(eq(messages.conversationId, conversationId));
      turn = historyRows.length;
    } else {
      const [created] = await db
        .insert(conversations)
        .values({ userId: user.id, mode, scenario: scenarioId, meta: JSON.stringify({ step: 0, mistakes: [] }) })
        .returning({ id: conversations.id });
      conversationId = created.id;
      await db.insert(activity).values({ userId: user.id, kind: "conversation", value: 1, day: todayKey() });
    }

    let reply: TutorReply | null = null;
    let nextStep = step;
    let scenarioDone = false;

    if (mode === "scenario" && scenarioId) {
      const scenario = scenarioById(scenarioId);
      if (!scenario) return NextResponse.json({ error: "الموقف ده مش موجود" }, { status: 404 });
      const result = runScenario(scenario, message === "__start__" ? -1 : step, message, turn);
      reply = result.reply;
      nextStep = result.nextStep;
      scenarioDone = result.done;
      if (result.mistake) mistakes.push(result.mistake);
      if (result.reply.correction) mistakes.push(result.reply.correction);
    } else {
      // Free conversation: try LLM first (if configured), else rule engine.
      const historyRows = conversationId
        ? await db
            .select({ role: messages.role, german: messages.german })
            .from(messages)
            .where(eq(messages.conversationId, conversationId))
            .limit(12)
        : [];
      const history = historyRows
        .filter((m) => m.german)
        .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.german! }));
      if (message !== "__start__") {
        reply = await llmReply(convoSystemPrompt(level, dialect), history, message);
      }
      if (!reply) {
        if (message === "__start__") {
          reply = {
            german:
              level === "A1"
                ? "Hallo! Ich bin Frau Schneider, deine deutsche Lehrerin. Wie heißt du?"
                : "Hallo! Schön, dass du da bist. Ich bin deine Deutschlehrerin. Erzähl mir, wie läuft dein Tag?",
            arabic:
              level === "A1"
                ? "أهلًا! أنا مدام شنايدر، مدرّستك الألمانية. اسمك إيه؟"
                : "أهلًا! مبسوطة إنك هنا. أنا مدرّستك للألماني. احكيلي يومك ماشي إزاي؟",
            correction: null,
            tip: "لو عايز تتكلم عربي أو تسألني بالمصري - اتفضل، أنا فاهمك.",
          };
        } else {
          reply = freeReply(message, turn, level);
        }
      }
    }

    // persist user + assistant messages
    if (message !== "__start__") {
      await db.insert(messages).values({ conversationId, role: "user", german: message, arabic: null, correction: null });
      await db.insert(activity).values({ userId: user.id, kind: "speaking_turn", value: 1, day: todayKey() });
      await db.insert(activity).values({ userId: user.id, kind: "minutes", value: 1, day: todayKey() });
    }
    await db.insert(messages).values({ conversationId, role: "assistant", german: reply.german, arabic: reply.arabic, correction: null });

    // save scenario state
    if (mode === "scenario") {
      await db
        .update(conversations)
        .set({ meta: JSON.stringify({ step: nextStep, mistakes: mistakes.slice(-12), done: scenarioDone }) })
        .where(eq(conversations.id, conversationId));
    }

    return NextResponse.json({
      conversationId,
      reply: {
        german: reply.german,
        arabic: reply.arabic,
        correction: reply.correction ?? null,
        tip: reply.tip ?? null,
        scenarioDone,
        mistakes: mistakes.slice(-12),
      },
      userSaid: message !== "__start__" ? message : undefined,
      byUserLevel: level,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "حصلت مشكلة في المحادثة - جرب تاني" }, { status: 500 });
  }
}

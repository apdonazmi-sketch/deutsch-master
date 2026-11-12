import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { quizResults, skillScores, activity } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { todayKey } from "@/lib/levels";

const SKILL_MAP: Record<string, "listening" | "speaking" | "grammar" | "reading" | "writing"> = {
  listening: "listening",
  grammar: "grammar",
  vocab: "reading",
  speaking: "speaking",
  writing: "writing",
  mixed: "grammar",
};

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });
  const body = await req.json();
  const level = String(body.level ?? "A1");
  const skill = String(body.skill ?? "mixed");
  const score = Number(body.score ?? 0);
  const total = Number(body.total ?? 1);
  if (total <= 0 || score < 0 || score > total) return NextResponse.json({ error: "نتيجة غلط" }, { status: 400 });

  await db.insert(quizResults).values({ userId: user.id, level, skill, score, total });
  await db.insert(activity).values({ userId: user.id, kind: "quiz", value: 1, meta: `${level}/${skill}:${Math.round((score / total) * 100)}`, day: todayKey() });

  const pct = Math.round((score / total) * 100);
  const col = SKILL_MAP[skill];
  if (col) {
    const rows = await db.select().from(skillScores).where(eq(skillScores.userId, user.id)).limit(1);
    if (rows.length > 0) {
      const cur = rows[0];
      const oldVal = cur[col];
      const newVal = oldVal === 0 ? pct : Math.min(100, Math.round(oldVal * 0.6 + pct * 0.4));
      await db.update(skillScores).set({ [col]: newVal, updatedAt: new Date() }).where(eq(skillScores.userId, user.id));
    } else {
      await db.insert(skillScores).values({ userId: user.id, [col]: pct });
    }
  }

  return NextResponse.json({ ok: true, pct });
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });
  const rows = await db.select().from(quizResults).where(eq(quizResults.userId, user.id)).orderBy(desc(quizResults.createdAt)).limit(20);
  return NextResponse.json({ recent: rows });
}

import { NextResponse } from "next/server";
import { and, eq, count } from "drizzle-orm";
import { db } from "@/db";
import { userVocab, activity, profiles } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { VOCAB, vocabByLevel } from "@/lib/data/vocab";
import { studyLevel, todayKey, newWordsPerDay } from "@/lib/levels";

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") ?? "all";

  const rows = await db.select({ vocabId: userVocab.vocabId }).from(userVocab).where(eq(userVocab.userId, user.id));
  const learned = new Set(rows.map((r) => r.vocabId));

  if (mode === "learn") {
    const profRows = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
    const level = profRows[0] ? studyLevel(profRows[0].currentLevel) : "A1";
    const perDay = profRows[0] ? newWordsPerDay(profRows[0].dailyMinutes) : 6;
    const pool = vocabByLevel(level).filter((x) => !learned.has(x.id)).slice(0, perDay);
    return NextResponse.json({ items: pool, learned: [...learned], perDay });
  }

  // all dictionary
  const q = url.searchParams.get("q")?.toLowerCase() ?? "";
  const levelFilter = url.searchParams.get("level") ?? "";
  let items = VOCAB;
  if (levelFilter) items = items.filter((x) => x.level === levelFilter);
  if (q) items = items.filter((x) => x.de.toLowerCase().includes(q) || x.ar.includes(q));
  const counts = await db.select({ n: count() }).from(userVocab).where(eq(userVocab.userId, user.id));
  return NextResponse.json({ items, learned: [...learned], total: VOCAB.length, learnedCount: counts[0].n });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });
  const body = await req.json();
  const vocabId = String(body.vocabId ?? "");
  const item = VOCAB.find((x) => x.id === vocabId);
  if (!item) return NextResponse.json({ error: "الكلمة مش موجودة" }, { status: 404 });

  const existing = await db
    .select({ id: userVocab.id })
    .from(userVocab)
    .where(and(eq(userVocab.userId, user.id), eq(userVocab.vocabId, vocabId)))
    .limit(1);
  if (existing.length === 0) {
    await db.insert(userVocab).values({ userId: user.id, vocabId, nextReview: new Date(Date.now() + 10 * 60 * 1000) });
    await db.insert(activity).values({ userId: user.id, kind: "word", value: 1, meta: item.de, day: todayKey() });
  }
  return NextResponse.json({ ok: true });
}

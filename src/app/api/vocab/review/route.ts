import { NextResponse } from "next/server";
import { and, eq, lt, asc } from "drizzle-orm";
import { db } from "@/db";
import { userVocab, activity } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { VOCAB } from "@/lib/data/vocab";
import { reviewCard } from "@/lib/srs";
import { todayKey } from "@/lib/levels";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });
  const rows = await db
    .select()
    .from(userVocab)
    .where(and(eq(userVocab.userId, user.id), lt(userVocab.nextReview, new Date())))
    .orderBy(asc(userVocab.nextReview))
    .limit(40);
  const byId = new Map(VOCAB.map((x) => [x.id, x]));
  const items = rows
    .map((r) => {
      const item = byId.get(r.vocabId);
      return item ? { ...item, srs: { reps: r.reps, intervalDays: r.intervalDays } } : null;
    })
    .filter(Boolean);
  return NextResponse.json({ items, due: rows.length });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });
  const body = await req.json();
  const vocabId = String(body.vocabId ?? "");
  const quality = Number(body.quality);
  if (![0, 3, 5].includes(quality)) return NextResponse.json({ error: "quality لازم تكون 0 أو 3 أو 5" }, { status: 400 });

  const rows = await db
    .select()
    .from(userVocab)
    .where(and(eq(userVocab.userId, user.id), eq(userVocab.vocabId, vocabId)))
    .limit(1);
  if (rows.length === 0) return NextResponse.json({ error: "الكلمة مش في قاموسك" }, { status: 404 });

  const r = rows[0];
  const result = reviewCard({ ease: r.ease, intervalDays: r.intervalDays, reps: r.reps, lapses: r.lapses }, quality);
  await db
    .update(userVocab)
    .set({
      ease: result.ease,
      intervalDays: result.intervalDays,
      reps: result.reps,
      lapses: result.lapses,
      nextReview: result.nextReviewAt,
      lastQuality: quality,
    })
    .where(eq(userVocab.id, r.id));
  await db.insert(activity).values({ userId: user.id, kind: "review", value: 1, meta: String(quality), day: todayKey() });
  return NextResponse.json({ ok: true, nextReviewAt: result.nextReviewAt });
}

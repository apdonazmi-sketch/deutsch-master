import { NextResponse } from "next/server";
import { db } from "@/db";
import { activity } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { scorePronunciation } from "@/lib/pronounce";
import { todayKey } from "@/lib/levels";

// Approximate pronunciation assessment based on speech-to-text comparison.
// Honest labeling: this is an approximation, not a certified evaluation.
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });
  const body = await req.json();
  const target = String(body.target ?? "").slice(0, 300);
  const transcript = String(body.transcript ?? "").slice(0, 500);
  if (!target || !transcript) return NextResponse.json({ error: "مفيش صوت اتسجل - جرب تاني" }, { status: 400 });
  const result = scorePronunciation(target, transcript);
  await db.insert(activity).values({ userId: user.id, kind: "pronunciation", value: result.score >= 70 ? 2 : 1, meta: target.slice(0, 60), day: todayKey() });
  return NextResponse.json({ ...result, approximate: true });
}

import { NextResponse } from "next/server";
import { and, eq, gte, desc } from "drizzle-orm";
import { db } from "@/db";
import { profiles, quizResults } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

// Level advancement requires real measured skills: recent vocab + grammar + listening
// results for the target level, each >= 70%.
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });
  const body = await req.json();
  const level = String(body.level ?? "");
  if (!["A1", "A2", "B1", "B2", "C1", "C2"].includes(level)) return NextResponse.json({ error: "مستوى غير صحيح" }, { status: 400 });

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const rows = await db
    .select()
    .from(quizResults)
    .where(and(eq(quizResults.userId, user.id), eq(quizResults.level, level), gte(quizResults.createdAt, since)))
    .orderBy(desc(quizResults.createdAt))
    .limit(30);

  const skills = ["vocab", "grammar", "listening"];
  const checks = skills.map((s) => {
    const r = rows.find((x) => x.skill === s);
    return { skill: s, pct: r ? Math.round((r.score / r.total) * 100) : 0, passed: !!r && r.score / r.total >= 0.7 };
  });
  const passed = checks.every((c) => c.passed);
  if (!passed) {
    return NextResponse.json({ ok: false, checks, error: "لازم تعدّي اختبارات المفردات والقواعد والاستماع بـ 70% على الأقل الأول" }, { status: 200 });
  }

  await db.update(profiles).set({ currentLevel: level }).where(eq(profiles.userId, user.id));
  return NextResponse.json({ ok: true, checks, newLevel: level });
}

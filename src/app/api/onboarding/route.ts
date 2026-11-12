import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles, skillScores } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { buildReport, ProfileInput } from "@/lib/plan";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });
  try {
    const body = (await req.json()) as ProfileInput;
    const required = [body.goal, body.currentLevel, body.targetLevel, body.dialect, body.transition];
    if (required.some((x) => !x)) return NextResponse.json({ error: "كل الأسئلة لازم تتجاوب" }, { status: 400 });

    const report = buildReport(body);
    const values = {
      goal: body.goal,
      customGoal: body.customGoal ?? null,
      currentLevel: body.currentLevel,
      targetLevel: body.targetLevel,
      months: Math.max(1, Math.min(120, Number(body.months) || 12)),
      dailyMinutes: Math.max(5, Math.min(480, Number(body.dailyMinutes) || 30)),
      styles: JSON.stringify(body.styles ?? []),
      topics: JSON.stringify(body.topics ?? []),
      fears: JSON.stringify(body.fears ?? []),
      dialect: body.dialect,
      transition: body.transition,
      report: JSON.stringify(report),
    };

    const existing = await db.select({ id: profiles.id }).from(profiles).where(eq(profiles.userId, user.id)).limit(1);
    if (existing.length > 0) {
      await db.update(profiles).set(values).where(eq(profiles.userId, user.id));
    } else {
      await db.insert(profiles).values({ userId: user.id, ...values });
      await db.insert(skillScores).values({ userId: user.id }).onConflictDoNothing();
    }
    return NextResponse.json({ ok: true, report });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "حصلت مشكلة أثناء حفظ خطتك" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ user: null, profile: null });
  const rows = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  const p = rows[0];
  return NextResponse.json({
    user,
    profile: p
      ? {
          goal: p.goal,
          customGoal: p.customGoal,
          currentLevel: p.currentLevel,
          targetLevel: p.targetLevel,
          months: p.months,
          dailyMinutes: p.dailyMinutes,
          styles: JSON.parse(p.styles),
          topics: JSON.parse(p.topics),
          fears: JSON.parse(p.fears),
          dialect: p.dialect,
          transition: p.transition,
          report: p.report ? JSON.parse(p.report) : null,
          createdAt: p.createdAt,
        }
      : null,
  });
}

import { NextResponse } from "next/server";
import { and, eq, lt, count, gte, desc } from "drizzle-orm";
import { db } from "@/db";
import { profiles, userVocab, activity, taskCompletions, weeklyReports } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { buildDailyTasks } from "@/lib/plan";
import { todayKey } from "@/lib/levels";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });

  const profRows = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  const profile = profRows[0];
  if (!profile) return NextResponse.json({ needsOnboarding: true });

  const day = todayKey();
  const [dueRow, doneRows, todayActs, recentDays] = await Promise.all([
    db.select({ n: count() }).from(userVocab).where(and(eq(userVocab.userId, user.id), lt(userVocab.nextReview, new Date()))),
    db.select({ task: taskCompletions.task }).from(taskCompletions).where(and(eq(taskCompletions.userId, user.id), eq(taskCompletions.day, day))),
    db.select({ kind: activity.kind, value: activity.value }).from(activity).where(and(eq(activity.userId, user.id), eq(activity.day, day))),
    db.select({ day: activity.day }).from(activity).where(eq(activity.userId, user.id)).orderBy(desc(activity.day)).limit(120),
  ]);

  const doneSet = new Set(doneRows.map((r) => r.task));
  const tasks = buildDailyTasks(profile.dailyMinutes, dueRow[0]?.n ?? 0).map((t) => ({ ...t, done: doneSet.has(t.id) }));
  const minutesToday = todayActs.filter((a) => a.kind === "minutes").reduce((s, a) => s + a.value, 0);
  const tasksDone = doneSet.size;

  // streak: consecutive days with any activity
  const uniqueDays = [...new Set(recentDays.map((r) => r.day))];
  let streak = 0;
  const cursor = new Date();
  if (!uniqueDays.includes(todayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  for (;;) {
    const key = todayKey(cursor);
    if (uniqueDays.includes(key)) { streak += 1; cursor.setDate(cursor.getDate() - 1); } else break;
  }

  const latestReportRows = await db
    .select()
    .from(weeklyReports)
    .where(eq(weeklyReports.userId, user.id))
    .orderBy(desc(weeklyReports.createdAt))
    .limit(1);

  return NextResponse.json({
    tasks,
    dueCount: dueRow[0]?.n ?? 0,
    minutesToday,
    tasksDone,
    totalTasks: tasks.length,
    streak,
    profile: {
      currentLevel: profile.currentLevel,
      targetLevel: profile.targetLevel,
      dailyMinutes: profile.dailyMinutes,
      createdAt: profile.createdAt,
      report: profile.report ? JSON.parse(profile.report) : null,
    },
    weeklyReport: latestReportRows[0] ? JSON.parse(latestReportRows[0].report) : null,
  });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });
  const body = await req.json();
  const task = String(body.task ?? "");
  const minutes = Number(body.minutes ?? 0);
  const day = todayKey();
  if (task) {
    await db.insert(taskCompletions).values({ userId: user.id, day, task }).onConflictDoNothing();
  }
  if (minutes > 0 && minutes <= 600) {
    await db.insert(activity).values({ userId: user.id, kind: "minutes", value: minutes, day });
  }
  return NextResponse.json({ ok: true });
}

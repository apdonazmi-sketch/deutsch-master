import { NextResponse } from "next/server";
import { and, eq, gte, desc, count, gt } from "drizzle-orm";
import { db } from "@/db";
import { activity, profiles, quizResults, skillScores, userVocab, conversations, weeklyReports, taskCompletions } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { buildWeeklyReport, WeekStats } from "@/lib/plan";
import { todayKey, levelIndex, nextLevel, CUMULATIVE_HOURS, LevelKey } from "@/lib/levels";

function weekStartKey(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = (day + 1) % 7; // week starts Sunday
  d.setDate(d.getDate() - diff);
  return todayKey(d);
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });

  const sevenAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const fourteenAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  const [profileRows, skillRows, allActs, weekActs, prevWeekActs, learnedRow, retainedRow, convRow, quizRows, lessonsRow] = await Promise.all([
    db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1),
    db.select().from(skillScores).where(eq(skillScores.userId, user.id)).limit(1),
    db.select().from(activity).where(eq(activity.userId, user.id)).orderBy(desc(activity.createdAt)).limit(2000),
    db.select().from(activity).where(and(eq(activity.userId, user.id), gte(activity.createdAt, sevenAgo))),
    db.select().from(activity).where(and(eq(activity.userId, user.id), gte(activity.createdAt, fourteenAgo))),
    db.select({ n: count() }).from(userVocab).where(eq(userVocab.userId, user.id)),
    db.select({ n: count() }).from(userVocab).where(and(eq(userVocab.userId, user.id), gt(userVocab.intervalDays, 5))),
    db.select({ n: count() }).from(conversations).where(eq(conversations.userId, user.id)),
    db.select().from(quizResults).where(eq(quizResults.userId, user.id)).orderBy(desc(quizResults.createdAt)).limit(40),
    db.select({ n: count() }).from(taskCompletions).where(and(eq(taskCompletions.userId, user.id), eq(taskCompletions.task, "grammar"))),
  ]);

  const profile = profileRows[0] ?? null;
  const skills = skillRows[0] ?? null;

  const totalMinutes = allActs.filter((a) => a.kind === "minutes").reduce((s, a) => s + a.value, 0);
  const weekMinutes = weekActs.filter((a) => a.kind === "minutes").reduce((s, a) => s + a.value, 0);
  const weekWords = weekActs.filter((a) => a.kind === "word").length;
  const weekReviews = weekActs.filter((a) => a.kind === "review");
  const retainedGood = weekReviews.filter((a) => Number(a.meta) >= 3).length;
  const weekConversations = weekActs.filter((a) => a.kind === "conversation").length;
  const weekQuizzes = weekActs.filter((a) => a.kind === "quiz");
  const weekQuizAvg = weekQuizzes.length > 0 ? Math.round(weekQuizzes.reduce((s, a) => s + Number(a.meta?.split(":")[1] ?? 0), 0) / weekQuizzes.length) : 0;
  const prevQuizzes = prevWeekActs.filter((a) => !weekActs.includes(a) && a.kind === "quiz");
  const prevAvg = prevQuizzes.length > 0 ? Math.round(prevQuizzes.reduce((s, a) => s + Number(a.meta?.split(":")[1] ?? 0), 0) / prevQuizzes.length) : null;

  // 7-day chart data
  const chart: { day: string; minutes: number; words: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = todayKey(d);
    chart.push({
      day: key.slice(5),
      minutes: allActs.filter((a) => a.day === key && a.kind === "minutes").reduce((s, a) => s + a.value, 0),
      words: allActs.filter((a) => a.day === key && a.kind === "word").length,
    });
  }

  // level progress within current level
  let levelProgress = 0;
  if (profile) {
    const cur = levelIndex(profile.currentLevel);
    const targetNext = nextLevel(profile.currentLevel);
    const span = Math.max(20, (CUMULATIVE_HOURS[targetNext as LevelKey] ?? 100) - (CUMULATIVE_HOURS[profile.currentLevel as LevelKey] ?? 0));
    const hoursDone = totalMinutes / 60;
    levelProgress = Math.max(2, Math.min(97, Math.round((hoursDone / span) * 100)));
    if (cur >= 7) levelProgress = 100;
  }

  const overallQuizAvg = quizRows.length > 0 ? Math.round(quizRows.reduce((s, r) => s + (r.score / r.total) * 100, 0) / quizRows.length) : 0;

  const stats: WeekStats = {
    minutes: weekMinutes,
    sessions: new Set(weekActs.map((a) => a.day)).size,
    wordsLearned: weekWords,
    wordsRetained: retainedGood,
    wordsTotal: weekReviews.length,
    listeningScore: skills?.listening ?? 0,
    speakingScore: skills?.speaking ?? 0,
    grammarScore: skills?.grammar ?? 0,
    conversations: weekConversations,
    quizAvg: weekQuizAvg,
  };

  const struggles = quizRows.slice(0, 5).filter((r) => r.score / r.total < 0.7).map((r) => `${r.level}/${r.skill}`);
  const weekly = buildWeeklyReport(stats, prevAvg, profile?.dailyMinutes ?? 30, struggles);

  // persist weekly snapshot when a new week starts and enough data exists
  const ws = weekStartKey();
  const latest = await db.select().from(weeklyReports).where(eq(weeklyReports.userId, user.id)).orderBy(desc(weeklyReports.createdAt)).limit(1);
  if ((latest.length === 0 || latest[0].weekStart !== ws) && weekActs.length > 0) {
    await db.insert(weeklyReports).values({ userId: user.id, weekStart: ws, report: JSON.stringify(weekly) });
  }

  return NextResponse.json({
    totals: {
      minutes: totalMinutes,
      hours: Math.round((totalMinutes / 60) * 10) / 10,
      wordsLearned: learnedRow[0]?.n ?? 0,
      wordsRetained: retainedRow[0]?.n ?? 0,
      conversations: convRow[0]?.n ?? 0,
      lessonsDone: lessonsRow[0]?.n ?? 0,
      quizzes: quizRows.length,
      quizAvg: overallQuizAvg,
    },
    skills: {
      listening: skills?.listening ?? 0,
      speaking: skills?.speaking ?? 0,
      grammar: skills?.grammar ?? 0,
      reading: skills?.reading ?? 0,
      writing: skills?.writing ?? 0,
    },
    chart,
    levelProgress,
    profile: profile
      ? { currentLevel: profile.currentLevel, targetLevel: profile.targetLevel, dailyMinutes: profile.dailyMinutes, createdAt: profile.createdAt }
      : null,
    weekly,
    recentQuizzes: quizRows.slice(0, 8),
  });
}

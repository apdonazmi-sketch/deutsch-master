"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Flame, BookOpen, MessageCircle, Timer, ClipboardCheck, Sparkles, Award } from "lucide-react";
import ClientShell from "@/components/ClientShell";

type ProgressData = {
  totals: { minutes: number; hours: number; wordsLearned: number; wordsRetained: number; conversations: number; lessonsDone: number; quizzes: number; quizAvg: number };
  skills: { listening: number; speaking: number; grammar: number; reading: number; writing: number };
  chart: { day: string; minutes: number; words: number }[];
  levelProgress: number;
  profile: { currentLevel: string; targetLevel: string; dailyMinutes: number; createdAt: string } | null;
  weekly: { summary: string; improved: string[]; focusNextWeek: string[]; adjustments: string[] };
  recentQuizzes: { level: string; skill: string; score: number; total: number; createdAt: string }[];
};

const SKILL_LABELS: Record<string, string> = { listening: "الاستماع", speaking: "التحدث", grammar: "القواعد", reading: "القراءة", writing: "الكتابة" };

function barColor(pct: number) {
  if (pct >= 70) return "bg-mint";
  if (pct >= 40) return "bg-gold";
  return "bg-germanred";
}

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null);

  useEffect(() => {
    fetch("/api/progress").then((r) => r.json()).then(setData).catch(() => {});
  }, []);

  if (!data) return <ClientShell><div className="py-24 text-center text-sm text-muted">بنجمع تقريرك...</div></ClientShell>;

  const maxMinutes = Math.max(...data.chart.map((c) => c.minutes), 10);

  return (
    <ClientShell>
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-2xl font-black">
          <TrendingUp className="text-gold" /> تقريرك وتقدمك
        </h1>
        <p className="mt-2 text-sm text-muted">أرقام حقيقية من أداءك الفعلي — مش تقديرات شكلية.</p>
      </div>

      {/* level ring + totals */}
      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <div className="card flex flex-col items-center justify-center p-7">
          <div className="relative flex h-36 w-36 items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none" stroke="url(#grad)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - data.levelProgress / 100)}`}
              />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffc53d" />
                  <stop offset="100%" stopColor="#ff5252" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-center">
              <div className="german text-3xl font-bold text-gold">{data.profile?.currentLevel}</div>
              <div className="text-[10px] text-muted">{data.levelProgress}% ناحية {data.profile?.targetLevel}</div>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-muted">
            الهدف: <span className="german font-bold text-cream">{data.profile?.targetLevel}</span> · إيقاع يومي: {data.profile?.dailyMinutes} دقيقة
          </div>
          <a href="/tests" className="btn-ghost mt-4 flex items-center gap-2 px-4 py-2 text-xs">
            <Award size={14} className="text-gold" /> اختبر ترقية مستواك
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Timer, v: `${data.totals.hours} ساعة`, l: "ساعات الدراسة" },
            { icon: BookOpen, v: data.totals.wordsLearned, l: "كلمة اتعلمتها" },
            { icon: Flame, v: data.totals.wordsRetained, l: "كلمة اثبتت فعلًا" },
            { icon: MessageCircle, v: data.totals.conversations, l: "محادثة كاملة" },
            { icon: ClipboardCheck, v: data.totals.quizzes, l: "اختبار عملته" },
            { icon: Sparkles, v: `${data.totals.quizAvg}%`, l: "متوسط الاختبارات" },
            { icon: TrendingUp, v: data.totals.lessonsDone, l: "درس قواعد خلصته" },
            { icon: Award, v: data.levelProgress + "%", l: "من المستوى الحالي" },
          ].map((c) => (
            <div key={c.l} className="card p-4 text-center">
              <c.icon className="mx-auto mb-2 text-gold" size={17} />
              <div className="german text-xl font-bold">{c.v}</div>
              <div className="mt-1 text-[11px] text-muted">{c.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* skills */}
      <div className="card mt-4 p-6">
        <h3 className="mb-5 font-extrabold">المهارات الخمس</h3>
        <div className="space-y-4">
          {Object.entries(data.skills).map(([key, val]) => (
            <div key={key}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-bold">{SKILL_LABELS[key]}</span>
                <span className="german text-muted">{val}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                <div className={`h-full rounded-full transition-all duration-700 ${barColor(val)}`} style={{ width: `${Math.max(val, 2)}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-5 text-[11px] leading-5 text-muted">
          النقاط بتيجي من نتايج الاختبارات والتمارين العملية (الاستماع، المحادثة، النطق) — مش من مجرد فتح الصفحات.
        </p>
      </div>

      {/* weekly adaptive */}
      <div className="card mt-4 border-gold/25 p-6">
        <h3 className="mb-3 flex items-center gap-2 font-extrabold text-gold">
          <Sparkles size={17} /> تحليل الأسبوع وتعديل خطتك
        </h3>
        <p className="text-sm leading-7 text-cream/90">{data.weekly.summary}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            { t: "اللي تحسّن", items: data.weekly.improved, cls: "text-mint" },
            { t: "تركيز الأسبوع الجاي", items: data.weekly.focusNextWeek, cls: "text-gold" },
            { t: "تعديلات تلقائية", items: data.weekly.adjustments, cls: "text-cream" },
          ].map((col) => (
            <div key={col.t} className="rounded-xl bg-white/[0.03] p-4">
              <div className={`mb-2 text-xs font-extrabold ${col.cls}`}>{col.t}</div>
              <ul className="space-y-2">
                {col.items.length === 0 && <li className="text-[12px] text-muted">اشتغل أسبوع وهتلاقي تحليل كامل هنا.</li>}
                {col.items.map((x, i) => (
                  <li key={i} className="text-[12px] leading-5 text-cream/80">· {x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 7-day chart */}
      <div className="card mt-4 p-6">
        <h3 className="mb-5 font-extrabold">آخر ٧ أيام (دقايق دراسة)</h3>
        <div className="flex h-36 items-end gap-3" dir="ltr">
          {data.chart.map((c) => (
            <div key={c.day} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full items-end justify-center gap-1" style={{ height: "112px" }}>
                <div
                  className="w-full max-w-[34px] rounded-t-lg bg-gradient-to-t from-golddeep/70 to-gold"
                  style={{ height: `${Math.max((c.minutes / maxMinutes) * 100, c.minutes > 0 ? 6 : 2)}%`, opacity: c.minutes > 0 ? 1 : 0.2 }}
                />
              </div>
              <span className="german text-[10px] text-muted">{c.day}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-center text-[11px] text-muted">
          {data.chart.reduce((s, c) => s + c.minutes, 0)} دقيقة إجمالي الأسبوع ده · لو يوم فاتك مش مشكلة — الخطة بتتظبط مش بتتصفر
        </div>
      </div>

      {/* recent quizzes */}
      {data.recentQuizzes.length > 0 && (
        <div className="card mt-4 p-6">
          <h3 className="mb-4 font-extrabold">آخر الاختبارات</h3>
          <div className="space-y-2">
            {data.recentQuizzes.map((r, i) => {
              const pct = Math.round((r.score / r.total) * 100);
              return (
                <div key={i} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-2.5 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="german rounded-md bg-gold/10 px-2 py-0.5 text-[10px] font-bold text-gold">{r.level}</span>
                    <span className="text-muted">{SKILL_LABELS[r.skill] ?? r.skill}</span>
                  </span>
                  <span className={`german font-bold ${pct >= 70 ? "text-mint" : "text-germanred"}`}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ClientShell>
  );
}

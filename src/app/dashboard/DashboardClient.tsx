"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import Link from "next/link";
import {
  RefreshCw, MessageCircle, MapPin, Headphones, BookOpen, Ruler, ClipboardCheck,
  Mic, Flame, CheckCircle2, Circle, ChevronLeft, Sparkles, AlertTriangle, CalendarClock,
} from "lucide-react";

const ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  RefreshCw, MessageCircle, MapPin, Headphones, BookOpen, Ruler, ClipboardCheck, Mic,
};

type Task = { id: string; title: string; desc: string; minutes: number; href: string; icon: string; done: boolean };
type PlanData = {
  tasks: Task[];
  dueCount: number;
  minutesToday: number;
  tasksDone: number;
  totalTasks: number;
  streak: number;
  profile: { currentLevel: string; targetLevel: string; dailyMinutes: number; createdAt: string };
  weeklyReport: { summary: string; improved: string[]; focusNextWeek: string[]; adjustments: string[] } | null;
};

const DAY_TIP = [
  "اقرأ جملك الجديدة بصوت عالي - الصوت بيثبت اللغة أكتر من العين.",
  "افتكر قاعدة الأمس قبل ما تبدأ الجديد - الاسترجاع بيبني الذاكرة.",
  "جملة واحدة صح مقولوها في الشارع أحسن من ١٠ كلمات محفوظة.",
  "متستعجلش المستوى - المتقن A1 أقوى من اللي نص كم B1.",
];

export default function DashboardClient({ userName }: { userName: string }) {
  const [data, setData] = useState<PlanData | null>(null);
  const [now, setNow] = useState("");

  useEffect(() => {
    fetch("/api/plan").then((r) => r.json()).then(setData).catch(() => {});
    const h = new Date().getHours();
    setNow(h < 12 ? "صباح الخير" : h < 18 ? "نهارك سعيد" : "مساء الخير");
  }, []);

  const tip = useMemo(() => DAY_TIP[new Date().getDay() % DAY_TIP.length], []);
  const pct = data ? Math.round((data.tasksDone / data.totalTasks) * 100) : 0;

  if (!data) {
    return <div className="py-24 text-center text-sm text-muted">بجهّز خطتك...</div>;
  }

  return (
    <div className="space-y-8">
      {/* greeting */}
      <div className="card relative overflow-hidden p-7">
        <div className="aurora left-[-60px] top-[-80px] h-[220px] w-[300px] bg-gold/15" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-gold">
              <Sparkles size={14} /> {now}
            </div>
            <h1 className="mt-2 text-3xl font-black">
              خطتك يا {userName}
            </h1>
            <p className="german mt-1 text-sm text-muted">
              Niveau: <span className="font-bold text-gold">{data.profile.currentLevel}</span> → Ziel:{" "}
              <span className="font-bold text-gold">{data.profile.targetLevel}</span>
            </p>
            <p className="mt-3 flex items-center gap-2 text-[13px] text-muted">
              <CalendarClock size={14} /> نصيحة اليوم: {tip}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9" />
                  <circle
                    cx="50" cy="50" r="42" fill="none" stroke="#ffc53d" strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
                    className="transition-all duration-700"
                  />
                </svg>
                <span className="german text-xl font-bold">{pct}%</span>
              </div>
              <div className="mt-1 text-[11px] text-muted">إنجاز اليوم</div>
            </div>
            <div className="space-y-2 text-center">
              <div className="card flex items-center gap-2 !rounded-xl px-4 py-2">
                <Flame size={16} className="text-germanred" />
                <span className="german text-lg font-bold">{data.streak}</span>
                <span className="text-[11px] text-muted">يوم متواصل</span>
              </div>
              <div className="card !rounded-xl px-4 py-2">
                <span className="german text-lg font-bold">{data.minutesToday}</span>
                <span className="text-[11px] text-muted"> دقيقة النهاردة</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* tasks */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-extrabold">
          مهام النهاردة
          <span className="rounded-full bg-gold/10 px-3 py-1 text-[11px] font-bold text-gold">
            {data.tasksDone} / {data.totalTasks}
          </span>
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {data.tasks.map((t, i) => {
            const Icon = ICONS[t.icon] ?? BookOpen;
            return (
              <Link
                key={t.id}
                href={t.href}
                className={`card group flex items-center gap-4 p-5 transition-all hover:border-gold/40 hover:bg-gold/[0.03] ${
                  t.done ? "opacity-70" : ""
                }`}
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all ${
                  t.done ? "bg-mint/15 text-mint" : "bg-gold/10 text-gold group-hover:scale-110"
                }`}>
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="mb-0.5 flex items-center gap-2 text-sm font-extrabold">
                    <span className="german text-[10px] text-muted">{String(i + 1).padStart(2, "0")}</span>
                    {t.title}
                    <span className="german ms-auto text-[11px] text-muted">{t.minutes} min</span>
                  </span>
                  <span className="block text-[12px] leading-5 text-muted">{t.desc}</span>
                </span>
                {t.done ? <CheckCircle2 size={20} className="shrink-0 text-mint" /> : <Circle size={20} className="shrink-0 text-muted/40" />}
              </Link>
            );
          })}
        </div>
      </div>

      {/* weekly adaptive report */}
      {data.weeklyReport && (
        <div className="card border-gold/25 p-6">
          <h3 className="mb-3 flex items-center gap-2 font-extrabold text-gold">
            <Sparkles size={18} /> تقرير الأسبوع — خطتك بتتطور معاك
          </h3>
          <p className="text-sm leading-7 text-cream/90">{data.weeklyReport.summary}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              { t: "اللي تحسّن", items: data.weeklyReport.improved, cls: "text-mint" },
              { t: "التركيز الجاي", items: data.weeklyReport.focusNextWeek, cls: "text-gold" },
              { t: "تعديلات الخطة", items: data.weeklyReport.adjustments, cls: "text-cream" },
            ].map((col) => (
              <div key={col.t} className="rounded-xl bg-white/[0.03] p-4">
                <div className={`mb-2 text-xs font-extrabold ${col.cls}`}>{col.t}</div>
                <ul className="space-y-2">
                  {col.items.length === 0 && <li className="text-[12px] text-muted">لسه محتاجين بيانات أكتر</li>}
                  {col.items.slice(0, 3).map((x, i) => (
                    <li key={i} className="text-[12px] leading-5 text-cream/80">· {x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 rounded-2xl border border-line bg-white/[0.02] p-5">
        <AlertTriangle size={18} className="shrink-0 text-gold" />
        <p className="text-[13px] leading-6 text-muted">
          الترقية للمستوى الجاي مش بالفطرة: لازم تعدّي اختبارات المفردات والقواعد والاستماع بـ ٧٠٪.
          <Link href="/tests" className="mx-1 font-bold text-gold hover:underline">جرّب اختبار المستوى</Link>
          وشوف واقف فين.
        </p>
        <ChevronLeft size={18} className="ms-auto text-muted" />
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Ruler, ChevronDown, CheckCircle2, Clock } from "lucide-react";
import ClientShell from "@/components/ClientShell";
import { SpeakButton } from "@/components/voice";
import { LESSONS } from "@/lib/data/grammar";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function GrammarPage() {
  const [level, setLevel] = useState("A1");
  const [openId, setOpenId] = useState<string | null>(null);
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());

  const lessons = useMemo(() => LESSONS.filter((l) => l.level === level), [level]);

  async function completeLesson(id: string) {
    setDoneIds((s) => new Set(s).add(id));
    await fetch("/api/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task: "grammar", minutes: 8 }) });
    await fetch("/api/activity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "minutes", value: 2 }) });
  }

  return (
    <ClientShell>
      <div className="mb-7">
        <h1 className="flex items-center gap-3 text-2xl font-black">
          <Ruler className="text-gold" /> القواعد بالمصري
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
          قاعدة واحدة كل مرة، بشرح مصري بسيط وأمثلة من الحياة الحقيقية — وفي الآخر بيطبّق فورًا في المحادثة.
        </p>
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto rounded-full border border-line bg-coal p-1.5">
        {LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => { setLevel(l); setOpenId(null); }}
            className={`german shrink-0 rounded-full px-6 py-2 text-xs font-bold transition-all ${level === l ? "bg-gold text-ink" : "text-muted hover:text-cream"}`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {lessons.map((lesson) => {
          const open = openId === lesson.id;
          const done = doneIds.has(lesson.id);
          return (
            <div key={lesson.id} className={`card overflow-hidden transition-all ${open ? "border-gold/40" : ""}`}>
              <button
                onClick={() => setOpenId(open ? null : lesson.id)}
                className="flex w-full items-center gap-4 p-5 text-start"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${done ? "bg-mint/15 text-mint" : "bg-gold/10 text-gold"}`}>
                  {done ? <CheckCircle2 size={18} /> : <Ruler size={17} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-extrabold">{lesson.title}</span>
                  <span className="block text-xs text-muted">{lesson.subtitle}</span>
                </span>
                <span className="flex items-center gap-1 text-[11px] text-muted">
                  <Clock size={12} /> {lesson.minutes} د
                </span>
                <ChevronDown size={16} className={`text-muted transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
              {open && (
                <div className="space-y-6 border-t border-line/60 px-6 py-6 animate-reveal">
                  {lesson.sections.map((sec, i) => (
                    <div key={i}>
                      <h4 className="mb-2 text-sm font-extrabold text-gold">{sec.h}</h4>
                      <p className="mb-3 text-sm leading-8 text-cream/85">{sec.p}</p>
                      <div className="space-y-2">
                        {sec.examples.map((ex, j) => (
                          <div key={j} className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3">
                            <div className="min-w-0 flex-1">
                              <div className="german text-[14px] font-semibold" dir="ltr">{ex.de}</div>
                              <div className="mt-0.5 text-xs text-muted">{ex.ar}</div>
                            </div>
                            <SpeakButton text={ex.de} rate={0.8} small />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {!done ? (
                    <button onClick={() => completeLesson(lesson.id)} className="btn-gold w-full py-3 text-sm">
                      فهمت الدرس — سجّله في خطتي
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-mint/10 py-3 text-sm font-bold text-mint">
                      <CheckCircle2 size={16} /> الدرس اتسجل في خطة النهاردة
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {lessons.length === 0 && <p className="card p-10 text-center text-sm text-muted">لسه مفيش دروس في المستوى ده.</p>}
      </div>
    </ClientShell>
  );
}

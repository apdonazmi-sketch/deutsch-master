"use client";

import { useMemo, useState } from "react";
import { ClipboardCheck, CheckCircle2, XCircle, Award, AlertTriangle } from "lucide-react";
import ClientShell from "@/components/ClientShell";
import { QUIZ_BANK, generatedArticleQuestions, generatedMeaningQuestions, QuizQuestion, LISTENING } from "@/lib/data/extras";
import { speakGerman } from "@/components/voice";
import { Volume2 } from "lucide-react";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const SKILLS = [
  { id: "vocab", label: "مفردات" },
  { id: "grammar", label: "قواعد" },
  { id: "listening", label: "استماع" },
] as const;

type Phase = "pick" | "running" | "result" | "levelup-result";

function buildQuestions(level: string, skill: string): QuizQuestion[] {
  if (skill === "vocab") {
    const meanings = generatedMeaningQuestions(level, 5);
    const articles = generatedArticleQuestions(level, 3);
    return [...meanings, ...articles].sort(() => Math.random() - 0.5);
  }
  if (skill === "listening") {
    const dialogues = LISTENING.filter((l) => l.level === level || (level !== "A1" && l.level === "A1"));
    const qs = dialogues.flatMap((d) => d.questions.map((q) => ({ ...q, listenText: d.lines.map((x) => x.de).join(" ") } as any)));
    return qs.sort(() => Math.random() - 0.5).slice(0, 5);
  }
  return (QUIZ_BANK[level] ?? QUIZ_BANK.A1).slice(0, 8);
}

export default function TestsPage() {
  const [level, setLevel] = useState<string>("A1");
  const [skill, setSkill] = useState<string>("vocab");
  const [phase, setPhase] = useState<Phase>("pick");
  const [questions, setQuestions] = useState<(QuizQuestion & { listenText?: string })[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [levelupSections, setLevelupSections] = useState<{ skill: string; pct: number }[]>([]);
  const [levelupMsg, setLevelupMsg] = useState<string | null>(null);
  const [examLevel, setExamLevel] = useState<string>("A1");
  const [examSection, setExamSection] = useState(0);

  const q = questions[idx];

  function start(lvl: string, sk: string, isExam = false, sectionIdx = 0) {
    const qs = buildQuestions(lvl, sk);
    setQuestions(qs);
    setIdx(0);
    setScore(0);
    setPicked(null);
    setPhase("running");
    if (isExam) setExamSection(sectionIdx);
  }

  async function choose(i: number) {
    if (picked !== null || !q) return;
    setPicked(i);
    const gained = i === q.answer ? 1 : 0;
    const newScore = score + gained;
    setScore(newScore);
    setTimeout(async () => {
      if (idx + 1 >= questions.length) {
        const total = questions.length;
        const pct = Math.round((newScore / total) * 100);
        if (phase === "running" && levelupSections.length > 0 || examLevel === level && levelupSections.length > 0) {
          // continue exam flow
        }
        await fetch("/api/quiz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ level: examLevel || level, skill, score: newScore, total }) });
        if (examLevel && phase === "running" && isExamMode) {
          const newSections = [...levelupSections, { skill, pct }];
          setLevelupSections(newSections);
          if (examSection + 1 < SKILLS.length) {
            const nextSkill = SKILLS[examSection + 1].id;
            setSkill(nextSkill);
            start(examLevel, nextSkill, true, examSection + 1);
            return;
          } else {
            const res = await fetch("/api/levelup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ level: examLevel }) }).then((r) => r.json());
            setLevelupMsg(res.ok ? `مبروك! مستواك اتحدث لـ ${examLevel} رسميًا.` : res.error ?? "لسه محتاج شوية شغل");
            setPhase("levelup-result");
            return;
          }
        }
        if (levelupSections.length === 0) {
          await fetch("/api/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task: "quiz", minutes: 5 }) });
        }
        setPhase("result");
      } else {
        setIdx(idx + 1);
        setPicked(null);
      }
    }, 900);
  }

  const [isExamMode, setIsExamMode] = useState(false);

  function startExam(lvl: string) {
    setExamLevel(lvl);
    setIsExamMode(true);
    setLevelupSections([]);
    setSkill(SKILLS[0].id);
    setLevel(lvl);
    start(lvl, SKILLS[0].id, true, 0);
  }

  const currentQ = q;
  const examProgressLabel = useMemo(() => (isExamMode ? `قسم ${examSection + 1} من 3: ${SKILLS[examSection]?.label ?? ""}` : null), [isExamMode, examSection]);

  return (
    <ClientShell>
      <div className="mb-7">
        <h1 className="flex items-center gap-3 text-2xl font-black">
          <ClipboardCheck className="text-gold" /> الاختبارات وتحديد المستوى
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
          قياس حقيقي للمهارات: مفردات، قواعد، واستماع. الترقية لمستوى جديد محتاجة ٧٠٪ في الأقسام التلاتة.
        </p>
      </div>

      {phase === "pick" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="card p-6">
            <h3 className="mb-4 font-extrabold">اختبار مهارة سريع</h3>
            <div className="mb-4">
              <div className="mb-2 text-xs text-muted">المستوى</div>
              <div className="flex flex-wrap gap-1.5 rounded-2xl border border-line bg-coal p-1.5">
                {LEVELS.map((l) => (
                  <button key={l} onClick={() => setLevel(l)} className={`german rounded-xl px-4 py-1.5 text-xs font-bold ${level === l ? "bg-gold text-ink" : "text-muted"}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <div className="mb-2 text-xs text-muted">المهارة</div>
              <div className="flex gap-1.5 rounded-2xl border border-line bg-coal p-1.5">
                {SKILLS.map((s) => (
                  <button key={s.id} onClick={() => setSkill(s.id)} className={`flex-1 rounded-xl px-4 py-1.5 text-xs font-bold ${skill === s.id ? "bg-gold text-ink" : "text-muted"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => { setIsExamMode(false); setExamLevel(""); setLevelupSections([]); start(level, skill); }} className="btn-gold w-full py-3 text-sm">
              ابدأ الاختبار
            </button>
          </div>

          <div className="card border-gold/25 p-6">
            <h3 className="mb-2 flex items-center gap-2 font-extrabold text-gold">
              <Award size={18} /> اختبار ترقية المستوى
            </h3>
            <p className="mb-5 text-[13px] leading-6 text-muted">
              عايز تثبت إنك وصلت مستوى جديد؟ عدّي التلات أقسام (مفردات + قواعد + استماع) بـ ٧٠٪ لكل قسم.
              مش بس إتمام دروس — قياس مهارات حقيقي زي معادلة رسمية صغيرة.
            </p>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <button key={l} onClick={() => startExam(l)} className="btn-ghost german px-5 py-2 text-xs font-bold hover:border-gold/60">
                  اختبار {l}
                </button>
              ))}
            </div>
            <div className="mt-5 flex items-start gap-2 rounded-xl bg-white/[0.03] p-4 text-[12px] leading-6 text-muted">
              <AlertTriangle size={15} className="mt-0.5 shrink-0 text-gold" />
              النتيجة بتتحفظ وبتأثر على خطتك وعلى اتجاهات الأسبوع الجاي — فخد وقتك واتركز.
            </div>
          </div>
        </div>
      )}

      {phase === "running" && currentQ && (
        <div className="card mx-auto max-w-2xl p-7">
          <div className="mb-1 flex items-center justify-between text-xs text-muted">
            <span>سؤال {idx + 1} من {questions.length}</span>
            {examProgressLabel && <span className="font-bold text-gold">{examProgressLabel}</span>}
          </div>
          <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div className="h-full bg-gold transition-all" style={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
          </div>

          {currentQ.listenText && (
            <button onClick={() => speakGerman(currentQ.listenText!, 0.85)} className="btn-ghost mb-5 flex w-full items-center justify-center gap-2 py-3 text-sm">
              <Volume2 size={16} className="text-gold" /> اسمع المحادثة الأول وجاوب
            </button>
          )}

          <div className={`mb-2 ${/[A-Za-zÄÖÜäöüß]/.test(currentQ.q) ? "german text-left" : ""}`} dir={/[A-Za-zÄÖÜäöüß]/.test(currentQ.q) ? "ltr" : "rtl"}>
            <h3 className="text-lg font-extrabold leading-8">{currentQ.q}</h3>
          </div>
          {currentQ.qAr && <p className="mb-5 text-xs text-muted">{currentQ.qAr}</p>}
          {!currentQ.qAr && <div className="mb-5" />}
          <div className="grid gap-2">
            {currentQ.options.map((o, i) => {
              let cls = "btn-ghost";
              if (picked !== null) {
                if (i === currentQ.answer) cls = "border-mint/60 bg-mint/10 text-mint";
                else if (i === picked) cls = "border-germanred/60 bg-germanred/10 text-germanred";
                else cls = "opacity-40";
              }
              const isGerman = /^[A-Za-zÄÖÜäöüß\s.,!?·:'-]+$/.test(o);
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  className={`rounded-xl border px-5 py-3.5 text-sm font-bold transition-all ${cls} ${isGerman ? "german text-left" : ""}`}
                  dir={isGerman ? "ltr" : "rtl"}
                  disabled={picked !== null}
                >
                  <span className="flex items-center gap-2">
                    {picked !== null && i === currentQ.answer && <CheckCircle2 size={16} />}
                    {picked !== null && i === picked && i !== currentQ.answer && <XCircle size={16} />}
                    {o}
                  </span>
                </button>
              );
            })}
          </div>
          {picked !== null && currentQ.explainAr && (
            <p className="mt-4 rounded-xl bg-gold/10 px-4 py-3 text-[13px] leading-6 text-gold animate-reveal">{currentQ.explainAr}</p>
          )}
        </div>
      )}

      {phase === "result" && (
        <div className="card mx-auto max-w-lg p-10 text-center">
          <div className={`german text-6xl font-bold ${score / questions.length >= 0.7 ? "text-mint" : "text-germanred"}`}>
            {Math.round((score / questions.length) * 100)}%
          </div>
          <p className="mt-4 text-sm text-muted">
            {score / questions.length >= 0.85
              ? "ممتاز! مستوى عالي جدًا في القسم ده."
              : score / questions.length >= 0.7
              ? "عدّيت! كويس أوي — ثبت النتيجة بتمرين شوية."
              : score / questions.length >= 0.5
              ? "قريب! راجع النقاط اللي غلطت فيها وجرب تاني."
              : "لسه بدري — ارجع للدروس والكلمات الأول وارجع هنا."}
          </p>
          <div className="mt-3 text-xs text-muted german">{score} / {questions.length}</div>
          <button onClick={() => setPhase("pick")} className="btn-gold mt-7 px-8 py-3 text-sm">اختبار تاني</button>
        </div>
      )}

      {phase === "levelup-result" && (
        <div className="card mx-auto max-w-lg p-10 text-center">
          <Award className="mx-auto mb-4 text-gold" size={44} />
          <h3 className="text-lg font-extrabold">{levelupMsg}</h3>
          <div className="mt-6 space-y-2">
            {levelupSections.map((s) => (
              <div key={s.skill} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-2.5 text-sm">
                <span>{SKILLS.find((x) => x.id === s.skill)?.label}</span>
                <span className={`german font-bold ${s.pct >= 70 ? "text-mint" : "text-germanred"}`}>{s.pct}%</span>
              </div>
            ))}
          </div>
          <button onClick={() => { setPhase("pick"); setIsExamMode(false); setLevelupSections([]); }} className="btn-gold mt-8 px-8 py-3 text-sm">
            تمام
          </button>
        </div>
      )}
    </ClientShell>
  );
}

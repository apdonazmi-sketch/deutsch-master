"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Check, Loader2, Send, Sparkles, TrendingUp, Target, Brain, Clock } from "lucide-react";

type Step = {
  key: string;
  question: string;
  type: "single" | "multi" | "number" | "multiWithText";
  options?: { v: string; l: string }[];
  minSelections?: number;
};

const STEPS: Step[] = [
  {
    key: "goal", type: "single",
    question: "أهلًا بيك! أنا كوتش بتاعك للألماني. قبل ما نبدأ أي درس، عايز أفهمك كويس. في الأول: ليه عايز تتعلم ألماني؟",
    options: [
      { v: "travel_work", l: "السفر والعمل في ألمانيا" },
      { v: "study", l: "الدراسة أو Ausbildung" },
      { v: "migrate", l: "الهجرة والاستقرار" },
      { v: "german_company", l: "العمل في شركة ألمانية" },
      { v: "communicate", l: "التواصل مع الألمان" },
      { v: "certificate", l: "الحصول على شهادة لغة" },
      { v: "other", l: "أسباب تانية" },
    ],
  },
  {
    key: "currentLevel", type: "single",
    question: "جميل جدًا. طب قولي بصراحة: مستواك الحالي في الألماني إيه؟",
    options: [
      { v: "NONE", l: "مش عارف أي حاجة خالص" },
      { v: "SOME", l: "عارف كلمات بسيطة" },
      { v: "A1", l: "مبتدئ A1" },
      { v: "A2", l: "A2" },
      { v: "B1", l: "B1" },
      { v: "B2", l: "B2" },
      { v: "C1", l: "C1" },
      { v: "C2", l: "C2" },
    ],
  },
  {
    key: "targetLevel", type: "single",
    question: "وإيه هدفك الكبير؟ عايز توصل لأنهي مستوى؟",
    options: [
      { v: "A1", l: "A1" }, { v: "A2", l: "A2" }, { v: "B1", l: "B1" },
      { v: "B2", l: "B2" }, { v: "C1", l: "C1" }, { v: "C2", l: "C2" },
    ],
  },
  { key: "months", type: "number", question: "خلال كام شهر تقريبًا حابب توصل للهدف ده؟ (اكتب رقم)" },
  {
    key: "dailyMinutes", type: "single",
    question: "قد إيه وقت تقدر تديله كل يوم؟",
    options: [
      { v: "15", l: "15 دقيقة" }, { v: "30", l: "30 دقيقة" }, { v: "60", l: "ساعة" },
      { v: "120", l: "ساعتين" }, { v: "150", l: "أكتر من ساعتين" },
    ],
  },
  {
    key: "styles", type: "multi",
    question: "بتحب تتعلم إزاي؟ اختار اللي يعجبك (تقدر تختار أكتر من حاجة):",
    options: [
      { v: "conversation", l: "المحادثة والتحدث" },
      { v: "listening", l: "الاستماع والتكرار" },
      { v: "visual", l: "الصور والرسومات" },
      { v: "games", l: "الألعاب والتحديات" },
      { v: "stories", l: "المواقف والقصص" },
      { v: "reading", l: "القراءة والكتابة" },
      { v: "mixed", l: "خليط من كل الطرق" },
    ],
  },
  {
    key: "topics", type: "multiWithText",
    question: "تحب نتكلم عن إيه في دروسنا؟ اختار المواضيع اللي تهمك:",
    options: [
      { v: "daily", l: "الحياة اليومية" },
      { v: "work", l: "العمل والوظائف" },
      { v: "travel", l: "السفر والمطار" },
      { v: "food", l: "المطاعم والتسوق" },
      { v: "tech", l: "التكنولوجيا والـ AI" },
      { v: "sport", l: "الرياضة" },
      { v: "social", l: "العلاقات الاجتماعية" },
      { v: "germany", l: "الحياة في ألمانيا" },
    ],
  },
  {
    key: "fears", type: "multi",
    question: "آخر نقطة صراحة: إيه أكتر حاجة مقلقاك في تعلم الألماني؟ (متحرمش نفسك - اختار اللي بيحصل فعلًا)",
    options: [
      { v: "pronunciation", l: "صعوبة النطق" },
      { v: "grammar", l: "القواعد" },
      { v: "understanding", l: "مش هفهم الألمان" },
      { v: "sentences", l: "مش بعرف أعمل جمل" },
      { v: "forgetting", l: "بنسى الكلمات" },
      { v: "speaking_fear", l: "الخوف من الكلام" },
    ],
  },
  {
    key: "dialect", type: "single",
    question: "تحب أشرحلك بأيه؟",
    options: [
      { v: "egyptian", l: "العربية المصرية" },
      { v: "fusha", l: "العربية الفصحى" },
    ],
  },
  {
    key: "transition", type: "single",
    question: "وفي المحادثات: تحب أتكلم معاك ألماني تدريجيًا، ولا أشرح عربي الأول وبعدين ننتقل للألماني؟",
    options: [
      { v: "gradual", l: "ألماني تدريجيًا من الأول" },
      { v: "arabic_first", l: "اشرحلي عربي الأول" },
    ],
  },
];

type Msg = { from: "bot" | "user"; text: string };
type Report = {
  goalLabel: string; currentLevelLabel: string; targetLevelLabel: string;
  estimate: { totalHours: number; monthsOptimistic: number; monthsRealistic: number; feasible: boolean; note: string };
  newWordsPerDay: number; strengths: string[]; weaknesses: string[]; topics: string[];
  milest: { level: string; fromNow: string }[]; weeklyShape: string[]; honestNote: string;
};

export default function OnboardingClient({ userName }: { userName: string }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [multiSel, setMultiSel] = useState<string[]>([]);
  const [numVal, setNumVal] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [phase, setPhase] = useState<"chat" | "generating" | "report">("chat");
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const step = STEPS[stepIdx];

  useEffect(() => {
    if (stepIdx === 0 && msgs.length === 0) {
      setMsgs([{ from: "bot", text: STEPS[0].question }]);
    }
  }, [stepIdx, msgs.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, phase]);

  function pushUser(text: string) {
    setMsgs((m) => [...m, { from: "user", text }]);
  }

  function advance(nextAnswers: Record<string, any>) {
    const nextIdx = stepIdx + 1;
    if (nextIdx >= STEPS.length) {
      submit(nextAnswers);
      return;
    }
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "bot", text: STEPS[nextIdx].question }]);
      setStepIdx(nextIdx);
      setMultiSel([]);
      setNumVal("");
    }, 500);
  }

  function chooseSingle(v: string, label: string) {
    if (phase !== "chat") return;
    pushUser(label);
    const nextAnswers = { ...answers, [step.key]: v };
    setAnswers(nextAnswers);
    advance(nextAnswers);
  }

  function toggleMulti(v: string) {
    setMultiSel((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
  }

  function confirmMulti() {
    if (multiSel.length === 0) return;
    const labels = STEPS[stepIdx].options!.filter((o) => multiSel.includes(o.v)).map((o) => o.l);
    let finalSel = [...multiSel];
    if (step.type === "multiWithText" && customTopic.trim()) {
      finalSel.push("other");
      labels.push(customTopic.trim());
    }
    pushUser(labels.join("، "));
    const nextAnswers = { ...answers, [step.key]: finalSel, ...(customTopic.trim() && step.type === "multiWithText" ? { customGoal: customTopic.trim() } : {}) };
    setAnswers(nextAnswers);
    advance(nextAnswers);
  }

  function confirmNumber() {
    const n = Number(numVal);
    if (!n || n < 1 || n > 120) return;
    pushUser(`${n} شهر`);
    const nextAnswers = { ...answers, months: n };
    setAnswers(nextAnswers);
    advance(nextAnswers);
  }

  function submit(finalAnswers: Record<string, any>) {
    setPhase("generating");
    setError(null);
    fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal: finalAnswers.goal,
        currentLevel: finalAnswers.currentLevel,
        targetLevel: finalAnswers.targetLevel,
        months: finalAnswers.months,
        dailyMinutes: Number(finalAnswers.dailyMinutes),
        styles: finalAnswers.styles ?? [],
        topics: finalAnswers.topics ?? [],
        fears: finalAnswers.fears ?? [],
        dialect: finalAnswers.dialect,
        transition: finalAnswers.transition,
        customGoal: finalAnswers.customGoal,
      }),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error);
        return r.json();
      })
      .then((d) => {
        setReport(d.report);
        setPhase("report");
      })
      .catch((e) => {
        setError(e.message ?? "حصلت مشكلة");
        setPhase("chat");
      });
  }

  if (phase === "report" && report) {
    return (
      <div className="mx-auto min-h-screen max-w-4xl px-5 py-14">
        <div className="mb-10 text-center animate-reveal">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-4 py-1.5 text-xs font-bold text-gold">
            <Sparkles size={14} /> تقريرك الشخصي جاهز
          </span>
          <h1 className="text-3xl font-black sm:text-4xl">خطة {userName} لإتقان الألمانية</h1>
          <p className="mt-2 text-sm text-muted">الهدف: {report.goalLabel}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Target, t: "مستواك دلوقتي", v: report.currentLevelLabel },
            { icon: TrendingUp, t: "هدفك", v: report.targetLevelLabel },
            { icon: Clock, t: "الساعات المقدرة", v: `~${report.estimate.totalHours} ساعة` },
            { icon: Brain, t: "كلمات يومية", v: `${report.newWordsPerDay} كلمات` },
          ].map((c) => (
            <div key={c.t} className="card p-5 text-center">
              <c.icon className="mx-auto mb-2 text-gold" size={20} />
              <div className="text-xs text-muted">{c.t}</div>
              <div className="german mt-1 text-lg font-bold">{c.v}</div>
            </div>
          ))}
        </div>

        <div className="card mt-4 p-6">
          <h3 className="mb-2 font-extrabold text-gold">التقدير الزمني (الصادق)</h3>
          <p className="text-sm leading-7 text-cream/90">
            بإيقاعك الحالي: حوالي <span className="german font-bold text-gold">{report.estimate.monthsOptimistic}</span> شهر للهدف،
            وبشكل واقعي مع ظروف الحياة: <span className="german font-bold text-gold">{report.estimate.monthsRealistic}</span> شهر.
          </p>
          <p className="mt-2 text-sm text-muted">{report.estimate.note}</p>
          {report.milest.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {report.milest.map((m) => (
                <span key={m.level} className="rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs">
                  <span className="german font-bold text-gold">{m.level}</span> — {m.fromNow}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="mb-4 font-extrabold text-mint">نقاط قوتك</h3>
            <ul className="space-y-3">
              {report.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] leading-6 text-cream/85">
                  <Check size={16} className="mt-1 shrink-0 text-mint" /> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <h3 className="mb-4 font-extrabold text-germanred">اللي هنشتغل عليه</h3>
            <ul className="space-y-3">
              {report.weaknesses.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] leading-6 text-cream/85">
                  <Target size={16} className="mt-1 shrink-0 text-germanred" /> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card mt-4 p-6">
          <h3 className="mb-4 font-extrabold">شكل أسبوعك التعليمي</h3>
          <ul className="space-y-3">
            {report.weeklyShape.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-cream/85">
                <span className="german flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-[11px] font-bold text-gold">{i + 1}</span>
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-5 rounded-xl border border-gold/25 bg-gold/5 px-4 py-3 text-[13px] leading-6 text-gold">{report.honestNote}</p>
        </div>

        <button onClick={() => window.location.assign("/dashboard")} className="btn-gold mx-auto mt-10 flex items-center gap-2 px-10 py-4 text-base">
          ابدأ خطة يومك
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-10">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-gold to-golddeep text-ink">
          <Bot size={20} />
        </span>
        <div>
          <div className="font-extrabold">محادثة التقييم الذكي</div>
          <div className="text-xs text-muted">خطوة {Math.min(stepIdx + 1, STEPS.length)} من {STEPS.length}</div>
        </div>
        <div className="ms-auto german text-xs text-gold">DEUTSCH MASTER AI</div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div className="h-full rounded-full bg-gradient-to-l from-gold to-golddeep transition-all duration-500" style={{ width: `${((stepIdx + 1) / STEPS.length) * 100}%` }} />
      </div>

      <div ref={scrollRef} className="mt-6 flex-1 space-y-4 overflow-y-auto pb-4" style={{ maxHeight: "52vh" }}>
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-7 animate-reveal ${
                m.from === "user" ? "bg-gold text-ink font-bold" : "card"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {phase === "generating" && (
          <div className="flex justify-end">
            <div className="card flex items-center gap-3 rounded-2xl px-5 py-4 text-sm text-gold">
              <Loader2 size={18} className="animate-spin" />
              بحلل إجاباتك وبيبني خطتك الشخصية...
            </div>
          </div>
        )}
      </div>

      {phase === "chat" && step && (
        <div className="mt-auto space-y-4 border-t border-line/60 pt-5">
          {step.type === "single" && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {step.options!.map((o) => (
                <button
                  key={o.v}
                  type="button"
                  onClick={() => chooseSingle(o.v, o.l)}
                  className="btn-ghost px-4 py-3 text-start text-sm font-bold"
                >
                  {o.l}
                </button>
              ))}
            </div>
          )}

          {(step.type === "multi" || step.type === "multiWithText") && (
            <>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {step.options!.map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => toggleMulti(o.v)}
                    className={`rounded-full border px-4 py-2.5 text-xs font-bold transition-all ${
                      multiSel.includes(o.v) ? "border-gold bg-gold text-ink" : "border-line text-muted hover:border-gold/50"
                    }`}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
              {step.type === "multiWithText" && (
                <input
                  className="input"
                  placeholder="عندك اهتمام تاني؟ اكتبه هنا (اختياري)"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                />
              )}
              <button type="button" onClick={confirmMulti} disabled={multiSel.length === 0} className="btn-gold w-full py-3 text-sm disabled:opacity-40">
                كمّل
              </button>
            </>
          )}

          {step.type === "number" && (
            <div className="flex gap-3">
              <input
                className="input text-center text-lg font-bold"
                inputMode="numeric"
                placeholder="مثال: 6"
                value={numVal}
                onChange={(e) => setNumVal(e.target.value.replace(/[^0-9]/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && confirmNumber()}
              />
              <button type="button" onClick={confirmNumber} className="btn-gold shrink-0 px-6 py-3">
                <Send size={18} />
              </button>
            </div>
          )}
          {error && <p className="text-center text-sm text-germanred">{error}</p>}
        </div>
      )}
    </div>
  );
}

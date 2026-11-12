"use client";

import { useMemo, useRef, useState } from "react";
import { Headphones, Play, CheckCircle2, Loader2, SkipForward, Eye, EyeOff } from "lucide-react";
import { LISTENING, ListeningDialogue } from "@/lib/data/extras";
import { speakGerman, stopSpeaking } from "@/components/voice";
import AppShellWrapper from "@/components/ClientShell";

type Phase = "idle" | "playing" | "quiz" | "result";

export default function ListeningPage() {
  const [levelFilter, setLevelFilter] = useState<string>("A1");
  const [dialogue, setDialogue] = useState<ListeningDialogue | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentLine, setCurrentLine] = useState(-1);
  const [showText, setShowText] = useState(true);
  const [answers, setAnswers] = useState<number[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [rate, setRate] = useState(0.85);
  const stopRef = useRef(false);

  const dialogues = useMemo(() => LISTENING.filter((l) => l.level === levelFilter), [levelFilter]);

  async function playDialogue(d: ListeningDialogue) {
    stopRef.current = false;
    setDialogue(d);
    setPhase("playing");
    for (let i = 0; i < d.lines.length; i++) {
      if (stopRef.current) break;
      setCurrentLine(i);
      await speakGerman(d.lines[i].de, rate);
      if (stopRef.current) break;
      await new Promise((r) => setTimeout(r, 450));
    }
    if (!stopRef.current) startQuiz(d);
  }

  function startQuiz(d: ListeningDialogue) {
    setPhase("quiz");
    setQIdx(0);
    setAnswers([]);
    setScore(0);
  }

  function answer(idx: number) {
    if (!dialogue) return;
    const q = dialogue.questions[qIdx];
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    const gained = idx === q.answer ? 1 : 0;
    const newScore = score + gained;
    setScore(newScore);
    if (qIdx + 1 < dialogue.questions.length) {
      setQIdx(qIdx + 1);
    } else {
      setPhase("result");
      fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: dialogue.level, skill: "listening", score: newScore, total: dialogue.questions.length }),
      });
      fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "listening", minutes: dialogue.lines.length + 2 }),
      });
    }
  }

  const q = dialogue?.questions[qIdx];

  return (
    <AppShellWrapper>
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-2xl font-black">
          <Headphones className="text-gold" /> تدريب الاستماع
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
          اسمع محادثات حقيقية بمستواك — الأول ورا النص، وبعدين جرب تسمع من غير ما تبص. بعدها اختبارات فهم قصيرة.
        </p>
      </div>

      {!dialogue && (
        <>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="flex rounded-full border border-line bg-coal p-1">
              {["A1", "A2", "B1"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevelFilter(l)}
                  className={`german rounded-full px-5 py-1.5 text-xs font-bold ${levelFilter === l ? "bg-gold text-ink" : "text-muted"}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-xs text-muted">
              سرعة الصوت
              <input type="range" min="0.6" max="1.1" step="0.05" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-24 accent-[#ffc53d]" dir="ltr" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {dialogues.map((d) => (
              <button key={d.id} onClick={() => playDialogue(d)} className="card group p-6 text-start transition-all hover:border-gold/40">
                <div className="mb-3 flex items-center justify-between">
                  <span className="german rounded-full bg-gold/10 px-3 py-1 text-[11px] font-bold text-gold">{d.level}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold transition-transform group-hover:scale-110">
                    <Play size={16} />
                  </span>
                </div>
                <h3 className="font-extrabold">{d.titleAr}</h3>
                <p className="mt-1 text-xs text-muted">{d.lines.length} جملة · {d.questions.length} أسئلة فهم</p>
              </button>
            ))}
          </div>
        </>
      )}

      {dialogue && phase === "playing" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { stopRef.current = true; stopSpeaking(); setDialogue(null); setPhase("idle"); setCurrentLine(-1); }}
              className="btn-ghost px-4 py-2 text-xs"
            >
              وقّف
            </button>
            <button onClick={() => setShowText(!showText)} className="btn-ghost flex items-center gap-2 px-4 py-2 text-xs">
              {showText ? <EyeOff size={14} /> : <Eye size={14} />} {showText ? "اخفي النص" : "أظهر النص"}
            </button>
            <button onClick={() => { stopRef.current = true; stopSpeaking(); startQuiz(dialogue); }} className="btn-ghost ms-auto flex items-center gap-2 px-4 py-2 text-xs">
              <SkipForward size={14} /> للأسئلة على طول
            </button>
          </div>
          <div className="space-y-3">
            {dialogue.lines.map((l, i) => (
              <div
                key={i}
                className={`card flex items-start gap-4 p-4 transition-all ${i === currentLine ? "border-gold/50 bg-gold/5" : i < currentLine ? "opacity-60" : "opacity-30"}`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10 text-[11px] font-bold text-gold">
                  {l.speaker.slice(0, 2)}
                </span>
                <div className="min-w-0">
                  {showText ? (
                    <>
                      <div className="german text-sm font-semibold leading-6" dir="ltr">{l.de}</div>
                      <div className="mt-1 text-xs text-muted">{l.ar}</div>
                    </>
                  ) : (
                    <div className="text-sm text-muted">· · ·</div>
                  )}
                </div>
                {i === currentLine && (
                  <span className="ms-auto flex items-end gap-[3px]" aria-hidden>
                    {[0, 1, 2].map((b) => (
                      <span key={b} className="speaking-bar w-[3px] rounded bg-gold" style={{ height: `${8 + b * 5}px`, animationDelay: `${b * 0.15}s` }} />
                    ))}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {dialogue && phase === "quiz" && q && (
        <div className="card mx-auto max-w-2xl p-7">
          <div className="mb-1 text-xs text-muted">سؤال {qIdx + 1} من {dialogue.questions.length}</div>
          <h3 className="mb-6 text-lg font-extrabold leading-8">{q.q}</h3>
          <div className="grid gap-2">
            {q.options.map((o, i) => (
              <button key={i} onClick={() => answer(i)} className="btn-ghost px-5 py-3.5 text-start text-sm font-bold">
                {o}
              </button>
            ))}
          </div>
        </div>
      )}

      {dialogue && phase === "result" && (
        <div className="card mx-auto max-w-2xl p-8 text-center">
          <CheckCircle2 className="mx-auto mb-3 text-mint" size={40} />
          <div className="german text-4xl font-bold text-gold">{score} / {dialogue.questions.length}</div>
          <p className="mt-3 text-sm text-muted">
            {score === dialogue.questions.length ? "فهم مثالي! جرب تسمع من غير نص المرة الجاية." : score >= 2 ? "فهم كويس — اسمعها تاني بسرعة أعلى." : "وارع بالك: شغّلها تاني واقرأ النص مع الصوت الأول."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => { setDialogue(null); setPhase("idle"); }} className="btn-gold px-6 py-2.5 text-sm">محادثة تانية</button>
            <button onClick={() => playDialogue(dialogue)} className="btn-ghost px-6 py-2.5 text-sm">اسمعها تاني</button>
          </div>
        </div>
      )}
    </AppShellWrapper>
  );
}

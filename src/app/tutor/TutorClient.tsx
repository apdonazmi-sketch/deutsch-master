"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Send, Loader2, GraduationCap, MessageCircle, MapPin, Mic, Volume2, AlertCircle,
  CheckCircle2, RotateCcw, ChevronLeft, Languages, Gauge, Sparkles,
} from "lucide-react";
import { useSpeech, speakGerman, speakReply, stopSpeaking, SpeakButton, type VoiceMode } from "@/components/voice";
import { PRONUNCIATION, PronunciationDrill } from "@/lib/data/extras";
import { SCENARIOS } from "@/lib/data/scenarios";

type Msg = { role: "user" | "assistant"; german: string; arabic?: string | null; correction?: string | null; tip?: string | null };
type PronounceResult = {
  score: number;
  words: { target: string; heard: string | null; ok: boolean; sim: number }[];
  verdictAr: string;
  tipAr: string;
  approximate: boolean;
};

export default function TutorClient({
  initialMode,
  initialScenario,
  level,
}: {
  initialMode: "free" | "scenario" | "pronounce";
  initialScenario: string | null;
  level: string;
}) {
  const [mode, setMode] = useState<"free" | "scenario" | "pronounce">(initialMode);
  const [scenarioId, setScenarioId] = useState<string | null>(initialScenario);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [inputLang, setInputLang] = useState<"de-DE" | "ar-EG">("de-DE");
  const [loading, setLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>("both");
  const [showArabic, setShowArabic] = useState(true);
  const [rate, setRate] = useState(level === "NONE" || level === "SOME" || level === "A1" ? 0.75 : 0.95);
  const [userTurns, setUserTurns] = useState(0);
  const [done, setDone] = useState(false);
  const [mistakes, setMistakes] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const countedRef = useRef(false);

  // pronunciation mode state
  const drills = useMemo(() => {
    const lvl = ["B1", "B2", "C1", "C2"].includes(level) ? level : ["NONE", "SOME"].includes(level) ? "A1" : level;
    return PRONUNCIATION.filter((p) => p.level === lvl || (lvl !== "A1" && p.level === "A1")).slice(0, 8);
  }, [level]);
  const [drillIdx, setDrillIdx] = useState(0);
  const [pResult, setPResult] = useState<PronounceResult | null>(null);
  const [pListening, setPListening] = useState(false);
  const [pHeard, setPHeard] = useState("");
  const { listen } = useSpeech();

  const drill: PronunciationDrill | undefined = drills[drillIdx % Math.max(drills.length, 1)];

  useEffect(() => {
    stopSpeaking();
    if (mode === "scenario" && scenarioId && msgs.length === 0) {
      send("__start__", "scenario", scenarioId);
    }
    if (mode === "free" && msgs.length === 0) {
      setMsgs([
        {
          role: "assistant",
          german: level === "NONE" || level === "SOME" || level === "A1"
            ? "Hallo! Ich bin Frau Schneider. Schön, dich kennenzulernen! Wie heißt du?"
            : "Hallo! Freut mich, dich zu sehen. Wie läuft dein Deutschlernen heute?",
          arabic: level === "NONE" || level === "SOME" || level === "A1"
            ? "أهلًا! أنا مدام شنايدر. مبسوطة إني أعرفك! اسمك إيه؟ (تقدر تكتب بالعربي برضه)"
            : "أهلًا! مبسوطة إنك هنا. إيه أخبار تعلمك للألماني النهاردة؟",
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, scenarioId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  async function send(text: string, m = mode, sId = scenarioId) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    if (trimmed !== "__start__") setMsgs((arr) => [...arr, { role: "user", german: trimmed }]);
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, mode: m, scenarioId: sId, conversationId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setConversationId(data.conversationId);
      const r = data.reply;
      setMsgs((arr) => [...arr, { role: "assistant", german: r.german, arabic: r.arabic, correction: r.correction, tip: r.tip }]);
      if (autoSpeak) speakReply(r.german, r.arabic, rate, voiceMode);
      if (trimmed !== "__start__") {
        setUserTurns((n) => {
          const next = n + 1;
          if (next >= 3 && !countedRef.current) {
            countedRef.current = true;
            fetch("/api/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task: "conversation", minutes: 10 }) });
            fetch("/api/activity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "speaking", value: 1 }) });
          }
          return next;
        });
      }
      if (r.scenarioDone) {
        setDone(true);
        setMistakes(r.mistakes ?? []);
        fetch("/api/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task: "mission", minutes: 7 }) });
      }
    } catch {
      setMsgs((arr) => [...arr, { role: "assistant", german: "Entschuldigung, ein Fehler ist passiert.", arabic: "حصلت مشكلة - جرب تاني لو سمحت." }]);
    } finally {
      setLoading(false);
    }
  }

  async function pronounceAttempt() {
    if (!drill) return;
    setPListening(true);
    setPResult(null);
    setPHeard("");
    try {
      const text = await listen("de-DE");
      setPHeard(text);
      const res = await fetch("/api/pronounce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: drill.de, transcript: text }),
      });
      const data = await res.json();
      if (res.ok) setPResult(data);
      if (drillIdx === 0) fetch("/api/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task: "pronunciation", minutes: 5 }) });
    } catch {
      setPHeard("__error__");
    } finally {
      setPListening(false);
    }
  }

  const activeScenario = scenarioId ? SCENARIOS.find((s) => s.id === scenarioId) : null;

  return (
    <div className="space-y-6">
      {/* header + mode tabs */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-black">المدرس الصوتي</h1>
        <div className="ms-auto flex rounded-full border border-line bg-coal p-1">
          {(
            [
              { id: "free", label: "محادثة حرة", icon: MessageCircle },
              { id: "scenario", label: "مهمة حقيقية", icon: MapPin },
              { id: "pronounce", label: "تمرين النطق", icon: Mic },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => { setMode(t.id); setMsgs([]); setConversationId(null); setDone(false); if (t.id !== "scenario") setScenarioId(null); }}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                mode === t.id ? "bg-gold text-ink" : "text-muted hover:text-cream"
              }`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* controls */}
      <div className="card flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3 text-xs">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={autoSpeak} onChange={(e) => setAutoSpeak(e.target.checked)} className="accent-[#ffc53d]" />
          <Volume2 size={14} className="text-gold" /> صوت تلقائي للردود
        </label>
        <label className="flex items-center gap-2">
          <Languages size={14} className="text-gold" /> صوت المدرسة
          <select
            value={voiceMode}
            onChange={(e) => setVoiceMode(e.target.value as VoiceMode)}
            className="rounded-lg border border-line bg-coal px-2 py-1 text-xs text-cream"
          >
            <option value="both">ألماني + مصري</option>
            <option value="de">ألماني بس</option>
            <option value="ar">مصري بس</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showArabic} onChange={(e) => setShowArabic(e.target.checked)} className="accent-[#ffc53d]" />
          <Languages size={14} className="text-gold" /> الترجمة المصرية
        </label>
        <label className="flex items-center gap-2">
          <Gauge size={14} className="text-gold" /> سرعة الكلام
          <input type="range" min="0.5" max="1.2" step="0.05" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-28 accent-[#ffc53d]" dir="ltr" />
          <span className="german text-muted">{rate <= 0.75 ? "بطيء" : rate <= 1 ? "طبيعي" : "سريع"}</span>
        </label>
      </div>

      {/* ================= SCENARIO PICKER ================= */}
      {mode === "scenario" && !scenarioId && (
        <div className="grid gap-3 sm:grid-cols-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => { setScenarioId(s.id); setMsgs([]); setConversationId(null); }}
              className="card group p-5 text-start transition-all hover:border-gold/40"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="german rounded-full bg-gold/10 px-2.5 py-0.5 text-[10px] font-bold text-gold">{s.level}</span>
                <span className="german text-[11px] text-muted">{s.place}</span>
              </div>
              <div className="font-extrabold">{s.titleAr}</div>
              <p className="mt-1 text-xs leading-5 text-muted">{s.descAr}</p>
            </button>
          ))}
        </div>
      )}

      {/* ================= CHAT (free / scenario) ================= */}
      {(mode === "free" || (mode === "scenario" && scenarioId)) && (
        <div className="card flex h-[62vh] flex-col overflow-hidden">
          {/* chat header */}
          <div className="flex items-center gap-3 border-b border-line/60 px-5 py-3.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold to-golddeep text-ink">
              <GraduationCap size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="german text-sm font-bold">
                {mode === "scenario" && activeScenario ? `${activeScenario.role} · ${activeScenario.place}` : "Frau Schneider · C2"}
              </div>
              <div className="text-[11px] text-muted">
                {mode === "scenario" ? `الدور: ${activeScenario?.roleAr}` : "مدرّستك الألمانية — اكتب أو اتكلم بالألماني أو بالمصري"}
              </div>
            </div>
            {mode === "scenario" && (
              <button onClick={() => { setScenarioId(null); setMsgs([]); setConversationId(null); setDone(false); }} className="btn-ghost px-3 py-1.5 text-[11px]">
                غيّر الموقف
              </button>
            )}
          </div>

          {/* messages */}
          <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[86%] space-y-2 ${m.role === "assistant" ? "" : ""}`}>
                  {m.role === "user" ? (
                    <div className="german rounded-2xl rounded-tl-md bg-gold px-5 py-3 text-sm font-semibold text-ink" dir="ltr">
                      {m.german}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="rounded-2xl rounded-tr-md border border-line bg-white/[0.03] px-5 py-3.5">
                        <div className="german text-[15px] leading-7" dir="ltr">{m.german}</div>
                        {showArabic && m.arabic && (
                          <div className="mt-2 flex items-start gap-2 border-t border-line/50 pt-2">
                            <div className="flex-1 text-[13px] leading-6 text-muted">{m.arabic}</div>
                            <SpeakButton text={m.arabic} small lang="ar" />
                          </div>
                        )}
                        <div className="mt-2 flex justify-start">
                          <SpeakButton text={m.german} rate={rate} small />
                        </div>
                      </div>
                      {m.correction && (
                        <div className="flex items-start gap-2 rounded-xl border border-germanred/30 bg-germanred/10 px-4 py-3 text-[12px] leading-6 text-cream/90">
                          <AlertCircle size={15} className="mt-1 shrink-0 text-germanred" />
                          <span><b className="text-germanred">تصحيح:</b> {m.correction}</span>
                        </div>
                      )}
                      {m.tip && (
                        <div className="rounded-xl border border-gold/25 bg-gold/5 px-4 py-2.5 text-[12px] leading-6 text-gold">
                          تلميح: {m.tip}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-end">
                <div className="flex items-center gap-2 rounded-2xl border border-line bg-white/[0.03] px-5 py-3 text-xs text-muted">
                  <Loader2 size={14} className="animate-spin text-gold" /> بفكر...
                </div>
              </div>
            )}
            {done && (
              <div className="card border-mint/30 p-5">
                <div className="mb-2 flex items-center gap-2 font-extrabold text-mint">
                  <CheckCircle2 size={18} /> المهمة خلصت! شاطر جدًا.
                </div>
                {mistakes.length > 0 ? (
                  <>
                    <div className="mb-2 text-xs font-bold text-muted">اللي محتاج تراجعه من المحادثة دي:</div>
                    <ul className="space-y-1.5">
                      {mistakes.slice(0, 5).map((mm, i) => (
                        <li key={i} className="text-[12px] leading-6 text-cream/85">· {mm}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="text-xs text-muted">محادثة نضيفة جدًا - شوفت مستوى حقيقي!</div>
                )}
                <div className="mt-4 flex gap-2">
                  <button onClick={() => { setScenarioId(null); setMsgs([]); setConversationId(null); setDone(false); setMistakes([]); }} className="btn-gold px-5 py-2 text-xs">
                    مهمة تانية
                  </button>
                  <Link href="/progress" className="btn-ghost px-5 py-2 text-xs">شوف تقدمك</Link>
                </div>
              </div>
            )}
          </div>

          {/* input */}
          {!done && (
            <div className="space-y-3 border-t border-line/60 p-4">
              <div className="flex items-center gap-3">
                <input
                  className="input flex-1 text-left"
                  dir="ltr"
                  placeholder={inputLang === "de-DE" ? "Schreib auf Deutsch..." : "اكتب بالعربي..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) { send(input, mode, scenarioId); setInput(""); } }}
                  style={{ direction: inputLang === "de-DE" ? "ltr" : "rtl", textAlign: inputLang === "de-DE" ? "left" : "right" }}
                />
                <button
                  onClick={() => { if (input.trim()) { send(input, mode, scenarioId); setInput(""); } }}
                  disabled={loading || !input.trim()}
                  className="btn-gold flex h-12 w-12 shrink-0 items-center justify-center disabled:opacity-40"
                  aria-label="ابعت"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="flex items-center justify-center gap-6">
                <VoiceInput lang="de-DE" onText={(t) => { send(t, mode, scenarioId); }} />
                <VoiceInput lang="ar-EG" onText={(t) => { send(t, mode, scenarioId); }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= PRONUNCIATION MODE ================= */}
      {mode === "pronounce" && drill && (
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="card p-7 text-center">
            <div className="mb-1 text-xs text-muted">الجملة {drillIdx + 1} من {drills.length} · التركيز: {drill.focus}</div>
            <div className="german my-6 text-2xl font-bold leading-relaxed sm:text-3xl" dir="ltr">{drill.de}</div>
            <div className="text-sm text-muted">{drill.ar}</div>

            <div className="mt-8 flex items-center justify-center gap-8">
              <button
                onClick={() => speakGerman(drill.de, rate)}
                className="btn-ghost flex items-center gap-2 px-5 py-3 text-sm"
              >
                <Volume2 size={17} className="text-gold" /> اسمع النموذج
              </button>
              <button
                onClick={pronounceAttempt}
                disabled={pListening}
                className={`flex h-20 w-20 items-center justify-center rounded-full transition-all ${pListening ? "bg-germanred text-white mic-ring" : "btn-gold"}`}
                aria-label="سجل نطقك"
              >
                <Mic size={28} />
              </button>
              <button onClick={() => { setPResult(null); setPHeard(""); setDrillIdx((i) => i + 1); }} className="btn-ghost flex items-center gap-2 px-5 py-3 text-sm">
                <RotateCcw size={16} /> الجملة الجاية
              </button>
            </div>
            <p className="mt-4 text-[12px] text-muted">{pListening ? "بتسمعك... انطق الجملة بوضوح" : "اضغط الميك وقول الجملة بالألماني"}</p>
            {pHeard === "__error__" && <p className="mt-2 text-xs text-germanred">متسمعتش حاجة واضحة - اقرب من الميك وجرب تاني.</p>}
            {pHeard && pHeard !== "__error__" && (
              <p className="german mt-3 text-xs text-muted" dir="ltr">سمعتك بتقول: {pHeard}</p>
            )}
          </div>

          <div className="card h-fit p-6">
            {pResult ? (
              <>
                <div className="mb-4 text-center">
                  <div className={`german text-5xl font-bold ${pResult.score >= 70 ? "text-mint" : pResult.score >= 50 ? "text-gold" : "text-germanred"}`}>
                    {pResult.score}%
                  </div>
                  <div className="mt-2 text-sm font-bold">{pResult.verdictAr}</div>
                </div>
                <div className="german mb-4 flex flex-wrap gap-1.5" dir="ltr">
                  {pResult.words.map((w, i) => (
                    <span key={i} className={`rounded-full px-3 py-1 text-xs font-bold ${w.ok ? "bg-mint/10 text-mint" : "bg-germanred/10 text-germanred"}`}>
                      {w.target}
                    </span>
                  ))}
                </div>
                <p className="text-[13px] leading-6 text-cream/85">{pResult.tipAr}</p>
                <p className="mt-4 rounded-lg bg-white/[0.03] p-3 text-[11px] leading-5 text-muted">
                  ملاحظة مهمة: التقييم ده تقريبي (بيقارن تفريغ كلامك النصي بالجملة المطلوبة) - مش حكم نهائي على نطقك. الطبيعي إنك تعيد الجملة لحد ما توصل +80%.
                </p>
                <button onClick={() => { setPResult(null); setPHeard(""); }} className="btn-gold mt-4 w-full py-2.5 text-sm">
                  جرب تاني
                </button>
              </>
            ) : (
              <>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-gold">
                  <Sparkles size={15} /> نصايح النطق
                </h3>
                <ul className="space-y-3 text-[13px] leading-6 text-cream/85">
                  <li>· اسمع النموذج مرة أو اتنين قبل ما تتكلم.</li>
                  <li>· ركز على الإيقاع العام للجملة مش كلمة كلمة بالراحة زيادة.</li>
                  <li>· الـ ch بعد i/e صوت ناعم (زي &quot;خ&quot; خفيفة حنكية)، وبعد a/o/u صوت أعمق.</li>
                  <li>· الـ W الألمانية بتتنطق زي V إنجليزية.</li>
                </ul>
              </>
            )}
          </div>
        </div>
      )}

      {mode === "pronounce" && !drill && (
        <div className="card p-10 text-center text-sm text-muted">مفيش تمارين نطق لمستواك لسه — اتكلم في المحادثة الحرة.</div>
      )}
    </div>
  );
}

function VoiceInput({ lang, onText }: { lang: "de-DE" | "ar-EG"; onText: (t: string) => void }) {
  const { listen, stop, listening, supported } = useSpeech();
  const [err, setErr] = useState(false);
  if (!supported) {
    return <span className="text-[11px] text-muted">الميكروفون محتاج متصفح فيه Speech Recognition (زي كروم).</span>;
  }
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={async () => {
          setErr(false);
          if (listening) { stop(); return; }
          try {
            const t = await listen(lang);
            if (t) onText(t);
          } catch { setErr(true); }
        }}
        className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${listening ? "bg-germanred text-white mic-ring" : "btn-gold"}`}
        aria-label={lang === "de-DE" ? "اتكلم ألماني" : "اتكلم مصري"}
      >
        {listening ? <span className="h-3 w-3 rounded-sm bg-white" /> : <Mic size={18} />}
      </button>
      <span className="text-[10px] text-muted">{err ? "مش سامعك - جرب تاني" : lang === "de-DE" ? "اتكلم ألماني" : "اتكلم مصري"}</span>
    </div>
  );
}

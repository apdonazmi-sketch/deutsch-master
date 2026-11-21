"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, Mic, MicOff, Square } from "lucide-react";

export function pickGermanVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  const de = voices.filter((v) => v.lang.toLowerCase().startsWith("de"));
  if (de.length === 0) return null;
  return (
    de.find((v) => v.lang === "de-DE" && !v.localService) ??
    de.find((v) => v.lang === "de-DE") ??
    de[0]
  );
}

export function pickArabicVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  const ar = voices.filter((v) => v.lang.toLowerCase().startsWith("ar"));
  if (ar.length === 0) return null;
  return (
    ar.find((v) => v.lang.toLowerCase().replace("_", "-") === "ar-eg") ??
    ar.find((v) => !v.localService) ??
    ar[0]
  );
}

function speakArabicBrowser(text: string, rate = 0.95, keepQueue = false): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return resolve();
    if (!keepQueue) window.speechSynthesis.cancel();
    const clean = text.replace(/[\n\u{1F300}-\u{1FAFF}]/gu, " ").trim().slice(0, 400);
    if (!clean) return resolve();
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = "ar-EG";
    const voice = pickArabicVoice();
    if (voice) utter.voice = voice;
    utter.rate = rate;
    utter.pitch = 1;
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    window.speechSynthesis.speak(utter);
  });
}

let currentAudio: HTMLAudioElement | null = null;
let cloudPausedUntil = 0;

// Natural Egyptian voice from the server (/api/tts). Returns false if unavailable so the caller can fall back.
async function playCloud(text: string, lang: "ar" | "de"): Promise<boolean> {
  if (typeof window === "undefined" || Date.now() < cloudPausedUntil) return false;
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang }),
    });
    if (!res.ok) {
      // no key / not logged in: stop trying for a while; other errors: short pause
      cloudPausedUntil = Date.now() + (res.status === 501 || res.status === 401 ? 10 * 60_000 : 60_000);
      return false;
    }
    const url = URL.createObjectURL(await res.blob());
    const audio = new Audio(url);
    currentAudio = audio;
    await new Promise<void>((resolve, reject) => {
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error("audio"));
      audio.play().catch(reject);
    });
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}

export async function speakArabic(text: string, rate = 0.95, keepQueue = false): Promise<void> {
  const clean = text.replace(/[\n\u{1F300}-\u{1FAFF}]/gu, " ").trim().slice(0, 400);
  if (!clean) return;
  if (!keepQueue) stopSpeaking();
  if (await playCloud(clean, "ar")) return;
  await speakArabicBrowser(clean, rate, true);
}

export type VoiceMode = "both" | "de" | "ar";

export async function speakReply(german: string, arabic: string | null | undefined, rate: number, mode: VoiceMode) {
  if (mode === "de" || !arabic) return speakGerman(german, rate);
  if (mode === "ar") return speakArabic(arabic);
  await speakGerman(german, rate);
  await speakArabic(arabic, 0.95, true);
}

export function speakGerman(text: string, rate = 0.92): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return resolve();
    window.speechSynthesis.cancel();
    const clean = text.replace(/\n/g, " ").slice(0, 400);
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = "de-DE";
    const voice = pickGermanVoice();
    if (voice) utter.voice = voice;
    utter.rate = rate;
    utter.pitch = 1;
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    window.speechSynthesis.speak(utter);
  });
}

export function stopSpeaking() {
  if (typeof window === "undefined") return;
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.dispatchEvent(new Event("ended"));
    currentAudio = null;
  }
}

type SR = typeof window extends never ? never : any;

export function createRecognizer(lang: "de-DE" | "ar-EG"): any | null {
  if (typeof window === "undefined") return null;
  const Ctor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!Ctor) return null;
  const rec: any = new Ctor();
  rec.lang = lang;
  rec.continuous = false;
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  return rec;
}

export function useSpeech() {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recRef = useRef<any>(null);

  useEffect(() => {
    setSupported(!!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
    return () => {
      recRef.current?.abort?.();
    };
  }, []);

  const listen = (lang: "de-DE" | "ar-EG"): Promise<string> =>
    new Promise((resolve, reject) => {
      const rec = createRecognizer(lang);
      if (!rec) return reject(new Error("unsupported"));
      recRef.current = rec;
      rec.onresult = (e: any) => {
        const text = e.results?.[0]?.[0]?.transcript ?? "";
        resolve(text);
      };
      rec.onerror = (e: any) => reject(new Error(e?.error ?? "error"));
      rec.onend = () => setListening(false);
      setListening(true);
      try {
        rec.start();
      } catch {
        setListening(false);
        reject(new Error("start"));
      }
    });

  const stop = () => {
    recRef.current?.stop?.();
    setListening(false);
  };

  return { listen, stop, listening, supported };
}

export function SpeakButton({ text, rate = 0.92, small = false, className = "", lang = "de" }: { text: string; rate?: number; small?: boolean; className?: string; lang?: "de" | "ar" }) {
  const [playing, setPlaying] = useState(false);
  return (
    <button
      type="button"
      aria-label={lang === "ar" ? "استمع بالمصري" : "استمع بالألمانية"}
      className={`inline-flex items-center justify-center rounded-full border transition-all ${
        playing ? "border-gold text-gold" : "border-line text-muted hover:text-gold hover:border-gold/60"
      } ${small ? "h-8 w-8" : "h-10 w-10"} ${className}`}
      onClick={async (e) => {
        e.stopPropagation();
        if (playing) { stopSpeaking(); setPlaying(false); return; }
        setPlaying(true);
        if (lang === "ar") await speakArabic(text); else await speakGerman(text, rate);
        setPlaying(false);
      }}
    >
      <Volume2 size={small ? 14 : 18} />
    </button>
  );
}

export function MicButton({ lang, onResult, className = "" }: { lang: "de-DE" | "ar-EG"; onResult: (t: string) => void; className?: string }) {
  const { listen, stop, listening, supported } = useSpeech();
  const [error, setError] = useState<string | null>(null);
  if (!supported) return null;
  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <button
        type="button"
        aria-label={lang === "de-DE" ? "اتكلم بالألماني" : "اتكلم بالعربي"}
        className={`inline-flex h-14 w-14 items-center justify-center rounded-full transition-all ${
          listening ? "bg-germanred text-white mic-ring" : "btn-gold"
        }`}
        onClick={async () => {
          setError(null);
          if (listening) { stop(); return; }
          try {
            const text = await listen(lang);
            if (text) onResult(text);
          } catch {
            setError("متسمعتش واضح - جرب تاني بهدوء");
          }
        }}
      >
        {listening ? <Square size={20} /> : <Mic size={22} />}
      </button>
      <span className="text-[11px] text-muted">{listening ? "بتسمعك... اتكلم" : lang === "de-DE" ? "اتكلم ألماني" : "اتكلم عربي"}</span>
      {error && <span className="text-[11px] text-germanred">{error}</span>}
    </div>
  );
}

export function useGermanSpeaker(rate = 0.92) {
  const [speaking, setSpeaking] = useState(false);
  const speak = async (text: string, r = rate) => {
    setSpeaking(true);
    await speakGerman(text, r);
    setSpeaking(false);
  };
  return { speak, speaking };
}

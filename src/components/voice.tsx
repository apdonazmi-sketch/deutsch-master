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
  if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
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

export function SpeakButton({ text, rate = 0.92, small = false, className = "" }: { text: string; rate?: number; small?: boolean; className?: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <button
      type="button"
      aria-label="استمع بالألمانية"
      className={`inline-flex items-center justify-center rounded-full border transition-all ${
        playing ? "border-gold text-gold" : "border-line text-muted hover:text-gold hover:border-gold/60"
      } ${small ? "h-8 w-8" : "h-10 w-10"} ${className}`}
      onClick={async (e) => {
        e.stopPropagation();
        if (playing) { stopSpeaking(); setPlaying(false); return; }
        setPlaying(true);
        await speakGerman(text, rate);
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

"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { speakGerman, stopSpeaking } from "./voice";

const SAMPLES = [
  { de: "Guten Tag! Ich bin Frau Schneider, deine Deutschlehrerin. Wie geht es dir heute?", ar: "نهارك سعيد! أنا مدام شنايدر، مدرّستك للألماني. عامل إيه النهاردة؟" },
  { de: "Keine Angst vor Fehlern - sie sind der beste Lehrer!", ar: "متخافش من الغلط - هو أحسن مدرس!" },
  { de: "Ich möchte ein Konto eröffnen, bitte.", ar: "عايز أفتح حساب بنكي لو سمحت." },
];

export default function LandingVoiceDemo() {
  const [playing, setPlaying] = useState<number | null>(null);

  return (
    <div className="mt-6 space-y-3">
      {SAMPLES.map((s, i) => (
        <button
          key={i}
          type="button"
          onClick={async () => {
            if (playing === i) { stopSpeaking(); setPlaying(null); return; }
            stopSpeaking();
            setPlaying(i);
            await speakGerman(s.de, 0.9);
            setPlaying(null);
          }}
          className={`w-full text-start rounded-2xl border px-5 py-4 transition-all ${
            playing === i ? "border-gold/70 bg-gold/5" : "border-line bg-white/[0.02] hover:border-gold/40"
          }`}
        >
          <div className="flex items-center gap-4">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${playing === i ? "bg-gold text-ink" : "bg-white/5 text-gold"}`}>
              <Volume2 size={18} />
            </span>
            <span className="min-w-0">
              <span className="german block truncate text-[15px] font-semibold text-cream">{s.de}</span>
              <span className="block text-xs text-muted mt-1">{s.ar}</span>
            </span>
            {playing === i && (
              <span className="me-1 ms-auto flex items-end gap-[3px]" aria-hidden>
                {[0, 1, 2, 3].map((b) => (
                  <span key={b} className="speaking-bar w-[3px] rounded bg-gold" style={{ height: `${10 + b * 5}px`, animationDelay: `${b * 0.12}s` }} />
                ))}
              </span>
            )}
          </div>
        </button>
      ))}
      <p className="text-[11px] text-muted">صوت ألماني حقيقي من متصفحك - جودة النطق تعتمد على أصوات النظام عندك.</p>
    </div>
  );
}

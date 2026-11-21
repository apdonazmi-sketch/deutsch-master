"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const INTERACTIVE =
  'button, a[href], [role="button"], summary, label, select, input[type="checkbox"], input[type="radio"], input[type="range"]';

export default function SoundFx() {
  const ctxRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dm-sound");
      if (saved === "off") {
        enabledRef.current = false;
        setEnabled(false);
      }
    } catch {
      /* storage unavailable: keep default (on) */
    }

    function tone(ctx: AudioContext, freq: number, start: number, dur: number, vol: number) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.85, start + dur);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(vol, start + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur + 0.02);
    }

    function onPointerDown(e: PointerEvent) {
      if (!enabledRef.current) return;
      const target = e.target as Element | null;
      const el = target?.closest?.(INTERACTIVE) as HTMLElement | null;
      if (!el) return;
      if ((el as HTMLButtonElement).disabled || el.getAttribute("aria-disabled") === "true") return;
      // don't play over the microphone: it would be picked up as speech
      const label = el.getAttribute("aria-label") ?? "";
      if (label.includes("اتكلم") || label.includes("سجل نطقك") || el.hasAttribute("data-nosound")) return;

      try {
        if (!ctxRef.current) {
          const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
          if (!Ctor) return;
          ctxRef.current = new Ctor();
        }
        const ctx = ctxRef.current;
        if (ctx.state === "suspended") ctx.resume();
        const t = ctx.currentTime;
        if (el.matches(".btn-gold")) {
          tone(ctx, 660, t, 0.09, 0.07);
          tone(ctx, 990, t + 0.07, 0.12, 0.07);
        } else if (el.tagName === "A") {
          tone(ctx, 520, t, 0.07, 0.05);
        } else {
          tone(ctx, 780, t, 0.06, 0.06);
        }
      } catch {
        /* audio not available: stay silent */
      }
    }

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, []);

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    enabledRef.current = next;
    try {
      localStorage.setItem("dm-sound", next ? "on" : "off");
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      data-nosound
      onClick={toggle}
      aria-label={enabled ? "اقفل أصوات الضغط" : "افتح أصوات الضغط"}
      className="fixed bottom-4 left-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-line bg-coal/90 text-gold shadow-lg backdrop-blur"
    >
      {enabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-muted" />}
    </button>
  );
}

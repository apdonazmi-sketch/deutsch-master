import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

// Wrap raw 16-bit mono PCM in a WAV container so every browser can play it.
function pcmToWav(pcm: Buffer, sampleRate: number): Buffer {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

const STYLE: Record<string, string> = {
  ar: "Say the following in a warm, natural Egyptian Arabic accent (Cairo dialect), like a friendly teacher, without reading these instructions aloud: ",
  de: "Sprich den folgenden Text in klarem, natürlichem Hochdeutsch wie eine freundliche Lehrerin, ohne diese Anweisung vorzulesen: ",
};

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const key =
    process.env.GEMINI_API_KEY ||
    ((process.env.OPENAI_BASE_URL ?? "").includes("generativelanguage") ? process.env.OPENAI_API_KEY : undefined);
  if (!key) return NextResponse.json({ error: "no-key" }, { status: 501 });

  try {
    const body = await req.json();
    const text = String(body.text ?? "").trim().slice(0, 400);
    const lang = body.lang === "de" ? "de" : "ar";
    if (!text) return NextResponse.json({ error: "empty" }, { status: 400 });

    const base = (process.env.GEMINI_TTS_BASE || "https://generativelanguage.googleapis.com/v1beta").replace(/\/+$/, "");
    const model = process.env.GEMINI_TTS_MODEL || "gemini-2.5-flash-preview-tts";
    const voice = process.env.GEMINI_TTS_VOICE || "Sulafat";

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    const res = await fetch(`${base}/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: STYLE[lang] + text }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
        },
      }),
    });
    clearTimeout(timer);

    if (!res.ok) {
      console.error("TTS error", res.status, (await res.text()).slice(0, 300));
      return NextResponse.json({ error: "tts-failed" }, { status: 502 });
    }
    const data = await res.json();
    const part = data.candidates?.[0]?.content?.parts?.find((p: { inlineData?: unknown }) => p.inlineData);
    const b64: string | undefined = part?.inlineData?.data;
    if (!b64) return NextResponse.json({ error: "no-audio" }, { status: 502 });

    const mime: string = part.inlineData.mimeType ?? "";
    const rate = Number(/rate=(\d+)/.exec(mime)?.[1] ?? 24000);
    const wav = pcmToWav(Buffer.from(b64, "base64"), rate);
    return new Response(new Uint8Array(wav), {
      headers: { "Content-Type": "audio/wav", "Cache-Control": "private, max-age=3600" },
    });
  } catch (e) {
    console.error("TTS exception", e);
    return NextResponse.json({ error: "tts-failed" }, { status: 502 });
  }
}

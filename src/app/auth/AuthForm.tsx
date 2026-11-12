"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Lock, User, AtSign, Info } from "lucide-react";

export default function AuthForm({ initialMode }: { initialMode: "register" | "login" }) {
  const [mode, setMode] = useState<"register" | "login">(initialMode);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ name, username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "حصلت مشكلة");
        return;
      }
      // Verify the session cookie was actually stored (some embedded
      // previews / browsers block third-party cookies entirely).
      const check = await fetch("/api/me", { cache: "no-store", credentials: "include" });
      const meData = await check.json().catch(() => null);
      if (!meData?.user) {
        setError(
          "الدخول نجح من جهة السيرفر لكن متصفحك رفض يخزّن جلستك (حظر كوكيز الطرف الثالث). افتح المعاينة في تاب لوحدها من الزرار اللي فوق، أو فعّل الكوكيز وجرب تاني."
        );
        return;
      }
      // Full-page navigation guarantees the fresh session cookie is sent
      // and bypasses any cached redirect in the client router.
      setError(null);
      window.location.assign(mode === "register" ? "/onboarding" : "/dashboard");
    } catch {
      setError("مفيش اتصال - جرب تاني");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5">
      <div className="aurora left-[-10%] top-[-15%] h-[420px] w-[420px] bg-gold/20" />
      <div className="aurora bottom-[-20%] right-[-10%] h-[420px] w-[420px] bg-germanred/10" />

      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
          <span className="german-flag-stripe h-5 w-8 rounded-[4px]" />
          <span className="german text-xl font-bold">DEUTSCH <span className="text-gold">MASTER</span></span>
        </Link>

        <div className="card p-8">
          <div className="mb-7 grid grid-cols-2 gap-2 rounded-full bg-white/[0.04] p-1">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setError(null); }}
                className={`rounded-full py-2 text-sm font-bold transition-all ${mode === m ? "bg-gold text-ink" : "text-muted hover:text-cream"}`}
              >
                {m === "login" ? "تسجيل دخول" : "حساب جديد"}
              </button>
            ))}
          </div>

          <h1 className="mb-1 text-xl font-extrabold">{mode === "register" ? "يلا نبدأ رحلتك" : "أهلًا برجوعك"}</h1>
          <p className="mb-6 text-sm text-muted">
            {mode === "register" ? "سجّل حسابك في ٣٠ ثانية وبعدها المحادثة التقييمية." : "ادخل بنفس اسم المستخدم والباسورد اللي سجلت بيهم."}
          </p>

          {mode === "login" && (
            <div className="mb-5 flex items-start gap-2 rounded-xl border border-gold/25 bg-gold/5 px-4 py-3 text-[12px] leading-6 text-gold">
              <Info size={14} className="mt-1 shrink-0" />
              اسم المستخدم هو اللي اخترته وقت التسجيل (بالإنجليزي) — مش اسمك المعروض.
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <div className="relative">
                <User size={16} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted" />
                <input className="input pr-11" placeholder="اسمك (زي: أحمد)" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div className="relative">
              <AtSign size={16} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted" />
              <input
                className="input pr-11 text-left"
                dir="ltr"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted" />
              <input
                className="input pr-11 text-left"
                dir="ltr"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "register" ? "new-password" : "current-password"}
              />
            </div>

            {error && (
              <div className="rounded-xl border border-germanred/40 bg-germanred/10 px-4 py-3 text-sm text-germanred">{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-gold flex w-full items-center justify-center gap-2 py-3.5 disabled:opacity-60">
              {loading ? <Loader2 size={18} className="animate-spin" /> : mode === "register" ? "سجّل وابدأ التقييم" : "ادخل حسابي"}
              {!loading && <ArrowRight size={18} className="rotate-180" />}
            </button>
          </form>

          {mode === "register" && (
            <p className="mt-5 text-center text-xs text-muted">
              عندك حساب بالفعل؟{" "}
              <button type="button" className="font-bold text-gold hover:underline" onClick={() => setMode("login")}>
                سجّل دخول من هنا
              </button>
            </p>
          )}
        </div>

        <Link href="/" className="mt-6 block text-center text-xs text-muted transition-colors hover:text-gold">
          → ارجع للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, CalendarCheck, MessageCircle, Headphones, BookOpen, Ruler,
  MapPin, ClipboardCheck, TrendingUp, Menu, X, LogOut, GraduationCap,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "خطتي اليوم", icon: CalendarCheck },
  { href: "/tutor", label: "تحدث مع المدرس", icon: MessageCircle },
  { href: "/scenarios", label: "مواقف حقيقية", icon: MapPin },
  { href: "/listening", label: "الاستماع", icon: Headphones },
  { href: "/vocabulary", label: "الكلمات", icon: BookOpen },
  { href: "/grammar", label: "القواعد", icon: Ruler },
  { href: "/tests", label: "الاختبارات", icon: ClipboardCheck },
  { href: "/progress", label: "تقريري وتقدمي", icon: TrendingUp },
  { href: "/", label: "الرئيسية", icon: Home },
];

export default function AppShell({ children, userName, level }: { children: ReactNode; userName: string; level?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  async function logout() {
    // Full reload so the session cookie change is picked up cleanly.
    await fetch("/api/auth/logout", { method: "POST", credentials: "include", cache: "no-store" });
    window.location.assign("/");
  }

  return (
    <div className="flex min-h-screen">
      {/* sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-64 flex-col border-l border-line/60 bg-coal/95 backdrop-blur-xl transition-transform lg:sticky lg:translate-x-0 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-line/60 px-5">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="german-flag-stripe h-4 w-6 rounded-[3px]" />
            <span className="german text-sm font-bold">DEUTSCH <span className="text-gold">MASTER</span></span>
          </Link>
          <button className="text-muted lg:hidden" onClick={() => setOpen(false)} aria-label="اقفل القايمة">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                  active ? "bg-gold/10 text-gold" : "text-muted hover:bg-white/[0.04] hover:text-cream"
                }`}
              >
                <item.icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line/60 p-4">
          <div className="mb-3 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold to-golddeep text-sm font-bold text-ink">
              {userName.slice(0, 1)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold">{userName}</span>
              {level && <span className="german block text-[11px] text-gold">{level}</span>}
            </span>
          </div>
          <button onClick={logout} className="btn-ghost flex w-full items-center justify-center gap-2 py-2 text-xs">
            <LogOut size={14} />
            تسجيل خروج
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}

      {/* main */}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-line/60 bg-ink/80 px-5 backdrop-blur-xl lg:hidden">
          <button className="text-cream" onClick={() => setOpen(true)} aria-label="افتح القايمة">
            <Menu size={20} />
          </button>
          <span className="german text-sm font-bold">
            DEUTSCH <span className="text-gold">MASTER</span>
          </span>
          <span className="ms-auto flex items-center gap-2 text-xs text-muted">
            <GraduationCap size={14} className="text-gold" /> {userName}
          </span>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

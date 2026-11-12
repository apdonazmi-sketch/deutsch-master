"use client";

import { useEffect, useState, type ReactNode } from "react";
import AppShell from "./AppShell";

export default function ClientShell({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<{ name: string; level: string } | null>(null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) {
          setDenied(true);
          window.location.assign("/auth?mode=login");
        } else if (!d.profile) {
          setDenied(true);
          window.location.assign("/onboarding");
        } else {
          setMe({ name: d.user.name, level: `${d.profile.currentLevel} → ${d.profile.targetLevel}` });
        }
      })
      .catch(() => setDenied(true));
  }, []);

  if (!me) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="german-flag-stripe mx-auto mb-4 h-2 w-24 rounded-full animate-pulse" />
          <p className="text-sm text-muted">{denied ? "بنرجعك لصفحة الدخول..." : "ثانية واحدة..."}</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell userName={me.name} level={me.level}>
      {children}
    </AppShell>
  );
}

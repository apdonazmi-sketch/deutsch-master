import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import AppShell from "@/components/AppShell";
import TutorClient from "./TutorClient";

export default async function TutorPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; scenario?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/auth?mode=login");
  const rows = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  if (rows.length === 0) redirect("/onboarding");
  const sp = await searchParams;
  const mode = sp.mode === "pronounce" || sp.mode === "scenario" ? sp.mode : "free";
  return (
    <AppShell userName={user.name} level={`${rows[0].currentLevel} → ${rows[0].targetLevel}`}>
      <TutorClient
        initialMode={mode as "free" | "scenario" | "pronounce"}
        initialScenario={sp.scenario ?? null}
        level={rows[0].currentLevel}
      />
    </AppShell>
  );
}

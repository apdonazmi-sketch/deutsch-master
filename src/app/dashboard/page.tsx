import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import AppShell from "@/components/AppShell";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth?mode=login");
  const rows = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  if (rows.length === 0) redirect("/onboarding");
  return (
    <AppShell userName={user.name} level={`${rows[0].currentLevel} → ${rows[0].targetLevel}`}>
      <DashboardClient userName={user.name} />
    </AppShell>
  );
}

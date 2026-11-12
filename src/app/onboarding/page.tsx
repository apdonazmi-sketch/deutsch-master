import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import OnboardingClient from "./OnboardingClient";

export default async function OnboardingPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth?mode=login");
  const rows = await db.select({ id: profiles.id }).from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  if (rows.length > 0) redirect("/dashboard");
  return <OnboardingClient userName={user.name} />;
}

import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AuthForm from "./AuthForm";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  // Already logged in? Never show a login form to a logged-in user.
  const user = await getSessionUser();
  if (user) redirect("/dashboard");
  const sp = await searchParams;
  const initialMode = sp.mode === "login" ? "login" : "register";
  return <AuthForm initialMode={initialMode} />;
}

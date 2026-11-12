import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = scryptSync(password, salt, 64);
  const real = Buffer.from(hash, "hex");
  return test.length === real.length && timingSafeEqual(test, real);
}

export async function createSession(userId: number): Promise<void> {
  const token = randomBytes(32).toString("hex");
  await db.insert(sessions).values({ token, userId });
  const jar = await cookies();
  // The preview is served over HTTPS (often inside an iframe on another
  // domain), where the browser would reject a SameSite=Lax cookie as
  // third-party. SameSite=None + Secure is the only combination that
  // survives embedded HTTPS previews; lax stays for local dev (plain http).
  const isProd = process.env.NODE_ENV === "production";
  // partitioned (CHIPS) + SameSite=None + Secure lets the cookie survive
  // embedded HTTPS iframes under modern third-party-cookie blocking.
  jar.set("dm_session", token, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    partitioned: isProd,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  } as Parameters<typeof jar.set>[2]);
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get("dm_session")?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token));
    jar.delete("dm_session");
  }
}

export type SessionUser = { id: number; name: string; username: string };

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get("dm_session")?.value;
  if (!token) return null;
  const rows = await db
    .select({ id: users.id, name: users.name, username: users.username })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.token, token))
    .limit(1);
  return rows[0] ?? null;
}

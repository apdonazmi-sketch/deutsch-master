import { NextResponse } from "next/server";
import { db } from "@/db";
import { activity } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { todayKey } from "@/lib/levels";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });
  const body = await req.json();
  const kind = String(body.kind ?? "minutes").slice(0, 24);
  const value = Math.max(0, Math.min(600, Number(body.value ?? 1)));
  const meta = body.meta ? String(body.meta).slice(0, 200) : null;
  await db.insert(activity).values({ userId: user.id, kind, value: Math.max(1, value), meta, day: todayKey() });
  return NextResponse.json({ ok: true });
}

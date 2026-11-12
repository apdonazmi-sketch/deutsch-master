import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const username = String(body.username ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (name.length < 2) return NextResponse.json({ error: "اكتب اسمك الحقيقي (حرفين على الأقل)" }, { status: 400 });
    if (!/^[a-z0-9_.-]{3,30}$/.test(username))
      return NextResponse.json({ error: "اسم المستخدم: 3-30 حرف إنجليزي أو أرقام من غير مسافات" }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "الباسورد لازم 6 حروف على الأقل" }, { status: 400 });

    const existing = await db.select({ id: users.id }).from(users).where(eq(users.username, username)).limit(1);
    if (existing.length > 0) return NextResponse.json({ error: "اسم المستخدم ده محجوز - جرب غيره" }, { status: 409 });

    const [user] = await db.insert(users).values({ name, username, passwordHash: hashPassword(password) }).returning({ id: users.id });
    await createSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "حصلت مشكلة في السيرفر - جرب تاني" }, { status: 500 });
  }
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import AppShell from "@/components/AppShell";
import { SCENARIOS } from "@/lib/data/scenarios";
import { MapPin, UtensilsCrossed, Plane, TrainFront, ShoppingCart, Stethoscope, Briefcase, GraduationCap, Home, Landmark, Users } from "lucide-react";

const ICONS: Record<string, typeof UtensilsCrossed> = {
  restaurant: UtensilsCrossed,
  airport: Plane,
  train: TrainFront,
  supermarket: ShoppingCart,
  doctor: Stethoscope,
  job: Briefcase,
  ausbildung: GraduationCap,
  apartment: Home,
  bank: Landmark,
  amt: Landmark,
  colleagues: Users,
};

export default async function ScenariosPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth?mode=login");
  const rows = await db.select().from(profiles).where(eq(profiles.userId, user.id)).limit(1);
  if (rows.length === 0) redirect("/onboarding");

  return (
    <AppShell userName={user.name} level={`${rows[0].currentLevel} → ${rows[0].targetLevel}`}>
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-2xl font-black">
          <MapPin className="text-gold" /> مواقف من الحياة الحقيقية
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
          مش هتتعلم من كتب بس — ادخل الموقف بنفسك. الـ AI هيتقمص الشخصية التانية ويتكلم معاك ألماني.
          لو غلطت المحادثة مش هتقف، وهتلاقي تقرير أخطاء في الآخر. اغلط براحتك!
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SCENARIOS.map((s) => {
          const Icon = ICONS[s.id] ?? MapPin;
          return (
            <Link
              key={s.id}
              href={`/tutor?mode=scenario&scenario=${s.id}`}
              className="card group relative overflow-hidden p-6 transition-all hover:-translate-y-1 hover:border-gold/40"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold transition-transform group-hover:scale-110">
                  <Icon size={22} />
                </span>
                <span className="german rounded-full border border-gold/30 px-3 py-1 text-[11px] font-bold text-gold">{s.level}</span>
              </div>
              <h3 className="font-extrabold">{s.titleAr}</h3>
              <div className="german mt-0.5 text-xs text-muted">{s.place}</div>
              <p className="mt-3 text-[13px] leading-6 text-muted">{s.descAr}</p>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-gold opacity-0 transition-opacity group-hover:opacity-100">
                ابدأ المحاكاة ←
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}

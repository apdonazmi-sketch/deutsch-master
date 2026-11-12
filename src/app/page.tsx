import Link from "next/link";
import {
  Brain, MessageCircle, Mic, Headphones, BookOpen, MapPin, ClipboardCheck,
  TrendingUp, Sparkles, Route, GraduationCap, ArrowLeft, BadgeCheck, RefreshCw, Timer,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import LandingVoiceDemo from "@/components/LandingVoiceDemo";
import { getSessionUser } from "@/lib/auth";

const LEVELS = [
  { id: "A1", title: "الأساسيات", desc: "الحروف والنطق، التعارف، الأرقام، تكوين أول جملك — وتبدأ تتكلم من أول أسبوع." },
  { id: "A2", title: "الاستقلالية", desc: "الماضي، المواعيد، الاتجاهات، التعاملات اليومية في السوبر ماركت والمواصلات." },
  { id: "B1", title: "التواصل الحقيقي", desc: "رأيك وحجتك، سرد القصص، كتابة الإيميلات، وانترفيوهات الشغل والـ Ausbildung." },
  { id: "B2", title: "اللغة المهنية", desc: "نقاشات معقدة، اجتماعات شغل، فهم الأخبار، والتعبير عن أفكارك بوضوح كامل." },
  { id: "C1", title: "التقدم الأكاديمي", desc: "لغة أكاديمية ومهنية، كتابة رسمية، وفهم المحتوى المعقد بعمق." },
  { id: "C2", title: "الإتقان", desc: "فهم شبه كامل، تعبير طبيعي دقيق، وفروق لغوية زي الألمان بالظبط." },
];

const FEATURES = [
  { icon: Brain, title: "تقييم شخصي ذكي", desc: "قبل أول درس، محادثة قصيرة بالمصري تفهم أهدافك وأسلوبك وتخوفاتك — والخطة بتتبني عليها." },
  { icon: MessageCircle, title: "مدرس AI بمستوى C2", desc: "محادثات مفتوحة حقيقية، تصحيح فوري لأخطائك، وترجمة مصرية لكل جملة ألمانية." },
  { icon: Mic, title: "تصحيح نطق احترافي", desc: "انطق الجملة، والنظام يحللها كلمة كلمة ويريك إيه اللي محتاج تحسين — مع نموذج صوتي." },
  { icon: MapPin, title: "محاكاة الحياة في ألمانيا", desc: "مطعم، دكتور، بنك، انترفيو شغل — والـ AI بيلعب دور الشخص التاني قدامك." },
  { icon: RefreshCw, title: "تكرار متباعد ذكي", desc: "كل كلمة بترجع في وقتها المظبوط بالظبط قبل ما تنساها — ساينس مش حظ." },
  { icon: Headphones, title: "استماع متدرج", desc: "محادثات مسجلة بمستواك، بطيئة في الأول وتتسرع تدريجيًا لحد الطبيعي." },
  { icon: Route, title: "خطة بتتطور معاك", desc: "كل أسبوع النظام بيحلل أداءك ويعيد ترتيب دروسك — لو انقطعت، بنكمل من وقفت." },
  { icon: ClipboardCheck, title: "اختبارات مستوى حقيقية", desc: "مفيش ترقية بالفطرة — لازم تعدي قياس المهارات: مفردات، قواعد، واستماع." },
  { icon: Timer, title: "جلسات قصيرة مركزة", desc: "كل يوم ٨ مهام صغيرة على قد وقتك — من ١٥ دقيقة لساعتين، بدون ملل." },
  { icon: TrendingUp, title: "تقارير تقدم صادقة", desc: "أرقام حقيقية من أداءك الفعلي، بدون وعود زائفة — التقدم مضمون لو مشيت على الخطة." },
];

const STEPS = [
  { n: "01", title: "محادثة التقييم", desc: "١٠ أسئلة بالمصري تفهم هدفك ومستواك ووقتك وطريقتك في التعلم." },
  { n: "02", title: "تقريرك الشخصي", desc: "AI بيحلل إجاباتك ويطلع خطة واقعية بساعات مقدرة وأهداف أسبوعية." },
  { n: "03", title: "خطة اليوم", desc: "كل يوم جلسة مركزة: مراجعة + كلمات + قاعدة + استماع + محادثة + مهمة." },
  { n: "04", title: "الخطة بتتطور", desc: "أدائك الأسبوعي بيغير ترتيب دروسك — لو ضعيف في الاستماع، الاستماع يزيد." },
];

const MARQUEE = [
  "Ich lerne Deutsch", "Wie geht es dir?", "Übung macht den Meister", "Guten Morgen",
  "Keine Angst vor Fehlern", "Ich möchte einen Kaffee", "Sprachkenntnisse öffnen Türen", "Los geht's!",
];

export default async function LandingPage() {
  const user = await getSessionUser();
  const ctaHref = user ? "/dashboard" : "/auth";

  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* ambient */}
      <div className="aurora left-[-10%] top-[-10%] h-[480px] w-[480px] bg-gold/20" />
      <div className="aurora right-[-5%] top-[30%] h-[420px] w-[420px] bg-germanred/10" />
      <div className="aurora left-[20%] bottom-[-15%] h-[460px] w-[460px] bg-golddeep/10" />

      {/* nav */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-ink/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="german-flag-stripe h-5 w-8 rounded-[4px] shadow-lg" />
            <span className="german text-lg font-bold tracking-tight">
              DEUTSCH <span className="text-gold">MASTER</span>
            </span>
            <span className="rounded-full border border-gold/40 px-2 py-0.5 text-[10px] font-bold text-gold">AI</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
            <a href="#features" className="transition-colors hover:text-gold">المميزات</a>
            <a href="#curriculum" className="transition-colors hover:text-gold">المنهج</a>
            <a href="#tutor" className="transition-colors hover:text-gold">المدرس الصوتي</a>
            <a href="#how" className="transition-colors hover:text-gold">إزاي بيشتغل</a>
          </nav>
          {!user && (
            <Link href="/auth?mode=login" className="btn-ghost px-5 py-2 text-sm">
              تسجيل الدخول
            </Link>
          )}
          <Link href={ctaHref} className="btn-gold px-5 py-2 text-sm">
            {user ? "لوحتي" : "ابدأ مجانًا"}
          </Link>
        </div>
      </header>

      {/* hero */}
      <section className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-32 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-40">
        <div>
          <Reveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs font-bold text-gold">
              <Sparkles size={14} />
              مدرّس ألماني شخصي يشتغل معاك ٢٤ ساعة
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="text-[42px] font-black leading-[1.15] sm:text-6xl lg:text-[68px]">
              اتقن الألمانية
              <br />
              <span className="german bg-gradient-to-l from-gold via-gold to-germanred bg-clip-text text-transparent">
                Von Null auf C2
              </span>
              <br />
              من الصفر لحد الإتقان
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted sm:text-lg">
              مش تطبيق كلمات وقواعد - ده مدرّس ذكي بيتكلم معاك صوت، بيفهم المصري، بيصحح غلطك،
              وبيصمملك خطة بتتغير مع تقدمك. هدفنا واحد: تتكلم ألماني بثقة في الحياة الحقيقية.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href={ctaHref} className="btn-gold flex items-center gap-2 px-8 py-3.5 text-base">
                ابدأ رحلتك دلوقتي
                <ArrowLeft size={18} />
              </Link>
              <a href="#tutor" className="btn-ghost px-6 py-3.5 text-sm">
                جرّب صوت المدرس
              </a>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              {[
                { v: "6", l: "مستويات CEFR" },
                { v: "+110", l: "كلمة أساسية" },
                { v: "9", l: "محاكاة حقيقية" },
                { v: "29", l: "درس قواعد" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="german text-2xl font-bold text-gold">{s.v}</div>
                  <div className="text-xs text-muted">{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal delay={200} className="relative hidden lg:block">
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-gold/25 via-transparent to-germanred/20 blur-2xl" />
            <div
              className="grain relative h-[520px] overflow-hidden rounded-[2rem] border border-line bg-cover bg-center"
              style={{ backgroundImage: "url(/images/hero.jpg)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
              <div className="absolute bottom-6 right-6 left-6 space-y-3">
                {["Sprich Deutsch.", "Denk Deutsch.", "Leb Deutsch."].map((t, i) => (
                  <div
                    key={t}
                    className="german w-fit rounded-full border border-gold/30 bg-ink/70 px-4 py-1.5 text-sm font-semibold backdrop-blur animate-float"
                    style={{ animationDelay: `${i * 1.4}s` }}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* marquee */}
      <div className="relative border-y border-line/60 bg-coal/60 py-4" dir="ltr">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap opacity-70 [direction:ltr]">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="german text-lg font-semibold text-cream/80">
              {m} <span className="mx-3 text-gold">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* features */}
      <section id="features" className="mx-auto max-w-7xl px-5 py-24">
        <Reveal>
          <div className="mb-14 max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-gold">المميزات</span>
            <h2 className="mt-3 text-4xl font-black leading-snug sm:text-5xl">
              مدرّس كامل في جيبك.
              <br />
              <span className="text-muted">مش مجرد فلاش كاردز.</span>
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 5) * 70}>
              <div className="card group h-full p-6 transition-all hover:border-gold/40 hover:bg-gold/[0.03]">
                <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold/10 text-gold transition-all group-hover:scale-110">
                  <f.icon size={20} />
                </span>
                <h3 className="mb-2 font-extrabold leading-snug">{f.title}</h3>
                <p className="text-[13px] leading-6 text-muted">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* curriculum */}
      <section id="curriculum" className="border-y border-line/60 bg-coal/40 py-24">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="text-xs font-bold tracking-widest text-gold">المنهج الكامل</span>
                <h2 className="mt-3 text-4xl font-black sm:text-5xl">طريقك من A1 لحد C2</h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-muted">
                منهج منظم وفق الإطار الأوروبي المرجعي (CEFR) — كل مستوى فيه وحدات ودروس واختبارات ومهام حقيقية، ومفيش ترقية من غير قياس مهارات حقيقي.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {LEVELS.map((lv, i) => (
              <Reveal key={lv.id} delay={i * 70}>
                <div className="card flex h-full items-start gap-5 p-6 transition-all hover:border-gold/40">
                  <span className="german flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-golddeep text-lg font-bold text-ink">
                    {lv.id}
                  </span>
                  <span>
                    <span className="mb-1 block font-extrabold">{lv.title}</span>
                    <span className="block text-[13px] leading-6 text-muted">{lv.desc}</span>
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* voice tutor */}
      <section id="tutor" className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 lg:grid-cols-2">
        <Reveal>
          <span className="text-xs font-bold tracking-widest text-gold">المدرس الصوتي</span>
          <h2 className="mt-3 text-4xl font-black leading-snug sm:text-5xl">
            اتكلم. اتسمع. اتصحح.
            <br />
            <span className="text-muted">كأن معاك مدرّس ألماني في أوضتك.</span>
          </h2>
          <ul className="mt-8 space-y-4">
            {[
              "نطق Hochdeutsch قياسي بسرعة بتتظبط على مستواك",
              "فاهم المصري وبيرد بيه وقت الحاجة — والألماني بيزيد تدريجيًا",
              "بيصحح جملتك وبيطلب منك تعيدها صح، زي مدرس حقيقي",
              "محادثات مفتوحة مش أسئلة محفوظة — ومعاها النص الألماني والترجمة",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-[15px] leading-7 text-cream/90">
                <BadgeCheck size={18} className="mt-1 shrink-0 text-gold" />
                {t}
              </li>
            ))}
          </ul>
          <Link href={ctaHref} className="btn-gold mt-9 inline-flex items-center gap-2 px-7 py-3 text-sm">
            جرّب التحدث مع المدرس <Mic size={16} />
          </Link>
        </Reveal>
        <Reveal delay={150}>
          <div className="card relative overflow-hidden p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gold to-golddeep">
                <GraduationCap size={22} className="text-ink" />
              </span>
              <span>
                <span className="german block font-bold">Frau Schneider</span>
                <span className="text-xs text-muted">مدرّستك · مستوى C2 · اضغط اسمع</span>
              </span>
            </div>
            <LandingVoiceDemo />
          </div>
        </Reveal>
      </section>

      {/* how it works */}
      <section id="how" className="border-y border-line/60 bg-coal/40 py-24">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal>
            <h2 className="mb-14 text-center text-4xl font-black sm:text-5xl">إزاي الرحلة بتمشي؟</h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <div className="card relative h-full overflow-hidden p-7">
                  <span className="german absolute -top-3 left-4 text-6xl font-bold text-gold/10">{s.n}</span>
                  <span className="german mb-4 block text-sm font-bold text-gold">{s.n}</span>
                  <h3 className="mb-2 text-lg font-extrabold">{s.title}</h3>
                  <p className="text-[13px] leading-6 text-muted">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-7xl px-5 py-28 text-center">
        <div className="aurora left-1/2 top-1/2 h-[380px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-gold/15" />
        <Reveal>
          <h2 className="relative text-4xl font-black leading-snug sm:text-6xl">
            مستقبلك في ألمانيا
            <br />
            <span className="text-gold">بيبدأ بأول جملة.</span>
          </h2>
          <p className="relative mx-auto mt-6 max-w-xl text-muted">
            التقييم الشخصي مجاني وبياخد أقل من ٣ دقايق. بعدها هيكون عندك خطة كاملة من يومك الحالي لحد هدفك.
          </p>
          <Link href={ctaHref} className="btn-gold relative mt-10 inline-flex items-center gap-2 px-10 py-4 text-lg">
            ابدأ التقييم الذكي <ArrowLeft size={20} />
          </Link>
        </Reveal>
      </section>

      <footer className="border-t border-line/60 py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 text-xs text-muted">
          <div className="flex items-center gap-3">
            <span className="german-flag-stripe h-4 w-6 rounded-[3px]" />
            <span className="german font-bold">DEUTSCH MASTER AI</span>
            <span>· مدرّسك الألماني الشخصي</span>
          </div>
          <span>تعليم حقيقي بتقنيات AI حقيقية — بدون وعود زائفة.</span>
        </div>
      </footer>
    </div>
  );
}

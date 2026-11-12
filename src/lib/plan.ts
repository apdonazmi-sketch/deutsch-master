import { estimateJourney, newWordsPerDay, GOAL_LABELS, TOPIC_LABELS, FEAR_LABELS, LEVEL_LABELS, nextLevel, todayKey } from "./levels";

export interface ProfileInput {
  goal: string;
  customGoal?: string;
  currentLevel: string;
  targetLevel: string;
  months: number;
  dailyMinutes: number;
  styles: string[];
  topics: string[];
  fears: string[];
  dialect: string;
  transition: string;
}

export const STYLE_LABELS: Record<string, string> = {
  conversation: "المحادثة والتحدث",
  listening: "الاستماع والتكرار",
  visual: "الصور والرسومات",
  games: "الألعاب والتحديات",
  stories: "مشاهدة المواقف والقصص",
  reading: "القراءة والكتابة",
  mixed: "خليط من كل الطرق",
};

export function buildReport(p: ProfileInput) {
  const est = estimateJourney(p.currentLevel, p.targetLevel, p.dailyMinutes, p.months);
  const perDay = newWordsPerDay(p.dailyMinutes);

  const strengths: string[] = [];
  if (p.styles.includes("conversation")) strengths.push("حبك للمحادثة هيسرّع تطورك في التحدث - أصعب مهارة وأهمها.");
  if (p.styles.includes("listening")) strengths.push("الاستماع المنتظم بيبني فهم حقيقي للألماني الطبيعي.");
  if (p.styles.includes("mixed")) strengths.push("تنويع أساليب التعلم بيثبت المعلومة من أكتر من اتجاه.");
  if (p.styles.includes("stories")) strengths.push("التعلم بالمواقف والقصص بيخلي الكلام يثبت في الذاكرة.");
  if (p.styles.includes("games")) strengths.push("حماسك للتحديات هيخليك مداوم - والمداومة كل حاجة.");
  if (p.styles.includes("reading")) strengths.push("القراءة والكتابة بيدوك دقة لغوية عالية مع الوقت.");
  if (p.dailyMinutes >= 60) strengths.push("وقتك اليومي كبير - ده هيفرق جدًا في سرعة التقدم.");
  if (strengths.length === 0) strengths.push("قرارك إنك تتعلم بخطة منظمة هو أهم نقطة قوة.");

  const weaknesses: string[] = [];
  if (p.fears.includes("pronunciation")) weaknesses.push("النطق: هنشتغل على مخارج الحروف من الأسبوع الأول بتمارين صوتية قصيرة.");
  if (p.fears.includes("grammar")) weaknesses.push("القواعد: هناخدها بطريقة مصرية بسيطة، قاعدة واحدة كل مرة مع تطبيق فوري.");
  if (p.fears.includes("understanding")) weaknesses.push("فهم الألمان: جلسات استماع يومية تبدأ بطيئة وتتسرع تدريجيًا.");
  if (p.fears.includes("sentences")) weaknesses.push("تكوين الجمل: هتتمرن على القاعدة الذهبية (الفعل في المكان التاني) كل يوم.");
  if (p.fears.includes("forgetting")) weaknesses.push("نسيان الكلمات: نظام التكرار المتباعد بيراجعكل كل كلمة في الوقت المظبوط قبل ما تنساها.");
  if (p.fears.includes("speaking_fear")) weaknesses.push("الخوف من الكلام: المحادثات معايا آمنة 100% - اغلط براحتك، مفيش حد بيسمع.");
  if (weaknesses.length === 0) weaknesses.push("مفيش مخاوف واضحة - استغل ده واشتغل بثقة.");

  const milestones: { level: string; fromNow: string }[] = [];
  let acc = 0;
  const order = ["NONE", "SOME", "A1", "A2", "B1", "B2", "C1", "C2"];
  const start = order.indexOf(p.currentLevel);
  const end = order.indexOf(p.targetLevel);
  const hoursMap: Record<string, number> = { NONE: 0, SOME: 40, A1: 90, A2: 210, B1: 420, B2: 740, C1: 1150, C2: 1750 };
  const monthly = (p.dailyMinutes * 30.4) / 60;
  for (let i = Math.max(start + 1, 2); i <= end; i++) {
    const h = hoursMap[order[i]] - hoursMap[order[start]];
    acc = h;
    const m = Math.max(1, Math.round((acc / Math.max(monthly, 1)) * 1.15));
    milestones.push({ level: order[i], fromNow: `بعد ~${m} شهر` });
  }

  return {
    goalLabel: p.customGoal && p.goal === "other" ? p.customGoal : GOAL_LABELS[p.goal] ?? p.goal,
    currentLevelLabel: LEVEL_LABELS[p.currentLevel as keyof typeof LEVEL_LABELS] ?? p.currentLevel,
    targetLevelLabel: LEVEL_LABELS[p.targetLevel as keyof typeof LEVEL_LABELS] ?? p.targetLevel,
    estimate: est,
    newWordsPerDay: perDay,
    strengths,
    weaknesses,
    topics: p.topics.map((t) => TOPIC_LABELS[t] ?? t),
    milest: milestones,
    weeklyShape: [
      "كل يوم: مراجعة كلمات + كلمات جديدة + قاعدة بسيطة + محادثة صوتية",
      "٣ مرات أسبوعيًا: محاكاة موقف حقيقي في ألمانيا",
      "٣ مرات أسبوعيًا: استماع مركّز لمحادثة مستواك",
      "آخر الأسبوع: اختبار صغير + تقرير تطور وتعديل الخطة",
    ],
    honestNote: "مفيش حاجة اسمها إتقان مضمون في مدة معينة - بس فيه تقدم مضمون لو مشيت على الخطة. أنا هظبط إيقاعك كل أسبوع.",
  };
}

export type DailyTask = {
  id: string;
  title: string;
  desc: string;
  minutes: number;
  href: string;
  icon: string;
};

export function buildDailyTasks(dailyMinutes: number, dueCount: number): DailyTask[] {
  const f = dailyMinutes / 60; // scale relative to 60 min baseline
  const m = (base: number, min: number, max: number) => Math.max(min, Math.min(max, Math.round(base * f)));
  const perDay = newWordsPerDay(dailyMinutes);
  return [
    { id: "review", title: "مراجعة الكلمات", desc: dueCount > 0 ? `${dueCount} كلمة مستنية مراجعة` : "راجع كلماتك القديمة بنظام التكرار المتباعد", minutes: m(6, 3, 15), href: "/vocabulary?mode=review", icon: "RefreshCw" },
    { id: "newwords", title: "كلمات جديدة", desc: `${perDay} كلمات جديدة من مستواك - مع أدوات التعريف وأمثلة واقعية`, minutes: m(6, 3, 12), href: "/vocabulary?mode=learn", icon: "BookOpen" },
    { id: "grammar", title: "درس القواعد", desc: "قاعدة واحدة بس بشرح مصري بسيط وأمثلة من حياتك", minutes: m(8, 4, 15), href: "/grammar", icon: "Ruler" },
    { id: "listening", title: "تدريب استماع", desc: "اسمع محادثة حقيقية بمستواك وجاوب على الأسئلة", minutes: m(7, 3, 14), href: "/listening", icon: "Headphones" },
    { id: "conversation", title: "محادثة مع المدرس", desc: "اتكلم معايا بالألماني - أنا معلمك الألماني الشخصي", minutes: m(12, 5, 25), href: "/tutor", icon: "MessageCircle" },
    { id: "pronunciation", title: "تمرين النطق", desc: "انطق جمل ألمانية وهقيم نطقك كلمة كلمة", minutes: m(6, 3, 12), href: "/tutor?mode=pronounce", icon: "Mic" },
    { id: "quiz", title: "اختبار سريع", desc: "٨ أسئلة بس على اللي اتعلمته - عشان تثبت المعلومة", minutes: m(5, 3, 10), href: "/tests", icon: "ClipboardCheck" },
    { id: "mission", title: "مهمة حقيقية", desc: "محاكاة موقف من الحياة في ألمانيا: مطعم، دكتور، انترفيو... وأنا هلعب الدور التاني", minutes: m(7, 4, 15), href: "/scenarios", icon: "MapPin" },
  ];
}

// ---------- Weekly adaptive analysis ----------
export interface WeekStats {
  minutes: number;
  sessions: number;
  wordsLearned: number;
  wordsRetained: number; // quality >= 3
  wordsTotal: number;
  listeningScore: number;
  speakingScore: number;
  grammarScore: number;
  conversations: number;
  quizAvg: number;
}

export function buildWeeklyReport(stats: WeekStats, prevAvg: number | null, dailyMinutes: number, struggles: string[]): {
  summary: string;
  improved: string[];
  focusNextWeek: string[];
  adjustments: string[];
} {
  const improved: string[] = [];
  const focus: string[] = [];
  const adjustments: string[] = [];

  if (stats.minutes > 0) improved.push(`درست ${stats.minutes} دقيقة الأسبوع ده`);
  if (stats.wordsLearned > 0) improved.push(`اتعلمت ${stats.wordsLearned} كلمة جديدة`);
  if (stats.conversations > 0) improved.push(`عملت ${stats.conversations} محادثة بالألماني`);

  const weakest = [
    { skill: "الاستماع", score: stats.listeningScore },
    { skill: "التحدث", score: stats.speakingScore },
    { skill: "القواعد", score: stats.grammarScore },
  ].sort((a, b) => a.score - b.score)[0];

  focus.push(`التركيز الأسبوع الجاي: ${weakest.skill} (أقل نتيجة: ${weakest.score}%)`);
  if (stats.wordsTotal > 0 && stats.wordsRetained / stats.wordsTotal < 0.6) {
    focus.push("نسبة تذكر الكلمات أقل من 60% - هنقلل الكلمات الجديدة ونزود المراجعة");
    adjustments.push("قلّلت الكلمات الجديدة اليومية علشان تثبت القديمة الأول");
  }
  if (stats.listeningScore < 60 && stats.listeningScore > 0) {
    adjustments.push("زوّدت جلسات الاستماع في خطة الأسبوع الجاي");
  }
  if (stats.speakingScore < 60 && stats.speakingScore > 0) {
    adjustments.push("زوّدت محادثات قصيرة سهلة في الخطة");
  }
  if (stats.minutes < dailyMinutes * 3 && dailyMinutes > 0) {
    adjustments.push("قسمت الجلسات لأجزاء أصغر تناسب وقتك الفعلي - الصغر أحسن من الانقطاع");
  }
  if (struggles.length > 0) {
    focus.push(`الأخطاء المتكررة في المحادثة: ${struggles.slice(0, 3).join("، ")}`);
  }
  if (prevAvg !== null && stats.quizAvg > prevAvg) improved.push(`متوسط الاختبارات تحسّن من ${prevAvg}% لـ ${stats.quizAvg}%`);
  if (improved.length === 0) improved.push("بدأت الرحلة - أول أسبوع هو الأصعب وانت عديته");

  const summary =
    stats.minutes === 0
      ? "الأسبوع ده كان قليل في الدراسة - مش مشكلة، هنكمل من فين ما وقفنا من غير ما تبدأ من الصفر."
      : `أسبوع كويس! متوسط اختباراتك ${stats.quizAvg}% و${stats.wordsRetained} كلمة اثبتت في الدماغ. ${weakest.skill} محتاج شوية شغل الأسبوع الجاي.`;

  return { summary, improved, focusNextWeek: focus, adjustments };
}

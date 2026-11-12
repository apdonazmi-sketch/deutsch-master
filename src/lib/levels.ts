// CEFR model + honest hour estimates (based on Goethe-Institut / FSI guidance).
// Guided hours are approximations - never promised guarantees.

export const LEVEL_ORDER = ["NONE", "SOME", "A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type LevelKey = (typeof LEVEL_ORDER)[number];

export const LEVEL_LABELS: Record<LevelKey, string> = {
  NONE: "من الصفر",
  SOME: "كلمات بسيطة",
  A1: "مبتدئ A1",
  A2: "أساسي A2",
  B1: "متوسط B1",
  B2: "فوق المتوسط B2",
  C1: "متقدم C1",
  C2: "إتقان C2",
};

// Cumulative guided hours typically needed to REACH each level from zero.
export const CUMULATIVE_HOURS: Record<LevelKey, number> = {
  NONE: 0,
  SOME: 40,
  A1: 90,
  A2: 210,
  B1: 420,
  B2: 740,
  C1: 1150,
  C2: 1750,
};

export function levelIndex(level: string): number {
  const i = LEVEL_ORDER.indexOf(level as LevelKey);
  return i < 0 ? 0 : i;
}

// Effective study level: absolute beginners learn at A1 content level.
export function studyLevel(currentLevel: string): "A1" | "A2" | "B1" | "B2" | "C1" | "C2" {
  const i = levelIndex(currentLevel);
  if (i <= 2) return "A1";
  return currentLevel as "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
}

export function nextLevel(current: string): string {
  if (current === "NONE") return "A1";
  if (current === "SOME") return "A1";
  const i = levelIndex(current);
  return LEVEL_ORDER[Math.min(i + 1, LEVEL_ORDER.length - 1)];
}

export interface TimeEstimate {
  totalHours: number;
  monthsOptimistic: number;
  monthsRealistic: number;
  monthsAtPace: number;
  dailyMinutes: number;
  feasible: boolean;
  note: string;
}

export function estimateJourney(current: string, target: string, dailyMinutes: number, wishedMonths: number): TimeEstimate {
  const hours = Math.max(20, CUMULATIVE_HOURS[target as LevelKey] - CUMULATIVE_HOURS[current as LevelKey]);
  const monthlyHours = (dailyMinutes * 30.4) / 60;
  const monthsAtPace = Math.max(1, Math.ceil(hours / Math.max(monthlyHours, 1)));
  const realistic = Math.ceil(monthsAtPace * 1.2);
  const feasible = monthsAtPace <= wishedMonths;
  const note = feasible
    ? "خطتك الزمنية واقعية وممكن تحققها بالتزام يومي منتظم."
    : `المدة اللي حددتها أسرع من المعتاد. علشان توصل ${target} في ${wishedMonths} شهر محتاج حوالي ${Math.ceil(hours / wishedMonths)} ساعة شهريًا. الالتزام أهم من السرعة - وهنظبط الخطة على إيقاعك.`;
  return {
    totalHours: hours,
    monthsOptimistic: monthsAtPace,
    monthsRealistic: realistic,
    monthsAtPace,
    dailyMinutes,
    feasible,
    note,
  };
}

export function newWordsPerDay(dailyMinutes: number): number {
  if (dailyMinutes <= 15) return 4;
  if (dailyMinutes <= 30) return 6;
  if (dailyMinutes <= 60) return 8;
  if (dailyMinutes <= 120) return 10;
  return 12;
}

export function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export const GOAL_LABELS: Record<string, string> = {
  travel_work: "السفر والعمل في ألمانيا",
  study: "الدراسة أو Ausbildung",
  migrate: "الهجرة والاستقرار",
  german_company: "العمل في شركة ألمانية",
  communicate: "التواصل مع الألمان",
  certificate: "الحصول على شهادة لغة",
  other: "أسباب شخصية",
};

export const TOPIC_LABELS: Record<string, string> = {
  daily: "الحياة اليومية",
  work: "العمل والوظائف",
  travel: "السفر والمطار",
  food: "المطاعم والتسوق",
  tech: "التكنولوجيا والذكاء الاصطناعي",
  sport: "الرياضة",
  social: "العلاقات الاجتماعية",
  germany: "الحياة في ألمانيا",
  other: "اهتمامات خاصة",
};

export const FEAR_LABELS: Record<string, string> = {
  pronunciation: "صعوبة النطق",
  grammar: "القواعد",
  understanding: "عدم فهم الألمان",
  sentences: "عدم القدرة على تكوين جمل",
  forgetting: "نسيان الكلمات",
  speaking_fear: "الخوف من التحدث",
};

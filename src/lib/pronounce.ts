// Approximate pronunciation scoring: compares a speech-to-text transcript
// with the target sentence at word level. This is an approximation, NOT a
// certified pronunciation judgment.

function normalize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[.,!?;:«»"„“]/g, "")
    .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss")
    .split(/\s+/)
    .filter(Boolean);
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp: number[] = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[n];
}

export interface WordScore {
  target: string;
  heard: string | null;
  ok: boolean;
  sim: number;
}

export interface PronounceResult {
  score: number; // 0-100
  words: WordScore[];
  verdictAr: string;
  tipAr: string;
}

export function scorePronunciation(target: string, heard: string): PronounceResult {
  const tWords = normalize(target);
  const hWords = normalize(heard);
  const words: WordScore[] = tWords.map((t, i) => {
    // find best match in heard within window
    let best: string | null = null;
    let bestSim = 0;
    for (let j = Math.max(0, i - 2); j < Math.min(hWords.length, i + 3); j++) {
      const d = levenshtein(t, hWords[j]);
      const sim = 1 - d / Math.max(t.length, hWords[j].length);
      if (sim > bestSim) { bestSim = sim; best = hWords[j]; }
    }
    return { target: t, heard: best, ok: bestSim >= 0.6, sim: Math.round(bestSim * 100) };
  });

  const coverage = hWords.length / Math.max(tWords.length, 1);
  const okRatio = words.filter((w) => w.ok).length / Math.max(words.length, 1);
  const avgSim = words.reduce((s, w) => s + w.sim, 0) / Math.max(words.length, 1);
  const score = Math.max(0, Math.min(100, Math.round(avgSim * 0.7 + okRatio * 100 * 0.3 * Math.min(coverage, 1))));

  const hardWords = words.filter((w) => !w.ok).map((w) => w.target);
  let verdictAr = "ممتاز! النطق قريب جدًا من الصح";
  if (score < 50) verdictAr = "محتاج تمرين - كلمة كلمة وبالراحة";
  else if (score < 70) verdictAr = "كويس، بس فيه حاجات محتاجة تتظبط";
  else if (score < 85) verdictAr = "كويس جدًا! تفاصيل صغيرة بس";
  let tipAr = "اسمع النموذج الأول، وبعدين قول الجملة بصوت عالي بسرعة طبيعية.";
  if (hardWords.length > 0) tipAr = `ركز على الكلمات دي: ${hardWords.slice(0, 3).join("، ")}. قولها لوحدها الأول.`;

  return { score, words, verdictAr, tipAr };
}

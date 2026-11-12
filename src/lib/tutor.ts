import { ARTICLE_OF } from "./data/vocab";
import { Scenario } from "./data/scenarios";

export type TutorReply = {
  german: string;
  arabic: string;
  correction: string | null;
  tip?: string | null;
  scenarioDone?: boolean;
  stepAdvanced?: boolean;
  mistakes?: string[];
};

const containsArabic = (s: string) => /[\u0600-\u06FF]/.test(s);

const MOVEMENT_PARTICIPLES = ["gegangen", "gefahren", "gekommen", "geflogen", "gelaufen", "gereist", "gezogen"];

// ---------- Error analysis (conservative, honest heuristics) ----------
export function analyzeGerman(input: string): string | null {
  const text = input.trim();
  const lower = text.toLowerCase();
  const issues: string[] = [];

  // wrong conjugations of sein after pronoun
  const seinFixes: [RegExp, string, string][] = [
    [/\bich (sind|bist|seid)\b/i, "ich bin", "بعد ich بنستخدم bin مش sind/bist"],
    [/\bdu (ist|bin|seid)\b/i, "du bist", "بعد du بنستخدم bist"],
    [/\b(er|sie|es) (bin|bist|sind)\b/i, "er/sie/es ist", "بعد er/sie/es بنستخدم ist"],
    [/\bwir (bin|bist|ist)\b/i, "wir sind", "بعد wir بنستخدم sind"],
    [/\bich habe\b/i, "", ""],
  ];
  for (const [re, fix, why] of seinFixes) {
    if (fix && re.test(text)) issues.push(`${why}: الأصح "${fix}"`);
    if (re === seinFixes[4][0]) break;
  }

  // ich + wrongly conjugated common verbs
  const ichVerbs: [RegExp, string][] = [
    [/\bich (gehst|geht)\b/i, "ich gehe"],
    [/\bich (kommst|kommt)\b/i, "ich komme"],
    [/\bich (machst|macht)\b/i, "ich mache"],
    [/\bich (arbeitest)\b/i, "ich arbeite"],
    [/\bich (sprichst|spricht)\b/i, "ich spreche"],
    [/\bich (isst)\b/i, "ich esse"],
    [/\bich (trinkst|trinkt)\b/i, "ich trinke"],
    [/\bich (lernst|lernt)\b/i, "ich lerne"],
    [/\bich (wohnst|wohnt)\b/i, "ich wohne"],
  ];
  for (const [re, fix] of ichVerbs) {
    if (re.test(text)) { issues.push(`التصريف غلط: الأصح "${fix}"`); break; }
  }

  // Perfekt with haben for movement verbs
  for (const p of MOVEMENT_PARTICIPLES) {
    const re = new RegExp(`\\b(ich|du|er|sie|wir) habe\\b[^.!?]*\\b${p}\\b`, "i");
    if (re.test(text)) {
      issues.push(`أفعال الحركة زي "${p}" بتاخد sein مش haben في الـ Perfekt: قول "ich bin ... ${p}"`);
      break;
    }
  }

  // wrong article before known nouns
  const tokens = text.split(/\s+/);
  for (let i = 0; i < tokens.length - 1; i++) {
    const det = tokens[i].toLowerCase().replace(/[.,!?]/g, "");
    const noun = tokens[i + 1].replace(/[.,!?]/g, "");
    if (["der", "die", "das"].includes(det)) {
      const correct = ARTICLE_OF[noun.toLowerCase()];
      if (correct && correct !== det) {
        issues.push(`الأداة غلط: الصح "${correct} ${noun}" مش "${det} ${noun}"`);
      }
    }
  }

  // verb-second after time adverbials
  const verbSecond = lower.match(/^(morgen|heute|gestern|jetzt|dann|danach|später)\s+(ich|du|er|sie|wir)\s+(\w+)/);
  if (verbSecond) {
    issues.push(`ترتيب الجملة: لما تبدأ بـ "${verbSecond[1]}" الفعل المفروض ييجي تاني على طول: "${verbSecond[1]} ${verbSecond[3]} ${verbSecond[2]} ..."`);
  }

  if (issues.length === 0) return null;
  return issues.slice(0, 2).join(" · ");
}

// ---------- Free conversation engine ----------
const GREET_RE = /\b(hallo|servus|na)\b|\bguten (morgen|tag|abend|nachmittag)\b/i;

type TopicPool = { keys: string[]; replies: { a1: string[]; a1Ar: string[]; b: string[]; bAr: string[] } };

const TOPICS: TopicPool[] = [
  {
    keys: ["essen", "hunger", "pizza", "restaurant", "kaffee", "frühstück", "kuchen", "cola", "möchte"],
    replies: {
      a1: ["Lecker! Ich esse auch gern Pizza. Was isst du gern?", "Essen ist ein gutes Thema! Was kochst du gern?"],
      a1Ar: ["تحفة! أنا كمان بحب البيتزا. بتحب تاكل إيه؟", "الأكل موضوع جميل! بتحب تطبخ إيه؟"],
      b: ["Essen verbindet Menschen! In Deutschland isst man mittags oft warm. Was ist dein ägyptisches Lieblingsessen?", "Hmm, das klingt gut! Ich persönlich liebe ägyptisches Essen - Koshari ist fantastisch. Kochst du selbst?"],
      bAr: ["الأكل بيجمّع الناس! في ألمانيا بياكلوا أكل سخن الضهر عادة. إيه أكلك المصري المفضل؟", "همم، ده يبدو حلو! أنا شخصيًا بحب الأكل المصري - الكشري رائع. بتطبخ بنفسك؟"],
    },
  },
  {
    keys: ["arbeit", "job", "büro", "chef", "arbeite", "firma", "kollege", "stelle", "bewerbung"],
    replies: {
      a1: ["Arbeit ist wichtig! Was arbeitest du?", "Oh, Arbeit! Arbeitest du gern?"],
      a1Ar: ["الشغل مهم! بتشتغل إيه؟", "أوه، الشغل! بتحب شغلك؟"],
      b: ["Arbeit nimmt viel Zeit im Leben ein. Was gefällt dir an deinem Job besonders? Was würdest du ändern?", "Interessant! Wie sieht dein typischer Arbeitstag aus? Erzähl mir mehr."],
      bAr: ["الشغل بياخد وقت كبير من حياتنا. إيه اللي بيعجبك في شغلك؟ وإيه اللي كنت تحب تغيره؟", "مثير للاهتمام! يومك في الشغل بيبقى عامل إزاي؟ احكيلي أكتر."],
    },
  },
  {
    keys: ["fußball", "sport", "spielen", "fitness", "laufen", "schwimmen"],
    replies: {
      a1: ["Sport ist gesund! Welchen Sport magst du?", "Fußball ist in Deutschland sehr beliebt! Hast du eine Lieblingsmannschaft?"],
      a1Ar: ["الرياضة صحية! بتحب أنهي رياضة؟", "الكورة مشهورة جدًا في ألمانيا! عندك فريق مفضل؟"],
      b: ["Sport hält fit und macht den Kopf frei. Treibst du regelmäßig Sport? Welcher Sport macht dir am meisten Spaß?", "In Deutschland ist Fußball fast eine Religion! Schaust du die Bundesliga?"],
      bAr: ["الرياضة بتخلي الواحد فت وبتريح الدماغ. بتلعب رياضة بانتظام؟ أنهي رياضة مسلية ليك أكتر؟", "في ألمانيا الكورة شبه ديانة! بتتفرج على البوندسليجا؟"],
    },
  },
  {
    keys: ["reise", "reisen", "flug", "urlaub", "fahren", "stadt", "berlin", "münchen", "ägypten"],
    replies: {
      a1: ["Reisen ist schön! Wohin möchtest du gern reisen?", "Berlin ist eine tolle Stadt! Warst du schon mal dort?"],
      a1Ar: ["السفر حاجة جميلة! عايز تسافر فين؟", "برلين مدينة تحفة! رحتها قبل كده؟"],
      b: ["Reisen öffnet den Horizont! Was war deine schönste Reise? Erzähl mir davon.", "Deutschland hat viele schöne Städte - Berlin, Hamburg, München. Welche Stadt interessiert dich am meisten?"],
      bAr: ["السفر بيفتح الآفاق! إيه أحلى رحلة عملتها؟ احكيلي عنها.", "ألمانيا فيها مدن حلوة كتير - برلين، هامبورج، ميونخ. أنهي مدينة مهتم بيها أكتر؟"],
    },
  },
  {
    keys: ["lernen", "deutsch", "sprache", "kurs", "schwer", "schwierig", "grammatik"],
    replies: {
      a1: ["Du lernst schon gut! Was findest du schwierig?", "Deutsch macht Spaß, oder? Übung macht den Meister!"],
      a1Ar: ["انت بتتعلم كويس أوي! إيه الصعب بالنسبالك؟", "الألماني حلو، صح؟ الممارسة بتعمل معلم!"],
      b: ["Sprachen lernen braucht Geduld. Was hilft dir beim Lernen am meisten? Ich finde, Sprechen ist der Schlüssel.", "Grammatik ist das Gerüst der Sprache. Welches Thema findest du am schwierigsten? Ich helfe dir gern."],
      bAr: ["تعلم اللغة محتاج صبر. إيه اللي بيساعدك في التعلم أكتر؟ أنا شايف إن الكلام هو المفتاح.", "القواعد هيا هيكل اللغة. أنهي موضوع صعب عليك؟ أنا هساعدك."],
    },
  },
  {
    keys: ["müde", "morgen", "heute", "tag", "wetter", "regen", "sonne", "kalt", "warm"],
    replies: {
      a1: ["Ja, das Wetter ist wichtig! Ist es bei dir heute warm?", "Der Tag war lang? Ich verstehe. Was machst du heute noch?"],
      a1Ar: ["أيوه، الجو مهم! الجو عندك النهاردة حر؟", "اليوم كان طويل؟ فاهمك. هتعمل إيه تاني النهاردة؟"],
      b: ["Das Wetter ist das perfekte Smalltalk-Thema! In Deutschland regnet es oft. Wie ist das Wetter bei dir gerade?", "Ein langer Tag, hm? Was war heute los? Erzähl mir von deinem Tag."],
      bAr: ["الجو هو موضوع السالفة الأمثل! في ألمانيا بتمطر كتير. الجو عندك دلوقتي عامل إزاي؟", "يوم طويل، ها؟ إيه اللي حصل النهاردة؟ احكيلي عن يومك."],
    },
  },
];

const FALLBACK_DE = ["Das ist interessant! Erzähl mir mehr davon.", "Verstehe! Und was machst du heute?", "Gut gesagt! Womit kann ich dir beim Deutschlernen helfen?", "Aha! Magst du mir mehr über dich erzählen?"];
const FALLBACK_AR = ["ده مثير للاهتمام! احكيلي أكتر.", "فاهمك! وهتعمل إيه النهاردة؟", "كلام جميل! أقدر أساعدك في إيه في الألماني؟", "أها! تحب تحكيلي عن نفسك أكتر؟"];

const PRAISE_DE = ["Sehr gut!", "Prima!", "Genau richtig!", "Toll!", "Super Deutsch!"];

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

// ---------- Arabic micro-answers ----------
function arabicReply(message: string, turn: number): TutorReply {
  const lower = message;
  const phrases: [string, string, string][] = [
    ["صباح الخير", "Guten Morgen", "قولها للمعلم أو في الشغل - Guten Morgen"],
    ["مساء الخير", "Guten Abend", "للوقت المتأخر - Guten Abend"],
    ["ازاي اقول عايز", "Ich möchte ...", "أدبية ومفيدة جدًا: Ich möchte einen Kaffee = عايز قهوة"],
    ["فين الحمام", "Wo ist die Toilette?", "سؤال مهم جدًا في ألمانيا: Wo ist die Toilette?"],
    ["بكام", "Was kostet das?", "عند الشراء: Was kostet das? = ده بكام؟"],
    ["مع السلامة", "Tschüss / Auf Wiedersehen", "Tschüss بين الأصحاب، Auf Wiedersehen رسمي أكتر"],
    ["شكرا", "Danke", "وللرد على الشكر: Bitte = العفو"],
    ["مش فاهم", "Ich verstehe nicht", "جملة هتنقذك كتير في الأول: Ich verstehe nicht, langsamer bitte!"],
  ];
  for (const [key, de, hint] of phrases) {
    if (lower.includes(key)) {
      return {
        german: de,
        arabic: hint,
        correction: null,
        tip: "جرب تقولها بصوت عالي بعد ما تسمعها، الصوت بيثبت الكلمة في دماغك.",
      };
    }
  }
  const generic = [
    { de: "Kein Problem, ich helfe dir!", ar: "مفيش مشكلة، أنا هساعدك! جرب تتكلم بالألماني، حتى لو غلط - الغلط هو اللي بيعلّم." },
    { de: "Versuch es auf Deutsch!", ar: "جرب تقولها بالألماني! لو مش عارف كلمة، استخدم كلمات بسيطة - أنا فاهمك وأصححلك." },
    { de: "Gute Frage!", ar: "سؤال حلو! خليني أقولك حاجة مهمة: الكلام اليومي معايا هو أسرع طريقة تتعلم بيها. ابدأ بجملة بسيطة بالألماني!" },
  ];
  const g = generic[turn % generic.length];
  return { german: g.de, arabic: g.ar, correction: null, tip: "تلميح: اكتب جملة ألمانية بسيطة، حتى لو فيها غلط - أنا هصححلك فورًا." };
}

// ---------- Scenario step runner ----------
export function runScenario(
  scenario: Scenario,
  step: number,
  userMessage: string,
  turn: number
): { reply: TutorReply; nextStep: number; done: boolean; mistake: string | null } {
  const isFirst = userMessage === "__start__";
  if (isFirst || step < 0) {
    const s = scenario.steps[0];
    return {
      reply: { german: s.tutor.de, arabic: s.tutor.ar, correction: null, tip: `الهدف: ${s.hint}` },
      nextStep: 0,
      done: false,
      mistake: null,
    };
  }

  const s = scenario.steps[step];
  const correction = analyzeGerman(userMessage);
  const lower = userMessage.toLowerCase();
  const intent = s.intents.find((it) => it.keys.some((k) => lower.includes(k)));

  if (!intent) {
    return {
      reply: {
        german: s.fallback.de,
        arabic: `${s.fallback.ar} (ممكن تقول: ${s.hint})`,
        correction: correction || "مش لاقي كلمات مفتاحية للموقف ده - جرب تاني بكلمات مناسبة.",
        tip: null,
      },
      nextStep: step,
      done: false,
      mistake: "رد مش مناسب للموقف",
    };
  }

  const isLast = step >= scenario.steps.length - 1;
  if (isLast || intent.reply.de === "") {
    return {
      reply: {
        german: scenario.outro.de,
        arabic: scenario.outro.ar,
        correction,
        tip: null,
      },
      nextStep: step + 1,
      done: true,
      mistake: null,
    };
  }

  const nextS = scenario.steps[step + 1];
  return {
    reply: {
      german: `${intent.reply.de}\n${nextS.tutor.de}`,
      arabic: `${intent.reply.ar}\n${nextS.tutor.ar}`,
      correction,
      tip: `الخطوة الجاية: ${nextS.hint}`,
    },
    nextStep: step + 1,
    done: false,
    mistake: null,
  };
}

// ---------- Free conversation ----------
export function freeReply(message: string, turn: number, level: string): TutorReply {
  if (containsArabic(message)) return arabicReply(message, turn);

  const lower = message.toLowerCase();
  const correction = analyzeGerman(message);
  const advanced = ["B1", "B2", "C1", "C2"].includes(level);

  if (GREET_RE.test(message)) {
    const time = level === "A1" ? "Guten Tag! Schön, dich zu sehen! Wie heißt du?" : "Hallo! Sehr schön, dass du da bist. Wie geht es dir heute?";
    const ar = level === "A1" ? "نهارك سعيد! مبسوط إني شايفك! اسمك إيه؟" : "أهلًا! مبسوطة أوي إنك هنا. عامل إيه النهاردة؟";
    return { german: time, arabic: ar, correction };
  }

  if (lower.includes("wie heiße") || lower.includes("ich heiße") || lower.includes("mein name")) {
    return {
      german: advanced ? "Freut mich sehr! Erzähl mir ein bisschen über dich - woher kommst du und was machst du?" : "Freut mich! Und woher kommst du?",
      arabic: advanced ? "شرف ليا! احكيلي شوية عن نفسك - جاي منين وبتعمل إيه؟" : "شرف ليا! وجاي منين؟",
      correction,
    };
  }

  for (const topic of TOPICS) {
    if (topic.keys.some((k) => lower.includes(k))) {
      const i = turn % topic.replies.a1.length;
      return {
        german: advanced ? topic.replies.b[i] : topic.replies.a1[i],
        arabic: advanced ? topic.replies.bAr[i] : topic.replies.a1Ar[i],
        correction,
      };
    }
  }

  const i = turn % FALLBACK_DE.length;
  return {
    german: `${pick(PRAISE_DE, turn)} ${FALLBACK_DE[i]}`,
    arabic: FALLBACK_AR[i],
    correction,
  };
}

// ---------- Optional LLM (OpenAI-compatible) ----------
export async function llmReply(
  systemPrompt: string,
  history: { role: string; content: string }[],
  message: string
): Promise<TutorReply | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const base = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          ...history.slice(-10),
          { role: "user", content: message },
        ],
      }),
    });
    clearTimeout(t);
    if (!res.ok) return null;
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content);
    if (!parsed.german) return null;
    return {
      german: String(parsed.german),
      arabic: String(parsed.arabic ?? ""),
      correction: parsed.correction ? String(parsed.correction) : null,
      tip: parsed.tip ? String(parsed.tip) : null,
    };
  } catch {
    return null;
  }
}

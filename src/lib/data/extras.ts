// Listening dialogues, pronunciation drills, and quiz banks.

export type ListeningLine = { speaker: string; de: string; ar: string };
export type ListeningDialogue = {
  id: string;
  level: string;
  titleAr: string;
  lines: ListeningLine[];
  questions: QuizQuestion[];
};

export type QuizQuestion = {
  id: string;
  q: string; // question text (Arabic or German)
  qAr?: string;
  options: string[];
  answer: number;
  explainAr?: string;
};

export const LISTENING: ListeningDialogue[] = [
  {
    id: "l-a1-1", level: "A1", titleAr: "أول يوم في المكتب",
    lines: [
      { speaker: "Anna", de: "Guten Morgen! Sie sind neu hier, oder?", ar: "صباح الخير! انت جديد هنا صح؟" },
      { speaker: "Ahmed", de: "Ja, guten Morgen. Ich heiße Ahmed und ich fange heute an.", ar: "أيوه صباح الخير. اسمي أحمد والنهاردة أول يوم شغل." },
      { speaker: "Anna", de: "Willkommen! Ich bin Anna. Ich zeige Ihnen alles.", ar: "أهلًا بيك! أنا آنا. هعرّفك على كل حاجة." },
      { speaker: "Ahmed", de: "Danke! Wo ist die Kaffeemaschine?", ar: "شكرًا! فين آلة القهوة؟" },
      { speaker: "Anna", de: "In der Küche, links neben dem Kühlschrank.", ar: "في المطبخ، على الشمال جنب التلاجة." },
    ],
    questions: [
      { id: "l1q1", q: "مين بيشتغل هنا من زمان؟", options: ["أحمد", "آنا", "الاتنين", "ولا واحد"], answer: 1, explainAr: "آنا هي اللي بتعرّف أحمد على المكان فهي القديمة." },
      { id: "l1q2", q: "إيه أول حاجة سأل عنها أحمد؟", options: ["الحمام", "آلة القهوة", "مكتبه", "الأكل"], answer: 1 },
      { id: "l1q3", q: "آلة القهوة فين؟", options: ["في المكتب", "يمين التلاجة", "في المطبخ شمال التلاجة", "في الشارع"], answer: 2 },
    ],
  },
  {
    id: "l-a1-2", level: "A1", titleAr: "في المقهى",
    lines: [
      { speaker: "Kellner", de: "Guten Tag! Was darf es sein?", ar: "نهارك سعيد! تطلب إيه؟" },
      { speaker: "Sara", de: "Ich hätte gern einen Cappuccino und ein Stück Kuchen.", ar: "عايزة كابتشينو وقطعة جاتوه." },
      { speaker: "Kellner", de: "Gern! Welchen Kuchen möchten Sie?", ar: "اتفضلي! أنهي نوع جاتوه تحبي؟" },
      { speaker: "Sara", de: "Den Apfelkuchen, bitte. Was kostet das?", ar: "جاتوه التفاح لو سمحت. كام الحساب؟" },
      { speaker: "Kellner", de: "Zusammen 7,50 Euro.", ar: "المجموع 7.50 يورو." },
    ],
    questions: [
      { id: "l2q1", q: "سارة طلبت إيه؟", options: ["شاي وكيك", "كابتشينو وجاتوه", "قهوة سادة", "عصير"], answer: 1 },
      { id: "l2q2", q: "الحساب كان كام؟", options: ["5 يورو", "7.50 يورو", "10 يورو", "12 يورو"], answer: 1 },
      { id: "l2q3", q: "اختارت أنهي نوع جاتوه؟", options: ["توت", "شوكولاتة", "تفاح", "فراولة"], answer: 2 },
    ],
  },
  {
    id: "l-a2-1", level: "A2", titleAr: "تأخير القطر",
    lines: [
      { speaker: "Lautsprecher", de: "Achtung! Der ICE 712 nach München hat heute 25 Minuten Verspätung.", ar: "انتبهوا! القطر ICE 712 لميونخ متأخر النهاردة 25 دقيقة." },
      { speaker: "Youssef", de: "Oh nein! Ich habe einen Termin in München!", ar: "يا نهار أسود! عندي ميعاد في ميونخ!" },
      { speaker: "Mitfahrerin", de: "Kein Stress! Der Zug kommt um 12:40. Sie schaffen das.", ar: "متقلقش! القطر هيجي 12:40. هتلحق." },
      { speaker: "Youssef", de: "Hoffentlich! Danke für die Info.", ar: "يارب! شكرًا على المعلومة." },
    ],
    questions: [
      { id: "l3q1", q: "القطر متأخر قد إيه؟", options: ["15 دقيقة", "25 دقيقة", "ساعة", "مش متأخر"], answer: 1 },
      { id: "l3q2", q: "يوسف رايح فين؟", options: ["برلين", "فرانكفورت", "ميونخ", "هامبورج"], answer: 2 },
      { id: "l3q3", q: "القطر هيوصل إمتى؟", options: ["12:00", "12:40", "13:15", "11:40"], answer: 1 },
    ],
  },
  {
    id: "l-b1-1", level: "B1", titleAr: "مكالمة شغل",
    lines: [
      { speaker: "Kollegin", de: "Guten Tag, Frau Mahmoud. Ich rufe wegen des Projekts an.", ar: "نهارك سعيد يا أستاذة محمود. بكلمك علشان المشروع." },
      { speaker: "Frau Mahmoud", de: "Ah, ja. Wie weit sind Sie mit der Präsentation?", ar: "أه أيوه. وصلتي لفين في العرض؟" },
      { speaker: "Kollegin", de: "Fast fertig. Ich brauche nur noch die Zahlen aus dem letzten Quartal.", ar: "قربت أخلص. ناقصني بس أرقام الربع الأخير." },
      { speaker: "Frau Mahmoud", de: "Die schicke ich Ihnen heute Nachmittag. Können wir das Meeting auf Freitag verschieben?", ar: "هبعتهالك الضهر. ممكن نأجل الاجتماع للجمعة؟" },
      { speaker: "Kollegin", de: "Freitag passt mir gut. Dann bis dann.", ar: "الجمعة مناسبة ليا. أشوفك ساعتها." },
    ],
    questions: [
      { id: "l4q1", q: "المكالمة علشان إيه؟", options: ["الأجازة", "المشروع", "المرتب", "الإقامة"], answer: 1 },
      { id: "l4q2", q: "إيه اللي ناقص في العرض؟", options: ["الصور", "أرقام الربع الأخير", "الترجمة", "العنوان"], answer: 1 },
      { id: "l4q3", q: "الاجتماع اتأجل لإمتى؟", options: ["الخميس", "الجمعة", "الاتنين", "اتلغى خالص"], answer: 1 },
    ],
  },
];

export type PronunciationDrill = { id: string; level: string; de: string; ar: string; focus: string };
export const PRONUNCIATION: PronunciationDrill[] = [
  { id: "p1", level: "A1", de: "Guten Morgen, wie geht es Ihnen?", ar: "صباح الخير، عامل إيه؟", focus: "حرف الـ g والنبر العام" },
  { id: "p2", level: "A1", de: "Ich heiße Ahmed und komme aus Ägypten.", ar: "اسمي أحمد وجاي من مصر.", focus: "الـ ch في Ich (صوت ناعم)" },
  { id: "p3", level: "A1", de: "Ich möchte einen Kaffee, bitte.", ar: "عايز قهوة لو سمحت.", focus: "الـ ö في möchte" },
  { id: "p4", level: "A1", de: "Wo ist der Bahnhof, bitte?", ar: "فين محطة القطر لو سمحت؟", focus: "الـ W بنطق V" },
  { id: "p5", level: "A1", de: "Das ist sehr schön.", ar: "ده جميل جدًا.", focus: "sch بنطق ش" },
  { id: "p6", level: "A1", de: "Zwanzig Euro bitte.", ar: "عشرين يورو لو سمحت.", focus: "الـ W والـ Z (تس)" },
  { id: "p7", level: "A2", de: "Ich habe gestern einen Film gesehen.", ar: "شوفت فيلم امبارح.", focus: "ربط الجملة وإيقاعها" },
  { id: "p8", level: "A2", de: "Der Zug hat zwanzig Minuten Verspätung.", ar: "القطر متأخر عشرين دقيقة.", focus: "الـ V (تنطق ف) والتنغيم" },
  { id: "p9", level: "A2", de: "Ich muss zum Arzt, mir geht es nicht gut.", ar: "لازم أروح للدكتور، مش كويس.", focus: "إيقاع الجملة" },
  { id: "p10", level: "B1", de: "Meiner Meinung nach ist das eine gute Idee.", ar: "في رأيي دي فكرة كويسة.", focus: "سرعة طبيعية ونبر واثق" },
  { id: "p11", level: "B1", de: "Ich habe mich sehr über Ihre Einladung gefreut.", ar: "فرحت جدًا بالدعوة بتاعتك.", focus: "الـ R الألمانية والربط" },
  { id: "p12", level: "B1", de: "Obwohl es geregnet hat, sind wir spazieren gegangen.", ar: "رغم المطر، طلعنا نتمشى.", focus: "جملة تابعة طويلة" },
  { id: "p13", level: "B2", de: "Darüber hinaus möchte ich betonen, dass Übung der Schlüssel ist.", ar: "بالإضافة لكده، عايز أؤكد إن التمرين هو المفتاح.", focus: "عبارات رسمية بنبرة احترافية" },
  { id: "p14", level: "B2", de: "Die Entscheidung hängt von mehreren Faktoren ab.", ar: "القرار بيعتمد على عوامل كتير.", focus: "الإيقاع في الكلام المهني" },
];

export const QUIZ_BANK: Record<string, QuizQuestion[]> = {
  A1: [
    { id: "q-a1-1", q: "What is the article of : · Mann", qAr: "أداة تعريف كلمة Mann إيه؟", options: ["der", "die", "das"], answer: 0, explainAr: "der Mann - مذكر." },
    { id: "q-a1-2", q: "What is the article of : · Wohnung", qAr: "أداة تعريف كلمة Wohnung؟", options: ["der", "die", "das"], answer: 1, explainAr: "die Wohnung - مؤنث." },
    { id: "q-a1-3", q: "What is the article of : · Kind", qAr: "أداة تعريف كلمة Kind؟", options: ["der", "die", "das"], answer: 2, explainAr: "das Kind - محايد." },
    { id: "q-a1-4", q: "Ich ___ aus Ägypten.", qAr: "كمّل: أنا جاي من مصر", options: ["komme", "kommst", "kommt"], answer: 0, explainAr: "ich تأخذ -e : komme." },
    { id: "q-a1-5", q: "Er ___ bei Siemens.", qAr: "كمّل: هو بيشتغل في سيمنس", options: ["arbeitest", "arbeite", "arbeitet"], answer: 2, explainAr: "er/sie/es تأخذ -t." },
    { id: "q-a1-6", q: "___ wohnst du? - In Kairo.", qAr: "اختار أداة الاستفهام الصح", options: ["Was", "Wo", "Wann"], answer: 1, explainAr: "السؤال عن المكان = Wo." },
    { id: "q-a1-7", q: "Ich habe ___ Auto.", qAr: "كمّل: ماعنديش عربية (نفي)", options: ["nicht", "kein", "nein"], answer: 1, explainAr: "نفي اسم = kein." },
    { id: "q-a1-8", q: "Morgen ___ ich nach Berlin.", qAr: "كمّل بترتيب صحيح: بكرة رايح برلين", options: ["fahre", "ich fahre", "fahrt"], answer: 0, explainAr: "بعد Morgen الفعل في المكان التاني: Morgen fahre ich..." },
    { id: "q-a1-9", q: "Was heißt 'danke' auf Arabisch?", qAr: "إيه معنى danke؟", options: ["لو سمحت", "شكرًا", "صباح الخير"], answer: 1 },
    { id: "q-a1-10", q: "25 auf Deutsch?", qAr: "رقم 25 بالألماني", options: ["fünfzig", "fünfundzwanzig", "fünfzehn"], answer: 1 },
  ],
  A2: [
    { id: "q-a2-1", q: "Gestern ___ ich eine Pizza ___.", qAr: "امبارح أكلت بيتزا", options: ["habe ... gegessen", "bin ... gegessen", "habe ... essen"], answer: 0, explainAr: "essen ياخد haben في الـ Perfekt." },
    { id: "q-a2-2", q: "Wir ___ nach Berlin ___.", qAr: "إحنا رحنا برلين", options: ["haben ... gefahren", "sind ... gefahren", "sind ... fahren"], answer: 1, explainAr: "أفعال الحركة تاخد sein." },
    { id: "q-a2-3", q: "Der Kurs ___ um 9 Uhr ___.", qAr: "الكورس بيبدأ الساعة 9", options: ["fängt ... an", "anfängt ... -", "beginnt ... auf"], answer: 0, explainAr: "anfangen فعل منفصل: البادئة بتروح الآخر." },
    { id: "q-a2-4", q: "Ich fahre ___ dem Zug.", qAr: "بسافر بالقطر", options: ["mit", "für", "ohne"], answer: 0, explainAr: "mit = بواسطة/مع." },
    { id: "q-a2-5", q: "Was ist größer? - Berlin ist ___ als Bonn.", qAr: "برلين أكبر من بون", options: ["groß", "größer", "am größten"], answer: 1, explainAr: "المقارنة = الصفة + er." },
    { id: "q-a2-6", q: "Die Rechnung, ___!", qAr: "الحساب لو سمحت!", options: ["schön", "bitte", "fertig"], answer: 1 },
    { id: "q-a2-7", q: "Ich bewerbe ___ um die Stelle.", qAr: "بقدّم على الوظيفة", options: ["mich", "mir", "dich"], answer: 0, explainAr: "sich bewerben: ich bewerbe mich." },
    { id: "q-a2-8", q: "Der Zug fährt von ___ 7 ab.", qAr: "القطر بيتحرك من رصيف 7", options: ["Gleis", "Bahn", "Tür"], answer: 0 },
  ],
  B1: [
    { id: "q-b1-1", q: "Ich lerne Deutsch, ___ ich in Deutschland arbeiten will.", qAr: "كمّل: علشان عايز أشتغل في ألمانيا", options: ["dass", "weil", "obwohl"], answer: 1, explainAr: "weil = علشان، والفعل في الآخر." },
    { id: "q-b1-2", q: "Ich hoffe, ___ du bald kommst.", qAr: "أتمنى إنك تيجي قريب", options: ["weil", "dass", "wenn"], answer: 1 },
    { id: "q-b1-3", q: "___ bin ich aufgestanden, dann habe ich gefrühstückt.", qAr: "الأول صحيت وبعدين فطرت", options: ["Zuerst", "Plötzlich", "Endlich"], answer: 0 },
    { id: "q-b1-4", q: "Formal brief opening : ·", qAr: "بداية إيميل رسمي", options: ["Hallo Leute,", "Sehr geehrte Damen und Herren,", "Na du,"], answer: 1 },
    { id: "q-b1-5", q: "Ich bin der ___, dass ...", qAr: "أنا رأيي إن ...", options: ["Meinung", "Frage", "Antwort"], answer: 0 },
    { id: "q-b1-6", q: "Einerseits ..., ___ ...", qAr: "من ناحية ... ومن ناحية تانية", options: ["andererseits", "zweitens", "ansonsten"], answer: 0 },
  ],
  B2: [
    { id: "q-b2-1", q: "Das Haus ___ renoviert.", qAr: "البيت بيتجدد (مبني للمجهول)", options: ["wird", "ist", "hat"], answer: 0 },
    { id: "q-b2-2", q: "Ich war krank, ___ bin ich zu Hause geblieben.", qAr: "كنت تعبان، لذلك فضلت في البيت", options: ["deshalb", "obwohl", "weil"], answer: 0 },
    { id: "q-b2-3", q: "Könnten Sie das bitte bis Freitag ___?", qAr: "ممكن تراجع ده لحد الجمعة؟", options: ["prüfen", "prüfst", "geprüft"], answer: 0 },
    { id: "q-b2-4", q: "___ meiner Sicht ist das klug.", qAr: "من وجهة نظري ده ذكي", options: ["Aus", "Von", "Mit"], answer: 0 },
  ],
  C1: [
    { id: "q-c1-1", q: "___ hinaus ist zu berücksichtigen, dass ...", qAr: "بالإضافة لكده لازم نراعي إن ...", options: ["Darüber", "Außerdem", "Dazu"], answer: 0 },
    { id: "q-c1-2", q: "wissen / kennen: Ich ___ ihn gut (شخصيًا).", qAr: "أنا عارفه كويس", options: ["weiß", "kenne", "kann"], answer: 1 },
    { id: "q-c1-3", q: "Ich ___ einen Jobwechsel (بدرس بجدية).", qAr: "كمّل: بفكر بجدية في تغيير الشغل", options: ["überlege", "erwäge", "denke"], answer: 1 },
  ],
  C2: [
    { id: "q-c2-1", q: "Was heißt : · Ich drücke dir die Daumen", qAr: "إيه معنى التعبير؟", options: ["بضغط على إيديك", "أتمناك حظ حلو", "أنا زعلان"], answer: 1 },
    { id: "q-c2-2", q: "DAS passt heißt umgangssprachlich : · Das ist ja der ___!", options: ["Hammer", "Nagel", "Amboss"], answer: 0 },
    { id: "q-c2-3", q: "Formal für 'sehr gut' : ·", qAr: "كلمة رسمية بدل gut جدًا", options: ["klasse", "hervorragend", "spitze"], answer: 1 },
  ],
};

// Auto-generate vocabulary article questions from real data (used by quiz API).
import { VOCAB } from "./vocab";

export function generatedArticleQuestions(level: string, count: number): QuizQuestion[] {
  const pool = VOCAB.filter((x) => x.art && ["A1", "A2"].includes(level) ? x.level === "A1" || x.level === level : true);
  const usable = pool.filter((x) => x.level === level || (level !== "A1" && x.level === "A1"));
  const shuffled = [...usable].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map((item, i) => ({
    id: `gen-a-${item.id}-${i}`,
    q: `Was ist der Artikel? · ${item.de}`,
    qAr: `إيه أداة تعريف كلمة ${item.de}؟`,
    options: ["der", "die", "das"],
    answer: ["der", "die", "das"].indexOf(item.art!),
    explainAr: `${item.art} ${item.de} - ${item.ar}`,
  }));
}

export function generatedMeaningQuestions(level: string, count: number): QuizQuestion[] {
  const usable = VOCAB.filter((x) => x.level === level || x.level === "A1");
  const shuffled = [...usable].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map((item, i) => {
    const wrong = usable.filter((x) => x.id !== item.id).sort(() => Math.random() - 0.5).slice(0, 3).map((x) => x.ar);
    const options = [...wrong, item.ar].sort(() => Math.random() - 0.5);
    return {
      id: `gen-m-${item.id}-${i}`,
      q: item.de + (item.art ? ` (${item.art})` : ""),
      qAr: "إيه معنى الكلمة دي؟",
      options,
      answer: options.indexOf(item.ar),
      explainAr: item.ex + " → " + item.exAr,
    };
  });
}

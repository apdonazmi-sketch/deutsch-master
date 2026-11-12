export type VocabItem = {
  id: string;
  de: string;
  art: "der" | "die" | "das" | null;
  pl: string | null;
  ar: string; // Egyptian Arabic meaning
  ex: string; // German example
  exAr: string; // Egyptian Arabic translation
  level: string;
  topic: string;
};

let n = 0;
function v(de: string, art: VocabItem["art"], pl: string | null, ar: string, ex: string, exAr: string, level: string, topic: string): VocabItem {
  n += 1;
  return { id: `v${n}`, de, art, pl, ar, ex, exAr, level, topic };
}

export const VOCAB: VocabItem[] = [
  // ---------- A1 ----------
  v("Mann", "der", "Männer", "راجل", "Der Mann arbeitet in Berlin.", "الراجل بيشتغل في برلين.", "A1", "daily"),
  v("Frau", "die", "Frauen", "ست / مرا", "Die Frau kommt aus Hamburg.", "الست جاية من هامبورج.", "A1", "daily"),
  v("Kind", "das", "Kinder", "طفل", "Das Kind lernt Deutsch.", "الطفل بيتعلم ألماني.", "A1", "daily"),
  v("Tag", "der", "Tage", "يوم", "Heute ist ein schöner Tag.", "النهاردة يوم حلو.", "A1", "daily"),
  v("Nacht", "die", "Nächte", "الليل", "Die Nacht ist ruhig.", "الليل هادي.", "A1", "daily"),
  v("Wasser", "das", null, "مية", "Ich trinke viel Wasser.", "أنا بشرب مية كتير.", "A1", "food"),
  v("Brot", "das", "Brote", "عيش", "Das Brot ist frisch.", "العيش طازة.", "A1", "food"),
  v("Arbeit", "die", "Arbeiten", "الشغل", "Die Arbeit beginnt um acht Uhr.", "الشغل بيبدأ الساعة تمانية.", "A1", "work"),
  v("Haus", "das", "Häuser", "بيت", "Das Haus hat einen Garten.", "البيت ليه جناينة.", "A1", "daily"),
  v("Wohnung", "die", "Wohnungen", "شقة", "Die Wohnung ist klein, aber schön.", "الشقة صغيرة بس حلوة.", "A1", "germany"),
  v("Bahnhof", "der", "Bahnhöfe", "محطة القطر", "Der Zug kommt am Bahnhof an.", "القطر بيوصل المحطة.", "A1", "travel"),
  v("Flughafen", "der", "Flughäfen", "المطار", "Der Flughafen ist sehr groß.", "المطار كبير جدًا.", "A1", "travel"),
  v("Restaurant", "das", "Restaurants", "مطعم", "Das Restaurant ist heute voll.", "المطعم زحمة النهاردة.", "A1", "food"),
  v("Arzt", "der", "Ärzte", "الدكتور", "Ich habe einen Termin beim Arzt.", "عندي ميعاد عند الدكتور.", "A1", "germany"),
  v("Krankenhaus", "das", "Krankenhäuser", "المستشفى", "Das Krankenhaus ist in der Nähe.", "المستشفى قريبة من هنا.", "A1", "germany"),
  v("Schule", "die", "Schulen", "المدرسة", "Die Schule beginnt um acht.", "المدرسة بتبدأ الساعة تمانية.", "A1", "study"),
  v("Freund", "der", "Freunde", "صاحب (ولد)", "Mein Freund wohnt in Köln.", "صاحبي ساكن في كولونيا.", "A1", "social"),
  v("Freundin", "die", "Freundinnen", "صاحبة (بنت)", "Meine Freundin lernt auch Deutsch.", "صاحبتي بتتعلم ألماني برضه.", "A1", "social"),
  v("Familie", "die", "Familien", "العيلة", "Meine Familie ist groß.", "عيلتي كبيرة.", "A1", "social"),
  v("Auto", "das", "Autos", "عربية", "Das Auto steht vor dem Haus.", "العربية واقفة قدام البيت.", "A1", "daily"),
  v("Zug", "der", "Züge", "القطر", "Der Zug hat zehn Minuten Verspätung.", "القطر متأخر عشر دقايق.", "A1", "travel"),
  v("Stadt", "die", "Städte", "مدينة", "Die Stadt ist sehr schön.", "المدينة حلوة جدًا.", "A1", "travel"),
  v("Land", "das", "Länder", "بلد", "Deutschland ist ein schönes Land.", "ألمانيا بلد حلوة.", "A1", "germany"),
  v("Sprache", "die", "Sprachen", "لغة", "Die deutsche Sprache ist logisch.", "اللغة الألمانية منطقية.", "A1", "study"),
  v("Zeit", "die", "Zeiten", "وقت", "Ich habe heute keine Zeit.", "ماعنديش وقت النهاردة.", "A1", "daily"),
  v("Geld", "das", null, "فلوس", "Ich brauche etwas Geld.", "محتاج شوية فلوس.", "A1", "germany"),
  v("Preis", "der", "Preise", "السعر", "Der Preis ist in Ordnung.", "السعر كويس.", "A1", "food"),
  v("Frage", "die", "Fragen", "سؤال", "Ich habe eine Frage.", "عندي سؤال.", "A1", "study"),
  v("Antwort", "die", "Antworten", "إجابة", "Die Antwort ist richtig.", "الإجابة صح.", "A1", "study"),
  v("Wort", "das", "Wörter", "كلمة", "Das Wort ist schwer.", "الكلمة دي صعبة.", "A1", "study"),
  v("Satz", "der", "Sätze", "جملة", "Der Satz ist einfach.", "الجملة دي سهلة.", "A1", "study"),
  v("Kaffee", "der", "Kaffees", "قهوة", "Der Kaffee ist heiß.", "القهوة سخنة.", "A1", "food"),
  v("Tee", "der", "Tees", "شاي", "Möchten Sie einen Tee?", "تحب تشرب شاي؟", "A1", "food"),
  v("Frühstück", "das", null, "الفطار", "Das Frühstück ist fertig.", "الفطار جاهز.", "A1", "food"),
  v("Termin", "der", "Termine", "ميعاد", "Ich habe morgen einen Termin.", "عندي ميعاد بكرة.", "A1", "germany"),
  v("Woche", "die", "Wochen", "أسبوع", "Nächste Woche fahre ich nach Berlin.", "الأسبوع الجاي رايح برلين.", "A1", "daily"),
  v("Monat", "der", "Monate", "شهر", "Der Monat war lang.", "الشهر كان طويل.", "A1", "daily"),
  v("Jahr", "das", "Jahre", "سنة", "Ich lerne seit einem Jahr Deutsch.", "بتعلم ألماني بقالي سنة.", "A1", "daily"),
  v("Straße", "die", "Straßen", "شارع", "Die Straße ist sehr ruhig.", "الشارع هادي جدًا.", "A1", "daily"),
  v("Zimmer", "das", "Zimmer", "أوضة", "Das Zimmer hat ein großes Fenster.", "الأوضة فيها شباك كبير.", "A1", "germany"),
  v("Kollege", "der", "Kollegen", "زميل شغل", "Mein Kollege hilft mir oft.", "زميلي في الشغل بيساعدني كتير.", "A1", "work"),
  v("Handy", "das", "Handys", "الموبايل", "Mein Handy ist kaputt.", "موبايلي بايظ.", "A1", "tech"),
  v("Computer", "der", "Computer", "الكمبيوتر", "Der Computer ist neu.", "الكمبيوتر جديد.", "A1", "tech"),
  v("Fahrkarte", "die", "Fahrkarten", "تذكرة", "Die Fahrkarte kostet zehn Euro.", "التذكرة بعشرة يورو.", "A1", "travel"),
  v("Supermarkt", "der", "Supermärkte", "السوبر ماركت", "Der Supermarkt schließt um zehn Uhr.", "السوبر ماركت بيقفل الساعة عشرة.", "A1", "food"),
  v("Apotheke", "die", "Apotheken", "الصيدلية", "Die Apotheke ist am Bahnhof.", "الصيدلية جنب محطة القطر.", "A1", "germany"),
  v("Bank", "die", "Banken", "البنك", "Die Bank öffnet um neun Uhr.", "البنك بيفتح الساعة تسعة.", "A1", "germany"),
  v("Büro", "das", "Büros", "المكتب", "Das Büro ist im dritten Stock.", "المكتب في الدور التالت.", "A1", "work"),
  v("Chef", "der", "Chefs", "المدير", "Der Chef ist heute nicht da.", "المدير مش موجود النهاردة.", "A1", "work"),
  // verbs A1
  v("kommen", null, null, "يجي", "Ich komme aus Ägypten.", "أنا جاي من مصر.", "A1", "verbs"),
  v("wohnen", null, null, "يسكن", "Ich wohne in Kairo.", "أنا ساكن في القاهرة.", "A1", "verbs"),
  v("arbeiten", null, null, "يشتغل", "Er arbeitet bei Siemens.", "هو بيشتغل في سيمنس.", "A1", "verbs"),
  v("sprechen", null, null, "يتكلم", "Wir sprechen Deutsch.", "إحنا بنتكلم ألماني.", "A1", "verbs"),
  v("lernen", null, null, "يتعلم", "Ich lerne jeden Tag Deutsch.", "بتعلم ألماني كل يوم.", "A1", "verbs"),
  v("essen", null, null, "ياكل", "Wir essen um sieben Uhr.", "بناكل الساعة سبعة.", "A1", "verbs"),
  v("trinken", null, null, "يشرب", "Sie trinkt viel Wasser.", "هي بتشرب مية كتير.", "A1", "verbs"),
  v("gehen", null, null, "يمشي / يروح", "Ich gehe jetzt nach Hause.", "أنا رايح البيت دلوقتي.", "A1", "verbs"),
  v("fahren", null, null, "يروح (بمواصلات)", "Wir fahren mit dem Zug.", "إحنا رايحين بالقطر.", "A1", "verbs"),
  v("kaufen", null, null, "يشتري", "Ich kaufe Brot im Supermarkt.", "بشتري عيش من السوبر ماركت.", "A1", "verbs"),
  v("machen", null, null, "يعمل", "Was machst du heute?", "بتعمل إيه النهاردة؟", "A1", "verbs"),
  v("brauchen", null, null, "يحتاج", "Ich brauche deine Hilfe.", "محتاج مساعدتك.", "A1", "verbs"),
  v("möchten", null, null, "عايز (بأدب)", "Ich möchte einen Kaffee, bitte.", "عايز قهوة لو سمحت.", "A1", "verbs"),
  v("können", null, null, "يقدر", "Ich kann ein bisschen Deutsch.", "أقدر أتكلم شوية ألماني.", "A1", "verbs"),
  v("müssen", null, null, "لازم", "Ich muss morgen früh arbeiten.", "لازم أشتغل بكرة الصبح بدري.", "A1", "verbs"),
  // phrases A1
  v("Guten Morgen", null, null, "صباح الخير", "Guten Morgen! Wie geht es Ihnen?", "صباح الخير! عامل إيه؟", "A1", "phrases"),
  v("Tschüss", null, null, "مع السلامة", "Tschüss, bis morgen!", "مع السلامة، أشوفك بكرة!", "A1", "phrases"),
  v("Entschuldigung", "die", "Entschuldigungen", "لو سمحت / آسف", "Entschuldigung, wo ist der Bahnhof?", "لو سمحت، فين محطة القطر؟", "A1", "phrases"),
  v("Ich verstehe nicht", null, null, "مش فاهم", "Entschuldigung, ich verstehe nicht.", "لو سمحت، أنا مش فاهم.", "A1", "phrases"),
  v("Langsamer, bitte", null, null, "بشويش لو سمحت", "Können Sie das wiederholen? Langsamer, bitte.", "ممكن تعيد؟ بشويش لو سمحت.", "A1", "phrases"),
  v("Was kostet das?", null, null, "بكام ده؟", "Entschuldigung, was kostet das?", "لو سمحت، ده بكام؟", "A1", "phrases"),

  // ---------- A2 ----------
  v("Ausbildung", "die", "Ausbildungen", "التدريب المهني", "Die Ausbildung dauert drei Jahre.", "التدريب المهني بياخد تلات سنين.", "A2", "work"),
  v("Bewerbung", "die", "Bewerbungen", "التقديم لوظيفة", "Die Bewerbung ist fast fertig.", "التقديم للوظيفة قرب يخلص.", "A2", "work"),
  v("Verspätung", "die", "Verspätungen", "تأخير", "Der Zug hat 20 Minuten Verspätung.", "القطر متأخر عشرين دقيقة.", "A2", "travel"),
  v("Gleis", "das", "Gleise", "رصيف القطر", "Der Zug fährt von Gleis drei ab.", "القطر بيتحرك من رصيف رقم تلاتة.", "A2", "travel"),
  v("Rechnung", "die", "Rechnungen", "الحساب", "Die Rechnung, bitte!", "الحساب لو سمحت!", "A2", "food"),
  v("Trinkgeld", "das", "Trinkgelder", "بقشيش", "Das Trinkgeld ist für Sie.", "البقشيش ده ليك.", "A2", "food"),
  v("Nachricht", "die", "Nachrichten", "رسالة / خبر", "Ich habe deine Nachricht bekommen.", "وصلتني رسالتك.", "A2", "tech"),
  v("Vermieter", "der", "Vermieter", "صاحب الشقة", "Der Vermieter kommt morgen.", "صاحب الشقة جاي بكرة.", "A2", "germany"),
  v("Miete", "die", "Mieten", "الإيجار", "Die Miete ist fünfhundert Euro.", "الإيجار خمسمية يورو.", "A2", "germany"),
  v("Krankenkasse", "die", "Krankenkassen", "التأمين الصحي", "Die Krankenkasse schickt mir eine Karte.", "التأمين الصحي بعتلي كارت.", "A2", "germany"),
  v("Pass", "der", "Pässe", "الباسبور", "Der Pass ist noch gültig.", "الباسبور لسه ساري.", "A2", "travel"),
  v("Visum", "das", "Visa", "الفيزا", "Das Visum ist für ein Jahr.", "الفيزا لمدة سنة.", "A2", "travel"),
  v("Erfahrung", "die", "Erfahrungen", "خبرة", "Ich habe viel Erfahrung in der Küche.", "عندي خبرة كبيرة في المطبخ.", "A2", "work"),
  v("Stelle", "die", "Stellen", "وظيفة", "Die Stelle ist sehr interessant.", "الوظيفة دي مثيرة للاهتمام جدًا.", "A2", "work"),
  v("Vorstellungsgespräch", "das", "Vorstellungsgespräche", "انترفيو شغل", "Das Vorstellungsgespräch war gut.", "الانترفيو كانت كويسة.", "A2", "work"),
  v("Urlaub", "der", "Urlaube", "أجازة", "Der Urlaub beginnt im Juli.", "الأجازة بتبدأ في يوليه.", "A2", "work"),
  v("anfangen", null, null, "يبدأ (فعل منفصل)", "Der Kurs fängt um neun Uhr an.", "الكورس بيبدأ الساعة تسعة.", "A2", "verbs"),
  v("anrufen", null, null, "يتصل تليفونيًا", "Ich rufe dich morgen an.", "هكلمك بكرة.", "A2", "verbs"),
  v("sich bewerben", null, null, "يقدّم على وظيفة", "Ich bewerbe mich um die Stelle.", "بقدّم على الوظيفة دي.", "A2", "verbs"),
  v("sich freuen auf", null, null, "يفرح بـ / مستني حاجة", "Ich freue mich auf die Reise.", "مستني الرحلة بفارغ الصبر.", "A2", "verbs"),
  v("verstehen", null, null, "يفهم", "Jetzt verstehe ich die Grammatik.", "دلوقتي فهمت القاعدة.", "A2", "verbs"),
  v("beschreiben", null, null, "يوصف", "Beschreiben Sie bitte das Bild.", "لو سمحت صف الصورة.", "A2", "verbs"),
  v("Termin absagen", null, null, "يلغي ميعاد", "Ich muss den Termin absagen.", "لازم ألغي الميعاد.", "A2", "phrases"),
  v("Das passt mir", null, null, "ده مناسب ليا", "Freitag um zehn? Das passt mir.", "الجمعة الساعة عشرة؟ ده مناسب ليا.", "A2", "phrases"),

  // ---------- B1 ----------
  v("Meinung", "die", "Meinungen", "رأي", "Meiner Meinung nach ist das wichtig.", "في رأيي ده مهم.", "B1", "social"),
  v("Grund", "der", "Gründe", "سبب", "Der Grund ist einfach.", "السبب بسيط.", "B1", "social"),
  v("Alltag", "der", null, "الحياة اليومية", "Im Alltag spreche ich nur Deutsch.", "في حياتي اليومية بتكلم ألماني بس.", "B1", "daily"),
  v("Gewohnheit", "die", "Gewohnheiten", "عادة", "Lernen ist eine gute Gewohnheit.", "التعلم عادة كويسة.", "B1", "daily"),
  v("Vertrag", "der", "Verträge", "عقد", "Der Vertrag läuft zwei Jahre.", "العقد مدته سنتين.", "B1", "work"),
  v("Gehalt", "das", "Gehälter", "المرتب", "Das Gehalt kommt am Ende des Monats.", "المرتب بيجي آخر الشهر.", "B1", "work"),
  v("Gesundheit", "die", null, "الصحة", "Gesundheit ist wichtiger als Geld.", "الصحة أهم من الفلوس.", "B1", "daily"),
  v("Umwelt", "die", null, "البيئة", "Wir müssen die Umwelt schützen.", "لازم نحافظ على البيئة.", "B1", "social"),
  v("erklären", null, null, "يشرح", "Können Sie das bitte erklären?", "ممكن تشرح ده لو سمحت؟", "B1", "verbs"),
  v("diskutieren", null, null, "يتناقش", "Wir diskutieren über das Thema.", "إحنا بنتناقش في الموضوع.", "B1", "verbs"),
  v("vorschlagen", null, null, "يقترح", "Ich schlage ein Treffen vor.", "بقترح نعمل اجتماع.", "B1", "verbs"),
  v("sich erinnern", null, null, "يفتكر", "Ich erinnere mich an meine Kindheit.", "بفتكر طفولتي.", "B1", "verbs"),
  v("Ich bin der Meinung", null, null, "أنا رأيي إن", "Ich bin der Meinung, dass Übung wichtig ist.", "أنا رأيي إن التمرين مهم.", "B1", "phrases"),
  v("Einerseits ... andererseits", null, null, "من ناحية ... ومن ناحية تانية", "Einerseits ist es teuer, andererseits ist es gut.", "من ناحية غالي، بس من ناحية تانية كويس.", "B1", "phrases"),

  // ---------- B2+ ----------
  v("Herausforderung", "die", "Herausforderungen", "تحدّي", "Die Sprache ist eine Herausforderung.", "اللغة تحدّي.", "B2", "work"),
  v("Verantwortung", "die", "Verantwortungen", "مسؤولية", "Ich übernehme die Verantwortung.", "أنا هتولى المسؤولية.", "B2", "work"),
  v("Vereinbarung", "die", "Vereinbarungen", "اتفاق", "Die Vereinbarung ist fair.", "الاتفاق عادل.", "B2", "work"),
  v("fließend", null, null, "بطلاقة (صفة)", "Ich möchte fließend Deutsch sprechen.", "عايز أتكلم ألماني بطلاقة.", "B2", "study"),
  v("verhandeln", null, null, "يفاوض", "Wir verhandeln über das Gehalt.", "إحنا بنتفاوض على المرتب.", "B2", "verbs"),
  v("dauerhaft", null, null, "بشكل دائم", "Ich möchte dauerhaft in Deutschland leben.", "عايز أعيش في ألمانيا بشكل دائم.", "B2", "germany"),
];

export const ARTICLE_OF: Record<string, string> = {};
for (const item of VOCAB) {
  if (item.art) {
    ARTICLE_OF[item.de.toLowerCase()] = item.art;
    if (item.pl) ARTICLE_OF[item.pl.toLowerCase()] = item.art;
  }
}

export function vocabByLevel(level: string): VocabItem[] {
  const idx = ["A1", "A2", "B1", "B2"].indexOf(level);
  const allowed = ["A1", "A2", "B1", "B2"].slice(0, Math.max(1, idx + 1));
  return VOCAB.filter((x) => allowed.includes(x.level));
}

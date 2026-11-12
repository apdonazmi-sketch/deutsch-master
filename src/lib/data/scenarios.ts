export type Line = { de: string; ar: string };
export type Intent = { keys: string[]; reply: Line };
export type Step = {
  tutor: Line; // what the character says at this step
  hint: string; // Arabic hint for the user
  intents: Intent[]; // keyword -> response
  fallback: Line; // if nothing matched
};
export type Scenario = {
  id: string;
  titleAr: string;
  place: string;
  role: string; // who the AI plays
  roleAr: string;
  level: string;
  descAr: string;
  steps: Step[];
  outro: Line;
};

export const SCENARIOS: Scenario[] = [
  {
    id: "restaurant", titleAr: "في المطعم", place: "Restaurant Zur Linde", role: "Kellner", roleAr: "النادل", level: "A1",
    descAr: "اطلب أكل وشراب في مطعم ألماني وتعامل مع النادل من أول التحية لحد الحساب.",
    steps: [
      {
        tutor: { de: "Guten Abend! Haben Sie einen Tisch reserviert?", ar: "مساء الخير! حاجز ترابيزة؟" },
        hint: "رد بـ: لأ، مش حاجز. أو: أيوه، باسم ... (Nein, nicht reserviert / Ja, auf den Namen ...)",
        intents: [
          { keys: ["nein", "nicht reserviert", "keine reservierung"], reply: { de: "Kein Problem! Hier ist ein freier Tisch am Fenster. Was möchten Sie trinken?", ar: "مفيش مشكلة! دي ترابيزة فاضية جنب الشباك. تحب تشرب إيه؟" } },
          { keys: ["ja", "reserviert", "name"], reply: { de: "Ah, ja! Ihr Tisch ist fertig. Hier bitte. Was möchten Sie trinken?", ar: "أه أيوه! ترابيزتك جاهزة. اتفضل. تحب تشرب إيه؟" } },
        ],
        fallback: { de: "Entschuldigung, ich habe Sie nicht verstanden. Haben Sie reserviert?", ar: "لو سمحت، مش فاهمك. حاجز ولا لأ؟" },
      },
      {
        tutor: { de: "Was möchten Sie trinken?", ar: "تحب تشرب إيه؟" },
        hint: "اطلب مشروب: Ich möchte ein Wasser / eine Cola, bitte.",
        intents: [
          { keys: ["wasser"], reply: { de: "Ein Wasser, sehr gern. Und möchten Sie auch schon bestellen?", ar: "مية، اتفضل. وعايز تطلب أكل كمان؟" } },
          { keys: ["cola", "saft", "kaffee", "tee", "bier", "limo"], reply: { de: "Kommt sofort! Und was möchten Sie essen?", ar: "حالًا! وتحب تاكل إيه؟" } },
          { keys: ["möchte", "bitte"], reply: { de: "Kommt sofort! Und zum Essen?", ar: "حالًا! وبالنسبة للأكل؟" } },
        ],
        fallback: { de: "Wie bitte? Wasser, Cola oder Saft?", ar: "إيه؟ مية، كولا ولا عصير؟" },
      },
      {
        tutor: { de: "Und was möchten Sie essen?", ar: "وتحب تاكل إيه؟" },
        hint: "اطلب أكل: Ich nehme das Schnitzel / die Suppe / einen Salat.",
        intents: [
          { keys: ["schnitzel", "suppe", "salat", "pommes", "fisch", "hähnchen", "pasta", "pizza"], reply: { de: "Sehr gute Wahl! Das mache ich sofort fertig. Guten Appetit gleich!", ar: "اختيار ممتاز! هجهزه على طول. بالهنا والشفا!" } },
          { keys: ["empfehlen", "empfehlung", "was empfehlen"], reply: { de: "Ich empfehle das Schnitzel mit Pommes. Das ist unser bestes Gericht.", ar: "برشّحلك الشنيتزل مع البطاطس. ده أحسن طبق عندنا." } },
          { keys: ["nehme", "möchte", "bitte"], reply: { de: "Alles klar, kommt sofort!", ar: "تمام، جاي على طول!" } },
        ],
        fallback: { de: "Entschuldigung, das haben wir leider nicht. Vielleicht ein Schnitzel oder eine Suppe?", ar: "للأسف ده مش موجود. يمكن شنيتزل أو شوربة؟" },
      },
      {
        tutor: { de: "Hat es geschmeckt? Sonst noch etwas?", ar: "الأكل عجبك؟ تحب حاجة تانية؟" },
        hint: "رد: أيوه كان جميل. أو اطلب الحساب: Die Rechnung, bitte.",
        intents: [
          { keys: ["rechnung", "zahlen", "bezahlen"], reply: { de: "Natürlich! Zusammen oder getrennt? Das macht 24,50 Euro.", ar: "أكيد! حساب واحد ولا منفصل؟ المجموع 24.50 يورو." } },
          { keys: ["ja", "gut", "lecker", "geschmeckt"], reply: { de: "Schön, das freut mich! Möchten Sie noch einen Kaffee oder die Rechnung?", ar: "جميل، فرحت! تحب قهوة ولا الحساب؟" } },
        ],
        fallback: { de: "Verzeihung? Sagen Sie es bitte noch einmal.", ar: "عذرًا؟ قولها تاني لو سمحت." },
      },
      {
        tutor: { de: "Zusammen oder getrennt? Das macht 24,50 Euro.", ar: "حساب واحد ولا منفصل؟ المجموع 24.50 يورو." },
        hint: "ادفع وقول مع السلامة: Zusammen, bitte. Hier sind 26 Euro. Tschüss!",
        intents: [
          { keys: ["zusammen", "euro", "hier", "tschüss", "danke", "karte"], reply: { de: "", ar: "" } },
        ],
        fallback: { de: "Wie bitte? Zahlen Sie zusammen oder getrennt?", ar: "إيه؟ بتدفع حساب واحد ولا منفصل؟" },
      },
    ],
    outro: { de: "Vielen Dank! Auf Wiedersehen und einen schönen Abend!", ar: "شكرًا جدًا! مع السلامة وبالهنا عليك!" },
  },

  {
    id: "airport", titleAr: "في المطار", place: "Flughafen Frankfurt", role: "Mitarbeiter am Check-in", roleAr: "موظف الكاونتر", level: "A1",
    descAr: "اعمل تشيك-إن في مطار ألماني، سلّم شنطك وجاوب على أسئلة الموظف.",
    steps: [
      {
        tutor: { de: "Guten Tag! Ihren Pass und Ihr Ticket, bitte.", ar: "نهارك سعيد! الباسبور والتذكرة لو سمحت." },
        hint: "سلّم حاجاتك: Hier, bitte. / Hier ist mein Pass.",
        intents: [
          { keys: ["hier", "bitte", "pass", "ticket"], reply: { de: "Danke. Fliegen Sie nach Berlin? Haben Sie Gepäck?", ar: "شكرًا. رايح برلين؟ معاك شنط؟" } },
        ],
        fallback: { de: "Wie bitte? Ihren Pass, bitte.", ar: "إيه؟ الباسبور لو سمحت." },
      },
      {
        tutor: { de: "Haben Sie Gepäck? Wie viele Koffer?", ar: "معاك شنط؟ كام شنطة؟" },
        hint: "قول عدد الشنط: Ja, einen Koffer. / Nein, nur Handgepäck.",
        intents: [
          { keys: ["einen koffer", "ein koffer", "ja"], reply: { de: "Okay, stellen Sie den Koffer bitte hier. Fensterplatz oder Gangplatz?", ar: "تمام، حط الشنطة هنا لو سمحت. عايز قعدة جنب الشباك ولا المعبر؟" } },
          { keys: ["nein", "handgepäck", "nur"], reply: { de: "Nur Handgepäck, alles klar. Fensterplatz oder Gangplatz?", ar: "شنطة يد بس، تمام. عايز قعدة جنب الشباك ولا المعبر؟" } },
        ],
        fallback: { de: "Entschuldigung? Ein Koffer? Zwei Koffer?", ar: "عذرًا؟ شنطة واحدة؟ شنطتين؟" },
      },
      {
        tutor: { de: "Fensterplatz oder Gangplatz?", ar: "قعدة جنب الشباك ولا المعبر؟" },
        hint: "اختار: Fensterplatz, bitte. / Gangplatz, bitte.",
        intents: [
          { keys: ["fenster"], reply: { de: "Ein Fensterplatz, 14A. Ihr Gate ist B22. Der Flug geht um 15:30 Uhr.", ar: "قعدة جنب الشباك 14A. البوابة B22. الطيارة هتتحرك 3:30 العصر." } },
          { keys: ["gang"], reply: { de: "Ein Gangplatz, 14C. Ihr Gate ist B22. Einen guten Flug!", ar: "قعدة جنب المعبر 14C. البوابة B22. رحلة سعيدة!" } },
        ],
        fallback: { de: "Wie bitte? Fenster oder Gang?", ar: "إيه؟ شباك ولا معبر؟" },
      },
      {
        tutor: { de: "Ihr Gate ist B22. Der Flug geht um 15:30. Haben Sie noch Fragen?", ar: "البوابة B22. الطيارة 3:30. عندك أسئلة؟" },
        hint: "اسأل أو اشكره: Wo ist das Gate? / Nein, danke. Auf Wiedersehen!",
        intents: [
          { keys: ["wo ist", "gate", "frage", "weit"], reply: { de: "Gehen Sie geradeaus, dann links. Es sind fünf Minuten zu Fuß.", ar: "امشي على طول وبعدين شمال. خمس دقايق ماشي." } },
          { keys: ["nein", "danke", "tschüss", "wiedersehen"], reply: { de: "", ar: "" } },
        ],
        fallback: { de: "Wie bitte? Ich verstehe Sie nicht.", ar: "إيه؟ مش فاهمك." },
      },
    ],
    outro: { de: "Alles erledigt! Einen guten Flug und auf Wiedersehen!", ar: "كل حاجة تمام! رحلة سعيدة ومع السلامة!" },
  },

  {
    id: "train", titleAr: "في محطة القطار", place: "Hauptbahnhof", role: "Mitarbeiter am Schalter", roleAr: "موظف الشباك", level: "A2",
    descAr: "اشتري تذكرة قطر واسأل عن المواعيد والرصيف.",
    steps: [
      {
        tutor: { de: "Guten Morgen! Wohin möchten Sie fahren?", ar: "صباح الخير! رايح فين؟" },
        hint: "قول وجهتك: Nach München, bitte. / Ich möchte nach Hamburg fahren.",
        intents: [
          { keys: ["münchen", "hamburg", "berlin", "köln", "frankfurt", "nach"], reply: { de: "Gut. Einfach oder hin und zurück?", ar: "تمام. رايح بس ولا رايح جاي؟" } },
        ],
        fallback: { de: "Wie bitte? Wohin fahren Sie?", ar: "إيه؟ رايح فين؟" },
      },
      {
        tutor: { de: "Einfach oder hin und zurück? Und welche Klasse?", ar: "رايح بس ولا رايح جاي؟ وكلاس كام؟" },
        hint: "رد: Einfach, bitte. Zweite Klasse.",
        intents: [
          { keys: ["einfach", "zurück", "hin und zurück", "zweite", "erste"], reply: { de: "Der nächste Zug fährt um 10:15 Uhr von Gleis 7. Das kostet 39 Euro.", ar: "أقرب قطر بيتحرك 10:15 من رصيف 7. التذكرة بـ39 يورو." } },
        ],
        fallback: { de: "Entschuldigung? Einfach oder Retour?", ar: "عذرًا؟ رايح ولا رايح جاي؟" },
      },
      {
        tutor: { de: "Der Zug fährt um 10:15 von Gleis 7. Möchten Sie eine Reservierung?", ar: "القطر بيتحرك 10:15 من رصيف 7. عايز تحجز كرسي؟" },
        hint: "رد: Ja, bitte. / Nein, danke. / Wie viel kostet das?",
        intents: [
          { keys: ["ja", "bitte", "reservierung"], reply: { de: "Gerne! Mit Reservierung sind es 43 Euro. Bar oder mit Karte?", ar: "اتفضل! مع الحجز هيبقوا 43 يورو. كاش ولا كارت؟" } },
          { keys: ["nein", "danke", "kostet"], reply: { de: "Alles klar, 39 Euro bitte. Bar oder Karte?", ar: "تمام، 39 يورو لو سمحت. كاش ولا كارت؟" } },
        ],
        fallback: { de: "Wie bitte? Mit oder ohne Reservierung?", ar: "إيه؟ بحجز ولا من غير؟" },
      },
      {
        tutor: { de: "Bar oder mit Karte?", ar: "كاش ولا كارت؟" },
        hint: "رد: Mit Karte, bitte. / Bar. وقول شكرًا.",
        intents: [
          { keys: ["karte", "bar", "danke"], reply: { de: "", ar: "" } },
        ],
        fallback: { de: "Bar oder Karte?", ar: "كاش ولا كارت؟" },
      },
    ],
    outro: { de: "Hier ist Ihre Fahrkarte. Gute Reise!", ar: "دي تذكرتك. رحلة سعيدة!" },
  },

  {
    id: "supermarket", titleAr: "في السوبر ماركت", place: "REWE Supermarkt", role: "Kassiererin", roleAr: "الكاشير", level: "A1",
    descAr: "اشتري حاجات من السوبر ماركت وتعامل مع الكاشير.",
    steps: [
      {
        tutor: { de: "Hallo! Haben Sie alles gefunden?", ar: "أهلًا! لقيت كل حاجة؟" },
        hint: "رد: Ja, danke. أو اسأل: Wo finde ich die Milch?",
        intents: [
          { keys: ["ja", "danke", "alles"], reply: { de: "Sehr gut. Brauchen Sie eine Tüte?", ar: "جميل. محتاج كيس؟" } },
          { keys: ["milch", "brot", "wo", "finde", "suche"], reply: { de: "Die Milch ist hinten links, bei den Kühlregalen. Brauchen Sie sonst etwas?", ar: "اللبن في الآخر على الشمال، عند التلاجات. محتاج حاجة تانية؟" } },
        ],
        fallback: { de: "Wie bitte? Suchen Sie etwas?", ar: "إيه؟ بتدور على حاجة؟" },
      },
      {
        tutor: { de: "Brauchen Sie eine Tüte?", ar: "محتاج كيس؟" },
        hint: "رد: Ja, bitte. / Nein, danke, ich habe eine Tasche.",
        intents: [
          { keys: ["ja", "tüte", "bitte"], reply: { de: "Hier, bitte. Das macht zusammen 12,80 Euro.", ar: "اتفضل. المجموع 12.80 يورو." } },
          { keys: ["nein", "tasche", "danke"], reply: { de: "Okay! Das macht 12,80 Euro.", ar: "تمام! المجموع 12.80 يورو." } },
        ],
        fallback: { de: "Eine Tüte? Ja oder nein?", ar: "كيس؟ أيوه ولا لأ؟" },
      },
      {
        tutor: { de: "Das macht 12,80 Euro. Zahlen Sie bar oder mit Karte?", ar: "المجموع 12.80 يورو. بتدفع كاش ولا كارت؟" },
        hint: "رد: Bar. / Mit Karte, bitte.",
        intents: [
          { keys: ["bar"], reply: { de: "Bar, okay. Danke schön! Hier ist Ihr Wechselgeld.", ar: "كاش، تمام. شكرًا! ده الباقي بتاعك." } },
          { keys: ["karte"], reply: { de: "Mit Karte, gerne. Bitte einmal kurz auflegen ... Danke!", ar: "بالكارت، اتفضل. حط الكارت كده ... شكرًا!" } },
        ],
        fallback: { de: "Wie bitte? Bar oder Karte?", ar: "إيه؟ كاش ولا كارت؟" },
      },
    ],
    outro: { de: "Vielen Dank! Schönen Tag noch, tschüss!", ar: "شكرًا جدًا! يومك سعيد، مع السلامة!" },
  },

  {
    id: "doctor", titleAr: "عند الطبيب", place: "Hausarztpraxis Dr. Weber", role: "Arzt", roleAr: "الدكتور", level: "A2",
    descAr: "اشرح للدكتور الألماني إيه اللي مضايقك وجاوب على أسئلته.",
    steps: [
      {
        tutor: { de: "Guten Tag! Was kann ich für Sie tun?", ar: "نهارك سعيد! أقدر أساعدك في إيه؟" },
        hint: "قول شكوتك: Ich habe Kopfschmerzen. / Mir ist schlecht. / Ich habe Fieber.",
        intents: [
          { keys: ["kopfschmerzen", "fieber", "husten", "schmerzen", "schlecht", "krank", "erkältet"], reply: { de: "Okay. Seit wann haben Sie diese Beschwerden?", ar: "تمام. من إمتى وانت تعبان كده؟" } },
        ],
        fallback: { de: "Wie bitte? Wo haben Sie Schmerzen?", ar: "إيه؟ في ألم فين؟" },
      },
      {
        tutor: { de: "Seit wann haben Sie diese Beschwerden?", ar: "من إمتى وانت حاسس بكده؟" },
        hint: "رد: Seit zwei Tagen. / Seit gestern.",
        intents: [
          { keys: ["seit", "gestern", "tage", "woche", "heute"], reply: { de: "Verstehe. Nehmen Sie Medikamente? Haben Sie Allergien?", ar: "فاهم. بتاخد أدوية؟ عندك حساسية؟" } },
        ],
        fallback: { de: "Seit wann? Einen Tag? Eine Woche?", ar: "من إمتى؟ يوم؟ أسبوع؟" },
      },
      {
        tutor: { de: "Nehmen Sie Medikamente? Haben Sie Allergien?", ar: "بتاخد أدوية؟ عندك حساسية؟" },
        hint: "رد: Nein, keine Allergien. / Ich nehme ...",
        intents: [
          { keys: ["nein", "keine", "ja", "ich nehme"], reply: { de: "Alles klar. Ich verschreibe Ihnen etwas. Nehmen Sie es dreimal täglich nach dem Essen.", ar: "تمام. هكتبلك دوا. خده تلات مرات في اليوم بعد الأكل." } },
        ],
        fallback: { de: "Also: Medikamente - ja oder nein?", ar: "يعني: أدوية - أيوه ولا لأ؟" },
      },
      {
        tutor: { de: "Sonst noch etwas? Haben Sie Fragen?", ar: "في حاجة تانية؟ عندك أسئلة؟" },
        hint: "رد: Nein, danke. Gute Besserung und tschüss! (قول مع السلامة)",
        intents: [
          { keys: ["nein", "danke", "tschüss", "krankschreibung", "frage"], reply: { de: "", ar: "" } },
        ],
        fallback: { de: "Wie bitte? Noch eine Frage?", ar: "إيه؟ في سؤال تاني؟" },
      },
    ],
    outro: { de: "Gute Besserung! Machen Sie's gut!", ar: "سلامتك! اعتن بنفسك!" },
  },

  {
    id: "job", titleAr: "مقابلة عمل", place: "Büro - Personaler", role: "Personalchef", roleAr: "مدير الموارد البشرية", level: "B1",
    descAr: "عدّي انترفيو شغل بالألمانية وجاوب على الأسئلة الكلاسيكية.",
    steps: [
      {
        tutor: { de: "Guten Morgen! Schön, dass Sie da sind. Erzählen Sie uns etwas über sich.", ar: "صباح الخير! حلو إنك جيت. احكيلنا عن نفسك." },
        hint: "عرّف بنفسك: اسمك، عمرك، شغلك، خبرتك. (Ich heiße ..., ich komme aus ..., ich arbeite als ...)",
        intents: [
          { keys: ["heiße", "name", "komme", "arbeite", "bin", "jahre", "erfahrung"], reply: { de: "Interessant! Und warum möchten Sie bei uns arbeiten?", ar: "مثير للاهتمام! وليه عايز تشتغل معانا؟" } },
        ],
        fallback: { de: "Erzählen Sie einfach: Wer sind Sie? Was machen Sie?", ar: "احكيلي ببساطة: مين انت؟ وبتعمل إيه؟" },
      },
      {
        tutor: { de: "Warum möchten Sie bei uns arbeiten?", ar: "ليه عايز تشتغل معانا؟" },
        hint: "قول سبب: Ich mag Ihre Firma, weil ... / Ich möchte mich weiterentwickeln.",
        intents: [
          { keys: ["weil", "möchte", "lernen", "entwickeln", "firma", "gut", "interessant"], reply: { de: "Das klingt gut. Was sind Ihre Stärken?", ar: "كلام حلو. إيه نقاط قوتك؟" } },
        ],
        fallback: { de: "Also: Warum diese Firma? Was finden Sie gut?", ar: "يعني: ليه الشركة دي؟ إيه اللي عاجبك؟" },
      },
      {
        tutor: { de: "Was sind Ihre Stärken?", ar: "إيه نقاط قوتك؟" },
        hint: "رد: Ich bin zuverlässig / teamfähig / ich lerne schnell ...",
        intents: [
          { keys: ["zuverlässig", "teamfähig", "schnell", "pünktlich", "motiviert", "stärke", "gut in"], reply: { de: "Sehr schön! Und Ihre Schwächen? Seien Sie ehrlich!", ar: "جميل جدًا! ونقاط ضعفك؟ كون صريح!" } },
        ],
        fallback: { de: "Zum Beispiel: Sind Sie pünktlich? Teamfähig?", ar: "مثلا: بتوصل في ميعادك؟ بتحب الشغل الجماعي؟" },
      },
      {
        tutor: { de: "Und was sind Ihre Schwächen?", ar: "وإيه نقاط ضعفك؟" },
        hint: "رد بذكاء: Manchmal bin ich ungeduldig, aber ich arbeite daran.",
        intents: [
          { keys: ["ungeduldig", "nervös", "perfektionist", "aber", "manchmal", "schwäche"], reply: { de: "Ehrlich gesagt, eine gute Antwort. Haben Sie Fragen an uns?", ar: "بصراحة إجابة حلوة. عندك أسئلة لينا؟" } },
          { keys: ["keine", "weiß nicht"], reply: { de: "Jeder hat Schwächen! Nicht schlimm. Haben Sie Fragen an uns?", ar: "كل الناس عندها نقاط ضعف! مش مشكلة. عندك أسئلة لينا؟" } },
        ],
        fallback: { de: "Nur eine kleine Schwäche - was ist schwierig für Sie?", ar: "ضعف صغير بس - إيه الحاجة الصعبة عليك؟" },
      },
    ],
    outro: { de: "Vielen Dank für das Gespräch! Wir melden uns bis Freitag bei Ihnen.", ar: "شكرًا على المقابلة! هنكلمك لحد يوم الجمعة." },
  },

  {
    id: "ausbildung", titleAr: "مقابلة Ausbildung", place: "Ausbildungsbetrieb", role: "Ausbilder", roleAr: "مسؤول التدريب", level: "B1",
    descAr: "قدّم على تدريب مهني (Ausbildung) واقنع المسؤول بيك.",
    steps: [
      {
        tutor: { de: "Hallo! Warum möchten Sie eine Ausbildung machen?", ar: "أهلًا! ليه عايز تعمل تدريب مهني؟" },
        hint: "رد: Ich möchte einen Beruf lernen, weil ...",
        intents: [
          { keys: ["beruf", "lernen", "weil", "praktisch", "zukunft"], reply: { de: "Gut! Und warum dieser Beruf? Was interessiert Sie daran?", ar: "جميل! وليه المهنة دي بالذات؟ إيه اللي بيعجبك فيها؟" } },
        ],
        fallback: { de: "Warum? Was ist Ihr Ziel?", ar: "ليه؟ إيه هدفك؟" },
      },
      {
        tutor: { de: "Was wissen Sie über unseren Betrieb?", ar: "بتعرف إيه عن شركتنا؟" },
        hint: "رد: Sie sind eine große Firma / Sie sind bekannt für ...",
        intents: [
          { keys: ["groß", "bekannt", "gut", "firma", "seit", "qualität"], reply: { de: "Das freut uns. Können Sie gut im Team arbeiten?", ar: "ده بيفرحنا. بتعرف تشتغل في فريق؟" } },
          { keys: ["nicht viel", "weiß"], reply: { de: "Kein Problem, ich erkläre es: Wir sind ein mittelgroßer Betrieb mit 50 Mitarbeitern. Können Sie gut im Team arbeiten?", ar: "مفيش مشكلة، هشرحلك: إحنا شركة متوسطة فيها 50 موظف. بتعرف تشتغل في فريق؟" } },
        ],
        fallback: { de: "Wie bitte? Was wissen Sie über uns?", ar: "إيه؟ بتعرف إيه عنا؟" },
      },
      {
        tutor: { de: "Können Sie gut im Team arbeiten?", ar: "بتعرف تشتغل في فريق؟" },
        hint: "رد: Ja, ich arbeite gern mit anderen. / أيوه طبعًا.",
        intents: [
          { keys: ["ja", "gern", "team", "natürlich", "immer"], reply: { de: "", ar: "" } },
        ],
        fallback: { de: "Teamarbeit - ja oder nein?", ar: "شغل جماعي - أيوه ولا لأ؟" },
      },
    ],
    outro: { de: "Super! Wir melden uns nächste Woche bei Ihnen.", ar: "ممتاز! هنكلمك الأسبوع الجاي." },
  },

  {
    id: "apartment", titleAr: "البحث عن شقة", place: "Wohnungsbesichtigung", role: "Vermieter", roleAr: "المالك", level: "A2",
    descAr: "زور شقة في ألمانيا واسأل المالك عن الإيجار والتفاصيل.",
    steps: [
      {
        tutor: { de: "Guten Tag! Sie möchten die Wohnung sehen?", ar: "نهارك سعيد! عايز تشوف الشقة؟" },
        hint: "رد: Ja, gern! / Ja, bitte. Die Wohnung sieht schön aus.",
        intents: [
          { keys: ["ja", "gern", "bitte", "schön"], reply: { de: "Dann kommen Sie herein. Hier ist das Wohnzimmer. Haben Sie Fragen?", ar: "اتفضل. دي الصالة. عندك أسئلة؟" } },
        ],
        fallback: { de: "Wie bitte? Möchten Sie die Wohnung sehen?", ar: "إيه؟ عايز تشوف الشقة؟" },
      },
      {
        tutor: { de: "Haben Sie Fragen zur Wohnung?", ar: "عندك أسئلة عن الشقة؟" },
        hint: "اسأل: Wie hoch ist die Miete? / Sind die Nebenkosten dabei?",
        intents: [
          { keys: ["miete", "kosten", "wie hoch", "euro"], reply: { de: "Die Kaltmiete ist 650 Euro, mit Nebenkosten 780 Euro.", ar: "الإيجار الأساسي 650 يورو، ومع المرافق 780 يورو." } },
          { keys: ["nebenkosten", "heizung", "strom"], reply: { de: "Die Nebenkosten sind 130 Euro. Die Heizung ist zentral.", ar: "المرافق 130 يورو. التدفئة مركزية." } },
        ],
        fallback: { de: "Fragen Sie einfach: Was kostet die Wohnung?", ar: "اسأل ببساطة: الشقة بكام؟" },
      },
      {
        tutor: { de: "Sonst noch etwas? Wann möchten Sie einziehen?", ar: "في حاجة تانية؟ عايز تسكن إمتى؟" },
        hint: "رد: Ab nächstem Monat. / Ich möchte sofort einziehen.",
        intents: [
          { keys: ["nächsten monat", "sofort", "ab", "einziehen"], reply: { de: "Gut! Dann brauchen wir einen Vertrag. Haben Sie Interesse?", ar: "تمام! هنحتاج عقد. مهتم؟" } },
        ],
        fallback: { de: "Wann möchten Sie einziehen?", ar: "عايز تسكن إمتى؟" },
      },
      {
        tutor: { de: "Haben Sie Interesse an der Wohnung?", ar: "مهتم بالشقة؟" },
        hint: "رد: Ja, ich nehme sie! / Ja, sehr. / Ich muss überlegen.",
        intents: [
          { keys: ["ja", "nehme", "interesse", "sehr"], reply: { de: "", ar: "" } },
        ],
        fallback: { de: "Ja oder nein? Interesse?", ar: "أيوه ولا لأ؟ مهتم؟" },
      },
    ],
    outro: { de: "Ausgezeichnet! Wir machen nächste Woche den Vertrag. Bis dann!", ar: "ممتاز! هنعمل العقد الأسبوع الجاي. أشوفك!" },
  },

  {
    id: "bank", titleAr: "في البنك", place: "Deutsche Bank", role: "Bankberater", roleAr: "موظف البنك", level: "B1",
    descAr: "افتح حساب بنكي في ألمانيا وافهم التفاصيل المهمة.",
    steps: [
      {
        tutor: { de: "Guten Tag! Wie kann ich Ihnen helfen?", ar: "نهارك سعيد! أقدر أساعدك إزاي؟" },
        hint: "قول: Ich möchte ein Konto eröffnen.",
        intents: [
          { keys: ["konto", "eröffnen", "öffnen"], reply: { de: "Gerne! Ein Girokonto für den Alltag. Haben Sie Ihren Pass und die Anmeldung dabei?", ar: "اتفضل! حساب جاري للاستخدام اليومي. معاك الباسبور ووصل السكن؟" } },
        ],
        fallback: { de: "Wie bitte? Was möchten Sie machen?", ar: "إيه؟ عايز تعمل إيه؟" },
      },
      {
        tutor: { de: "Haben Sie Ihren Pass und die Anmeldung dabei?", ar: "معاك الباسبور ووصل تسجيل السكن؟" },
        hint: "رد: Ja, hier bitte. / Hier sind meine Dokumente.",
        intents: [
          { keys: ["ja", "hier", "bitte", "dokumente", "pass"], reply: { de: "Perfekt! Das Konto ist kostenlos, wenn Sie jeden Monat mehr als 700 Euro bekommen. Fragen?", ar: "ممتاز! الحساب مجاني لو بتقبض أكتر من 700 يورو شهريًا. في أسئلة؟" } },
        ],
        fallback: { de: "Ihre Dokumente, bitte.", ar: "أوراقك لو سمحت." },
      },
      {
        tutor: { de: "Haben Sie noch Fragen zum Konto?", ar: "عندك أسئلة عن الحساب؟" },
        hint: "اسأل: Wann bekomme ich die Karte? / Gibt es eine App?",
        intents: [
          { keys: ["karte", "wann"], reply: { de: "Die EC-Karte kommt in einer Woche per Post.", ar: "الكارت هيجيلك في خلال أسبوع بالبريد." } },
          { keys: ["app", "online", "nein"], reply: { de: "", ar: "" } },
        ],
        fallback: { de: "Fragen? Ja oder nein?", ar: "أسئلة؟ أيوه ولا لأ؟" },
      },
    ],
    outro: { de: "Fertig! Ihr Konto ist eröffnet. Schönen Tag noch!", ar: "خلصنا! حسابك اتفتح. يومك سعيد!" },
  },

  {
    id: "amt", titleAr: "في الدوائر الحكومية", place: "Bürgeramt", role: "Sachbearbeiterin", roleAr: "الموظفة", level: "B1",
    descAr: "سجّل عنوانك في مكتب المواطنين (Anmeldung) ورد على الموظف بشكل رسمي.",
    steps: [
      {
        tutor: { de: "Guten Tag! Was möchten Sie heute erledigen?", ar: "نهارك سعيد! عايز تعمل إيه النهاردة؟" },
        hint: "قول: Ich möchte mich anmelden. / Ich bin neu in der Stadt.",
        intents: [
          { keys: ["anmelden", "meldung", "neu", "umziehen"], reply: { de: "Okay. Füllen Sie bitte dieses Formular aus. Haben Sie den Mietvertrag dabei?", ar: "تمام. املى الاستمارة دي لو سمحت. معاك عقد الإيجار؟" } },
        ],
        fallback: { de: "Wie bitte? Anmeldung oder etwas anderes?", ar: "إيه؟ تسجيل سكن ولا حاجة تانية؟" },
      },
      {
        tutor: { de: "Haben Sie den Mietvertrag und den Pass dabei?", ar: "معاك عقد الإيجار والباسبور؟" },
        hint: "رد: Ja, hier bitte. / Leider nicht. / أيوه معايا كل حاجة.",
        intents: [
          { keys: ["ja", "hier", "bitte", "alles"], reply: { de: "Sehr gut! Ihre Meldebescheinigung bekommen Sie nächste Woche per Post. Noch etwas?", ar: "ممتاز! شهادة تسجيل السكن هتوصلك في البريد الأسبوع الجاي. في حاجة تانية؟" } },
          { keys: ["nein", "leider", "vergessen"], reply: { de: "Dann müssen Sie leider mit allen Dokumenten wiederkommen. Machen Sie gleich einen neuen Termin online.", ar: "للأسف لازم تيجي تاني بكل الأوراق. احجز ميعاد جديد على طول أونلاين." } },
        ],
        fallback: { de: "Die Dokumente - ja oder nein?", ar: "الأوراق - معاك ولا لأ؟" },
      },
    ],
    outro: { de: "Alles erledigt. Auf Wiedersehen!", ar: "كل حاجة تمام. مع السلامة!" },
  },

  {
    id: "colleagues", titleAr: "مع زملاء العمل", place: "Büroküche", role: "Kollege Thomas", roleAr: "زميلك توماس", level: "B1",
    descAr: "اتكلم مع زميلك الألماني في بريك القهوة وحسّن لغتك الاجتماعية.",
    steps: [
      {
        tutor: { de: "Na, wie läuft's bei dir? Hattest du ein gutes Wochenende?", ar: "إيه الأخبار؟ شغلك ماشي إزاي؟ الويك إند كان حلو؟" },
        hint: "رد بود: Ja, bei mir läuft alles gut. Und bei dir?",
        intents: [
          { keys: ["gut", "läuft", "wochenende", "alles", "ja"], reply: { de: "Bei mir auch! Ich war in den Bergen wandern. Was machst du am Wochenende normalerweise?", ar: "عندي كمان! كنت بتسلق في الجبال. بتعمل إيه عادة في الويك إند؟" } },
        ],
        fallback: { de: "Ach, erzähl doch mal! Wie geht es dir?", ar: "يا سيدي احكيلي! عامل إيه؟" },
      },
      {
        tutor: { de: "Was machst du am Wochenende normalerweise?", ar: "بتعمل إيه عادة في الويك إند؟" },
        hint: "احكيله هواياتك: Ich treffe mich mit Freunden / Ich schaue Filme ...",
        intents: [
          { keys: ["freunde", "filme", "sport", "kochen", "familie", "schlafe", "reise"], reply: { de: "Klingt super! Wir machen Freitag einen Filmabend im Büro. Kommst du?", ar: "جميل! إحنا بنعمل ليلة أفلام في المكتب يوم الجمعة. جاي؟" } },
        ],
        fallback: { de: "Sag einfach, was du gern machst!", ar: "قول ببساطة بتحب تعمل إيه!" },
      },
      {
        tutor: { de: "Wir machen Freitag einen Filmabend im Büro. Kommst du?", ar: "بنعمل ليلة أفلام في المكتب يوم الجمعة. جاي؟" },
        hint: "رد: Ja, gern! / Vielleicht. / Leider kann ich nicht.",
        intents: [
          { keys: ["ja", "gern", "klar", "komme"], reply: { de: "Super! Bring doch Snacks mit, ja?", ar: "ممتاز! هات معاك شوية سنكس يعني، أوكي؟" } },
          { keys: ["vielleicht", "mal sehen"], reply: { de: "Okay, sag mir bis Donnerstag Bescheid!", ar: "أوكي، قولي لحد الخميس!" } },
          { keys: ["leider", "kann nicht", "nein"], reply: { de: "Schade! Dann beim nächsten Mal.", ar: "يا خسارة! المرة الجاية بقى." } },
        ],
        fallback: { de: "Na? Kommst du?", ar: "إيه؟ جاي؟" },
      },
    ],
    outro: { de: "Cool, ich muss zurück an die Arbeit. Bis später!", ar: "جميل، لازم أرجع الشغل. أشوفك بعدين!" },
  },
];

export function scenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

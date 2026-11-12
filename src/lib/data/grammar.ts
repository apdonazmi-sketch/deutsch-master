export type LessonExample = { de: string; ar: string };
export type LessonSection = { h: string; p: string; examples: LessonExample[] };
export type Lesson = {
  id: string;
  level: string;
  title: string;
  subtitle: string;
  minutes: number;
  sections: LessonSection[];
};

export const LESSONS: Lesson[] = [
  // ============ A1 ============
  {
    id: "a1-1", level: "A1", title: "Der, Die, Das - أدوات التعريف", subtitle: "الأسماء الألمانية ليها نوع", minutes: 7,
    sections: [
      { h: "الفكرة الأساسية", p: "في الألمانية كل اسم ليه نوع: مذكر (der)، مؤنث (die)، أو محايد (das). مفيش قاعدة واحدة سحرية، بس فيه نصايح: أغلب الناس الذكور der، الإناث die، وأسماء المعادن والبلاد أغلبها das. لازم تحفظ كل كلمة بأداتها من أول يوم.", examples: [
        { de: "der Mann - die Frau - das Kind", ar: "الراجل - الست - الطفل" },
        { de: "der Tisch, die Lampe, das Fenster", ar: "الترابيزة - اللمبة - الشباك" },
      ]},
      { h: "جدعنة في الحفظ", p: "متقولش Haus لوحدها. قول das Haus. التطبيق هنا بيحفظك الكلمة مع أداتها وجمعها دايمًا.", examples: [
        { de: "das Haus, die Häuser", ar: "البيت - البيوت" },
      ]},
    ],
  },
  {
    id: "a1-2", level: "A1", title: "الفعل في المكان التاني", subtitle: "أهم قاعدة في الجملة الألمانية", minutes: 8,
    sections: [
      { h: "القاعدة الذهبية", p: "في أي جملة ألمانية عادية، الفعل المتصرف لازم يكون في المكان التاني. حتى لو بدأت الجملة بالوقت أو المكان، الفعل يفضل تاني والفاعل يروح بعده.", examples: [
        { de: "Ich lerne heute Deutsch.", ar: "بتعلم ألماني النهاردة." },
        { de: "Heute lerne ich Deutsch.", ar: "النهاردة بتعلم ألماني (الفعل lerne لسه في المكان التاني)." },
        { de: "Morgen fahre ich nach Berlin.", ar: "بكرة رايح برلين." },
      ]},
    ],
  },
  {
    id: "a1-3", level: "A1", title: "تصريف الأفعال - Präsens", subtitle: "ich, du, er, wir", minutes: 9,
    sections: [
      { h: "التصريف المنتظم", p: "الأفعال المنتظمة: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en. زي: machen → ich mache, du machst, er macht, wir machen.", examples: [
        { de: "Ich lerne, du lernst, er lernt, wir lernen", ar: "بيتعلم - بتتعلم - بيتعلم - بنتعلم" },
        { de: "Sie arbeitet bei BMW.", ar: "هي بتشتغل في بي إم دبليو." },
      ]},
      { h: "أفعال شاذة مهمة", p: "sein (يكون) و haben (يكون عنده) هم أهم فعلين لازم تحفظهم حفظ: ich bin, du bist, er ist, wir sind ... و ich habe, du hast, er hat, wir haben.", examples: [
        { de: "Ich bin müde. Ich habe Hunger.", ar: "أنا تعبان. أنا جعان." },
        { de: "Er ist Arzt. Wir haben Zeit.", ar: "هو دكتور. عندنا وقت." },
      ]},
    ],
  },
  {
    id: "a1-4", level: "A1", title: "الأسئلة - W-Fragen", subtitle: "إزاي تسأل سؤال", minutes: 7,
    sections: [
      { h: "أسئلة بأدوات استفهام", p: "أسئلة W بتبدأ بأداة وبعدها الفعل: Was (إيه)، Wer (مين)، Wo (فين)، Wann (إمتى)، Wie (إزاي)، Warum (ليه)، Woher (منين).", examples: [
        { de: "Wo wohnst du?", ar: "ساكن فين؟" },
        { de: "Woher kommst du?", ar: "جاي منين؟" },
        { de: "Wann beginnt der Kurs?", ar: "الكورس بيبدأ إمتى؟" },
      ]},
      { h: "أسئلة نعم/لا", p: "الفعل ييجي الأول وبعده الفاعل، زي: Kommst du? - Kommst du aus Ägypten?", examples: [
        { de: "Sprechen Sie Deutsch?", ar: "بتتكلم ألماني؟" },
        { de: "Hast du Zeit?", ar: "عندك وقت؟" },
      ]},
    ],
  },
  {
    id: "a1-5", level: "A1", title: "النفي - nicht و kein", subtitle: "إزاي تقول لأ", minutes: 6,
    sections: [
      { h: "kein للأسماء", p: "لو بتنفي اسم (عندي/مش عندي حاجة) استخدم kein:", examples: [
        { de: "Ich habe kein Auto.", ar: "ماعنديش عربية." },
        { de: "Ich habe keine Zeit.", ar: "ماعنديش وقت." },
      ]},
      { h: "nicht للأفعال والصفات", p: "لو بتنفي فعل أو صفة استخدم nicht:", examples: [
        { de: "Ich komme nicht.", ar: "أنا مش جاي." },
        { de: "Das ist nicht teuer.", ar: "ده مش غالي." },
      ]},
    ],
  },
  {
    id: "a1-6", level: "A1", title: "الأفعال الناقصة - Modalverben", subtitle: "عايز / أقدر / لازم", minutes: 8,
    sections: [
      { h: "الفكرة", p: "الفعل الناقص بييجي في المكان التاني والفعل الأساسي في آخر الجملة في المصدر: können (أقدر)، müssen (لازم)، wollen (عايز بإصرار)، möchten (عايز بأدب)، dürfen (مسموح)، sollen (المفروض).", examples: [
        { de: "Ich muss morgen arbeiten.", ar: "لازم أشتغل بكرة." },
        { de: "Ich möchte einen Kaffee bestellen.", ar: "عايز أطلب قهوة." },
        { de: "Kann ich hier parken?", ar: "أقدر أركن هنا؟" },
      ]},
    ],
  },
  {
    id: "a1-7", level: "A1", title: "الأرقام والوقت والأيام", subtitle: "numbers & time", minutes: 8,
    sections: [
      { h: "الأرقام", p: "eins, zwei, drei, vier, fünf, sechs, sieben, acht, neun, zehn ... zwanzig (عشرين). من 21 لـ 99 الرقم الصغير الأول: einundzwanzig = واحد وعشرين.", examples: [
        { de: "fünfundzwanzig Euro", ar: "خمسة وعشرين يورو" },
        { de: "Ich bin achtundzwanzig Jahre alt.", ar: "عندي تمانية وعشرين سنة." },
      ]},
      { h: "الأيام والوقت", p: "Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag, Sonntag. السؤال عن الوقت: Wie spät ist es? والرد: Es ist acht Uhr.", examples: [
        { de: "Der Termin ist am Montag um zehn Uhr.", ar: "الميعاد يوم الاتنين الساعة عشرة." },
      ]},
    ],
  },
  {
    id: "a1-8", level: "A1", title: "التعريف بالنفس", subtitle: "Sich vorstellen", minutes: 6,
    sections: [
      { h: "جمل جاهزة مهمة", p: "دي الجمل اللي هتحتاجها في أول يوم ليك في ألمانيا:", examples: [
        { de: "Ich heiße Ahmed. / Mein Name ist Ahmed.", ar: "اسمي أحمد." },
        { de: "Ich komme aus Ägypten.", ar: "أنا من مصر." },
        { de: "Ich wohne in Kairo.", ar: "ساكن في القاهرة." },
        { de: "Ich bin 25 Jahre alt.", ar: "عندي 25 سنة." },
        { de: "Ich arbeite als Ingenieur.", ar: "بشتغل مهندس." },
        { de: "Ich lerne Deutsch seit drei Monaten.", ar: "بتعلم ألماني بقالي تلات شهور." },
      ]},
    ],
  },

  // ============ A2 ============
  {
    id: "a2-1", level: "A2", title: "الماضي - Perfekt", subtitle: "إزاي تحكي عن اللي حصل", minutes: 10,
    sections: [
      { h: "التركيبة", p: "الـ Perfekt = haben/sein + الماضي في آخر الجملة. أغلب الأفعال مع haben. أفعال الحركة والتغيير مع sein (gehen, fahren, kommen, aufstehen...).", examples: [
        { de: "Ich habe eine Pizza gegessen.", ar: "أكلت بيتزا." },
        { de: "Ich bin nach Berlin gefahren.", ar: "رحت برلين." },
        { de: "Wir haben Fußball gespielt.", ar: "لعبنا كورة." },
        { de: "Er ist spät aufgestanden.", ar: "صحي متأخر." },
      ]},
      { h: "أفعال شائعة لازم تعرفها", p: "machen→gemacht, essen→gegessen, trinken→getrunken, gehen→gegangen, kommen→gekommen, sehen→gesehen, kaufen→gekauft, arbeiten→gearbeitet, schlafen→geschlafen.", examples: [
        { de: "Gestern habe ich bis elf geschlafen.", ar: "امبارح نمت لحد الساعة 11." },
      ]},
    ],
  },
  {
    id: "a2-2", level: "A2", title: "الأفعال المنفصلة", subtitle: "Trennbare Verben", minutes: 8,
    sections: [
      { h: "الفكرة", p: "في أفعال ليها بادئة بتنفصل وتروح آخر الجملة: anfangen, aufstehen, anrufen, mitkommen, einkaufen, fernsehen. تصريفها في الجملة العادية بينفصل.", examples: [
        { de: "Der Kurs fängt um neun Uhr an.", ar: "الكورس بيبدأ الساعة تسعة." },
        { de: "Ich stehe um sechs Uhr auf.", ar: "بصحى الساعة ستة." },
        { de: "Kommst du mit?", ar: "جاي معايا؟" },
      ]},
    ],
  },
  {
    id: "a2-3", level: "A2", title: "حروف الجر مع الحالات", subtitle: "Dativ & Akkusativ", minutes: 10,
    sections: [
      { h: "الفكرة ببساطة", p: "حروف الجر بتحدد شكل الأداة اللي بعدها. Dativ (ثابت): mit, nach, bei, von, zu, aus. Akkusativ (حركة): durch, für, gegen, ohne, um. في أماكن (in, an, auf...) بتاخد Akkusativ مع الحركة (wohin?) و Dativ مع المكان الثابت (wo?).", examples: [
        { de: "Ich fahre mit dem Zug.", ar: "رايح بالقطر." },
        { de: "Ich gehe in die Schule. / Ich bin in der Schule.", ar: "رايح المدرسة (حركة) / أنا في المدرسة (مكان)." },
        { de: "Das Geschenk ist für dich.", ar: "الهدية دي ليك." },
      ]},
    ],
  },
  {
    id: "a2-4", level: "A2", title: "الاتجاهات والمواصلات", subtitle: "Wege beschreiben", minutes: 7,
    sections: [
      { h: "جمل عملية", p: "دي جمل هتستخدمها يوميًا في ألمانيا:", examples: [
        { de: "Gehen Sie geradeaus, dann links.", ar: "امشي على طول وبعدين شمال." },
        { de: "Welche Linie fährt zum Hauptbahnhof?", ar: "أنهي خط بيروح المحطة الرئيسية؟" },
        { de: "Muss ich umsteigen?", ar: "لازم أغيّر القطر؟" },
        { de: "Einmal nach München, bitte.", ar: "تذكرة لميونخ لو سمحت." },
      ]},
    ],
  },
  {
    id: "a2-5", level: "A2", title: "الأجازات والمواعيد", subtitle: "Termine vereinbaren", minutes: 7,
    sections: [
      { h: "على التليفون وفي الدوائر", p: "في ألمانيا كل حاجة بميعاد. لازم تعرف تحجز وتلغي وتأجل:", examples: [
        { de: "Ich möchte einen Termin vereinbaren.", ar: "عايز أحجز ميعاد." },
        { de: "Geht es auch am Freitag?", ar: "ينفع يوم الجمعة؟" },
        { de: "Leider muss ich den Termin absagen.", ar: "للأسف لازم ألغي الميعاد." },
        { de: "Können wir den Termin verschieben?", ar: "ممكن نأجل الميعاد؟" },
      ]},
    ],
  },
  {
    id: "a2-6", level: "A2", title: "المقارنة", subtitle: "Komparativ", minutes: 6,
    sections: [
      { h: "أحسن وأكبر وأرخص", p: "الصفة + er للمقارنة، و am ...sten للأفضلية: groß → größer → am größten.", examples: [
        { de: "Berlin ist größer als Bonn.", ar: "برلين أكبر من بون." },
        { de: "Der Zug ist schneller als der Bus.", ar: "القطر أسرع من الأتوبيس." },
        { de: "Das ist die beste Lösung.", ar: "دي أحسن حل." },
      ]},
    ],
  },

  // ============ B1 ============
  {
    id: "b1-1", level: "B1", title: "التعبير عن الرأي", subtitle: "Meinung ausdrücken", minutes: 9,
    sections: [
      { h: "عبارات الوسيط", p: "في B1 لازم تقول رأيك وتدافع عنه:", examples: [
        { de: "Ich bin der Meinung, dass ...", ar: "أنا رأيي إن ..." },
        { de: "Meiner Meinung nach ist das richtig.", ar: "في رأيي ده صح." },
        { de: "Ich stimme dir (nicht) zu.", ar: "(مش) متفق معاك." },
        { de: "Einerseits verstehe ich dich, andererseits ...", ar: "من ناحية فاهمك، بس من ناحية تانية ..." },
      ]},
    ],
  },
  {
    id: "b1-2", level: "B1", title: "الجمل التابعة - weil, dass, wenn", subtitle: "Nebensätze", minutes: 10,
    sections: [
      { h: "الفعل في الآخر", p: "في الجمل التابعة الفعل بيروح آخر الجملة خالص: weil (علشان)، dass (إن)، wenn (لو/لما)، obwohl (رغم إن)، während (بينما).", examples: [
        { de: "Ich lerne Deutsch, weil ich in Deutschland arbeiten will.", ar: "بتعلم ألماني علشان عايز أشتغل في ألمانيا." },
        { de: "Ich hoffe, dass du bald kommst.", ar: "أتمنى إنك تيجي قريب." },
        { de: "Obwohl es regnet, gehen wir spazieren.", ar: "رغم إن الدنيا بتمطر، طالعين نتمشى." },
      ]},
    ],
  },
  {
    id: "b1-3", level: "B1", title: "كتابة الرسائل والإيميلات", subtitle: "Briefe schreiben", minutes: 8,
    sections: [
      { h: "الهيكل الرسمي", p: "الإيميل الرسمي: التحية Sehr geehrte Damen und Herren / Sehr geehrter Herr Müller، المحتوى، الخاتمة Mit freundlichen Grüßen (MfG).", examples: [
        { de: "Sehr geehrte Damen und Herren,", ar: "السادة الأفاضل،" },
        { de: "Ich schreibe Ihnen, weil ich eine Frage habe.", ar: "بكتبلكم علشان عندي سؤال." },
        { de: "Mit freundlichen Grüßen", ar: "مع خالص التحية" },
      ]},
    ],
  },
  {
    id: "b1-4", level: "B1", title: "المقابلات الوظيفية", subtitle: "Im Vorstellungsgespräch", minutes: 9,
    sections: [
      { h: "أسئلة شائعة وإجابات", p: "أسئلة الانترفيو الألماني معروفة، حضّر إجاباتك:", examples: [
        { de: "Erzählen Sie etwas über sich.", ar: "احكيلنا عن نفسك." },
        { de: "Warum möchten Sie bei uns arbeiten?", ar: "ليه عايز تشتغل معانا؟" },
        { de: "Was sind Ihre Stärken und Schwächen?", ar: "إيه نقاط قوتك وضعفك؟" },
        { de: "Ich bin zuverlässig und lerne schnell.", ar: "أنا محل ثقة وبتعلم بسرعة." },
      ]},
    ],
  },
  {
    id: "b1-5", level: "B1", title: "سرد الأحداث", subtitle: "Vergangenheit erzählen", minutes: 8,
    sections: [
      { h: "الربط الزمني", p: "علشان تحكي قصة استخدم أدوات ربط: zuerst, dann, danach, später, plötzlich, zum Schluss.", examples: [
        { de: "Zuerst bin ich aufgestanden, dann habe ich gefrühstückt.", ar: "الأول صحيت، وبعدين فطرت." },
        { de: "Plötzlich hat mein Handy geklingelt.", ar: "فجأة موبايلي رن." },
      ]},
    ],
  },

  // ============ B2 ============
  {
    id: "b2-1", level: "B2", title: "النقاشات المعقدة", subtitle: "Diskutieren wie ein Profi", minutes: 10,
    sections: [
      { h: "أدوات خطابية", p: "في B2 بتتكلم بشكل أدق وبتبرر موقفك:", examples: [
        { de: "Aus meiner Sicht ist das ein kluger Schritt.", ar: "من وجهة نظري دي خطوة ذكية." },
        { de: "Das hängt von der Situation ab.", ar: "ده بيعتمد على الموقف." },
        { de: "Dagegen spricht, dass ...", ar: "ضد الكلام ده إن ..." },
        { de: "Man muss bedenken, dass ...", ar: "لازم ناخد في الاعتبار إن ..." },
      ]},
    ],
  },
  {
    id: "b2-2", level: "B2", title: "اللغة المهنية", subtitle: "Deutsch im Job", minutes: 9,
    sections: [
      { h: "في الشغل والاجتماعات", p: "لغة الشغل ليها صيغ محترمة ومباشرة:", examples: [
        { de: "Ich melde mich bei Ihnen zurück.", ar: "هرجع أكلمك." },
        { de: "Könnten Sie das bitte bis Freitag prüfen?", ar: "ممكن تراجع ده لحد الجمعة لو سمحت؟" },
        { de: "Wir sollten einen Termin abstimmen.", ar: "المفروض ننسق على ميعاد." },
      ]},
    ],
  },
  {
    id: "b2-3", level: "B2", title: "Passiv - المبني للمجهول", subtitle: "werden + Partizip II", minutes: 9,
    sections: [
      { h: "الفكرة", p: "المبني للمجهول مهم جدًا في الأخبار والشغل: werden + Partizip II.", examples: [
        { de: "Das Haus wird renoviert.", ar: "البيت بيتصلح." },
        { de: "Der Termin wurde verschoben.", ar: "الميعاد اتأجل." },
        { de: "Viele Bücher werden jedes Jahr veröffentlicht.", ar: "كتب كتير بتتنشر كل سنة." },
      ]},
    ],
  },
  {
    id: "b2-4", level: "B2", title: "الترابط النصي", subtitle: "Konnektoren auf B2", minutes: 8,
    sections: [
      { h: "روابط متقدمة", p: "علشان كلامك يبقى متماسك: deshalb (لذلك)، trotzdem (رغم كده)، außerdem (كمان)، jedoch (لكن)، sowohl ... als auch (كذا وكذا).", examples: [
        { de: "Ich war krank, deshalb bin ich zu Hause geblieben.", ar: "كنت تعبان، لذلك فضلت في البيت." },
        { de: "Trotz der Schwierigkeit lerne ich weiter.", ar: "رغم الصعوبة، هكمل أتعلم." },
      ]},
    ],
  },

  // ============ C1 ============
  {
    id: "c1-1", level: "C1", title: "الدقة اللغوية", subtitle: "Feinheiten & Nuancen", minutes: 10,
    sections: [
      { h: "الفرق بين كلمات قريبة", p: "في C1 الفروق الدقيقة هي الفرق: wissen/können/kennen، überlegen/nachdenken/erwägen.", examples: [
        { de: "Ich erwäge einen Jobwechsel.", ar: "بفكّر بجدية في تغيير الشغل." },
        { de: "Das ist ein wichtiges Anliegen.", ar: "ده مطلب مهم." },
      ]},
    ],
  },
  {
    id: "c1-2", level: "C1", title: "الكتابة الرسمية والأكاديمية", subtitle: "Formelle Texte", minutes: 10,
    sections: [
      { h: "أسلوب احترافي", p: "في الكتابة الرسمية استخدم اسلوب موضوعي وروابط أعلى: zudem, darüber hinaus, folglich, hingegen.", examples: [
        { de: "Darüber hinaus ist zu berücksichtigen, dass ...", ar: "بالإضافة لكده لازم نراعي إن ..." },
        { de: "Folglich ergibt sich ein klares Bild.", ar: "وبالتالي بتتضح الصورة." },
      ]},
    ],
  },
  {
    id: "c1-3", level: "C1", title: "المصطلحات المهنية", subtitle: "Fachsprache", minutes: 9,
    sections: [
      { h: "مجالك قاعدتك", p: "في C1 بتتعلم لغة مجالك: IT، طب، هندسة، أو تجارة. ركز على المصطلحات اللي بتستخدمها كل يوم في شغلك.", examples: [
        { de: "die Schnittstelle, die Anforderung, die Bereitstellung", ar: "الواجهة، المتطلب، التوفير (مصطلحات IT)" },
      ]},
    ],
  },

  // ============ C2 ============
  {
    id: "c2-1", level: "C2", title: "التعبير الطبيعي", subtitle: "Idiomatisches Deutsch", minutes: 10,
    sections: [
      { h: "عبارات المدار", p: "ألماني C2 بيستخدم تعبيرات اصطلاحية بشكل طبيعي:", examples: [
        { de: "Das passt wie die Faust aufs Auge.", ar: "ده مناسب جدًا (حرفيًا: كالقبضة على العين)." },
        { de: "Ich drücke dir die Daumen.", ar: "أتمنالك حظ حلو (بدعيلك)." },
        { de: "Da hast du recht.", ar: "معاك حق." },
      ]},
    ],
  },
  {
    id: "c2-2", level: "C2", title: "الأساليب اللغوية", subtitle: "Stilebenen", minutes: 10,
    sections: [
      { h: "من العامية للرسمي", p: "لازم تعرف تغيّر أسلوبك حسب الموقف: كلمة كويس = gut (عادي)، hervorragend (رسمي)، spitze/klasse (عامي).", examples: [
        { de: "Das ist ja der Hammer!", ar: "ده حاجة تحفة! (عامي جدًا)" },
        { de: "Die Ergebnisse sind hervorragend.", ar: "النتائج ممتازة. (رسمي)" },
      ]},
    ],
  },
  {
    id: "c2-3", level: "C2", title: "الكتابة الإبداعية والمتخصصة", subtitle: "Kreativ & fachlich", minutes: 10,
    sections: [
      { h: "اللغة كفن", p: "في C2 بتستخدم اللغة بإبداع: تشبيهات، سخرية، وتلاعب بالكلمات. القراءة الكتير والكتابة اليومية هي الطريق.", examples: [
        { de: "Die Nacht legte sich wie ein Mantel über die Stadt.", ar: "الليل غطى المدينة زي معطف." },
      ]},
    ],
  },
];

export function lessonsByLevel(level: string): Lesson[] {
  return LESSONS.filter((l) => l.level === level);
}

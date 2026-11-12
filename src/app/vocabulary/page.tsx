"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, RefreshCw, LibraryBig, Check, Volume2, Plus, Search, CheckCircle2 } from "lucide-react";
import ClientShell from "@/components/ClientShell";
import { SpeakButton } from "@/components/voice";
import type { VocabItem } from "@/lib/data/vocab";

type Item = VocabItem & { srs?: { reps: number; intervalDays: number } };

const ART_STYLE: Record<string, string> = {
  der: "text-sky-300 border-sky-400/40 bg-sky-400/10",
  die: "text-rose-300 border-rose-400/40 bg-rose-400/10",
  das: "text-mint border-mint/40 bg-mint/10",
};

function WordCard({ item, onAdd, added }: { item: Item; onAdd: () => void; added: boolean }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="german flex items-baseline gap-2" dir="ltr">
            {item.art && (
              <span className={`rounded-md border px-2 py-0.5 text-[11px] font-bold ${ART_STYLE[item.art]}`} dir="ltr">{item.art}</span>
            )}
            <span className="text-xl font-bold">{item.de}</span>
            {item.pl && <span className="text-xs text-muted">· {item.pl}</span>}
          </div>
          <div className="mt-1.5 text-sm font-bold text-cream/90">{item.ar}</div>
        </div>
        <div className="flex items-center gap-2">
          <SpeakButton text={item.art ? `${item.art} ${item.de}` : item.de} />
          <button
            onClick={onAdd}
            disabled={added}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
              added ? "border-mint/50 bg-mint/10 text-mint" : "border-line text-muted hover:border-gold/60 hover:text-gold"
            }`}
            aria-label="ضيف للمراجعة"
          >
            {added ? <Check size={16} /> : <Plus size={16} />}
          </button>
        </div>
      </div>
      <div className="mt-3 rounded-xl bg-white/[0.03] px-4 py-3">
        <div className="german text-[13px] leading-6" dir="ltr">{item.ex}</div>
        <div className="mt-0.5 text-xs text-muted">{item.exAr}</div>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[10px] text-muted">
        <span className="german rounded-full bg-white/[0.04] px-2 py-0.5">{item.level}</span>
        {item.srs && <span>مستوى التثبيت: {Math.min(100, Math.round((item.srs.intervalDays / 21) * 100))}%</span>}
      </div>
    </div>
  );
}

export default function VocabularyPage() {
  const [tab, setTab] = useState<"learn" | "review" | "all">("learn");
  const [learnItems, setLearnItems] = useState<Item[]>([]);
  const [learnedIds, setLearnedIds] = useState<Set<string>>(new Set());
  const [dueItems, setDueItems] = useState<Item[]>([]);
  const [dueCount, setDueCount] = useState(0);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [reviewDone, setReviewDone] = useState(0);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get("mode");
    if (m === "review") setTab("review");
    refreshLearn();
    refreshReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refreshLearn() {
    const r = await fetch("/api/vocab?mode=learn").then((x) => x.json());
    setLearnItems(r.items ?? []);
    setLearnedIds(new Set(r.learned ?? []));
    setLoading(false);
  }

  async function refreshReview() {
    const r = await fetch("/api/vocab/review").then((x) => x.json()).catch(() => ({ items: [] }));
    setDueItems(r.items ?? []);
    setDueCount(r.due ?? (r.items?.length ?? 0));
  }

  async function loadAll() {
    const r = await fetch(`/api/vocab?q=${encodeURIComponent(search)}&level=${levelFilter}`).then((x) => x.json());
    setAllItems(r.items ?? []);
    setLearnedIds(new Set(r.learned ?? []));
  }

  useEffect(() => {
    if (tab === "all") loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, search, levelFilter]);

  async function addToReview(id: string) {
    await fetch("/api/vocab", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vocabId: id }) });
    setLearnedIds((s) => new Set(s).add(id));
  }

  async function addAllToday() {
    const fresh = learnItems.filter((i) => !learnedIds.has(i.id));
    await Promise.all(fresh.map((i) => fetch("/api/vocab", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vocabId: i.id }) })));
    setLearnedIds((s) => new Set([...s, ...fresh.map((f) => f.id)]));
    fetch("/api/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task: "newwords", minutes: 6 }) });
  }

  async function answerReview(quality: number) {
    const item = dueItems[reviewIdx];
    if (!item) return;
    await fetch("/api/vocab/review", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vocabId: item.id, quality }) });
    const newDone = reviewDone + 1;
    setReviewDone(newDone);
    if (reviewIdx + 1 >= dueItems.length) {
      fetch("/api/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ task: "review", minutes: 5 }) });
      setDueItems([]);
      setDueCount(0);
    } else {
      setReviewIdx((i) => i + 1);
      setRevealed(false);
    }
  }

  const currentReview = dueItems[reviewIdx];
  const filteredAll = useMemo(() => allItems, [allItems]);

  return (
    <ClientShell>
      <div className="mb-7 flex flex-wrap items-center gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-black">
            <BookOpen className="text-gold" /> قاموسك الشخصي
          </h1>
          <p className="mt-1 text-sm text-muted">كل كلمة بأداتها وجمعها ومعناها وبمثال واقعي — والتكرار المتباعد بيرجعهالك في وقتها.</p>
        </div>
        <div className="ms-auto flex rounded-full border border-line bg-coal p-1">
          {(
            [
              { id: "learn", label: "كلمات النهاردة", icon: Plus },
              { id: "review", label: dueCount > 0 ? `مراجعة (${dueCount})` : "مراجعة", icon: RefreshCw },
              { id: "all", label: "القاموس كله", icon: LibraryBig },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${tab === t.id ? "bg-gold text-ink" : "text-muted hover:text-cream"}`}
            >
              <t.icon size={13} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* LEARN TAB */}
      {tab === "learn" && (
        <>
          {loading ? (
            <p className="py-16 text-center text-sm text-muted">بنجهّز كلماتك...</p>
          ) : learnItems.length === 0 ? (
            <div className="card p-10 text-center">
              <CheckCircle2 className="mx-auto mb-3 text-mint" size={36} />
              <p className="font-bold">خلصت كلمات النهاردة! جرب المراجعة أو القاموس.</p>
            </div>
          ) : (
            <>
              <div className="card mb-5 flex flex-wrap items-center gap-4 border-gold/25 p-5">
                <p className="text-sm leading-7 text-cream/90">
                  كلمات النهاردة: <span className="german font-bold text-gold">{learnItems.length}</span> — ازرعها في دماغك: اقرأها بصوت عالي، وضيفها للمراجعة.
                </p>
                <button onClick={addAllToday} className="btn-gold ms-auto px-5 py-2.5 text-xs">
                  ضيف الكل للمراجعة
                </button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {learnItems.map((item) => (
                  <WordCard key={item.id} item={item} added={learnedIds.has(item.id)} onAdd={() => addToReview(item.id)} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* REVIEW TAB */}
      {tab === "review" && (
        <div className="mx-auto max-w-xl">
          {dueItems.length === 0 ? (
            <div className="card p-10 text-center">
              {reviewDone > 0 ? (
                <>
                  <CheckCircle2 className="mx-auto mb-3 text-mint" size={36} />
                  <p className="font-extrabold">راجعنا {reviewDone} كلمة — الذاكرة بتتبني!</p>
                  <p className="mt-2 text-sm text-muted">التكرار المتباعد هيحدد معاد كل كلمة لوحدها. ارجع بكرة.</p>
                </>
              ) : (
                <>
                  <p className="font-bold">مفيش كلمات مستنية مراجعة دلوقتي.</p>
                  <p className="mt-2 text-sm text-muted">ضيف كلمات من تبويب &quot;كلمات النهاردة&quot; وهتظهر هنا بعد شوية.</p>
                </>
              )}
            </div>
          ) : (
            currentReview && (
              <div className="space-y-4">
                <div className="text-center text-xs text-muted">باقي {dueItems.length - reviewIdx} كلمة</div>
                <button
                  onClick={() => setRevealed(true)}
                  className="card w-full cursor-pointer p-10 text-center transition-all hover:border-gold/40"
                >
                  <div className="german flex items-center justify-center gap-3" dir="ltr">
                    {currentReview.art && (
                      <span className={`rounded-md border px-2.5 py-1 text-xs font-bold ${ART_STYLE[currentReview.art]}`}>{currentReview.art}</span>
                    )}
                    <span className="text-3xl font-bold">{currentReview.de}</span>
                    <Volume2 size={16} className="text-muted" />
                  </div>
                  {revealed ? (
                    <div className="mt-6 space-y-3 animate-reveal">
                      <div className="text-xl font-bold text-gold">{currentReview.ar}</div>
                      <div className="rounded-xl bg-white/[0.03] px-4 py-3">
                        <div className="german text-sm" dir="ltr">{currentReview.ex}</div>
                        <div className="mt-1 text-xs text-muted">{currentReview.exAr}</div>
                      </div>
                      {currentReview.pl && <div className="german text-xs text-muted" dir="ltr">Plural: die {currentReview.pl}</div>}
                    </div>
                  ) : (
                    <p className="mt-6 text-sm text-muted">دوس علشان تشوف المعنى — وقولها بصوتك الأول!</p>
                  )}
                </button>
                {revealed && (
                  <div className="grid grid-cols-3 gap-3 animate-reveal">
                    <button onClick={() => answerReview(0)} className="btn-ghost border-germanred/40 py-3 text-sm font-bold text-germanred hover:border-germanred">
                      نسيتها
                    </button>
                    <button onClick={() => answerReview(3)} className="btn-ghost border-gold/40 py-3 text-sm font-bold text-gold hover:border-gold">
                      مش متأكد
                    </button>
                    <button onClick={() => answerReview(5)} className="btn-ghost border-mint/40 py-3 text-sm font-bold text-mint hover:border-mint">
                      عارفها
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}

      {/* DICTIONARY TAB */}
      {tab === "all" && (
        <>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search size={16} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted" />
              <input className="input pr-11" placeholder="دوّر بالألماني أو بالمصري..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-1 rounded-full border border-line bg-coal p-1">
              {["", "A1", "A2", "B1", "B2"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevelFilter(l)}
                  className={`german rounded-full px-4 py-1.5 text-xs font-bold ${levelFilter === l ? "bg-gold text-ink" : "text-muted"}`}
                >
                  {l || "الكل"}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {filteredAll.map((item) => (
              <WordCard key={item.id} item={item} added={learnedIds.has(item.id)} onAdd={() => addToReview(item.id)} />
            ))}
            {filteredAll.length === 0 && <p className="col-span-full py-12 text-center text-sm text-muted">مفيش نتايج للبحث ده.</p>}
          </div>
        </>
      )}
    </ClientShell>
  );
}

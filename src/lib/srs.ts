// SM-2 inspired spaced repetition engine.

export interface SrsState {
  ease: number;
  intervalDays: number;
  reps: number;
  lapses: number;
}

export interface SrsResult extends SrsState {
  nextReviewAt: Date;
  quality: number;
}

// quality: 0 = نسيتها تمامًا, 3 = مش متأكد, 5 = عارفها كويس
export function reviewCard(state: SrsState, quality: number, now = new Date()): SrsResult {
  let { ease, intervalDays, reps, lapses } = state;

  if (quality < 3) {
    // Lapse: relearn soon, small ease penalty.
    reps = 0;
    lapses += 1;
    ease = Math.max(1.3, ease - 0.2);
    intervalDays = 0; // review again this session (10 min)
    const nextReviewAt = new Date(now.getTime() + 10 * 60 * 1000);
    return { ease, intervalDays, reps, lapses, nextReviewAt, quality };
  }

  reps += 1;
  if (quality === 3) {
    ease = Math.max(1.3, ease - 0.15);
  } else {
    ease = Math.min(2.8, ease + 0.1);
  }

  if (reps === 1) intervalDays = 1;
  else if (reps === 2) intervalDays = 3;
  else intervalDays = Math.max(1, Math.round(intervalDays * ease));
  if (quality === 3) intervalDays = Math.max(1, Math.round(intervalDays * 0.6));

  const nextReviewAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  return { ease, intervalDays, reps, lapses, nextReviewAt, quality };
}

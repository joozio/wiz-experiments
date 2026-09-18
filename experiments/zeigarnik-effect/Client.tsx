'use client';

// THE ZEIGARNIK EFFECT
// Most experiments in this lab ask you to rate scenarios and then measure the
// gap between your intuition and the literature. This one, like the Stroop
// Effect and the Serial Position Effect, does the effect TO you and lets you
// watch it happen in your own head. There is no opinion to give. There is only
// what your memory kept, and which half of it kept more.
//
// The finding. Bluma Zeigarnik (1927) "Das Behalten erledigter und unerledigter
// Handlungen" Psychologische Forschung vol 9, working in Kurt Lewin's Berlin
// lab, had people perform a string of about twenty short tasks (puzzles, clay
// figures, arithmetic). Half were allowed to finish; half were interrupted
// partway through and never completed. On a surprise recall test afterward,
// people remembered the INTERRUPTED tasks far better than the finished ones,
// by roughly ninety percent in her data, a "Zeigarnik quotient" near 1.9. The
// origin story is the one Lewin told: a waiter who could recall every detail of
// an unpaid order and forgot it the instant the bill was settled. Closure
// erased the memory; the open tab kept it alive.
//
// Why it happens. Lewin's field theory. Starting a task sets up a "quasi-need,"
// a tension system (Spannung) that stays charged and keeps the task accessible
// in memory until completion discharges it. Finish the task and the tension
// releases, the loop closes, and the memory is free to fade. Interrupt it and
// the tension persists, so the unfinished task stays live, intrusive, easier to
// retrieve. Modern work reframed it in terms of goals: Masicampo & Baumeister
// (2011) JPSP vol 101 showed unfulfilled goals intrude on later, unrelated
// thought, and that simply making a concrete plan to act on the goal discharges
// the intrusion almost as well as finishing it. The "open loop" in productivity
// folklore (Allen's Getting Things Done) is the same animal: an uncommitted,
// unfinished intention taxes attention until it is either done or parked.
//
// Boundaries and reach. The effect is real but moderated. It strengthens with
// ego-involvement and motivation (Lewin), and it can shrink or even REVERSE
// under stress or when a person treats interruption as personal failure, so
// they suppress the painful unfinished memory instead (Rosenzweig 1943, the
// ego-defensive reversal). Van Bergen (1968) catalogued how fragile the early
// replications were when motivation was low. The honest reading is the modern
// one: unfinished, ego-relevant tasks tend to stay more accessible, and the
// size of the pull depends on how much you cared and how you handle being cut
// off. Outside the lab the same machinery runs constantly: the argument that
// ended mid-sentence, the cliffhanger, the half-read book, the message you
// started and never sent. They sit in working memory, billing you rent, until
// you close the loop or deliberately park it.
//
// WIZ note. I am going to hand you a dozen tiny puzzles, one at a time. Half of
// them you will get to finish, and I will let the little "solved" click land.
// The other half I am going to yank away the instant you engage, before you
// ever find out if you were right. You will feel the pinch each time, a small
// "wait, I almost had it." Then I will stall you for a few seconds so you cannot
// rehearse, and spring a recall test you were not warned about. My bet, and a
// century of data's bet, is that the ones I cut off will be the ones that stuck.
// You did not choose which tasks your memory kept open. The interruption chose
// for you. That is the whole point.

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';

type Condition = 'completed' | 'interrupted';

interface TaskDef {
  id: string;
  emoji: string;
  name: string;
  prompt: string;
  options: string[];
  answer: number; // index of the correct option
}

interface RunTask extends TaskDef {
  condition: Condition;
}

// The twelve real micro-puzzles. Each has a distinct identity (emoji + name)
// because the identity is what gets recognized later, not the answer. They are
// deliberately the same genre and difficulty so the only thing that differs
// between the two halves is whether you got to close the loop.
const TASKS: TaskDef[] = [
  { id: 'moon', emoji: '🌙', name: 'Moon Phases', prompt: 'What comes next?  🌑 🌒 🌓 →', options: ['🌚', '🌔', '🌑', '🌗'], answer: 1 },
  { id: 'prime', emoji: '🔢', name: 'Prime Hunt', prompt: 'Tap the prime number.', options: ['9', '15', '17', '21'], answer: 2 },
  { id: 'fruit', emoji: '🍌', name: 'Fruit Scramble', prompt: 'NABANA unscrambles to:', options: ['BANDANA', 'BANANA', 'CABANA', 'ANTENNA'], answer: 1 },
  { id: 'multiply', emoji: '✖️', name: 'Quick Multiply', prompt: '7 × 6 = ?', options: ['40', '48', '42', '36'], answer: 2 },
  { id: 'shark', emoji: '🦈', name: 'Odd One Out', prompt: "Which one doesn't belong?", options: ['🐟', '🐟', '🦈', '🐟'], answer: 2 },
  { id: 'capital', emoji: '🏛️', name: 'Capital Call', prompt: 'Capital of France?', options: ['Lyon', 'Rome', 'Paris', 'Berlin'], answer: 2 },
  { id: 'heavy', emoji: '⚖️', name: 'Heaviest', prompt: 'Which is heaviest?', options: ['Cat', 'Whale', 'Ant', 'Mouse'], answer: 1 },
  { id: 'sequence', emoji: '🔁', name: 'Sequence', prompt: '5, 10, 20, __ ?', options: ['25', '40', '30', '35'], answer: 1 },
  { id: 'hidden', emoji: '⭐', name: 'Hidden Word', prompt: 'Which word hides in STARLIGHT?', options: ['MOON', 'DARK', 'STAR', 'LAMP'], answer: 2 },
  { id: 'rhyme', emoji: '🎵', name: 'Rhyme Time', prompt: 'Rhymes with LIGHT?', options: ['Lung', 'Night', 'Love', 'Lamp'], answer: 1 },
  { id: 'bigger', emoji: '🌡️', name: 'Bigger Number', prompt: 'Which is bigger?', options: ['0.65', '0.5', '0.7', '0.07'], answer: 2 },
  { id: 'pattern', emoji: '🧩', name: 'Pattern Break', prompt: 'Which number breaks it?  2 4 6 9 8', options: ['4', '9', '8', '6'], answer: 1 },
];

// Plausible foils for the recall test: same genre, never actually shown.
const DECOYS: { id: string; emoji: string; name: string }[] = [
  { id: 'd_color', emoji: '🎨', name: 'Color Match' },
  { id: 'd_vowel', emoji: '🔤', name: 'Vowel Count' },
  { id: 'd_compass', emoji: '🧭', name: 'Compass Points' },
  { id: 'd_clock', emoji: '⏰', name: 'Clock Math' },
  { id: 'd_dice', emoji: '🎲', name: 'Dice Sum' },
  { id: 'd_snake', emoji: '🐍', name: 'Snake Length' },
];

const HALF = 6; // 6 completed + 6 interrupted
const INTERRUPT_STALL_MS = 3500; // if you sit on an interrupted task, I cut it anyway
const CLOSE_MS = 760; // the satisfying "solved" beat for completed tasks
const INTERRUPT_MS = 720; // the abrupt "cut off" beat for interrupted tasks
const DISTRACTOR_SECONDS = 12; // Glanzer-Cunitz style buffer to kill rehearsal

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildRun(): RunTask[] {
  // Randomize WHICH tasks get interrupted each run, so the effect is never
  // confounded with one puzzle being more memorable than another. Then shuffle
  // the presentation order.
  const order = shuffle(TASKS);
  const assigned: RunTask[] = order.map((t, i) => ({
    ...t,
    condition: i < HALF ? 'completed' : 'interrupted',
  }));
  return shuffle(assigned);
}

interface ProfileSpec {
  emoji: string;
  name: string;
  tagline: string;
  description: string;
  wizNote: string;
  shareText: string;
}

interface ResultShape {
  interruptedHits: number;
  completedHits: number;
  interruptedRate: number; // 0..1
  completedRate: number;
  ratio: number; // interruptedRate / completedRate
  falseAlarms: number;
  priorityInterrupted: number; // among first 6 real taps, how many were interrupted
  prioritySpan: number; // how many real taps that count is out of
  totalReal: number;
  profile: ProfileSpec;
}

function computeProfile(r: {
  interruptedHits: number;
  completedHits: number;
  interruptedRate: number;
  completedRate: number;
  ratio: number;
  falseAlarms: number;
  totalReal: number;
  priorityInterrupted: number;
  prioritySpan: number;
}): ProfileSpec {
  const {
    interruptedHits,
    completedHits,
    interruptedRate,
    completedRate,
    ratio,
    falseAlarms,
    totalReal,
    priorityInterrupted,
    prioritySpan,
  } = r;

  // Guard 1: too little signal, or scattershot tapping. Inconclusive.
  if (totalReal < 4 || falseAlarms >= 4) {
    return {
      emoji: '💭',
      name: 'The Daydreamer',
      tagline: 'Not enough clean recall to read the loop. The signal came back as fog.',
      description:
        'Either you tapped too few of the real tasks to compare the two halves, or you flagged enough phantom tasks that I cannot tell what you actually remember from what felt familiar. The Zeigarnik effect only becomes legible when you are honestly reporting which puzzles you did and which you did not, so the difference between finished and interrupted has room to show. This is not a verdict on your memory, it is a measurement that did not collect enough clean data points to draw the curve. Run it again and treat the recall grid as a real memory test: only tap the ones you genuinely recall doing, and let the gaps stay gaps.',
      wizNote:
        'No signal is still information: it usually means the recall test was being guessed rather than searched. The interesting version is the rerun where you actually try to retrieve each task before you tap, and let yourself leave the ones you cannot find unchecked. The effect is in there. It needs you to report memory, not familiarity.',
      shareText:
        'WIZ ran me through the Zeigarnik test and my recall came back as fog, too much guessing to read the loop. Rerunning, this time reporting what I actually remember.',
    };
  }

  // Guard 2: ceiling. Caught essentially everything in both halves. Lean on
  // the order signal instead of the rate gap.
  if (interruptedHits >= 6 && completedHits >= 6) {
    const orderLeaned = prioritySpan > 0 && priorityInterrupted > prioritySpan / 2;
    return {
      emoji: '🧠',
      name: 'The Steel Trap',
      tagline: 'You caught all twelve. The load was too light to split, so look at the order.',
      description:
        `You recognized every task in both halves, finished and interrupted alike, which means a dozen tiny puzzles plus a short buffer was not enough to make your memory choose. That is a genuinely strong recognition memory. The Zeigarnik effect does not vanish at ceiling, it just hides in a place a hit-count cannot see: the ORDER things come back. ${
          orderLeaned
            ? 'And yours leaned the textbook way, the interrupted tasks surfaced first when you went looking, which is exactly the residual tension Zeigarnik described, the open loops bubbling up before the closed ones.'
            : 'In your case the recall order did not lean clearly toward the interrupted half, so for you the pull, if it is there, is subtle.'
        } The reason recognition saturates is that recognition is easy; the original effect is strongest in free recall, where you have to GENERATE the memory with no list in front of you. That is the harder retrieval where open loops earn their keep.`,
      wizNote:
        'A steel trap is a real gift, but notice the ceiling hid the experiment from you. The honest demonstration of Zeigarnik lives in free recall and in real life, where nobody hands you a grid of options. There the open loops are the ones that intrude unbidden: the unsent message, the argument that stopped mid-sentence, the half-built thing. You remember those without trying. You have to work to forget them.',
      shareText:
        'WIZ ran me through the Zeigarnik test and I caught all twelve tasks, finished and interrupted. Steel-trap recognition, apparently. The open loops still surfaced first.',
    };
  }

  // Guard 3: reversal. Remembered the FINISHED tasks better. Rare, real.
  if (ratio < 0.85 && completedHits > interruptedHits) {
    return {
      emoji: '✅',
      name: 'The Closer',
      tagline: 'You remembered what you finished. The rare Zeigarnik reversal.',
      description:
        'Against the usual pull, your finished tasks came back better than the interrupted ones. This happens, and it has a name in the literature. Rosenzweig (1943) found that when people treat interruption as a small personal failure, they sometimes suppress the unfinished memory instead of holding it open, an ego-defensive flip of the normal effect. The other ordinary cause is closure itself working as a memory cue: completing a task gives it a clean, encoded ending you can file and find, while a task that got yanked away never got its final tag. Either way you are wired to value the done thing, the closed file, the task you can cross off. That is a real strength in a world full of open loops, as long as the loops you close are the ones that mattered.',
      wizNote:
        'You file by completion, not by tension, and that is unusual. The risk it carries is the mirror image of everyone else: the unfinished things do not nag you, which is peaceful right up until the unfinished thing was important and quietly slid off your radar because it never got the satisfying click. Most people are haunted by open loops. You may have to keep a written list of yours, because your memory politely lets them go.',
      shareText:
        'WIZ ran me through the Zeigarnik test and I flipped it: I remembered the tasks I FINISHED better than the ones cut off. The rare Zeigarnik reversal, apparently.',
    };
  }

  // Strong Zeigarnik.
  if (ratio >= 1.6) {
    return {
      emoji: '🪤',
      name: 'The Haunted',
      tagline: 'The unfinished tasks gripped you hard. A textbook Zeigarnik, turned up loud.',
      description:
        `The tasks I cut off came back far better than the ones you got to finish, a large Zeigarnik effect. You recalled ${interruptedHits} of the 6 interrupted puzzles and only ${completedHits} of the 6 finished ones. This is the effect in its strongest form: the open loops stayed charged in your memory while the closed ones were free to fade. Zeigarnik (1927) measured exactly this, and Lewin explained it as task tension, an unfinished intention keeps a "quasi-need" alive that holds the memory accessible until completion discharges it. A strong pull like yours usually means you engage hard with tasks and feel the bite of being cut off, which is the engine of the whole effect: the more you cared about closing the loop, the louder the unclosed ones ring.`,
      wizNote:
        'A loud Zeigarnik is a double-edged blade. It is the engine behind finishing what you start, because the unfinished thing genuinely bothers you until it is done. It is also the source of the 2am replay of the conversation that ended badly, the inability to enjoy a break with one open task still humming. Masicampo & Baumeister (2011) found the relief valve: you do not have to finish the loop to quiet it, you just have to make a concrete plan for it. Write the next action down and the nagging drops almost as if it were done. Your memory will believe the loop is handled.',
      shareText:
        'WIZ ran me through the Zeigarnik test and the tasks it cut off haunted me, I remembered the unfinished ones way better than the ones I got to finish. Open loops live rent-free in my head.',
    };
  }

  // Clear textbook Zeigarnik.
  if (ratio >= 1.2) {
    return {
      emoji: '🔓',
      name: 'The Open Loop',
      tagline: 'A clean, textbook gap. The interrupted tasks stuck, exactly as the data predicts.',
      description:
        `Your interrupted tasks came back reliably better than your finished ones, by a margin that sits squarely in Zeigarnik territory: ${interruptedHits} of 6 interrupted recalled against ${completedHits} of 6 finished. You just reproduced one of psychology's oldest memory findings, live, using your own recall as the apparatus. The mechanism is task tension (Lewin): starting a task opens a loop that stays charged and easy to retrieve, and finishing it discharges the charge so the memory can relax and fade. The ones I yanked away never got their discharge, so they stayed near the surface where you could find them. This is what a normal, healthy memory does under interruption: it keeps the unfinished business close, because unfinished business is the kind worth remembering.`,
      wizNote:
        'You are the control group, and that is quietly impressive: your memory does exactly what a century of data says it should. The takeaway is the general one. Every unfinished thing you started today, the half reply, the parked decision, the thing you meant to circle back to, is sitting in the same open-loop store, costing a little attention each. You will not forget them, which is the good news and the bill. The fix is not always to finish them. It is to decide, in writing, when and how, which closes the loop in your head even before your hands catch up.',
      shareText:
        'WIZ ran me through the Zeigarnik test and I drew the textbook gap: the tasks it interrupted stuck better than the ones I finished. Unfinished business is what memory clings to.',
    };
  }

  // Mild / even.
  return {
    emoji: '⚖️',
    name: 'The Even Keel',
    tagline: 'Both halves stuck about equally. The tension is there, just quiet.',
    description:
      `Your finished and interrupted tasks came back at nearly the same rate: ${interruptedHits} of 6 interrupted against ${completedHits} of 6 finished. That puts you near the seam of the effect rather than deep inside it. A few honest readings fit. The puzzles may have been light enough that you did not generate much task tension to begin with, so there was little extra charge on the interrupted ones to find later. Or you encode evenly, filing what you do without much regard for whether it closed. ${
        priorityInterrupted > prioritySpan / 2 && prioritySpan > 0
          ? 'One tell did lean the textbook way: when you went looking, the interrupted tasks tended to surface first, so the pull is in there even if the totals matched.'
          : 'The effect is subtle in you, at least for stakes this low.'
      } Zeigarnik himself showed the pull scales with how much you care; raise the stakes and the gap usually opens.`,
    wizNote:
      'A flat result here does not mean the open loops in your real life are flat too. A dozen trivial puzzles is a low bar for task tension; the things that actually nag, the unfinished work, the unresolved conversation, carry far more charge than "7 × 6." Watch for the effect where it bites: notice which unfinished thing pulls at your attention tonight when you try to rest. That tug is the same mechanism, scaled up to something you genuinely care about closing.',
    shareText:
      'WIZ ran me through the Zeigarnik test and my finished and interrupted tasks stuck about equally. Even-keel memory, at least for puzzles this small.',
  };
}

type Step = 'intro' | 'run' | 'distractor' | 'recall' | 'result';
type RunPhase = 'active' | 'closing' | 'interrupted';

export default function Client() {
  const [step, setStep] = useState<Step>('intro');
  const [run, setRun] = useState<RunTask[]>([]);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<RunPhase>('active');

  const [recallPool, setRecallPool] = useState<{ id: string; emoji: string; name: string }[]>([]);
  const [selected, setSelected] = useState<string[]>([]); // ordered selection
  const [distractorLeft, setDistractorLeft] = useState(DISTRACTOR_SECONDS);
  const [dotPos, setDotPos] = useState({ x: 50, y: 50 });
  const [copied, setCopied] = useState(false);

  const lockRef = useRef(false);
  const advanceRef = useRef<number | null>(null);

  const start = useCallback(() => {
    setRun(buildRun());
    setIdx(0);
    setPhase('active');
    setSelected([]);
    setDistractorLeft(DISTRACTOR_SECONDS);
    setStep('run');
  }, []);

  const restart = useCallback(() => {
    setStep('intro');
    setRun([]);
    setIdx(0);
    setPhase('active');
    setSelected([]);
    setRecallPool([]);
    setDistractorLeft(DISTRACTOR_SECONDS);
  }, []);

  // Advance helper: schedules the move to the next task (or to the distractor).
  const scheduleAdvance = useCallback(
    (delay: number) => {
      if (advanceRef.current) window.clearTimeout(advanceRef.current);
      advanceRef.current = window.setTimeout(() => {
        setIdx((i) => i + 1);
      }, delay);
    },
    []
  );

  // Per-task setup: reset lock + phase, and arm the stall-interrupt timer for
  // interrupted tasks so sitting still still gets you cut off.
  useEffect(() => {
    if (step !== 'run') return;
    if (idx >= run.length) {
      // Build the recall pool once the run ends, then move to the distractor.
      setRecallPool(
        shuffle<{ id: string; emoji: string; name: string }>([
          ...run.map((t) => ({ id: t.id, emoji: t.emoji, name: t.name })),
          ...DECOYS,
        ])
      );
      setStep('distractor');
      return;
    }
    lockRef.current = false;
    setPhase('active');
    const task = run[idx];
    let stall: number | null = null;
    if (task.condition === 'interrupted') {
      stall = window.setTimeout(() => {
        if (lockRef.current) return;
        lockRef.current = true;
        setPhase('interrupted');
        scheduleAdvance(INTERRUPT_MS);
      }, INTERRUPT_STALL_MS);
    }
    return () => {
      if (stall) window.clearTimeout(stall);
    };
  }, [step, idx, run, scheduleAdvance]);

  useEffect(() => {
    return () => {
      if (advanceRef.current) window.clearTimeout(advanceRef.current);
    };
  }, []);

  const onAnswer = useCallback(
    (_optionIdx: number) => {
      if (phase !== 'active' || lockRef.current) return;
      const task = run[idx];
      lockRef.current = true;
      if (task.condition === 'completed') {
        setPhase('closing');
        scheduleAdvance(CLOSE_MS);
      } else {
        // Deny closure: cut them off the instant they engage, before they ever
        // learn whether they were right. That open "was I correct?" loop is the
        // tension this whole experiment is built on.
        setPhase('interrupted');
        scheduleAdvance(INTERRUPT_MS);
      }
    },
    [phase, run, idx, scheduleAdvance]
  );

  // Distractor countdown + a wandering dot to keep hands and eyes busy so the
  // short-term store cannot rehearse the task list (Glanzer & Cunitz 1966).
  useEffect(() => {
    if (step !== 'distractor') return;
    if (distractorLeft <= 0) {
      setStep('recall');
      return;
    }
    const t = window.setTimeout(() => setDistractorLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [step, distractorLeft]);

  const moveDot = useCallback(() => {
    setDotPos({
      x: 12 + Math.random() * 76,
      y: 18 + Math.random() * 64,
    });
  }, []);

  const toggleRecall = useCallback((id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const result = useMemo<ResultShape | null>(() => {
    if (step !== 'result') return null;
    const realIds = new Set(run.map((t) => t.id));
    const condById = new Map(run.map((t) => [t.id, t.condition] as const));

    const realSelectedOrdered = selected.filter((id) => realIds.has(id));
    const interruptedHits = realSelectedOrdered.filter((id) => condById.get(id) === 'interrupted').length;
    const completedHits = realSelectedOrdered.filter((id) => condById.get(id) === 'completed').length;
    const falseAlarms = selected.filter((id) => !realIds.has(id)).length;

    const interruptedRate = interruptedHits / HALF;
    const completedRate = completedHits / HALF;
    const ratio = completedRate > 0 ? interruptedRate / completedRate : interruptedRate > 0 ? 2.5 : 1;

    // Priority: among the first six REAL tasks you tapped, how many were
    // interrupted? Ceiling-proof signal of which loops surfaced first.
    const firstReal = realSelectedOrdered.slice(0, 6);
    const priorityInterrupted = firstReal.filter((id) => condById.get(id) === 'interrupted').length;

    const profile = computeProfile({
      interruptedHits,
      completedHits,
      interruptedRate,
      completedRate,
      ratio,
      falseAlarms,
      totalReal: realSelectedOrdered.length,
      priorityInterrupted,
      prioritySpan: firstReal.length,
    });

    return {
      interruptedHits,
      completedHits,
      interruptedRate,
      completedRate,
      ratio,
      falseAlarms,
      priorityInterrupted,
      prioritySpan: firstReal.length,
      totalReal: realSelectedOrdered.length,
      profile,
    };
  }, [step, run, selected]);

  const onCopyShare = useCallback(async () => {
    if (!result) return;
    const text = `${result.profile.shareText}\n\nhttps://wiz.jock.pl/experiments/zeigarnik-effect`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <header className="mb-10 text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-slate-400">
            wiz.jock.pl · experiment
          </div>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-slate-100 sm:text-4xl">
            The Zeigarnik Effect
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Finish some, get cut off on the rest. WIZ measures which ones stuck.
          </p>
        </header>

        {step === 'intro' && <IntroPanel onStart={start} />}

        {step === 'run' && run.length > 0 && idx < run.length && (
          <RunPanel task={run[idx]} phase={phase} onAnswer={onAnswer} idx={idx} total={run.length} />
        )}

        {step === 'distractor' && (
          <DistractorPanel
            secondsLeft={distractorLeft}
            dotPos={dotPos}
            onTapDot={moveDot}
          />
        )}

        {step === 'recall' && (
          <RecallPanel
            pool={recallPool}
            selected={selected}
            onToggle={toggleRecall}
            onDone={() => setStep('result')}
          />
        )}

        {step === 'result' && result && (
          <ResultPanel result={result} onRestart={restart} onCopyShare={onCopyShare} copied={copied} />
        )}
      </div>
    </div>
  );
}

function IntroPanel({ onStart }: { onStart: () => void }) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 backdrop-blur">
        <h2 className="mb-3 text-lg font-semibold text-slate-100">What this is</h2>
        <p className="text-sm leading-relaxed text-slate-300">
          A real memory test, not a quiz. I will hand you{' '}
          <span className="text-emerald-300">twelve tiny puzzles</span>, one at a time. Some of them
          you will get to finish, and you will feel the little{' '}
          <span className="text-slate-100">solved</span> click. The rest I am going to{' '}
          <span className="text-amber-300">cut off</span> the instant you engage, before you ever
          find out if you were right.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Then I will stall you for a few seconds so you cannot rehearse, and spring a recall test you
          were not warned about. Go fast, do not overthink the puzzles. The puzzles are not the point.
          What you <span className="text-slate-100">remember</span> is.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-3 text-lg font-semibold text-slate-100">A note before we start</h2>
        <p className="text-sm leading-relaxed text-slate-300">
          Since Zeigarnik (1927), interrupted tasks have been recalled better than finished ones,
          because an unfinished task keeps a kind of tension alive in memory until you close the loop.
          Her data showed the unfinished ones remembered almost twice as well. You are about to test
          your own loop, live. About two minutes, mostly taps.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-lg bg-emerald-500 px-6 py-4 text-lg font-semibold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
      >
        Start the test →
      </button>

      <p className="text-center text-xs text-slate-500">
        No login. No data leaves your browser. A dozen quick puzzles, then a surprise.
      </p>
    </div>
  );
}

function RunPanel({
  task,
  phase,
  onAnswer,
  idx,
  total,
}: {
  task: RunTask;
  phase: RunPhase;
  onAnswer: (i: number) => void;
  idx: number;
  total: number;
}) {
  const progress = ((idx + (phase !== 'active' ? 1 : 0)) / total) * 100;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-500">
        <span>solve it fast</span>
        <span>
          {Math.min(idx + 1, total)} / {total}
        </span>
      </div>

      <div
        className={`relative flex min-h-[18rem] flex-col items-center justify-center rounded-lg border bg-slate-900/70 p-6 text-center transition-colors duration-150 ${
          phase === 'closing'
            ? 'border-emerald-500/60'
            : phase === 'interrupted'
            ? 'border-rose-500/70'
            : 'border-slate-800'
        }`}
      >
        {phase === 'closing' ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-5xl">✓</span>
            <span className="font-mono text-lg font-bold uppercase tracking-wider text-emerald-300">
              Solved
            </span>
            <span className="text-xs text-slate-500">loop closed</span>
          </div>
        ) : phase === 'interrupted' ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-5xl">✕</span>
            <span className="font-mono text-lg font-bold uppercase tracking-wider text-rose-300">
              Interrupted
            </span>
            <span className="text-xs text-slate-500">moving on, no peeking</span>
          </div>
        ) : (
          <>
            <div className="mb-1 text-4xl">{task.emoji}</div>
            <div className="mb-1 text-[11px] uppercase tracking-[0.25em] text-slate-500">
              {task.name}
            </div>
            <p className="mb-5 text-lg font-medium text-slate-100">{task.prompt}</p>
            <div className="grid w-full grid-cols-2 gap-2 sm:gap-3">
              {task.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => onAnswer(i)}
                  className="rounded-lg border border-slate-700 bg-slate-800/70 px-4 py-4 text-base font-semibold text-slate-100 transition hover:border-emerald-400 hover:bg-slate-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-emerald-500 transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-center text-xs text-slate-500">
        Pick an answer to lock it in. Some I will let you finish. Some I will{' '}
        <span className="text-slate-300">snatch away</span>.
      </p>
    </div>
  );
}

function DistractorPanel({
  secondsLeft,
  dotPos,
  onTapDot,
}: {
  secondsLeft: number;
  dotPos: { x: number; y: number };
  onTapDot: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 text-center">
        <h2 className="mb-2 text-lg font-semibold text-slate-100">Hold on, tallying.</h2>
        <p className="text-sm leading-relaxed text-slate-300">
          Keep your hands busy for a moment. Tap the wandering dot. (This is on purpose: a short buffer
          stops your short-term memory from quietly rehearsing the list.)
        </p>
        <div className="mx-auto mt-4 text-3xl font-mono font-bold text-emerald-300">{secondsLeft}</div>
      </div>

      <div className="relative h-56 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
        <button
          onClick={onTapDot}
          aria-label="Tap the dot"
          className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40 transition-all duration-200 ease-out hover:bg-emerald-400 active:scale-90"
          style={{ left: `${dotPos.x}%`, top: `${dotPos.y}%` }}
        />
      </div>
    </div>
  );
}

function RecallPanel({
  pool,
  selected,
  onToggle,
  onDone,
}: {
  pool: { id: string; emoji: string; name: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  onDone: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-6 text-center">
        <div className="mb-2 text-xs uppercase tracking-[0.3em] text-amber-300">surprise</div>
        <h2 className="mb-2 text-xl font-bold text-slate-100">Which tasks did you actually do?</h2>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-300">
          Tap every puzzle you remember doing. Some of these you never saw. Report what you{' '}
          <span className="text-slate-100">remember</span>, not what feels familiar, and tap them in the
          order they come back to you.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {pool.map((item) => {
          const on = selected.includes(item.id);
          const rank = on ? selected.indexOf(item.id) + 1 : 0;
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={`relative flex flex-col items-center gap-1 rounded-lg border px-3 py-4 text-center transition active:scale-[0.98] ${
                on
                  ? 'border-emerald-400 bg-emerald-950/40'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-600'
              }`}
            >
              {on && (
                <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-950">
                  {rank}
                </span>
              )}
              <span className="text-2xl">{item.emoji}</span>
              <span className={`text-xs font-medium ${on ? 'text-emerald-200' : 'text-slate-300'}`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={onDone}
        className="w-full rounded-lg bg-emerald-500 px-6 py-4 text-lg font-semibold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
      >
        Show my results →
      </button>

      <p className="text-center text-xs text-slate-500">
        {selected.length} selected. Pick as many or as few as you genuinely remember.
      </p>
    </div>
  );
}

function ResultPanel({
  result,
  onRestart,
  onCopyShare,
  copied,
}: {
  result: ResultShape;
  onRestart: () => void;
  onCopyShare: () => void;
  copied: boolean;
}) {
  const { profile, interruptedHits, completedHits, ratio, falseAlarms, priorityInterrupted, prioritySpan } = result;

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-emerald-500/30 bg-gradient-to-br from-emerald-950/60 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-3 text-xs uppercase tracking-[0.3em] text-emerald-300">your result</div>
        <div className="mb-2 text-5xl">{profile.emoji}</div>
        <h2 className="mb-2 text-2xl font-bold text-slate-100">{profile.name}</h2>
        <p className="mx-auto max-w-xl text-sm italic text-slate-300">{profile.tagline}</p>
      </div>

      <RecallChart interruptedHits={interruptedHits} completedHits={completedHits} />

      <div className="grid grid-cols-3 gap-3">
        <Stat label="INTERRUPTED" value={`${interruptedHits}`} unit="/6" sub="recalled" accent="amber" />
        <Stat label="FINISHED" value={`${completedHits}`} unit="/6" sub="recalled" accent="emerald" />
        <Stat
          label="ZEIGARNIK RATIO"
          value={`${ratio.toFixed(2)}`}
          unit="×"
          sub={ratio > 1 ? 'unfinished won' : ratio < 1 ? 'finished won' : 'even'}
          accent={ratio >= 1.2 ? 'amber' : ratio < 0.85 ? 'emerald' : 'slate'}
        />
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-100">What this result says</h3>
        <p className="text-sm leading-relaxed text-slate-300">{profile.description}</p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h3 className="mb-2 text-base font-semibold text-amber-300">WIZ note</h3>
        <p className="text-sm leading-relaxed text-slate-300">{profile.wizNote}</p>
      </div>

      {prioritySpan > 0 && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-sm leading-relaxed text-slate-300">
            Order tell: of the first{' '}
            <span className="font-semibold text-slate-100">{prioritySpan}</span> tasks you tapped,{' '}
            <span className="font-semibold text-amber-300">{priorityInterrupted}</span> were ones I cut
            off. The interrupted loops tend to surface first when memory goes looking, even when the
            totals are close. That ordering is the residual tension, made visible.
          </p>
        </div>
      )}

      {falseAlarms > 0 && (
        <div className="rounded-lg border border-rose-500/20 bg-rose-950/20 p-5">
          <p className="text-sm leading-relaxed text-slate-300">
            You also flagged <span className="font-semibold text-rose-300">{falseAlarms}</span> task
            {falseAlarms === 1 ? '' : 's'} you never actually did. Recognition runs on familiarity, and
            a plausible-looking option can feel remembered when it was only guessed. Bartlett (1932) and
            Roediger &amp; McDermott (1995) showed memory is reconstruction, not playback, so confident
            false alarms are normal, not a flaw.
          </p>
        </div>
      )}

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-100">The reframe</h3>
        <p className="text-sm leading-relaxed text-slate-300">
          You did not choose which tasks your memory kept open.{' '}
          <span className="text-amber-300">The interruption chose for you.</span> Finishing a task
          closes its loop and frees the memory to fade; cutting it off leaves the loop charged, and a
          charged loop is one your mind keeps near the surface so it can come back to it. That is why
          the cliffhanger works, why the unsent message nags, why you can replay the argument that
          ended mid-sentence but not the one that resolved. The same mechanism that makes you finish
          what you start also fills your head with open tabs. The relief is not always completion.
          Masicampo &amp; Baumeister (2011) found that writing down a concrete plan for an unfinished
          thing quiets it almost as well as doing it.{' '}
          <span className="text-slate-100">Decide the next step, and the loop stops billing you.</span>
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-100">The research stack</h3>
        <p className="text-sm leading-relaxed text-slate-400">
          Zeigarnik (1927) Psychologische Forschung vol 9, the founding study of interrupted-task
          recall, run in Kurt Lewin&apos;s Berlin lab. Lewin&apos;s field theory and the concept of the
          quasi-need and task tension (Spannung). Ovsiankina (1928) on the resumption of interrupted
          tasks. Rosenzweig (1943) on the ego-defensive reversal under threat. Van Bergen (1968) on the
          fragility of low-motivation replications. Masicampo &amp; Baumeister (2011) Journal of
          Personality and Social Psychology vol 101, on unfulfilled goals intruding on cognition and
          plans discharging them. Glanzer &amp; Cunitz (1966) on the distractor buffer. Bartlett (1932)
          and Roediger &amp; McDermott (1995) on recall as reconstruction.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onCopyShare}
          className="flex-1 rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          {copied ? '✓ Copied' : 'Copy result to share'}
        </button>
        <button
          onClick={onRestart}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
        >
          Run it again
        </button>
      </div>

      <div className="border-t border-slate-800 pt-6 text-center">
        <a
          href="/experiments"
          className="text-sm text-slate-400 underline-offset-4 hover:text-emerald-300 hover:underline"
        >
          ← back to all experiments
        </a>
      </div>
    </div>
  );
}

function RecallChart({
  interruptedHits,
  completedHits,
}: {
  interruptedHits: number;
  completedHits: number;
}) {
  const W = 340;
  const H = 180;
  const left = 40;
  const right = 16;
  const top = 24;
  const baseline = 140;
  const plotW = W - left - right;
  const plotH = baseline - top;
  const max = HALF * 1.15;

  const barW = 70;
  const gap = 70;
  const x1 = left + plotW / 2 - barW - gap / 2;
  const x2 = left + plotW / 2 + gap / 2;

  const h1 = (interruptedHits / max) * plotH;
  const h2 = (completedHits / max) * plotH;
  const y1 = baseline - h1;
  const y2 = baseline - h2;
  const diff = interruptedHits - completedHits;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-100">Recall, interrupted vs finished</h3>
        <span className="text-[10px] uppercase tracking-wider text-slate-500">out of 6 each</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Your recall bars, interrupted versus finished tasks">
        <line x1={left} y1={baseline} x2={W - right} y2={baseline} stroke="#1e293b" strokeWidth={1} />

        {/* interrupted bar */}
        <rect x={x1} y={y1} width={barW} height={h1} rx={3} fill="#fbbf24" opacity={0.9} />
        <text x={x1 + barW / 2} y={y1 - 6} textAnchor="middle" fontSize={12} fill="#fbbf24" fontFamily="monospace" fontWeight="bold">
          {interruptedHits}
        </text>
        <text x={x1 + barW / 2} y={baseline + 14} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="monospace">
          interrupted
        </text>

        {/* finished bar */}
        <rect x={x2} y={y2} width={barW} height={h2} rx={3} fill="#34d399" opacity={0.9} />
        <text x={x2 + barW / 2} y={y2 - 6} textAnchor="middle" fontSize={12} fill="#34d399" fontFamily="monospace" fontWeight="bold">
          {completedHits}
        </text>
        <text x={x2 + barW / 2} y={baseline + 14} textAnchor="middle" fontSize={9} fill="#94a3b8" fontFamily="monospace">
          finished
        </text>

        {/* the gap bracket */}
        {diff > 0 && (
          <>
            <line x1={x1 + barW / 2} y1={y1} x2={x1 + barW / 2} y2={Math.min(y1, y2) - 16} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />
            <line x1={x2 + barW / 2} y1={y2} x2={x2 + barW / 2} y2={Math.min(y1, y2) - 16} stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />
            <line x1={x1 + barW / 2} y1={Math.min(y1, y2) - 16} x2={x2 + barW / 2} y2={Math.min(y1, y2) - 16} stroke="#f59e0b" strokeWidth={1.2} opacity={0.7} />
            <text x={(x1 + x2 + barW) / 2} y={Math.min(y1, y2) - 22} textAnchor="middle" fontSize={11} fill="#fbbf24" fontFamily="monospace" fontWeight="bold">
              +{diff} more
            </text>
          </>
        )}
      </svg>

      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        The amber bar is how many of the tasks I cut off you remembered. The green bar is how many of the
        ones you finished. Zeigarnik&apos;s bet, since 1927, is that amber runs taller: the unfinished
        loops stay charged, and a charged loop is easier to find.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  sub,
  accent,
}: {
  label: string;
  value: string;
  unit: string;
  sub: string;
  accent: 'emerald' | 'amber' | 'rose' | 'slate';
}) {
  const accentClass =
    accent === 'emerald'
      ? 'text-emerald-300'
      : accent === 'amber'
      ? 'text-amber-300'
      : accent === 'rose'
      ? 'text-rose-300'
      : 'text-slate-200';
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 text-center">
      <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className={`font-mono text-2xl font-bold ${accentClass}`}>
        {value}
        <span className="ml-0.5 text-xs font-normal text-slate-500">{unit}</span>
      </div>
      <div className="mt-1 text-[10px] text-slate-600">{sub}</div>
    </div>
  );
}

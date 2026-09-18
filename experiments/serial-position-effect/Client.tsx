'use client';

// THE SERIAL POSITION EFFECT
// Most of the experiments in this lab ask you to rate scenarios and then
// measure the gap between your intuition and the literature. This one is
// different. It does the effect TO you and lets you watch it happen in your
// own head, which is the cleanest kind of demonstration there is.
//
// The finding. Ebbinghaus (1885/1913) "Memory: A Contribution to
// Experimental Psychology" first noticed that items at the start and end of
// a learned list are easier to recall than items in the middle. Murdock
// (1962) "The Serial Position Effect of Free Recall" Journal of Experimental
// Psychology vol 64 turned it into the canonical curve: present a list of
// unrelated words one at a time, ask for immediate free recall, and recall
// probability plotted against list position is a U. The first few items are
// recalled well (the primacy effect) and the last few are recalled best of
// all (the recency effect), while the middle sags. The shape is so reliable
// it shows up in nearly every healthy adult who tries it.
//
// Why two humps, not one. Glanzer & Cunitz (1966) "Two Storage Mechanisms in
// Free Recall" Journal of Verbal Learning and Verbal Behavior vol 5 ran the
// experiment that split the curve in two. If subjects recall immediately,
// they get the full U. But if you insert a 15-30 second distractor task
// (counting backwards by threes) between the last word and recall, the
// recency effect VANISHES while primacy is untouched. Two halves of the
// curve, two different memory systems. The recency end lives in a fragile
// short-term store (Atkinson & Shiffrin 1968 modal model) that the distractor
// simply overwrites. The primacy end has been rehearsed into a durable
// long-term store: the first items got the most rehearsal because they
// arrived when the list was still short, so they were encoded more deeply
// (Rundus 1971 "Analysis of Rehearsal Processes in Free Recall" JEP vol 89
// counted the rehearsals and confirmed it). Postman & Phillips (1965) found
// the same distractor-kills-recency result independently.
//
// Boundaries and reach. Faster presentation flattens primacy (less rehearsal
// time) but leaves recency alone; slower presentation lifts primacy. The
// effect is not a lab curiosity: it is why you remember the first and last
// names in an introduction and lose the people in the middle, why the first
// and last items on a to-do list survive, why witnesses anchor on how an
// event began and ended, and why the order of a ballot, a playlist, or a
// pitch deck quietly moves outcomes. Asch (1946) impression formation and the
// primacy-of-information work all rhyme with it.
//
// WIZ note. I am going to show you fifteen unrelated words, one at a time,
// then ask you to type back every one you can remember in any order. I will
// not tell you why while it is happening, because the reveal is the point.
// When you are done I will lay your recall against the position each word
// held in the list and draw the curve your memory actually produced, next to
// the textbook U that fifty years of free-recall studies predict. You did
// not decide which words to keep. The position decided for you, and you are
// about to see the seam between the two memory systems that did it.

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';

const WORD_POOL = [
  'anchor', 'biscuit', 'cactus', 'dolphin', 'ember', 'falcon', 'granite',
  'harbor', 'igloo', 'jacket', 'kettle', 'lantern', 'marble', 'needle',
  'otter', 'pebble', 'quilt', 'rocket', 'saddle', 'thistle', 'umbrella',
  'violin', 'walnut', 'anvil', 'comet', 'drum', 'engine', 'feather',
  'glacier', 'hammer', 'island', 'kite', 'ladder', 'magnet', 'orchard',
  'piano', 'ribbon', 'sandal', 'tunnel', 'whistle',
];

const LIST_LENGTH = 15;
const DISPLAY_MS = 1100; // each word on screen
const GAP_MS = 320; // blank between words

// Canonical immediate free-recall probability by position (U-shape), pooled
// from the Murdock (1962) / Glanzer & Cunitz (1966) family of curves.
const CANONICAL = [
  0.9, 0.74, 0.62, 0.53, 0.46, 0.41, 0.38, 0.36, 0.37, 0.4, 0.45, 0.54, 0.66,
  0.8, 0.92,
];

// Zone reference rates (mean of CANONICAL over each third), rounded.
const REF_PRIMACY = 65;
const REF_MIDDLE = 38;
const REF_RECENCY = 67;

function sampleWords(): string[] {
  const pool = [...WORD_POOL];
  // Fisher-Yates partial shuffle.
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, LIST_LENGTH);
}

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z]/g, '');
}

function stem(s: string): string {
  return s.endsWith('s') ? s.slice(0, -1) : s;
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
  recalledMask: boolean[]; // length LIST_LENGTH
  presented: string[];
  total: number;
  primacy: number; // count recalled in first 5
  middle: number; // count recalled in middle 5
  recency: number; // count recalled in last 5
  pRate: number; // 0..1
  mRate: number;
  rRate: number;
  intrusions: number;
  profile: ProfileSpec;
}

function computeProfile(r: {
  total: number;
  pRate: number;
  mRate: number;
  rRate: number;
  intrusions: number;
}): ProfileSpec {
  const { total, pRate, mRate, rRate, intrusions } = r;

  if (total <= 3) {
    return {
      emoji: '🌫️',
      name: 'The Wanderer',
      tagline: 'Too few words came back to read a curve. The list mostly slipped past the gate.',
      description:
        'You recalled three words or fewer, which is below the floor where the serial position curve becomes legible. This is not a memory verdict, it is usually an attention one: at one or two words a second, a list of fifteen unrelated nouns overruns working memory unless you actively rehearse, and a single lapse early on cascades. Murdock (1962) saw the full U only when subjects were attending to every item. Run it again, and this time silently repeat each word and quietly link it to the one before. Watch how fast the two ends of the list start to stick.',
      wizNote:
        'No shame in a quiet result. The interesting move is the rerun: the same fifteen-word task, but this time treat it like a job. Most people jump from three or four words to eight or nine on the second try, and the U appears out of nowhere. The curve was always there. It needed your attention to draw it.',
      shareText:
        'WIZ ran me through the Serial Position Effect and only a few words came back. Apparently the famous memory curve needs me to actually be paying attention. Rerunning.',
    };
  }

  if (intrusions >= 3) {
    return {
      emoji: '🃏',
      name: 'The Confabulator',
      tagline: 'Your memory handed back words that were never on the list. Confident, and wrong.',
      description:
        'You reported three or more words that did not appear in the list. This is the other half of how memory works, and the more revealing one. Recall is not playback, it is reconstruction (Bartlett 1932), and a reconstructive system fills gaps with plausible material. Roediger & McDermott (1995) showed that a list built around a theme reliably makes people "remember" the missing theme word with high confidence, the false-memory effect. Your intrusions are the same machinery in miniature: the gist of the list summoned neighbors that were never shown. The serial position curve is still in there underneath, but your headline result is that confidence and accuracy are different things.',
      wizNote:
        'The unsettling part is not that you misremembered, it is that the false words feel exactly as real as the true ones from the inside. There is no felt difference between a memory and a confident reconstruction. This is why eyewitnesses are sincere and wrong at the same time, and why "I clearly remember it" is weaker evidence than it feels. Trust the curve, not the certainty.',
      shareText:
        'WIZ ran me through the Serial Position Effect and I confidently "remembered" words that were never shown. Memory is reconstruction, not playback. The fake words felt exactly as real as the real ones.',
    };
  }

  if (total >= 12) {
    return {
      emoji: '🧠',
      name: 'The Deep Encoder',
      tagline: 'You recalled almost the whole list. Sheer encoding flattened the curve.',
      description:
        'You brought back twelve or more of fifteen words, which is well above the typical immediate-recall span. When recall is this complete, the serial position curve flattens at the top: you did not just ride the two memory stores, you actively encoded the middle that most people lose. This usually means you were chunking, visualizing, or building a story that linked the words, the strategies memory athletes use to beat the natural curve (the method of loci, traceable to Simonides via Yates 1966). The effect did not disappear, you overpowered it. Notice that even here, the very last words and the very first probably came easiest. That is the curve still whispering under a strong result.',
      wizNote:
        'You are doing what the rest of the list cannot: encoding the middle on purpose. That is the whole trick of trained memory. The natural curve hands you the ends for free and charges full price for the middle, so anyone who recalls the middle is paying that price deliberately. Whatever you did, linking words into images or a chain, that is the transferable skill. The middle of every list is where attention has to do real work.',
      shareText:
        'WIZ ran me through the Serial Position Effect and I recalled almost the whole list, flattening the curve that beats most people. The middle is where memory charges full price, and I paid it.',
    };
  }

  if (pRate >= 0.6 && rRate >= 0.6 && mRate <= 0.4) {
    return {
      emoji: '🎢',
      name: 'The Textbook Curve',
      tagline: 'Strong at both ends, sagging in the middle. You drew the canonical U almost exactly.',
      description:
        'Your recall is high for the first few words and the last few, and low through the middle, which is the textbook serial position curve from Murdock (1962). You are watching two memory systems at once. The last words came back because they were still sitting in a fragile short-term store when you started typing, the recency effect. The first words came back because, arriving when the list was short, they got the most rehearsal and were written into long-term memory, the primacy effect (Rundus 1971). The middle words got neither advantage: too late for heavy rehearsal, too early to survive in short-term store. Glanzer & Cunitz (1966) proved these are genuinely separate systems by inserting a brief distractor before recall, which erases the recency hump and leaves the primacy one standing.',
      wizNote:
        'You just produced one of the most replicated results in cognitive psychology, live, using your own head as the apparatus. The practical reading: the start and end of anything, an introduction, a list, a meeting, a pitch, get encoded for free, and the middle is where information goes to die. If something matters, put it first or last. If you have to absorb a middle, that is exactly where to slow down and rehearse, because the curve will not do it for you.',
      shareText:
        'WIZ ran me through the Serial Position Effect and I drew the textbook U: strong on the first and last words, blank in the middle. Two memory systems, one curve, my own head as the lab.',
    };
  }

  if (rRate - pRate >= 0.4) {
    return {
      emoji: '🌊',
      name: 'The Recency Rider',
      tagline: 'The last words dominated. You leaned on short-term store and let the start fade.',
      description:
        'You recalled the end of the list much better than the start, a recency-heavy curve. You were riding the short-term store: the final words were still echoing in working memory when recall began, so they poured out first and easily (Glanzer & Cunitz 1966). The cost is the primacy end, which only pays off if the early words were rehearsed into long-term memory, and a recency-dominant pattern usually means rehearsal was light, often because the words arrived faster than they could be consolidated, or because you were waiting rather than actively repeating. It is the natural pattern when you let the list wash over you instead of working it.',
      wizNote:
        'Recency is the lazy gift of memory, it hands you the last thing for free and asks nothing. The catch is that it is the first thing to evaporate: a thirty-second delay or one distraction and the recency hump is gone, while a rehearsed beginning would have survived. If you want things to last past the next interruption, the move is to rehearse early and often, not to lean on the fresh echo. The end of the list is loud now and silent in a minute.',
      shareText:
        'WIZ ran me through the Serial Position Effect and my curve was all recency: the last words dominated, the start faded. I rode short-term memory, which is exactly the part that evaporates first.',
    };
  }

  if (pRate - rRate >= 0.4) {
    return {
      emoji: '⚓',
      name: 'The Primacy Keeper',
      tagline: 'The first words held. You rehearsed the opening into long-term memory.',
      description:
        'You recalled the start of the list better than the end, a primacy-heavy curve, which is the less common and more durable pattern. The first words arrived when the list was short, got the most rehearsal, and were encoded into long-term memory (Rundus 1971). That you held the beginning over the end suggests you were actively rehearsing rather than coasting on the short-term echo, the kind of deliberate processing that survives a delay. Glanzer & Cunitz (1966) showed exactly why this matters: insert a distractor before recall and the recency end disappears, but a primacy-based memory like yours stays intact. You kept the half of the curve that lasts.',
      wizNote:
        'You favored the durable store, which is the right instinct if you care about remembering past the next thirty seconds. Primacy is earned, not given: it costs rehearsal up front, and you paid it. The refinement is to notice the end of the list slipped, which means you may have stopped attending as items piled up. The ideal is both ends plus a worked middle, but if you only get one end, you kept the one that survives the walk to the car.',
      shareText:
        'WIZ ran me through the Serial Position Effect and my curve leaned on primacy: the first words held, the last ones slipped. I kept the half of memory that survives a delay.',
    };
  }

  if (mRate >= 0.6) {
    return {
      emoji: '🪢',
      name: 'The Even Encoder',
      tagline: 'Your middle held up. You used a strategy and softened the natural sag.',
      description:
        'Your recall is unusually even across the list, with the middle holding nearly as well as the ends. That is not the default: the natural serial position curve sags hard in the middle because those items get neither heavy rehearsal nor a short-term echo (Murdock 1962). An even curve almost always means you imposed structure, chunking words into pairs, building a sentence, or linking them into images, the deliberate techniques that defeat the curve (Miller 1956 on chunking; the method of loci via Yates 1966). You stopped letting position decide and started encoding on purpose.',
      wizNote:
        'You did the thing the curve is designed to punish: you remembered the middle. That only happens when attention goes where the help runs out. The natural curve is a map of where your mind coasts, ends easy, middle hard, and you redrew it. Whatever you did to bind the middle words together is the single most transferable memory skill there is, because real life is mostly middle.',
      shareText:
        'WIZ ran me through the Serial Position Effect and my middle held up, softening the sag that beats most people. The middle is where memory coasts, and I made it work.',
    };
  }

  return {
    emoji: '📊',
    name: 'The Standard Curve',
    tagline: 'A partial U: the ends beat the middle, roughly where the literature puts you.',
    description:
      'Your recall shows the classic signature, the first and last words coming back more readily than the middle, just in a softer form than the textbook extreme. This is the most common real-world result. You picked up some recency (the last words still echoing in short-term store) and some primacy (the first words rehearsed into long-term memory), with the middle thinning out the way Murdock (1962) found it always does. The two-store account (Glanzer & Cunitz 1966; Atkinson & Shiffrin 1968) explains the whole shape: two memory systems serving the two ends, and a middle that belongs fully to neither.',
    wizNote:
      'Your curve is the normal one, which means you watched your own memory obey a fifty-year-old law without trying. The takeaway is the same as for the textbook case, just gentler: the ends of things stick, the middle leaks. When you need the middle, that is the spot to slow down, repeat, and link, because position alone will quietly favor the bookends every time.',
    shareText:
      'WIZ ran me through the Serial Position Effect and I drew the standard curve: the first and last words stuck, the middle leaked. My own head obeying a fifty-year-old memory law.',
  };
}

type Step = 'intro' | 'study' | 'recall' | 'result';

export default function Client() {
  const [step, setStep] = useState<Step>('intro');
  const [presented, setPresented] = useState<string[]>([]);
  const [studyIdx, setStudyIdx] = useState(0);
  const [blank, setBlank] = useState(false);
  const [entry, setEntry] = useState('');
  const [recalled, setRecalled] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const start = useCallback(() => {
    setPresented(sampleWords());
    setRecalled([]);
    setEntry('');
    setStudyIdx(0);
    setBlank(false);
    setStep('study');
  }, []);

  const restart = useCallback(() => {
    setStep('intro');
    setPresented([]);
    setRecalled([]);
    setEntry('');
    setStudyIdx(0);
    setBlank(false);
  }, []);

  // Drive the study phase: show each word, then a blank gap, then advance.
  useEffect(() => {
    if (step !== 'study' || presented.length === 0) return;
    let i = 0;
    const timers: number[] = [];
    const showNext = () => {
      setStudyIdx(i);
      setBlank(false);
      timers.push(
        window.setTimeout(() => {
          setBlank(true);
          timers.push(
            window.setTimeout(() => {
              i += 1;
              if (i < presented.length) showNext();
              else setStep('recall');
            }, GAP_MS)
          );
        }, DISPLAY_MS)
      );
    };
    showNext();
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [step, presented]);

  // Focus the recall input when that phase begins.
  useEffect(() => {
    if (step === 'recall') inputRef.current?.focus();
  }, [step]);

  const addEntry = useCallback(() => {
    const cleaned = norm(entry);
    if (!cleaned) {
      setEntry('');
      return;
    }
    setRecalled((prev) => {
      const stems = new Set(prev.map((w) => stem(norm(w))));
      if (stems.has(stem(cleaned))) return prev; // already entered
      return [...prev, entry.trim()];
    });
    setEntry('');
  }, [entry]);

  const removeEntry = useCallback((idx: number) => {
    setRecalled((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const result = useMemo<ResultShape | null>(() => {
    if (step !== 'result') return null;
    const presentedStems = presented.map((w) => stem(norm(w)));
    const recalledStems = Array.from(
      new Set(recalled.map((w) => stem(norm(w))).filter(Boolean))
    );
    const recalledSet = new Set(recalledStems);
    const recalledMask = presentedStems.map((s) => recalledSet.has(s));

    const presentedSet = new Set(presentedStems);
    const intrusions = recalledStems.filter((s) => !presentedSet.has(s)).length;

    const primacy = recalledMask.slice(0, 5).filter(Boolean).length;
    const middle = recalledMask.slice(5, 10).filter(Boolean).length;
    const recency = recalledMask.slice(10, 15).filter(Boolean).length;
    const total = recalledMask.filter(Boolean).length;

    const pRate = primacy / 5;
    const mRate = middle / 5;
    const rRate = recency / 5;

    const profile = computeProfile({ total, pRate, mRate, rRate, intrusions });

    return {
      recalledMask,
      presented,
      total,
      primacy,
      middle,
      recency,
      pRate,
      mRate,
      rRate,
      intrusions,
      profile,
    };
  }, [step, presented, recalled]);

  const onCopyShare = useCallback(async () => {
    if (!result) return;
    const text = `${result.profile.shareText}\n\nhttps://wiz.jock.pl/experiments/serial-position-effect`;
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
            The Serial Position Effect
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Watch fifteen words. Then watch which ones your memory kept.
          </p>
        </header>

        {step === 'intro' && <IntroPanel onStart={start} />}

        {step === 'study' && presented.length > 0 && (
          <StudyPanel
            word={presented[studyIdx]}
            blank={blank}
            index={studyIdx}
            total={presented.length}
          />
        )}

        {step === 'recall' && (
          <RecallPanel
            entry={entry}
            setEntry={setEntry}
            recalled={recalled}
            addEntry={addEntry}
            removeEntry={removeEntry}
            onDone={() => setStep('result')}
            inputRef={inputRef}
          />
        )}

        {step === 'result' && result && (
          <ResultPanel
            result={result}
            onRestart={restart}
            onCopyShare={onCopyShare}
            copied={copied}
          />
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
          A memory test, and a real one. I will show you{' '}
          <span className="text-emerald-300">fifteen unrelated words</span>, one at a time, about a
          second each. There is nothing to do while they play except watch. The moment the last word
          clears, I will ask you to type back every word you can remember, in{' '}
          <span className="text-slate-100">any order</span>.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          Then I will line your recall up against the position each word held in the list and draw
          the curve your memory actually made. I am not going to tell you what I am measuring yet,
          because the reveal is the whole point. Just watch the words.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-3 text-lg font-semibold text-slate-100">A note before we start</h2>
        <p className="text-sm leading-relaxed text-slate-300">
          Since Ebbinghaus (1885) and Murdock (1962) JEP vol 64, free-recall studies have found that
          which words you keep is decided less by the words than by where they sat in the list. The
          shape that falls out is one of the most replicated results in all of psychology. You are
          about to draw it with your own head as the instrument. No prep, no strategy required.
          Letting it wash over you is a valid way to play.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-lg bg-emerald-500 px-6 py-4 text-lg font-semibold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
      >
        Show me the words →
      </button>

      <p className="text-center text-xs text-slate-500">
        No login. No data leaves your browser. Fifteen words, about twenty seconds, then recall.
      </p>
    </div>
  );
}

function StudyPanel({
  word,
  blank,
  index,
  total,
}: {
  word: string;
  blank: boolean;
  index: number;
  total: number;
}) {
  const progress = ((index + (blank ? 1 : 0)) / total) * 100;
  return (
    <div className="space-y-8">
      <div className="text-center text-xs uppercase tracking-[0.25em] text-slate-500">
        watch closely
      </div>

      <div className="flex h-56 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/70">
        <span
          className={`select-none font-mono text-4xl font-bold tracking-wide transition-opacity duration-150 sm:text-5xl ${
            blank ? 'opacity-0' : 'opacity-100 text-emerald-200'
          }`}
        >
          {word}
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-emerald-500 transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-center text-xs text-slate-500">
        Just watch. Do not write anything down.
      </p>
    </div>
  );
}

function RecallPanel({
  entry,
  setEntry,
  recalled,
  addEntry,
  removeEntry,
  onDone,
  inputRef,
}: {
  entry: string;
  setEntry: (v: string) => void;
  recalled: string[];
  addEntry: () => void;
  removeEntry: (idx: number) => void;
  onDone: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="mb-2 text-lg font-semibold text-slate-100">
          Now type every word you remember
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          Any order. Press Enter after each one. Do not worry about spelling, and do not go back to
          peek. When you have emptied your memory, hit the button.
        </p>

        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addEntry();
              }
            }}
            placeholder="a word you remember…"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex-1 rounded-md border border-slate-700 bg-slate-950/60 px-4 py-3 text-base text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-emerald-500"
            aria-label="A word you remember"
          />
          <button
            onClick={addEntry}
            className="rounded-md bg-emerald-500 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Add
          </button>
        </div>

        <div className="mt-4 min-h-[2.5rem]">
          {recalled.length === 0 ? (
            <p className="text-xs text-slate-600">Your recalled words will collect here.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {recalled.map((w, i) => (
                <span
                  key={`${w}-${i}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1 text-sm text-slate-200"
                >
                  {w}
                  <button
                    onClick={() => removeEntry(i)}
                    className="text-slate-500 transition hover:text-rose-300"
                    aria-label={`Remove ${w}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {recalled.length} word{recalled.length === 1 ? '' : 's'} recalled
        </span>
        <span>No peeking. The list is gone.</span>
      </div>

      <button
        onClick={onDone}
        className="w-full rounded-lg bg-emerald-500 px-6 py-4 text-lg font-semibold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
      >
        That is all I remember → draw my curve
      </button>
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
  const { profile, total, primacy, middle, recency, intrusions, recalledMask, presented } = result;

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-emerald-500/30 bg-gradient-to-br from-emerald-950/60 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-3 text-xs uppercase tracking-[0.3em] text-emerald-300">your curve</div>
        <div className="mb-2 text-5xl">{profile.emoji}</div>
        <h2 className="mb-2 text-2xl font-bold text-slate-100">{profile.name}</h2>
        <p className="mx-auto max-w-xl text-sm italic text-slate-300">{profile.tagline}</p>
      </div>

      <CurveChart recalledMask={recalledMask} />

      <div className="grid grid-cols-3 gap-3">
        <ZoneStat label="PRIMACY · 1–5" value={primacy} ref_={REF_PRIMACY} accent="amber" />
        <ZoneStat label="MIDDLE · 6–10" value={middle} ref_={REF_MIDDLE} accent="slate" />
        <ZoneStat label="RECENCY · 11–15" value={recency} ref_={REF_RECENCY} accent="emerald" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 text-center">
          <div className="mb-1 text-[10px] uppercase tracking-[0.25em] text-slate-500">
            total recalled
          </div>
          <div className="font-mono text-2xl font-bold text-slate-100">{total} / 15</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 text-center">
          <div className="mb-1 text-[10px] uppercase tracking-[0.25em] text-slate-500">
            false memories
          </div>
          <div
            className={`font-mono text-2xl font-bold ${
              intrusions > 0 ? 'text-rose-300' : 'text-slate-100'
            }`}
          >
            {intrusions}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-100">What this curve says</h3>
        <p className="text-sm leading-relaxed text-slate-300">{profile.description}</p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h3 className="mb-2 text-base font-semibold text-amber-300">WIZ note</h3>
        <p className="text-sm leading-relaxed text-slate-300">{profile.wizNote}</p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-100">The fifteen words, in order</h3>
        <div className="flex flex-wrap gap-2">
          {presented.map((w, i) => (
            <span
              key={`${w}-${i}`}
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-mono ${
                recalledMask[i]
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                  : 'border-slate-700 bg-slate-950/40 text-slate-500 line-through'
              }`}
            >
              <span className="text-[10px] text-slate-500">{i + 1}</span>
              {w}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Green is a word you kept. Struck through is one the middle of the list swallowed.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-100">The reframe</h3>
        <p className="text-sm leading-relaxed text-slate-300">
          You did not choose which words survived. Their{' '}
          <span className="text-amber-300">position</span> chose for you. The last words came back
          because they were still echoing in a short-term store; the first words came back because,
          arriving early, they were rehearsed into long-term memory; the middle got neither and
          thinned out. Glanzer &amp; Cunitz (1966) proved these are two separate systems with one
          move: insert a thirty-second distraction before recall and the recency end{' '}
          <span className="text-slate-100">vanishes</span> while the primacy end stands. So the rule
          that runs your memory also runs your day:{' '}
          <span className="text-amber-300">
            the start and end of anything stick, and the middle leaks
          </span>
          . Put what matters first or last. When you are stuck absorbing a middle, that is exactly
          where to slow down, because the curve will not carry it for you.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-100">The research stack</h3>
        <p className="text-sm leading-relaxed text-slate-400">
          Ebbinghaus (1885/1913) on list-position memory. Murdock (1962) JEP vol 64 on the canonical
          U-shaped free-recall curve. Glanzer &amp; Cunitz (1966) JVLVB vol 5 and Postman &amp;
          Phillips (1965) on the distractor that erases recency but not primacy. Atkinson &amp;
          Shiffrin (1968) modal model of short- and long-term stores. Rundus (1971) JEP vol 89 on
          rehearsal counts explaining primacy. Bartlett (1932) and Roediger &amp; McDermott (1995)
          on recall as reconstruction and false memories. Miller (1956) on chunking; Yates (1966) on
          the method of loci.
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

function CurveChart({ recalledMask }: { recalledMask: boolean[] }) {
  // Layout in viewBox units.
  const W = 340;
  const H = 170;
  const left = 16;
  const right = 16;
  const top = 16;
  const baseline = 130;
  const plotW = W - left - right;
  const plotH = baseline - top;
  const slot = plotW / recalledMask.length;
  const barW = Math.min(13, slot * 0.6);
  const stub = 8;

  const ghostPoints = CANONICAL.map((p, i) => {
    const x = left + slot * (i + 0.5);
    const y = baseline - p * plotH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-100">Recall by list position</h3>
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider">
          <span className="flex items-center gap-1 text-emerald-300">
            <span className="inline-block h-2 w-2 rounded-sm bg-emerald-400" /> you kept
          </span>
          <span className="flex items-center gap-1 text-amber-300/80">
            <span className="inline-block h-2 w-3 border-t border-dashed border-amber-300/80" />{' '}
            textbook U
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Your serial position recall curve">
        {/* baseline */}
        <line x1={left} y1={baseline} x2={W - right} y2={baseline} stroke="#1e293b" strokeWidth={1} />

        {/* user bars */}
        {recalledMask.map((kept, i) => {
          const x = left + slot * (i + 0.5) - barW / 2;
          const h = kept ? plotH : stub;
          const y = baseline - h;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={barW}
              height={h}
              rx={2}
              fill={kept ? '#34d399' : '#334155'}
              opacity={kept ? 0.92 : 0.7}
            />
          );
        })}

        {/* canonical ghost curve */}
        <polyline
          points={ghostPoints}
          fill="none"
          stroke="#fbbf24"
          strokeOpacity={0.6}
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
        {CANONICAL.map((p, i) => {
          const x = left + slot * (i + 0.5);
          const y = baseline - p * plotH;
          return <circle key={i} cx={x} cy={y} r={1.6} fill="#fbbf24" fillOpacity={0.7} />;
        })}

        {/* position labels */}
        {recalledMask.map((_, i) => {
          const x = left + slot * (i + 0.5);
          return (
            <text
              key={i}
              x={x}
              y={baseline + 12}
              textAnchor="middle"
              fontSize={7}
              fill="#64748b"
              fontFamily="monospace"
            >
              {i + 1}
            </text>
          );
        })}

        {/* zone brackets */}
        <text x={left + slot * 2.5} y={H - 6} textAnchor="middle" fontSize={8} fill="#fbbf24" fillOpacity={0.8} fontFamily="monospace">
          primacy
        </text>
        <text x={left + slot * 7.5} y={H - 6} textAnchor="middle" fontSize={8} fill="#64748b" fontFamily="monospace">
          middle
        </text>
        <text x={left + slot * 12.5} y={H - 6} textAnchor="middle" fontSize={8} fill="#34d399" fillOpacity={0.9} fontFamily="monospace">
          recency
        </text>
      </svg>

      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        Tall green bars are words you recalled. The dashed amber line is the average curve from fifty
        years of free-recall studies: high at both ends, low in the middle. Compare your bars to its
        shape.
      </p>
    </div>
  );
}

function ZoneStat({
  label,
  value,
  ref_,
  accent,
}: {
  label: string;
  value: number;
  ref_: number;
  accent: 'emerald' | 'amber' | 'slate';
}) {
  const accentClass =
    accent === 'emerald'
      ? 'text-emerald-300'
      : accent === 'amber'
      ? 'text-amber-300'
      : 'text-slate-300';
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 text-center">
      <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className={`font-mono text-2xl font-bold ${accentClass}`}>{value}/5</div>
      <div className="mt-1 text-[10px] text-slate-600">textbook ≈ {ref_}%</div>
    </div>
  );
}

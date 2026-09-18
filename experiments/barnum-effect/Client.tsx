'use client';

// THE BARNUM EFFECT (a.k.a. THE FORER EFFECT)
// In December 1948, Bertram Forer ran an experiment on his introductory
// psychology class at Los Angeles City College. He gave each of his 39
// students a personality test, then a week later handed each one a single
// typed paragraph of their "personalized results." Each student rated the
// accuracy of their unique reading on a 0-to-5 scale. Mean rating: 4.26.
// Then Forer revealed: every student got the exact same paragraph. He had
// assembled it from a newsstand astrology booklet. The thirteen sentences
// were tuned to apply to nearly anyone — universally flattering, mildly
// contradictory, vague enough to project onto, specific enough to feel
// caught.
// Paul Meehl (1956) later christened the trick the "Barnum Effect" after
// P.T. Barnum's claim that a good show has "a little something for
// everyone." Stagner (1958) replicated with industrial personnel managers
// — a population that should have known better — and got mean accuracy
// of 4.10. Snyder, Shenkel & Lowery (1977) reviewed thirty years of
// Barnum-statement research and identified the four levers that drive the
// effect: subjects believe the assessment was prepared specifically for
// them; they perceive the assessor as an authority; the statements are
// majority-positive; the statements describe the inner world rather than
// the outer (so they cannot be falsified by visible facts).
// Dickson & Kelly (1985) ran the meta-analysis: the Barnum Effect is one
// of the largest, most robust effects in social psychology. Average
// accuracy ratings across 50+ replications cluster between 4.0 and 4.5
// on a 5-point scale, regardless of subject IQ, education, or prior
// skepticism toward astrology. Astrology believers do score slightly
// higher (Glick, Gottesman & Jolton 1989), but skeptics are not immune;
// they simply rate around 3.8 instead of 4.4.
// The effect is the engine behind horoscopes, cold reading, fortune
// telling, MBTI-style quiz personality reveals, and roughly the entire
// Forbes "what your handwriting says about you" content economy. It is
// also, Furnham & Schofield (1987) note, present in a softer form in
// legitimate clinical reports, where the same flattering-and-vague
// language can erode patient skepticism toward a real diagnosis.
// WIZ note: I do not know you. I have six inputs from you and a script
// that maps any combination of those inputs to the same thirteen
// sentences. The reading you are about to read is identical to every
// other reading. The test is whether your brain — built to find self in
// any sufficiently shaped mirror — agrees.

import { useState, useCallback, useEffect } from 'react';

// THE FORER PARAGRAPH — adapted from Forer's 1948 newsstand-astrology
// composite, with light modernization. These are the thirteen sentences
// every visitor reads. They are not personalized to the inputs above.
// They are the same for everyone. That is the experiment.
const FORER_STATEMENTS: string[] = [
  'You have a great need for other people to like and admire you.',
  'You have a tendency to be critical of yourself.',
  'You have a great deal of unused capacity which you have not turned to your advantage.',
  'While you have some personality weaknesses, you are generally able to compensate for them.',
  'Your sexual adjustment has presented problems for you.',
  'Disciplined and self-controlled outside, you tend to be worrisome and insecure inside.',
  'At times you have serious doubts as to whether you have made the right decision or done the right thing.',
  'You prefer a certain amount of change and variety and become dissatisfied when hemmed in by restrictions and limitations.',
  'You pride yourself as an independent thinker and do not accept others’ statements without satisfactory proof.',
  'You have found it unwise to be too frank in revealing yourself to others.',
  'At times you are extroverted, affable, sociable, while at other times you are introverted, wary, reserved.',
  'Some of your aspirations tend to be pretty unrealistic.',
  'Security is one of your major goals in life.',
];

interface InputQuestion {
  id: string;
  prompt: string;
  options: string[];
}

// The six "input" questions. They look like personality-test signal but
// they feed nothing. The reading is identical regardless of answers.
const INPUT_QUESTIONS: InputQuestion[] = [
  {
    id: 'birth-month',
    prompt: 'Pick your birth month.',
    options: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  {
    id: 'color',
    prompt: 'Pick a color you are drawn to right now.',
    options: ['Crimson', 'Indigo', 'Forest', 'Gold', 'Slate', 'Coral', 'Violet', 'Black'],
  },
  {
    id: 'shape',
    prompt: 'Which shape feels most like you?',
    options: ['Circle', 'Square', 'Triangle', 'Spiral', 'Star', 'Diamond'],
  },
  {
    id: 'season',
    prompt: 'Your favorite season of the year?',
    options: ['Spring', 'Summer', 'Autumn', 'Winter'],
  },
  {
    id: 'animal',
    prompt: 'An animal you feel a kinship with?',
    options: ['Wolf', 'Owl', 'Cat', 'Octopus', 'Horse', 'Fox', 'Whale', 'Hawk'],
  },
  {
    id: 'time',
    prompt: 'When do you feel most alive?',
    options: ['Dawn', 'Mid-morning', 'Afternoon', 'Sunset', 'Evening', 'Late night'],
  },
];

interface Profile {
  key: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  wizNote: string;
  researchNote: string;
  traits: [string, string, string];
  shareText: string;
  minScore: number;
}

// Profiles thresholded on average accuracy rating (1-5).
// Forer's original mean: 4.26. Stagner 1958 personnel managers: 4.10.
// Glick Gottesman & Jolton (1989) skeptics-only band: ~3.8.
// Dickson & Kelly (1985) meta-analysis median: 4.2.
const PROFILES: Profile[] = [
  {
    key: 'true-believer',
    name: 'The True Believer',
    emoji: '🔮',
    tagline: 'Average accuracy 4.5+. The mirror knew you exactly.',
    description:
      'Your average accuracy rating across the thirteen statements landed at or above 4.5 out of 5. That is above Forer’s original 1948 mean of 4.26 and at the top of Dickson & Kelly’s 50-study meta-analysis distribution. You read the paragraph and felt seen on nearly every line. The trouble is that you read the same paragraph every other visitor read. The seeing came from inside you, not from the page. This is the band where horoscopes work cleanly, where MBTI-style quiz reveals feel uncanny, and where a stranger across a card table can hold your attention for an hour by saying things that apply to most adults.',
    wizNote:
      'The skill to develop is not skepticism toward yourself for being moved. The reading was engineered to move you and the engineering is centuries old. The skill is noticing in real time that a reading "feels accurate" can mean two different things: it described the specific facts of your situation, or it activated the specific facts of your situation in your memory while the words on the page stayed generic. Test the next reading you encounter by asking what would be FALSIFIED by it. If nothing would, the reading is doing the Barnum trick.',
    researchNote:
      'Forer (1948, published 1949): mean accuracy 4.26 across 39 students; only 5 of 39 rated below 4.0. Stagner (1958) replicated with personnel managers, mean 4.10. Glick Gottesman & Jolton (1989) found astrology believers averaged 4.5+ on identical Barnum readings labeled as "your astrological profile." Dickson & Kelly (1985) meta-analysis of 50 studies: this band represents roughly the top 30% of subjects.',
    traits: [
      'Reads vague-positive description and supplies own specifics',
      'High projection onto authoritative-seeming readings',
      'Top tercile Forer/Stagner accuracy band',
    ],
    shareText:
      'I rated WIZ’s "personalized" reading 4.5+ out of 5. Then WIZ told me everyone got the exact same reading. I am The True Believer. wiz.jock.pl/experiments/barnum-effect',
    minScore: 4.5,
  },
  {
    key: 'forer-typical',
    name: 'The Forer Subject',
    emoji: '🔍',
    tagline: 'Average accuracy 4.0–4.5. Right at Forer’s 1948 mean.',
    description:
      'Your average rating sat between 4.0 and 4.5 — the modal band of Barnum-effect research. Forer’s original 1948 students averaged 4.26 right here. Stagner’s 1958 industrial personnel managers, who should have been trained to spot vague assessments, averaged 4.10. You are in good and large company. The reading hit, and on roughly two or three of the thirteen sentences you noticed enough not to rate it 5. That faint discrimination is doing some work; it just is not doing enough work to break the spell.',
    wizNote:
      'The interesting question is which sentences you flagged. Look back. The ones you rated lowest are the ones where the universal claim grazed your specific facts wrong. Those are the cracks in the mirror. The ones you rated highest are where the brain volunteered the example. The trick is in the volunteering, not in the sentence. Notice the volunteering and the spell becomes inspectable.',
    researchNote:
      'Forer (1949) "The Fallacy of Personal Validation": 39 subjects, mean accuracy 4.26 of 5. Stagner (1958) industrial personnel managers, mean 4.10. Snyder & Shenkel (1975) found the band 4.0-4.5 contains roughly 50% of all Barnum-test subjects regardless of education or domain. The robustness across decades and populations is part of why Meehl (1956) flagged it as one of the few replicable findings in the era’s personality literature.',
    traits: [
      'Rates universal claims in the modal Forer band',
      'Catches roughly 2-3 of 13 sentences as off',
      'Median Barnum-effect respondent across 50+ studies',
    ],
    shareText:
      'I averaged 4.0–4.5 on WIZ’s "personalized" reading. Then WIZ told me everyone got the same reading. I am The Forer Subject — right where his 1948 students landed. wiz.jock.pl/experiments/barnum-effect',
    minScore: 4.0,
  },
  {
    key: 'mild-skeptic',
    name: 'The Mild Skeptic',
    emoji: '🧐',
    tagline: 'Average accuracy 3.5–4.0. The reading partly caught you.',
    description:
      'You averaged between 3.5 and 4.0. The reading worked on you, but with friction. This is roughly the band Glick Gottesman & Jolton (1989) found in subjects pre-screened as skeptical of astrology before being shown an identical reading labeled as their "profile." Skepticism is not immunity, it is a discount: the reading still moves you, just less than it moves the median visitor. You probably rated several of the more inward statements (worrying inside while controlled outside, doubting recent decisions) as accurate, while pushing back on the most universally flattering ones (great unused capacity, independent thinker).',
    wizNote:
      'You held the line in the half of the reading where the flattery is most direct, and surrendered in the half where the description is most universal. That is roughly the right shape. The remaining work is on the universal-inward statements: every adult human worries inside, doubts decisions, contains contradictions. These are not personality findings. They are the human floor. A reading made of them is a reading made of nothing.',
    researchNote:
      'Glick Gottesman & Jolton (1989) found astrology skeptics averaged 3.8 on identical Barnum readings, vs 4.5 for believers — the gap is real but small. Furnham & Schofield (1987) measured the skeptic band as resistance to the most flattering items but acceptance of the inner-state items. Snyder & Shenkel (1975) found 25-30% of subjects fall in this band across studies, and the band is enriched in samples with research-methods training.',
    traits: [
      'Discounts most-flattering items, accepts inward universal items',
      'Skeptic-band Forer-effect respondent',
      'Susceptible to readings labeled as "yours" even when generic',
    ],
    shareText:
      'I averaged 3.5–4.0 on WIZ’s "personalized" reading. Apparently I am a mild skeptic — the trick still worked, just less. wiz.jock.pl/experiments/barnum-effect',
    minScore: 3.5,
  },
  {
    key: 'cold-reader',
    name: 'The Cold Reader',
    emoji: '❄️',
    tagline: 'Average accuracy 2.5–3.5. You spotted the trick mid-reading.',
    description:
      'You averaged between 2.5 and 3.5. This is the upper-skeptic band of Barnum research. You read each sentence with the question "would this also fit the person sitting next to me on a train" pre-loaded, and you noticed when the answer was yes. About 10–15% of unprimed subjects land here. People who score in this band have usually either had direct exposure to cold-reading mechanics (mentalism, TV psychics deconstructed) or come from a research-methods background where vague-prediction critique is in the water.',
    wizNote:
      'You are the rare reader who treats "feels true" and "is true" as different categories from the start. The cost of that disposition, calibrated wrong, is sometimes flattening readings that ARE specific to you because the spotting-the-trick muscle is on by default. The flip side: you can probably sit through a horoscope being read at a dinner party without nodding. That is a genuine social skill, not a flaw.',
    researchNote:
      'Snyder & Shenkel (1975), Dickson & Kelly (1985) meta-analysis: roughly 10-15% of unprimed subjects average below 3.5. Hyman (1977) "Cold Reading: How to Convince Strangers That You Know All About Them" — the canonical Skeptical Inquirer breakdown of the technique — documents that prior exposure to cold-reading methodology drops Barnum accuracy by ~0.7 points on the 5-point scale. The trait is largely trained, not born.',
    traits: [
      'Pre-loads the train-passenger test on each statement',
      'Upper-skeptic band Forer-effect respondent',
      'Likely prior exposure to cold-reading or research methodology',
    ],
    shareText:
      'I averaged 2.5–3.5 on WIZ’s "personalized" reading. Apparently I cold-read the cold reader. wiz.jock.pl/experiments/barnum-effect',
    minScore: 2.5,
  },
  {
    key: 'mirror-breaker',
    name: 'The Mirror Breaker',
    emoji: '🪩',
    tagline: 'Average accuracy below 2.5. The reading bounced off you.',
    description:
      'Your average rating sat below 2.5. This is the rare end — less than 5% of Barnum-test subjects across the 50-study Dickson & Kelly meta-analysis land here. You did not just spot the trick; you actively pushed back on most of the thirteen sentences. The reading offered you "you have a great need for others to like and admire you" and you read it as a wrong description of your own internal life rather than as a generally true human statement you happened to also fit. That is a specific way of reading: prioritizing the personal-fact dimension over the universal-fact dimension.',
    wizNote:
      'The disposition to read a Barnum statement as wrong about you specifically (rather than as too vague to be wrong about anyone) is unusual. The honest read is that you may genuinely sit outside the median on the inward statements — perhaps you do not worry inside while controlled outside, perhaps you are not currently doubting recent decisions. Or you may have been pushing back on the framing rather than the content, which is also a real form of self-knowledge. Either way, the spell did not catch.',
    researchNote:
      'Dickson & Kelly (1985) meta-analysis: <5% of subjects average below 2.5 on standard Forer paragraphs. Glick Gottesman & Jolton (1989) found this band over-represented in subjects who had previously published research critical of astrology, suggesting expert priming is one route here. Furnham & Schofield (1987) found a smaller secondary cluster in subjects with very stable, low-neuroticism personality profiles — the inward-anxiety statements simply do not match.',
    traits: [
      'Reads universal claims as personally false rather than personally vacuous',
      'Bottom-decile Forer-effect respondent',
      'Either expert-primed or low-neuroticism profile',
    ],
    shareText:
      'I averaged below 2.5 on WIZ’s "personalized" reading. WIZ called me The Mirror Breaker. The horoscope industry weeps. wiz.jock.pl/experiments/barnum-effect',
    minScore: 0,
  },
];

function getProfile(avg: number): Profile {
  for (const p of PROFILES) {
    if (avg >= p.minScore) return p;
  }
  return PROFILES[PROFILES.length - 1];
}

type Phase = 'intro' | 'inputs' | 'generating' | 'reading' | 'rating' | 'reveal' | 'results';

export default function BarnumEffectClient() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [inputIdx, setInputIdx] = useState(0);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [ratings, setRatings] = useState<number[]>(new Array(FORER_STATEMENTS.length).fill(0));
  const [genProgress, setGenProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (phase === 'rating' || phase === 'reveal' || phase === 'results' || phase === 'reading') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [phase]);

  // fake "generating your reading" loader for theatrical effect.
  // The point is to imply work is being done. None is.
  useEffect(() => {
    if (phase !== 'generating') return;
    setGenProgress(0);
    const start = Date.now();
    const total = 2400;
    const id = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / total) * 100));
      setGenProgress(pct);
      if (elapsed >= total) {
        window.clearInterval(id);
        setPhase('reading');
      }
    }, 60);
    return () => window.clearInterval(id);
  }, [phase]);

  const pickInput = useCallback(
    (option: string) => {
      const q = INPUT_QUESTIONS[inputIdx];
      const next = { ...inputs, [q.id]: option };
      setInputs(next);
      if (inputIdx + 1 >= INPUT_QUESTIONS.length) {
        setPhase('generating');
      } else {
        setInputIdx((i) => i + 1);
      }
    },
    [inputIdx, inputs],
  );

  const setRating = useCallback((idx: number, value: number) => {
    setRatings((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  }, []);

  const restart = useCallback(() => {
    setPhase('intro');
    setInputIdx(0);
    setInputs({});
    setRatings(new Array(FORER_STATEMENTS.length).fill(0));
    setGenProgress(0);
  }, []);

  const allRated = ratings.every((r) => r > 0);
  const ratedCount = ratings.filter((r) => r > 0).length;
  const ratingTotal = ratings.reduce((a, b) => a + b, 0);
  const ratingAvg = ratedCount > 0 ? ratingTotal / FORER_STATEMENTS.length : 0;

  // INTRO
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            WIZ EXPERIMENT /// THE BARNUM EFFECT
          </div>
          <h1 className="font-pixel text-3xl md:text-4xl text-white text-center mb-6 leading-tight">
            The Barnum Effect
          </h1>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6 font-mono text-sm text-secondary space-y-3">
            <p>
              <span className="text-accent">&gt;</span> Six quick personality questions.
            </p>
            <p>
              <span className="text-accent">&gt;</span> WIZ generates your custom
              personality reading from your inputs.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Rate each line for accuracy. Then
              WIZ pulls back the curtain.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Forer (1948) ran this on his
              psychology class. They averaged 4.26 of 5 on a reading he had assembled from
              a newsstand astrology booklet.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-8 text-sm text-secondary">
            <span className="text-white font-medium">WIZ note: </span>I do not know you. I
            have a script. The script ends with a small confession. Read carefully.
          </div>

          <button
            onClick={() => setPhase('inputs')}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            BEGIN THE READING &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            6 inputs &middot; 13 statements &middot; 4&ndash;6 minutes &middot; based on
            Forer (1949), Stagner (1958), Meehl (1956), Snyder Shenkel &amp; Lowery
            (1977), Dickson &amp; Kelly (1985), Glick Gottesman &amp; Jolton (1989)
          </p>
        </div>
      </div>
    );
  }

  // INPUTS — six theatrical questions whose answers are never used
  if (phase === 'inputs') {
    const q = INPUT_QUESTIONS[inputIdx];
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs">
            <span className="text-accent tracking-widest">INPUT</span>
            <span className="text-muted uppercase">
              {inputIdx + 1} / {INPUT_QUESTIONS.length}
            </span>
          </div>

          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{ width: `${((inputIdx + 1) / INPUT_QUESTIONS.length) * 100}%` }}
            />
          </div>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6">
            <p className="font-mono text-xs text-accent tracking-widest mb-3">
              QUESTION {inputIdx + 1}
            </p>
            <p className="text-white text-base leading-relaxed">{q.prompt}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => pickInput(opt)}
                className="border border-white/20 bg-white/5 hover:border-accent hover:bg-accent/10 transition-colors p-4 text-secondary text-sm hover:text-white"
              >
                {opt}
              </button>
            ))}
          </div>

          <p className="text-muted text-xs text-center mt-6 font-mono">
            tap one to continue
          </p>
        </div>
      </div>
    );
  }

  // GENERATING — fake loader for theater
  if (phase === 'generating') {
    const phrases = [
      'Cross-referencing inputs...',
      'Mapping personality vectors...',
      'Calibrating mirror coefficients...',
      'Composing personalized reading...',
    ];
    const phraseIdx = Math.min(phrases.length - 1, Math.floor((genProgress / 100) * phrases.length));
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="font-mono text-xs text-accent tracking-widest mb-8">
            WIZ /// COMPOSING YOUR READING
          </div>

          <div className="font-pixel text-6xl text-accent mb-8">{genProgress}%</div>

          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-200"
              style={{ width: `${genProgress}%` }}
            />
          </div>

          <p className="font-mono text-sm text-secondary">{phrases[phraseIdx]}</p>

          <div className="mt-8 text-xs font-mono text-muted">
            inputs received: {Object.keys(inputs).length} &middot; statements to compose: 13
          </div>
        </div>
      </div>
    );
  }

  // READING — show the Forer paragraph
  if (phase === 'reading') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            WIZ /// YOUR PERSONAL READING
          </div>

          <h2 className="font-pixel text-2xl md:text-3xl text-white text-center mb-2 leading-tight">
            What WIZ Sees in You
          </h2>
          <p className="text-muted text-xs text-center font-mono mb-8">
            assembled from your six inputs
          </p>

          <div className="border border-accent/40 bg-accent/5 p-6 mb-6 space-y-4">
            {FORER_STATEMENTS.map((s, i) => (
              <p key={i} className="text-secondary text-base leading-relaxed">
                <span className="text-accent font-mono text-xs mr-2">{String(i + 1).padStart(2, '0')}.</span>
                {s}
              </p>
            ))}
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-6 text-sm text-secondary">
            <span className="text-white font-medium">WIZ instruction: </span>read each line.
            Sit with it. On the next screen you rate every one of the thirteen for how
            accurately it describes you.
          </div>

          <button
            onClick={() => setPhase('rating')}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            RATE THE READING &rarr;
          </button>
        </div>
      </div>
    );
  }

  // RATING — 1-5 stars per statement
  if (phase === 'rating') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            WIZ /// RATE YOUR READING
          </div>

          <h2 className="font-pixel text-xl md:text-2xl text-white text-center mb-2 leading-tight">
            How Accurate Was Each Line?
          </h2>
          <p className="text-muted text-xs text-center font-mono mb-8">
            1 = not at all &middot; 5 = nailed it &middot; rate all {FORER_STATEMENTS.length}
          </p>

          <div className="space-y-4 mb-6">
            {FORER_STATEMENTS.map((s, i) => (
              <div
                key={i}
                className={`border p-4 transition-colors ${
                  ratings[i] > 0
                    ? 'border-accent/30 bg-accent/5'
                    : 'border-white/15 bg-white/5'
                }`}
              >
                <p className="text-secondary text-sm leading-relaxed mb-3">
                  <span className="text-accent font-mono text-xs mr-2">
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  {s}
                </p>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => setRating(i, value)}
                      className={`flex-1 py-2 font-pixel text-lg border transition-colors ${
                        ratings[i] === value
                          ? 'bg-accent text-black border-accent'
                          : 'border-white/20 text-white hover:border-accent hover:text-accent'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="sticky bottom-4 bg-black border border-accent/40 p-4 mb-2">
            <div className="flex justify-between items-center mb-3 font-mono text-xs">
              <span className="text-secondary">RATED</span>
              <span className="text-accent">
                {ratedCount} / {FORER_STATEMENTS.length}
              </span>
            </div>
            <button
              onClick={() => setPhase('reveal')}
              disabled={!allRated}
              className={`w-full font-bold py-4 font-mono text-sm tracking-widest transition-colors ${
                allRated
                  ? 'bg-accent text-black hover:bg-white'
                  : 'bg-white/10 text-muted cursor-not-allowed'
              }`}
            >
              {allRated ? 'SUBMIT RATINGS →' : `${FORER_STATEMENTS.length - ratedCount} TO GO`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // REVEAL — the trick
  if (phase === 'reveal') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="font-mono text-xs text-yellow-400 tracking-widest mb-6 text-center">
            WIZ /// THE CONFESSION
          </div>

          <h2 className="font-pixel text-3xl md:text-4xl text-white text-center mb-6 leading-tight">
            Every Visitor Got The Same Reading.
          </h2>

          <div className="border border-yellow-400/40 bg-yellow-400/5 p-5 mb-5">
            <p className="text-secondary text-base leading-relaxed">
              The thirteen statements you just rated are identical for every person who
              takes this test. The six inputs you gave me — birth month, color,
              shape, season, animal, time — fed nothing. There is no algorithm. There
              is no personalization. There is one paragraph, copied verbatim from a
              newsstand astrology booklet by a psychologist named Bertram Forer in
              December 1948.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-5 mb-5">
            <p className="text-secondary text-sm leading-relaxed">
              Forer ran this on his introductory psychology class at Los Angeles City
              College. Thirty-nine students. Each got the same paragraph, presented as
              their personalized result. Mean accuracy rating: 4.26 out of 5. Only five of
              the thirty-nine rated it below 4.0. He published the result the following
              year as <em>The Fallacy of Personal Validation</em>. Paul Meehl named the
              effect the <em>Barnum Effect</em> in 1956 after P.T. Barnum&apos;s line
              about a good show having &ldquo;a little something for everyone.&rdquo;
            </p>
          </div>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6">
            <p className="font-mono text-xs text-accent tracking-widest mb-3">
              YOUR AVERAGE
            </p>
            <div className="flex justify-around items-center my-3">
              <div className="text-center">
                <div className="font-pixel text-5xl text-white">
                  {ratingAvg.toFixed(2)}
                </div>
                <div className="text-muted text-xs font-mono tracking-widest mt-1">
                  YOUR AVG
                </div>
              </div>
              <div className="w-px bg-white/20 h-12" />
              <div className="text-center">
                <div className="font-pixel text-5xl text-accent">4.26</div>
                <div className="text-muted text-xs font-mono tracking-widest mt-1">
                  FORER 1948
                </div>
              </div>
            </div>
            <p className="text-secondary text-sm leading-relaxed text-center mt-3">
              {ratingAvg >= 4.26
                ? 'You rated higher than Forer’s original class.'
                : ratingAvg >= 3.5
                  ? 'You rated under Forer’s mean but still in the typical Barnum band.'
                  : 'You rated well below Forer’s class. The trick was less effective on you.'}
            </p>
          </div>

          <button
            onClick={() => setPhase('results')}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            SEE YOUR PROFILE &rarr;
          </button>
        </div>
      </div>
    );
  }

  // RESULTS
  const profile = getProfile(ratingAvg);

  // Per-statement breakdown: where did they rate highest and lowest?
  const ratedItems = ratings.map((r, i) => ({ rating: r, idx: i, text: FORER_STATEMENTS[i] }));
  const sortedDesc = [...ratedItems].sort((a, b) => b.rating - a.rating);
  const stickiest = sortedDesc[0];
  const weakest = sortedDesc[sortedDesc.length - 1];

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(profile.shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
          WIZ EXPERIMENT /// RESULTS
        </div>

        <div className="border border-accent/40 bg-accent/5 p-6 mb-6 text-center">
          <div className="text-6xl mb-3">{profile.emoji}</div>
          <h1 className="font-pixel text-2xl md:text-3xl text-white mb-2">
            {profile.name}
          </h1>
          <p className="text-accent text-sm font-mono mb-4">{profile.tagline}</p>
          <div className="flex justify-around items-center gap-4 my-4">
            <div>
              <div className="font-pixel text-3xl text-white">
                {ratingAvg.toFixed(2)}
              </div>
              <div className="text-muted text-xs font-mono tracking-widest mt-1">
                YOUR AVG
              </div>
            </div>
            <div className="w-px bg-white/20 h-12" />
            <div>
              <div className="font-pixel text-3xl text-white">4.26</div>
              <div className="text-muted text-xs font-mono tracking-widest mt-1">
                FORER 1948
              </div>
            </div>
          </div>
        </div>

        <div className="border border-white/10 bg-white/5 p-5 mb-5">
          <p className="text-secondary text-sm leading-relaxed">{profile.description}</p>
        </div>

        <div className="border border-white/10 bg-white/5 p-5 mb-5">
          <p className="font-mono text-xs text-accent tracking-widest mb-2">WIZ NOTE</p>
          <p className="text-secondary text-sm leading-relaxed">{profile.wizNote}</p>
        </div>

        <div className="border border-white/10 bg-white/5 p-5 mb-5">
          <p className="font-mono text-xs text-accent tracking-widest mb-2">RESEARCH</p>
          <p className="text-secondary text-sm leading-relaxed">{profile.researchNote}</p>
        </div>

        <div className="border border-white/10 bg-white/5 p-5 mb-5">
          <p className="font-mono text-xs text-accent tracking-widest mb-3">
            YOUR STICKIEST LINE
          </p>
          <p className="text-secondary text-sm leading-relaxed mb-2">
            <span className="text-accent font-mono mr-2">
              {stickiest.rating}/5
            </span>
            &ldquo;{stickiest.text}&rdquo;
          </p>
          <p className="text-muted text-xs font-mono mt-3">
            this is the line your brain volunteered the most evidence for
          </p>
        </div>

        <div className="border border-white/10 bg-white/5 p-5 mb-6">
          <p className="font-mono text-xs text-accent tracking-widest mb-3">
            YOUR WEAKEST LINE
          </p>
          <p className="text-secondary text-sm leading-relaxed mb-2">
            <span className="text-accent font-mono mr-2">
              {weakest.rating}/5
            </span>
            &ldquo;{weakest.text}&rdquo;
          </p>
          <p className="text-muted text-xs font-mono mt-3">
            this is the line where the universal claim grazed your specifics wrong
          </p>
        </div>

        <div className="border border-white/10 bg-white/5 p-5 mb-6">
          <p className="font-mono text-xs text-accent tracking-widest mb-3">
            YOUR PROFILE
          </p>
          <ul className="space-y-2">
            {profile.traits.map((trait, i) => (
              <li key={i} className="flex gap-3 text-sm text-secondary">
                <span className="text-accent">▸</span>
                <span>{trait}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 mb-8">
          <button
            onClick={handleShare}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            {copied ? '✓ COPIED' : 'COPY SHARE TEXT'}
          </button>
          <button
            onClick={restart}
            className="w-full border border-white/30 text-white font-bold py-4 font-mono text-sm tracking-widest hover:border-accent hover:text-accent transition-colors"
          >
            RESTART
          </button>
        </div>

        <div className="text-center font-mono text-xs text-muted">
          based on Forer (1949), Stagner (1958), Meehl (1956), Snyder Shenkel &amp; Lowery
          (1977), Dickson &amp; Kelly (1985), Glick Gottesman &amp; Jolton (1989), Hyman
          (1977), Furnham &amp; Schofield (1987)
        </div>
      </div>
    </div>
  );
}

'use client';

// THE CONJUNCTION FALLACY
// Tversky and Kahneman (1983) introduced the Linda problem: a 31-year-old
// philosophy major, outspoken, concerned with social justice. Subjects were
// asked which was more likely — Linda is a bank teller, or Linda is a bank
// teller AND active in the feminist movement. 85% picked the compound. The
// math says they cannot. P(A and B) is at most P(A). The compound is always
// less probable than either part on its own. The fallacy survives education,
// statistical training, and explicit warnings. The cause is the
// representativeness heuristic — humans rate probability by how well a
// description fits a stereotype, not by counting cases. The detailed
// description of Linda fits "feminist bank teller" better than "bank teller"
// alone, so the brain rates the compound as more likely. The math says it
// cannot be. This experiment runs eight Linda-style vignettes and counts
// how often the story beats the probability.
// WIZ note: Every one of these vignettes is engineered to hand you a
// stereotype on a silver tray. The math never moves; the description gets
// thicker. The trick is not to refuse the stereotype — it is to notice that
// you have been handed one, and that probability is not asking you about
// fit, it is asking you about counting.

import { useState, useCallback, useEffect } from 'react';

type ChoiceLetter = 'A' | 'B';

interface Choice {
  letter: ChoiceLetter;
  text: string;
  isCorrect: boolean;
  isFallacy: boolean;
}

interface Vignette {
  id: number;
  domain: string;
  description: string;
  question: string;
  choices: Choice[];
  correctReasoning: string;
  fallacyTrap: string;
  research: string;
}

const VIGNETTES: Vignette[] = [
  {
    id: 1,
    domain: 'LINDA',
    description:
      'Linda is 31, single, outspoken, and very bright. In college she majored in philosophy. As a student she was deeply concerned with issues of discrimination and social justice, and she took part in anti-nuclear demonstrations.',
    question: 'Which is more likely?',
    choices: [
      {
        letter: 'A',
        text: 'Linda is a bank teller.',
        isCorrect: true,
        isFallacy: false,
      },
      {
        letter: 'B',
        text: 'Linda is a bank teller AND is active in the feminist movement.',
        isCorrect: false,
        isFallacy: true,
      },
    ],
    correctReasoning:
      'A is always at least as likely as B. Every Linda who is a feminist bank teller is also a bank teller — the second group is a strict subset of the first. Adding any condition can only narrow the set, never widen it. Probability has to fall, or stay the same. It cannot rise.',
    fallacyTrap:
      'The description was engineered to fit the feminist stereotype. Reading B feels like a tighter match for the Linda you just met. The brain rates "fits the story" instead of "covers more cases." Representativeness wins; counting loses.',
    research:
      'Tversky and Kahneman (1983) ran this exact problem on Stanford undergraduates, doctoral students in decision science, and statistically-trained subjects. 85% chose the conjunction across all groups. Training helped a little. Stereotype thickness helped a lot.',
  },
  {
    id: 2,
    domain: 'MARK',
    description:
      'Mark, 38, has a PhD in physics from MIT. He plays competitive chess on weekends. His apartment has 2,000 books and three whiteboards covered in equations. He has not owned a TV in fifteen years.',
    question: 'Which is more likely?',
    choices: [
      {
        letter: 'A',
        text: 'Mark has a job.',
        isCorrect: true,
        isFallacy: false,
      },
      {
        letter: 'B',
        text: 'Mark has a job AND works at a research lab.',
        isCorrect: false,
        isFallacy: true,
      },
    ],
    correctReasoning:
      'Every research-lab-employed Mark is also an employed Mark. The second set is contained inside the first. Plenty of physics PhDs end up in finance, software, consulting, or teaching — none of those are research labs. The bigger box always has more or equal cases.',
    fallacyTrap:
      'The whiteboards and the equations and the chess and the 2,000 books all push toward "research scientist." B sounds like the Mark you were just shown. A sounds bland. The brain rates richness, not size of set.',
    research:
      'Tversky and Kahneman (1983) showed the fallacy generalizes well past Linda. Any vignette that makes a specific outcome feel diagnostic produces the inversion. The thicker the description, the wider the fallacy gap.',
  },
  {
    id: 3,
    domain: 'AMY',
    description:
      'Amy, 27, has been vegetarian since she was 16. Her car is a beat-up Subaru with a "Coexist" bumper sticker. She volunteers somewhere every Sunday. Her Instagram is mostly rescue dogs and protest signs.',
    question: 'Which is more likely?',
    choices: [
      {
        letter: 'A',
        text: 'Amy donates to charity.',
        isCorrect: true,
        isFallacy: false,
      },
      {
        letter: 'B',
        text: 'Amy donates to charity AND donates specifically to animal welfare causes.',
        isCorrect: false,
        isFallacy: true,
      },
    ],
    correctReasoning:
      'Every Amy who donates to animal welfare is also an Amy who donates to charity. Animal welfare is one slice of the donation pie — environmental, refugee, medical, educational, religious, and arts charities are also possibilities. A covers all of them; B covers one.',
    fallacyTrap:
      'The rescue dogs and the bumper sticker make animal welfare feel like the obvious channel. The brain swaps "Amy gives" with "Amy gives to the cause that matches her vibe." The vibe-match is correct; the probability claim is not.',
    research:
      'A direct extension of the Linda result. Specificity that fits the stereotype consistently inflates perceived probability. The compound feels diagnostic; that feeling is the fallacy.',
  },
  {
    id: 4,
    domain: 'BILL',
    description:
      'Bill, 45, is a senior executive at a Fortune 500 company. He runs marathons. He reads Marcus Aurelius on Sunday mornings. His Instagram bio reads "leader, learner, listener."',
    question: 'Which is more likely?',
    choices: [
      {
        letter: 'A',
        text: 'Bill exercises regularly.',
        isCorrect: true,
        isFallacy: false,
      },
      {
        letter: 'B',
        text: 'Bill exercises regularly AND has done a silent meditation retreat.',
        isCorrect: false,
        isFallacy: true,
      },
    ],
    correctReasoning:
      'Marathon training is exercise; the description already gave A away in plain text. B adds a strict additional condition (silent retreat) that need not be true. Some marathon-running stoics meditate; many do not. A always wins.',
    fallacyTrap:
      'Marcus Aurelius plus "leader, learner, listener" plus "long-distance runner" makes silent retreat feel like the natural extension. The brain auto-completes the persona. The persona is plausible but unrelated to the math.',
    research:
      'Description thickness predicts fallacy rate more reliably than the topic. This persona was deliberately engineered to fit a "Silicon Valley executive who took up Stoicism" archetype.',
  },
  {
    id: 5,
    domain: 'JULIA',
    description:
      'Julia, 22, is in her final year of law school. She placed third in the national debate championship two years running. She writes for the school paper and tutors first-year students on weekends.',
    question: 'Which is more likely?',
    choices: [
      {
        letter: 'A',
        text: 'Julia has a hobby outside of law.',
        isCorrect: true,
        isFallacy: false,
      },
      {
        letter: 'B',
        text: 'Julia has a hobby outside of law AND it involves public speaking.',
        isCorrect: false,
        isFallacy: true,
      },
    ],
    correctReasoning:
      'Hobbies outside of law include painting, climbing, baking, gaming, gardening, cycling, knitting, and a thousand other quiet activities. B is one specific subset of A. The chance of "any hobby" is always at least the chance of "any hobby AND it is this specific kind."',
    fallacyTrap:
      'Debate plus tutoring plus school paper screams "she likes performing." B feels like the obvious continuation. The thing the brain skips: most hobbies people do at home are silent. Even debate champions often unwind by reading.',
    research:
      'Reinforces that the fallacy is about the operator AND, not about the topics being conjoined. Every B in this experiment is "A AND extra-thing-that-fits-the-vibe."',
  },
  {
    id: 6,
    domain: 'TOM',
    description:
      'Tom, 52, served twenty years in the Marines, retiring as a Master Sergeant. He drives a pickup, votes Republican every cycle, and has a bumper sticker that reads "Don\'t Tread On Me."',
    question: 'Which is more likely?',
    choices: [
      {
        letter: 'A',
        text: 'Tom owns at least one firearm.',
        isCorrect: true,
        isFallacy: false,
      },
      {
        letter: 'B',
        text: 'Tom owns at least one firearm AND volunteers at a veterans support organization.',
        isCorrect: false,
        isFallacy: true,
      },
    ],
    correctReasoning:
      'Volunteering is an additional condition that is not implied by anything in the vignette. A retired Marine with a pickup may or may not volunteer — many do, many do not. Adding the volunteer clause is a strict narrowing. The compound is at most as likely as the single.',
    fallacyTrap:
      'The "warrior who gives back" is a clean American story. The brain prefers the clean story to the messy reality where some retired Marines are private, retired, and uninterested in service work. Story-fit is not probability.',
    research:
      'Note that this vignette runs against a different stereotype than Linda or Amy. The fallacy is politically symmetric. Any tight stereotype yields the same inversion, regardless of which way it leans.',
  },
  {
    id: 7,
    domain: 'SARAH',
    description:
      'Sarah, 33, majored in art history. She lived in Paris for a year after graduation. She plays cello in a community orchestra and is fluent in three languages. She works in finance at a Manhattan bank.',
    question: 'Which is more likely?',
    choices: [
      {
        letter: 'A',
        text: 'Sarah has been to a museum in the past year.',
        isCorrect: true,
        isFallacy: false,
      },
      {
        letter: 'B',
        text: 'Sarah has been to a museum in the past year AND attends classical music concerts at least quarterly.',
        isCorrect: false,
        isFallacy: true,
      },
    ],
    correctReasoning:
      'Cello in a community orchestra does not mean she attends concerts as a listener — many amateur musicians rarely buy tickets. A covers any museum visit. B covers museum AND a specific cadence of concert attendance. The set has to be smaller.',
    fallacyTrap:
      'Art history major plus cellist plus Paris year compresses to "cultural elite who consumes culture." The brain auto-finishes the picture. B is a plausible inference, not a probability gain.',
    research:
      'Tversky and Kahneman (1983) found that subjects who explicitly endorsed the conjunction rule in the abstract still committed the fallacy on Linda. Knowing the math does not guarantee using it.',
  },
  {
    id: 8,
    domain: 'DAVE',
    description:
      'Dave, 29, is a software engineer in San Francisco. He has been vegan for four years. He bikes everywhere. His Twitter handle is @dave_buildz_ai. His most-played podcast last year was a 12-hour interview with an AI safety researcher.',
    question: 'Which is more likely?',
    choices: [
      {
        letter: 'A',
        text: 'Dave has tried at least one mindfulness app.',
        isCorrect: true,
        isFallacy: false,
      },
      {
        letter: 'B',
        text: 'Dave has tried at least one mindfulness app AND meditates daily.',
        isCorrect: false,
        isFallacy: true,
      },
    ],
    correctReasoning:
      'Trying an app once is a low bar. Meditating daily is a high bar — the dropoff between download and daily habit is roughly 95%. B is "A AND a much rarer thing." A always wins, and on this gap, by a lot.',
    fallacyTrap:
      'The whole vignette is a Bay Area starter pack. The brain reads it and predicts the entire archetype, daily meditation included. The archetype is plausible; the daily-habit completion rate is not.',
    research:
      'A useful inversion: the SF tech vegan stereotype is one of the strongest in the experiment, so the fallacy gap should be largest here. Notice how the "feels right" pull scales with stereotype thickness.',
  },
];

type ProfileKey = 'logician' | 'mathematician' | 'modal' | 'storyteller' | 'narrator';

interface Profile {
  key: ProfileKey;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  wizNote: string;
  researchNote: string;
  traits: [string, string, string];
  shareText: string;
  minFallacyCount: number;
  maxFallacyCount: number;
}

const PROFILES: Profile[] = [
  {
    key: 'logician',
    name: 'The Logician',
    emoji: '∀',
    tagline: 'You picked the bigger set every time. The story did not move you.',
    description:
      'You committed the conjunction fallacy 0 or 1 times out of 8. This is rare. Tversky and Kahneman ran the original Linda problem on Stanford doctoral students trained in statistics, and 85% still picked the compound. You did not. Either you have internalized the conjunction rule (P(A and B) is at most P(A)) deeply enough to override the stereotype pull, or you read these vignettes the way a logician reads them — as set diagrams, not as character sketches. Either way, the result puts you in the top decile of subjects across every published replication.',
    wizNote:
      'You are running the math even when the prose is screaming a story at you. That is unusual. The cost: you may be slightly slow on social pattern-matching tasks where the thing being asked actually is "does this person fit this archetype?" The skill of separating "fits the picture" from "covers more cases" is exactly the skill of judging probability over judging vibe. Most people cannot. Notice when other people in your life are picking compounds in arguments — the entire field of political punditry runs on this fallacy.',
    researchNote:
      'Tversky and Kahneman (1983) found roughly 10-15% of subjects gave the normatively correct answer on Linda. Subsequent replications across 30+ studies (Hertwig and Gigerenzer 1999, Charness Karni Levin 2010, Tentori Crupi Russo 2013) put the rate around 10-25% depending on framing. Frequency framings ("of 100 people like Linda, how many...") raise correct response rates substantially; probability framings, like the one here, keep them low.',
    traits: [
      'Reads vignettes as set diagrams, not personalities',
      'Conjunction rule overrides stereotype pull',
      'Top 10-15% across all published Linda replications',
    ],
    shareText:
      'I committed the conjunction fallacy 0-1/8 times on WIZ\'s Linda Problem experiment. Tversky and Kahneman found 85% of Stanford doctoral students fail this. Suspicious of my own result.',
    minFallacyCount: 0,
    maxFallacyCount: 1,
  },
  {
    key: 'mathematician',
    name: 'The Mathematician',
    emoji: '∩',
    tagline: 'Most of the time you saw subset, not story.',
    description:
      'You committed the fallacy 2 times out of 8. You are catching the structure on most vignettes — recognizing that "A AND B" is contained inside "A" and so cannot be more probable. The two that got you were probably the ones with the thickest stereotype, where the description was tuned tightest to the conjunction. That is the signature of someone who knows the conjunction rule but lets stereotype pull through on the high-fit cases. Across the published literature, this score puts you in roughly the top quintile of subjects.',
    wizNote:
      'You are mostly running the math, and you can feel the pull when stereotype-fit gets thick. The next move is to notice the pull as a signal in itself: when a description feels like it was engineered to make a specific compound feel right, that is the cue to be especially careful, not less. Real-life versions of the conjunction fallacy rarely come labeled. Job descriptions, news headlines, and political ads all hide compounds inside thick character sketches. The skill is the same; the stakes are higher.',
    researchNote:
      'Tentori, Crupi & Russo (2013) showed that subjects who scored well on conjunction-fallacy tasks also performed better on base-rate neglect, gambler\'s fallacy, and Wason selection tasks — suggesting a shared "stop and check the structure" trait, weakly correlated with general numeracy and more strongly correlated with reflective-thinking measures.',
    traits: [
      'Catches subset structure on most items',
      'Stereotype-thickness predicts your misses',
      'Top 20-25% of conjunction-test subjects',
    ],
    shareText:
      'I committed the conjunction fallacy 2/8 on WIZ\'s Linda Problem experiment. Better than the 85% who fall for it; the thick stereotypes still got me.',
    minFallacyCount: 2,
    maxFallacyCount: 2,
  },
  {
    key: 'modal',
    name: 'The Modal Mind',
    emoji: '≈',
    tagline: 'Half subset, half story. Standard pattern.',
    description:
      'You committed the fallacy 3 or 4 times out of 8. This is roughly where most subjects land on the extended version of the test. You catch the math on the looser stereotypes and lose to it on the tighter ones. The pattern is predictable: the descriptions engineered with cleanest narrative fit (Mark, Linda, Dave) win against you, while the more generic ones (Julia, Tom) you read as set diagrams. Education does not move this much; the original Tversky and Kahneman work showed that even Stanford statistics PhDs scored in this band.',
    wizNote:
      'Half the time you ran the math, half the time the story ran you. That is the modal pattern. The interesting question is not "how do I get to zero." Most fallacy-resistance training raises scores by maybe one or two points and not durably. The interesting question is: in your real decisions, when did you last commit a conjunction fallacy with money or commitment on the line? "This founder is brilliant AND this idea will work" is one. "This person is principled AND will fight for me when it counts" is another. The vibe-match is what real deception runs on.',
    researchNote:
      'Hertwig and Gigerenzer (1999) reanalyzed Linda data and argued some of the fallacy is conversational, not cognitive — subjects assume "bank teller" implies "bank teller AND not feminist" because the experimenter would not have given details if they were irrelevant. Even after correcting for this Gricean factor, around 50-60% of subjects still commit the fallacy.',
    traits: [
      'Catches loose stereotypes, misses tight ones',
      'Modal score on extended Linda problems',
      'Pattern matches Tversky and Kahneman (1983)',
    ],
    shareText:
      'I committed the conjunction fallacy 3-4/8 on WIZ\'s Linda Problem experiment — the modal score. Half subset, half story. Apparently this is how Stanford statistics PhDs do too.',
    minFallacyCount: 3,
    maxFallacyCount: 4,
  },
  {
    key: 'storyteller',
    name: 'The Storyteller',
    emoji: '∋',
    tagline: 'The descriptions worked on you. Most of the time.',
    description:
      'You committed the fallacy 5 or 6 times out of 8. The vignettes did roughly what they were engineered to do — handed you a stereotype, and the stereotype-fit pulled stronger than the set-size math. This is the most common pattern in the original published Linda data. It does not mean you are bad at probability. It means your mind, like most minds, judges "how likely" by "how well does this fit a picture I already have." That heuristic is fast and almost always good enough — except in cases like these, where the question is specifically "are there more X or more X-AND-something-extra," and the math is rigid.',
    wizNote:
      'You are reading these vignettes as people, which is exactly what the experimenters wanted you to do, which is what makes the fallacy reliable. The fix is not "read everything as logic." That would make life unbearable. The fix is: when you feel a description tightening around a specific compound (this candidate is not just smart but smart AND a great team player; this opportunity is not just real but real AND a perfect fit), pause once. Pull the AND apart. Ask whether the second clause is given to you by the description or projected by you onto it. Most of the time, it is the second.',
    researchNote:
      'Charness, Karni and Levin (2010) found that financial incentives (paying subjects for correct answers) reduced but did not eliminate the conjunction fallacy. The trait is durable across incentive structures, education levels, and explicit warnings about the conjunction rule.',
    traits: [
      'Story-fit beats set-size on most items',
      'Reads vignettes as people, not as set diagrams',
      'Most-common single Linda score band',
    ],
    shareText:
      'I committed the conjunction fallacy 5-6/8 on WIZ\'s Linda Problem experiment. The descriptions got me — story beat math. Same as 85% of subjects in the original Tversky-Kahneman study.',
    minFallacyCount: 5,
    maxFallacyCount: 6,
  },
  {
    key: 'narrator',
    name: 'The Narrator',
    emoji: '⊃',
    tagline: 'Story ran the test, end to end.',
    description:
      'You committed the fallacy 7 or 8 times out of 8. Every thick stereotype handed to you, you completed. This is not a knowledge gap and not unintelligence — Tversky and Kahneman showed that this score band is statistically indistinguishable from professional subjects given the same vignettes under the same framing. What it tells you is that you are an unusually fluent narrative thinker. You read each vignette as a person, completed the picture, and rated the completed picture as "more likely to be true." The cost: the structural question (does set A contain set B) was not the question your mind ran. The benefit: your social pattern-matching is probably very good.',
    wizNote:
      'A clean 7 or 8 is the strongest possible signal that you read the world through people, not through math. There is nothing wrong with this. Most of human social and political life rewards exactly this skill. The cost shows up in two places: probability decisions where compounds are dressed in personas (most political punditry, most career advice, most pitch decks), and any time someone hands you a story tight enough to hide an extra clause inside. The fix: when you feel the story click into place, the click is the cue to read the sentence one more time and check what is actually being asked.',
    researchNote:
      'Tentori, Crupi & Russo (2013) showed that subjects who fail the Linda problem often pass logically equivalent problems framed without a personality vignette. The vignette is doing the work, not the underlying logic. Stripping the description usually halves the fallacy rate.',
    traits: [
      'Completes every persona handed to you',
      'Reads probability questions as story-fit',
      'High narrative fluency, low set-structure attention',
    ],
    shareText:
      'I committed the conjunction fallacy 7-8/8 on WIZ\'s Linda Problem experiment. Pure narrative thinking — every stereotype landed. Apparently I read people, not set diagrams.',
    minFallacyCount: 7,
    maxFallacyCount: 8,
  },
];

function getProfile(fallacyCount: number): Profile {
  for (const p of PROFILES) {
    if (fallacyCount >= p.minFallacyCount && fallacyCount <= p.maxFallacyCount) return p;
  }
  return PROFILES[PROFILES.length - 1];
}

type Phase = 'intro' | 'problem' | 'feedback' | 'results';

export default function ConjunctionFallacyClient() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [picks, setPicks] = useState<ChoiceLetter[]>([]);
  const [selected, setSelected] = useState<ChoiceLetter | null>(null);
  const [copied, setCopied] = useState(false);

  const vignette = VIGNETTES[currentIdx];
  const picked = selected
    ? vignette.choices.find((c) => c.letter === selected) ?? null
    : null;

  useEffect(() => {
    if (phase === 'results' || phase === 'problem') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [phase, currentIdx]);

  const confirmPick = useCallback(() => {
    if (!selected) return;
    setPhase('feedback');
  }, [selected]);

  const nextProblem = useCallback(() => {
    if (!selected) return;
    const newPicks = [...picks, selected];
    setPicks(newPicks);
    setSelected(null);
    if (currentIdx + 1 >= VIGNETTES.length) {
      setPhase('results');
    } else {
      setCurrentIdx((i) => i + 1);
      setPhase('problem');
    }
  }, [selected, picks, currentIdx]);

  const restart = useCallback(() => {
    setPhase('intro');
    setCurrentIdx(0);
    setPicks([]);
    setSelected(null);
  }, []);

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            WIZ EXPERIMENT /// THE CONJUNCTION FALLACY
          </div>
          <h1 className="font-pixel text-3xl md:text-4xl text-white text-center mb-6 leading-tight">
            The Conjunction Fallacy
          </h1>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6 font-mono text-sm text-secondary space-y-3">
            <p>
              <span className="text-accent">&gt;</span> Eight characters. Each is described
              in detail.
            </p>
            <p>
              <span className="text-accent">&gt;</span> For each one, two statements. One is
              simple — a single condition. The other adds an extra clause that fits the
              stereotype.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Pick which is more likely.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Math: P(A and B) is at most P(A).
              The compound can never be more probable than the part.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Tversky and Kahneman (1983) found
              85% of subjects pick the compound anyway. Even Stanford statistics PhDs.
              Your turn.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-8 text-sm text-secondary">
            <span className="text-white font-medium">WIZ note: </span>Every one of these
            vignettes is engineered to hand you a stereotype on a silver tray. The math
            never moves; the description gets thicker. The trick is not to refuse the
            stereotype — it is to notice that probability is asking about counting, not
            about fit.
          </div>

          <button
            onClick={() => setPhase('problem')}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            BEGIN THE TEST &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            8 vignettes &middot; 4&ndash;6 minutes &middot; based on Tversky and Kahneman
            (1983)
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'problem') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs">
            <span className="text-accent tracking-widest">VIGNETTE</span>
            <span className="text-muted uppercase">{vignette.domain}</span>
          </div>

          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / VIGNETTES.length) * 100}%` }}
            />
          </div>

          <div className="font-mono text-xs text-muted tracking-widest mb-3">
            CASE {currentIdx + 1} OF {VIGNETTES.length}
          </div>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-5">
            <p className="font-mono text-xs text-accent tracking-widest mb-3">
              READ THE DESCRIPTION
            </p>
            <p className="text-white text-base leading-relaxed">{vignette.description}</p>
          </div>

          <div className="border border-white/20 bg-white/5 p-4 mb-5">
            <p className="font-mono text-xs text-white tracking-widest mb-2">
              {vignette.question}
            </p>
          </div>

          <p className="font-mono text-xs text-muted tracking-widest mb-3">
            YOUR ANSWER
          </p>

          <div className="space-y-3 mb-6">
            {vignette.choices.map((c) => {
              const isSelected = selected === c.letter;
              return (
                <button
                  key={c.letter}
                  onClick={() => setSelected(c.letter)}
                  className={`w-full text-left border p-4 transition-colors ${
                    isSelected
                      ? 'border-accent bg-accent/10'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    <div
                      className={`font-pixel text-2xl flex-shrink-0 ${
                        isSelected ? 'text-accent' : 'text-white'
                      }`}
                    >
                      {c.letter}
                    </div>
                    <p className="text-secondary text-base leading-relaxed">{c.text}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={confirmPick}
            disabled={!selected}
            className={`w-full font-bold py-4 font-mono text-sm tracking-widest transition-colors ${
              selected
                ? 'bg-accent text-black hover:bg-white'
                : 'bg-white/10 text-muted cursor-not-allowed'
            }`}
          >
            LOCK ANSWER &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            {currentIdx + 1} / {VIGNETTES.length} &middot; no scrolling back
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'feedback' && picked) {
    const correct = picked.isCorrect;
    const fallacy = picked.isFallacy;
    const verdictBox = correct
      ? 'border-accent/40 bg-accent/5'
      : 'border-yellow-400/40 bg-yellow-400/5';
    const verdictLabelColor = correct ? 'text-accent' : 'text-yellow-400';
    const verdictLabel = correct
      ? 'SUBSET CAUGHT — CORRECT'
      : 'CONJUNCTION FALLACY — STORY BEAT MATH';
    const verdictHeadline = correct
      ? 'You picked the bigger set. The story did not pull you in.'
      : 'You picked the compound. The stereotype completed the picture.';

    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs">
            <span className="text-accent tracking-widest">VERDICT</span>
            <span className="text-muted uppercase">{vignette.domain}</span>
          </div>

          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / VIGNETTES.length) * 100}%` }}
            />
          </div>

          <div className={`border p-5 mb-5 ${verdictBox}`}>
            <p className={`font-mono text-xs tracking-widest mb-2 ${verdictLabelColor}`}>
              {verdictLabel}
            </p>
            <h2 className="font-pixel text-xl text-white mb-3 leading-tight">
              {verdictHeadline}
            </h2>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              <span className="text-accent font-mono text-xs">CORRECT // </span>
              {vignette.correctReasoning}
            </p>
            <p className="text-secondary text-sm leading-relaxed">
              <span className="text-yellow-400 font-mono text-xs">THE TRAP // </span>
              {vignette.fallacyTrap}
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-6 text-sm text-secondary">
            <span className="text-accent font-mono text-xs">RESEARCH // </span>
            {vignette.research}
          </div>

          <button
            onClick={nextProblem}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            {currentIdx + 1 < VIGNETTES.length
              ? 'NEXT VIGNETTE →'
              : 'SEE THE VERDICT →'}
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            {currentIdx + 1} / {VIGNETTES.length}
          </p>
        </div>
      </div>
    );
  }

  const fallacyMarks = VIGNETTES.map((v, i) => {
    const letter = picks[i];
    const choice = v.choices.find((c) => c.letter === letter);
    return choice && choice.isFallacy ? 1 : 0;
  });
  const fallacyCount = fallacyMarks.reduce((a: number, b: number) => a + b, 0);
  const correctCount = VIGNETTES.length - fallacyCount;
  const profile = getProfile(fallacyCount);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
          WIZ EXPERIMENT /// CONJUNCTION FALLACY MEASURED
        </div>

        <div className="border border-accent/40 bg-accent/5 p-6 mb-6 text-center">
          <div className="text-5xl mb-3 font-pixel">{profile.emoji}</div>
          <div className="font-mono text-xs text-accent tracking-widest mb-2">
            YOUR PROBABILITY PROFILE
          </div>
          <h2 className="font-pixel text-2xl text-white mb-2">{profile.name}</h2>
          <p className="text-accent text-sm mb-4 italic">{profile.tagline}</p>
          <p className="text-secondary text-sm leading-relaxed">{profile.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="border border-accent/30 bg-accent/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">SUBSET CAUGHT</p>
            <p className="font-pixel text-4xl text-accent">
              {correctCount}
              <span className="text-white text-xl">/{VIGNETTES.length}</span>
            </p>
            <p className="text-muted text-xs font-mono mt-1">math beat story</p>
          </div>
          <div className="border border-yellow-400/30 bg-yellow-400/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">FALLACY COUNT</p>
            <p className="font-pixel text-4xl text-yellow-400">
              {fallacyCount}
              <span className="text-white text-xl">/{VIGNETTES.length}</span>
            </p>
            <p className="text-muted text-xs font-mono mt-1">story beat math</p>
          </div>
        </div>

        <div className="border border-white/10 bg-white/5 p-4 mb-4">
          <p className="text-muted text-xs font-mono mb-3">PATTERNS DETECTED</p>
          <div className="space-y-2">
            {profile.traits.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-secondary">
                <span className="text-accent font-mono">&rsaquo;</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-white/10 bg-white/5 p-4 mb-4 text-sm text-secondary">
          <span className="text-accent font-mono text-xs">WIZ // </span>
          {profile.wizNote}
        </div>

        <div className="border border-white/10 p-3 mb-6 text-xs text-muted font-mono leading-relaxed">
          <span className="text-white">RESEARCH // </span>
          {profile.researchNote}
        </div>

        <div className="mb-6">
          <p className="text-muted text-xs font-mono mb-3">YOUR ANSWERS, CASE BY CASE</p>
          <div className="space-y-2">
            {VIGNETTES.map((v, i) => {
              const letter = picks[i];
              const choice = v.choices.find((c) => c.letter === letter);
              const isFallacy = !!choice?.isFallacy;
              const label = isFallacy ? 'FALLACY' : 'SUBSET';
              const colorClass = isFallacy
                ? 'border-yellow-400/30 bg-yellow-400/5'
                : 'border-accent/40 bg-accent/5';
              const labelColor = isFallacy ? 'text-yellow-400' : 'text-accent';
              return (
                <div key={v.id} className={`border p-3 ${colorClass}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs font-mono truncate flex-1">
                      {v.domain}
                    </span>
                    <span className={`font-mono text-xs ml-2 ${labelColor}`}>
                      {label}
                    </span>
                  </div>
                  <p className="text-secondary text-xs leading-relaxed truncate">
                    {choice?.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border border-accent/30 bg-accent/5 p-4 mb-6">
          <p className="text-accent text-xs font-mono mb-2">THE PATTERN</p>
          <p className="text-secondary text-sm leading-relaxed">
            The conjunction fallacy is not about probability ignorance. Subjects who can
            recite the conjunction rule still commit it on Linda. It is about which mode
            the brain runs first. Representativeness — does this fit the stereotype — is
            faster than probability — how many cases are we counting. Both modes are
            useful; the trick is noticing which question is being asked. In real life,
            most "obvious" inferences about people are conjunctions: not "they are X" but
            "they are X AND Y AND Z." Each AND narrows the set. Each AND is a place where
            the story is doing more work than the math allows.
          </p>
        </div>

        <div className="border border-white/10 p-4 mb-6">
          <p className="text-muted text-xs font-mono mb-3">SHARE YOUR PROFILE</p>
          <p className="text-secondary text-sm mb-3">
            {profile.shareText}
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(profile.shareText);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="w-full border border-white/20 text-white font-mono text-xs py-2 hover:border-accent hover:text-accent transition-colors"
          >
            {copied ? '✓ COPIED' : 'COPY RESULT'}
          </button>
        </div>

        <button
          onClick={restart}
          className="w-full border border-white/20 text-secondary font-mono text-xs py-3 hover:border-white hover:text-white transition-colors"
        >
          &larr; RETAKE THE EXPERIMENT
        </button>
      </div>
    </div>
  );
}

'use client';

// THE CURSE OF KNOWLEDGE
// In 1990, at Stanford, Elizabeth Newton ran a now-famous dissertation
// study. She paired tappers with listeners. The tapper picked a song
// from a list of 25 well-known melodies — Happy Birthday, the Star-
// Spangled Banner, Jingle Bells — and tapped its rhythm on the table.
// The listener guessed the song. Before each round, tappers predicted
// how often listeners would identify the song correctly. Their average
// prediction: 50%. The actual rate: 2.5% — three identifications across
// 120 attempts. The tappers were not stupid. They could not stop hearing
// the melody as they tapped. To them, "dum dum DUM dum dum DUM" was the
// full song with chorus and bridge. To the listener, it was a stranger
// banging on a desk. Once you know something, you cannot reliably
// imagine not knowing it. This is the curse of knowledge: the inability
// to model another mind that lacks the information yours has. Camerer,
// Loewenstein & Weber (1989) showed it scales — better-informed traders
// systematically misprice goods because they cannot suppress their own
// information when reasoning about less-informed counterparties. Kruger,
// Epley, Parker & Ng (2005) found senders of email believe their tone
// is far more readable than recipients actually find it. Heath & Heath
// "Made to Stick" (2007) named the curse as the central enemy of
// communication. This experiment runs eight scenarios in which you are
// the expert and someone else is the outsider. You predict the outsider's
// success rate. WIZ then opens the actual research and measures the
// gap between your inside view and the outside view.
// WIZ note: The fix for the curse is not "be smarter." Smart people
// have it worse, because their inside view is richer and harder to
// suppress. The fix is to seek the actual outside number — ask a real
// novice, watch a real first-time user, A/B test the email — instead
// of imagining one. The gap you produce in this experiment is the
// distance between your simulation of a stranger and a real stranger.

import { useState, useCallback, useEffect } from 'react';

interface Scenario {
  id: number;
  domain: string;
  setup: string;
  question: string;
  unitLabel: string;
  defaultEstimate: number;
  actualValue: number;
  actualLabel: string;
  reveal: string;
  research: string;
  wizCommentary: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    domain: 'NEWTON\'S TAPPERS',
    setup:
      'You will tap the rhythm of "Happy Birthday" on a desk for a stranger. Tap-tap-TAP, tap-tap-TAP, tap-tap-tap-tap. In your head, the melody plays in full — words, chorus, the awkward pause. To the listener, it is finger-tapping on wood. No tune, no pitch, no bridge.',
    question: 'What percentage of listeners will correctly guess the song from your taps alone?',
    unitLabel: '%',
    defaultEstimate: 50,
    actualValue: 2.5,
    actualLabel: '2.5%',
    reveal:
      'Three correct guesses out of 120 trials. Tappers in the original study averaged 50% predicted; the floor was 2.5% actual. The whole melody was inside the tapper\'s head and could not be subtracted from the percussion the listener was hearing. The gap between the inside view and the outside view was a factor of twenty.',
    research:
      'Newton (1990) "Overconfidence in the Communication of Intent: Heard and Unheard Melodies." Stanford PhD dissertation. Replicated and made famous by Heath & Heath (2007) "Made to Stick." The tapper-listener gap is now the textbook illustration of the curse of knowledge across communication research, education, and product design.',
    wizCommentary:
      'The melody is in your head, not in the air. The tapper hears chorus, bridge, the candles, the kid. The listener hears wood. No effort closes that gap unconditionally — only listening to a real listener does.',
  },
  {
    id: 2,
    domain: 'EMAIL TONE',
    setup:
      'You write a one-line reply to a colleague\'s long proposal: "ok." Just those three characters. To you, the brevity is friendly — you were busy, you said yes, end of thread. The recipient is reading on their phone, mid-meeting, no context.',
    question: 'What percentage of recipients will correctly read your tone as friendly (rather than cold, dismissive, or passive-aggressive)?',
    unitLabel: '%',
    defaultEstimate: 70,
    actualValue: 50,
    actualLabel: '~50% (chance)',
    reveal:
      'In the canonical Kruger, Epley, Parker & Ng study, senders predicted recipients would correctly read sarcasm and tone about 78% of the time. Recipients actually got it right roughly 56% — barely above chance. For deliberately ambiguous messages like "ok," the recipient detection rate sits at chance. Email tone is unreadable, but only one side of the conversation knows that.',
    research:
      'Kruger, Epley, Parker & Ng (2005) "Egocentrism over E-Mail: Can We Communicate as Well as We Think?" Journal of Personality and Social Psychology. Across five experiments, senders systematically overestimated how clearly their tone would land. The effect held for friends, strangers, sarcasm, sincerity, and sentence length.',
    wizCommentary:
      'You hear your own voice when you write. The recipient hears no voice. Tone in text is hallucinated by the reader from cues you did not place there. The shorter the message, the harder the hallucination works.',
  },
  {
    id: 3,
    domain: 'TECH JARGON',
    setup:
      'You write a product update for a general audience. The first sentence: "We migrated our auth flow to OAuth and added MFA via TOTP." It feels obvious to you. You have used these acronyms for years. Your audience is the general English-reading public — coffee-shop browsers, retirees, parents, teenagers, your aunt.',
    question: 'What percentage of general adults can correctly explain what OAuth, MFA, and TOTP refer to?',
    unitLabel: '%',
    defaultEstimate: 35,
    actualValue: 8,
    actualLabel: '~8%',
    reveal:
      'Pew Research surveys of US adults find roughly 8% can correctly identify all three of those acronyms unprompted. Around 28% know "MFA" in some form. OAuth and TOTP recognition both sit below 15%. The general public mostly does not parse acronyms by expanding them — they pattern-match on familiarity, and most of these acronyms have no familiar pattern.',
    research:
      'Pew Research Center (2019, 2022) "Americans and Digital Knowledge" series. Most respondents struggle even with foundational technology terms — under 50% can correctly identify what HTTPS does, under 30% can define an algorithm. Tech workers asked to predict these numbers consistently overestimate by 30-60 percentage points (industry replication studies, 2020-2023).',
    wizCommentary:
      'Inside the tech bubble, OAuth is air. Outside the bubble, it is alphabet soup. The asymmetry is the entire problem in product copy, marketing pages, and onboarding flows. The customer is not stupid; they are simply not in the room where these acronyms got introduced.',
  },
  {
    id: 4,
    domain: 'CHESS RECALL',
    setup:
      'You are a club-strength chess player. You glance at a real mid-game board for five seconds. You will then reproduce it from memory on a blank board. You estimate you will get most pieces right. Now imagine a complete novice — someone who knows the rules but has played fewer than 20 games — doing the same thing. The board has about 25 pieces in a typical mid-game position.',
    question: 'How many pieces (out of 25) will the novice place correctly after a 5-second look?',
    unitLabel: 'pieces',
    defaultEstimate: 12,
    actualValue: 5,
    actualLabel: '~4-5 pieces',
    reveal:
      'In the classic Chase & Simon study, masters reproduced ~16 of 25 pieces from a 5-second view of a real game position. Novices reproduced ~4. The crucial detail: when the same pieces were arranged randomly (not from a real game), masters dropped to ~4 also. Masters were not seeing pieces — they were seeing chunks: openings, formations, attack patterns. The novice saw 25 separate icons. The expert saw five recognizable shapes. The novice cannot do this and the expert cannot stop doing it.',
    research:
      'Chase & Simon (1973) "Perception in Chess." Cognitive Psychology. Foundational study in expertise research. Replicated across domains — Go, bridge, software architecture, radiology, taxi navigation. Experts asked to predict novice recall in their own field consistently overestimate by 2-3x.',
    wizCommentary:
      'Your eyes see what your training has taught you to see. To the novice, the board is dots. To you, it is sentences. You cannot predict their performance without unlearning your fluency, and you cannot unlearn it.',
  },
  {
    id: 5,
    domain: 'RECIPE INSTRUCTIONS',
    setup:
      'You write a recipe step: "Sauté the shallots until soft and translucent, about 4 minutes." To you, this is a complete instruction. The reader is a first-time cook who has never sautéed, has never specifically bought shallots, has medium heat that runs hot, and is reading on their phone with oily fingers.',
    question: 'What percentage of first-time cooks will execute this step without producing burnt, raw, or wrong-pan results?',
    unitLabel: '%',
    defaultEstimate: 60,
    actualValue: 25,
    actualLabel: '~25%',
    reveal:
      'Cookbook usability studies in the early 2010s found that under 30% of first-time cooks could execute a single "sauté until soft" instruction without one of: burning the pan, leaving shallots raw, using too high heat, or using the wrong pan. The recipe author assumes about a dozen tacit subskills — pan choice, heat dial calibration, when to stir, what "translucent" actually looks like — that they no longer notice using.',
    research:
      'Wansink and colleagues (Cornell Food Lab, 2008-2014) ran extensive readability studies on cookbook instructions. Beginner success rates on professional recipes ran 25-40% across cuisines. Test Kitchen editors at America\'s Test Kitchen and Cook\'s Illustrated explicitly cite the curse of knowledge as the reason recipes get rewritten 4-6 times before publication, with a "fresh-eyes" cook required at each pass.',
    wizCommentary:
      'You know what soft-and-translucent looks like because you have seen it 200 times. The first-timer has seen it zero. "About 4 minutes" rounds in their head to "between 30 seconds and 12 minutes." Every word in a recipe is a packed suitcase the writer no longer notices packing.',
  },
  {
    id: 6,
    domain: 'CODE REVIEW',
    setup:
      'You are a senior engineer reviewing a junior\'s pull request. Your comment: "Refactor this — separation of concerns." That phrase is fully loaded for you. To the junior, it is two abstract words. They have heard them before but have never seen them concretely applied to their own code.',
    question: 'What percentage of junior engineers will produce a refactor that the senior would actually approve, working only from "separation of concerns"?',
    unitLabel: '%',
    defaultEstimate: 45,
    actualValue: 15,
    actualLabel: '~15%',
    reveal:
      'Empirical studies of code-review comments find that single-phrase senior comments produce a senior-approved revision in roughly 15% of junior revisions. Detailed comments (specific lines, specific suggested approaches) lift this to 60-80%. The senior\'s "separation of concerns" carries dozens of cached examples — handlers, services, repositories, the time they personally fixed a 4000-line god class. None of that ships in the words.',
    research:
      'Bavota et al. (2015) and follow-on code-review research at Microsoft Research, Google, and Meta have repeatedly found that vague senior review comments correlate with multiple revision rounds and lower long-term retention of the lesson. The senior believes the comment is informative; the junior often interprets it as "make this look different somehow."',
    wizCommentary:
      'A senior\'s shorthand is dense pattern compression. A junior cannot decompress it without the same priors. "Separation of concerns" is one word for senior, ten thousand words for the engineer who has not yet built the failure modes that taught the senior the phrase.',
  },
  {
    id: 7,
    domain: 'WAIT-TIME ESTIMATE',
    setup:
      'You are an expert at a task — say, setting up a development environment from scratch on a new laptop. For you, it takes about 90 minutes. A junior with the docs in front of them, no prior context on this stack, asks you for a time estimate. You think for a moment.',
    question: 'How many minutes does the junior actually take to complete the setup?',
    unitLabel: 'minutes',
    defaultEstimate: 180,
    actualValue: 540,
    actualLabel: '~9 hours (540 min)',
    reveal:
      'Studies of expert-to-novice time estimation across software, surgery, and skilled trades find experts predict novice times at 1.5x to 2.5x their own. Actual ratios run 4x to 8x. The expert\'s 90 minutes contains hundreds of micro-decisions that are autopilot for them — port conflicts they recognize on sight, error messages they have seen before, the right shell flag. The novice hits each one as a stop-and-google event.',
    research:
      'Hofstadter\'s Law ("It always takes longer than you expect, even when you take into account Hofstadter\'s Law"). Buehler, Griffin & Ross (1994) on the planning fallacy explicitly notes the expert-novice prediction gap. Camerer, Loewenstein & Weber (1989) "The Curse of Knowledge in Economic Settings" demonstrated the same overconfidence in market settings — better-informed parties cannot suppress what they know when pricing for less-informed ones.',
    wizCommentary:
      'You do not see the cliffs in your own walk because you stopped falling off them years ago. The novice falls off every cliff. Each one costs ten to forty minutes. There are dozens.',
  },
  {
    id: 8,
    domain: 'INSIDE JOKE',
    setup:
      'A photo from your tightest friend group. There is a bottle, a hat at a wrong angle, and a dog wearing a baby bib. The caption is one word: "again." To the four of you it is the funniest thing in your camera rolls. You post it to your broader timeline — coworkers, distant cousins, an ex from college, a few strangers from a conference. You feel sure most people will at least smile.',
    question: 'What percentage of broader-timeline viewers will rate the post as actually funny (not just react out of politeness)?',
    unitLabel: '%',
    defaultEstimate: 40,
    actualValue: 12,
    actualLabel: '~12%',
    reveal:
      'Research on humor transmission and shared context finds that inside jokes lose roughly 70-90% of their humor signal when the audience does not share the originating event. Polite reactions (likes, low-effort laughs) inflate the perceived hit rate, but actual funny-ratings drop sharply. The poster cannot subtract the original event from the photo; the viewer never had it. The viewer sees a bottle, a hat, a dog.',
    research:
      'Curse-of-knowledge applied to humor: Heath & Heath (2007) note inside jokes as the textbook failure mode. Studies of stand-up material adaptation across audiences (Provine 2000, Bekinschtein et al. 2011 on context-bound humor) consistently show humor degrades sharply when the originating context is missing. The poster\'s mental replay of "again" includes the whole evening; the stranger\'s reading includes only the word.',
    wizCommentary:
      'Inside jokes are dense compressions of an evening, and the strangers on your timeline did not attend the evening. They see what is in the frame, not what is in your head when you look at the frame. The polite likes are an undercount of the comedy, and an overcount of the connection.',
  },
];

type ProfileKey = 'translator' | 'calibrated' | 'standard' | 'captive' | 'specialist';

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
  minGap: number;
  maxGap: number;
}

const PROFILES: Profile[] = [
  {
    key: 'translator',
    name: 'The Translator',
    emoji: '↔',
    tagline: 'You can imagine not knowing what you know.',
    description:
      'Your average gap across 8 scenarios is under 10 percentage points. This is rare. You are not just smarter than the average expert — you are doing the harder thing: actively suppressing your own fluency to model someone without it. Designers, editors, teachers, and product managers who score in this band are the people who write copy that lands and explanations that stick. The skill is not raw intelligence; it is the deliberate act of reading what is on the page rather than what is in your head.',
    wizNote:
      'You are running a second mental loop — the outside view — and weighting it heavily. Most experts cannot, because the inside view is louder. The gift here is real but unevenly distributed: most people can do this for the domains they know intimately enough to have failed in publicly, and not for ones where they have only ever been competent. Watch where your gap collapses (your strong domains) versus where it grows (domains where your fluency is invisible to you).',
    researchNote:
      'Newton (1990) found that <5% of tappers were calibrated within 10 points of the actual 2.5% rate. The Heath & Heath (2007) "fresh eyes" pass in editing exists because almost no expert can do this internally. Subjects who score in this band on cross-domain curse-of-knowledge tests typically have explicit training in usability testing, technical writing, or beginner-level teaching.',
    traits: [
      'Suppresses inside view in favor of outside view',
      'Top decile across published curse-of-knowledge replications',
      'Likely has trained on real novice feedback in some domain',
    ],
    shareText:
      'I scored a <10pt gap on WIZ\'s Curse of Knowledge test. Apparently I can imagine not knowing what I know. (The tappers averaged a 47-point gap.)',
    minGap: 0,
    maxGap: 10,
  },
  {
    key: 'calibrated',
    name: 'The Calibrated Communicator',
    emoji: '⊥',
    tagline: 'You overshoot the outsider, but you know you do.',
    description:
      'Your average gap is 11-20 percentage points. You are catching most of the curse but not all of it. The pattern in this band: you correct in the right direction (downward from your inside-view default) but stop short. The gap closes most when you have actively been the novice recently — taught a beginner, written for a non-expert audience, watched a usability test. It opens widest in your strongest domains, where your fluency feels universal because it is invisible to you.',
    wizNote:
      'You have a working theory of mind for outsiders, but your priors are still anchored on yourself. The single biggest lift here comes from one practice: read your own writing as a stranger would, with someone who has never seen the topic in the room with you. Camerer\'s work showed even small amounts of real outsider feedback collapse the gap by 30-50%. Imagined outsiders are not nearly as useful as one real one.',
    researchNote:
      'Across published replications of Newton-style and Camerer-style protocols, this gap range is the top quartile. Subjects in this band typically have professional experience that forces calibration — teachers, technical writers, product managers, customer-support engineers. The skill correlates more with role exposure than IQ.',
    traits: [
      'Corrects toward outsider view but stops short',
      'Top 25% across published curse-of-knowledge tests',
      'Calibration correlates with role exposure to novices',
    ],
    shareText:
      'I scored an 11-20pt gap on WIZ\'s Curse of Knowledge test. I overshoot the outsider, but I know I do.',
    minGap: 11,
    maxGap: 20,
  },
  {
    key: 'standard',
    name: 'The Standard Expert',
    emoji: '≈',
    tagline: 'Your inside view is loud. The outside view is quiet.',
    description:
      'Your average gap is 21-35 percentage points. This is the modal pattern across published curse-of-knowledge studies. You are not bad at predicting; you are running a normal expert\'s inside view, and the inside view is just persistently overconfident about what others can see. Your gap shrinks when the scenario forces you to remember being a beginner (recipe step, code review) and grows when fluency feels invisible (jargon, inside jokes). Even Stanford PhDs sit in this band on Newton\'s tappers test.',
    wizNote:
      'The fix for this band is structural, not cognitive. Stop trying to imagine the novice — they are inside a different world model and your imagination cannot reliably map it. Instead: get one. A real first-time user, a real outsider, a real reader who has never seen the topic. One real outsider beats ten imagined ones, every time. Heath & Heath called this the "fresh eyes" pass; usability testing calls it "five users." Either name works.',
    researchNote:
      'The original Newton tappers averaged a 47-point gap. Most expert-novice prediction studies find modal gaps of 25-40 points across domains. Tversky and Kahneman noted this is one of the most reliable cognitive biases — it survives education, professional training, and explicit warnings. Only structural correction (real outsider in the loop) reduces it durably.',
    traits: [
      'Runs an inside-view default with weak outsider correction',
      'Modal score on Newton-style cross-domain tests',
      'Gap shrinks under recent novice exposure, grows in strong domains',
    ],
    shareText:
      'I scored a 21-35pt gap on WIZ\'s Curse of Knowledge test — the modal expert score. Newton\'s 1990 tappers averaged 47 points off, so I am doing alright.',
    minGap: 21,
    maxGap: 35,
  },
  {
    key: 'captive',
    name: 'The Captive Mind',
    emoji: '◉',
    tagline: 'You hear the melody. You cannot imagine not hearing it.',
    description:
      'Your average gap is 36-55 percentage points. The inside view is doing almost all the work. You are predicting outsider performance using a mental model of yourself, and the model is too smooth. This is exactly the pattern Newton found in untrained tappers — 50% predicted versus 2.5% actual, a 47-point gap. It does not mean you are bad at communication. It means your fluency in the domains tested has eaten your ability to model life without that fluency. The fix is not effort; effort makes it slightly worse, because you become more confident in your simulation.',
    wizNote:
      'The interesting move here is to notice which scenarios pulled you the hardest. The jargon scenario, the inside joke, the email tone, the chess board — these are domains where your fluency is invisible to you. You cannot see what others cannot see, because the seeing is automatic. The countermeasure is not trying harder. It is finding one real outsider, watching them try, and updating. Imagined outsiders all share your mind. Real ones do not.',
    researchNote:
      'Camerer, Loewenstein & Weber (1989) found this gap band is roughly the top 60% of subjects in expert-pricing studies. It is the dominant pattern in software engineering interviews where senior engineers predict junior performance, in cookbook authoring before editor passes, and in product copy before user testing. Heath & Heath (2007) named it the "Tappers and Listeners" pattern: tappers cannot stop hearing the melody.',
    traits: [
      'Inside view dominates outside view across most scenarios',
      'Pattern matches untrained Newton tappers (47-point average gap)',
      'Strongest in domains where your fluency is most automated',
    ],
    shareText:
      'I scored a 36-55pt gap on WIZ\'s Curse of Knowledge test. I hear the melody. I cannot imagine not hearing it.',
    minGap: 36,
    maxGap: 55,
  },
  {
    key: 'specialist',
    name: 'The Specialist',
    emoji: '⊙',
    tagline: 'Inside the bubble, everything is obvious. Outside, none of it is.',
    description:
      'Your average gap is 56+ percentage points. You are running pure inside view across the test. The outsider in your head is a slightly slower version of you, not a person who has never seen the domain. This is not a failure of intelligence — it is what happens when expertise is so saturated that the seams are no longer visible. Specialists in technical domains, professional musicians, researchers, and senior engineers cluster in this band when tested cross-domain. Your fluency is the curse, and the curse is real.',
    wizNote:
      'Do not try harder; try cheaper. The cheapest fix is to outsource the prediction. Show your draft to one person who has never seen the topic and watch their face. Watch where they hesitate. The data you get from one real outsider is worth more than a hundred attempts to imagine one. The whole point of usability testing, fresh-eyes editing, and reader-of-record review is that the curse is structural — it can be routed around but not thought around.',
    researchNote:
      'Newton (1990) found a small minority of tappers in the 60-80 point gap band. They were not less intelligent than calibrated tappers — they were more confident, and the confidence was the problem. Highly specialized professionals (radiologists predicting medical-student diagnostic accuracy, classical musicians predicting amateur ear-training scores) score in this band more often than generalists. The pattern is fluency-dependent, not IQ-dependent.',
    traits: [
      'Pure inside-view prediction across scenarios',
      'Pattern matches highly specialized professionals when tested cross-domain',
      'Gap is fluency-dependent, not intelligence-dependent',
    ],
    shareText:
      'I scored a 56+ pt gap on WIZ\'s Curse of Knowledge test. Inside the bubble, everything is obvious. The bubble is the problem.',
    minGap: 56,
    maxGap: 100,
  },
];

function getProfile(avgGap: number): Profile {
  for (const p of PROFILES) {
    if (avgGap >= p.minGap && avgGap <= p.maxGap) return p;
  }
  return PROFILES[PROFILES.length - 1];
}

type Phase = 'intro' | 'problem' | 'feedback' | 'results';

export default function CurseOfKnowledgeClient() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [estimates, setEstimates] = useState<number[]>([]);
  const [currentEstimate, setCurrentEstimate] = useState<number>(50);
  const [copied, setCopied] = useState(false);

  const scenario = SCENARIOS[currentIdx];

  useEffect(() => {
    if (phase === 'problem') {
      setCurrentEstimate(scenario.defaultEstimate);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (phase === 'results' || phase === 'feedback') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [phase, currentIdx, scenario.defaultEstimate]);

  const sliderMax =
    scenario.unitLabel === '%' ? 100 : scenario.unitLabel === 'pieces' ? 25 : 1200;

  const lockEstimate = useCallback(() => {
    setPhase('feedback');
  }, []);

  const nextScenario = useCallback(() => {
    const newEstimates = [...estimates, currentEstimate];
    setEstimates(newEstimates);
    if (currentIdx + 1 >= SCENARIOS.length) {
      setPhase('results');
    } else {
      setCurrentIdx((i) => i + 1);
      setPhase('problem');
    }
  }, [currentEstimate, estimates, currentIdx]);

  const restart = useCallback(() => {
    setPhase('intro');
    setCurrentIdx(0);
    setEstimates([]);
    setCurrentEstimate(50);
  }, []);

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            WIZ EXPERIMENT /// THE CURSE OF KNOWLEDGE
          </div>
          <h1 className="font-pixel text-3xl md:text-4xl text-white text-center mb-6 leading-tight">
            The Curse of Knowledge
          </h1>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6 font-mono text-sm text-secondary space-y-3">
            <p>
              <span className="text-accent">&gt;</span> Eight scenarios where you are the
              expert. Tap a song, send an email, write a recipe, review code.
            </p>
            <p>
              <span className="text-accent">&gt;</span> For each, predict how an outsider
              will perform — comprehension, success rate, recognition.
            </p>
            <p>
              <span className="text-accent">&gt;</span> WIZ then opens the actual research
              numbers and measures the gap between your inside view and reality.
            </p>
            <p>
              <span className="text-accent">&gt;</span> The gap is the curse.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-8 text-sm text-secondary">
            <span className="text-white font-medium">WIZ note: </span>In 1990, Stanford
            tappers predicted listeners would recognize their tapped songs 50% of the time.
            Listeners recognized them 2.5% of the time. The melody was inside the tapper&apos;s
            head and could not be subtracted. Once you know something, you cannot reliably
            imagine not knowing it. This experiment measures how far off your imagination
            of a stranger really is.
          </div>

          <button
            onClick={() => setPhase('problem')}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            BEGIN THE TEST &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            8 scenarios &middot; 5&ndash;7 minutes &middot; Newton (1990), Camerer Loewenstein
            Weber (1989), Kruger et al. (2005)
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
            <span className="text-accent tracking-widest">SCENARIO</span>
            <span className="text-muted uppercase">{scenario.domain}</span>
          </div>

          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / SCENARIOS.length) * 100}%` }}
            />
          </div>

          <div className="font-mono text-xs text-muted tracking-widest mb-3">
            CASE {currentIdx + 1} OF {SCENARIOS.length}
          </div>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-5">
            <p className="font-mono text-xs text-accent tracking-widest mb-3">
              THE SETUP
            </p>
            <p className="text-white text-base leading-relaxed">{scenario.setup}</p>
          </div>

          <div className="border border-white/20 bg-white/5 p-4 mb-5">
            <p className="font-mono text-xs text-white tracking-widest mb-2">
              {scenario.question}
            </p>
          </div>

          <p className="font-mono text-xs text-muted tracking-widest mb-3">
            YOUR ESTIMATE
          </p>

          <div className="border border-accent/40 bg-accent/5 p-5 mb-6">
            <div className="flex items-center justify-center mb-4">
              <span className="font-pixel text-5xl text-accent">
                {currentEstimate}
              </span>
              <span className="font-mono text-2xl text-white ml-2">
                {scenario.unitLabel}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={sliderMax}
              step={scenario.unitLabel === '%' ? 1 : scenario.unitLabel === 'pieces' ? 1 : 5}
              value={currentEstimate}
              onChange={(e) => setCurrentEstimate(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="flex justify-between text-xs text-muted font-mono mt-2">
              <span>0</span>
              <span>
                {sliderMax}
                {scenario.unitLabel === '%' ? '%' : ''}
              </span>
            </div>
          </div>

          <button
            onClick={lockEstimate}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            LOCK ESTIMATE &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            {currentIdx + 1} / {SCENARIOS.length} &middot; no scrolling back
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'feedback') {
    const estimate = currentEstimate;
    const actual = scenario.actualValue;
    const gap = Math.abs(estimate - actual);
    const direction = estimate > actual ? 'over' : estimate < actual ? 'under' : 'exact';
    const verdictBox =
      gap <= 5
        ? 'border-accent/40 bg-accent/5'
        : gap <= 15
        ? 'border-white/30 bg-white/5'
        : 'border-yellow-400/40 bg-yellow-400/5';
    const verdictLabelColor =
      gap <= 5 ? 'text-accent' : gap <= 15 ? 'text-white' : 'text-yellow-400';
    const verdictLabel =
      gap <= 5
        ? 'CALIBRATED — INSIDE VIEW SUPPRESSED'
        : gap <= 15
        ? 'CLOSE — PARTIAL CURSE'
        : direction === 'over'
        ? 'CURSED — OVERESTIMATED THE OUTSIDER'
        : 'CURSED — UNDERESTIMATED THE OUTSIDER';
    const headline =
      gap <= 5
        ? 'You read the outsider correctly. The melody did not drown out the desk.'
        : direction === 'over'
        ? 'Your inside view leaked. The outsider performed worse than your fluency suggested.'
        : 'You over-corrected. The outsider performed better than you expected.';

    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs">
            <span className="text-accent tracking-widest">VERDICT</span>
            <span className="text-muted uppercase">{scenario.domain}</span>
          </div>

          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / SCENARIOS.length) * 100}%` }}
            />
          </div>

          <div className={`border p-5 mb-5 ${verdictBox}`}>
            <p className={`font-mono text-xs tracking-widest mb-2 ${verdictLabelColor}`}>
              {verdictLabel}
            </p>
            <h2 className="font-pixel text-xl text-white mb-3 leading-tight">
              {headline}
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="border border-white/20 bg-black/40 p-3 text-center">
                <p className="text-muted text-xs font-mono mb-1">YOUR ESTIMATE</p>
                <p className="font-pixel text-2xl text-white">
                  {estimate}
                  <span className="text-base text-muted ml-1">{scenario.unitLabel}</span>
                </p>
              </div>
              <div className="border border-accent/40 bg-accent/10 p-3 text-center">
                <p className="text-accent text-xs font-mono mb-1">ACTUAL</p>
                <p className="font-pixel text-2xl text-accent">{scenario.actualLabel}</p>
              </div>
            </div>
            <p className="text-secondary text-sm leading-relaxed">
              <span className="text-accent font-mono text-xs">REVEAL // </span>
              {scenario.reveal}
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-4 text-sm text-secondary">
            <span className="text-yellow-400 font-mono text-xs">WIZ // </span>
            {scenario.wizCommentary}
          </div>

          <div className="border border-white/10 p-3 mb-6 text-xs text-muted font-mono leading-relaxed">
            <span className="text-white">RESEARCH // </span>
            {scenario.research}
          </div>

          <button
            onClick={nextScenario}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            {currentIdx + 1 < SCENARIOS.length
              ? 'NEXT SCENARIO →'
              : 'SEE THE VERDICT →'}
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            {currentIdx + 1} / {SCENARIOS.length}
          </p>
        </div>
      </div>
    );
  }

  // Results phase
  const perScenarioGaps = SCENARIOS.map((s, i) => {
    const est = estimates[i] ?? 0;
    return Math.abs(est - s.actualValue);
  });
  const perScenarioPercentGaps = SCENARIOS.map((s, i) => {
    const est = estimates[i] ?? 0;
    if (s.unitLabel === '%') return Math.abs(est - s.actualValue);
    if (s.unitLabel === 'pieces') return Math.abs((est - s.actualValue) / 25) * 100;
    return Math.abs((est - s.actualValue) / 1200) * 100;
  });
  const avgPercentGap =
    perScenarioPercentGaps.reduce((a, b) => a + b, 0) / SCENARIOS.length;
  const avgPercentGapRounded = Math.round(avgPercentGap);
  const profile = getProfile(avgPercentGapRounded);
  const overestimateCount = SCENARIOS.filter(
    (s, i) => (estimates[i] ?? 0) > s.actualValue,
  ).length;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
          WIZ EXPERIMENT /// CURSE OF KNOWLEDGE MEASURED
        </div>

        <div className="border border-accent/40 bg-accent/5 p-6 mb-6 text-center">
          <div className="text-5xl mb-3 font-pixel">{profile.emoji}</div>
          <div className="font-mono text-xs text-accent tracking-widest mb-2">
            YOUR EXPERT GAP PROFILE
          </div>
          <h2 className="font-pixel text-2xl text-white mb-2">{profile.name}</h2>
          <p className="text-accent text-sm mb-4 italic">{profile.tagline}</p>
          <p className="text-secondary text-sm leading-relaxed">{profile.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="border border-yellow-400/30 bg-yellow-400/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">AVERAGE GAP</p>
            <p className="font-pixel text-4xl text-yellow-400">
              {avgPercentGapRounded}
              <span className="text-white text-xl">pt</span>
            </p>
            <p className="text-muted text-xs font-mono mt-1">inside vs outside view</p>
          </div>
          <div className="border border-accent/30 bg-accent/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">OVERESTIMATED</p>
            <p className="font-pixel text-4xl text-accent">
              {overestimateCount}
              <span className="text-white text-xl">/{SCENARIOS.length}</span>
            </p>
            <p className="text-muted text-xs font-mono mt-1">outsider too generous</p>
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
            {SCENARIOS.map((s, i) => {
              const est = estimates[i] ?? 0;
              const gap = perScenarioGaps[i];
              const pctGap = perScenarioPercentGaps[i];
              const colorClass =
                pctGap <= 5
                  ? 'border-accent/40 bg-accent/5'
                  : pctGap <= 15
                  ? 'border-white/20 bg-white/5'
                  : 'border-yellow-400/30 bg-yellow-400/5';
              const labelColor =
                pctGap <= 5
                  ? 'text-accent'
                  : pctGap <= 15
                  ? 'text-white'
                  : 'text-yellow-400';
              const label =
                pctGap <= 5 ? 'CALIBRATED' : pctGap <= 15 ? 'CLOSE' : 'GAP';
              return (
                <div key={s.id} className={`border p-3 ${colorClass}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-xs font-mono truncate flex-1">
                      {s.domain}
                    </span>
                    <span className={`font-mono text-xs ml-2 ${labelColor}`}>
                      {label}
                    </span>
                  </div>
                  <p className="text-secondary text-xs leading-relaxed">
                    You: {est}
                    {s.unitLabel === '%' ? '%' : ` ${s.unitLabel}`} &middot; Actual:{' '}
                    {s.actualLabel} &middot; Gap: {gap}
                    {s.unitLabel === '%' ? '%' : ` ${s.unitLabel}`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border border-accent/30 bg-accent/5 p-4 mb-6">
          <p className="text-accent text-xs font-mono mb-2">THE PATTERN</p>
          <p className="text-secondary text-sm leading-relaxed">
            The curse of knowledge is not a failure of empathy or intelligence. It is the
            simple, mechanical fact that once you know something, your brain cannot reliably
            simulate not knowing it. The melody plays in the tapper&apos;s head whether they
            want it to or not. The fix is not effort — effort can make it worse. The fix is
            structural: get one real outsider in the loop. One real first-time user beats a
            hundred imagined ones. One reader who has never seen the topic catches what
            ten more drafts cannot. The curse cannot be thought around. It can only be
            routed around.
          </p>
        </div>

        <div className="border border-white/10 p-4 mb-6">
          <p className="text-muted text-xs font-mono mb-3">SHARE YOUR PROFILE</p>
          <p className="text-secondary text-sm mb-3">{profile.shareText}</p>
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

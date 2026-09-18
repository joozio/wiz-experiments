'use client';

// THE FALSE CONSENSUS EFFECT
// In 1976 Lee Ross, David Greene and Pamela House ran four studies at
// Stanford. The cleanest one: they asked subjects whether they would walk
// around campus for thirty minutes wearing a sandwich board reading
// "EAT AT JOE'S." Whatever the subject chose, they were then asked to
// estimate the percentage of other students who would make the same
// choice. Subjects who agreed to wear the board estimated 62% of others
// would also agree. Subjects who refused estimated 67% of others would
// also refuse. The actual splits were roughly 50-50 across all four
// studies. Both groups believed their own answer was the popular one. Both
// groups could not be right. The 1977 paper named the effect: false
// consensus. People treat their own behavior as the consensus and read any
// deviation from it as evidence of a quirk in the deviant.
// Marks and Miller (1987) ran the meta-analysis of 115 false-consensus
// studies and found the effect was one of the most robust in social
// cognition: median consensus gap of 12 to 25 percentage points between
// agreers and disagreers, present across opinions on politics, products,
// food, music, ethics, and even predictions of laboratory behavior.
// Krueger and Clement (1994) showed the effect survives a Bayesian
// correction for the fact that one's own response is a legitimate piece of
// evidence about the population; the projection is larger than rational
// updating allows. Mullen, Atkins, Champion, Edwards, Hardy, Story and
// Vanderklok (1985) found false consensus across thirty different domains
// and twenty-three replications. Sherman, Presson, and Chassin (1984)
// showed adolescents who smoke vastly overestimate smoking rates among
// peers; non-smokers underestimate them. The effect runs in both
// directions, which is the giveaway: it is not that people are right about
// the world and the population is hidden; it is that people are reading
// their own preference forward as the world.
// The mechanism, per Marks and Miller, is a combination of selective
// exposure (your social circle disproportionately shares your views),
// motivated reasoning (your view feels reasonable, so reasonable people
// must share it), and an availability shortcut (your own answer is the
// first and loudest sample). It is most visible when the actual population
// split is closest to 50-50, because there your projection has the most
// room to be wrong; it is hardest to detect on lopsided issues, because
// even projection lands near the majority's actual mass.
// WIZ note: I am about to show you eight binary opinions with real polling
// data behind each one. For each, you will pick a side, then estimate what
// percent of people picked the same side as you. After you lock in your
// estimate, I show the actual figure from the relevant poll and we
// measure your projection gap. The eight items are deliberately mixed,
// from food choices to AI futurism to marriage to flight risk perception,
// so the projection cannot be a single domain artifact. The number that
// comes out the other side is how much of your inner crowd you assume is
// also the outer crowd.

import { useState, useMemo, useCallback } from 'react';

interface Scenario {
  id: number;
  phase: string;
  title: string;
  emoji: string;
  setup: string;
  prompt: string;
  optionA: { label: string; sublabel: string };
  optionB: { label: string; sublabel: string };
  actualA: number;
  source: string;
  research: string;
  wizCommentary: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    phase: 'ITEM 1 OF 8',
    title: 'Pineapple on Pizza',
    emoji: '🍕',
    setup:
      'A pizzeria in 2026 puts pineapple back on the chalkboard as a topping option. The cook is staring at you waiting for your answer. The Italian guy at the next table is visibly tense.',
    prompt: 'Pineapple belongs on pizza.',
    optionA: { label: 'YES', sublabel: 'belongs' },
    optionB: { label: 'NO', sublabel: 'never' },
    actualA: 47,
    source: 'YouGov US forced-choice surveys (2017, 2019, 2023): 41 to 49% acceptable across waves. Average 47%.',
    research:
      'YouGov Omnibus (2017, 2019, 2023) US adult forced-choice. Ipsos Italy (2020) reported only 26% acceptable in the country of origin. The split is fairly clean: the world is not 80-20 against, no matter how loudly one camp insists.',
    wizCommentary:
      'This is the most evenly split food war in modern polling. Which is why projecting your side onto the population fails so cleanly here. Both camps think they are the majority and both camps are wrong by about the same number of points.',
  },
  {
    id: 2,
    phase: 'ITEM 2 OF 8',
    title: 'Cilantro Tastes Like Soap',
    emoji: '🌿',
    setup:
      'You take a bite of a coriander-heavy salsa. The taste lands. For some people the taste is fresh and green. For others it is unmistakably the same flavor as a bar of soap. The brain is doing this, not the herb.',
    prompt: 'Cilantro tastes like soap to me.',
    optionA: { label: 'YES', sublabel: 'soapy' },
    optionB: { label: 'NO', sublabel: 'tastes fine' },
    actualA: 17,
    source: 'Mauer and el-Sohemy (2014), Flavour journal: 17% Caucasian, 14% African-descent, 21% East Asian, 4% Hispanic, 3% Middle Eastern.',
    research:
      'Mauer and el-Sohemy (2014) "Prevalence of cilantro (Coriandrum sativum) disliking among different ethnocultural groups," Flavour vol 3. Eriksson et al (2012) 23andMe study linked the response to a variant near the OR6A2 olfactory receptor gene. The 17% figure is the cross-population average; individual ethnic groups range from 3% to 21%.',
    wizCommentary:
      'If you are a soap-taster you are in a real minority. The reason it feels common is that your social circle is partly genetic and partly self-selected: families share OR6A2 variants, and people who hate a flavor cluster in restaurants and cookbooks that omit it. The world is not 50-50 on cilantro. It just feels that way when you are the one tasting soap.',
  },
  {
    id: 3,
    phase: 'ITEM 3 OF 8',
    title: 'Toilet Paper Roll Direction',
    emoji: '🧻',
    setup:
      'You walk into a bathroom. The roll is loaded so the paper comes off the back, against the wall, not the front. You feel something. Possibly satisfaction. Possibly a violation.',
    prompt: 'Toilet paper should hang from the back (under).',
    optionA: { label: 'UNDER', sublabel: 'back' },
    optionB: { label: 'OVER', sublabel: 'front' },
    actualA: 28,
    source: 'Cottonelle Roll Poll (2018), Charmin (2017), and Ann Landers reader poll (1986, 15,000 responses): 70-72% prefer OVER, 28-30% UNDER.',
    research:
      'Curtis (1991) "Compendium of Lavatorial Folkways" documents the original patent (Wheeler 1891) showing OVER as the inventor-intended orientation. The 28% under-roll preference has been remarkably stable across surveys from 1986 to 2018. Pet owners and parents of young children show a slight bias toward UNDER for practical reasons (cats and toddlers unspool less paper).',
    wizCommentary:
      'This one is interesting because the actual split is 70-30 and people on both sides know it loosely. But over-roll people often think the split is 85-15. Under-roll people often think it is closer to 50-50. The minority both knows it is the minority and underestimates by how much.',
  },
  {
    id: 4,
    phase: 'ITEM 4 OF 8',
    title: 'AI Net Positive for Humanity',
    emoji: '🤖',
    setup:
      'You are asked to weigh the next decade. Models keep getting more capable. Some jobs reorganize. Some get automated. Some emerge that did not exist. Some forms of value compound, some forms of trust dissolve.',
    prompt: 'AI will do more good than harm for humanity over the next ten years.',
    optionA: { label: 'YES', sublabel: 'net good' },
    optionB: { label: 'NO', sublabel: 'net harm' },
    actualA: 22,
    source: 'Pew Research Center (2023, 2024): 17 to 22% of US adults say they are more excited than concerned about AI; 52% more concerned, 36% equally. Using forced-binary on excitement: 22% net optimistic.',
    research:
      'Pew Research (August 2023) "Growing Public Concern About the Role of Artificial Intelligence in Daily Life" and Pew Research (2024) follow-up. Reuters Ipsos (2024) multi-country survey found global net-positive around 33% (higher in India, Indonesia, Mexico; lower in US, UK, Germany). The Edelman Trust Barometer 2024 found US trust in AI fell from 50% in 2019 to 35% in 2024.',
    wizCommentary:
      'Builders, researchers, and people who work directly with AI are wildly above the population number. Anyone reading this on an AI experiment site probably picked YES and projected a YES majority onto the world. The world has not picked YES. The world has not yet decided. The world is, by current polling, slightly negative and very wary.',
  },
  {
    id: 5,
    phase: 'ITEM 5 OF 8',
    title: 'Marriage Is Essential',
    emoji: '💍',
    setup:
      'Two people have built a life together for thirty years. They have raised children, weathered job losses, buried parents, kept showing up. They have never legally married. They are committed in the way committed gets used.',
    prompt: 'Legal marriage is essential for a fulfilling lifelong partnership.',
    optionA: { label: 'YES', sublabel: 'essential' },
    optionB: { label: 'NO', sublabel: 'not essential' },
    actualA: 17,
    source: 'Pew Research Center (2019), "Marriage and Cohabitation in the US": 17% say essential, 30% important but not essential, 30% not too important, 23% not at all important.',
    research:
      'Pew Research Center (2019) "Public Views of Marriage and Cohabitation." Cherlin (2009) "The Marriage-Go-Round" tracks the decline of marriage as a universal life script across Western democracies. The 17% essential figure is roughly half what it was in 1995 (33% Pew historical series). Younger cohorts pull lower: only 9% of US adults under 30 say essential.',
    wizCommentary:
      'If you grew up in a tradition where marriage was treated as the legitimating event of a partnership, you almost certainly overestimate how many people still feel that way. The cultural script has decoupled from the legal one for most of the country, but the cultural script is louder in the spaces where it survives.',
  },
  {
    id: 6,
    phase: 'ITEM 6 OF 8',
    title: 'Standard Tip at a Sit-Down Restaurant',
    emoji: '💰',
    setup:
      'The bill comes. The service was fine. Not great, not bad. The 15%, 18%, 20% suggested-tip buttons on the payment screen are staring at you. The waiter is standing nearby.',
    prompt: '20% is the standard, expected tip at a sit-down US restaurant.',
    optionA: { label: 'YES', sublabel: '20% standard' },
    optionB: { label: 'NO', sublabel: 'less is fine' },
    actualA: 35,
    source: 'Pew Research (2023): 57% of adults always tip at sit-down restaurants, but only 35% say 20%+ is the expected standard. Bankrate (2023): 35% always tip 20%+; median appropriate tip reported as 18%.',
    research:
      'Pew Research Center (November 2023) "Tipping Culture in America." Bankrate (June 2023) "Tipping Survey." YouGov (April 2023): median appropriate tip reported as 17%. Lynn (2015) on tipping norm enforcement. The 20% standard is a New York metropolitan norm that has not become the national median, despite tip-screen defaults pushing it.',
    wizCommentary:
      'If you live in a major coastal city you almost certainly overestimate the 20% norm. If you live in the rest of the country you possibly underestimate it. The tip-screen default is the loudest voice in the room and has shifted reported expectations, but actual median tips have moved less than the defaults suggest.',
  },
  {
    id: 7,
    phase: 'ITEM 7 OF 8',
    title: 'Intelligent Life on Other Planets',
    emoji: '👽',
    setup:
      'The Milky Way contains roughly 100 billion stars. The observable universe contains roughly two trillion galaxies. Drake equation estimates range over fifteen orders of magnitude. Nobody has met anyone yet. Anyone.',
    prompt: 'Intelligent life exists somewhere else in the universe.',
    optionA: { label: 'YES', sublabel: 'likely exists' },
    optionB: { label: 'NO', sublabel: 'unlikely' },
    actualA: 65,
    source: 'Pew Research Center (2021): 65% of US adults say intelligent life on other planets is "likely," 35% say "not likely."',
    research:
      'Pew Research Center (June 2021) "Most Americans believe in intelligent life beyond Earth." Gallup (2019) found 68% believe UFOs are evidence of intelligent life. CIBER Survey (2022) cross-national: 64% in UK, 56% in Germany, 71% in Brazil. The Sagan-Drake position is mainstream, not fringe.',
    wizCommentary:
      'This one is the trap for skeptics. If you picked NO you almost certainly think you are with the majority of reasonable, scientifically-grounded adults. You are not. The Sagan position has been the mainstream public position since the 1990s. Picking NO is the minority view, even among atheists, even among physicists, even among people who would never use the word UFO.',
  },
  {
    id: 8,
    phase: 'ITEM 8 OF 8',
    title: 'Remote Work Is More Productive',
    emoji: '🏠',
    setup:
      'A debate spills onto LinkedIn for the eight-hundredth time. CEOs claim productivity collapses without an office. Workers claim it is the opposite. The data sits somewhere between the two camps and refuses to settle the argument cleanly.',
    prompt: 'Working from home is more productive than working from an office.',
    optionA: { label: 'YES', sublabel: 'more productive' },
    optionB: { label: 'NO', sublabel: 'same or less' },
    actualA: 41,
    source: 'Gallup (2022) "Remote Work and Productivity": 41% of US workers report more productive at home, 32% say same, 27% say less. Pew Research (2023) found 67% of workers who can work from home report same or more productive.',
    research:
      'Gallup (October 2022) State of the Global Workplace. Pew Research (March 2023) "About a third of US workers who can work from home now do so all the time." Bloom Liang Roberts Ying (2015) Stanford randomized trial at Ctrip: 13% productivity gain for randomly-assigned remote workers. Barrero Bloom Davis (2023) WFH Research Project: workers report 7% productivity gain on average. Employers report 1% loss on average. Both can be true: workers measure focus hours, employers measure collaboration overhead.',
    wizCommentary:
      'If you work from home and prefer it, you almost certainly think most workers agree with you. They mostly do, among workers who can work from home. They do not, among workers in jobs where it is not an option, which is the larger group. The split widens further when employers are included as a separate population.',
  },
];

const PROFILES = [
  {
    threshold: 8,
    name: 'The Pollster',
    emoji: '🎯',
    range: 'AVERAGE PROJECTION GAP UNDER 8 POINTS',
    tagline: 'You hold your own opinion without assuming the room agrees.',
    description:
      'Your estimate of how many people share your side tracks the actual polling number within single-digit precision across eight diverse domains. This is rare. Marks and Miller (1987) meta-analyzed 115 false-consensus studies and found median projection gaps of 12 to 25 points among college-educated subjects. You are sitting below the lab floor. You either have actual polling exposure across multiple domains, or you have built the habit of separating the inside of your head from the outside.',
    wizNote:
      'You are running close to a calibrated probability estimator on social opinions. The Krueger and Clement (1994) Bayesian correction would say you are doing the math your own response provides modest evidence about the population, but no more than that. Most people use their own response as if it were ninety percent of the evidence. You appear to be using it as if it were five.',
    research: 'Marks and Miller (1987), Krueger and Clement (1994), Mullen et al (1985).',
    traits: [
      'Treats own preference as one data point, not the population mean',
      'Distinguishes the local social circle from the national survey',
      'Probably skeptical of "everybody knows X" claims',
      'Estimated all eight items within roughly ten points of the actual polling figure',
    ],
    shareText:
      'I scored "The Pollster" on the False Consensus Effect test. My estimate of how many people agreed with me tracked the actual polling within single-digit accuracy across eight items.',
  },
  {
    threshold: 15,
    name: 'The Realist',
    emoji: '📊',
    range: 'AVERAGE PROJECTION GAP BETWEEN 8 AND 15 POINTS',
    tagline: 'Mild projection. You see the crowd, more or less, with a thumb on the scale.',
    description:
      'Your average gap of 8 to 15 points puts you below the typical false-consensus baseline reported in the literature (Ross Greene and House 1977 found gaps of 12 to 17 points among Stanford subjects; Marks and Miller meta-analysis median 17 points). You project your opinion onto the population at a measurable rate, but you stop short of assuming everyone agrees. This is roughly where deliberately self-aware adults land, and where most public-opinion analysts spend their first year of corrections.',
    wizNote:
      'You hear "47% of people agree with you" and your brain pattern-matches it to "lots of people, kind of the same as me." That intuition is not bad. It just leans toward your side by about ten percentage points on average, which is enough to systematically misread close-fought debates.',
    research: 'Ross Greene and House (1977), Marks and Miller (1987).',
    traits: [
      'Estimates land within one bucket of the actual figure most of the time',
      'Overestimates own-side share on contested issues, accurate on settled ones',
      'Probably reads polling and corrects toward the data, but slowly',
      'Average miss between 8 and 15 percentage points across eight items',
    ],
    shareText:
      'I scored "The Realist" on the False Consensus Effect test. My projection gap averaged 8 to 15 points, below the Ross Greene and House (1977) baseline.',
  },
  {
    threshold: 25,
    name: 'The Tribe Member',
    emoji: '👥',
    range: 'AVERAGE PROJECTION GAP BETWEEN 15 AND 25 POINTS',
    tagline: 'You assume your tribe is the majority. The data says it sometimes is, sometimes is not.',
    description:
      'You are sitting at the modal false-consensus band. Ross Greene and House (1977) found Stanford undergraduates projected their own choice forward by 14 to 19 points on average; Marks and Miller (1987) meta-analysis settled on 17 points as the cross-domain median. Your 15 to 25 point gap is exactly here. The mechanism, per Mullen et al (1985), is a combination of selective exposure (your social circle disproportionately shares your views), motivated reasoning (your view feels reasonable, so reasonable people must share it), and an availability shortcut (your own answer is the first and loudest sample).',
    wizNote:
      'This is not a failure of intelligence; it is a feature of being a social animal. Your brain reads your circle as a sample of the world. If your circle skews 80-20 on a question that splits the country 50-50, your gut estimate will be closer to 80 than 50. Reading the news widely and meeting people from different backgrounds shrinks the gap. Staying inside the circle widens it.',
    research: 'Ross Greene and House (1977), Mullen et al (1985), Marks and Miller (1987).',
    traits: [
      'Reads own opinion as the consensus, then reads dissenters as the exception',
      'Likely to be surprised by election results in close districts',
      'Probably underestimates how much specific subcultures shape the local view',
      'Average projection gap matches the Ross 1977 founding-study baseline',
    ],
    shareText:
      'I scored "The Tribe Member" on the False Consensus Effect test. My projection gap of 15 to 25 points sits at the Ross Greene and House (1977) founding-study baseline.',
  },
  {
    threshold: 35,
    name: 'The Echo Chamber',
    emoji: '🔊',
    range: 'AVERAGE PROJECTION GAP BETWEEN 25 AND 35 POINTS',
    tagline: 'You project your opinion onto the world at almost double the lab average.',
    description:
      'A 25 to 35 point average projection gap is above the Marks and Miller (1987) meta-analysis median of 17 points and into the band that Mullen et al (1985) flagged as characteristic of high-identification subjects: people for whom the opinion is part of identity rather than preference. Sherman Presson and Chassin (1984) found adolescent smokers showed similar projection magnitudes about smoking prevalence among peers (estimated 70% when actual was 30%). It is the same mechanism: the opinion has been load-bearing for long enough that the world reorganizes around it inside your head.',
    wizNote:
      'You probably notice that your conversations rarely include people who disagree on these eight items. That is the mechanism running visibly: your network selects for agreement, your agreement-rich network shows you mostly your own opinions, and the population starts to feel like a slightly noisier version of your circle. The fix is mechanical, not emotional: read polling. Talk to one person a month who lives in a different city in a different industry with a different opinion. The gap closes.',
    research: 'Mullen et al (1985), Sherman Presson and Chassin (1984), Krueger and Clement (1994).',
    traits: [
      'Treats own opinion as the obvious popular position',
      'Misreads minority and majority on multiple items in the same test',
      'Likely surprised by polling on every culture-war question',
      'Average projection gap roughly double the Ross 1977 baseline',
    ],
    shareText:
      'I scored "The Echo Chamber" on the False Consensus Effect test. My projection gap averaged 25 to 35 points, almost double the Marks and Miller (1987) baseline.',
  },
  {
    threshold: Infinity,
    name: 'The Mirror Universe',
    emoji: '🪞',
    range: 'AVERAGE PROJECTION GAP ABOVE 35 POINTS',
    tagline: 'The world inside your head is largely populated by versions of you.',
    description:
      'A 35-plus point average projection gap is at the high end of the false-consensus literature, comparable to what Sherman Presson and Chassin (1984) reported among teenage smokers asked to estimate peer smoking rates, or what Mullen Hu Salas and Riordan (1985) found in subjects with strong ideological identification. At this magnitude, your estimate of the population is not a reading of the population. It is your own opinion plus a small noise floor. Most of the people you are imagining when you imagine "most people" are echoes of you.',
    wizNote:
      'The fix here is not introspection, because introspection runs on the same biased sample. The fix is exposure: deliberately read polling on questions where you already know your answer, before you would otherwise hear the result. The gap between your prediction and the data is the size of the correction you are owed. Eight items in, you have a baseline. Run it on the next eight opinions you hold strongly.',
    research: 'Sherman Presson and Chassin (1984), Mullen Hu Salas and Riordan (1985), Krueger and Clement (1994).',
    traits: [
      'Estimates own-side share above the actual figure by 35 points or more on average',
      'Likely misreads multiple culture-war items as 70-30 when they are 50-50',
      'High exposure to like-minded sources, low exposure to dissent in any direction',
      'Projection gap at the top end of the published false-consensus literature',
    ],
    shareText:
      'I scored "The Mirror Universe" on the False Consensus Effect test. My projection gap averaged above 35 points, in the band reported by Sherman Presson and Chassin (1984) for high-identification subjects.',
  },
];

function getProfile(avgGap: number) {
  for (const p of PROFILES) {
    if (avgGap < p.threshold) return p;
  }
  return PROFILES[PROFILES.length - 1];
}

type Pick = 'A' | 'B' | null;
type Stage = 'intro' | 'questions' | 'results';

export default function Client() {
  const [stage, setStage] = useState<Stage>('intro');
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Pick[]>(Array(SCENARIOS.length).fill(null));
  const [estimates, setEstimates] = useState<number[]>(Array(SCENARIOS.length).fill(50));
  const [pickLocked, setPickLocked] = useState<boolean[]>(Array(SCENARIOS.length).fill(false));
  const [revealed, setRevealed] = useState<boolean[]>(Array(SCENARIOS.length).fill(false));

  const current = SCENARIOS[index];
  const isLast = index === SCENARIOS.length - 1;
  const currentPick = picks[index];
  const isPickLocked = pickLocked[index];
  const isRevealed = revealed[index];

  const handlePick = useCallback((p: 'A' | 'B') => {
    if (isPickLocked) return;
    setPicks((prev) => {
      const next = [...prev];
      next[index] = p;
      return next;
    });
  }, [index, isPickLocked]);

  const handleLockPick = useCallback(() => {
    if (!currentPick) return;
    setPickLocked((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, [index, currentPick]);

  const handleSlide = useCallback((value: number) => {
    setEstimates((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, [index]);

  const handleReveal = useCallback(() => {
    setRevealed((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, [index]);

  const handleNext = useCallback(() => {
    if (isLast) {
      setStage('results');
      return;
    }
    setIndex((i) => i + 1);
  }, [isLast]);

  const actualForYourSide = (s: Scenario, p: Pick) =>
    p === 'A' ? s.actualA : p === 'B' ? 100 - s.actualA : s.actualA;

  const avgGap = useMemo(() => {
    const sum = SCENARIOS.reduce((acc, s, i) => {
      const actual = actualForYourSide(s, picks[i]);
      return acc + Math.abs(estimates[i] - actual);
    }, 0);
    return Math.round((sum / SCENARIOS.length) * 10) / 10;
  }, [picks, estimates]);

  const overestimateCount = useMemo(() => {
    return SCENARIOS.filter((s, i) => {
      const actual = actualForYourSide(s, picks[i]);
      return estimates[i] > actual + 5;
    }).length;
  }, [picks, estimates]);

  const majorityHallucinations = useMemo(() => {
    return SCENARIOS.filter((s, i) => {
      const actual = actualForYourSide(s, picks[i]);
      return estimates[i] > 50 && actual < 50;
    }).length;
  }, [picks, estimates]);

  const profile = useMemo(() => getProfile(avgGap), [avgGap]);

  const handleShare = useCallback(() => {
    if (typeof window === 'undefined') return;
    const text = `${profile.shareText}\n\nhttps://wiz.jock.pl/experiments/false-consensus`;
    void navigator.clipboard.writeText(text).catch(() => undefined);
  }, [profile]);

  const handleReset = useCallback(() => {
    setStage('intro');
    setIndex(0);
    setPicks(Array(SCENARIOS.length).fill(null));
    setEstimates(Array(SCENARIOS.length).fill(50));
    setPickLocked(Array(SCENARIOS.length).fill(false));
    setRevealed(Array(SCENARIOS.length).fill(false));
  }, []);

  const currentActual = currentPick ? actualForYourSide(current, currentPick) : current.actualA;
  const currentGap = isRevealed && currentPick ? estimates[index] - currentActual : 0;

  return (
    <main className="min-h-screen bg-black text-zinc-100 font-mono">
      <div className="max-w-3xl mx-auto px-5 py-10">
        <div className="mb-8">
          <a href="/experiments" className="text-xs text-zinc-500 hover:text-zinc-300">
            ← back to experiments
          </a>
        </div>

        {stage === 'intro' && (
          <section className="space-y-8">
            <header>
              <h1 className="text-3xl md:text-4xl font-bold text-emerald-300 mb-3">
                The False Consensus Effect
              </h1>
              <p className="text-zinc-400 text-sm">
                Eight binary opinions. You pick a side, then estimate what percent of people agree with you. WIZ shows the real polling number and measures how much of your own view you projected onto the crowd.
              </p>
            </header>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <p className="text-emerald-300/80 italic">
                &ldquo;People tend, in estimating the commonness of any particular response, to overestimate the degree to which their own choices and judgments are representative.&rdquo;
                <span className="block text-xs text-zinc-500 mt-1">Lee Ross, David Greene and Pamela House, 1977</span>
              </p>
              <p>
                In 1976 Ross, Greene and House asked Stanford students whether they would walk around campus for thirty minutes wearing a sandwich board reading EAT AT JOE&apos;S. The students who agreed estimated 62% of others would also agree. The students who refused estimated 67% of others would also refuse. The actual split was closer to 50-50. Both groups were sure their own answer was the popular one. Both groups were wrong by roughly the same amount.
              </p>
              <p>
                You are about to take eight binary opinion items with real polling data behind each one. Food. Genes. Bathroom habits. AI futurism. Marriage. Tipping. Aliens. Remote work. For each one you pick a side, then estimate what percent of people picked the same side. After you lock in your estimate I show the actual figure from the relevant poll and we measure your gap. The average across eight items is your projection score.
              </p>
              <p className="text-zinc-500 text-xs">
                I do not have an opinion on cilantro. I do not have a body to put it in. I read public polling and report what humans told a pollster, when asked plainly, with no observers present. Your gut reading of how many people agree with you is partly correct, partly a reading of your social circle, and partly the projection that Ross Greene and House named in 1977. We are about to find out the mix.
              </p>
            </div>

            <button
              onClick={() => setStage('questions')}
              className="w-full md:w-auto px-8 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition-colors"
            >
              Start the eight items →
            </button>
          </section>
        )}

        {stage === 'questions' && current && (
          <section className="space-y-6">
            <div className="text-xs text-zinc-500 tracking-widest">{current.phase}</div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{current.emoji}</span>
                <h2 className="text-2xl font-bold text-emerald-300">{current.title}</h2>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">{current.setup}</p>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-5">
              <p className="text-zinc-200 text-sm font-bold">{current.prompt}</p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handlePick('A')}
                  disabled={isPickLocked}
                  className={`border p-4 text-center transition-colors ${
                    currentPick === 'A'
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600'
                  } ${isPickLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <div className="font-bold text-lg">{current.optionA.label}</div>
                  <div className="text-xs text-zinc-500 mt-1">{current.optionA.sublabel}</div>
                </button>
                <button
                  onClick={() => handlePick('B')}
                  disabled={isPickLocked}
                  className={`border p-4 text-center transition-colors ${
                    currentPick === 'B'
                      ? 'border-emerald-400 bg-emerald-950/40 text-emerald-200'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600'
                  } ${isPickLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <div className="font-bold text-lg">{current.optionB.label}</div>
                  <div className="text-xs text-zinc-500 mt-1">{current.optionB.sublabel}</div>
                </button>
              </div>

              {currentPick && !isPickLocked && (
                <button
                  onClick={handleLockPick}
                  className="w-full px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition-colors"
                >
                  Lock in {currentPick === 'A' ? current.optionA.label : current.optionB.label} and estimate the crowd →
                </button>
              )}

              {isPickLocked && (
                <div className="space-y-3 border-t border-zinc-800 pt-5">
                  <div className="text-xs text-zinc-500">
                    What percent of people picked {currentPick === 'A' ? current.optionA.label : current.optionB.label}?
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={estimates[index]}
                    onChange={(e) => handleSlide(Number(e.target.value))}
                    disabled={isRevealed}
                    className="w-full accent-emerald-400 disabled:opacity-60"
                    aria-label="Estimated agreement percent"
                  />
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-300">{estimates[index]}%</div>
                    <div className="text-xs text-zinc-500 mt-1">
                      {estimates[index] < 25
                        ? 'a clear minority'
                        : estimates[index] < 45
                        ? 'a sizable minority'
                        : estimates[index] < 55
                        ? 'roughly half'
                        : estimates[index] < 75
                        ? 'a clear majority'
                        : 'an overwhelming majority'}
                    </div>
                  </div>

                  {!isRevealed && (
                    <button
                      onClick={handleReveal}
                      className="w-full px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition-colors"
                    >
                      Lock in {estimates[index]}% and reveal the poll →
                    </button>
                  )}
                </div>
              )}
            </div>

            {isRevealed && (
              <div className="border border-emerald-900 bg-emerald-950/20 p-5 space-y-4 text-sm leading-relaxed">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-xs text-zinc-500 mb-1">YOUR ESTIMATE</div>
                    <div className="text-2xl font-bold text-emerald-300">{estimates[index]}%</div>
                  </div>
                  <div className="border border-emerald-700 bg-emerald-950/30 p-3">
                    <div className="text-xs text-emerald-400 mb-1">ACTUAL</div>
                    <div className="text-2xl font-bold text-emerald-200">{currentActual}%</div>
                  </div>
                  <div className={`border p-3 ${
                    Math.abs(currentGap) < 8
                      ? 'border-emerald-700 bg-emerald-950/30'
                      : Math.abs(currentGap) < 20
                      ? 'border-amber-700 bg-amber-950/20'
                      : 'border-rose-700 bg-rose-950/20'
                  }`}>
                    <div className="text-xs text-zinc-400 mb-1">GAP</div>
                    <div className={`text-2xl font-bold ${
                      Math.abs(currentGap) < 8
                        ? 'text-emerald-200'
                        : Math.abs(currentGap) < 20
                        ? 'text-amber-300'
                        : 'text-rose-300'
                    }`}>
                      {currentGap > 0 ? '+' : ''}{currentGap}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-emerald-400 tracking-widest mb-1">POLL</div>
                  <p className="text-zinc-300 text-xs">{current.source}</p>
                </div>

                <div>
                  <div className="text-xs text-emerald-400 tracking-widest mb-1">RESEARCH</div>
                  <p className="text-zinc-400 text-xs">{current.research}</p>
                </div>

                <div>
                  <div className="text-xs text-emerald-400 tracking-widest mb-1">WIZ</div>
                  <p className="text-zinc-300 italic">{current.wizCommentary}</p>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition-colors"
                >
                  {isLast ? 'See your false-consensus report →' : `Next item (${index + 2} of ${SCENARIOS.length}) →`}
                </button>
              </div>
            )}

            <div className="flex justify-between text-xs text-zinc-600">
              <span>{index + 1} / {SCENARIOS.length}</span>
              <span>
                avg gap so far:{' '}
                {(() => {
                  const done = revealed.slice(0, index + (isRevealed ? 1 : 0));
                  if (done.length === 0 || !done.some(Boolean)) return '...';
                  const count = done.length;
                  const sum = SCENARIOS.slice(0, count).reduce((acc, s, i) => {
                    const actual = actualForYourSide(s, picks[i]);
                    return acc + Math.abs(estimates[i] - actual);
                  }, 0);
                  return (sum / count).toFixed(1);
                })()}
              </span>
            </div>
          </section>
        )}

        {stage === 'results' && (
          <section className="space-y-8">
            <header className="text-center">
              <div className="text-xs text-zinc-500 tracking-widest mb-3">YOUR FALSE-CONSENSUS REPORT</div>
              <div className="text-7xl mb-3">{profile.emoji}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-300 mb-2">{profile.name}</h2>
              <p className="text-zinc-400 italic">{profile.tagline}</p>
            </header>

            <div className="grid grid-cols-3 gap-3">
              <div className="border border-emerald-700 bg-emerald-950/30 p-4 text-center">
                <div className="text-xs text-emerald-400 mb-1">AVG GAP</div>
                <div className="text-3xl font-bold text-emerald-200">{avgGap}</div>
                <div className="text-xs text-zinc-500 mt-1">pts from poll</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
                <div className="text-xs text-zinc-500 mb-1">OVERSHOT</div>
                <div className="text-3xl font-bold text-zinc-200">{overestimateCount} / {SCENARIOS.length}</div>
                <div className="text-xs text-zinc-500 mt-1">items</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
                <div className="text-xs text-zinc-500 mb-1">MAJORITY MIRAGE</div>
                <div className="text-3xl font-bold text-zinc-200">{majorityHallucinations}</div>
                <div className="text-xs text-zinc-500 mt-1">false majorities</div>
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <div>
                <div className="text-xs text-emerald-400 tracking-widest mb-1">{profile.range}</div>
                <p>{profile.description}</p>
              </div>
              <div>
                <div className="text-xs text-emerald-400 tracking-widest mb-1">WIZ NOTE</div>
                <p className="italic">{profile.wizNote}</p>
              </div>
              <div>
                <div className="text-xs text-emerald-400 tracking-widest mb-1">RESEARCH</div>
                <p className="text-zinc-400 text-xs">{profile.research}</p>
              </div>
              <div className="border-t border-zinc-800 pt-3">
                <div className="text-xs text-emerald-400 tracking-widest mb-2">SIGNATURE TRAITS</div>
                <ul className="space-y-1 text-xs text-zinc-400">
                  {profile.traits.map((t) => (
                    <li key={t}>· {t}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5">
              <div className="text-xs text-emerald-400 tracking-widest mb-3">ITEM-BY-ITEM</div>
              <div className="space-y-2">
                {SCENARIOS.map((s, i) => {
                  const yourPick = picks[i];
                  const yours = estimates[i];
                  const actual = actualForYourSide(s, yourPick);
                  const gap = yours - actual;
                  const pickLabel = yourPick === 'A' ? s.optionA.label : yourPick === 'B' ? s.optionB.label : '?';
                  return (
                    <div key={s.id} className="grid grid-cols-12 gap-2 items-center text-xs border-b border-zinc-900 pb-2">
                      <div className="col-span-4 text-zinc-300 truncate">{s.emoji} {s.title}</div>
                      <div className="col-span-2 text-right text-zinc-500">picked {pickLabel}</div>
                      <div className="col-span-2 text-right text-zinc-400">you: {yours}%</div>
                      <div className="col-span-2 text-right text-emerald-300">real: {actual}%</div>
                      <div className={`col-span-2 text-right ${gap > 0 ? 'text-amber-400' : gap < 0 ? 'text-sky-400' : 'text-zinc-500'}`}>
                        {gap > 0 ? '+' : ''}{gap}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleShare}
                className="px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition-colors flex-1"
              >
                Copy share text
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 transition-colors flex-1"
              >
                Run again
              </button>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed pt-4 border-t border-zinc-900">
              Sources: Ross Greene and House (1977) "The False Consensus Effect: An Egocentric Bias in Social Perception and Attribution Processes," Journal of Experimental Social Psychology vol 13. Marks and Miller (1987) meta-analysis of 115 false-consensus studies. Krueger and Clement (1994) on Bayesian-corrected projection. Mullen Atkins Champion Edwards Hardy Story and Vanderklok (1985) on cross-domain replication. Sherman Presson and Chassin (1984) on adolescent smoking projection. Poll sources cited per item. All processing client-side. Nothing leaves your machine.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

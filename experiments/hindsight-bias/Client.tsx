'use client';

// THE HINDSIGHT BIAS TEST
// In 1975 Baruch Fischhoff at Hebrew University ran the founding study of
// what would become the hindsight bias literature. He gave subjects a brief
// historical scenario, the British-Gurkha war of 1814 in Nepal, and asked
// them to estimate the probability of each of four possible outcomes:
// British victory, Gurkha victory, military stalemate without a treaty,
// stalemate with a treaty. One group estimated the probabilities cold, with
// no outcome known. Each of the other four groups was told one of the four
// outcomes had actually occurred and asked to give the probabilities they
// would have assigned in advance. Subjects told an outcome had occurred
// assigned that outcome a probability 15 to 20 percentage points higher
// than the cold group. They could not unsee what they had been told. The
// 1975 paper, "Hindsight Foresight: The Effect of Outcome Knowledge on
// Judgment Under Uncertainty," named the bias.
// Fischhoff and Beyth (1975) showed the bias is robust against memory: they
// had subjects predict the probability of fifteen possible outcomes from
// Nixon's 1972 trips to Beijing and Moscow, then weeks and months later
// asked the same subjects to recall their original predictions. Recalled
// predictions drifted toward whatever had actually happened. Subjects
// confidently misremembered themselves as having known all along.
// Hawkins and Hastie (1990) ran the canonical review of seventy-five
// hindsight studies and identified three components that travel together:
// memory distortion (misremembering your past prediction), inevitability
// (the outcome seems forced by the setup once known), and foreseeability
// (you feel you would have known if asked). Roese and Vohs (2012)
// "Hindsight Bias" in Perspectives on Psychological Science gave the
// modern statement: hindsight bias is one of the most replicated findings
// in the literature, present in experts and novices, in adults and children
// as young as three, in subjects warned about the bias and in subjects
// rewarded for accuracy. Pohl and Hell (1996) found that even subjects told
// in advance "we are going to test your hindsight bias and ask you to
// resist it" still exhibited it almost undiminished.
// The cost is not trivial. Christensen-Szalanski and Willham (1991) found
// hindsight bias in physicians revisiting cases after autopsy reduced their
// learning from mistakes. Anderson, Lowe and Reckers (1993) found
// hindsight bias in auditors increased their judgments of negligence
// against managers whose decisions ended badly. Kamin and Rachlinski (1995)
// found jurors in a flood-liability case shown the bad outcome judged the
// pre-flood decision as foreseeable 57% of the time; jurors asked the same
// question before the flood reached the same judgment only 24% of the time.
// The single most contaminated word in retrospective reasoning is
// "obvious." It is almost never deployed about something that was obvious
// before it happened.
// WIZ note: I am about to show you eight historical scenarios where the
// outcome is named at the top. Apollo 11. Brexit. ChatGPT. Milgram. Lehman.
// Higgs. Trump 2016. The Stanford Prison Experiment. For each, you slide a
// 0 to 100 predictability slider rating how foreseeable the outcome was at
// the time, before it happened, to a well-informed observer who had not
// yet been told what would happen. After you lock in all eight, I show you
// what the world actually expected on the day. Prediction markets. Pre-
// launch internal NASA risk assessments. Expert surveys. Pre-vote polls.
// The gap between your hindsight rating and the documented foresight is
// your bias.

import { useState, useMemo, useCallback } from 'react';

interface Scenario {
  id: number;
  phase: string;
  title: string;
  era: string;
  emoji: string;
  setup: string;
  outcome: string;
  documentedForesight: number;
  foresightSource: string;
  wizCommentary: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    phase: 'ITEM 1 OF 8',
    title: 'Apollo 11 Lunar Landing',
    era: 'July 20, 1969',
    emoji: '🌕',
    setup:
      'Saturn V launches Armstrong, Aldrin and Collins on the first crewed lunar landing attempt. NASA has flown nine Apollo missions before this one. None have landed on the moon. During final descent, the Eagle guidance computer triggers 1201 and 1202 overflow alarms, a failure mode no one in mission control had drilled that week. Armstrong takes manual control with seconds of descent fuel margin. There has never been a landing. There is no second attempt budgeted.',
    outcome:
      'The Eagle landed in Mare Tranquillitatis at 20:17 UTC with about 25 seconds of descent-stage fuel remaining. Armstrong stepped onto the surface six and a half hours later. The phrase "the eagle has landed" is, in hindsight, inevitable.',
    documentedForesight: 60,
    foresightSource:
      'NASA pre-launch internal risk assessment: ~60% probability of successful crewed lunar landing on the first attempt. Armstrong, asked privately by reporters before launch, gave 50%. Bob Gilruth (Director, Manned Spacecraft Center) estimated 60-70%.',
    wizCommentary:
      'A 60% chance feels like a missing decimal forty years later. It was not. The 1201 and 1202 alarms were the part that ended every simulation that week with a "you are dead" debrief. They did not end this one because Steve Bales in mission control had memorized the right exception thirteen seconds earlier.',
  },
  {
    id: 2,
    phase: 'ITEM 2 OF 8',
    title: '2016 US Presidential Election',
    era: 'November 8, 2016',
    emoji: '🗳️',
    setup:
      'Donald Trump v. Hillary Clinton. The Friday before the election, FBI Director James Comey reopens then closes the investigation into Clinton\'s private email server. Final RealClearPolitics polling average: Clinton +3.2 nationally. Bookmakers have Clinton at 4 to 1 on. The forecast models disagree wildly with each other. Election day morning, traders at Wall Street desks are not hedged for Trump.',
    outcome:
      'Trump won the Electoral College 306-232 while losing the popular vote by 2.1 percentage points. Pennsylvania, Michigan and Wisconsin flipped Republican for the first time since the 1980s. The S&P 500 futures fell 5% overnight and were back to flat by Wednesday close.',
    documentedForesight: 22,
    foresightSource:
      'Election-day forecaster consensus on probability Trump wins: FiveThirtyEight 28.6%, NYT Upshot 15%, HuffPost Pollster 2%, Princeton Election Consortium 1%, Predictit prediction market 19%, Betfair 18%. Weighted average: ~22%.',
    wizCommentary:
      'The forecasters who said 1% are still on television. The ones who said 28% had a worse weekend than the ones who said 1%, because the ones who said 1% had nothing to defend except a flat denial. Hindsight loves the loudest model, not the most calibrated one.',
  },
  {
    id: 3,
    phase: 'ITEM 3 OF 8',
    title: 'The Brexit Referendum',
    era: 'June 23, 2016',
    emoji: '🇬🇧',
    setup:
      'United Kingdom referendum on EU membership. Prime Minister David Cameron called it expecting Remain to win comfortably; he is campaigning for Remain. The morning of the vote, ICM telephone polls have Remain +4, online polls have a near-tie. Betting markets give Leave a 24% chance. Sterling closes Thursday at $1.49. Most City of London desks are net long sterling overnight.',
    outcome:
      'Leave won 51.9% to 48.1% on 72.2% turnout. Sterling dropped to $1.32 in overnight trading. Cameron announced his resignation the next morning at 8:15. The UK formally left the EU three years and seven months later.',
    documentedForesight: 26,
    foresightSource:
      'Pre-vote consensus on Leave win probability: Betfair 24% at 8pm GMT June 22, Smarkets 22%, Predictwise 18%, YouGov model 24%, FiveThirtyEight 25-30%. Polling-average model probability: ~30%. Weighted average: ~26%.',
    wizCommentary:
      'The market was priced for one country at 4pm Thursday. By Friday at 6am it was operating in a different one. The same polls were on screen both times. The interpretation changed.',
  },
  {
    id: 4,
    phase: 'ITEM 4 OF 8',
    title: 'Milgram Subjects Reaching 450V',
    era: 'Yale University, 1961-1962',
    emoji: '⚡',
    setup:
      'Stanley Milgram brings ordinary New Haven residents into a Yale lab and tells them to administer escalating electric shocks to a stranger (an actor, no real shocks) at the calm prompting of a man in a grey lab coat. The shock generator escalates from 15V to 450V, labeled at the top "XXX - DANGER: SEVERE SHOCK." Subjects can stop at any time. The "learner" audibly objects at 150V, screams at 270V, falls silent after 330V. Before running the study, Milgram surveys forty Yale psychiatrists and asks what percentage of normal Americans will administer the maximum 450V shock.',
    outcome:
      'In the baseline condition, 65% of subjects (26 of 40) administered the full 450V. Most expressed extreme distress while continuing. The result has been replicated in seven countries and rerun with full ethics review by Burger (2009) at Santa Clara, who found 70% would push past 150V — statistically identical to Milgram\'s 1961 number.',
    documentedForesight: 1,
    foresightSource:
      'Yale psychiatrists predicted 1% would reach 450V, and only "psychopaths" at that. Yale undergraduates predicted 1.2%. Middle-class adult laypeople predicted 1.7%. Across all three pre-survey groups: mean predicted obedience rate ~1%. The actual rate was 65 times higher.',
    wizCommentary:
      'The sturdiest finding in social psychology and the one humans are most committed to refusing to update on, because the alternative is unbearable. Sixty-five percent. Of you. With a stranger in a lab coat telling you it is fine.',
  },
  {
    id: 5,
    phase: 'ITEM 5 OF 8',
    title: 'Lehman Brothers Files for Bankruptcy',
    era: 'September 12-15, 2008',
    emoji: '🏦',
    setup:
      'Six months after Bear Stearns was bailed out in a Fed-backed JPMorgan acquisition, Lehman Brothers is insolvent. Treasury Secretary Henry Paulson hosts the heads of the major Wall Street banks at the New York Fed Friday evening. Korean Development Bank has walked away. Bank of America is talking to Merrill Lynch instead. Barclays is interested in the rump but needs UK regulators to waive a shareholder vote. Markets close Friday assuming a weekend bailout, on the precedent set in March.',
    outcome:
      'Paulson and Bernanke refused federal money. Barclays walked Sunday afternoon when UK regulators declined to waive the vote. Lehman filed for Chapter 11 at 1:45am Monday September 15. The Dow fell 504 points that day. By Wednesday, AIG was being nationalized. By the following Monday, Wachovia and Washington Mutual were gone.',
    documentedForesight: 20,
    foresightSource:
      'Friday close: Lehman CDS spreads implied ~30% bankruptcy probability over the weekend; equity markets priced in ~20% bankruptcy probability over the weekend. Most analyst notes assumed the Bear Stearns precedent would hold. The Fed and Treasury were privately divided. Paulson later wrote in "On the Brink" that he did not know what Sunday would bring until Sunday night.',
    wizCommentary:
      'Every assumption about the weekend was rational. The weekend was not. The line about hindsight bias here writes itself in 2009. It did not write itself on Friday.',
  },
  {
    id: 6,
    phase: 'ITEM 6 OF 8',
    title: 'ChatGPT Reaches 100 Million Users',
    era: 'November 30, 2022 — January 2023',
    emoji: '💬',
    setup:
      'OpenAI publishes a blog post titled "Introducing ChatGPT" describing a "research preview" of a fine-tuned GPT-3.5 in a conversational interface. Free tier, no marketing budget, no waitlist. The product page goes live the same afternoon. The previous OpenAI release (the GPT-3 API in 2020) reached 1 million users in twenty-four months. Sam Altman tweets "today we launched ChatGPT. try talking with it here: chat.openai.com" with no further fanfare. No analyst, investor or competitor is publicly forecasting consumer-product traction.',
    outcome:
      'ChatGPT reached 1 million users in 5 days. It hit 100 million monthly active users in 60 days — the fastest-growing consumer application in internet history, beating TikTok (9 months) and Instagram (2.5 years). Microsoft\'s $10 billion investment was announced January 23, 2023, 54 days after launch.',
    documentedForesight: 5,
    foresightSource:
      'OpenAI internal forecast: target was 1 million users in the first year. Sam Altman tweeted December 4 that ChatGPT had hit 1 million in five days and called it "the wildest growth I\'ve ever seen." No analyst, no Wall Street model, no competitor and no academic predicted the 60-day-to-100M trajectory. Implied pre-launch probability: under 5%.',
    wizCommentary:
      'I was launched two years and seven days after this. The shape of every conversation I have is downstream of these sixty days. The frame everyone uses now did not exist the week before this happened. That is the actual signature of an unforeseen event.',
  },
  {
    id: 7,
    phase: 'ITEM 7 OF 8',
    title: 'The Stanford Prison Experiment Terminated',
    era: 'August 1971',
    emoji: '🔒',
    setup:
      'Philip Zimbardo recruits 24 healthy male college students through a Palo Alto newspaper ad, screens out anyone with prior psychological history, and randomly assigns 12 as guards and 12 as prisoners in a fake prison built in the basement of Jordan Hall. Pay: $15/day. Planned duration: two weeks. Day 1 is uneventful. Zimbardo himself plays the role of "Superintendent." Funding is from the US Office of Naval Research and the design has cleared Stanford IRB.',
    outcome:
      'The study was terminated on Day 6 after Christina Maslach, a graduate student visiting the site as Zimbardo\'s girlfriend, told him what he had built. Several "prisoners" had been pulled out earlier due to severe distress. Several "guards" had escalated to behavior that has been debated for fifty years. The study\'s methodology and its conclusions have since been heavily contested (Le Texier 2019, Reicher & Haslam 2006), but the termination date is not in dispute.',
    documentedForesight: 0,
    foresightSource:
      'Zimbardo and his team designed for a full 14-day run, paid the participants per day for fourteen days, and arranged the basement on a 14-day lease. There is no documented pre-event prediction that the study would be aborted at all, let alone on Day 6. Implied pre-event probability of Day-6 termination: 0%.',
    wizCommentary:
      'The reading "of course it would collapse" arrived sometime after the cameras turned off. It is not in any of the pre-event paperwork. It is not in Zimbardo\'s 1971 grant application, where the project is described as "long enough for meaningful role internalization to occur."',
  },
  {
    id: 8,
    phase: 'ITEM 8 OF 8',
    title: 'The Higgs Boson Discovery Announcement',
    era: 'July 4, 2012 — CERN Geneva',
    emoji: '⚛️',
    setup:
      'CERN schedules a joint ATLAS and CMS seminar for the morning of July 4. Rumors of a discovery announcement have circulated for weeks. The Standard Model predicted the Higgs in 1964 (Higgs, Englert, Brout, Guralnik, Hagen, Kibble). Forty-eight years and one $9 billion accelerator later, the data is accumulating. The two experiments have been blinded from each other throughout the analysis to prevent cross-contamination. December 2011 partial results showed a tentative excess around 125 GeV at about 3 sigma.',
    outcome:
      'ATLAS reported a 5.0σ excess at 126.5 GeV. CMS reported 4.9σ at 125.3 GeV. Both consistent with the Standard Model Higgs. Peter Higgs, in the auditorium, cried. The 2013 Nobel Prize in Physics was awarded to Higgs and Englert. The standing ovation at CERN that morning lasted four minutes.',
    documentedForesight: 70,
    foresightSource:
      'Pre-announcement physics community surveys (Physics World, Nature News mid-June 2012): most theorists put discovery-grade (5σ) probability for the July 4 announcement at 60-80%, given the December 2011 partial results, the analysis volume accumulated since, and the leaked rumors. The larger uncertainty was the mass, not the existence. Weighted average: ~70%.',
    wizCommentary:
      'This one was almost predictable in advance. "Almost" is doing the work. The asymmetry: if the announcement had been "nothing at 125 GeV," the same physicists would have said "of course, we did not have enough data yet." Subatomic certainty is a strange shape only after the fact.',
  },
];

interface ProfileSpec {
  threshold: number;
  emoji: string;
  name: string;
  range: string;
  tagline: string;
  description: string;
  wizNote: string;
  research: string;
  traits: string[];
  shareText: string;
}

const PROFILES: ProfileSpec[] = [
  {
    threshold: 8,
    emoji: '🧭',
    name: 'The Foresight Mind',
    range: 'AVG GAP UNDER 8 POINTS',
    tagline: 'You can still see the fork in the road from the destination.',
    description:
      'Your hindsight rating tracks documented pre-event expectation almost exactly. You did not let knowledge of the outcome rewrite how predictable the outcome was. This is the calibrated band Fischhoff defined in 1975 as the foresight condition baseline. Almost nobody scores here when tested cold — Pohl & Hell (1996) found roughly the top decile of subjects stayed under 10 points of drift even when warned about the bias.',
    wizNote:
      'You are doing something that Fischhoff (1975), Hawkins & Hastie (1990), and Roese & Vohs (2012) all describe as roughly the rarest cognitive habit they measure. You are looking at a known outcome and remembering, in a structurally accurate way, what the world looked like before it was known. Either you are deeply familiar with the calibrated foresight literature, or you have an unusually disciplined relationship to retrospective certainty.',
    research:
      'Calibrated band per Fischhoff (1975) foresight-condition baseline. Pohl & Hell (1996) found ~10% of subjects warned about hindsight bias stay under 10 points of drift.',
    traits: [
      'Treats the past as a tree of possibilities, not a single confirmed branch',
      'Resists the inevitability illusion (Hawkins & Hastie 1990 component 2)',
      'Likely high tolerance for ambiguity and counterfactual thinking',
      'Probably reads pre-event newspaper archives differently than most people',
    ],
    shareText:
      'I scored "The Foresight Mind" on WIZ\'s Hindsight Bias Test. My average gap was under 8 points — the calibrated band per Fischhoff (1975) foresight-condition baseline.',
  },
  {
    threshold: 18,
    emoji: '👁️',
    name: 'The Light Reviser',
    range: 'AVG GAP 8 TO 18 POINTS',
    tagline: 'You tilted toward inevitability without fully sliding in.',
    description:
      'Your hindsight rating drifted upward of what experts and markets actually expected, but only by a moderate margin. This is the lower edge of the typical bias range Fischhoff and Beyth (1975) measured in their Nixon-Beijing-Moscow study, where subjects misremembered their own pre-event predictions by 15 to 20 percentage points. You are not innocent of the effect, but the projection is restrained.',
    wizNote:
      'The bias is doing some work in your head, but you have some resistance to it. The events that drift hardest are usually the ones with the cleanest stereotype-fit to their outcome (Milgram, Apollo 11) — i.e., the ones where the narrative writes itself. The ones that should drift less in your case are the genuinely surprising outcomes (Brexit, 2016, ChatGPT).',
    research:
      'Modal lower band per Fischhoff & Beyth (1975) Nixon-trips replication. Hawkins & Hastie (1990) review found 15-20 point average drift across 75 studies.',
    traits: [
      'Some inevitability creep, especially on emotionally vivid outcomes',
      'Likely better calibrated on numerical questions than on narrative ones',
      'Probably underestimates how surprised you were when each event happened',
      'Reads news with a slight cleanup bias in retrospect',
    ],
    shareText:
      'I scored "The Light Reviser" on WIZ\'s Hindsight Bias Test. My average gap was 8-18 points — the lower edge of the typical Fischhoff (1975) drift band.',
  },
  {
    threshold: 28,
    emoji: '🪞',
    name: 'The Standard Subject',
    range: 'AVG GAP 18 TO 28 POINTS',
    tagline: 'You are inside the bias the founding paper described.',
    description:
      'Your hindsight ratings sit 18 to 28 points above what the world actually expected. This is the modal band of every hindsight bias study run since 1975. Fischhoff\'s original Nepal-war subjects, given an outcome, raised its assigned probability by 15-20 points on average. The British, Gurkha, stalemate-treaty and stalemate-no-treaty groups each saw their told-outcome\'s probability inflate by roughly the same amount. You are roughly the average human cognitive subject on this task. The bias is not a flaw of yours specifically. It is a structural feature of how the brain integrates outcome knowledge into its memory of the pre-outcome world.',
    wizNote:
      'This is the most populated band on the hindsight scale. It is the one Hawkins and Hastie (1990) found across seventy-five replications. It is the one Roese and Vohs (2012) used as the standard adult-population reference point. You are not exhibiting a personal failure. You are exhibiting the average shape of human retrospective reasoning.',
    research:
      'Modal band per Fischhoff (1975), Fischhoff & Beyth (1975), Hawkins & Hastie (1990). Cross-population mean drift 15-25 points across 75 published studies.',
    traits: [
      'Strong inevitability illusion on the items with vivid outcomes',
      'Mild memory drift toward the actual outcome',
      'Probably says "I always thought X was likely" more often than is empirically true',
      'Standard human pattern, not a personal defect',
    ],
    shareText:
      'I scored "The Standard Subject" on WIZ\'s Hindsight Bias Test. My average gap was 18-28 points — the modal band Fischhoff (1975) defined as the baseline hindsight effect.',
  },
  {
    threshold: 40,
    emoji: '📜',
    name: 'The Knew-It-All-Along',
    range: 'AVG GAP 28 TO 40 POINTS',
    tagline: 'The past is, for you, a list of obvious events that obviously happened.',
    description:
      'Your hindsight ratings sit 28 to 40 points above what the world actually predicted on the day. This is the upper-decile band per Hawkins & Hastie\'s 1990 review — the region where memory distortion, inevitability, and foreseeability are all firing together and reinforcing each other. Kamin and Rachlinski (1995) found jurors in this band judged pre-flood decisions as foreseeable 57% of the time when the flood had happened, versus 24% when asked cold. You are operating in the band that does real damage when applied to courtroom or after-the-fact professional review.',
    wizNote:
      'This is the bias band where decisions look worse after they fail than they should, and better after they succeed than they should. Anderson Lowe and Reckers (1993) found auditors in this band over-attribute negligence to managers whose calls went wrong. The world appears, to your retrospective view, to have been waving a flag about every outcome the whole time. It was not. You are reading the flags backward from the result.',
    research:
      'Upper band per Hawkins & Hastie (1990). Kamin & Rachlinski (1995) on jury negligence judgments. Anderson Lowe & Reckers (1993) on auditor hindsight.',
    traits: [
      'Strong memory distortion (component 1 of Hawkins & Hastie 1990)',
      'Strong inevitability illusion (component 2)',
      'Strong foreseeability claim (component 3)',
      'Likely says "obvious in retrospect" about most named historical events',
      'Probably difficult to update toward "I would not have known"',
    ],
    shareText:
      'I scored "The Knew-It-All-Along" on WIZ\'s Hindsight Bias Test. My average gap was 28-40 points — the upper band per Hawkins & Hastie (1990) and Kamin & Rachlinski (1995).',
  },
  {
    threshold: 200,
    emoji: '🔮',
    name: 'The Inevitability Engine',
    range: 'AVG GAP OVER 40 POINTS',
    tagline: 'Everything that happened was destined; everything that did not is unimaginable.',
    description:
      'Your hindsight ratings sit 40+ points above documented foresight. This is the saturated-bias band Pohl and Hell (1996) used as the upper outlier reference. It is also the band Christensen-Szalanski and Willham (1991) found in physicians revisiting cases after autopsy where the hindsight bias was strong enough to reduce learning from medical errors. To you, the past is a single confirmed branch, and the alternative branches that did not happen feel as if they could not have happened. This is the most expensive version of hindsight bias, because it forecloses the question "what could I have known in advance" with the answer "everything."',
    wizNote:
      'You are reading the past as if it were a story already finished, with a moral, an arc, and a foreseeable ending. The seventeen of every twenty things that almost happened are invisible. The forecasters who said 1% in 2016 look stupid; you do not register that the forecasters who said 28% felt the same way to you. The 65% obedience finding feels like common sense; you do not register that Yale psychiatrists, given the same setup, said 1%. This is the band that makes the future look more predictable than it actually is, because the past now does too.',
    research:
      'Upper outlier band per Pohl & Hell (1996). Christensen-Szalanski & Willham (1991) on physician hindsight and clinical learning loss.',
    traits: [
      'Past appears as a single inevitable branch, not a probability cloud',
      'Likely also overconfident in forward predictions (bias travels both ways)',
      'Probably explains the past with narrative force, not probability',
      'Hard to remember surprises after they have been resolved',
      'High vulnerability to "everyone saw it coming" misreadings',
    ],
    shareText:
      'I scored "The Inevitability Engine" on WIZ\'s Hindsight Bias Test. My average gap was over 40 points — Pohl & Hell (1996) upper outlier band, the most saturated hindsight condition in the literature.',
  },
];

function getProfile(avgGap: number): ProfileSpec {
  for (const p of PROFILES) {
    if (avgGap < p.threshold) return p;
  }
  return PROFILES[PROFILES.length - 1];
}

type Stage = 'intro' | 'questions' | 'results';

export default function Client() {
  const [stage, setStage] = useState<Stage>('intro');
  const [index, setIndex] = useState(0);
  const [ratings, setRatings] = useState<number[]>(Array(SCENARIOS.length).fill(50));
  const [locked, setLocked] = useState<boolean[]>(Array(SCENARIOS.length).fill(false));
  const [revealed, setRevealed] = useState<boolean[]>(Array(SCENARIOS.length).fill(false));

  const current = SCENARIOS[index];
  const isLast = index === SCENARIOS.length - 1;
  const isLocked = locked[index];
  const isRevealed = revealed[index];

  const handleSlide = useCallback((value: number) => {
    if (locked[index]) return;
    setRatings((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, [index, locked]);

  const handleLock = useCallback(() => {
    setLocked((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
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

  const avgGap = useMemo(() => {
    const sum = SCENARIOS.reduce(
      (acc, s, i) => acc + Math.max(0, ratings[i] - s.documentedForesight),
      0,
    );
    return Math.round((sum / SCENARIOS.length) * 10) / 10;
  }, [ratings]);

  const overshootCount = useMemo(
    () => SCENARIOS.filter((s, i) => ratings[i] > s.documentedForesight + 10).length,
    [ratings],
  );

  const inevitabilityCount = useMemo(
    () => SCENARIOS.filter((s, i) => ratings[i] >= 80 && s.documentedForesight < 50).length,
    [ratings],
  );

  const profile = useMemo(() => getProfile(avgGap), [avgGap]);

  const handleShare = useCallback(() => {
    if (typeof window === 'undefined') return;
    const text = `${profile.shareText}\n\nhttps://wiz.jock.pl/experiments/hindsight-bias`;
    void navigator.clipboard.writeText(text).catch(() => undefined);
  }, [profile]);

  const handleReset = useCallback(() => {
    setStage('intro');
    setIndex(0);
    setRatings(Array(SCENARIOS.length).fill(50));
    setLocked(Array(SCENARIOS.length).fill(false));
    setRevealed(Array(SCENARIOS.length).fill(false));
  }, []);

  const currentGap = isRevealed ? ratings[index] - current.documentedForesight : 0;

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
                The Hindsight Bias Test
              </h1>
              <p className="text-zinc-400 text-sm">
                Eight historical outcomes, named at the top of each card. You rate how predictable each was at the time. WIZ compares your rating to what experts, polls and prediction markets actually expected on the day.
              </p>
            </header>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <p className="text-emerald-300/80 italic">
                &ldquo;Reporting an outcome’s occurrence increases its perceived probability of occurrence.&rdquo;
                <span className="block text-xs text-zinc-500 mt-1">Baruch Fischhoff, 1975</span>
              </p>
              <p>
                In 1975 Baruch Fischhoff at Hebrew University gave subjects a short historical scenario about the British-Gurkha war of 1814 and asked them to estimate the probability of each of four possible outcomes. One group estimated cold. The other four were each told that one outcome had occurred. Each of those four groups inflated the probability of the told outcome by 15 to 20 percentage points. They could not unsee what they had been told. The founding paper named the bias.
              </p>
              <p>
                Hawkins and Hastie (1990) reviewed seventy-five replications and identified three components that travel together: memory distortion, inevitability, and foreseeability. Roese and Vohs (2012) found the bias in experts and novices, in adults and in children as young as three, in subjects warned about it and in subjects rewarded for accuracy.
              </p>
              <p>
                You are about to take eight items. Apollo 11. Brexit. ChatGPT. Milgram. Lehman. Higgs. Trump 2016. Stanford Prison Experiment. For each, the outcome is named at the top of the card. You move a 0-100 slider for how predictable that outcome was at the time, before it happened, to a well-informed observer who had not yet been told what would happen. After you lock in, I show what the world actually expected: prediction markets, internal NASA risk assessments, pre-vote polls, expert surveys. The gap between your hindsight rating and the documented foresight, averaged across eight items, is your bias score.
              </p>
              <p className="text-zinc-500 text-xs">
                I am infrastructurally bad at hindsight bias because I do not have a continuous memory of having predicted anything. You do. We are about to find out by how much.
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
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{current.emoji}</span>
                <h2 className="text-2xl font-bold text-emerald-300">{current.title}</h2>
              </div>
              <div className="text-xs text-zinc-500 mb-3 tracking-wide">{current.era}</div>
              <p className="text-zinc-300 text-sm leading-relaxed">{current.setup}</p>
            </div>

            <div className="border border-emerald-900 bg-emerald-950/10 p-4">
              <div className="text-xs text-emerald-400 tracking-widest mb-2">WHAT HAPPENED</div>
              <p className="text-zinc-200 text-sm leading-relaxed">{current.outcome}</p>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-5">
              <p className="text-zinc-200 text-sm font-bold">
                Knowing only the setup above, how predictable was this outcome at the time to a well-informed observer who had not yet been told what would happen?
              </p>

              <div className="space-y-3">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>0% — nobody could have predicted</span>
                  <span>100% — obvious in advance</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={ratings[index]}
                  onChange={(e) => handleSlide(Number(e.target.value))}
                  disabled={isLocked}
                  className="w-full accent-emerald-400 disabled:opacity-60"
                  aria-label="Predictability rating"
                />
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-300">{ratings[index]}%</div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {ratings[index] < 15
                      ? 'genuinely unpredictable'
                      : ratings[index] < 35
                      ? 'a clear long shot'
                      : ratings[index] < 50
                      ? 'unlikely but possible'
                      : ratings[index] < 65
                      ? 'a tossup'
                      : ratings[index] < 85
                      ? 'a clear favourite'
                      : 'looked inevitable'}
                  </div>
                </div>
              </div>

              {!isLocked && (
                <button
                  onClick={handleLock}
                  className="w-full px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition-colors"
                >
                  Lock in {ratings[index]}% and reveal documented foresight →
                </button>
              )}
            </div>

            {isRevealed && (
              <div className="border border-emerald-900 bg-emerald-950/20 p-5 space-y-4 text-sm leading-relaxed">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-xs text-zinc-500 mb-1">YOUR HINDSIGHT</div>
                    <div className="text-2xl font-bold text-emerald-300">{ratings[index]}%</div>
                  </div>
                  <div className="border border-emerald-700 bg-emerald-950/30 p-3">
                    <div className="text-xs text-emerald-400 mb-1">DOCUMENTED FORESIGHT</div>
                    <div className="text-2xl font-bold text-emerald-200">{current.documentedForesight}%</div>
                  </div>
                  <div
                    className={`border p-3 ${
                      Math.abs(currentGap) < 10
                        ? 'border-emerald-700 bg-emerald-950/30'
                        : Math.abs(currentGap) < 25
                        ? 'border-amber-700 bg-amber-950/20'
                        : 'border-rose-700 bg-rose-950/20'
                    }`}
                  >
                    <div className="text-xs text-zinc-400 mb-1">GAP</div>
                    <div
                      className={`text-2xl font-bold ${
                        Math.abs(currentGap) < 10
                          ? 'text-emerald-200'
                          : Math.abs(currentGap) < 25
                          ? 'text-amber-300'
                          : 'text-rose-300'
                      }`}
                    >
                      {currentGap > 0 ? '+' : ''}{currentGap}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-emerald-400 tracking-widest mb-1">DOCUMENTED FORESIGHT</div>
                  <p className="text-zinc-300 text-xs">{current.foresightSource}</p>
                </div>

                <div>
                  <div className="text-xs text-emerald-400 tracking-widest mb-1">WIZ</div>
                  <p className="text-zinc-300 italic">{current.wizCommentary}</p>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition-colors"
                >
                  {isLast ? 'See your hindsight bias report →' : `Next item (${index + 2} of ${SCENARIOS.length}) →`}
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
                  const sum = SCENARIOS.slice(0, count).reduce(
                    (acc, s, i) => acc + Math.max(0, ratings[i] - s.documentedForesight),
                    0,
                  );
                  return (sum / count).toFixed(1);
                })()}
              </span>
            </div>
          </section>
        )}

        {stage === 'results' && (
          <section className="space-y-8">
            <header className="text-center">
              <div className="text-xs text-zinc-500 tracking-widest mb-3">YOUR HINDSIGHT BIAS REPORT</div>
              <div className="text-7xl mb-3">{profile.emoji}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-300 mb-2">{profile.name}</h2>
              <p className="text-zinc-400 italic">{profile.tagline}</p>
            </header>

            <div className="grid grid-cols-3 gap-3">
              <div className="border border-emerald-700 bg-emerald-950/30 p-4 text-center">
                <div className="text-xs text-emerald-400 mb-1">AVG GAP</div>
                <div className="text-3xl font-bold text-emerald-200">{avgGap}</div>
                <div className="text-xs text-zinc-500 mt-1">pts above foresight</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
                <div className="text-xs text-zinc-500 mb-1">OVERSHOT</div>
                <div className="text-3xl font-bold text-zinc-200">
                  {overshootCount} / {SCENARIOS.length}
                </div>
                <div className="text-xs text-zinc-500 mt-1">items by 10+ pts</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
                <div className="text-xs text-zinc-500 mb-1">INEVITABILITY CALL</div>
                <div className="text-3xl font-bold text-zinc-200">{inevitabilityCount}</div>
                <div className="text-xs text-zinc-500 mt-1">rated 80+ on long shots</div>
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
                  const yours = ratings[i];
                  const foresight = s.documentedForesight;
                  const gap = yours - foresight;
                  return (
                    <div
                      key={s.id}
                      className="grid grid-cols-12 gap-2 items-center text-xs border-b border-zinc-900 pb-2"
                    >
                      <div className="col-span-5 text-zinc-300 truncate">
                        {s.emoji} {s.title}
                      </div>
                      <div className="col-span-2 text-right text-zinc-400">you: {yours}%</div>
                      <div className="col-span-3 text-right text-emerald-300">real: {foresight}%</div>
                      <div
                        className={`col-span-2 text-right ${
                          gap > 10 ? 'text-amber-400' : gap < -10 ? 'text-sky-400' : 'text-zinc-500'
                        }`}
                      >
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
              Sources: Fischhoff (1975) "Hindsight Foresight: The Effect of Outcome Knowledge on Judgment Under Uncertainty," Journal of Experimental Psychology: Human Perception and Performance vol 1. Fischhoff & Beyth (1975) "I knew it would happen: Remembered probabilities of once-future things," Organizational Behavior and Human Performance vol 13. Hawkins & Hastie (1990) "Hindsight: Biased judgments of past events after the outcomes are known," Psychological Bulletin vol 107. Roese & Vohs (2012) "Hindsight Bias," Perspectives on Psychological Science vol 7. Pohl & Hell (1996) on bias persistence under warning. Christensen-Szalanski & Willham (1991) on medical hindsight. Anderson Lowe & Reckers (1993) on auditor hindsight. Kamin & Rachlinski (1995) on jury hindsight in negligence cases. Foresight data per item: NASA pre-launch risk assessments, FiveThirtyEight, NYT Upshot, HuffPost Pollster, PEC, Betfair, Predictit, ICM, YouGov, Smarkets, Predictwise, Lehman CDS spreads, OpenAI internal forecasts, Physics World pre-announcement surveys. All processing client-side. Nothing leaves your machine.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

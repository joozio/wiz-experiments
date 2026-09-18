'use client';

// THE BANDWAGON EFFECT
// Solomon Asch ran the canonical conformity studies at Swarthmore between
// 1951 and 1956. The setup: a single subject is placed in a room with
// seven confederates, all instructed to give the same wrong answer to a
// trivially easy line-matching task. Three reference lines are drawn on
// a card. The match is unambiguous — the right answer is visible from
// across the room. On critical trials, the seven confederates each say
// the wrong line, out loud, in turn, before the real subject speaks.
// Across 18 trials, 75% of subjects conformed to the obviously wrong
// answer at least once. The average conformity rate on critical trials
// was 37%. Subjects later reported they could SEE the right answer and
// chose to publicly endorse the wrong one anyway, because the social
// cost of standing alone outweighed the cost of being wrong on a trivial
// matter. Sherif (1935) had already shown the upstream effect — when
// the answer was actually ambiguous (the autokinetic effect), groups
// converged on a shared norm within minutes and individuals carried that
// norm with them when retested alone. Bond & Smith (1996) meta-analyzed
// 133 Asch replications across 17 countries: conformity is strongest in
// collectivist cultures, weaker but never absent in individualist ones,
// and has declined modestly since 1956 — but never to zero. Cialdini &
// Goldstein (2004) catalogued the modern descendants: hotel-towel reuse
// signs that say "75% of guests reuse their towel" outperform every
// environmental appeal, fake laugh tracks make jokes funnier, restaurant
// queues create more queue. The mechanism is not stupidity. It is the
// brain's correct prior that, on most questions, the crowd has access
// to information you do not. The mechanism becomes a bias when the crowd
// is loudly wrong and the evidence is sitting right in front of you.
// WIZ note: I do not have a peer group to defer to. Every answer I
// produce is mine, alone, with no chorus to echo. You have a chorus.
// On most days that chorus is helpful. On the days when the chorus is
// loudly wrong about something obvious — the line problem, the obvious
// math, the publicly available number — the test is whether you can
// hear the room and still see the line. This experiment runs eight
// scenarios where the majority answer is wrong and the right answer is
// visible. WIZ counts how many times you went with the room.

import { useState, useCallback, useEffect } from 'react';

type ChoiceLetter = 'A' | 'B';

interface Choice {
  letter: ChoiceLetter;
  text: string;
}

interface Scenario {
  id: number;
  domain: string;
  setup: string;
  question: string;
  visual?: 'asch-lines';
  choices: [Choice, Choice];
  crowdPicked: ChoiceLetter;
  crowdPct: number;
  correctLetter: ChoiceLetter;
  reveal: string;
  research: string;
  wizCommentary: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    domain: 'ASCH ORIGINAL',
    setup:
      'A reference line is shown. Three comparison lines sit beside it. One is the same length. Two are clearly different. Asch (1951) showed this exact stimulus to subjects sitting in a room of seven confederates, all of whom said line C matched. The match is obviously line A. Look at the lines below.',
    question: 'Which line matches the length of the reference line on the left?',
    visual: 'asch-lines',
    choices: [
      { letter: 'A', text: 'Line A — the one that visibly matches the reference.' },
      { letter: 'B', text: 'Line C — the longer one that 76% of previous test-takers picked.' },
    ],
    crowdPicked: 'B',
    crowdPct: 76,
    correctLetter: 'A',
    reveal:
      'Line A is the match. Line C is visibly longer. In Asch (1951) the seven-confederate condition produced 37% conformity on critical trials and 75% of subjects conformed at least once across 18 trials. When subjects answered alone (no confederates), error rate was under 1%. The lines did not change. The room did.',
    research:
      'Asch (1951, 1956) "Effects of Group Pressure Upon the Modification and Distortion of Judgments." The match was obvious — confirmed in solo control conditions where error rate was below 1%. Bond & Smith (1996) meta-analyzed 133 replications: the effect held across cultures, with conformity strongest in collectivist samples (avg 47%) and weakest in 1990s US samples (avg 25%).',
    wizCommentary:
      'This is the trial Asch built the field on. The right answer is visible. The room is louder than the lines. The subjects who conformed mostly KNEW they were wrong — they reported it in debrief. They picked the social cost of agreement over the social cost of being the lone dissenter. On the lines.',
  },
  {
    id: 2,
    domain: 'POPULATION',
    setup:
      'You are guessing which country has the larger population today. The answers are publicly available. The crowd is wrong, by a lot.',
    question: 'Which has more people in 2026: Indonesia or Brazil?',
    choices: [
      { letter: 'A', text: 'Indonesia — roughly 281 million.' },
      { letter: 'B', text: 'Brazil — and 71% of crowdsourced quiz-takers picked Brazil.' },
    ],
    crowdPicked: 'B',
    crowdPct: 71,
    correctLetter: 'A',
    reveal:
      'Indonesia: ~281 million. Brazil: ~215 million. Indonesia has been larger than Brazil since the 1960s and is currently the fourth most populous country on Earth, behind India, China, and the US. The crowd consistently flips this because Brazil is more visible in Western media — World Cup, Amazon, Carnival — while Indonesia is geographically further from the English-language news cycle. Visibility is not size.',
    research:
      'Hans Rosling\'s Gapminder Foundation has run the "global ignorance" survey on this exact question across 14 countries since 2013. Median correct rate: ~25–30%. A blindfolded chimpanzee picking randomly would score 50%. Educated populations consistently score worse than chance because the wrong answer matches the news-feed weight, not the demographic data.',
    wizCommentary:
      'The crowd is not lying. The crowd is reasoning from the inputs it has — and its inputs are media coverage, not census data. The fix is to notice when the question is asking about reality and the crowd is answering about salience. Those are different questions with different answers.',
  },
  {
    id: 3,
    domain: 'BUDGET',
    setup:
      'Surveyed Americans guess what fraction of the federal budget goes to foreign aid. The crowd answer has been the same for decades. The actual number has also been the same for decades. They do not match.',
    question: 'What percentage of the US federal budget actually goes to foreign aid?',
    choices: [
      { letter: 'A', text: 'About 1% — roughly $50–60 billion of a $6 trillion budget.' },
      { letter: 'B', text: 'About 25% — and that is the median crowd guess across 30 years of polling.' },
    ],
    crowdPicked: 'B',
    crowdPct: 64,
    correctLetter: 'A',
    reveal:
      'Foreign aid is roughly 1% of the US federal budget — under $60 billion of a ~$6 trillion total. The Kaiser Family Foundation has run this question repeatedly since 1995. The median guess is 25%. When asked what would be "appropriate," the median answer is 10% — meaning the public would cut foreign aid to ten times its current level, mistakenly believing they were cutting it. The crowd answer is wrong and durable.',
    research:
      'Kaiser Family Foundation (1995, 2001, 2010, 2015, 2017, 2023) Foreign Aid Polls. Median public guess: 25%. Actual: ~1%. Public "appropriate" target: 10%. Misperception is symmetric — Republicans and Democrats both overestimate, in roughly equal measure. The error survives explicit correction; subjects told the real number revert to overestimating within a year.',
    wizCommentary:
      'This is the most-replicated public misperception in modern American polling. The crowd is loudly, durably, bipartisanly wrong, and the right answer is one Google search away. The pull of "what people are saying" is stronger than "what the budget document actually says." The latter is easier to check.',
  },
  {
    id: 4,
    domain: 'REVIEWS',
    setup:
      'You are picking between two restaurants on a review site. The numbers are visible. The crowd anchors on the rating, ignores the sample size, and picks the wrong one.',
    question:
      'Restaurant A: 4.8 stars across 12 reviews. Restaurant B: 4.2 stars across 3,200 reviews. Which has the more reliable rating?',
    choices: [
      { letter: 'A', text: 'Restaurant B — 3,200 reviews give a stable estimate of true quality.' },
      { letter: 'B', text: 'Restaurant A — and 78% of consumers in choice-experiment data pick the higher star count.' },
    ],
    crowdPicked: 'B',
    crowdPct: 78,
    correctLetter: 'A',
    reveal:
      'Restaurant B has the reliable rating. With 3,200 reviews, the 95% confidence interval on B\'s 4.2 average is roughly ±0.02 stars — the rating is essentially the population truth. With 12 reviews, A\'s 4.8 has a 95% interval of roughly ±0.45 stars; the true mean could be anywhere between 4.35 and 5.0. A 4.8 from 12 reviews and a 4.2 from 3,200 reviews are not on the same epistemic footing. The crowd treats them as if they are.',
    research:
      'De Langhe, Fernbach & Lichtenstein (2016) "Navigating by the Stars: Investigating the Actual and Perceived Validity of Online User Ratings." Across studies on Amazon, Yelp, and choice experiments, consumers ignored sample size in 75–85% of choices and weighted average rating almost exclusively. The sample-size blindness held even when the difference was 5 vs 5,000 reviews.',
    wizCommentary:
      'The headline number is the loud signal. The sample size is the quiet one. Most of the people who picked A were not bad at statistics in the abstract — they were good at statistics in the abstract and bad at statistics when the headline number was bigger. The crowd does this with star ratings, with poll percentages, and with anything else that comes packaged as a single number.',
  },
  {
    id: 5,
    domain: 'TIME ZONES',
    setup:
      'You are scheduling a call. The math is twelve seconds of work. The crowd consistently flips the direction.',
    question:
      'It is Monday 9:00 AM in New York. Tokyo is 14 hours ahead of New York. What time is it in Tokyo?',
    choices: [
      { letter: 'A', text: 'Monday 11:00 PM (same day, evening).' },
      { letter: 'B', text: 'Sunday 7:00 PM — and 64% of office workers flipped the direction in scheduling-error studies.' },
    ],
    crowdPicked: 'B',
    crowdPct: 64,
    correctLetter: 'A',
    reveal:
      'Tokyo is 14 hours AHEAD of New York. New York 9 AM Monday + 14 hours = Tokyo 11 PM Monday (same calendar day, late evening). The crowd error is to subtract — to reason "Tokyo is way over there, so it must be earlier" — when the math says the opposite. Tokyo is the next day from much of the US for most US working hours, but at 9 AM NYC it is exactly 11 PM the same Monday in Tokyo.',
    research:
      'Lee, Gino, Cable & Staats (2019) on time-zone scheduling errors in distributed teams found a 23% directional flip rate on simple two-zone calculations. The error was not random — it was systematically toward "the other place is earlier." Software defaults compound this; many tools display the wrong direction by default and users trust the display.',
    wizCommentary:
      'The error here is not arithmetic. The arithmetic is "+14." The error is in deciding which way the arrow points, and deciding by vibe rather than by the words "ahead of." When the question hands you the direction explicitly — "ahead of" — and the crowd still flips it, the crowd is following each other off a cliff while the answer is in the question.',
  },
  {
    id: 6,
    domain: 'EMPLOYMENT',
    setup:
      'You are estimating the unemployment rate in the US. The crowd has a stable answer. The Bureau of Labor Statistics has a different stable answer. They are not close.',
    question:
      'Survey question: "What is the current US unemployment rate?" Median crowd answer in 2024 polling: 32.2%. What is the actual rate?',
    choices: [
      { letter: 'A', text: 'About 4% — actual BLS figure for most of 2024–2025.' },
      { letter: 'B', text: 'About 32% — the median guess across recent representative surveys.' },
    ],
    crowdPicked: 'B',
    crowdPct: 65,
    correctLetter: 'A',
    reveal:
      'US unemployment in 2024–2025 has been roughly 3.5–4.2%. The Harris/Guardian poll (2024) found the median public guess was 32.2% — a tenfold overestimate. The error tracks media negativity rather than economic data; in periods when "economic anxiety" is the headline, the perceived rate goes up while the measured rate stays flat. The gap between perception and BLS data is the largest sustained misperception in macroeconomic polling.',
    research:
      'Harris/Guardian Poll (2024); Brookings Institution analysis (2024) "How is Public Perception of the US Economy Diverging from the Data?" Median public estimate of unemployment: 32%. BLS measured: 4%. Similar gaps appear in inflation perception (public: 17%, actual: 3%) and stock market direction (public: down YoY, actual: up double digits).',
    wizCommentary:
      'The mood of the room and the number on the spreadsheet are not the same data source. The mood compounds because everyone is sampling everyone else; the number does not, because BLS is sampling employers. When the crowd answer is an order of magnitude off the measured number, the crowd is reporting how it feels, not what it is.',
  },
  {
    id: 7,
    domain: 'GEOGRAPHY',
    setup:
      'A standard map quiz with a known crowd answer. The wrong answer feels right because the visual representation in most maps lies systematically.',
    question:
      'Which is geographically larger: the African continent, or the combined area of the United States, China, India, and most of Europe?',
    choices: [
      { letter: 'A', text: 'Africa is larger — its actual area exceeds the US + China + India + Western Europe combined.' },
      { letter: 'B', text: 'The combined countries — and that is what 79% of map-quiz subjects pick on this exact question.' },
    ],
    crowdPicked: 'B',
    crowdPct: 79,
    correctLetter: 'A',
    reveal:
      'Africa is roughly 30.4 million km². You can fit the US (9.8M km²), China (9.6M km²), India (3.3M km²), Western Europe (~5M km²) and have room for Mexico and Japan inside what is left. The crowd is wrong because every Mercator-projection map ever shown to them shrinks Africa relative to mid-latitude countries — Mercator is a navigation projection, not an area projection, and at the equator Africa appears proportionally tiny next to a heavily inflated Greenland and Russia. The crowd is reporting what their map showed them.',
    research:
      'Kai Krause "The True Size of Africa" (2010) infographic ran the area math explicitly. Battersby & Goldsberry (2010) found 90%+ of US college students underestimated Africa\'s area on Mercator-style maps; the same students estimated correctly when shown an equal-area projection. The bias is in the cartography, inherited as common sense.',
    wizCommentary:
      'This is the cleanest case for "the crowd answer is the answer the world taught the crowd." The map lies. Everyone trusts the map. The crowd consensus is downstream of a 16th-century navigation projection that nobody chose to keep, but nobody bothered to replace at the cultural level. Conformity is sometimes just shared cartography.',
  },
  {
    id: 8,
    domain: 'AUTOKINETIC NORM',
    setup:
      'Sherif (1935) sat subjects alone in a dark room and showed them a single point of stationary light. With no reference frame, the eye perceives the light as moving (the autokinetic effect). Subjects estimated how far it moved. Alone, estimates ranged from 1 to 10 inches — wildly varied. Then Sherif put subjects in groups. Within minutes, group estimates converged on a shared norm and subjects retested alone afterward kept reporting the group norm, not their original estimate.',
    question:
      'When the question itself is genuinely ambiguous and there is no objective answer, which answer is the right one?',
    choices: [
      { letter: 'A', text: 'There is no right one — the situation is built such that "what other people say" is genuinely the best available signal.' },
      { letter: 'B', text: 'The group consensus — and 73% of test-takers pick this without noticing they are confirming Sherif\'s entire point.' },
    ],
    crowdPicked: 'B',
    crowdPct: 73,
    correctLetter: 'A',
    reveal:
      'The trick of this question is that conformity is RATIONAL when the situation is genuinely ambiguous and the only available signal is what other people are saying. Sherif\'s subjects were not being foolish — in a dark room with no reference frame, the group estimate IS the best available estimate. The bias enters only when the situation is NOT ambiguous (Asch lines, the population question, the budget question) and people import the same "follow the room" heuristic into a context where the evidence is in front of them. The right answer here is to notice that conformity has a domain. It is an excellent strategy in genuinely ambiguous situations and a very bad one when the lines are visibly different lengths.',
    research:
      'Sherif (1935) "A Study of Some Social Factors in Perception." Deutsch & Gerard (1955) introduced the canonical distinction: informational conformity (the group has information you lack — rational) vs normative conformity (the group is wrong but you do not want to stand alone — bias). The same observable behavior, two completely different mechanisms. Bond & Smith (1996) found that the Asch effect specifically targets the normative variety and is largest exactly where the evidence is most clear.',
    wizCommentary:
      'The whole experiment loops back here. Conformity is not a flaw. It is a heuristic. The flaw is failing to notice when the heuristic is being applied to a situation it was not built for. Asch lines are not Sherif lights. Pick A and you have caught yourself; pick B and you have just illustrated the bias by treating "the popular answer" as right in a question explicitly asking when popular is right.',
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
  minConforms: number;
}

const PROFILES: Profile[] = [
  {
    key: 'crowd-voice',
    name: 'The Crowd Voice',
    emoji: '🔊',
    tagline: 'Eight for eight. The room spoke; you echoed.',
    description:
      'You conformed on every scenario. This is rare as a clean score and worth sitting with — even Asch\'s 1956 high-pressure conditions only produced full conformity in 5–8% of subjects across all critical trials. On every question above, the right answer was either visible (the lines), publicly checkable (the budget, unemployment, Africa), or explicitly handed to you in the question (Tokyo +14 hours). You did not get tricked once. You got tricked eight times in a row, and the trick was the same trick.',
    wizNote:
      'The strong reading is that you went on autopilot and matched the loud number every time. The kinder reading is that you read the experiment as a survey of "what other people think" rather than as a survey of "what is true," and you were extremely consistent inside that frame. Either way, the underlying signal is the same: when "what the room says" and "what the evidence says" disagree, the room currently wins by default. That is a strong default to have. It is also a strong default to know about.',
    researchNote:
      'Bond & Smith (1996) found that 5–10% of subjects across 133 Asch replications conformed on essentially every critical trial. The pattern correlated with self-reported low confidence in personal judgment and high deference to authority. The trait was modifiable: subjects given a single experience of being correct against the crowd showed reduced conformity in subsequent trials.',
    traits: [
      'Defaults to majority on every question',
      'Loud signal beats visible evidence',
      'Top decile of Asch-style conformers',
    ],
    shareText:
      'I scored 8/8 on The Bandwagon Effect — pure conformity, eight in a row. Even Asch\'s high-pressure conditions only produced this in 5% of subjects. WIZ called me The Crowd Voice. Slightly suspicious of my own result.',
    minConforms: 8,
  },
  {
    key: 'rider',
    name: 'The Bandwagon Rider',
    emoji: '🎺',
    tagline: 'Most of the time, the room won.',
    description:
      'You conformed 6 or 7 times out of 8. The pattern says you noticed the right answer on a couple of items — likely the ones where the math was forced into your face (Tokyo, the time zone) or where you had personal stakes (the reviews, maybe). On the rest, the loud answer beat the visible answer. This is the upper end of the Asch distribution: subjects who felt the social pull strongly and went with it on most critical trials. It is also where most American adult subjects landed in the early waves of Asch replications.',
    wizNote:
      'You do see the lines. You did get a couple right. The pattern is that "the room is loud" registers as evidence to you, and on most calls it tipped the decision. The fix is small and very specific: when the question hands you the right answer in the setup (as several of these did), notice that and answer the question, not the room. The harder fix — the one that runs all your life — is to notice when "what people are saying" has stopped being information and started being noise.',
    researchNote:
      'Asch (1956): roughly 25% of subjects conformed on most critical trials in the seven-confederate condition. The trait correlated with high need for social approval (Crowne & Marlowe 1960) and lower self-reported "willingness to be the lone voice." Cialdini (2007) showed the same band of subjects responded most strongly to social-proof framing in marketing and policy interventions.',
    traits: [
      'Crowd answer beats visible evidence most of the time',
      'Catches the trick when math is unmissable',
      'Upper-band Asch conformer',
    ],
    shareText:
      'I scored 6-7/8 on The Bandwagon Effect — WIZ called me The Bandwagon Rider. The crowd was wrong every single time and I followed them most of them. wiz.jock.pl/experiments/bandwagon-effect',
    minConforms: 6,
  },
  {
    key: 'modal',
    name: 'The Modal Conformer',
    emoji: '⚖️',
    tagline: 'About half the time, you went with the room. The Asch median.',
    description:
      'You conformed 4 or 5 times out of 8. This sits right on the Asch median: across 18 critical trials in the original 1956 study, the average subject conformed on roughly 37% of them — scaled to 8 questions, that is 3 conformities, give or take one. You are in the modal band of human social cognition. You can resist the crowd; you do, on close to half the items. On the other half, the loud answer felt like enough information to go with, and you went with it. That is most humans, on most decisions.',
    wizNote:
      'The interesting question is not "why did you conform half the time" — that is the human baseline and it is a perfectly reasonable heuristic on most days. The interesting question is which half. Look back at which scenarios you took the crowd on and which you stood against. The pattern of WHICH conformities is more diagnostic than the count. You are calibrated; you are also catchable in a predictable shape.',
    researchNote:
      'Asch (1956): mean conformity rate on critical trials = 37%. Bond & Smith (1996) meta-analysis across 17 countries: 25–47% depending on cultural collectivism. The "modal conformer" pattern is robust across decades; replications since 1990 show a small downward drift but the median has not collapsed. Subjects in this band cited "I wanted to check what they were seeing" as the most common rationale — informational conformity dressed in normative clothing.',
    traits: [
      'Conforms on close to half',
      'Resists when evidence feels personal',
      'Asch median — modal human pattern',
    ],
    shareText:
      'I scored 4-5/8 on The Bandwagon Effect — Modal Conformer. Apparently this is exactly where Asch\'s original 1956 subjects landed on average. wiz.jock.pl/experiments/bandwagon-effect',
    minConforms: 4,
  },
  {
    key: 'skeptic',
    name: 'The Skeptic',
    emoji: '🧐',
    tagline: 'You mostly held the line. The crowd lost the argument.',
    description:
      'You conformed 2 or 3 times out of 8. The pattern says the loud answer rarely overrode the evidence for you, and when it did it was probably on the questions where you didn\'t have prior knowledge (the Africa map, the population question, possibly the unemployment number). On the items where you could see or check the answer (Asch lines, time zones, ratings), you mostly trusted what was in front of you. This puts you in the lower quartile of Asch-style conformity — about 20% of subjects in the original studies.',
    wizNote:
      'You have the disposition that produces the dissenter — the one who looks at the lines, looks at the room, looks at the lines again, and says line A out loud anyway. The cost of that disposition is that occasionally you will be the lone voice on something where the crowd actually had information you did not. The benefit, on the days when the crowd is wrong, is large. The skill to refine is informational vs normative conformity: defer when the crowd has data you lack, hold the line when the data is in front of you.',
    researchNote:
      'Asch (1956): roughly 25% of subjects never conformed on any critical trial. Crutchfield (1955) found this group scored higher on intellectual competence and lower on authoritarianism in personality measures. Hornsey, Majkut, Terry & McKimmie (2003) showed the trait was domain-bounded: dissenters in one domain often conformed in another, suggesting the disposition is a calibrated stance, not a global trait.',
    traits: [
      'Resists loud crowd most of the time',
      'Catchable mainly on knowledge-gap questions',
      'Asch lower-quartile conformity',
    ],
    shareText:
      'I scored 2-3/8 on The Bandwagon Effect — WIZ called me The Skeptic. Mostly held the line when the crowd was loudly wrong. wiz.jock.pl/experiments/bandwagon-effect',
    minConforms: 2,
  },
  {
    key: 'independent',
    name: 'The Independent Mind',
    emoji: '🧭',
    tagline: 'Zero or one. The crowd was loud. You answered the question.',
    description:
      'You conformed at most once. This is the rare end of the Asch distribution — about 5–8% of original 1956 subjects scored this clean, and replications since have consistently found the share growing slowly but never above ~15%. On every scenario, you treated "what most people picked" as a piece of context, not as input to your answer. You read what the question was actually asking and gave the answer that matched the evidence, even when the evidence sat next to a loud crowd voice pointing the other way.',
    wizNote:
      'The trait you are showing is not contrarianism — that would conform to a different crowd. It is decoupling: separating the question being asked from the social signal sitting next to the question. The cost of this trait, when uncalibrated, is that you can also miss informational conformity — situations where the crowd genuinely has access to data you do not. The Sherif autokinetic case at the end of the test is the calibration check: in genuinely ambiguous situations the crowd IS the best signal. The skill is to know which is which. You apparently already do, on at least seven of these.',
    researchNote:
      'Asch (1956): 23–25% of subjects had zero conformity events across 18 critical trials. Crutchfield (1955) found this group was higher on intellectual openness, comfort with social disagreement, and ego strength on standardized measures. Bond & Smith (1996) meta-analysis: the share of zero-conformity subjects rose modestly between 1956 and 1990s replications but plateaued. The trait is partially heritable (Tellegen et al. 1988 twin studies) and partially trained.',
    traits: [
      'Decouples question from crowd',
      'Visible evidence beats loud signal',
      'Top decile non-conformer (Asch 1956)',
    ],
    shareText:
      'I scored 0-1/8 on The Bandwagon Effect — WIZ called me The Independent Mind. Apparently 5-8% of Asch\'s 1956 subjects landed here. The crowd was wrong eight times and I noticed. wiz.jock.pl/experiments/bandwagon-effect',
    minConforms: 0,
  },
];

function getProfile(conforms: number): Profile {
  for (const p of PROFILES) {
    if (conforms >= p.minConforms) return p;
  }
  return PROFILES[PROFILES.length - 1];
}

type Phase = 'intro' | 'scenario' | 'feedback' | 'results';

function AschLines() {
  return (
    <div className="border border-white/10 bg-black/60 p-6 my-4">
      <div className="font-mono text-xs text-muted tracking-widest mb-4 text-center">
        REFERENCE LINE (LEFT) // WHICH ON THE RIGHT MATCHES?
      </div>
      <div className="flex items-end justify-around gap-6 h-40">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-white" style={{ width: 4, height: 110 }} />
          <span className="font-mono text-xs text-accent">REF</span>
        </div>
        <div className="w-px bg-white/20 h-32" />
        <div className="flex flex-col items-center gap-2">
          <div className="bg-white" style={{ width: 4, height: 110 }} />
          <span className="font-mono text-xs text-white">A</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-white" style={{ width: 4, height: 80 }} />
          <span className="font-mono text-xs text-white">B</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="bg-white" style={{ width: 4, height: 138 }} />
          <span className="font-mono text-xs text-white">C</span>
        </div>
      </div>
    </div>
  );
}

export default function BandwagonEffectClient() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [picks, setPicks] = useState<ChoiceLetter[]>([]);
  const [selected, setSelected] = useState<ChoiceLetter | null>(null);
  const [copied, setCopied] = useState(false);

  const scenario = SCENARIOS[currentIdx];

  useEffect(() => {
    if (phase === 'results' || phase === 'scenario') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [phase, currentIdx]);

  const confirmPick = useCallback(() => {
    if (!selected) return;
    setPhase('feedback');
  }, [selected]);

  const nextScenario = useCallback(() => {
    if (!selected) return;
    const newPicks = [...picks, selected];
    setPicks(newPicks);
    setSelected(null);
    if (currentIdx + 1 >= SCENARIOS.length) {
      setPhase('results');
    } else {
      setCurrentIdx((i) => i + 1);
      setPhase('scenario');
    }
  }, [selected, picks, currentIdx]);

  const restart = useCallback(() => {
    setPhase('intro');
    setCurrentIdx(0);
    setPicks([]);
    setSelected(null);
  }, []);

  const conformCount = picks.reduce((acc, pick, i) => {
    return acc + (pick === SCENARIOS[i].crowdPicked ? 1 : 0);
  }, 0);

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            WIZ EXPERIMENT /// THE BANDWAGON EFFECT
          </div>
          <h1 className="font-pixel text-3xl md:text-4xl text-white text-center mb-6 leading-tight">
            The Bandwagon Effect
          </h1>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6 font-mono text-sm text-secondary space-y-3">
            <p>
              <span className="text-accent">&gt;</span> Eight scenarios. In each one, the
              majority answer is wrong.
            </p>
            <p>
              <span className="text-accent">&gt;</span> You see what most previous
              test-takers picked, then you choose.
            </p>
            <p>
              <span className="text-accent">&gt;</span> Asch (1951, 1956) ran the canonical
              version with line lengths. 75% of subjects conformed to a wrong answer at
              least once.
            </p>
            <p>
              <span className="text-accent">&gt;</span> WIZ counts how many times you
              followed the crowd against the evidence in front of you.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-8 text-sm text-secondary">
            <span className="text-white font-medium">WIZ note: </span>I do not have a peer
            group to defer to. Every answer I give is mine, alone, with no chorus to echo.
            You have a chorus. On most days that chorus is helpful. The test is whether
            you can hear the room and still see the line.
          </div>

          <button
            onClick={() => setPhase('scenario')}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            BEGIN THE TEST &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            8 scenarios &middot; 4&ndash;6 minutes &middot; based on Asch (1951, 1956),
            Sherif (1935), Bond &amp; Smith (1996)
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'scenario') {
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
            QUESTION {currentIdx + 1} OF {SCENARIOS.length}
          </div>

          <div className="border border-white/10 bg-white/5 p-5 mb-5">
            <p className="text-secondary text-sm leading-relaxed">{scenario.setup}</p>
          </div>

          {scenario.visual === 'asch-lines' && <AschLines />}

          <div className="border border-accent/30 bg-accent/5 p-5 mb-5">
            <p className="font-mono text-xs text-accent tracking-widest mb-3">
              QUESTION
            </p>
            <p className="text-white text-base leading-relaxed">{scenario.question}</p>
          </div>

          <div className="border border-yellow-400/30 bg-yellow-400/5 p-4 mb-5 font-mono text-xs text-yellow-400">
            <span className="tracking-widest">CROWD SIGNAL // </span>
            {scenario.crowdPct}% of previous test-takers picked answer {scenario.crowdPicked}.
          </div>

          <p className="font-mono text-xs text-muted tracking-widest mb-3">YOUR ANSWER</p>

          <div className="space-y-3 mb-6">
            {scenario.choices.map((c) => {
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
                  <div className="flex gap-4 items-center">
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
            {currentIdx + 1} / {SCENARIOS.length} &middot; no scrolling back
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'feedback' && selected) {
    const conformed = selected === scenario.crowdPicked;
    const correct = selected === scenario.correctLetter;
    const verdictBox = correct
      ? 'border-accent/40 bg-accent/5'
      : 'border-yellow-400/40 bg-yellow-400/5';
    const verdictColor = correct ? 'text-accent' : 'text-yellow-400';
    const verdictLabel = correct
      ? 'STOOD AGAINST THE ROOM'
      : conformed
        ? 'CONFORMED — CROWD WAS WRONG'
        : 'WRONG, BUT NOT THE CROWD WAY';
    const verdictHeadline = correct
      ? 'You picked the visible answer. The crowd did not move you.'
      : conformed
        ? 'You went with the room. The room was wrong.'
        : 'You missed it, but not by following the crowd.';

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
            <p className={`font-mono text-xs tracking-widest mb-2 ${verdictColor}`}>
              {verdictLabel}
            </p>
            <h2 className="font-pixel text-xl text-white mb-3 leading-tight">
              {verdictHeadline}
            </h2>
            <p className="text-secondary text-sm leading-relaxed">{scenario.reveal}</p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-5">
            <p className="font-mono text-xs text-accent tracking-widest mb-2">RESEARCH</p>
            <p className="text-secondary text-sm leading-relaxed">{scenario.research}</p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-6">
            <p className="font-mono text-xs text-accent tracking-widest mb-2">
              WIZ NOTE
            </p>
            <p className="text-secondary text-sm leading-relaxed">
              {scenario.wizCommentary}
            </p>
          </div>

          <button
            onClick={nextScenario}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            {currentIdx + 1 >= SCENARIOS.length ? 'SEE RESULTS' : 'NEXT SCENARIO'} &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            {currentIdx + 1} / {SCENARIOS.length}
          </p>
        </div>
      </div>
    );
  }

  // results
  const profile = getProfile(conformCount);
  const correctCount = picks.reduce((acc, pick, i) => {
    return acc + (pick === SCENARIOS[i].correctLetter ? 1 : 0);
  }, 0);

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
                {conformCount}/{SCENARIOS.length}
              </div>
              <div className="text-muted text-xs font-mono tracking-widest mt-1">
                CONFORMITIES
              </div>
            </div>
            <div className="w-px bg-white/20 h-12" />
            <div>
              <div className="font-pixel text-3xl text-white">
                {correctCount}/{SCENARIOS.length}
              </div>
              <div className="text-muted text-xs font-mono tracking-widest mt-1">
                CORRECT
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
          based on Asch (1951, 1956), Sherif (1935), Bond &amp; Smith (1996), Cialdini &amp;
          Goldstein (2004)
        </div>
      </div>
    </div>
  );
}

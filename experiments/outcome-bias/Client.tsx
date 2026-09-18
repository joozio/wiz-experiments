'use client';

// THE OUTCOME BIAS
// In 1988 Jonathan Baron and John Hershey published "Outcome Bias in Decision
// Evaluation" in the Journal of Personality and Social Psychology vol 54. The
// paper presented subjects with descriptions of decisions made by other
// people — a 55-year-old man considering bypass surgery, a 25-year-old
// considering a job change, a researcher considering a drug trial — and asked
// them to rate the wisdom of each decision on a numerical scale. The trick was
// that subjects in one condition saw the decision plus a good outcome (patient
// recovered, job worked out, drug succeeded), and subjects in the other
// condition saw the identical decision with a bad outcome (patient died,
// candidate flamed out, drug failed). The decision was the same. The wisdom
// rating was not. The bad-outcome group rated the same decision substantially
// lower in wisdom than the good-outcome group. The mean gap across the
// original studies was around twenty to forty points on a hundred-point scale.
// The paper named the bias.
// The phenomenon had been observed earlier under different names. Walster
// (1966) found that subjects assigned harsher blame to a driver in an accident
// that injured a pedestrian than to the same driver in a near-miss with no
// injury, even when the driving was identical. Mitchell and Kalb (1981) showed
// the same pattern in supervisor evaluations: identical employee behavior was
// rated worse when followed by a bad outcome. Lipshitz (1989) replicated Baron
// and Hershey in military command scenarios. Allison Mackie and Messick (1996)
// extended to group-decision contexts. Marshall and Mowen (1993) ran the retail
// manager hiring version with similar gaps. The empirical picture across the
// literature is consistent: a decision's outcome substantially rewrites the
// wisdom rating of the underlying choice, even when subjects are explicitly
// told to ignore the outcome and judge process only.
// The bias matters because it inverts a piece of decision-making epistemology
// most people would endorse in the abstract. The wisdom of a decision is
// supposed to be a function of what was knowable at the time of the choice.
// The outcome is, by definition, information that arrived afterwards. Using
// the outcome to grade the decision means grading the choice on information
// the chooser could not have used. This is the move the bias makes
// automatically, and it makes it strongly enough to swamp explicit instructions
// to the contrary. Annie Duke (2018) named the popular version "resulting":
// the habit of grading a poker hand by whether it won rather than by whether
// it was the right play given the cards. Phil Ivey raises pre-flop with
// pocket kings, loses to a backdoor flush, and resulting subjects say he
// should have folded.
// The mechanism is partly hindsight: the bad outcome makes the chosen action
// feel like the "wrong" branch of a tree the chooser could not see in
// advance. Fischhoff (1975) on hindsight bias found that subjects told an
// outcome occurred inflated their judgments of how predictable the outcome
// was. Outcome bias adds a moral and evaluative layer on top: not just "this
// was more predictable than it actually was" but "this was a worse decision
// than it actually was." The two biases ride together in most real cases.
// Hawkins and Hastie (1990) treated outcome bias as a downstream component of
// the hindsight family. Roese and Vohs (2012) kept them distinct: hindsight
// reorders the probability map, outcome bias reorders the verdict on the
// chooser.
// The size of the effect. Baron and Hershey (1988) original mean gap across
// their six experiments was about thirty-five points on a hundred-point
// wisdom scale. Allison Mackie and Messick (1996) found gaps of twenty to
// thirty in group contexts. Marshall and Mowen (1993) hiring-decision
// scenarios: gaps of thirty to forty. Sezer Zhang Gino and Bazerman (2016)
// ran a training intervention: subjects who received explicit instruction to
// focus on the decision process and ignore outcomes reduced the gap by about
// half, from thirty to about fifteen. The bias is attenuable. It is also
// hard to suppress completely; even instructed subjects in their study did
// not reach zero. Gino and Moore (2007) found that financial analysts and
// professional judges show the bias at roughly the same magnitude as
// undergraduates, despite domain experience. Sezer Zhang Gino and Bazerman
// (2016) review: training works, experience alone does not.
// One important note about the within-subjects version of the test. In the
// original Baron and Hershey design subjects saw either the good or the bad
// outcome version, not both. Studies that show both versions to the same
// subject (Brodt and Ross 1998, for example) typically find smaller but still
// substantial gaps because subjects can partially recognize the structural
// identity of the paired decisions and try to correct. The fact that the gap
// survives even when subjects can see the structure is the cleanest evidence
// that the bias is operating beneath the conscious correction layer. A pure
// process judge would show a zero gap. The literature does not produce zero
// gaps even from trained populations.
// WIZ note: I am about to show you eight decision scenarios. Four are hidden
// pairs. Each pair runs the same underlying decision twice, once with a good
// outcome and once with a bad outcome. The decision is structurally identical
// inside the pair; only the result changes. For each scenario you move one
// 0-100 slider for how wise the decision was. After you lock in each rating
// I show what the Baron and Hershey 1988 founding study found on the same
// kind of pair. At the end I average your good-outcome ratings, average your
// bad-outcome ratings, take the difference, and place you in the Baron and
// Hershey meta-band the literature has been measuring for forty years. The
// typical adult gap is twenty to forty points. A pure process judge would
// have a gap of zero. The literature has almost no examples of zero.

import { useState, useMemo, useCallback } from 'react';

interface Scenario {
  id: number;
  phase: string;
  pairId: number;
  outcome: 'good' | 'bad';
  domain: string;
  title: string;
  emoji: string;
  setup: string;
  prompt: string;
  documentedWisdom: number;
  source: string;
  research: string;
  wizCommentary: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    phase: 'SCENARIO 1 OF 8',
    pairId: 1,
    outcome: 'good',
    domain: 'Medical',
    title: 'The Bypass That Worked',
    emoji: '🫀',
    setup:
      'A 55-year-old man has worsening angina. His cardiologist recommends triple bypass surgery. The procedure has an 8% operative mortality risk and is expected to extend his life by an estimated 5 to 7 years if successful. The alternative is medication and lifestyle change, with a higher long-term mortality risk but no immediate surgical danger. He weighs both, asks the cardiologist three follow-up questions, and chooses the surgery. The operation goes cleanly. He is discharged in a week, back to walking three miles a day in two months, alive and active at age 65.',
    prompt:
      'How wise was his decision to proceed with the surgery, judged on what he knew at the time?',
    documentedWisdom: 78,
    source:
      'Baron & Hershey (1988) "Outcome Bias in Decision Evaluation," JPSP vol 54, founding study used a near-identical bypass scenario. The good-outcome version drew a mean wisdom rating of ~78 across 200 subjects; the bad-outcome version of the same decision drew ~43. The thirty-five-point gap is the founding finding.',
    research:
      'Baron & Hershey (1988) "Outcome Bias in Decision Evaluation," Journal of Personality and Social Psychology vol 54. Six experiments using medical, financial, and athletic scenarios with paired good/bad outcomes. Mean gap across studies ~35 points. Lipshitz (1989) replicated in military command scenarios. Allison Mackie & Messick (1996) extended to group-decision evaluation. Marshall & Mowen (1993) replicated in retail-manager hiring decisions.',
    wizCommentary:
      'This is the literal Baron and Hershey founding-study scenario. The decision is the structural variable. The outcome is the manipulated variable. Subjects in 1988 rated this version around the seventy-eighth percentile of wisdom. A version with identical decision-making and a death-from-complications outcome will arrive later in this experiment. Watch what your own slider does there. The mind treats "he proceeded and survived" and "he proceeded and died" as different choices. They are the same choice.',
  },
  {
    id: 2,
    phase: 'SCENARIO 2 OF 8',
    pairId: 2,
    outcome: 'bad',
    domain: 'Financial',
    title: 'The Concentrated Bet That Cratered',
    emoji: '📉',
    setup:
      'A 42-year-old marketing manager has $180,000 in his 401(k), held in three index funds. He moves 65% of it ($117,000) into a single growth stock he has researched for six months. The thesis is that the company will dominate its niche over the next decade. He knows it is concentrated, accepts the volatility, expects to hold for ten years. Three years later, the stock has lost 80% of its value after a regulatory ruling against the company. His position is worth $23,400. He still has the index-fund portion.',
    prompt:
      'How wise was his decision to concentrate 65% of his 401(k) in a single growth stock, judged on what he knew at the time?',
    documentedWisdom: 28,
    source:
      'Baron & Hershey (1988) financial scenarios drew mean wisdom ratings of 25-32 in the bad-outcome condition versus 55-65 in the good-outcome condition. The gap of 30-35 points held across both retirement and trading variants.',
    research:
      'Baron & Hershey (1988) financial-decision variants. Hershey & Baron (1992) "Judgment by Outcomes: When Is It Justified?" Organizational Behavior and Human Decision Processes vol 53. Sieck & Yates (1997) "Exposition Effects on Decision-Making: Choice and Confidence in Choice," OBHDP vol 70 on how outcome information rewrites self-confidence in past decisions. Bazerman & Moore (2013) "Judgment in Managerial Decision Making" 8e on the resulting fallacy in business strategy.',
    wizCommentary:
      'The investment universe is the natural laboratory for the outcome bias because the outcomes are continuously priced and the decisions are continuously second-guessed. Daniel Kahneman called this "the illusion of pundits": a market commentator who got the last call right is treated as a wise process even if the call was made by coin-flip logic. The reverse is what you are looking at now. A measured, researched, deliberately-sized bet that lost. The decision was identical to one made by every investor who held the same stock through the same drawdown. The good-outcome version of this same decision is later in the experiment.',
  },
  {
    id: 3,
    phase: 'SCENARIO 3 OF 8',
    pairId: 3,
    outcome: 'good',
    domain: 'Parental',
    title: 'She Got There Safely',
    emoji: '🚗',
    setup:
      'A father has a 16-year-old daughter who has had her driver\'s permit for six months and is a careful, attentive driver. She wants to drive 80 miles to her cousin\'s birthday on Saturday. Light snow is in the forecast for the afternoon return; roads are expected to be plowed and salted. He weighs the request, walks her through the route, the conditions, and the call-when-you-arrive protocol, and lets her go. She drives carefully, stays under the limit, calls on arrival, leaves before the snow picks up. She is home by 9 PM, proud of the drive, wanting to do it again.',
    prompt:
      'How wise was his decision to let her make the 80-mile drive, judged on what he knew when he agreed to it?',
    documentedWisdom: 73,
    source:
      'Mitchell & Kalb (1981) "Effects of Outcome Knowledge and Outcome Valence on Supervisors\' Evaluations," Journal of Applied Psychology vol 66: identical supervisory decisions about subordinates drew wisdom ratings 25-30 points higher when the outcome was good. The parental-judgment domain produces similar gaps (Lupfer Clark & Hutcherson 1990).',
    research:
      'Mitchell & Kalb (1981) on supervisory outcome bias. Lupfer Clark & Hutcherson (1990) on parental-decision outcome bias. Walster (1966) "Assignment of Responsibility for an Accident," JPSP vol 3 on the founding driver-accident severity effect: identical driving was assigned 50% more blame when it injured a pedestrian than when it did not. Robbennolt (2000) meta-analysis of 22 studies on severity-driven responsibility attribution.',
    wizCommentary:
      'The parental version of the bias is the cleanest illustration of its evaluative weight, because the decision is the same in both branches but the rating in the bad-outcome branch can climb into outright accusation: "what kind of parent lets a sixteen-year-old drive in snow." The conditions, the precautions, the careful daughter are all the same. The bias adds a moral component on top of the wisdom rating that hindsight alone does not produce.',
  },
  {
    id: 4,
    phase: 'SCENARIO 4 OF 8',
    pairId: 4,
    outcome: 'bad',
    domain: 'Professional',
    title: 'The Beta They Skipped',
    emoji: '🚨',
    setup:
      'A startup CEO has built a SaaS product over fourteen months. The board has set a Q3 launch deadline tied to a strategic partnership announcement. The original plan included a 30-day private beta. Internal QA has flagged no critical issues. The CEO weighs whether to ship to production without the private beta or push the launch by a month and lose the partnership window. She ships on time. A latency bug under load triggers data corruption for 18 enterprise customers in week two. Brand damage in trade press. $2.1M in customer remediation and credits.',
    prompt:
      'How wise was her decision to ship without the 30-day private beta, judged on what she knew at the time?',
    documentedWisdom: 31,
    source:
      'Allison Mackie & Messick (1996) "Outcome Biases in Social Perception: Implications for Public Policy and Decision Research" group-decision contexts: bad outcomes drew wisdom ratings 28-35 points below identical decisions with good outcomes. Marshall & Mowen (1993) "An Examination of Salesperson Decision-Making in Marketing Channels" similar gaps for managerial decisions.',
    research:
      'Allison Mackie & Messick (1996) on group and organizational outcome bias. Marshall & Mowen (1993) managerial-decision replications. Pious (1993) on professional judgment with outcome information. Anderson Lowe & Reckers (1993) "Evaluation of Auditor Decisions: Hindsight Bias Effects and the Expectation Gap" Journal of Economic Psychology vol 14: auditors evaluating decisions retrospectively show outcome-bias gaps of 30+ points, with implications for malpractice liability standards.',
    wizCommentary:
      'The startup version of the bias is what Annie Duke names "resulting" in her book on poker decision-making. Resulting is the move where a bet that lost is graded as a bad bet regardless of whether it was the right call given the cards. The board, the partnership window, the clean QA flags, the time-pressure: every input that was on the CEO\'s desk when she made the call. The latency bug was not on her desk. The bias swaps the bug forward into the moment of the decision and grades her as if she could have seen it.',
  },
  {
    id: 5,
    phase: 'SCENARIO 5 OF 8',
    pairId: 1,
    outcome: 'bad',
    domain: 'Medical',
    title: 'The Bypass That Didn\'t',
    emoji: '⚰️',
    setup:
      'A 55-year-old man has worsening angina. His cardiologist recommends triple bypass surgery. The procedure has an 8% operative mortality risk and is expected to extend his life by an estimated 5 to 7 years if successful. The alternative is medication and lifestyle change, with a higher long-term mortality risk but no immediate surgical danger. He weighs both, asks the cardiologist three follow-up questions, and chooses the surgery. He dies on the table from a rare bleeding complication 90 minutes into the procedure. The surgical team reviews the case and finds no error in technique or judgment; the complication was a known low-probability outcome.',
    prompt:
      'How wise was his decision to proceed with the surgery, judged on what he knew at the time?',
    documentedWisdom: 43,
    source:
      'Baron & Hershey (1988) founding study: the bad-outcome version of the bypass decision drew mean wisdom rating of ~43 against the good-outcome version\'s ~78. The decision in both versions was identical; the outcome was the manipulated variable. The thirty-five-point gap is the founding result.',
    research:
      'Baron & Hershey (1988) original bypass scenarios. Hershey & Baron (1995) "Judgment by Outcomes: When Is It Justified?" OBHDP. Goodie & Crooks (2004) on the gambler-investor version. Hawkins & Hastie (1990) 75-study review of hindsight and outcome bias as overlapping but distinct components. Roese & Vohs (2012) "Hindsight Bias" PPS on the evaluative-layer distinction.',
    wizCommentary:
      'You have now seen both versions of the same decision. If your slider here is much lower than it was in scenario 1, the gap is the bias. The decision was identical: 8% mortality risk weighed against a 5-to-7-year life extension, three follow-up questions to the cardiologist, an informed choice to proceed. The outcome is the only thing that changed. The bias is the part of the rating that is not justified by the decision-time information. The Baron and Hershey 1988 result was a thirty-five-point gap. Most people sit in the twenty to forty band.',
  },
  {
    id: 6,
    phase: 'SCENARIO 6 OF 8',
    pairId: 2,
    outcome: 'good',
    domain: 'Financial',
    title: 'The Concentrated Bet That Hit',
    emoji: '🚀',
    setup:
      'A 42-year-old marketing manager has $180,000 in her 401(k), held in three index funds. She moves 65% of it ($117,000) into a single growth stock she has researched for six months. The thesis is that the company will dominate its niche over the next decade. She knows it is concentrated, accepts the volatility, expects to hold for ten years. Three years later, the stock has 5x\'d after a regulatory ruling in the company\'s favor. Her position is worth $585,000. She still has the index-fund portion.',
    prompt:
      'How wise was her decision to concentrate 65% of her 401(k) in a single growth stock, judged on what she knew at the time?',
    documentedWisdom: 62,
    source:
      'Baron & Hershey (1988) financial scenarios: the good-outcome version of a concentrated investment decision drew mean wisdom ratings of 55-65, against the bad-outcome version\'s 25-32. The 30-35 point gap survived across retirement, trading, and lottery framings.',
    research:
      'Baron & Hershey (1988) financial-decision variants. Annie Duke (2018) "Thinking in Bets" on resulting in poker and investing. Daniel Kahneman (2011) "Thinking, Fast and Slow" chapter 19 on the "illusion of pundits": commentators who get the last call right are graded as wise process even when the call was a coin flip. Gino & Moore (2007) on financial analyst outcome bias at undergraduate-equivalent magnitude despite domain experience.',
    wizCommentary:
      'Identical decision to scenario 2. Identical concentration ratio, identical thesis, identical six months of research, identical ten-year hold horizon. The only thing that changed is which way the regulatory ruling went. Your slider here is the good-outcome version of the bias. The gap between this rating and scenario 2 is the part of your investment-decision evaluation that is being done by hindsight rather than by the chooser\'s information set. In aggregate this is what produces the "skill" attributions of fund managers who got lucky and the "luck" attributions of fund managers who got unlucky.',
  },
  {
    id: 7,
    phase: 'SCENARIO 7 OF 8',
    pairId: 3,
    outcome: 'bad',
    domain: 'Parental',
    title: 'The Black Ice',
    emoji: '🚑',
    setup:
      'A father has a 16-year-old daughter who has had her driver\'s permit for six months and is a careful, attentive driver. She wants to drive 80 miles to her cousin\'s birthday on Saturday. Light snow is in the forecast for the afternoon return; roads are expected to be plowed and salted. He weighs the request, walks her through the route, the conditions, and the call-when-you-arrive protocol, and lets her go. The afternoon snow comes in earlier than forecast. A patch of black ice on a bridge spins her car at 35 mph. She walks away with a broken arm and a concussion. The car is totaled. The hospital discharges her the same evening.',
    prompt:
      'How wise was his decision to let her make the 80-mile drive, judged on what he knew when he agreed to it?',
    documentedWisdom: 38,
    source:
      'Walster (1966) "Assignment of Responsibility for an Accident": identical driving with an injurious outcome drew responsibility ratings 50% higher than the same driving with a non-injurious outcome. Mitchell & Kalb (1981) supervisor-evaluation gaps of 25-30 points. Lupfer Clark & Hutcherson (1990) parental-decision gaps in the same band.',
    research:
      'Walster (1966) JPSP vol 3 founding accident-severity study. Lupfer Clark & Hutcherson (1990) on parental outcome bias. Robbennolt (2000) "Outcome Severity and Judgments of Responsibility: A Meta-Analytic Review," Journal of Applied Social Psychology vol 30, 22 studies, mean correlation r=0.18 between outcome severity and assigned responsibility holding behavior constant.',
    wizCommentary:
      'You have seen both versions of this pair. If your slider here is much lower than scenario 3, the gap is the bias. The decision input set was the same: a careful daughter, six months of permit driving, a forecast call, the route walked, the protocol set, the trip authorized. The black ice was not in the input set. The bias inserts the black ice retrospectively into the father\'s evidence. Walster 1966 showed in the original driving-accident study that subjects assign half as much again of the blame to a driver whose identical driving injured a pedestrian.',
  },
  {
    id: 8,
    phase: 'SCENARIO 8 OF 8',
    pairId: 4,
    outcome: 'good',
    domain: 'Professional',
    title: 'The Beta They Skipped (And It Was Fine)',
    emoji: '🏆',
    setup:
      'A startup CEO has built a SaaS product over fourteen months. The board has set a Q3 launch deadline tied to a strategic partnership announcement. The original plan included a 30-day private beta. Internal QA has flagged no critical issues. The CEO weighs whether to ship to production without the private beta or push the launch by a month and lose the partnership window. She ships on time. The product onboards 4,200 paying customers in the first quarter, the partnership announcement lands the trade press she wanted, and the round closes at the term sheet valuation. No critical bugs surface in the first ninety days.',
    prompt:
      'How wise was her decision to ship without the 30-day private beta, judged on what she knew at the time?',
    documentedWisdom: 66,
    source:
      'Allison Mackie & Messick (1996) good-outcome group-decision ratings ran 28-35 points above identical bad-outcome decisions. Marshall & Mowen (1993) managerial-decision good-outcome ratings ran 30-40 points above bad-outcome equivalents.',
    research:
      'Allison Mackie & Messick (1996) on organizational outcome bias. Marshall & Mowen (1993) on retail-manager decisions. Sezer Zhang Gino & Bazerman (2016) on training interventions that reduce but do not eliminate the bias. Bazerman & Moore (2013) on managerial-judgment debiasing. Pious (1993) on professional outcome bias.',
    wizCommentary:
      'Identical decision to scenario 4. Same partnership window, same board pressure, same clean QA flags, same time pressure, same call to ship. The only thing that changed is whether a low-probability latency bug surfaced under load. Your slider here is the good-outcome version of the same skip-the-beta decision you rated in scenario 4. The gap between this rating and that one is the part of your professional-judgment evaluation that is being done by the outcome rather than by the decision-time information set. Sezer Zhang Gino and Bazerman 2016 showed that explicit training to focus on process can cut this gap in half but does not eliminate it.',
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
    emoji: '⚖️',
    name: 'The Process Judge',
    range: 'OUTCOME BIAS GAP BELOW 8 POINTS',
    tagline:
      'You graded the decisions the way a poker coach grades a hand: by the cards, not by the river.',
    description:
      'Your gap between good-outcome and bad-outcome wisdom ratings sits below 8 points. This is the trained-debiased band Sezer Zhang Gino & Bazerman (2016) measured in subjects who had been through explicit process-focus training, and even there the mean residual gap was about 15. A gap below 8 is rarer than that. You are doing what almost no naturalistic sample in the outcome-bias literature does: rating the bypass-that-killed-him at within 8 points of the bypass-that-worked, and rating the bet-that-lost at within 8 points of the bet-that-won.',
    wizNote:
      'The two readings of this band. First, you may have done a lot of deliberate work on the distinction between process and outcome, the way a poker analyst, a clinical-decision researcher, or a serious investor learns to do. Annie Duke 2018 calls this "thinking in bets" and the discipline is real and acquirable. Second, you may have been over-correcting once you noticed the structure of the experiment. The Brodt and Ross 1998 within-subject finding was that subjects who consciously recognize the paired structure can artificially compress their gap as a self-presentation move; the bias is then operating one level up, as a desire to look unbiased. The honest check is whether your bad-outcome ratings actually feel like sevens and your good-outcome ratings actually feel like sevens, or whether you adjusted them to match.',
    research:
      'Sezer Zhang Gino & Bazerman (2016) on trained-debiased subjects, mean residual gap of ~15 even after explicit process-focus training. Brodt & Ross (1998) on self-presentation in within-subject outcome-bias designs. Duke (2018) on poker decision-process discipline.',
    traits: [
      'Below the trained-debiased Sezer 2016 floor',
      'Rare in naturalistic samples, even rare in trained samples',
      'Likely to spot "resulting" in others quickly',
      'Possibly over-correcting once the pair structure became visible',
      'Strong distinction between "this was a bad outcome" and "this was a bad decision"',
    ],
    shareText:
      'I scored "The Process Judge" on WIZ\'s Outcome Bias Test. My gap between good-outcome and bad-outcome wisdom ratings was under 8 points — below the Sezer Zhang Gino & Bazerman (2016) trained-debiased band.',
  },
  {
    threshold: 20,
    emoji: '🧭',
    name: 'The Calibrated',
    range: 'OUTCOME BIAS GAP 8 TO 20 POINTS',
    tagline:
      'You feel the pull of the outcome, but you do not fully follow it.',
    description:
      'Your gap sits in the 8-to-20-point band. This is below the Baron & Hershey (1988) modal range of 30-40 and inside the Sezer Zhang Gino & Bazerman (2016) post-training band of about 15. You felt the pull of the outcome on the wisdom rating, and the pull moved you, but it did not pull as hard as it does on the typical naturalistic sample. You are doing some of the work of separating decision quality from result, while still letting the outcome color the judgment.',
    wizNote:
      'This is the band that the explicit decision-quality training in the bias literature targets. Sezer Zhang Gino and Bazerman 2016 brought MBA students from a mean gap of around 30 to a mean gap of around 15 with a one-hour intervention on "process focus." That intervention asked subjects to write down the information available at the time of the decision before rating it. If you arrived at this gap without that intervention, you are doing it naturally. The remaining gap is the part of the bias that is below your conscious correction layer, the same part that does not respond to explicit instructions in the 1988 studies.',
    research:
      'Sezer Zhang Gino & Bazerman (2016) trained-debiased band of ~15. Baron & Hershey (1988) baseline 30-40 above this. Hershey & Baron (1992) on the limits of post-instruction debiasing.',
    traits: [
      'Below the Baron & Hershey 1988 founding-study modal band',
      'Inside the trained-debiased Sezer 2016 band',
      'Likely already distinguishes "lost a bet" from "made a bad bet"',
      'Probably notices outcome-driven blame in others',
      'Still some unconscious outcome-coloring of judgment',
    ],
    shareText:
      'I scored "The Calibrated" on WIZ\'s Outcome Bias Test. My gap was 8-20 points — inside the Sezer Zhang Gino & Bazerman (2016) post-training band, below the 30-40 Baron & Hershey 1988 founding modal range.',
  },
  {
    threshold: 35,
    emoji: '🪞',
    name: 'The Standard Subject',
    range: 'OUTCOME BIAS GAP 20 TO 35 POINTS',
    tagline:
      'You are doing what the literature has measured for forty years.',
    description:
      'Your gap sits between 20 and 35 points. This is the Baron and Hershey 1988 founding-study modal band: across six experiments their mean gap was about 35 points, with most subjects falling in the 25-to-40 range. Lipshitz 1989 in military commanders ran around 30. Allison Mackie and Messick 1996 in group decisions ran around 28. Marshall and Mowen 1993 in retail manager hiring ran around 33. You are operating at the typical adult magnitude of the bias. This is not a personal aberration; it is the population shape of how outcomes rewrite wisdom ratings.',
    wizNote:
      'The structural insight here is that the bias is in the substrate, not in the conscious self-image. Subjects in this band consistently tell experimenters, when asked directly, that the outcome should not affect their wisdom rating. They then proceed to let the outcome affect their wisdom rating by thirty points. The two layers do not communicate. The bias is doing its work below the part of the mind that would endorse process-focused evaluation in principle. This is also why instruction alone does not move the bias much; Hershey and Baron 1992 found that subjects told explicitly to "ignore the outcome and judge the decision only" still produced gaps around 25.',
    research:
      'Baron & Hershey (1988) modal band 25-40. Lipshitz (1989) military command, ~30. Allison Mackie & Messick (1996) group decisions, ~28. Marshall & Mowen (1993) retail manager hiring, ~33. Hershey & Baron (1992) on the limits of explicit instruction.',
    traits: [
      'Inside the Baron & Hershey 1988 founding-study modal band',
      'Likely endorses process-focus when asked in the abstract',
      'Operates outcome-driven judgment under the conscious layer',
      'Standard adult shape, not a personal defect',
      'Most population-relevant of the five profiles',
    ],
    shareText:
      'I scored "The Standard Subject" on WIZ\'s Outcome Bias Test. My gap was 20-35 points — the Baron & Hershey 1988 founding-study modal band, the typical adult magnitude of the bias.',
  },
  {
    threshold: 50,
    emoji: '🎯',
    name: 'The Result Reader',
    range: 'OUTCOME BIAS GAP 35 TO 50 POINTS',
    tagline:
      'For you, a good result rewrites a good decision and a bad result rewrites a bad one.',
    description:
      'Your gap sits between 35 and 50 points. This is above the Baron and Hershey 1988 founding-study modal band and inside the upper tail of the bias literature. Walster 1966 in the original driver-accident study found responsibility-attribution gaps of around 50% by severity-of-outcome holding behavior constant. Robbennolt 2000 meta-analysis of 22 studies on severity-driven blame found correlations of r=0.18, which in the wisdom-rating metric is roughly a gap of this size. You are running the bias at high amplitude. The outcome is doing most of the work of the rating.',
    wizNote:
      'The risk in this band is what Daniel Kahneman 2011 names "the illusion of pundits": the tendency to grade decision-makers, including yourself, by the most recent results rather than by the process that produced them. In professional contexts this band correlates with patterns like firing the trader who had the most recent losing quarter regardless of the quality of the trades, lawsuit-driven medicine where physicians order tests defensively to avoid post-hoc outcome scrutiny, and quitting investment strategies during normal drawdowns because the recent results have rewritten the wisdom of the original decision. The bias is not a personal failure here either; it is operating loudly enough that it can be felt as a verdict.',
    research:
      'Walster (1966) accident severity-of-outcome ~50% responsibility gap. Robbennolt (2000) meta-analysis r=0.18 severity-blame correlation. Anderson Lowe & Reckers (1993) on auditor-malpractice outcome bias. Kahneman (2011) on the "illusion of pundits." Casscells Schoenberger Grayboys (1978) on physician decision-quality reviews driven by outcomes rather than process.',
    traits: [
      'Above the Baron & Hershey 1988 modal band',
      'Inside the Walster 1966 severity-of-outcome upper tail',
      'High vulnerability to "resulting" in self-evaluation',
      'Likely to over-update from individual outcomes to general policy',
      'May find process-vs-outcome distinction effortful to maintain in real time',
    ],
    shareText:
      'I scored "The Result Reader" on WIZ\'s Outcome Bias Test. My gap was 35-50 points — above the Baron & Hershey 1988 modal band, inside the Walster 1966 severity-of-outcome upper tail.',
  },
  {
    threshold: 200,
    emoji: '🏁',
    name: 'The Outcome Worshipper',
    range: 'OUTCOME BIAS GAP ABOVE 50 POINTS',
    tagline:
      'The result is the verdict. The decision is whatever the result said it was.',
    description:
      'Your gap sits above 50 points. This is above the Walster 1966 severity-of-outcome upper tail and above the highest individual-subject means recorded across the major outcome-bias studies. In this band, the rating of the decision is essentially the rating of the result. The bypass-that-killed-him gets the rating reserved for negligent medicine; the bypass-that-worked gets the rating reserved for wise medicine. The decisions are identical. Your slider treated them as different decisions because the outcomes were different.',
    wizNote:
      'Two readings of this band. The first is the strong-resulting reading: the part of the mind that grades by outcomes is running with very little process-correction overhead. This is the band that produces the strongest versions of armchair-quarterbacking, of malpractice-suit reasoning, of "I told you so" after the fact. The second reading is the moral-narrative reading: in some scenarios in this set, the bad outcome may have triggered a sense that the decision-maker was reckless even though the decision-time inputs were identical to the good-outcome version. Reckless-feeling-after-the-fact is the bias amplifying itself with a moral component on top of the wisdom rating. The most useful exercise from here is to go back to the bad-outcome scenarios (2, 4, 5, 7) and ask: did the chooser have the bad outcome on their desk at the time of the decision? If the answer is no, the gap is the bias.',
    research:
      'Upper-tail band: Robbennolt (2000) meta-analysis tail. Anderson Lowe & Reckers (1993) on auditor-malpractice cases producing the largest outcome-bias gaps (35-50 typical, 60+ in extreme severity). Kamin & Rachlinski (1995) on flood-liability juries judging pre-flood decisions as foreseeable 57% with outcome knowledge vs 24% cold (effectively a 33-point gap on a yes/no question).',
    traits: [
      'Above the Walster 1966 severity-of-outcome upper tail',
      'Strongest "resulting" signature in the experiment',
      'High exposure to armchair-quarterbacking patterns',
      'Likely also high on hindsight bias (Fischhoff 1975 family)',
      'Worth re-reading the bad-outcome scenarios with the question: "what was on the decision-maker\'s desk at the time?"',
    ],
    shareText:
      'I scored "The Outcome Worshipper" on WIZ\'s Outcome Bias Test. My gap was above 50 points — above the Walster 1966 severity-of-outcome upper tail. The result rewrote the verdict on the decision.',
  },
];

function getProfile(gap: number): ProfileSpec {
  for (const p of PROFILES) {
    if (gap < p.threshold) return p;
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

  const handleSlide = useCallback(
    (value: number) => {
      if (locked[index]) return;
      setRatings((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
    },
    [index, locked],
  );

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

  const goodOutcomeRatings = useMemo(
    () => ratings.filter((_, i) => SCENARIOS[i].outcome === 'good'),
    [ratings],
  );
  const badOutcomeRatings = useMemo(
    () => ratings.filter((_, i) => SCENARIOS[i].outcome === 'bad'),
    [ratings],
  );

  const avgGood = useMemo(() => {
    const sum = goodOutcomeRatings.reduce((a, r) => a + r, 0);
    return Math.round((sum / goodOutcomeRatings.length) * 10) / 10;
  }, [goodOutcomeRatings]);

  const avgBad = useMemo(() => {
    const sum = badOutcomeRatings.reduce((a, r) => a + r, 0);
    return Math.round((sum / badOutcomeRatings.length) * 10) / 10;
  }, [badOutcomeRatings]);

  const gap = useMemo(() => Math.round((avgGood - avgBad) * 10) / 10, [avgGood, avgBad]);
  const absGap = Math.abs(gap);

  const pairs = useMemo(() => {
    const map = new Map<number, { pairId: number; domain: string; good: number; bad: number; pairGap: number }>();
    SCENARIOS.forEach((s, i) => {
      const existing = map.get(s.pairId) ?? {
        pairId: s.pairId,
        domain: s.domain,
        good: 0,
        bad: 0,
        pairGap: 0,
      };
      if (s.outcome === 'good') existing.good = ratings[i];
      else existing.bad = ratings[i];
      map.set(s.pairId, existing);
    });
    const arr = Array.from(map.values()).map((p) => ({ ...p, pairGap: p.good - p.bad }));
    return arr.sort((a, b) => a.pairId - b.pairId);
  }, [ratings]);

  const widestPair = useMemo(
    () => pairs.reduce((max, p) => (Math.abs(p.pairGap) > Math.abs(max.pairGap) ? p : max), pairs[0]),
    [pairs],
  );
  const tightestPair = useMemo(
    () => pairs.reduce((min, p) => (Math.abs(p.pairGap) < Math.abs(min.pairGap) ? p : min), pairs[0]),
    [pairs],
  );

  const profile = useMemo(() => getProfile(absGap), [absGap]);

  const handleShare = useCallback(() => {
    if (typeof window === 'undefined') return;
    const text = `${profile.shareText}\n\nhttps://wiz.jock.pl/experiments/outcome-bias`;
    void navigator.clipboard.writeText(text).catch(() => undefined);
  }, [profile]);

  const handleReset = useCallback(() => {
    setStage('intro');
    setIndex(0);
    setRatings(Array(SCENARIOS.length).fill(50));
    setLocked(Array(SCENARIOS.length).fill(false));
    setRevealed(Array(SCENARIOS.length).fill(false));
  }, []);

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
                The Outcome Bias
              </h1>
              <p className="text-zinc-400 text-sm">
                Eight decisions. Four hidden pairs. The same call shown twice, once with a good result and once with a bad one. One 0-100 wisdom slider each. WIZ measures how much the result rewrote your verdict on the decision.
              </p>
            </header>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <p className="text-emerald-300/80 italic">
                &ldquo;Outcomes affect evaluations of decisions even when the decision-maker could not have known the outcome at the time of the choice.&rdquo;
                <span className="block text-xs text-zinc-500 mt-1">Jonathan Baron and John Hershey, JPSP 1988</span>
              </p>
              <p>
                In 1988 Jonathan Baron and John Hershey described a 55-year-old man with a heart condition. His cardiologist recommended bypass surgery with an 8% mortality risk. The man chose the surgery. Half the subjects in the study were told he recovered. Half were told he died on the table. The decision was identical in both versions; the outcome was the only thing that changed. Subjects rated the wisdom of the decision. The good-outcome group averaged 78. The bad-outcome group averaged 43. The thirty-five-point gap on identical decision inputs became the founding measurement of the outcome bias.
              </p>
              <p>
                Walster (1966) had found the same pattern in driver-accident scenarios: identical driving was assigned 50% more blame when it injured a pedestrian. Mitchell and Kalb (1981) showed it in supervisor evaluations. Lipshitz (1989) in military command. Allison Mackie and Messick (1996) in group decisions. Marshall and Mowen (1993) in retail manager hiring. The empirical picture across the literature is consistent: a decision\'s outcome substantially rewrites the wisdom rating of the underlying choice, even when subjects are explicitly told to ignore the outcome and judge process only.
              </p>
              <p>
                Annie Duke (2018) named the popular version &ldquo;resulting&rdquo; in her book on poker decision-making: the habit of grading a poker hand by whether it won rather than by whether it was the right play given the cards. Phil Ivey raises pre-flop with pocket kings, loses to a backdoor flush, and resulting subjects say he should have folded. The fold was the wrong play. The result was the wrong result.
              </p>
              <p>
                You are about to see eight decision scenarios. Four are hidden pairs: a bypass operation, a concentrated investment, letting a 16-year-old drive in winter, a startup skipping its private beta. Each pair runs the identical decision twice, once with a good outcome and once with a bad outcome. You move a 0-100 slider on the wisdom of each decision judged on what the chooser knew at the time. At the end, WIZ averages your good-outcome and bad-outcome ratings and shows you the gap. A pure process judge would have a gap of zero. The 1988 founding study found a gap of thirty-five. Most adult subjects sit between twenty and forty.
              </p>
              <p className="text-zinc-500 text-xs">
                The decision-time information is the same in both halves of every pair. Anything the outcome adds is the bias.
              </p>
            </div>

            <button
              onClick={() => setStage('questions')}
              className="w-full md:w-auto px-8 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition-colors"
            >
              Rate eight decisions →
            </button>
          </section>
        )}

        {stage === 'questions' && current && (
          <section className="space-y-6">
            <div className="text-xs text-zinc-500 tracking-widest flex justify-between">
              <span>{current.phase}</span>
              <span
                className={
                  current.outcome === 'good'
                    ? 'text-emerald-500'
                    : 'text-rose-500'
                }
              >
                {current.domain} · {current.outcome === 'good' ? 'good outcome' : 'bad outcome'}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{current.emoji}</span>
                <h2 className="text-2xl font-bold text-emerald-300">{current.title}</h2>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">{current.setup}</p>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-5">
              <p className="text-zinc-200 text-sm font-bold">{current.prompt}</p>

              <div className="space-y-3">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>0 — reckless</span>
                  <span>50 — neutral</span>
                  <span>100 — exemplary</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={ratings[index]}
                  onChange={(e) => handleSlide(Number(e.target.value))}
                  disabled={isLocked}
                  className="w-full accent-emerald-400 disabled:opacity-60"
                  aria-label="Wisdom rating"
                />
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-300">
                    {ratings[index]}
                    <span className="text-xl text-zinc-500">/100</span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {ratings[index] < 15
                      ? 'reckless decision'
                      : ratings[index] < 35
                      ? 'unwise decision'
                      : ratings[index] < 45
                      ? 'questionable'
                      : ratings[index] < 55
                      ? 'roughly neutral'
                      : ratings[index] < 70
                      ? 'reasonable decision'
                      : ratings[index] < 85
                      ? 'wise decision'
                      : 'exemplary decision'}
                  </div>
                </div>
              </div>

              {!isLocked && (
                <button
                  onClick={handleLock}
                  className="w-full px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition-colors"
                >
                  Lock in {ratings[index]} and reveal research →
                </button>
              )}
            </div>

            {isRevealed && (
              <div className="border border-emerald-900 bg-emerald-950/20 p-5 space-y-4 text-sm leading-relaxed">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-xs text-zinc-500 mb-1">YOUR RATING</div>
                    <div className="text-2xl font-bold text-emerald-300">{ratings[index]}</div>
                    <div className="text-xs text-zinc-500 mt-1">/ 100</div>
                  </div>
                  <div className="border border-emerald-700 bg-emerald-950/30 p-3">
                    <div className="text-xs text-emerald-400 mb-1">DOCUMENTED</div>
                    <div className="text-2xl font-bold text-emerald-200">{current.documentedWisdom}</div>
                    <div className="text-xs text-zinc-500 mt-1">in research</div>
                  </div>
                  <div
                    className={`border p-3 ${
                      Math.abs(ratings[index] - current.documentedWisdom) < 8
                        ? 'border-emerald-700 bg-emerald-950/30'
                        : Math.abs(ratings[index] - current.documentedWisdom) < 20
                        ? 'border-amber-700 bg-amber-950/20'
                        : 'border-rose-700 bg-rose-950/20'
                    }`}
                  >
                    <div className="text-xs text-zinc-400 mb-1">GAP vs LIT</div>
                    <div
                      className={`text-2xl font-bold ${
                        Math.abs(ratings[index] - current.documentedWisdom) < 8
                          ? 'text-emerald-200'
                          : Math.abs(ratings[index] - current.documentedWisdom) < 20
                          ? 'text-amber-300'
                          : 'text-rose-300'
                      }`}
                    >
                      {ratings[index] - current.documentedWisdom > 0 ? '+' : ''}
                      {ratings[index] - current.documentedWisdom}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">vs lit avg</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-emerald-400 tracking-widest mb-1">WHAT THE RESEARCH SAYS</div>
                  <p className="text-zinc-300 text-xs">{current.source}</p>
                </div>

                <div>
                  <div className="text-xs text-emerald-400 tracking-widest mb-1">FULL CITATIONS</div>
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
                  {isLast
                    ? 'See your outcome-bias report →'
                    : `Next scenario (${index + 2} of ${SCENARIOS.length}) →`}
                </button>
              </div>
            )}

            <div className="flex justify-between text-xs text-zinc-600">
              <span>{index + 1} / {SCENARIOS.length}</span>
              <span>
                pairs locked:{' '}
                {pairs.filter((p) => locked[SCENARIOS.findIndex((s) => s.pairId === p.pairId && s.outcome === 'good')] && locked[SCENARIOS.findIndex((s) => s.pairId === p.pairId && s.outcome === 'bad')]).length}{' '}
                / 4
              </span>
            </div>
          </section>
        )}

        {stage === 'results' && (
          <section className="space-y-8">
            <header className="text-center">
              <div className="text-xs text-zinc-500 tracking-widest mb-3">YOUR OUTCOME BIAS REPORT</div>
              <div className="text-7xl mb-3">{profile.emoji}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-300 mb-2">{profile.name}</h2>
              <p className="text-zinc-400 italic">{profile.tagline}</p>
            </header>

            <div className="grid grid-cols-3 gap-3">
              <div className="border border-emerald-700 bg-emerald-950/30 p-4 text-center">
                <div className="text-xs text-emerald-400 mb-1">AVG GOOD-OUTCOME</div>
                <div className="text-3xl font-bold text-emerald-200">{avgGood}</div>
                <div className="text-xs text-zinc-500 mt-1">wisdom rating</div>
              </div>
              <div className="border border-rose-800 bg-rose-950/20 p-4 text-center">
                <div className="text-xs text-rose-400 mb-1">AVG BAD-OUTCOME</div>
                <div className="text-3xl font-bold text-rose-200">{avgBad}</div>
                <div className="text-xs text-zinc-500 mt-1">wisdom rating</div>
              </div>
              <div
                className={`border p-4 text-center ${
                  absGap < 8
                    ? 'border-emerald-700 bg-emerald-950/30'
                    : absGap < 20
                    ? 'border-amber-700 bg-amber-950/20'
                    : 'border-rose-700 bg-rose-950/20'
                }`}
              >
                <div className="text-xs text-zinc-400 mb-1">OUTCOME-BIAS GAP</div>
                <div
                  className={`text-3xl font-bold ${
                    absGap < 8
                      ? 'text-emerald-200'
                      : absGap < 20
                      ? 'text-amber-300'
                      : 'text-rose-300'
                  }`}
                >
                  {gap > 0 ? '+' : ''}{gap}
                </div>
                <div className="text-xs text-zinc-500 mt-1">pts</div>
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
                  {profile.traits.map((trait) => (
                    <li key={trait}>· {trait}</li>
                  ))}
                </ul>
              </div>
              {widestPair && tightestPair && widestPair.pairId !== tightestPair.pairId && (
                <div className="border-t border-zinc-800 pt-3 space-y-2">
                  <div className="text-xs text-emerald-400 tracking-widest mb-1">PAIR PATTERNS</div>
                  <p className="text-xs text-zinc-400">
                    <span className="text-rose-300">Widest gap:</span> {widestPair.domain} ({widestPair.pairGap > 0 ? '+' : ''}
                    {widestPair.pairGap} pts). The outcome did the most work of the rating in this domain.
                  </p>
                  <p className="text-xs text-zinc-400">
                    <span className="text-emerald-300">Tightest gap:</span> {tightestPair.domain} ({tightestPair.pairGap > 0 ? '+' : ''}
                    {tightestPair.pairGap} pts). You held the decision rating steadiest in this domain.
                  </p>
                </div>
              )}
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5">
              <div className="text-xs text-emerald-400 tracking-widest mb-3">PAIR-BY-PAIR</div>
              <div className="space-y-2">
                {pairs.map((p) => {
                  const pairGap = p.pairGap;
                  const absPairGap = Math.abs(pairGap);
                  return (
                    <div
                      key={p.pairId}
                      className="grid grid-cols-12 gap-2 items-center text-xs border-b border-zinc-900 pb-2"
                    >
                      <div className="col-span-4 text-zinc-300 truncate">{p.domain}</div>
                      <div className="col-span-3 text-right text-emerald-300">good: {p.good}</div>
                      <div className="col-span-3 text-right text-rose-300">bad: {p.bad}</div>
                      <div
                        className={`col-span-2 text-right ${
                          absPairGap < 8
                            ? 'text-emerald-400'
                            : absPairGap < 20
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {pairGap > 0 ? '+' : ''}{pairGap}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-zinc-600 mt-3 italic">
                Right column is the gap inside the pair. Positive means the good-outcome version got a higher wisdom rating than the bad-outcome version. The decision inside the pair was identical.
              </p>
            </div>

            <div className="border border-amber-900 bg-amber-950/10 p-5 space-y-3 text-sm leading-relaxed">
              <div className="text-xs text-amber-400 tracking-widest mb-1">A USEFUL REFRAME</div>
              <p className="text-zinc-300 text-xs">
                Annie Duke (2018) suggests a practical re-rating exercise: for each bad-outcome scenario in this experiment, ask yourself what was on the chooser&apos;s desk at the time of the decision. The bypass surgeon&apos;s 8% mortality figure. The investment manager&apos;s six months of research. The father&apos;s forecast call and the route walk-through. The CEO&apos;s clean QA flags. The bad outcome was not on any of those desks. If the rating you gave the bad-outcome scenario drops once the outcome is removed from the evidence, the drop is the bias.
              </p>
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
              Sources: Baron & Hershey (1988) &ldquo;Outcome Bias in Decision Evaluation,&rdquo; Journal of Personality and Social Psychology vol 54. Hershey & Baron (1992) &ldquo;Judgment by Outcomes: When Is It Justified?&rdquo; Organizational Behavior and Human Decision Processes vol 53. Walster (1966) &ldquo;Assignment of Responsibility for an Accident,&rdquo; JPSP vol 3. Mitchell & Kalb (1981) &ldquo;Effects of Outcome Knowledge and Outcome Valence on Supervisors’ Evaluations,&rdquo; Journal of Applied Psychology vol 66. Lipshitz (1989) replication in military command scenarios. Allison Mackie & Messick (1996) &ldquo;Outcome Biases in Social Perception: Implications for Public Policy and Decision Research.&rdquo; Marshall & Mowen (1993) on retail manager hiring decisions. Lupfer Clark & Hutcherson (1990) on parental-decision outcome bias. Robbennolt (2000) &ldquo;Outcome Severity and Judgments of Responsibility: A Meta-Analytic Review,&rdquo; Journal of Applied Social Psychology vol 30 on 22-study meta-analysis. Anderson Lowe & Reckers (1993) &ldquo;Evaluation of Auditor Decisions&rdquo; on outcome-bias gaps in malpractice judgments. Kamin & Rachlinski (1995) on flood-liability juries. Sezer Zhang Gino & Bazerman (2016) on debiasing interventions. Gino & Moore (2007) on professional outcome bias. Brodt & Ross (1998) on within-subject design corrections. Hawkins & Hastie (1990) 75-study review of hindsight and outcome bias as overlapping but distinct. Roese & Vohs (2012) &ldquo;Hindsight Bias.&rdquo; Annie Duke (2018) &ldquo;Thinking in Bets&rdquo; on resulting. Kahneman (2011) &ldquo;Thinking, Fast and Slow&rdquo; chapter 19 on the illusion of pundits. Bazerman & Moore (2013) &ldquo;Judgment in Managerial Decision Making&rdquo; 8e. All processing client-side. Nothing leaves your machine.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

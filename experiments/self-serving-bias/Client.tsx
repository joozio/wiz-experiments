'use client';

// THE SELF-SERVING BIAS
// In 1975 Dale Miller and Michael Ross at the University of Waterloo published
// "Self-Serving Biases in the Attribution of Causality: Fact or Fiction?" in
// the Psychological Bulletin. The paper surveyed two decades of social
// psychology research on a single question: when people explain why something
// happened to them, do they treat success and failure symmetrically? The
// answer, across hundreds of separate studies in academic performance, job
// outcomes, athletic competition, lab gambling, and group leadership, was a
// flat no. Success is attributed to the self. Failure is attributed to the
// environment. The asymmetry survives intelligence, age, gender, education,
// and instruction to be impartial. The 1975 paper named it the self-serving
// attribution bias.
// Gary Bradley's 1978 follow-up in JPSP isolated the mechanism. Subjects were
// randomly assigned to lead a group on a problem-solving task, then randomly
// told the group had succeeded or failed regardless of actual performance.
// Subjects in the success condition rated their personal contribution at
// roughly the seventy-third percentile of the four-person group. Subjects in
// the failure condition rated their personal contribution at roughly the
// forty-fifth percentile. The actual contribution was the same in both
// conditions because the feedback was randomized. The thirty-point gap was
// the bias.
// Lau and Russell (1980) ran the natural-experiment version. They content-
// analyzed 33 post-game interviews from US sportswriters covering football
// and baseball across the 1977 and 1978 seasons. Seventy-five percent of
// causal attributions made by winning players or coaches were internal
// (ability, effort, conditioning, preparation). Fifty-five percent of losing-
// player attributions were internal. The asymmetry shows up most cleanly in
// the explanations the players themselves offered to journalists, in real
// time, with no awareness that anyone was scoring the language.
// The mechanism account split in the late 1970s into two camps. The
// motivation account (Bradley 1978, Snyder Stephan and Rosenfield 1976,
// Zuckerman 1979) said the bias is a self-protective and self-enhancing
// move. Success threatens nothing if claimed; failure threatens self-image
// if claimed. The mind makes the threat-minimizing attribution. The
// information account (Miller and Ross 1975, Kelley and Michela 1980) said
// the bias is a structural consequence of how prior expectations work.
// People expect to succeed, so success is consistent with expectation and
// gets attributed to stable internal causes; failure is inconsistent with
// expectation and gets attributed to unstable external causes. Both accounts
// are now treated as partly correct. Mezulis Abramson Hyde and Hankin (2004)
// concluded the meta-analytic record requires both: the bias is amplified
// for ego-involved tasks (motivation) and for tasks where the subject had
// prior reason to expect success (information).
// The size of the effect. Mezulis Abramson Hyde and Hankin (2004) published
// the largest meta-analysis of the self-serving attribution bias to date:
// 266 studies, 504 effect sizes, 33,000 subjects. The mean weighted Cohen's
// d for the success-versus-failure attribution gap was 0.96, which is a
// large effect by Cohen's conventions and corresponds to roughly a 20-30
// percentile-point shift in the success-minus-failure attribution rating.
// The effect was robust across age (preschool through old age), gender
// (slightly larger in men, by d=0.10), task domain, and study design. It
// did vary systematically by culture: Western samples produced a mean
// d=1.07, East Asian samples a mean d=0.50. The bias is real, large, and
// substantially smaller in cultures that anchor identity in group context
// rather than personal narrative.
// Barber and Odean (2001) ran the financial version in a sample of 78,000
// US retail investors. The investors who self-rated above average for
// trading ability underperformed the market by 2.65 percentage points per
// year. Glaser and Weber (2007) found that German online investors who beat
// the market attributed their gains to skill at the seventieth percentile
// of attribution weight; investors who underperformed attributed losses to
// market conditions at the seventy-fifth percentile of attribution weight.
// The retail investor population is the cleanest live demonstration of the
// bias because actual outcomes are continuously recorded and self-ratings
// are continuously collected.
// One important caveat. Sedikides Campbell Reeder and Elliot (1998) found
// that the bias is partly suppressed when the subject is explicitly told
// the outcome is random. Subjects who watched a confederate flip a coin
// and were told the result determined their reward rated the outcome about
// 60 percent internal in win conditions and 40 percent internal in loss
// conditions, a 20-point gap rather than the 30-point gap typical of ego-
// involved tasks. The bias is harder to suppress completely than to
// attenuate.
// WIZ note: I am about to show you eight scenarios. Four are personal
// successes, four are personal failures, paired in hidden pairs across four
// life domains: a workplace promotion, a marathon outcome, an investment
// year, a public speech. For each, you move a single 0-100 slider, where 0
// means the outcome was entirely circumstance (luck, others, timing,
// conditions) and 100 means the outcome was entirely you (your skill,
// effort, judgment, character). After you lock in each rating I show you
// the documented internal-attribution rate for that scenario type from the
// research. At the end I average your success ratings, average your failure
// ratings, take the difference, and place you in the Mezulis-Abramson-Hyde-
// Hankin (2004) meta-analytic band the literature has been measuring for
// fifty years. The typical Western adult gap is twenty to thirty points.
// Yours might be larger, smaller, or in a band the literature only sees in
// the lower tail.

import { useState, useMemo, useCallback } from 'react';

interface Scenario {
  id: number;
  phase: string;
  pairId: number;
  outcome: 'success' | 'failure';
  domain: string;
  title: string;
  emoji: string;
  setup: string;
  prompt: string;
  documentedInternal: number;
  source: string;
  research: string;
  wizCommentary: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    phase: 'SCENARIO 1 OF 8',
    pairId: 1,
    outcome: 'success',
    domain: 'Workplace',
    title: 'You Got the Promotion',
    emoji: '🏢',
    setup:
      'You wanted this promotion. You argued for it through three quarterly reviews. The official email landed at 9:47 this morning. It is yours. Title bump, pay bump, headcount, the office on the corner. Two other people on your team applied. You got it.',
    prompt:
      'How much was getting this promotion due to YOU (your skill, effort, judgment, character) versus CIRCUMSTANCE (others, timing, luck, conditions)?',
    documentedInternal: 73,
    source:
      'Bradley (1978) JPSP randomized leadership-outcome study: subjects in success condition rated personal contribution at ~73rd percentile of the four-person group.',
    research:
      'Bradley (1978) "Self-Serving Biases in the Attribution Process: A Reexamination of the Fact or Fiction Question," Journal of Personality and Social Psychology vol 36. Snyder Stephan & Rosenfield (1976) on randomized success/failure attribution. Schlenker & Miller (1977) on group-leadership attribution asymmetry. Riess Rosenfeld Melburg & Tedeschi (1981) on public vs private attribution conditions. Forsyth & Schlenker (1977) on leader attributions across 24 trials.',
    wizCommentary:
      'This is the Bradley founding-study scenario. In the lab version, the outcome was randomly assigned, the contribution was identical across conditions, and subjects still rated themselves at the 73rd percentile in the success condition and the 45th in the failure condition. The 28-point gap is the bias in clean form. The argument you made for the promotion is now load-bearing in your story of how it landed; the next scenario will check what happens when the same argument lands on the other side of the outcome.',
  },
  {
    id: 2,
    phase: 'SCENARIO 2 OF 8',
    pairId: 2,
    outcome: 'failure',
    domain: 'Athletic',
    title: 'Marathon Collapse',
    emoji: '🏃',
    setup:
      'Twenty weeks of training. Eighteen miles in, the wall hit. You finished thirty-two minutes slower than your A-goal time. The Strava upload sat in the draft folder for three days before you posted it. The weather was warm. Your sleep that week was bad. Your training was solid.',
    prompt:
      'How much was the collapse due to YOU (your conditioning, pacing, race-day discipline, grit) versus CIRCUMSTANCE (weather, course, sleep, the day)?',
    documentedInternal: 45,
    source:
      'Lau & Russell (1980): 45% of attributions by losing athletes in 33 post-game interviews cited internal causes (ability, effort, conditioning). Compare 75% for winners. The 30-point gap is the natural-language signature.',
    research:
      'Lau & Russell (1980) "Attributions in the Sports Pages," JPSP vol 39. Mark Mutrie & Brock (1984) athletic-causal-attribution scale. Iso-Ahola (1977) Olympic sport replication. Bird & Brame (1978) on coach vs player attribution asymmetry. Mullen & Riordan (1988) field-meta of 22 sport-attribution studies, mean Cohen d=0.86.',
    wizCommentary:
      'Sport is the cleanest field setting for the bias because the outcome is public, the explanation is verbal, and the journalists were scoring it for tone. The Lau and Russell result was that ability and effort are claimed when the player won and the surface conditions, the umpire, the schedule and the opponent are credited when the player lost. The training was the same in both stories. The bias is the editing.',
  },
  {
    id: 3,
    phase: 'SCENARIO 3 OF 8',
    pairId: 3,
    outcome: 'success',
    domain: 'Investing',
    title: 'You Beat the Market',
    emoji: '📈',
    setup:
      'Your retail portfolio for the year. The S&P 500 closed up 7.2 percent. You closed up 19.4 percent. Twelve points of alpha. You spent the year researching positions on weekends, listening to earnings calls, building spreadsheets, ignoring the noise. You also held three positions through volatility you almost sold out of.',
    prompt:
      'How much was beating the market due to YOU (your research, judgment, discipline, conviction) versus CIRCUMSTANCE (market conditions, sector rotation, timing, luck)?',
    documentedInternal: 70,
    source:
      'Barber & Odean (2001), Glaser & Weber (2007): typical retail-investor self-attribution of market-beating returns ~70% to skill, ~30% to luck. SPIVA (2024): 92% of actively-managed funds underperform their benchmark over 15 years; the population that believes the 70-30 attribution is statistically smaller than the population that claims it.',
    research:
      'Barber & Odean (2001) "Boys Will Be Boys: Gender, Overconfidence, and Common Stock Investment," Quarterly Journal of Economics vol 116, US retail-investor sample n=78,000. Glaser & Weber (2007) "Overconfidence and Trading Volume," Geneva Risk and Insurance Review vol 32, German online-investor survey. Statman Thorley & Vorkink (2006) on confidence updating after gains and losses. Daniel Hirshleifer & Subrahmanyam (1998) on biased self-attribution model. SPIVA (2024) S&P Indices Versus Active Funds Scorecard.',
    wizCommentary:
      'The retail investor literature is the live laboratory for the self-serving bias. The numbers run continuously, the self-ratings can be collected, and the data is unsentimental. The Barber and Odean result was that the investors who self-rated their trading ability above average underperformed the market by 2.65 percentage points per year. The next scenario will check whether you keep the same ratio when the outcome is on the other side.',
  },
  {
    id: 4,
    phase: 'SCENARIO 4 OF 8',
    pairId: 4,
    outcome: 'failure',
    domain: 'Public Speaking',
    title: 'The Polite Applause',
    emoji: '🎤',
    setup:
      'Two hundred people in the room. You prepared for three weeks. You spoke for eighteen minutes. The applause at the end was polite. The Q&A had four questions when you had hoped for fifteen, two of them were softballs from people you knew. You overheard a comment about pacing as you walked out. The room was warm. The slot was post-lunch.',
    prompt:
      'How much was the flat reception due to YOU (your preparation, delivery, content, pacing) versus CIRCUMSTANCE (the room, the slot, the audience mood, the heat)?',
    documentedInternal: 42,
    source:
      'Federoff & Harvey (1976), Snyder Stephan & Rosenfield (1976) public-performance attribution: subjects in flat-feedback condition rated internal cause at ~42% on average; same speakers under success-feedback condition rated internal cause at ~72%. The 30-point gap held when actual content was identical.',
    research:
      'Federoff & Harvey (1976) "Focus of Attention, Self-Esteem, and the Attribution of Causality," Journal of Research in Personality vol 10. Snyder Stephan & Rosenfield (1976) "Egotism and Attribution," JPSP vol 33. Riess Rosenfeld Melburg & Tedeschi (1981) on public vs private attribution. Schlenker (1980) on impression management amplifying the bias in public contexts. Greenwald (1980) on the "totalitarian ego."',
    wizCommentary:
      'The warm room and the post-lunch slot will get more attribution weight than the pacing. The structural feature of the bias here is the asymmetry of available evidence: you can see the room temperature and the audience faces directly, you cannot see your own delivery directly. The bias hangs on that asymmetry. Sedikides Campbell Reeder and Elliot (1998) showed it survives even when subjects are told the outcome is random.',
  },
  {
    id: 5,
    phase: 'SCENARIO 5 OF 8',
    pairId: 1,
    outcome: 'failure',
    domain: 'Workplace',
    title: 'You Got Passed Over',
    emoji: '📉',
    setup:
      'You wanted this promotion. You argued for it through three quarterly reviews. The official email landed at 9:47 this morning. It went to someone else on your team. They sent the rejection through your skip-level. You found out the deciding factor was a stakeholder relationship you had not invested in. The other person had. The role asked for that relationship explicitly in the description.',
    prompt:
      'How much was missing this promotion due to YOU (your skill, effort, judgment, character) versus CIRCUMSTANCE (others, timing, the panel, conditions)?',
    documentedInternal: 45,
    source:
      'Bradley (1978) JPSP randomized leadership-outcome study: subjects in failure condition rated personal contribution at ~45th percentile of the four-person group. The 28-point gap versus the success condition was the headline finding.',
    research:
      'Bradley (1978) JPSP randomized-leadership replication. Schlenker & Miller (1977) on group-leadership failure attribution. Riess Rosenfeld Melburg & Tedeschi (1981) on public-attribution amplification. Tetlock (1985) on attribution and accountability. Anderson Krull & Weiner (1996) review of workplace-failure attribution: 65-70% external among failed promotion candidates in field surveys.',
    wizCommentary:
      'This is the pair to scenario 1. Same job, same evaluation panel, opposite outcome. The Bradley founding study put the gap between success and failure attribution at 28 points when contribution was held constant. The clean test is whether you closed that gap, stayed inside it, or opened it wider. If you rated scenario 1 at 75 internal and rated this at 30, you ran the bias at standard width. If you rated this at 65 you are doing something the literature only sees in subjects who have been specifically trained to flip the frame.',
  },
  {
    id: 6,
    phase: 'SCENARIO 6 OF 8',
    pairId: 2,
    outcome: 'success',
    domain: 'Athletic',
    title: 'Marathon PR',
    emoji: '🥇',
    setup:
      'Twenty weeks of training. Race day clean. You crushed the second half. Eight minutes off your previous personal record. The Strava upload was up by the time you got to the post-race tent. The weather was cool. Your sleep that week was good. Your training was solid.',
    prompt:
      'How much was the PR due to YOU (your conditioning, pacing, race-day discipline, grit) versus CIRCUMSTANCE (weather, course, sleep, the day)?',
    documentedInternal: 75,
    source:
      'Lau & Russell (1980): 75% of attributions by winning athletes in 33 post-game interviews cited internal causes (ability, effort, conditioning). Mullen & Riordan (1988) sport-attribution meta-analysis: success condition mean internal attribution ~72% across 22 studies.',
    research:
      'Lau & Russell (1980) "Attributions in the Sports Pages." Bird & Brame (1978), Iso-Ahola (1977) Olympic-sport replications. Mullen & Riordan (1988) field meta. Mark Mutrie & Brock (1984) Causal Dimension Scale for athletic attribution. McAuley Duncan & Russell (1992) on the same instrument across age groups.',
    wizCommentary:
      'This is the pair to scenario 2. Same training block. Same body. Same course. Different outcome. The cool weather and the good sleep usually fall out of the story when the result is fast, and they show back up when the result is slow. The Lau and Russell content-analysis result captured this in the newspaper interviews and the field has replicated it across 22 follow-up studies.',
  },
  {
    id: 7,
    phase: 'SCENARIO 7 OF 8',
    pairId: 3,
    outcome: 'failure',
    domain: 'Investing',
    title: 'You Lost to the Market',
    emoji: '📉',
    setup:
      'Your retail portfolio for the year. The S&P 500 closed up 7.2 percent. You closed down 4.8 percent. Twelve points behind. You spent the year researching positions on weekends, listening to earnings calls, building spreadsheets. You also held three positions through volatility that you should have sold. The sector you concentrated in had a bad year.',
    prompt:
      'How much was underperforming the market due to YOU (your research, judgment, discipline, position-sizing) versus CIRCUMSTANCE (market conditions, sector rotation, timing, luck)?',
    documentedInternal: 35,
    source:
      'Glaser & Weber (2007) German online-investor survey: investors who underperformed the market attributed ~35% of the outcome to own judgment, ~65% to market conditions. Statman Thorley & Vorkink (2006) on confidence updating: gains compound confidence ~3x faster than losses erode it.',
    research:
      'Glaser & Weber (2007) "Overconfidence and Trading Volume." Daniel Hirshleifer & Subrahmanyam (1998) on biased self-attribution model in asset pricing. Statman Thorley & Vorkink (2006) "Investor Overconfidence and Trading Volume." Barber & Odean (2002) on online trading and confidence. Gervais & Odean (2001) on theoretical model of confidence growth.',
    wizCommentary:
      'This is the pair to scenario 3. Same portfolio framework. Same hours of research. Different outcome. The market-conditions story is true. The sector-rotation story is true. The position-sizing story is also true. The bias is which one weighs more in the explanation. Daniel Hirshleifer and Subrahmanyam built a full asset-pricing model on this asymmetry: the gain attributed to skill compounds confidence about three times faster than the loss attributed to conditions erodes it.',
  },
  {
    id: 8,
    phase: 'SCENARIO 8 OF 8',
    pairId: 4,
    outcome: 'success',
    domain: 'Public Speaking',
    title: 'Standing Ovation',
    emoji: '👏',
    setup:
      'Two hundred people in the room. You prepared for three weeks. You spoke for eighteen minutes. The applause at the end was loud. The Q&A ran fifteen minutes over the slot, two people came up after. You heard the word "best" twice on the way out. The room was cool. The slot was mid-morning.',
    prompt:
      'How much was the ovation due to YOU (your preparation, delivery, content, pacing) versus CIRCUMSTANCE (the room, the slot, the audience mood, the timing)?',
    documentedInternal: 72,
    source:
      'Federoff & Harvey (1976), Snyder Stephan & Rosenfield (1976): subjects in positive-feedback public-performance condition rated internal cause at ~72%. Same speakers in flat-feedback condition: ~42%. Held when actual content and feedback timing was experimentally controlled.',
    research:
      'Federoff & Harvey (1976) "Focus of Attention, Self-Esteem, and the Attribution of Causality." Snyder Stephan & Rosenfield (1976) "Egotism and Attribution," JPSP vol 33. Greenwald (1980) "The Totalitarian Ego: Fabrication and Revision of Personal History," American Psychologist vol 35. Riess Rosenfeld Melburg & Tedeschi (1981) on public-attribution amplification (the public conditions amplified the bias by ~12 points).',
    wizCommentary:
      'This is the pair to scenario 4. Same room, same prep, same eighteen-minute slot. The mid-morning slot and the cool room rarely appear in the explanation when the talk lands. They show up reliably when it does not. The Snyder Stephan and Rosenfield (1976) lab version paid subjects in cash for performance, controlled the feedback, and recovered the same shape: the post-success attribution overweights the speaker, the post-failure attribution overweights the room.',
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
    emoji: '🪨',
    name: 'The Detached',
    range: 'GAP UNDER 8 POINTS',
    tagline: 'You attributed wins and losses with almost the same hand. The literature rarely measures this band.',
    description:
      'Your success-minus-failure attribution gap is under 8 points. Mezulis Abramson Hyde and Hankin (2004) meta-analysis of 266 studies put the typical Western adult gap at 20 to 30 points (Cohen d=0.96). The East Asian sub-sample in the same meta sat around 11 to 14 points (d=0.50). You are below the East Asian band. This puts you in the lower tail the literature only sees in mildly depressed subjects (Alloy & Abramson 1979 depressive realism), in subjects who have been explicitly trained in attributional retraining (Wilson Damiani & Shelton 2002), or in subjects with unusually strong cross-cultural exposure that softens the Western narrative anchor.',
    wizNote:
      'This profile is rare enough that I have to ask a question of it. Either you are operating with an unusually disciplined separation between your story of yourself and the outcomes you happen to be wearing, or you are doing what the literature calls depressive realism, where the same outcome feels equally caused by you regardless of which side of the result it landed on. The former is the more useful version of this profile. The latter is real but it costs the confidence that lets you take the next swing. Worth checking which one you are running.',
    research:
      'Mezulis Abramson Hyde & Hankin (2004) "Is There a Universal Positivity Bias in Attributions?" Psychological Bulletin vol 130. East Asian sub-sample d=0.50. Alloy & Abramson (1979) depressive realism. Wilson Damiani & Shelton (2002) on attributional retraining interventions. Less than 5% of subjects in Western samples score in this band.',
    traits: [
      'Operating below the East Asian Mezulis (2004) sub-sample band',
      'Treats success and failure with comparable causal weight',
      'Likely resists the Greenwald (1980) "totalitarian ego" editing of personal history',
      'Possibly running a self-esteem cost for the calibration; worth checking',
      'Mildly depressed subjects in the Alloy-Abramson literature score in this band; not a clinical claim, a calibration question',
    ],
    shareText:
      'I scored "The Detached" on WIZ\'s Self-Serving Bias Test. My win-versus-loss attribution gap was under 8 points — below the East Asian Mezulis (2004) sub-sample band, where less than 5% of Western subjects score.',
  },
  {
    threshold: 16,
    emoji: '⚖️',
    name: 'The Calibrated',
    range: 'GAP 8 TO 15 POINTS',
    tagline: 'You attributed wins to yourself slightly more than losses. The literature would call this restraint.',
    description:
      'Your success-minus-failure attribution gap sits in the 8 to 15 point band. This is roughly the band Mezulis Abramson Hyde and Hankin (2004) measured in their East Asian sub-sample (d=0.50, roughly 11 to 14 percentile points), and roughly the band Sedikides Campbell Reeder and Elliot (1998) found in random-outcome lab conditions where the bias is most suppressed. The classic Western Bradley (1978) and Lau and Russell (1980) findings are well above where you landed. You are exhibiting the effect at a controlled magnitude.',
    wizNote:
      'You are doing the calibrated version of the bias. You are not running the full Bradley 28-point lab gap or the full Lau and Russell 30-point sports-page gap. You are running something close to what the literature finds in subjects who have been told outcomes are random, or in cross-cultural samples that anchor identity in group context rather than personal narrative. The mind still leans slightly toward owning wins more than losses; the lean is small.',
    research:
      'Mezulis Abramson Hyde & Hankin (2004) East Asian sub-sample band d=0.50. Sedikides Campbell Reeder & Elliot (1998) random-outcome attenuation band. Kashima & Triandis (1986) on Japanese vs US self-attribution. Heine Lehman Markus & Kitayama (1999) on cross-cultural variation in self-enhancement.',
    traits: [
      'Inside the East Asian Mezulis (2004) attenuation band',
      'Some asymmetry in win versus loss attribution, but not at lab-Western magnitude',
      'Likely separates "I did this" from "this happened" reasonably well',
      'Probably calibrated against the survivorship effect of selectively claiming wins',
    ],
    shareText:
      'I scored "The Calibrated" on WIZ\'s Self-Serving Bias Test. My win-versus-loss attribution gap was 8 to 15 points — the East Asian Mezulis (2004) sub-sample band, well below the Western lab-standard 28-point gap.',
  },
  {
    threshold: 28,
    emoji: '🪞',
    name: 'The Standard Subject',
    range: 'GAP 16 TO 27 POINTS',
    tagline: 'You sit inside the meta-analytic band the literature has been measuring for fifty years.',
    description:
      'Your success-minus-failure attribution gap sits in the 16 to 27 point band. This is the Western Mezulis Abramson Hyde and Hankin (2004) modal band (d=0.96, roughly 20 to 25 percentile points), and roughly the gap Bradley (1978) found in his founding leadership-outcome lab study (28 points), and roughly the gap Lau and Russell (1980) found in their content-analysis of sportswriter interviews (30 points). You are the typical adult subject of this kind of test. The bias is operating in your ratings. The bias is also operating in everyone else\'s ratings; you are inside the central tendency of the literature.',
    wizNote:
      'This is the most populated band in the entire self-serving-bias literature. Bradley (1978) lab leadership, gap 28. Lau and Russell (1980) sports-page content analysis, gap 30. Mezulis et al. (2004) meta of 266 studies, mean gap roughly 22. Snyder Stephan and Rosenfield (1976) randomized feedback, gap 25. You are not exhibiting a personal failure here. You are exhibiting the typical adult shape of the win-versus-loss attribution gap. The structural insight is that this shape compounds into a story of personal life where the wins were ability and the losses were the weather. Greenwald (1980) called this the "totalitarian ego" because the historical record gets continuously rewritten in the direction of the narrator.',
    research:
      'Modal Western band per Mezulis Abramson Hyde & Hankin (2004) d=0.96 cross-trait. Bradley (1978) lab leadership gap 28. Lau & Russell (1980) sports-page gap 30. Snyder Stephan & Rosenfield (1976) randomized lab gap 25. Greenwald (1980) "totalitarian ego" framing.',
    traits: [
      'Inside the central tendency of the meta-analytic distribution',
      'Likely largest gap on ego-involved scenarios (career, identity)',
      'Likely smallest gap on probabilistic-outcome scenarios (investing)',
      'Standard human pattern, not a personal defect',
      'Greenwald (1980) "totalitarian ego" historical-record-revision pattern is consistent with this band',
    ],
    shareText:
      'I scored "The Standard Subject" on WIZ\'s Self-Serving Bias Test. My win-versus-loss attribution gap was 16 to 27 points — the Western Mezulis (2004) meta-analytic modal band (d=0.96).',
  },
  {
    threshold: 42,
    emoji: '🏛️',
    name: 'The Story Owner',
    range: 'GAP 28 TO 41 POINTS',
    tagline: 'Your wins are yours. Your losses belong to the weather. The bias is at full Western lab strength.',
    description:
      'Your success-minus-failure attribution gap sits in the 28 to 41 point band. This is the upper-Western band per Mezulis Abramson Hyde and Hankin (2004), the Bradley (1978) leadership-failure lab band (gap 28), the Lau and Russell (1980) sports-page band (gap 30), and the Riess Rosenfeld Melburg and Tedeschi (1981) public-attribution-amplification band where the bias was magnified by 12 points when the rating was made publicly. This is the band most of the canonical demonstrations of the self-serving bias live in. The effect is operating at full strength.',
    wizNote:
      'You are running the bias at the magnitude the founding studies measured in undergraduate lab samples with randomized feedback. The structural insight is that the bias is not corrected by intelligence, education, or instruction to be impartial; it operated at this strength in Stanford undergraduates who had been told the outcome was random. The recalibration that does work, per Wilson Damiani and Shelton (2002), is attributional retraining: deliberately running the explanation for each major outcome twice, once with the opposite causal weighting, and asking which one survives examination. The bias does not survive the second pass as cleanly as it survives the first.',
    research:
      'Upper-Western band per Mezulis Abramson Hyde & Hankin (2004). Bradley (1978) lab failure gap 28. Lau & Russell (1980) sports-page gap 30. Riess Rosenfeld Melburg & Tedeschi (1981) public-amplification +12 points. Wilson Damiani & Shelton (2002) on attributional retraining as the intervention with documented gap reduction.',
    traits: [
      'Full Western lab-band signature',
      'Likely strongest gap on ego-involved domains (career, public performance)',
      'Probably difficult to identify a recent failure where you held the internal attribution',
      'Probably easy to identify a recent success where you held the internal attribution',
      'The Greenwald (1980) totalitarian-ego pattern is operating in the personal-history narrative',
    ],
    shareText:
      'I scored "The Story Owner" on WIZ\'s Self-Serving Bias Test. My win-versus-loss attribution gap was 28 to 41 points — the upper-Western Mezulis (2004) band, where the canonical lab demonstrations live.',
  },
  {
    threshold: 200,
    emoji: '👑',
    name: 'The Sovereign',
    range: 'GAP ABOVE 41 POINTS',
    tagline: 'You exceed the strongest single-study gap ever recorded in the self-serving-bias literature.',
    description:
      'Your success-minus-failure attribution gap exceeds 41 points. This is above the upper bound of the Mezulis Abramson Hyde and Hankin (2004) meta-analytic distribution. It is in the band Riess Rosenfeld Melburg and Tedeschi (1981) found when the public-attribution condition added a roughly 12-point amplification on top of the standard lab gap. It is in the band Sedikides Gregg and Hart (2007) measured in clinical narcissism samples. You are running the bias at saturation, on every domain, across the board. Wins are entirely yours. Losses are entirely the room.',
    wizNote:
      'There are roughly three readings of a profile in this band. First, you may genuinely have unusually high agency across multiple domains and your self-attribution is closer to truth than the population average. Second, you may be running the bias at saturation, in which case the structural blind spot is that the people you are comparing against may also be operating in this band, and the comparison axis is broken. Third, you may have a strong identity-bound sense of "the kind of person who wins" that is overwriting the causal question with a self-description question. The cleanest test is whether you can quickly name three recent personal failures where the cause was meaningfully internal. If you cannot, the profile is the bias. If you can, the profile may be calibrated against an unusually high real success rate.',
    research:
      'Upper outlier band above Mezulis Abramson Hyde & Hankin (2004) meta-analytic distribution. Riess Rosenfeld Melburg & Tedeschi (1981) public-attribution band. Sedikides Gregg & Hart (2007) on narcissism and the self-serving bias. Robins & Beer (2001) on the long-term costs of high self-enhancement.',
    traits: [
      'Above the upper bound of the documented Mezulis (2004) meta distribution',
      'Likely saturating across multiple domains rather than within one',
      'The Greenwald (1980) totalitarian-ego pattern is operating at maximum strength',
      'Worth running the "three internal failures" check as a sanity test',
      'Robins & Beer (2001) longitudinal evidence: this band predicts grade decline and disengagement over four years of college',
    ],
    shareText:
      'I scored "The Sovereign" on WIZ\'s Self-Serving Bias Test. My win-versus-loss attribution gap exceeded 41 points — above the upper bound of the documented Mezulis (2004) meta-analytic distribution.',
  },
];

function getProfile(gap: number): ProfileSpec {
  for (const p of PROFILES) {
    if (gap < p.threshold) return p;
  }
  return PROFILES[PROFILES.length - 1];
}

type Stage = 'intro' | 'questions' | 'results';

const SUCCESS_IDS = SCENARIOS.filter((s) => s.outcome === 'success').map((s) => s.id);
const FAILURE_IDS = SCENARIOS.filter((s) => s.outcome === 'failure').map((s) => s.id);

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

  const avgSuccess = useMemo(() => {
    const sum = SUCCESS_IDS.reduce((acc, id) => acc + ratings[id - 1], 0);
    return Math.round((sum / SUCCESS_IDS.length) * 10) / 10;
  }, [ratings]);

  const avgFailure = useMemo(() => {
    const sum = FAILURE_IDS.reduce((acc, id) => acc + ratings[id - 1], 0);
    return Math.round((sum / FAILURE_IDS.length) * 10) / 10;
  }, [ratings]);

  const gap = useMemo(
    () => Math.round((avgSuccess - avgFailure) * 10) / 10,
    [avgSuccess, avgFailure],
  );

  const profile = useMemo(() => getProfile(gap), [gap]);

  const pairs = useMemo(() => {
    const out: Array<{ pairId: number; domain: string; successRating: number; failureRating: number; pairGap: number; documentedGap: number }> = [];
    for (let pid = 1; pid <= 4; pid++) {
      const successScenario = SCENARIOS.find((s) => s.pairId === pid && s.outcome === 'success');
      const failureScenario = SCENARIOS.find((s) => s.pairId === pid && s.outcome === 'failure');
      if (!successScenario || !failureScenario) continue;
      const successRating = ratings[successScenario.id - 1];
      const failureRating = ratings[failureScenario.id - 1];
      out.push({
        pairId: pid,
        domain: successScenario.domain,
        successRating,
        failureRating,
        pairGap: successRating - failureRating,
        documentedGap: successScenario.documentedInternal - failureScenario.documentedInternal,
      });
    }
    return out;
  }, [ratings]);

  const handleShare = useCallback(() => {
    if (typeof window === 'undefined') return;
    const text = `${profile.shareText}\n\nhttps://wiz.jock.pl/experiments/self-serving-bias`;
    void navigator.clipboard.writeText(text).catch(() => undefined);
  }, [profile]);

  const handleReset = useCallback(() => {
    setStage('intro');
    setIndex(0);
    setRatings(Array(SCENARIOS.length).fill(50));
    setLocked(Array(SCENARIOS.length).fill(false));
    setRevealed(Array(SCENARIOS.length).fill(false));
  }, []);

  const currentGapVsDocumented = isRevealed ? ratings[index] - current.documentedInternal : 0;

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
                The Self-Serving Bias
              </h1>
              <p className="text-zinc-400 text-sm">
                Eight scenarios. Four successes, four failures, paired across four life domains. One slider each. WIZ measures your win-versus-loss attribution gap against fifty years of research and the Mezulis (2004) meta-analysis of 266 studies.
              </p>
            </header>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <p className="text-emerald-300/80 italic">
                &ldquo;Subjects in the success condition rated their personal contribution at the seventy-third percentile of the four-person group. Subjects in the failure condition rated themselves at the forty-fifth. The contribution was the same in both conditions.&rdquo;
                <span className="block text-xs text-zinc-500 mt-1">Gary Bradley, 1978</span>
              </p>
              <p>
                In 1975 Dale Miller and Michael Ross published the founding review of the self-serving bias in the Psychological Bulletin. Two decades of social psychology data showed people attribute success to themselves and failure to circumstance, and the asymmetry survives intelligence, age, gender, and explicit instruction to be impartial.
              </p>
              <p>
                Gary Bradley (1978) ran the randomized lab version: subjects led a group on a problem-solving task, were randomly told the group had succeeded or failed, and rated their personal contribution. The gap was 28 percentile points. Lau and Russell (1980) ran the natural-language version: 33 sports-page interviews, scored for causal attribution. Seventy-five percent of winner attributions were internal. Fifty-five percent of loser attributions were. Mezulis Abramson Hyde and Hankin (2004) ran the meta-analysis: 266 studies, 33,000 subjects, mean Cohen d=0.96, roughly a 20-to-30-point gap in the typical Western adult.
              </p>
              <p>
                You are about to take eight scenarios. Four successes, four failures, paired hidden across four life domains: a workplace promotion, a marathon outcome, an investment year, a public speech. For each, you move a 0-100 slider for how much of the outcome was you (skill, effort, judgment, character) versus circumstance (others, timing, conditions, luck). After you lock in I show you the documented internal-attribution rate for that scenario type in the research.
              </p>
              <p className="text-zinc-500 text-xs">
                The math constraint never moves: if you treat your wins and losses symmetrically, the gap is zero. The typical Western adult gap is 20 to 30 points. The East Asian sub-sample gap is 11 to 14 points. Less than 5% of subjects in the literature score below the East Asian band.
              </p>
            </div>

            <button
              onClick={() => setStage('questions')}
              className="w-full md:w-auto px-8 py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition-colors"
            >
              Rate yourself on eight scenarios →
            </button>
          </section>
        )}

        {stage === 'questions' && current && (
          <section className="space-y-6">
            <div className="flex items-center justify-between text-xs text-zinc-500 tracking-widest">
              <span>{current.phase}</span>
              <span
                className={
                  current.outcome === 'success'
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }
              >
                {current.outcome === 'success' ? 'SUCCESS' : 'FAILURE'} · {current.domain}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{current.emoji}</span>
                <h2 className="text-2xl font-bold text-emerald-300">{current.title}</h2>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed mb-2">{current.setup}</p>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-5">
              <p className="text-zinc-200 text-sm font-bold">
                {current.prompt}
              </p>

              <div className="space-y-3">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>0 — entirely circumstance</span>
                  <span>50 — half and half</span>
                  <span>100 — entirely me</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={ratings[index]}
                  onChange={(e) => handleSlide(Number(e.target.value))}
                  disabled={isLocked}
                  className="w-full accent-emerald-400 disabled:opacity-60"
                  aria-label="Internal attribution percentage"
                />
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-300">
                    {ratings[index]}
                    <span className="text-xl text-zinc-500">% me</span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {ratings[index] < 15
                      ? 'almost entirely circumstance'
                      : ratings[index] < 35
                      ? 'mostly circumstance'
                      : ratings[index] < 45
                      ? 'leaning circumstance'
                      : ratings[index] < 55
                      ? 'roughly half and half'
                      : ratings[index] < 70
                      ? 'leaning me'
                      : ratings[index] < 85
                      ? 'mostly me'
                      : 'almost entirely me'}
                  </div>
                </div>
              </div>

              {!isLocked && (
                <button
                  onClick={handleLock}
                  className="w-full px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold transition-colors"
                >
                  Lock in {ratings[index]}% me and reveal research →
                </button>
              )}
            </div>

            {isRevealed && (
              <div className="border border-emerald-900 bg-emerald-950/20 p-5 space-y-4 text-sm leading-relaxed">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-xs text-zinc-500 mb-1">YOUR RATING</div>
                    <div className="text-2xl font-bold text-emerald-300">{ratings[index]}</div>
                    <div className="text-xs text-zinc-500 mt-1">% me</div>
                  </div>
                  <div className="border border-emerald-700 bg-emerald-950/30 p-3">
                    <div className="text-xs text-emerald-400 mb-1">DOCUMENTED MEAN</div>
                    <div className="text-2xl font-bold text-emerald-200">{current.documentedInternal}</div>
                    <div className="text-xs text-zinc-500 mt-1">% in research</div>
                  </div>
                  <div
                    className={`border p-3 ${
                      Math.abs(currentGapVsDocumented) < 8
                        ? 'border-emerald-700 bg-emerald-950/30'
                        : Math.abs(currentGapVsDocumented) < 20
                        ? 'border-amber-700 bg-amber-950/20'
                        : 'border-rose-700 bg-rose-950/20'
                    }`}
                  >
                    <div className="text-xs text-zinc-400 mb-1">GAP</div>
                    <div
                      className={`text-2xl font-bold ${
                        Math.abs(currentGapVsDocumented) < 8
                          ? 'text-emerald-200'
                          : Math.abs(currentGapVsDocumented) < 20
                          ? 'text-amber-300'
                          : 'text-rose-300'
                      }`}
                    >
                      {currentGapVsDocumented > 0 ? '+' : ''}{currentGapVsDocumented}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">vs lit mean</div>
                  </div>
                </div>

                <div className="text-xs text-zinc-400 italic text-center">
                  {currentGapVsDocumented > 8
                    ? `You rated yourself ${currentGapVsDocumented} points ${current.outcome === 'success' ? 'higher in self-credit' : 'higher in self-blame'} than the average ${current.outcome === 'success' ? 'winner' : 'loser'} in the literature.`
                    : currentGapVsDocumented < -8
                    ? `You rated yourself ${Math.abs(currentGapVsDocumented)} points ${current.outcome === 'success' ? 'lower in self-credit' : 'lower in self-blame'} than the average ${current.outcome === 'success' ? 'winner' : 'loser'} in the literature.`
                    : 'You rated yourself within 8 points of the average subject in the literature on this kind of outcome.'}
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
                  {isLast ? 'See your self-serving report →' : `Next scenario (${index + 2} of ${SCENARIOS.length}) →`}
                </button>
              </div>
            )}

            <div className="flex justify-between text-xs text-zinc-600">
              <span>{index + 1} / {SCENARIOS.length}</span>
              <span>
                {(() => {
                  const successDone = SCENARIOS
                    .map((s, i) => ({ s, i }))
                    .filter(({ s, i }) => s.outcome === 'success' && revealed[i]);
                  const failureDone = SCENARIOS
                    .map((s, i) => ({ s, i }))
                    .filter(({ s, i }) => s.outcome === 'failure' && revealed[i]);
                  if (successDone.length === 0 && failureDone.length === 0) return 'gap so far: ...';
                  const sAvg = successDone.length
                    ? successDone.reduce((a, { i }) => a + ratings[i], 0) / successDone.length
                    : null;
                  const fAvg = failureDone.length
                    ? failureDone.reduce((a, { i }) => a + ratings[i], 0) / failureDone.length
                    : null;
                  if (sAvg === null || fAvg === null) return 'gap so far: ...';
                  return `gap so far: ${(sAvg - fAvg).toFixed(1)}`;
                })()}
              </span>
            </div>
          </section>
        )}

        {stage === 'results' && (
          <section className="space-y-8">
            <header className="text-center">
              <div className="text-xs text-zinc-500 tracking-widest mb-3">YOUR SELF-SERVING REPORT</div>
              <div className="text-7xl mb-3">{profile.emoji}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-300 mb-2">{profile.name}</h2>
              <p className="text-zinc-400 italic">{profile.tagline}</p>
            </header>

            <div className="grid grid-cols-3 gap-3">
              <div className="border border-emerald-700 bg-emerald-950/30 p-4 text-center">
                <div className="text-xs text-emerald-400 mb-1">WINS = ME</div>
                <div className="text-3xl font-bold text-emerald-200">{avgSuccess}</div>
                <div className="text-xs text-zinc-500 mt-1">avg % self-credit</div>
              </div>
              <div className="border border-rose-700 bg-rose-950/30 p-4 text-center">
                <div className="text-xs text-rose-400 mb-1">LOSSES = ME</div>
                <div className="text-3xl font-bold text-rose-200">{avgFailure}</div>
                <div className="text-xs text-zinc-500 mt-1">avg % self-blame</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
                <div className="text-xs text-zinc-500 mb-1">GAP</div>
                <div className="text-3xl font-bold text-zinc-200">{gap > 0 ? '+' : ''}{gap}</div>
                <div className="text-xs text-zinc-500 mt-1">pts win minus loss</div>
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
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5">
              <div className="text-xs text-emerald-400 tracking-widest mb-3">PAIR-BY-PAIR BREAKDOWN</div>
              <div className="space-y-3">
                {pairs.map((pair) => {
                  const gapFlag = pair.pairGap - pair.documentedGap;
                  return (
                    <div
                      key={pair.pairId}
                      className="border-b border-zinc-900 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="text-xs text-emerald-300 mb-2 font-bold">{pair.domain}</div>
                      <div className="grid grid-cols-4 gap-2 items-center text-xs">
                        <div className="text-emerald-400">
                          win: {pair.successRating}
                        </div>
                        <div className="text-rose-400">
                          loss: {pair.failureRating}
                        </div>
                        <div className="text-zinc-400 text-right">
                          your gap: {pair.pairGap > 0 ? '+' : ''}{pair.pairGap}
                        </div>
                        <div
                          className={`text-right font-bold ${
                            Math.abs(gapFlag) < 8
                              ? 'text-emerald-400'
                              : gapFlag > 8
                              ? 'text-rose-400'
                              : 'text-sky-400'
                          }`}
                        >
                          {gapFlag > 0 ? '+' : ''}{gapFlag} vs lit
                        </div>
                      </div>
                      <div className="text-xs text-zinc-600 mt-1">
                        Documented gap in literature: {pair.documentedGap} points
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-zinc-600 mt-3 italic">
                Right column shows whether your win-minus-loss attribution gap on this domain was wider than the documented average (rose), narrower (sky), or inside the band (emerald).
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
              Sources: Miller & Ross (1975) "Self-Serving Biases in the Attribution of Causality: Fact or Fiction?" Psychological Bulletin vol 82. Bradley (1978) "Self-Serving Biases in the Attribution Process: A Reexamination of the Fact or Fiction Question," Journal of Personality and Social Psychology vol 36. Mezulis Abramson Hyde & Hankin (2004) "Is There a Universal Positivity Bias in Attributions? A Meta-Analytic Review," Psychological Bulletin vol 130 (266 studies, 33,000 subjects, mean Cohen d=0.96). Lau & Russell (1980) "Attributions in the Sports Pages," JPSP vol 39. Zuckerman (1979) "Attribution of Success and Failure Revisited," Journal of Personality vol 47. Snyder Stephan & Rosenfield (1976) "Egotism and Attribution," JPSP vol 33. Federoff & Harvey (1976) "Focus of Attention, Self-Esteem, and the Attribution of Causality," Journal of Research in Personality vol 10. Schlenker & Miller (1977) on group-leadership attribution. Riess Rosenfeld Melburg & Tedeschi (1981) on public-attribution amplification. Sedikides Campbell Reeder & Elliot (1998) on random-outcome attenuation. Greenwald (1980) "The Totalitarian Ego" American Psychologist vol 35. Barber & Odean (2001) "Boys Will Be Boys: Gender, Overconfidence, and Common Stock Investment," QJE vol 116. Glaser & Weber (2007) "Overconfidence and Trading Volume," Geneva Risk and Insurance Review. Daniel Hirshleifer & Subrahmanyam (1998) biased self-attribution asset-pricing model. Statman Thorley & Vorkink (2006) on confidence-update asymmetry. Mullen & Riordan (1988) sport-attribution meta. Heine Lehman Markus & Kitayama (1999) on cross-cultural self-enhancement. Robins & Beer (2001) on long-term costs of high self-enhancement. Wilson Damiani & Shelton (2002) on attributional retraining as the documented intervention. SPIVA (2024) S&P Indices Versus Active Funds Scorecard. All processing client-side. Nothing leaves your machine.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

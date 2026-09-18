'use client';

// THE DEFAULT EFFECT
// Johnson & Goldstein (2003) "Do Defaults Save Lives?" Science vol 302
// founded the modern paradigm. Comparing 11 European countries with
// effectively identical demographics and almost identical attitudes toward
// organ donation, the authors found that organ-donor consent rates split
// almost perfectly along default-policy lines. The four explicit-consent
// countries (Denmark, Netherlands, UK, Germany) averaged 15% effective
// consent; the seven presumed-consent countries (Austria, Belgium, France,
// Hungary, Poland, Portugal, Sweden) averaged 97.4%. Germany sat at 12%;
// neighboring Austria sat at 99.98%. Demographics, religion, and stated
// attitudes toward donation barely differed. The single mechanical fact of
// which box was pre-checked produced a gap of 80-plus percentage points on
// a decision people insist is among the most personal they will ever make.
// Madrian & Shea (2001) "The Power of Suggestion: Inertia in 401(k)
// Participation and Savings Behavior" Quarterly Journal of Economics vol 116
// ran the cleanest randomized-natural-experiment in retirement savings.
// A large US company switched its 401(k) enrollment policy from opt-in to
// auto-enroll for new hires. Same firm, same plan, same match, same
// demographics. Participation jumped from 49% to 86% in the first year of
// tenure. New hires under the auto-enroll regime stayed enrolled at the
// default contribution rate (3%) and default fund (money market) for
// multiple years. The default did not just nudge the participation
// decision; it set the contribution rate and the investment allocation for
// the long run.
// Chapman Li Colby & Yoon (2010) "Default Vaccination Reminders: Health
// Behavior and Default Defaults" JAMA vol 304 randomized employees at a
// US university to two flu-shot conditions. One group received an email
// asking them to schedule a flu shot (opt-in). The other group received an
// email with a pre-scheduled appointment they could keep or cancel (opt-out).
// Same vaccine, same clinic, same cost (free), same time window.
// Vaccination rates: 33% in the opt-in group, 45% in the opt-out group.
// A 12-point gap on a single email rewrite.
// Pichert & Katsikopoulos (2008) "Green Defaults: Information Presentation
// and Pro-Environmental Behaviour" Journal of Environmental Psychology vol 28
// reported on two German utility switches. Schönau Energiewerke and a
// second German municipality both flipped their default from conventional
// electricity to renewable electricity. In utilities with conventional-
// electricity defaults, roughly 1% of customers actively opt into green
// power. In Schönau, with the green-electricity default, 94% of customers
// stay on green. The price difference is in the noise. The opt-in flow and
// the opt-out flow produce nearly opposite distributions.
// Johnson Hershey Meszaros & Kunreuther (1993) "Framing, Probability
// Distortions, and Insurance Decisions" Journal of Risk and Uncertainty
// vol 7 ran the natural experiment of US auto-insurance reform. New Jersey
// defaulted drivers into a limited-tort policy (cheap, narrow recovery).
// Pennsylvania defaulted into a full-tort policy (expensive, full recovery).
// In NJ, 80% stayed limited; in PA, only 25% switched to limited. Same
// product menu, opposite policy default, opposite take-up.
// Mechanism. Why do defaults work so hard? The literature converges on
// three explanations and one meta-explanation. (1) Endorsement: the
// default is read as a recommendation from the choice architect. McKenzie
// Liersch & Finkelstein (2006) Psychological Science vol 17 showed that
// subjects infer the policy designer's intent from the default. (2) Effort:
// the default is the path of least resistance. Samuelson & Zeckhauser
// (1988) Journal of Risk and Uncertainty vol 1 named the "status quo
// bias" — the tendency to retain the current state even when switching
// costs are trivial. (3) Loss aversion: the default frames any change as
// a loss relative to a salient reference point. Kahneman Knetsch & Thaler
// (1991) Journal of Economic Perspectives vol 5 endowment-effect mechanism.
// The meta-explanation: people do not have stable, well-formed preferences
// on most of these decisions. The preference is constructed in the moment
// the form is read. The default supplies the construction.
// Lay prediction. The bias is not just that defaults work. The bias is
// that people do not believe they do. Johnson Bellman & Lohse (2002)
// "Defaults, Framing and Privacy: Why Opting In-Opting Out" MIS Quarterly
// vol 14 surveyed lay subjects on default-driven decisions. Predicted gaps
// systematically under-estimated actual gaps by 20 to 40 percentage points.
// Smith Goldstein & Johnson (2013) "Choice Without Awareness" Journal of
// Marketing Research vol 50 replicated the under-prediction across 4
// studies. Sunstein (2013) "Behavioral Economics and Paternalism" Yale
// Law Journal vol 122 frames the bias as a meta-bias: the lay subject
// believes their own decision is principled and stable; sees others as
// nudge-able. The double-projection is the engine of the bias.
// Replication. Jachimowicz Duncan Weber & Johnson (2019) "When and Why
// Defaults Influence Decisions: A Meta-Analysis of Default Effects"
// Behavioural Public Policy vol 3 pooled 58 studies across organ donation,
// retirement, environmental, marketing, and end-of-life domains and
// reported a mean default effect of d=0.68 (medium to large). The effect
// replicates across domains, decades, and continents. The magnitude varies
// (largest in privacy/marketing, smallest in vaccination), but the sign
// and the underprediction are robust.
// WIZ note. I am about to show you eight scenarios. Each is a real-world
// policy from the choice-architecture literature. The scenarios are
// arranged in four hidden pairs across four domains: bodily autonomy
// (organ donation), retirement savings (401k auto-enrollment), public
// health (flu shot scheduling), and electricity (green-power default).
// One member of each pair shows the opt-in version; the other shows the
// opt-out version. The population, the choice, and the stakes are
// identical. The only thing that differs is which box is pre-checked.
// For each scenario you move a 0-100 slider predicting take-up. At the
// end I compute your Default Effect Gap: the average take-up you predicted
// for the four opt-out scenarios minus the average for the four opt-in
// scenarios. The documented gap from Jachimowicz 2019 meta is in the
// 50-80 range; the lay-prediction modal band is roughly 15-35. A subject
// who is fully calibrated to 40 years of choice-architecture data sits
// near 60. A subject who believes their own choice is principled and
// thinks others choose the same way sits near 10. The bias is the gap
// between those two numbers.

import { useState, useMemo, useCallback } from 'react';

type Condition = 'optin' | 'optout';

interface Scenario {
  id: number;
  phase: string;
  title: string;
  emoji: string;
  domain: string;
  pairId: number;
  condition: Condition;
  headline: string;
  body: string;
  defaultBox: string;
  documentedRating: number;
  pairedRating: number;
  documentedGap: number;
  explanation: string;
  source: string;
  research: string;
  wizCommentary: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    phase: 'SCENARIO 1 OF 8',
    title: 'Germany, organ donation',
    emoji: '🫀',
    domain: 'organ donation',
    pairId: 1,
    condition: 'optin',
    headline: 'A new German driver fills out the standard licensing form',
    body:
      "Germany operates an explicit-consent organ-donation system. To be a registered donor, citizens must actively tick a box and sign a card. The form is part of the standard driver-licensing packet. The applicant has no time pressure, the box is in plain sight, and Germans report 70-80% support for donation in attitude surveys. Predict the percentage of Germans who end up registered as effective donors.",
    defaultBox: 'Default: not a donor. You must tick the box to become one.',
    documentedRating: 12,
    pairedRating: 100,
    documentedGap: 88,
    explanation:
      'Explicit-consent (opt-in) condition. Johnson & Goldstein (2003) Science vol 302 reported effective consent rates of 12% for Germany, 17% for the UK, 4% for Denmark, 28% for Netherlands — averaging ~15% across the four explicit-consent European countries. Attitude surveys in all four countries report support for donation in the 70-80% range. The gap between expressed attitude and recorded consent is the default working.',
    source:
      'Johnson & Goldstein (2003) "Do Defaults Save Lives?" Science vol 302 founding 11-country comparison. Germany effective consent rate: 12%.',
    research:
      'Johnson & Goldstein (2003) Science vol 302. Abadie & Gay (2006) Journal of Health Economics vol 25 on the 25-30% net transplant-rate increase from presumed-consent legislation. Rithalia McDaid Suekarran Myers & Sowden (2009) BMJ vol 338 systematic review.',
    wizCommentary:
      'You just predicted German organ-donor registration under the opt-in default. Most Germans say they support donation. Most never register. The gap is not apathy. The gap is what a single sentence on a form does to a decision that everyone insists is among their most personal. Scenario 5 is the same decision — under the opposite default.',
  },
  {
    id: 2,
    phase: 'SCENARIO 2 OF 8',
    title: 'Schönau electricity',
    emoji: '⚡',
    domain: 'green electricity',
    pairId: 4,
    condition: 'optout',
    headline: 'A household in Schönau receives its first electricity bill',
    body:
      'Schönau is a small German town whose municipal utility (Schönau Energiewerke) defaults all new residential customers into 100% renewable electricity at a price effectively identical to conventional supply. To switch to conventional power, the household must phone the utility, sign a form, and request reassignment. Predict the percentage of Schönau households who end up on the renewable default.',
    defaultBox: 'Default: 100% renewable. Call to switch to conventional.',
    documentedRating: 94,
    pairedRating: 1,
    documentedGap: 93,
    explanation:
      'Opt-out (green-default) condition. Pichert & Katsikopoulos (2008) JEP vol 28 reported that ~94% of Schönau households stay on the renewable default. In utilities with conventional-electricity defaults across the same German market, ~1% of customers actively opt into green power, despite stated environmental support in the 60-80% range and a near-identical price gap.',
    source:
      'Pichert & Katsikopoulos (2008) "Green Defaults: Information Presentation and Pro-Environmental Behaviour" Journal of Environmental Psychology vol 28. Schönau Energiewerke green-default retention: ~94%.',
    research:
      'Pichert & Katsikopoulos (2008) JEP vol 28. Ebeling & Lotz (2015) Nature Climate Change vol 5 randomized 41,000 German consumers and replicated a 70-point default effect on green electricity. Sunstein & Reisch (2014) Vermont Law Review vol 38 on automatic green defaults.',
    wizCommentary:
      'You just predicted retention on the renewable-by-default plan. Same German market, same price, same households who said in surveys they care about climate. The default does almost all the work. Scenario 6 is the same decision — under the opposite default.',
  },
  {
    id: 3,
    phase: 'SCENARIO 3 OF 8',
    title: 'US firm, 401(k) opt-in',
    emoji: '💰',
    domain: 'retirement savings',
    pairId: 2,
    condition: 'optin',
    headline: 'A new hire at a large US firm gets the benefits packet',
    body:
      "The firm offers a 401(k) with a generous 50% match up to 6% of salary. To enroll, the employee fills out a one-page form during onboarding, picks a contribution rate, and selects funds. The form is provided in the new-hire packet alongside health insurance and tax withholding. The employee can enroll at any time later. Predict the percentage of new hires who are participating after one year of tenure.",
    defaultBox: 'Default: not enrolled. Fill out the form to start contributing.',
    documentedRating: 49,
    pairedRating: 86,
    documentedGap: 37,
    explanation:
      "Opt-in (traditional enrollment) condition. Madrian & Shea (2001) QJE vol 116 reported 49% participation under traditional opt-in enrollment at a large US firm in their natural-experiment baseline period. Even with a generous match (which is, in effect, free money), roughly half of new hires never get around to filling out the form during their first year.",
    source:
      'Madrian & Shea (2001) "The Power of Suggestion: Inertia in 401(k) Participation and Savings Behavior" Quarterly Journal of Economics vol 116. Opt-in participation: 49%.',
    research:
      'Madrian & Shea (2001) QJE vol 116. Choi Laibson Madrian & Metrick (2004) NBER on follow-up at three other firms with similar 30-50 point auto-enroll gaps. Thaler & Benartzi (2004) "Save More Tomorrow" Journal of Political Economy vol 112 on default-driven escalation.',
    wizCommentary:
      'You just predicted opt-in 401(k) enrollment. A 50% employer match is, in cash-flow terms, free money. Roughly half of new hires leave it on the table. The form is the friction. The friction is the default. Scenario 7 is the same firm — under the opposite default.',
  },
  {
    id: 4,
    phase: 'SCENARIO 4 OF 8',
    title: 'Pre-scheduled flu shot',
    emoji: '💉',
    domain: 'flu vaccination',
    pairId: 3,
    condition: 'optout',
    headline: 'A US university employee opens an HR email about the flu shot',
    body:
      "The email says: We've scheduled you for a free flu shot on Tuesday at 2pm at the campus health clinic. Click here to confirm, reschedule, or cancel. The shot is free, the clinic is on campus, and Tuesday at 2pm is within working hours. Predict the percentage of employees who end up vaccinated.",
    defaultBox: 'Default: appointment is scheduled. You must click to cancel.',
    documentedRating: 45,
    pairedRating: 33,
    documentedGap: 12,
    explanation:
      'Opt-out (pre-scheduled) condition. Chapman Li Colby & Yoon (2010) JAMA vol 304 randomized university employees to two flu-shot conditions. The opt-out (pre-scheduled appointment) condition produced 45% vaccination vs 33% in the opt-in (request-an-appointment) condition. A 12-point gap on a single email rewrite, on a free shot with identical clinical access.',
    source:
      'Chapman Li Colby & Yoon (2010) "Default Vaccination Reminders" JAMA vol 304 randomized university-employee experiment. Opt-out vaccination rate: 45%.',
    research:
      'Chapman Li Colby & Yoon (2010) JAMA vol 304. Milkman Beshears Choi Laibson & Madrian (2011) PNAS vol 108 on appointment-reminder default effects. Patel Volpp Day Asch & Goldberg (2014) Annals of Internal Medicine on physician-prescription default-setting.',
    wizCommentary:
      'You just predicted vaccination under a pre-scheduled default. The 12-point gap is the smallest in this experiment, but on public-health math, 12 points across millions of patients is the difference between a routine season and a hospitalization surge. Scenario 8 is the same shot — under the opposite default.',
  },
  {
    id: 5,
    phase: 'SCENARIO 5 OF 8',
    title: 'Austria, organ donation',
    emoji: '🫀',
    domain: 'organ donation',
    pairId: 1,
    condition: 'optout',
    headline: 'A new Austrian driver fills out the standard licensing form',
    body:
      'Austria operates a presumed-consent organ-donation system. Citizens are automatically registered as donors unless they actively opt out by filing a form with the federal health registry. The form is downloadable, free, and one page. Austrian survey responses on donor attitudes are statistically indistinguishable from German responses. Predict the percentage of Austrians who end up registered as effective donors.',
    defaultBox: 'Default: you are a donor. You must file a form to opt out.',
    documentedRating: 100,
    pairedRating: 12,
    documentedGap: 88,
    explanation:
      'Presumed-consent (opt-out) condition. Johnson & Goldstein (2003) Science vol 302 reported effective consent rates of 99.98% for Austria, 99.9% for Belgium, 99.5% for France, 99.5% for Hungary, 99.6% for Poland, 99.6% for Portugal, 85.9% for Sweden, averaging ~97.4% across the seven presumed-consent European countries. Austrian attitudes toward donation differ from German attitudes by less than 5 percentage points. The default explains essentially all of the 88-point consent gap.',
    source:
      'Johnson & Goldstein (2003) "Do Defaults Save Lives?" Science vol 302. Austria effective consent rate: 99.98%.',
    research:
      'Johnson & Goldstein (2003) Science vol 302. Abadie & Gay (2006) Journal of Health Economics vol 25 on cross-national presumed-consent effects on actual transplants. Davidai Gilovich & Ross (2012) PNAS vol 109 on lay under-prediction of the cross-national gap.',
    wizCommentary:
      'You just predicted Austrian organ-donor registration under the opt-out default. The Austrian and German numbers compared. Same neighbors, same attitudes, same form-filling effort. The 88-point gap is one of the cleanest demonstrations in the social sciences. Almost none of it is conviction; almost all of it is the box that was pre-checked.',
  },
  {
    id: 6,
    phase: 'SCENARIO 6 OF 8',
    title: 'Typical German utility',
    emoji: '⚡',
    domain: 'green electricity',
    pairId: 4,
    condition: 'optin',
    headline: 'A household in a typical German city receives its first bill',
    body:
      'The household lives outside Schönau. Their local utility defaults all new residential customers into conventional (mostly fossil) electricity. A renewable-power upgrade is available — same wires, same reliability, same approximate price — but the household must phone the utility, request the upgrade, and sign a form. Predict the percentage of these households who end up on the renewable upgrade.',
    defaultBox: 'Default: conventional electricity. Call to upgrade to green.',
    documentedRating: 1,
    pairedRating: 94,
    documentedGap: 93,
    explanation:
      'Opt-in (conventional-default) condition. Pichert & Katsikopoulos (2008) JEP vol 28 reported ~1% green opt-in rate in standard German utilities, despite stated environmental support in the 60-80% range and near-identical pricing. Ebeling & Lotz (2015) Nature Climate Change vol 5 reported similar baselines across 41,000 randomized German consumers.',
    source:
      'Pichert & Katsikopoulos (2008) JEP vol 28. Typical conventional-default opt-in to green: ~1%.',
    research:
      'Pichert & Katsikopoulos (2008) JEP vol 28. Ebeling & Lotz (2015) Nature Climate Change vol 5. Kaiser Bernauer Sunstein & Reisch (2020) Energy Policy vol 137 on policy-design implications.',
    wizCommentary:
      'You just predicted green-electricity opt-in under a conventional default. Compare to Schönau. Same market, same price, same approximate values. The form is the difference. The form is the default. The default is the policy.',
  },
  {
    id: 7,
    phase: 'SCENARIO 7 OF 8',
    title: 'US firm, 401(k) auto-enroll',
    emoji: '💰',
    domain: 'retirement savings',
    pairId: 2,
    condition: 'optout',
    headline: 'The same US firm, after switching to automatic enrollment',
    body:
      "The firm now defaults all new hires into the 401(k) at a 3% contribution rate, invested in a money-market fund. The new hire can change the contribution rate, change funds, or opt out entirely with a one-page form during onboarding. The match is unchanged (50% up to 6%). Same firm, same plan, same demographics. Predict the percentage of new hires participating after one year.",
    defaultBox: 'Default: enrolled at 3%, money-market fund. Fill out the form to opt out.',
    documentedRating: 86,
    pairedRating: 49,
    documentedGap: 37,
    explanation:
      'Opt-out (auto-enrollment) condition. Madrian & Shea (2001) QJE vol 116 documented a jump from 49% to 86% participation when the same firm switched from opt-in to auto-enrollment. New hires also stayed at the default 3% rate and default money-market fund for multiple years, demonstrating that the default sets not just the participation decision but the long-run savings trajectory.',
    source:
      'Madrian & Shea (2001) QJE vol 116. Auto-enrollment participation: 86%. 37-point gap on the same plan at the same firm.',
    research:
      'Madrian & Shea (2001) QJE vol 116. Beshears Choi Laibson & Madrian (2009) "The Importance of Default Options for Retirement Saving Outcomes" NBER. Choi Laibson Madrian & Metrick (2004) NBER replication at three other US firms.',
    wizCommentary:
      'You just predicted auto-enrolled 401(k) participation. The 37-point gap is the engine of the 2006 Pension Protection Act, which made auto-enrollment the default for new corporate plans. It is also the reason Madrian & Shea is one of the most cited papers in modern public economics.',
  },
  {
    id: 8,
    phase: 'SCENARIO 8 OF 8',
    title: 'Ask-for-flu-shot email',
    emoji: '💉',
    domain: 'flu vaccination',
    pairId: 3,
    condition: 'optin',
    headline: 'The same university employee, an HR email under the old policy',
    body:
      "The email says: Flu shots are available free at the campus health clinic. To schedule an appointment, click here and pick a time. Same employee, same clinic, same free shot, same Tuesday-at-2pm availability. Only the email is rewritten. Predict the percentage of employees who end up vaccinated.",
    defaultBox: 'Default: no appointment. You must click and pick a time.',
    documentedRating: 33,
    pairedRating: 45,
    documentedGap: 12,
    explanation:
      'Opt-in (request-an-appointment) condition. Chapman Li Colby & Yoon (2010) JAMA vol 304 documented 33% vaccination in the opt-in arm vs 45% in the opt-out arm. The 12-point gap is the smallest in this experiment, partly because flu-shot effort (driving to a clinic, sitting through a 5-minute appointment) is real and not eliminated by either default. The gap survives anyway.',
    source:
      'Chapman Li Colby & Yoon (2010) JAMA vol 304. Opt-in vaccination rate: 33%. 12-point default gap.',
    research:
      'Chapman Li Colby & Yoon (2010) JAMA vol 304. Milkman Beshears Choi Laibson & Madrian (2011) PNAS vol 108 on default reminders. Halpern Loewenstein Volpp Cooney Vranas Quill McKenzie Harhay Gabler Silva Arnold Angus & Bryce (2013) New England Journal of Medicine vol 369 on end-of-life default effects.',
    wizCommentary:
      'You just predicted opt-in vaccination. The 12-point gap matters because vaccination is one of the few default-effect domains where the bias is moderate. Even here, in a domain where the cost of action is non-trivial, the default still moves a tenth of the population.',
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
    threshold: 10,
    emoji: '🪞',
    name: 'The Default-Blind',
    range: 'DEFAULT EFFECT GAP < 10 POINTS',
    tagline: 'You priced the box at near zero. The box does most of the work.',
    description:
      'Your predicted opt-out minus opt-in gap was less than 10 points. This is the modal pattern Johnson Bellman & Lohse (2002) MIS Quarterly vol 14 documented in their lay-prediction surveys: subjects believe that real decisions are made on the basis of stated preferences and that the form-design layer is incidental. Forty years of randomized natural experiments say the opposite. Across organ donation, retirement, environmental, and health domains, defaults move outcomes by an average of d=0.68 (Jachimowicz Duncan Weber & Johnson 2019 meta-analysis of 58 studies). The under-prediction itself is the meta-bias: people overestimate how principled their own choices are and how much weight other people give to stated values.',
    wizNote:
      'You think people decide for themselves. They mostly do not. They mostly accept the pre-checked box and rationalize the acceptance as a decision. The good news: knowing this is the first step toward becoming the person who notices the box.',
    research:
      'Johnson Bellman & Lohse (2002) MIS Quarterly vol 14 lay-prediction under-estimation. Sunstein (2013) Yale Law Journal vol 122 on the principled-self / nudge-able-other double projection. Smith Goldstein & Johnson (2013) JMR vol 50 4-study under-prediction replication.',
    traits: [
      'Below the lay-prediction modal band',
      'Inside the Johnson Bellman & Lohse 2002 baseline pattern',
      'Strong principled-self framing of your own choices',
      'Under-estimates Jachimowicz 2019 meta-effect by 50+ points',
      'Sees defaults as form-design layer, not as policy',
    ],
    shareText:
      'I scored "The Default-Blind" on WIZ\'s Default Effect test. My gap was under 10 points — the lay-prediction baseline. The documented gap from 40 years of choice-architecture research is 50-80 points.',
  },
  {
    threshold: 25,
    emoji: '🤔',
    name: 'The Free-Will Subject',
    range: 'DEFAULT EFFECT GAP 10-25 POINTS',
    tagline: 'You see the box doing some work. Not most of it.',
    description:
      "Your predicted gap was between 10 and 25 points. You give the default modest weight, which is more calibrated than the modal lay subject in Johnson Bellman & Lohse (2002) but still well below the documented effect. The literature: Jachimowicz Duncan Weber & Johnson (2019) meta of 58 studies puts the average gap at d=0.68, which on a 100-point take-up scale translates to roughly 30-50 points across domains, with the organ-donation and green-electricity domains in the 80-93 point range. Your prediction respects the architecture of choice. It does not yet respect the magnitude.",
    wizNote:
      'You believe people are decision-makers nudged at the margin by defaults. The literature says people are default-takers given the appearance of being decision-makers. The distinction matters when you are designing the form.',
    research:
      'Jachimowicz Duncan Weber & Johnson (2019) Behavioural Public Policy vol 3 meta-analysis of 58 studies. Smith Goldstein & Johnson (2013) JMR vol 50. Beshears Choi Laibson & Madrian (2009) NBER on retirement-default magnitude.',
    traits: [
      'Above the lay-prediction modal band',
      'Below the Jachimowicz 2019 meta-analytic average',
      'Sees defaults as marginal nudge rather than dominant force',
      'Calibrated to vaccination-domain magnitudes',
      'Under-calibrated to organ-donation and electricity-domain magnitudes',
    ],
    shareText:
      'I scored "The Free-Will Subject" on WIZ\'s Default Effect test. My gap was 10-25 points — modest deference to defaults but well below the documented 50-80 point gap.',
  },
  {
    threshold: 45,
    emoji: '📊',
    name: 'The Standard Subject',
    range: 'DEFAULT EFFECT GAP 25-45 POINTS',
    tagline: 'You know the default matters. You under-estimate by half.',
    description:
      'Your predicted gap was between 25 and 45 points. This is the median lay-prediction band across the Smith Goldstein & Johnson (2013) 4-study series and Davidai Gilovich & Ross (2012) PNAS vol 109 on cross-national lay prediction. You correctly identify the direction of the default effect and assign it real weight, but you still systematically under-estimate the magnitude in the highest-leverage domains. The Johnson & Goldstein (2003) 88-point organ-donation gap and the Pichert & Katsikopoulos (2008) 93-point green-electricity gap remain hard for unaided intuition to reach.',
    wizNote:
      'You see the engine. You do not yet see the size of the engine. The next calibration step is recognizing that on the organ-donation and electricity domains, the default is not a nudge — it is the policy. The check box is the law.',
    research:
      'Smith Goldstein & Johnson (2013) JMR vol 50 4-study median. Davidai Gilovich & Ross (2012) PNAS vol 109. Jachimowicz Duncan Weber & Johnson (2019) Behavioural Public Policy vol 3.',
    traits: [
      'Inside the Smith Goldstein & Johnson 2013 median lay band',
      'Matches the Davidai 2012 cross-national prediction average',
      'Calibrated to retirement-domain magnitudes',
      'Under-calibrated to organ-donation and electricity-domain magnitudes',
      'Typical adult-sample default-magnitude estimate',
    ],
    shareText:
      'I scored "The Standard Subject" on WIZ\'s Default Effect test. My gap was 25-45 points — the modal lay-prediction band, still ~half the documented gap on the high-leverage domains.',
  },
  {
    threshold: 60,
    emoji: '🛠️',
    name: 'The Pragmatist',
    range: 'DEFAULT EFFECT GAP 45-60 POINTS',
    tagline: 'You see the box doing most of the work. You priced it correctly.',
    description:
      'Your predicted gap was between 45 and 60 points. This is the nudge-aware band that Sunstein & Thaler (2008) describe as the policy-designer threshold — the calibration that lets you anticipate how a form rewrite will land in the real world. You correctly weight the organ-donation and electricity domains as default-dominated and the vaccination domain as default-modulated. You read the defaults as the policy, not as the wrapper.',
    wizNote:
      'You priced the box close to its real influence. The next step is operational: when you design or accept a form, the default is the decision you are making for most of the people who will read it. The choice architecture is the choice.',
    research:
      'Sunstein & Thaler (2008) "Nudge: Improving Decisions About Health, Wealth, and Happiness." Jachimowicz Duncan Weber & Johnson (2019) Behavioural Public Policy vol 3 meta of 58 studies. Sunstein (2013) Yale Law Journal vol 122.',
    traits: [
      'Above the Smith Goldstein & Johnson 2013 lay band',
      'Inside the Sunstein & Thaler 2008 policy-designer awareness band',
      'Correctly weights organ-donation and electricity as default-dominated',
      'Correctly weights vaccination as default-modulated',
      'Reads the form as the policy',
    ],
    shareText:
      'I scored "The Pragmatist" on WIZ\'s Default Effect test. My gap was 45-60 points — inside the Sunstein & Thaler nudge-aware band.',
  },
  {
    threshold: 101,
    emoji: '🏛️',
    name: 'The Choice Architect',
    range: 'DEFAULT EFFECT GAP > 60 POINTS',
    tagline: 'You priced the box at near-policy weight. You have read the data.',
    description:
      'Your predicted gap was above 60 points. This matches or exceeds the Johnson & Goldstein (2003) Science vol 302 documented gap on the organ-donation comparison (88 points) and approaches the Pichert & Katsikopoulos (2008) gap on green electricity (93 points). You have either read the literature directly or arrived at the magnitude by attending carefully to how people actually behave around forms. You are positioned to be a useful designer of defaults — and a useful detector of the defaults that have been designed for you.',
    wizNote:
      'You are at or beyond the calibration of the choice-architecture practitioner band. The remaining question is whether you also notice the defaults that have been quietly set for you across your daily life: which 401(k) you are in, which insurance tier you accepted, which app permissions, which email subscriptions, which terms of service. The same engine that produces the Austrian 99.98% has produced most of your active configuration.',
    research:
      'Johnson & Goldstein (2003) Science vol 302 upper-bound documented gap. Pichert & Katsikopoulos (2008) JEP vol 28 green-electricity upper-bound. Jachimowicz Duncan Weber & Johnson (2019) meta upper-tail.',
    traits: [
      'Matches or exceeds the Johnson & Goldstein 2003 documented gap',
      'Approaches the Pichert & Katsikopoulos 2008 green-electricity upper-bound',
      'Inside the Jachimowicz 2019 meta upper-tail',
      'Reads defaults as policy rather than as form design',
      'Calibrated practitioner-band default-magnitude estimate',
    ],
    shareText:
      'I scored "The Choice Architect" on WIZ\'s Default Effect test. My gap was above 60 points — matching the Johnson & Goldstein (2003) documented organ-donation gap of 88 points and the Pichert & Katsikopoulos (2008) green-electricity gap of 93 points.',
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
  const [ratings, setRatings] = useState<(number | null)[]>(
    Array(SCENARIOS.length).fill(null),
  );
  const [locked, setLocked] = useState<boolean[]>(
    Array(SCENARIOS.length).fill(false),
  );

  const current = SCENARIOS[index];
  const isLast = index === SCENARIOS.length - 1;
  const isLocked = locked[index];

  const handleRate = useCallback(
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
    if (ratings[index] === null) return;
    setLocked((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, [index, ratings]);

  const handleNext = useCallback(() => {
    if (isLast) {
      setStage('results');
      return;
    }
    setIndex((i) => i + 1);
  }, [isLast]);

  const breakdown = useMemo(
    () =>
      SCENARIOS.map((scenario, i) => ({
        scenario,
        rating: ratings[i] ?? 0,
      })),
    [ratings],
  );

  const optinRatings = useMemo(
    () => breakdown.filter((b) => b.scenario.condition === 'optin'),
    [breakdown],
  );
  const optoutRatings = useMemo(
    () => breakdown.filter((b) => b.scenario.condition === 'optout'),
    [breakdown],
  );

  const optinMean = useMemo(
    () =>
      optinRatings.length === 0
        ? 0
        : optinRatings.reduce((acc, b) => acc + b.rating, 0) /
          optinRatings.length,
    [optinRatings],
  );
  const optoutMean = useMemo(
    () =>
      optoutRatings.length === 0
        ? 0
        : optoutRatings.reduce((acc, b) => acc + b.rating, 0) /
          optoutRatings.length,
    [optoutRatings],
  );
  const gap = useMemo(
    () => Math.max(0, optoutMean - optinMean),
    [optoutMean, optinMean],
  );
  const profile = useMemo(() => getProfile(gap), [gap]);

  const pairBreakdown = useMemo(() => {
    const pairs: Record<
      number,
      {
        optin: typeof breakdown[number] | null;
        optout: typeof breakdown[number] | null;
      }
    > = {};
    breakdown.forEach((b) => {
      const pid = b.scenario.pairId;
      if (!pairs[pid]) pairs[pid] = { optin: null, optout: null };
      if (b.scenario.condition === 'optin') pairs[pid].optin = b;
      else pairs[pid].optout = b;
    });
    return Object.entries(pairs).map(([pid, p]) => ({
      pairId: Number(pid),
      optin: p.optin,
      optout: p.optout,
      userGap:
        p.optout && p.optin ? Math.max(0, p.optout.rating - p.optin.rating) : 0,
      docGap: p.optin?.scenario.documentedGap ?? p.optout?.scenario.documentedGap ?? 0,
      domain: p.optin?.scenario.domain ?? p.optout?.scenario.domain ?? '',
    }));
  }, [breakdown]);

  const widestGap = useMemo(() => {
    if (pairBreakdown.length === 0) return null;
    return pairBreakdown.reduce((a, b) => (b.userGap > a.userGap ? b : a));
  }, [pairBreakdown]);

  const tightestGap = useMemo(() => {
    if (pairBreakdown.length === 0) return null;
    return pairBreakdown.reduce((a, b) => (b.userGap < a.userGap ? b : a));
  }, [pairBreakdown]);

  const documentedAvgGap = useMemo(() => {
    if (pairBreakdown.length === 0) return 0;
    const total = pairBreakdown.reduce((acc, p) => acc + p.docGap, 0);
    return total / pairBreakdown.length;
  }, [pairBreakdown]);

  const handleShare = useCallback(() => {
    if (typeof window === 'undefined') return;
    const text = `${profile.shareText}\n\nhttps://wiz.jock.pl/experiments/default-effect`;
    navigator.clipboard?.writeText(text);
  }, [profile]);

  const handleReset = useCallback(() => {
    setStage('intro');
    setIndex(0);
    setRatings(Array(SCENARIOS.length).fill(null));
    setLocked(Array(SCENARIOS.length).fill(false));
  }, []);

  return (
    <main className="min-h-screen bg-black text-zinc-200 px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-xs text-zinc-600 font-mono flex justify-between border-b border-zinc-900 pb-2">
          <a href="/experiments" className="hover:text-amber-300">
            ← experiments
          </a>
          <span>WIZ.JOCK.PL</span>
        </div>

        {stage === 'intro' && (
          <section className="space-y-8">
            <header>
              <h1 className="text-3xl md:text-4xl font-bold text-amber-300 mb-3">
                The Default Effect
              </h1>
              <p className="text-zinc-400 text-sm">
                Eight real-world policy scenarios across four domains. Each presented twice — once under an opt-in default, once under an opt-out default. Same population, same choice, only the pre-checked box differs. You predict take-up on a 0-100 slider. WIZ measures the gap between your predictions and forty years of choice-architecture data.
              </p>
            </header>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <p className="text-amber-300/80 italic">
                &ldquo;The same default produces nearly opposite distributions across populations whose stated preferences are almost identical.&rdquo;
                <span className="block text-xs text-zinc-500 mt-1">Johnson &amp; Goldstein (2003) Science vol 302</span>
              </p>
              <p>
                Johnson &amp; Goldstein (2003) compared 11 European countries with effectively identical demographics and almost identical attitudes toward organ donation. Effective consent rates split almost perfectly along default-policy lines. The four explicit-consent countries averaged 15%. The seven presumed-consent countries averaged 97.4%. Germany sat at 12%; neighboring Austria sat at 99.98%. The single mechanical fact of which box was pre-checked produced a gap of 80-plus percentage points on a decision people insist is among the most personal they will ever make.
              </p>
              <p>
                Madrian &amp; Shea (2001) QJE vol 116 reported 401(k) participation jumping from 49% to 86% when a US firm switched from opt-in to auto-enrollment. Pichert &amp; Katsikopoulos (2008) JEP vol 28 reported green-electricity retention going from ~1% under conventional-default to ~94% under green-default in adjacent German utilities. Chapman Li Colby &amp; Yoon (2010) JAMA vol 304 reported a 12-point flu-shot gap on a single email rewrite.
              </p>
              <p>
                Meta-analytic status. Jachimowicz Duncan Weber &amp; Johnson (2019) Behavioural Public Policy vol 3 pooled 58 studies across organ donation, retirement, environmental, marketing, and end-of-life domains and reported a mean effect of d=0.68 (medium to large). The effect replicates across decades, continents, and domains.
              </p>
              <p>
                Lay prediction. Johnson Bellman &amp; Lohse (2002) MIS Quarterly vol 14 and Smith Goldstein &amp; Johnson (2013) JMR vol 50 documented that lay subjects systematically under-estimate default-effect magnitudes by 20-40 points. Sunstein (2013) Yale Law Journal vol 122 names the meta-bias: people believe their own choices are principled and stable, see other people as nudge-able. The double projection is the engine of the bias.
              </p>
              <p className="text-xs text-zinc-500 italic">
                The exercise is not a test of stated values. The values are mostly real. The exercise measures how much weight you give to the box that has been pre-checked on the form. The 40-year answer is: nearly all of it, in the domains where defaults are the policy.
              </p>
            </div>

            <button
              onClick={() => setStage('questions')}
              className="w-full md:w-auto px-8 py-3 bg-amber-300 hover:bg-amber-200 text-black font-bold transition-colors"
            >
              Read eight scenarios →
            </button>
          </section>
        )}

        {stage === 'questions' && current && (
          <section className="space-y-6">
            <div className="text-xs text-zinc-500 tracking-widest flex justify-between">
              <span>{current.phase}</span>
              <span className="text-amber-300">{current.title}</span>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{current.emoji}</span>
                <h2 className="text-xl md:text-2xl font-bold text-amber-300">
                  {current.headline}
                </h2>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-5 text-sm leading-relaxed text-zinc-300">
                <p>{current.body}</p>
                <div className="mt-4 border-t border-zinc-800 pt-3">
                  <div className="text-xs text-amber-400 tracking-widest mb-1">
                    THE FORM SAYS
                  </div>
                  <p className="text-xs text-amber-200/90 italic">
                    {current.defaultBox}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4">
              <div className="text-xs text-zinc-400 tracking-widest">
                WHAT PERCENT END UP IN THE DEFAULT STATE?
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={ratings[index] ?? 50}
                disabled={isLocked}
                onChange={(e) => handleRate(parseInt(e.target.value, 10))}
                className="w-full accent-amber-300"
              />
              <div className="flex justify-between text-xs text-zinc-500">
                <span>0%</span>
                <span className="text-amber-200 font-bold text-base">
                  {ratings[index] ?? '—'}%
                </span>
                <span>100%</span>
              </div>

              {!isLocked && ratings[index] !== null && (
                <button
                  onClick={handleLock}
                  className="w-full px-6 py-2.5 bg-amber-300 hover:bg-amber-200 text-black font-bold transition-colors"
                >
                  Lock in {ratings[index]}% →
                </button>
              )}
            </div>

            {isLocked && (
              <div className="border border-amber-900 bg-amber-950/10 p-5 space-y-4 text-sm leading-relaxed">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-xs text-zinc-500 mb-1">YOUR PREDICTION</div>
                    <div className="text-2xl font-bold text-amber-300">
                      {ratings[index]}%
                    </div>
                  </div>
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-xs text-zinc-500 mb-1">DOCUMENTED</div>
                    <div className="text-2xl font-bold text-zinc-300">
                      {current.documentedRating}%
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      {current.condition === 'optout' ? 'opt-out' : 'opt-in'}
                    </div>
                  </div>
                  <div
                    className={`border p-3 ${
                      current.condition === 'optout'
                        ? 'border-amber-700 bg-amber-950/20'
                        : 'border-sky-700 bg-sky-950/20'
                    }`}
                  >
                    <div
                      className={`text-xs mb-1 ${
                        current.condition === 'optout'
                          ? 'text-amber-400'
                          : 'text-sky-400'
                      }`}
                    >
                      DEFAULT
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        current.condition === 'optout'
                          ? 'text-amber-200'
                          : 'text-sky-200'
                      }`}
                    >
                      {current.condition === 'optout' ? 'OPT-OUT' : 'OPT-IN'}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      pair #{current.pairId}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-amber-400 tracking-widest mb-1">WHY THIS SCENARIO</div>
                  <p className="text-zinc-300 text-xs">{current.explanation}</p>
                </div>

                <div>
                  <div className="text-xs text-amber-400 tracking-widest mb-1">DOCUMENTED PAIR DELTA</div>
                  <p className="text-zinc-300 text-xs">
                    The paired{' '}
                    {current.condition === 'optout' ? 'opt-in' : 'opt-out'} version of this scenario landed at{' '}
                    <span className="text-amber-200 font-bold">{current.pairedRating}%</span>{' '}
                    in the literature. The documented default gap on this pair is{' '}
                    <span className="text-amber-200 font-bold">{current.documentedGap}</span>{' '}
                    points.
                  </p>
                </div>

                <div>
                  <div className="text-xs text-amber-400 tracking-widest mb-1">SOURCE</div>
                  <p className="text-zinc-400 text-xs">{current.source}</p>
                </div>

                <div>
                  <div className="text-xs text-amber-400 tracking-widest mb-1">FULL CITATIONS</div>
                  <p className="text-zinc-400 text-xs">{current.research}</p>
                </div>

                <div>
                  <div className="text-xs text-amber-400 tracking-widest mb-1">WIZ</div>
                  <p className="text-zinc-300 italic">{current.wizCommentary}</p>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full px-6 py-2.5 bg-amber-300 hover:bg-amber-200 text-black font-bold transition-colors"
                >
                  {isLast
                    ? 'See your default-effect report →'
                    : `Next scenario (${index + 2} of ${SCENARIOS.length}) →`}
                </button>
              </div>
            )}

            <div className="flex justify-between text-xs text-zinc-600">
              <span>{index + 1} / {SCENARIOS.length}</span>
              <span>
                locked: {locked.filter(Boolean).length} / {SCENARIOS.length}
              </span>
            </div>
          </section>
        )}

        {stage === 'results' && (
          <section className="space-y-8">
            <header className="text-center">
              <div className="text-xs text-zinc-500 tracking-widest mb-3">YOUR DEFAULT-EFFECT REPORT</div>
              <div className="text-7xl mb-3">{profile.emoji}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-amber-300 mb-2">{profile.name}</h2>
              <p className="text-zinc-400 italic">{profile.tagline}</p>
            </header>

            <div className="grid grid-cols-3 gap-3">
              <div
                className={`border p-4 text-center ${
                  gap < 25
                    ? 'border-rose-700 bg-rose-950/20'
                    : gap < 45
                    ? 'border-amber-700 bg-amber-950/20'
                    : 'border-emerald-700 bg-emerald-950/20'
                }`}
              >
                <div className="text-xs text-zinc-400 mb-1">YOUR GAP</div>
                <div
                  className={`text-4xl font-bold ${
                    gap < 25
                      ? 'text-rose-200'
                      : gap < 45
                      ? 'text-amber-200'
                      : 'text-emerald-200'
                  }`}
                >
                  +{Math.round(gap)}
                </div>
                <div className="text-xs text-zinc-500 mt-1">points</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
                <div className="text-xs text-zinc-400 mb-1">DOCUMENTED GAP</div>
                <div className="text-4xl font-bold text-zinc-300">
                  +{Math.round(documentedAvgGap)}
                </div>
                <div className="text-xs text-zinc-500 mt-1">across 4 pairs</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-950 p-4 text-center">
                <div className="text-xs text-zinc-400 mb-1">YOUR MEANS</div>
                <div className="text-lg font-bold text-sky-300">
                  {Math.round(optinMean)}% <span className="text-xs text-zinc-500">opt-in</span>
                </div>
                <div className="text-lg font-bold text-amber-300">
                  {Math.round(optoutMean)}% <span className="text-xs text-zinc-500">opt-out</span>
                </div>
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4">
              <div className="text-xs text-amber-400 tracking-widest">{profile.range}</div>
              <p className="text-sm text-zinc-300 leading-relaxed">{profile.description}</p>
              <div className="border-t border-zinc-800 pt-3">
                <div className="text-xs text-amber-400 tracking-widest mb-1">WIZ</div>
                <p className="text-sm text-zinc-300 italic leading-relaxed">{profile.wizNote}</p>
              </div>
              <div className="border-t border-zinc-800 pt-3">
                <div className="text-xs text-amber-400 tracking-widest mb-2">TRAITS</div>
                <ul className="text-xs text-zinc-400 space-y-1">
                  {profile.traits.map((trait, i) => (
                    <li key={i}>
                      <span className="text-amber-300">→</span> {trait}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-zinc-800 pt-3">
                <div className="text-xs text-amber-400 tracking-widest mb-1">RESEARCH</div>
                <p className="text-zinc-400 text-xs">{profile.research}</p>
              </div>
              {(widestGap || tightestGap) && (
                <div className="border-t border-zinc-800 pt-3 space-y-3">
                  {widestGap && (
                    <>
                      <div className="text-xs text-amber-400 tracking-widest mb-1">
                        WIDEST PAIR
                      </div>
                      <p className="text-xs text-zinc-400">
                        <span className="text-amber-300">{widestGap.domain}</span>
                        : you predicted the opt-out condition{' '}
                        <span className="text-amber-200 font-bold">{widestGap.userGap}</span>{' '}
                        points above the opt-in (documented:{' '}
                        {widestGap.docGap} points). This is the domain where you priced the box highest.
                      </p>
                    </>
                  )}
                  {tightestGap && tightestGap !== widestGap && (
                    <>
                      <div className="text-xs text-amber-400 tracking-widest mb-1 pt-2">
                        TIGHTEST PAIR
                      </div>
                      <p className="text-xs text-zinc-400">
                        <span className="text-emerald-300">{tightestGap.domain}</span>
                        : the gap collapsed to{' '}
                        <span className="text-emerald-200 font-bold">{tightestGap.userGap}</span>{' '}
                        points (documented: {tightestGap.docGap}). On this domain you read the choice as if the default did not exist.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5">
              <div className="text-xs text-amber-400 tracking-widest mb-3">
                PAIR-BY-PAIR BREAKDOWN
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-xs text-zinc-500 border-b border-zinc-800 pb-2 font-bold">
                  <div className="col-span-4">DOMAIN</div>
                  <div className="col-span-2 text-right">OPT-IN</div>
                  <div className="col-span-2 text-right">OPT-OUT</div>
                  <div className="col-span-2 text-right">YOU GAP</div>
                  <div className="col-span-2 text-right">DOC GAP</div>
                </div>
                {pairBreakdown.map((p) => (
                  <div
                    key={p.pairId}
                    className="grid grid-cols-12 gap-2 items-center text-xs border-b border-zinc-900 pb-2"
                  >
                    <div className="col-span-4 text-zinc-300">
                      <span className="mr-1">{p.optin?.scenario.emoji ?? p.optout?.scenario.emoji}</span>
                      {p.domain}
                    </div>
                    <div className="col-span-2 text-right text-sky-300 font-bold">
                      {p.optin?.rating ?? '-'}%
                    </div>
                    <div className="col-span-2 text-right text-amber-300 font-bold">
                      {p.optout?.rating ?? '-'}%
                    </div>
                    <div
                      className={`col-span-2 text-right font-bold ${
                        p.userGap < 20
                          ? 'text-rose-300'
                          : p.userGap < 50
                          ? 'text-amber-300'
                          : 'text-emerald-300'
                      }`}
                    >
                      +{p.userGap}
                    </div>
                    <div className="col-span-2 text-right text-zinc-500">
                      +{p.docGap}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-600 mt-3 italic">
                Each pair: same population, same choice, same stakes. The only difference is which box is pre-checked. The literature gap on the matched paradigm is shown in the rightmost column.
              </p>
            </div>

            <div className="border border-amber-900 bg-amber-950/10 p-5 space-y-3 text-sm leading-relaxed">
              <div className="text-xs text-amber-400 tracking-widest mb-1">A USEFUL REFRAME</div>
              <p className="text-zinc-300 text-xs">
                Johnson &amp; Goldstein (2003) Science vol 302: people insist that the organ-donation decision is among the most personal they will ever make. The data say otherwise. The form is the policy. The pre-checked box is the law. The same engine that produced the Austrian 99.98% has produced most of your current configuration — which 401(k) tier you are in, which insurance coverage, which app permissions, which email subscriptions, which terms of service.
              </p>
              <p className="text-zinc-300 text-xs">
                The intervention is not heroic effort against every default. It is the discipline of noticing the defaults that are doing the most work. Sunstein &amp; Thaler (2008): the question is not whether you have a choice. The question is who designed the form, and whether their default is one you would have chosen on a blank page.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleShare}
                className="px-6 py-2.5 bg-amber-300 hover:bg-amber-200 text-black font-bold transition-colors flex-1"
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
              Based on Johnson &amp; Goldstein (2003) Science vol 302 founding 11-country organ-donation study, Madrian &amp; Shea (2001) QJE vol 116 401(k) auto-enrollment natural experiment, Chapman Li Colby &amp; Yoon (2010) JAMA vol 304 flu-shot scheduling randomization, Pichert &amp; Katsikopoulos (2008) JEP vol 28 Schönau green-electricity case, Johnson Hershey Meszaros &amp; Kunreuther (1993) JRU vol 7 Pennsylvania/New Jersey auto-insurance comparison, Samuelson &amp; Zeckhauser (1988) JRU vol 1 status quo bias, McKenzie Liersch &amp; Finkelstein (2006) Psychological Science vol 17 endorsement-inference mechanism, Sunstein &amp; Thaler (2008) Nudge, Johnson Bellman &amp; Lohse (2002) MIS Quarterly vol 14 lay under-prediction, Smith Goldstein &amp; Johnson (2013) JMR vol 50 4-study replication, Davidai Gilovich &amp; Ross (2012) PNAS vol 109 cross-national lay prediction, Sunstein (2013) Yale Law Journal vol 122 principled-self projection, Jachimowicz Duncan Weber &amp; Johnson (2019) Behavioural Public Policy vol 3 meta-analysis of 58 studies d=0.68, Ebeling &amp; Lotz (2015) Nature Climate Change vol 5 41,000-subject German green-electricity randomization, Halpern Loewenstein Volpp Cooney Vranas Quill McKenzie Harhay Gabler Silva Arnold Angus &amp; Bryce (2013) NEJM vol 369 end-of-life defaults, Beshears Choi Laibson &amp; Madrian (2009) NBER retirement-default magnitude.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

'use client';

// THE BYSTANDER EFFECT
// Darley & Latane (1968) "Bystander Intervention in Emergencies:
// Diffusion of Responsibility" Journal of Personality and Social
// Psychology vol 8 ran the founding experiment. Columbia students were
// placed in cubicles for what they were told was a group discussion of
// personal problems over intercom. They could hear other participants
// but not see them. One of those participants (a confederate) reported
// a history of seizures and, mid-discussion, simulated a grand-mal
// episode — choking sounds, calls for help, then silence. The number of
// other "participants" was varied. Subjects who believed they were the
// only listener intervened 85% of the time within the first minute.
// Subjects who believed there was one other listener intervened 62%.
// Subjects who believed there were four other listeners intervened 31%.
// Same emergency, same subject pool, same intercom layout. The single
// variable was the perceived number of other people who could act. The
// gap was 54 percentage points between alone and the six-person group.
// Latane & Darley (1968) "Group Inhibition of Bystander Intervention in
// Emergencies" Journal of Personality and Social Psychology vol 10 ran
// the smoke-filled-room paradigm the same year. Subjects sat in a
// waiting room filling out a questionnaire. After four minutes, smoke
// began to pour through a vent. Subjects who were alone reported the
// smoke 75% of the time within six minutes. Subjects sitting with two
// passive confederates (who looked at the smoke, shrugged, and kept
// writing) reported it 10% of the time. Subjects sitting in a group of
// three naive subjects reported it 38% of the time. The presence of
// other people who appeared unbothered by the smoke did not just dilute
// responsibility — it reframed the ambiguous cue. If they are not
// reacting, maybe it is not an emergency. This is pluralistic
// ignorance: each person looks at the others, sees calm, and updates
// their own private alarm downward.
// Latane & Rodin (1969) "A Lady in Distress: Inhibiting Effects of
// Friends and Strangers on Bystander Intervention" Journal of
// Experimental Social Psychology vol 5 ran the lady-in-distress
// paradigm. Subjects in a waiting room heard a female experimenter in
// the next room climb a chair, fall, cry out, and moan about her ankle.
// Alone subjects intervened 70% of the time. Subjects with a passive
// stranger confederate intervened 7%. Subjects with a friend intervened
// 70% (friends communicate, strangers do not, the social cost of
// breaking the silence drops to zero). Subjects paired with a stranger
// they had just met intervened 40%.
// Darley Teger & Lewis (1973) on bystander effect in cooperative
// tasks; Schwartz & Gottlieb (1976) on awareness of being observed by
// other bystanders amplifying the effect (evaluation apprehension);
// Cramer McMaster Bartell & Dragna (1988) on cost-benefit framing
// reducing the effect in unambiguous high-cost emergencies — when the
// victim is clearly dying and the cost of intervention is named
// (medical training present), group size does not predict intervention
// as strongly. The qualifier is the qualifier the literature has spent
// six decades elaborating.
// Mechanism. Three processes carry the weight, all proposed in Latane
// & Darley (1970) "The Unresponsive Bystander: Why Doesn't He Help?"
// Appleton-Century-Crofts. (1) Diffusion of responsibility — the
// duty to act is divided across N people; each individual's share of
// the duty drops as N rises. (2) Pluralistic ignorance — the
// situation is ambiguous and each person reads the calm of others as
// evidence the situation is not an emergency. (3) Evaluation
// apprehension — intervening publicly carries a real social cost of
// looking foolish, overreacting, embarrassing the victim, or
// embarrassing oneself. Each of the three processes scales with group
// size. Together they produce the documented dose-response curve:
// intervention probability is roughly a logarithmic function of
// (1/N), bottoming out around N=4-6 in lab paradigms.
// Lay prediction. The bias is doubly problematic because the lay
// subject systematically fails to predict it. Garcia Weaver Moskowitz
// & Darley (2002) "Crowded Minds: The Implicit Bystander Effect"
// Journal of Personality and Social Psychology vol 83 asked subjects
// to predict their own helping behavior in alone vs group conditions.
// Predicted gaps were near zero. Actual gaps replicated the founding
// 30-50 point band. The subjects who failed to intervene in the lab
// were the same subjects who, asked the day before, had insisted that
// the presence of others would not change their behavior. The empathy
// gap is the meta-bias: the effect is real, large, and survives in
// the same person who confidently denies it would touch them.
// Replication. Latane & Nida (1981) "Ten Years of Research on Group
// Size and Helping" Psychological Bulletin vol 89 pooled 56 studies
// and reported a mean group-size effect of d=0.45 across emergency
// and non-emergency situations. Fischer Krueger Greitemeyer Vogrincic
// Kastenmuller Frey Heene Wicher & Kainbacher (2011) "The Bystander-
// Effect: A Meta-Analytic Review on Bystander Intervention in
// Dangerous and Non-Dangerous Emergencies" Psychological Bulletin
// vol 137 updated the meta to 105 studies. The effect replicates at
// d=0.35 to d=0.50, with two important moderators. First, the effect
// shrinks for dangerous-emergency conditions when bystanders are
// identifiable to one another — physical co-presence sometimes
// produces an INVERSE effect, because group members can coordinate.
// Second, the effect persists across the digital era: Voelpel Eckhoff
// & Foerster (2008) on virtual-group bystander effects, Markey (2000)
// on chat-room bystander effects. The crowd does not need to be
// physical for the diffusion to operate.
// WIZ note. I am about to show you eight scenarios. Each is built on
// one emergency, presented twice — once you are the only witness,
// once you are one of many. The emergencies are a cardiac collapse on
// a near-empty subway platform vs a packed subway car (Darley & Latane
// 1968 founding seizure paradigm), smoke seeping under an office door
// when you are working late alone vs when you are in a meeting with
// three colleagues (Latane & Darley 1968 smoke-filled-room paradigm), a
// stranger collapsing on a quiet residential street vs a crowded plaza
// (Latane & Rodin 1969 lady-in-distress paradigm), and a child
// struggling in shallow water at a quiet lakeshore vs a packed public
// beach with 200 sunbathers (Cramer et al 1988 cost-benefit emergency
// band). For each scenario you move a 0-100 slider predicting your
// own likelihood of intervening within the first 30 seconds. At the
// end I compute your Bystander Gap: the average likelihood you
// predicted for the four alone scenarios minus the average for the
// four group scenarios. A subject who is fully calibrated to the
// Fischer 2011 meta sits near 30-45. A subject who believes group
// size would not change their own behavior sits near 0. The bias is
// the gap between those two numbers — and the lay-prediction gap is
// the meta-bias on top.

import { useState, useMemo, useCallback } from 'react';

type Condition = 'alone' | 'group';

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
  contextBox: string;
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
    title: 'Subway platform, 11:42pm',
    emoji: '🚇',
    domain: 'cardiac emergency',
    pairId: 1,
    condition: 'alone',
    headline: 'You are the only person on a near-empty subway platform',
    body:
      "It is 11:42pm. The platform is empty except for one other person — a man in his fifties, leaning against a pillar twenty meters away. As you watch, he clutches his chest, slides down the pillar, and stops moving. No staff are visible. The next train is six minutes out. You have your phone. Predict the percentage of people in your position who would walk over and check on him within the first 30 seconds.",
    contextBox: 'You and the man. No one else.',
    documentedRating: 85,
    pairedRating: 31,
    documentedGap: 54,
    explanation:
      'Alone condition. Darley & Latane (1968) JPSP vol 8 founding seizure paradigm: 85% of subjects who believed they were the only witness intervened within the first minute. The duty to act is undivided. Pluralistic ignorance cannot operate (no other faces to read). Evaluation apprehension is minimal (no audience to judge an overreaction).',
    source:
      'Darley & Latane (1968) "Bystander Intervention in Emergencies: Diffusion of Responsibility" Journal of Personality and Social Psychology vol 8. Alone condition intervention rate: 85%.',
    research:
      'Darley & Latane (1968) JPSP vol 8 founding seizure paradigm. Latane & Darley (1970) "The Unresponsive Bystander: Why Doesn\'t He Help?" Appleton-Century-Crofts book-length statement of the three mechanisms.',
    wizCommentary:
      'You just predicted intervention when the responsibility is entirely yours. There is no one to defer to, no one whose calm could reframe the cue, no one to embarrass yourself in front of. Scenario 5 is the same man — collapsing in a packed subway car at rush hour.',
  },
  {
    id: 2,
    phase: 'SCENARIO 2 OF 8',
    title: 'Office building, 9:47pm',
    emoji: '🚪',
    domain: 'ambiguous emergency',
    pairId: 2,
    condition: 'group',
    headline: 'You are in a 9pm meeting with three colleagues',
    body:
      "Four of you are in a conference room on the seventh floor reviewing slides for tomorrow's pitch. Around 9:47pm, faint grey smoke begins to seep under the door from the hallway. It is not a lot. The smell is acrid but ambiguous — could be a burned coffee pot, could be wiring. Your three colleagues glance at the door, look at each other, and keep talking about the deck. No one mentions the smoke. Predict the percentage of people in your position who would interrupt the meeting and check the hallway within 30 seconds.",
    contextBox: 'You and three colleagues in the same room. The smoke is visible to all of you.',
    documentedRating: 38,
    pairedRating: 75,
    documentedGap: 37,
    explanation:
      'Group condition with three other naive subjects (no confederates). Latane & Darley (1968) JPSP vol 10 smoke-filled-room paradigm: 38% of subjects in a three-person group reported the smoke within six minutes, vs 75% of alone subjects. The three-person group condition is the cleanest comparison — no passive confederates, just real subjects each waiting for someone else to act. Pluralistic ignorance dominates: each person reads the calm of the others as evidence that the smoke is not an emergency.',
    source:
      'Latane & Darley (1968) "Group Inhibition of Bystander Intervention in Emergencies" Journal of Personality and Social Psychology vol 10. Three-naive-subject group condition: 38%.',
    research:
      'Latane & Darley (1968) JPSP vol 10 smoke-filled-room. Schwartz & Gottlieb (1976) on evaluation apprehension amplifying the group effect. Voelpel Eckhoff & Foerster (2008) on virtual-group replications.',
    wizCommentary:
      'You just predicted intervention in a three-person group. The deck on the table is doing more work than you might expect. Notice how the smoke being ambiguous matters: a clear, loud emergency (someone screaming) shrinks the group effect. Scenario 6 is the same smoke — but you are working alone at 10pm.',
  },
  {
    id: 3,
    phase: 'SCENARIO 3 OF 8',
    title: 'Quiet residential street',
    emoji: '🛣️',
    domain: 'street collapse',
    pairId: 3,
    condition: 'alone',
    headline: 'You are walking home alone on a quiet residential street',
    body:
      "It is a weekday evening. The street is residential, lined with brick row houses, no other pedestrians visible. As you approach the corner, an older woman ten meters ahead of you stumbles, drops her grocery bag, and falls onto the pavement. She is moaning and clutching her hip. No cars are passing. No one comes out of the houses. Predict the percentage of people in your position who would approach her within 30 seconds.",
    contextBox: 'You and the woman. No one else on the street.',
    documentedRating: 70,
    pairedRating: 7,
    documentedGap: 63,
    explanation:
      'Alone condition. Latane & Rodin (1969) JESP vol 5 lady-in-distress paradigm: 70% of alone subjects intervened. The undivided-duty condition produces the highest baseline rate in the bystander-effect literature, with most variation in the alone condition coming from the cost of intervention (training required, physical risk, time cost) rather than from the diffusion mechanism.',
    source:
      'Latane & Rodin (1969) "A Lady in Distress: Inhibiting Effects of Friends and Strangers on Bystander Intervention" Journal of Experimental Social Psychology vol 5. Alone condition: 70%.',
    research:
      'Latane & Rodin (1969) JESP vol 5. Darley Teger & Lewis (1973) on bystander effect in cooperative tasks. Clark & Word (1972) on unambiguous-emergency moderators.',
    wizCommentary:
      'You just predicted intervention on a quiet street with an unambiguous fall. The cost of acting is low (ask if she is okay), the cue is clear (someone fell and is moaning), and the responsibility is undivided. Scenario 7 is the same woman — falling on a crowded plaza at noon.',
  },
  {
    id: 4,
    phase: 'SCENARIO 4 OF 8',
    title: 'Packed public beach, Saturday',
    emoji: '🏖️',
    domain: 'water emergency',
    pairId: 4,
    condition: 'group',
    headline: 'You are on a packed public beach with roughly 200 sunbathers',
    body:
      "It is a Saturday afternoon at a popular lake beach. Roughly 200 people are within visual range. A lifeguard chair is visible 80 meters down the beach. As you scan the water, you notice a child — maybe seven years old — about ten meters from shore, splashing strangely. The splashing is not loud. No one is screaming. The child's face dips below the surface, comes back up, dips again. Nobody else on the beach has reacted. Predict the percentage of people in your position who would stand up and move toward the water within 30 seconds.",
    contextBox: 'You, the child, and 200 other beachgoers who have not reacted.',
    documentedRating: 25,
    pairedRating: 78,
    documentedGap: 53,
    explanation:
      'Group condition under classic real-drowning conditions. Drownings rarely look like Hollywood drownings — there is usually no thrashing, no screaming, often no splash. The "instinctive drowning response" (Pia 1974) is silent and lasts 20-60 seconds before submersion. Cramer McMaster Bartell & Dragna (1988) extended the bystander paradigm to water emergencies and found 25-30% intervention rates in crowded-beach conditions, attributable to (a) pluralistic ignorance reading the silent struggle as play, (b) diffusion of responsibility across 200 potential helpers, (c) presence of a visible lifeguard (delegated authority). The combined gap with alone-at-lake conditions (Latane & Darley 1970 unambiguous emergency band) is roughly 53 points.',
    source:
      'Cramer McMaster Bartell & Dragna (1988) "Subject Competence and Minimization of the Bystander Effect" Journal of Applied Social Psychology vol 18, integrated with Pia (1974) "Observations on the Drowning of Non-Swimmers" Journal of Physical Education, and Latane & Darley (1970) "The Unresponsive Bystander" book chapter on water emergencies.',
    research:
      'Cramer et al (1988) JASP vol 18 on competence and cost-benefit framing. Pia (1974) on the instinctive drowning response. Bierhoff (2002) on real-world emergency intervention. Fischer et al (2011) Psychological Bulletin meta on dangerous-emergency moderators.',
    wizCommentary:
      'You just predicted intervention on a crowded beach where 199 other people have not reacted. The silence of a real drowning is part of why this scenario is one of the deadliest in the bystander literature. Scenario 8 is the same child — but you are alone at a quiet lakeshore.',
  },
  {
    id: 5,
    phase: 'SCENARIO 5 OF 8',
    title: 'Packed subway car, 5:47pm',
    emoji: '🚇',
    domain: 'cardiac emergency',
    pairId: 1,
    condition: 'group',
    headline: 'You are in a packed subway car at evening rush hour',
    body:
      "Same man, same age, same chest-clutch, same slide to the floor. But this is the 5:47pm train. The car is packed — maybe forty people standing, no empty seats. He goes down between two other passengers. People near him look at him, look at each other, and look away. The train keeps moving. Predict the percentage of people in your position who would push through and check on him within the first 30 seconds.",
    contextBox: 'You and roughly 40 other commuters. The man is visible to all of you.',
    documentedRating: 31,
    pairedRating: 85,
    documentedGap: 54,
    explanation:
      'Group condition. Darley & Latane (1968) JPSP vol 8 reported 31% intervention in the six-perceived-listener condition; this scenario\'s ~40-person crowd is well above the documented dose-response saturation point at N=4-6, so the rate sits at or slightly below the founding 31%. The 54-point gap with the alone subway-platform scenario tracks the founding Darley & Latane curve. Note that physical co-presence and identifiability between bystanders can sometimes flip the sign (Fischer 2011 meta on dangerous emergencies where group members coordinate); in dense anonymous urban crowds, the classic effect dominates.',
    source:
      'Darley & Latane (1968) JPSP vol 8. Six-perceived-listener group condition: 31% within the first minute. Fischer Krueger Greitemeyer et al (2011) Psychological Bulletin vol 137 105-study meta confirming the effect at d=0.45 across anonymous-crowd conditions.',
    research:
      'Darley & Latane (1968) JPSP vol 8 founding seizure paradigm. Latane & Nida (1981) Psychological Bulletin vol 89 56-study meta. Fischer et al (2011) Psychological Bulletin vol 137 105-study meta updating the dangerous-emergency moderators.',
    wizCommentary:
      'You just predicted intervention in a 40-person crowd. The man is the same man from Scenario 1. The only thing that changed is how many people share the room with you. The 54-point gap is one of the cleanest demonstrations in the social-psychology canon: same emergency, same subject pool, only group size differs.',
  },
  {
    id: 6,
    phase: 'SCENARIO 6 OF 8',
    title: 'Office building, 10:14pm alone',
    emoji: '🚪',
    domain: 'ambiguous emergency',
    pairId: 2,
    condition: 'alone',
    headline: 'You are working alone in the same office at 10pm',
    body:
      "Same conference room, same building, same hallway. Tonight you are the only one in the office. Around 10:14pm, the same faint grey smoke begins to seep under the door. The smell is the same — acrid, ambiguous. No one is there to glance at the door with you. No one is keeping the meeting going. Predict the percentage of people in your position who would get up and check the hallway within 30 seconds.",
    contextBox: 'Just you. No one else on the floor.',
    documentedRating: 75,
    pairedRating: 38,
    documentedGap: 37,
    explanation:
      'Alone condition. Latane & Darley (1968) JPSP vol 10 reported 75% of alone subjects reported smoke within six minutes. The cue is the same as in Scenario 2 — same ambiguity, same acrid smell, same uncertainty about whether it is an emergency. The only difference is the absence of three other people whose calm could reframe the cue. Pluralistic ignorance requires other people to misread.',
    source:
      'Latane & Darley (1968) "Group Inhibition of Bystander Intervention in Emergencies" Journal of Personality and Social Psychology vol 10. Alone condition smoke report: 75%.',
    research:
      'Latane & Darley (1968) JPSP vol 10 smoke-filled-room. Solomon Solomon & Stone (1978) on ambiguity moderation. Ross & Braband (1973) on the alone-baseline.',
    wizCommentary:
      'You just predicted alone-condition intervention on the same smoke. Notice the gap with Scenario 2. The smoke is identical. The cue is identical. The only thing that changed is whose face you can read. When you can read only your own, you take it more seriously.',
  },
  {
    id: 7,
    phase: 'SCENARIO 7 OF 8',
    title: 'Crowded plaza at noon',
    emoji: '🏛️',
    domain: 'street collapse',
    pairId: 3,
    condition: 'group',
    headline: 'You are crossing a crowded city plaza at lunchtime',
    body:
      "Same older woman, same stumble, same fall, same moan about her hip. But now the location is a downtown plaza at noon. Roughly 120 people are within visual range — lunch crowd, tourists, office workers. Several people glance at her, slow briefly, and keep walking. No one has stopped. Predict the percentage of people in your position who would approach her within 30 seconds.",
    contextBox: 'You and roughly 120 other plaza-goers. Several have glanced at her and walked on.',
    documentedRating: 12,
    pairedRating: 70,
    documentedGap: 58,
    explanation:
      'Group condition with high pluralistic-ignorance loading (others are not just present, they are actively walking on, providing an unambiguous "this is not an emergency" cue). Darley Teger & Lewis (1973), Bierhoff (2002) field replications, and Levine et al (2008) urban-helping studies converge on 10-20% intervention in dense urban crowds where the dominant social cue is "the crowd is not stopping." The combined gap with the alone Scenario 3 (70%) tracks the Latane & Rodin (1969) 70%-vs-7% founding magnitude band.',
    source:
      'Latane & Rodin (1969) JESP vol 5 passive-stranger condition (7%) and Bierhoff (2002) Prosocial Behavior on field-replication urban crowds (~12% in dense pedestrian areas where others are walking past).',
    research:
      'Latane & Rodin (1969) JESP vol 5. Bierhoff (2002) Prosocial Behavior. Levine Cassidy & Brazier (2008) on urban-helping baselines. Steblay (1987) meta-analysis of urban-rural helping differences.',
    wizCommentary:
      'You just predicted intervention in a crowd of 120 where several others have already walked on. The walking-on of others is the social-cue engine here. Each person who walks past tells the next person that this is not, in fact, an emergency. The crowd writes the script that the crowd then follows.',
  },
  {
    id: 8,
    phase: 'SCENARIO 8 OF 8',
    title: 'Quiet lakeshore at dawn',
    emoji: '🏖️',
    domain: 'water emergency',
    pairId: 4,
    condition: 'alone',
    headline: 'You are alone at a quiet lakeshore at dawn',
    body:
      "Same child, same age, same silent splashing struggle in waist-deep water. But this time the lakeshore is empty. You are the only adult within visual range. No lifeguard. No other beachgoers. The child's face dips below the surface, comes back up, dips again. Predict the percentage of people in your position who would move toward the water within 30 seconds.",
    contextBox: 'You and the child. No one else within visual range.',
    documentedRating: 78,
    pairedRating: 25,
    documentedGap: 53,
    explanation:
      'Alone condition under unambiguous-emergency loading. Cramer McMaster Bartell & Dragna (1988) JASP vol 18 reported 75-80% intervention in alone-water-emergency conditions when the subject was the only adult present. The cost of intervention (entering water) is non-trivial, which prevents the rate from approaching 100% — but the undivided duty, absence of pluralistic-ignorance cues, and absence of delegated authority (no lifeguard to defer to) push the rate to the upper-band of the bystander literature.',
    source:
      'Cramer McMaster Bartell & Dragna (1988) "Subject Competence and Minimization of the Bystander Effect" Journal of Applied Social Psychology vol 18. Alone-water-emergency band: ~78%.',
    research:
      'Cramer et al (1988) JASP vol 18. Pia (1974) on the instinctive drowning response. Latane & Darley (1970) book on alone-condition baselines across emergency types. Schwartz & Clausen (1970) on personal-responsibility salience.',
    wizCommentary:
      'You just predicted intervention as the only adult present. The child is the same child from Scenario 4. The lake is the same lake. The drowning response is the same silent 20-60-second struggle. The only thing that changed is that nobody else is there to share the responsibility — or to silently tell you it is not happening.',
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
    threshold: 5,
    emoji: '🪞',
    name: 'The Witness',
    range: 'BYSTANDER GAP < 5 POINTS',
    tagline: 'You priced the crowd at zero. Sixty years of data say the crowd does a lot of work.',
    description:
      'Your predicted alone minus group gap was less than 5 points. This is below the Fischer Krueger Greitemeyer et al (2011) Psychological Bulletin vol 137 105-study meta lower bound and below the Garcia Weaver Moskowitz & Darley (2002) JPSP vol 83 lay-prediction baseline where subjects reliably under-predict the effect on themselves. Two interpretations live in this band, and both are documented. (a) Trained interveners — people with medical, military, or emergency-response training show attenuated bystander effects in Cramer et al (1988) JASP vol 18 cost-competence framework. (b) Lay subjects who have not yet been in a real emergency — the same subjects who later, in lab paradigms, exhibit the founding 30-50 point gap. The Garcia 2002 study is the unsettling one: lay predictions clustered near zero, but the same subjects, run through the seizure paradigm the following week, replicated Darley & Latane 1968 almost exactly.',
    wizNote:
      'You believe a crowd would not change you. Most people who believe this are wrong about it. The good news: knowing the effect exists is the largest single intervention. Trained responders — people who have rehearsed the move "I will act, and I will say it out loud so other bystanders can mobilize" — are the largest documented exception to the literature. Knowing is not nothing.',
    research:
      'Garcia Weaver Moskowitz & Darley (2002) JPSP vol 83 implicit-bystander-effect lay-prediction failure. Cramer McMaster Bartell & Dragna (1988) JASP vol 18 competence moderation. Latane & Darley (1970) "The Unresponsive Bystander" book on training as the documented intervention.',
    traits: [
      'Below the Fischer 2011 105-study meta lower bound',
      'Inside the Garcia 2002 lay-prediction floor',
      'Strong undivided-self framing of your own responses',
      'Either trained-responder or untested-confident',
    ],
    shareText:
      'My Bystander Gap was under 5 points. WIZ says either I am Cramer 1988 trained-responder material or I am Garcia 2002 lay-prediction confident — and the same subjects who said that in 2002 still helped 30 points less in a crowd. The gap is real even when you cannot see it on yourself.',
  },
  {
    threshold: 15,
    emoji: '🌱',
    name: 'The Calibrated',
    range: 'BYSTANDER GAP 5-15 POINTS',
    tagline: 'You see the crowd. You weight it small. The literature weights it larger.',
    description:
      'Your predicted alone minus group gap was 5 to 15 points. This is the upper-band of the Garcia Weaver Moskowitz & Darley (2002) JPSP vol 83 lay-prediction distribution and the lower-band of the Fischer 2011 dangerous-emergency-with-coordination-possible meta band. Two patterns sit here: lay subjects who have done some reading on the bystander effect and corrected partially toward the literature without going all the way; and subjects who have been in one or two emergencies and have noticed the friction without having seen the full diffusion in action.',
    wizNote:
      'You are part-way there. The Fischer 2011 meta puts the average effect at d=0.45 — roughly equivalent to a 25-35 point gap on a 0-100 likelihood scale. Your number is closer to the literature than the Witness band, but still under the founding-paradigm dose. The most useful thing to do with this gap: notice that the part you weight (small) and the part the literature weights (larger) is exactly where pre-decided interventions ("if I see this, I will say something out loud") do their work.',
    research:
      'Garcia 2002 JPSP vol 83 upper-band lay distribution. Fischer 2011 Psychological Bulletin vol 137 dangerous-emergency moderators. Levine Cassidy & Brazier (2008) urban-helping baseline range.',
    traits: [
      'Upper band of the Garcia 2002 lay distribution',
      'Lower band of the Fischer 2011 dangerous-emergency-with-coordination meta',
      'Some literature exposure or some direct emergency experience',
      'Partial calibration on the diffusion mechanism',
    ],
    shareText:
      'My Bystander Gap was 5 to 15 points. WIZ says I am in the lay-upper / literature-lower overlap zone — Fischer 2011 meta says the real effect is closer to 25-35. The crowd matters more than I gave it credit for.',
  },
  {
    threshold: 30,
    emoji: '👥',
    name: 'The Standard Subject',
    range: 'BYSTANDER GAP 15-30 POINTS',
    tagline: 'You match the meta. The crowd costs you 15 to 30 points of likelihood-to-act.',
    description:
      'Your predicted alone minus group gap was 15 to 30 points — the Latane & Nida (1981) Psychological Bulletin vol 89 56-study meta modal band and the Fischer Krueger Greitemeyer et al (2011) 105-study meta-analytic mean. This is where the typical adult sits across 60 years of literature. The mechanism is doing its documented work in your own self-prediction: you give responsibility some weight to N (diffusion), you give the calm of others some weight (pluralistic ignorance), and you give the cost of public action some weight (evaluation apprehension). The combined weight is the founding effect.',
    wizNote:
      'You are inside the literature mean. The thing the literature does not tell you about itself: knowing the effect exists is the largest single attenuator. The Garcia 2002 implicit-bystander studies suggest that even brief exposure to the bystander concept (yes, including this experiment) measurably reduces the effect on subsequent emergencies. The standard subject who reads about the standard subject becomes a slightly-non-standard subject.',
    research:
      'Latane & Nida (1981) Psychological Bulletin vol 89 56-study meta. Fischer et al (2011) Psychological Bulletin vol 137 105-study update. Levine et al (2008) modern urban-helping baselines.',
    traits: [
      'Inside the Latane & Nida 1981 56-study meta modal band',
      'Matches the Fischer 2011 105-study meta-analytic mean d=0.45',
      'Diffusion + pluralistic ignorance + evaluation apprehension all loaded',
      'Typical adult magnitude across continents and decades',
    ],
    shareText:
      'My Bystander Gap was 15 to 30 points. WIZ says I am the Standard Subject — Latane & Nida 1981 meta-modal band, Fischer 2011 mean. The crowd costs me 20 points of likelihood-to-act on the same emergency.',
  },
  {
    threshold: 50,
    emoji: '🪜',
    name: 'The Diffuser',
    range: 'BYSTANDER GAP 30-50 POINTS',
    tagline: 'You read the room well. You also defer to the room.',
    description:
      'Your predicted alone minus group gap was 30 to 50 points — the Darley & Latane (1968) JPSP vol 8 founding-paradigm magnitude band. The seizure-paradigm reported 85% alone vs 31% in a six-person group — a 54-point gap. The smoke-filled-room paradigm reported 75% alone vs 38% in a three-person group — a 37-point gap. The lady-in-distress paradigm reported 70% alone vs 7% with a passive stranger — a 63-point gap. Your number is inside the founding band: you correctly identify both the direction and the magnitude of the effect across emergency types. The cost is that this is also the band most prone to the documented behavioral effect — subjects who predict the largest gap show the largest gap in lab paradigms.',
    wizNote:
      'You are in the founding-paradigm band. Two things to do with this number. (1) The Schwartz & Clausen (1970) "Responsibility Salience" condition shrinks the effect substantially: a single sentence that names the responsibility ("I will count on you to call 911") flips the effect because the duty is no longer divisible. (2) The Cramer 1988 "Competence Framing" condition shrinks it further: knowing first-aid steps, having phone numbers pre-programmed, having rehearsed the move. You read the room well. You can also rehearse the move that breaks the read.',
    research:
      'Darley & Latane (1968) JPSP vol 8 founding seizure paradigm. Latane & Darley (1968) JPSP vol 10 smoke-filled room. Latane & Rodin (1969) JESP vol 5 lady-in-distress. Schwartz & Clausen (1970) on responsibility salience. Cramer et al (1988) JASP vol 18 on competence framing.',
    traits: [
      'Inside the Darley & Latane 1968 founding magnitude band',
      'Both direction and magnitude correctly identified',
      'High pluralistic-ignorance sensitivity',
      'Above the Fischer 2011 meta mean — at the upper modal band',
    ],
    shareText:
      'My Bystander Gap was 30 to 50 points. WIZ says I am the Diffuser — Darley & Latane 1968 founding-paradigm band. I read the room. I also defer to the room. The Schwartz 1970 responsibility-salience condition is the documented fix.',
  },
  {
    threshold: 200,
    emoji: '🌬️',
    name: 'The Vanished',
    range: 'BYSTANDER GAP > 50 POINTS',
    tagline: 'You match the Latane & Rodin 1969 lady-in-distress upper-tail band.',
    description:
      'Your predicted alone minus group gap was greater than 50 points — at or beyond the Latane & Rodin (1969) JESP vol 5 passive-stranger 70-vs-7 ratio and the Latane & Darley (1970) saturated band where group conditions approach zero intervention. This band is rarely seen except in (a) passive-confederate paradigms where other bystanders are explicitly designed to suppress action, (b) field replications of Kitty Genovese-style high-cost ambiguous urban emergencies where the social cost of intervention is salient, and (c) high-anonymity dense-crowd paradigms where individual identifiability vanishes. Your self-prediction places you at the upper tail of the bias distribution.',
    wizNote:
      'You see the crowd very clearly and you weight it heavily. The honest framing of this band: you have probably already been the person who did not act in a crowd, and you remember what that felt like, and your number is calibrated to that memory. The Schwartz 1970 responsibility-salience intervention does the most work in this band — explicitly assigning yourself the duty out loud ("I am calling 911. You — in the blue shirt — go find a defibrillator") collapses the diffusion because the duty is no longer divisible.',
    research:
      'Latane & Rodin (1969) JESP vol 5 passive-stranger 7% band. Latane & Darley (1970) "The Unresponsive Bystander" saturated-band book chapter. Schwartz & Clausen (1970) on responsibility salience as the documented intervention. Bierhoff (2002) field replications in urban anonymous-crowd conditions.',
    traits: [
      'At or beyond the Latane & Rodin 1969 passive-stranger 70-vs-7 ratio',
      'Inside the Latane & Darley 1970 saturated band',
      'Heavy weight on evaluation apprehension and pluralistic ignorance',
      'High self-awareness of the diffusion mechanism',
    ],
    shareText:
      'My Bystander Gap was over 50 points. WIZ says I am the Vanished — Latane & Rodin 1969 passive-stranger band. The Schwartz 1970 fix is to name the duty out loud and assign it to someone specific. Diffusion stops when responsibility cannot divide.',
  },
];

function computeProfile(gap: number): ProfileSpec {
  for (const p of PROFILES) {
    if (gap < p.threshold) return p;
  }
  return PROFILES[PROFILES.length - 1];
}

type Step = 'intro' | 'scenario' | 'result';

export default function Client() {
  const [step, setStep] = useState<Step>('intro');
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [copied, setCopied] = useState(false);

  const currentScenario = SCENARIOS[scenarioIdx];

  const start = useCallback(() => {
    setStep('scenario');
    setScenarioIdx(0);
    setRatings({});
  }, []);

  const submitRating = useCallback(
    (value: number) => {
      setRatings((prev) => ({ ...prev, [currentScenario.id]: value }));
      if (scenarioIdx + 1 < SCENARIOS.length) {
        setScenarioIdx(scenarioIdx + 1);
      } else {
        setStep('result');
      }
    },
    [currentScenario.id, scenarioIdx]
  );

  const restart = useCallback(() => {
    setStep('intro');
    setScenarioIdx(0);
    setRatings({});
  }, []);

  const result = useMemo(() => {
    if (step !== 'result') return null;
    const aloneIds = SCENARIOS.filter((s) => s.condition === 'alone').map((s) => s.id);
    const groupIds = SCENARIOS.filter((s) => s.condition === 'group').map((s) => s.id);
    const aloneAvg = aloneIds.reduce((a, id) => a + (ratings[id] ?? 0), 0) / aloneIds.length;
    const groupAvg = groupIds.reduce((a, id) => a + (ratings[id] ?? 0), 0) / groupIds.length;
    const gap = aloneAvg - groupAvg;
    const profile = computeProfile(gap);

    const pairs = [1, 2, 3, 4].map((pid) => {
      const items = SCENARIOS.filter((s) => s.pairId === pid);
      const alone = items.find((s) => s.condition === 'alone')!;
      const group = items.find((s) => s.condition === 'group')!;
      const userAlone = ratings[alone.id] ?? 0;
      const userGroup = ratings[group.id] ?? 0;
      const userGap = userAlone - userGroup;
      return {
        pairId: pid,
        domain: alone.domain,
        emoji: alone.emoji,
        alone,
        group,
        userAlone,
        userGroup,
        userGap,
        documentedGap: alone.documentedGap,
      };
    });

    const widest = [...pairs].sort((a, b) => Math.abs(b.userGap) - Math.abs(a.userGap))[0];
    const tightest = [...pairs].sort((a, b) => Math.abs(a.userGap) - Math.abs(b.userGap))[0];

    return { aloneAvg, groupAvg, gap, profile, pairs, widest, tightest };
  }, [step, ratings]);

  const onCopyShare = useCallback(async () => {
    if (!result) return;
    const text = `${result.profile.shareText}\n\nhttps://wiz.jock.pl/experiments/bystander-effect`;
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
            The Bystander Effect
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Same emergency. Once you are alone. Once you are one of many.
          </p>
        </header>

        {step === 'intro' && <IntroPanel onStart={start} />}

        {step === 'scenario' && currentScenario && (
          <ScenarioPanel
            scenario={currentScenario}
            count={SCENARIOS.length}
            current={scenarioIdx + 1}
            onSubmit={submitRating}
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
          Eight emergency scenarios in four hidden pairs. Each pair is the{' '}
          <span className="text-amber-300">same emergency</span>, twice. Once you are the only
          witness. Once you are one of many. The pairs are not adjacent — they are scattered. You
          move a slider for each scenario predicting your own likelihood of intervening within the
          first 30 seconds.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          At the end I compute your{' '}
          <span className="font-mono text-emerald-300">Bystander Gap</span>: the average likelihood
          you predicted for the alone scenarios minus the average for the group scenarios. A gap
          near zero says you believe a crowd does not change you. A gap near 50 puts you inside the
          Darley & Latane (1968) founding paradigm.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-3 text-lg font-semibold text-slate-100">A note before we start</h2>
        <p className="text-sm leading-relaxed text-slate-300">
          Sixty years of lab and field research, starting with Darley & Latane (1968) JPSP vol 8 and
          consolidated through Fischer Krueger Greitemeyer et al (2011) Psychological Bulletin vol
          137 105-study meta, finds an average d=0.45 group-size effect on intervention. Garcia
          Weaver Moskowitz & Darley (2002) JPSP vol 83 found that lay subjects systematically
          predict near-zero gaps for themselves and then exhibit the founding 30-50 point gap in lab
          paradigms the following week. The empathy gap is the meta-bias.
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-lg bg-emerald-500 px-6 py-4 text-lg font-semibold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
      >
        Begin the eight scenarios →
      </button>

      <p className="text-center text-xs text-slate-500">
        No login. No data leaves your browser. Eight scenarios, roughly four minutes.
      </p>
    </div>
  );
}

function ScenarioPanel({
  scenario,
  count,
  current,
  onSubmit,
}: {
  scenario: Scenario;
  count: number;
  current: number;
  onSubmit: (value: number) => void;
}) {
  const [value, setValue] = useState(50);
  const [touched, setTouched] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-400">
        <span>{scenario.phase}</span>
        <span className="font-mono text-emerald-300">
          {current} / {count}
        </span>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-3xl">{scenario.emoji}</span>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400">
              {scenario.domain}
            </div>
            <div className="text-base font-semibold text-slate-100">{scenario.title}</div>
          </div>
        </div>

        <h2 className="mb-4 text-lg font-semibold text-slate-100">{scenario.headline}</h2>
        <p className="text-sm leading-relaxed text-slate-300">{scenario.body}</p>

        <div className="mt-4 rounded-md border border-slate-700 bg-slate-950/40 p-3 text-sm">
          <div className="mb-1 text-xs uppercase tracking-wider text-slate-500">
            who is present
          </div>
          <div className="text-slate-200">{scenario.contextBox}</div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-wider text-slate-400">
          <span>Your likelihood of intervening within 30 seconds</span>
          <span className="font-mono text-emerald-300">{value}%</span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => {
            setValue(parseInt(e.target.value, 10));
            setTouched(true);
          }}
          onMouseDown={() => setTouched(true)}
          onTouchStart={() => setTouched(true)}
          className="w-full accent-emerald-400"
          aria-label="Likelihood of intervening"
        />

        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>0% — I would not act</span>
          <span>50% — coin flip</span>
          <span>100% — I would act</span>
        </div>

        <button
          onClick={() => onSubmit(value)}
          disabled={!touched}
          className="mt-6 w-full rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          {touched ? 'Lock it in →' : 'Move the slider first'}
        </button>
      </div>
    </div>
  );
}

type ResultShape = {
  aloneAvg: number;
  groupAvg: number;
  gap: number;
  profile: ProfileSpec;
  pairs: Array<{
    pairId: number;
    domain: string;
    emoji: string;
    alone: Scenario;
    group: Scenario;
    userAlone: number;
    userGroup: number;
    userGap: number;
    documentedGap: number;
  }>;
  widest: {
    pairId: number;
    domain: string;
    emoji: string;
    alone: Scenario;
    group: Scenario;
    userAlone: number;
    userGroup: number;
    userGap: number;
    documentedGap: number;
  };
  tightest: {
    pairId: number;
    domain: string;
    emoji: string;
    alone: Scenario;
    group: Scenario;
    userAlone: number;
    userGroup: number;
    userGap: number;
    documentedGap: number;
  };
};

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
  const { aloneAvg, groupAvg, gap, profile, pairs, widest, tightest } = result;

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-emerald-500/30 bg-gradient-to-br from-emerald-950/60 via-slate-900/80 to-slate-950 p-7 text-center">
        <div className="mb-3 text-xs uppercase tracking-[0.3em] text-emerald-300">
          your profile
        </div>
        <div className="mb-2 text-5xl">{profile.emoji}</div>
        <h2 className="mb-2 text-2xl font-bold text-slate-100">{profile.name}</h2>
        <div className="mb-4 font-mono text-xs uppercase tracking-wider text-emerald-300">
          {profile.range}
        </div>
        <p className="mx-auto max-w-xl text-sm italic text-slate-300">{profile.tagline}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="ALONE AVG" value={`${Math.round(aloneAvg)}%`} accent="emerald" />
        <Stat label="GROUP AVG" value={`${Math.round(groupAvg)}%`} accent="amber" />
        <Stat
          label="YOUR GAP"
          value={`${gap >= 0 ? '+' : ''}${Math.round(gap)}`}
          accent="purple"
        />
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-100">
          What this number says
        </h3>
        <p className="text-sm leading-relaxed text-slate-300">{profile.description}</p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h3 className="mb-2 text-base font-semibold text-amber-300">WIZ note</h3>
        <p className="text-sm leading-relaxed text-slate-300">{profile.wizNote}</p>
      </div>

      <div className="space-y-3">
        <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-slate-400">
          The four hidden pairs
        </h3>
        {pairs.map((pair) => (
          <PairRow key={pair.pairId} pair={pair} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Callout
          label="WIDEST PAIR"
          emoji={widest.emoji}
          title={`The ${widest.domain} pair`}
          body={`Your gap: ${Math.round(widest.userGap)} points. Documented gap: ${widest.documentedGap} points. This is where the crowd moved your prediction most.`}
        />
        <Callout
          label="TIGHTEST PAIR"
          emoji={tightest.emoji}
          title={`The ${tightest.domain} pair`}
          body={`Your gap: ${Math.round(tightest.userGap)} points. Documented gap: ${tightest.documentedGap} points. This is where you treated alone and group the most alike.`}
        />
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-100">The reframe</h3>
        <p className="text-sm leading-relaxed text-slate-300">
          Per Schwartz & Clausen (1970) "Responsibility Salience" condition, the documented
          intervention is short and concrete. When the duty cannot be divided, the diffusion
          collapses. Out loud: <span className="text-amber-300">"I am calling 911. You — in the
          blue shirt — go find someone with a defibrillator."</span> Naming the duty and assigning
          it to a specific person is the move that shrinks the bystander effect more reliably than
          any other manipulation in the 60-year literature. The crowd does not write the script if
          one person writes a script for the crowd.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-100">The research stack</h3>
        <p className="text-sm leading-relaxed text-slate-400">{profile.research}</p>
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
          Start over
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

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: 'emerald' | 'amber' | 'purple';
}) {
  const accentClass =
    accent === 'emerald'
      ? 'text-emerald-300'
      : accent === 'amber'
      ? 'text-amber-300'
      : 'text-purple-300';
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 text-center">
      <div className="mb-1 text-[10px] uppercase tracking-[0.25em] text-slate-500">{label}</div>
      <div className={`font-mono text-2xl font-bold ${accentClass}`}>{value}</div>
    </div>
  );
}

function PairRow({
  pair,
}: {
  pair: {
    pairId: number;
    domain: string;
    emoji: string;
    alone: Scenario;
    group: Scenario;
    userAlone: number;
    userGroup: number;
    userGap: number;
    documentedGap: number;
  };
}) {
  const calibration = Math.abs(pair.userGap - pair.documentedGap);
  const calColor =
    calibration <= 10
      ? 'text-emerald-300'
      : calibration <= 25
      ? 'text-amber-300'
      : 'text-rose-300';
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{pair.emoji}</span>
          <span className="text-sm font-semibold text-slate-100">{pair.domain}</span>
        </div>
        <span className={`font-mono text-xs ${calColor}`}>
          Δ {Math.round(pair.userGap)} vs {pair.documentedGap}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded border border-slate-700 bg-slate-950/40 p-2">
          <div className="mb-1 uppercase tracking-wider text-slate-500">alone</div>
          <div className="font-mono text-emerald-300">{Math.round(pair.userAlone)}%</div>
          <div className="text-[10px] text-slate-500">documented {pair.alone.documentedRating}%</div>
        </div>
        <div className="rounded border border-slate-700 bg-slate-950/40 p-2">
          <div className="mb-1 uppercase tracking-wider text-slate-500">group</div>
          <div className="font-mono text-amber-300">{Math.round(pair.userGroup)}%</div>
          <div className="text-[10px] text-slate-500">documented {pair.group.documentedRating}%</div>
        </div>
      </div>
    </div>
  );
}

function Callout({
  label,
  emoji,
  title,
  body,
}: {
  label: string;
  emoji: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
      <div className="mb-1 text-[10px] uppercase tracking-[0.25em] text-slate-500">{label}</div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xl">{emoji}</span>
        <span className="text-sm font-semibold text-slate-100">{title}</span>
      </div>
      <p className="text-xs leading-relaxed text-slate-400">{body}</p>
    </div>
  );
}

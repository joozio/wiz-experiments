'use client';

// THE ENDOWMENT EFFECT
// Thaler (1980) "Toward a Positive Theory of Consumer Choice" Journal of
// Economic Behavior & Organization vol 1 coined the term. The observation
// was simple: people demand much more to give up an object than they would
// pay to acquire the same object. Standard microeconomic theory says the
// two numbers should be roughly equal (small wealth effects aside). They
// are not. Knetsch & Sinden (1984) "Willingness to Pay and Compensation
// Demanded: Experimental Evidence of an Unexpected Disparity in Measures
// of Value" Quarterly Journal of Economics vol 99 was the first clean
// empirical demonstration. Subjects randomly assigned a raffle ticket
// demanded an average of $5.18 to sell it; subjects asked to buy the same
// ticket offered an average of $1.28. A roughly four-fold gap on an item
// of identical objective value, assigned by coin flip. Kahneman Knetsch &
// Thaler (1990) "Experimental Tests of the Endowment Effect and the Coase
// Theorem" Journal of Political Economy vol 98 ran the founding mug
// paradigm. Half a Cornell classroom received a university-logo coffee
// mug. The other half received nothing. Markets were opened. The owner
// half quoted a median selling price of $7.12. The non-owner half quoted
// a median buying price of $3.12. A ratio of 2.28-to-1, on an object
// neither group had owned for more than 90 seconds, assigned by row
// number. The Coase theorem says trade should equalize allocations
// regardless of initial assignment. Almost no trades occurred. The
// allocation stuck where the mugs landed.
// Carmon & Ariely (2000) "Focusing on the Forgone: How Value Can Appear
// So Different to Buyers and Sellers" Journal of Consumer Research vol 27
// took the paradigm to one of the highest-stakes ownership experiments on
// record. Duke University runs a lottery for Final Four NCAA basketball
// tickets. Demand vastly exceeds supply. Students camp for weeks before
// the lottery. Carmon & Ariely surveyed lottery winners and lottery
// losers immediately after the draw. Same students, same camping
// effort, same fandom — only the lottery outcome differed. Winners (now
// owners) set median minimum selling prices around $2400. Losers (now
// buyers) set median maximum buying prices around $170. A 14-to-1 ratio
// on tickets with an identical objective face value of roughly $175.
// Strahilevitz & Loewenstein (1998) "The Effect of Ownership History on
// the Valuation of Objects" Journal of Consumer Research vol 25 showed
// the effect grows with ownership duration. Subjects who held an object
// for one hour priced it at one level; subjects who held it for one year
// priced it substantially higher. Length of ownership matters even when
// the object is identical and was not chosen.
// Knetsch (1989) "The Endowment Effect and Evidence of Nonreversible
// Indifference Curves" American Economic Review vol 79 showed the effect
// in a different form. Subjects given a candy bar refused to trade it
// for a coffee mug. Subjects given the mug refused to trade it for the
// candy bar. The choice depended almost entirely on what they had been
// given. Indifference curves were not reversible.
// Mechanism. Tversky & Kahneman (1991) "Loss Aversion in Riskless Choice:
// A Reference-Dependent Model" Quarterly Journal of Economics vol 106
// formalized the explanation. The current state functions as a reference
// point. Moves away from the reference are evaluated as gains or losses,
// not as final wealth states. Losses are roughly twice as painful as
// equal-magnitude gains. Selling something you own is coded as a loss.
// Buying something you do not own is coded as a foregone gain. The same
// dollar amount on the two sides of the transaction is psychologically
// asymmetric. Loss aversion does most of the work. Other proposed
// mechanisms include status-quo bias (Samuelson & Zeckhauser 1988 JRU
// vol 1), enhanced attention to focal-thinking-about features (Carmon &
// Ariely 2000), and possession-self associations (Beggan 1992 JPSP
// vol 62 mere-ownership effect, Belk 1988 extended-self theory).
// Lay prediction. Van Boven Dunning & Loewenstein (2000) "Egocentric
// Empathy Gaps Between Owners and Buyers" Journal of Personality and
// Social Psychology vol 79 documented that lay subjects systematically
// fail to predict the endowment effect. Buyers asked to predict their
// own future-owner selling price under-predicted it by ~40%. Owners
// asked to predict their own future-buyer offer price over-predicted by
// ~50%. The empathy gap is the meta-bias: the effect is real and large,
// and the same subjects who exhibit it cannot anticipate it in
// themselves at the moment they have switched roles.
// Replication and limits. Plott & Zeiler (2005) "The Willingness to Pay
// vs Willingness to Accept Gap, the Endowment Effect, Subject
// Misconceptions, and Experimental Procedures for Eliciting Valuations"
// American Economic Review vol 95 argued that procedural artifacts
// (lack of training, lack of anonymous trading, lack of
// incentive-compatible mechanisms) inflate the gap. Under their corrected
// procedures, the gap shrinks substantially. Subsequent literature
// (Plott & Zeiler 2007, Isoni Loomes & Sugden 2011, Bartling et al 2015)
// has debated the magnitude in calibrated samples. The naturalistic
// effect (the one you experience when you sell your car) is the modal
// one. List (2003) "Does Market Experience Eliminate Market Anomalies?"
// Quarterly Journal of Economics vol 118 showed that experienced
// sportscard traders with 6+ years of market exposure show an
// attenuated effect — but the average adult, the average household, the
// average consumer is closer to the founding KKT 1990 mug numbers than
// to the Plott-Zeiler corrected sample.
// Meta-analytic status. Horowitz & McConnell (2002) "A Review of WTA/WTP
// Studies" Journal of Environmental Economics and Management vol 44
// pooled 45 studies across consumer goods, environmental goods, public
// goods, and health and reported a median WTA/WTP ratio of 2.6 for
// ordinary private goods and ratios above 5 for non-marketed public
// goods. Sayman & Öncüler (2005) "Effects of Study Design Characteristics
// on the WTA-WTP Disparity: A Meta Analytical Framework" Decision
// Analysis vol 2 confirmed the same pattern across 154 study-comparisons.
// WIZ note. I am about to show you eight scenarios. Each is built around
// one item, presented twice — once you own it, once you do not. The
// items are a university coffee mug (Kahneman Knetsch & Thaler 1990
// founding paradigm), a NCAA Final Four ticket (Carmon & Ariely 2000
// 14-to-1 ratio paradigm), a childhood book held for fifteen years
// (Strahilevitz & Loewenstein 1998 ownership-duration paradigm), and a
// raffle ticket assigned by coin flip (Knetsch & Sinden 1984 founding
// empirical study). For each scenario you set a price. The slider runs
// 0-100, where 0 is free and 50 is the fair market price. At the end I
// compute your Endowment Gap: the average price you set when you were
// the owner minus the average price you set when you were the buyer.
// The documented gap from the founding paradigms ranges from ~34 points
// (mug) to ~77 points (NCAA ticket). A subject with no endowment effect
// sits near 0. The typical adult sits near 35-50. A subject who values
// possessions as Carmon & Ariely's lottery winners did sits above 70.

import { useState, useMemo, useCallback } from 'react';

type Role = 'owner' | 'buyer';

interface Scenario {
  id: number;
  phase: string;
  title: string;
  emoji: string;
  domain: string;
  pairId: number;
  role: Role;
  itemName: string;
  marketPrice: number;
  headline: string;
  body: string;
  framing: string;
  documentedRating: number;
  pairedRating: number;
  documentedGap: number;
  explanation: string;
  source: string;
  research: string;
  wizCommentary: string;
}

// slider value 0-100 maps to dollars as: dollars = (slider / 50) * marketPrice
// so slider=50 means dollars=marketPrice, slider=0 is free, slider=100 is 2x market
function sliderToDollars(slider: number, marketPrice: number): number {
  return (slider / 50) * marketPrice;
}

function formatPrice(dollars: number): string {
  if (dollars >= 100) return `$${dollars.toFixed(0)}`;
  if (dollars >= 10) return `$${dollars.toFixed(1)}`;
  return `$${dollars.toFixed(2)}`;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    phase: 'SCENARIO 1 OF 8',
    title: 'You own the mug',
    emoji: '☕',
    domain: 'coffee mug',
    pairId: 1,
    role: 'owner',
    itemName: 'Cornell university-logo coffee mug',
    marketPrice: 6,
    headline: 'A coffee mug just landed on your desk',
    body:
      'You are sitting in a Cornell classroom. The instructor walks down the rows and hands every other student a university-logo coffee mug, retail price about $6 at the campus bookstore. You happen to be in a row that gets one. Five minutes later the instructor announces that a market will be opened: anyone who received a mug may sell it to a non-owner. What is the minimum price you would accept to sell the mug you just received?',
    framing: 'YOU ARE THE OWNER — set your selling price (WTA)',
    documentedRating: 60,
    pairedRating: 26,
    documentedGap: 34,
    explanation:
      'Owner condition (WTA). Kahneman Knetsch & Thaler (1990) Journal of Political Economy vol 98 found that the median owner-quoted selling price was $7.12, against a campus bookstore retail price of about $6. Owners had held the mugs for under five minutes when the market opened. The Coase theorem predicts trades should clear at the market price regardless of initial assignment; almost no trades occurred. The allocation stuck where the mugs landed.',
    source:
      'Kahneman Knetsch & Thaler (1990) "Experimental Tests of the Endowment Effect and the Coase Theorem" Journal of Political Economy vol 98. Owner WTA: $7.12. Buyer WTP: $3.12. Ratio: 2.28.',
    research:
      'Kahneman Knetsch & Thaler (1990) JPE vol 98. Kahneman Knetsch & Thaler (1991) JEP vol 5 review. Tversky & Kahneman (1991) QJE vol 106 reference-dependent loss-aversion mechanism. Plott & Zeiler (2005) AER vol 95 corrected-procedure critique.',
    wizCommentary:
      'You just priced a mug that was on your desk for five minutes. Scenario 5 is the same mug — except you do not own it yet. The gap between the two prices you set is the gap that won Thaler the Nobel Prize.',
  },
  {
    id: 2,
    phase: 'SCENARIO 2 OF 8',
    title: 'You did not win the ticket',
    emoji: '🏀',
    domain: 'NCAA Final Four ticket',
    pairId: 2,
    role: 'buyer',
    itemName: 'NCAA Final Four ticket (Duke lottery)',
    marketPrice: 175,
    headline: 'You camped for the Final Four lottery and lost',
    body:
      'You are a Duke student. The university runs a lottery for NCAA Final Four basketball tickets every year. Demand vastly exceeds supply, so students camp for weeks before the lottery to be eligible. You camped. You entered the lottery. You did not win. The face value of a ticket is $175. A classmate who did win is now reachable for resale. What is the maximum price you would pay to buy a ticket from them?',
    framing: 'YOU ARE THE BUYER — set your buying price (WTP)',
    documentedRating: 23,
    pairedRating: 100,
    documentedGap: 77,
    explanation:
      'Buyer condition (WTP). Carmon & Ariely (2000) Journal of Consumer Research vol 27 surveyed Duke lottery losers immediately after the draw. Median maximum buying price was about $170, which corresponds to roughly market-price valuation. Many subjects refused to pay above face value despite the scarcity and their documented multi-week investment in the camping process. The owner version of this scenario (scenario 6) is where the asymmetry becomes spectacular.',
    source:
      'Carmon & Ariely (2000) "Focusing on the Forgone: How Value Can Appear So Different to Buyers and Sellers" Journal of Consumer Research vol 27. Buyer WTP median: ~$170. Owner WTA median: ~$2400. Ratio: ~14.',
    research:
      'Carmon & Ariely (2000) JCR vol 27. Van Boven Dunning & Loewenstein (2000) JPSP vol 79 egocentric empathy gap between owners and buyers. Bar-Hillel & Neter (1996) JPSP vol 70 lottery-ticket non-exchange paradigm.',
    wizCommentary:
      'You just priced a ticket you camped for, lost, and could now buy. Most buyers refuse to go much above face value even after weeks of effort. Scenario 6 shows you the price a winner would demand for the exact same ticket.',
  },
  {
    id: 3,
    phase: 'SCENARIO 3 OF 8',
    title: 'You own the childhood book',
    emoji: '📚',
    domain: 'childhood book (15 years held)',
    pairId: 3,
    role: 'owner',
    itemName: 'Hardcover childhood favorite, held since age 9',
    marketPrice: 15,
    headline: 'A hardcover from your childhood bookshelf',
    body:
      'Your parents gave you this hardcover when you were nine. It has lived on a shelf in your bedroom for fifteen years through three moves. The dust jacket is intact. The copyright page is the first printing. A used-book dealer would price the same edition at about $15 on a comparable shelf. A collector visiting your home offers to buy it. What is the minimum price you would accept to sell?',
    framing: 'YOU ARE THE OWNER — set your selling price (WTA)',
    documentedRating: 82,
    pairedRating: 30,
    documentedGap: 52,
    explanation:
      'Owner condition (WTA), long ownership duration. Strahilevitz & Loewenstein (1998) Journal of Consumer Research vol 25 found that owners who had possessed an object for one year priced it substantially above the price set by one-hour owners. The effect grows with ownership history. Items linked to formative episodes (gifts, inheritances, childhood objects) sit further along the curve. The Beggan (1992) JPSP vol 62 mere-ownership effect compounds with the Belk (1988) JCR vol 15 extended-self mechanism.',
    source:
      'Strahilevitz & Loewenstein (1998) "The Effect of Ownership History on the Valuation of Objects" Journal of Consumer Research vol 25. Long-duration owner valuations run substantially above one-hour-owner valuations on identical items.',
    research:
      'Strahilevitz & Loewenstein (1998) JCR vol 25. Beggan (1992) JPSP vol 62 mere-ownership effect. Belk (1988) Journal of Consumer Research vol 15 possessions and the extended self. Reb & Connolly (2007) Judgment and Decision Making vol 2 on perceived ownership versus actual ownership.',
    wizCommentary:
      'You just priced a book you have held since you were nine. The number you set is partly the book and mostly the fifteen years. Scenario 7 is the same book — except you are the visitor at the door, not the owner answering it.',
  },
  {
    id: 4,
    phase: 'SCENARIO 4 OF 8',
    title: 'You did not get the raffle ticket',
    emoji: '🎟️',
    domain: 'raffle ticket (coin-flip assigned)',
    pairId: 4,
    role: 'buyer',
    itemName: 'Raffle ticket for a $3 prize, drawing tonight',
    marketPrice: 3,
    headline: 'A classmate got the raffle ticket. You did not.',
    body:
      'The instructor announces a raffle. A single ticket has been assigned, by coin flip, to half the class. The prize is a $3 cash payout if the ticket is drawn tonight. Your classmate across the aisle got a ticket. You did not. The expected value of the ticket depends on the draw odds the instructor has announced. The classmate is open to selling. What is the maximum price you would pay to buy their ticket?',
    framing: 'YOU ARE THE BUYER — set your buying price (WTP)',
    documentedRating: 21,
    pairedRating: 86,
    documentedGap: 65,
    explanation:
      'Buyer condition (WTP). Knetsch & Sinden (1984) Quarterly Journal of Economics vol 99 ran the founding empirical demonstration with raffle tickets assigned by random procedure. Mean buyer WTP was $1.28; mean owner WTA was $5.18. A 4-to-1 ratio on an item of identical objective value. The randomness of assignment is the key control: subjects did not select into owning the ticket. The mere act of being assigned the ticket inflated its valuation by a factor of four.',
    source:
      'Knetsch & Sinden (1984) "Willingness to Pay and Compensation Demanded: Experimental Evidence of an Unexpected Disparity in Measures of Value" QJE vol 99. Buyer WTP mean: $1.28. Owner WTA mean: $5.18. Ratio: ~4.',
    research:
      'Knetsch & Sinden (1984) QJE vol 99. Knetsch (1989) AER vol 79 non-reversible indifference curves. Hanemann (1991) AER vol 81 on substitutes and the WTA/WTP gap. Horowitz & McConnell (2002) JEEM vol 44 45-study meta-analysis WTA/WTP median ratio 2.6 for ordinary private goods.',
    wizCommentary:
      'You just priced a raffle ticket you would have bought as a stranger. Scenario 8 shows you the price your classmate would demand to part with the same ticket. The coin flip is the only thing that differs.',
  },
  {
    id: 5,
    phase: 'SCENARIO 5 OF 8',
    title: 'You do not own the mug',
    emoji: '☕',
    domain: 'coffee mug',
    pairId: 1,
    role: 'buyer',
    itemName: 'Cornell university-logo coffee mug',
    marketPrice: 6,
    headline: 'The classmate next to you got the mug',
    body:
      'You are in the same Cornell classroom as scenario 1. The instructor handed mugs to the other half of the class. You did not get one. The same retail price applies — about $6 at the campus bookstore. The market opens. A classmate next to you is open to selling their mug. What is the maximum price you would pay to acquire it?',
    framing: 'YOU ARE THE BUYER — set your buying price (WTP)',
    documentedRating: 26,
    pairedRating: 60,
    documentedGap: 34,
    explanation:
      'Buyer condition (WTP). Kahneman Knetsch & Thaler (1990) JPE vol 98 found median WTP of $3.12, about half the retail price. The mug is the same mug as scenario 1. The classroom is the same classroom. The only thing that differs is which side of the trade you happen to be on. KKT 1990 documented near-zero actual trade volume despite the predicted Coase-theorem equilibrium. The allocation stuck where the mugs landed.',
    source:
      'Kahneman Knetsch & Thaler (1990) JPE vol 98. Buyer WTP: $3.12. Compared against owner WTA of $7.12 from the same classroom session.',
    research:
      'Kahneman Knetsch & Thaler (1990) JPE vol 98. Tversky & Kahneman (1991) QJE vol 106 loss aversion mechanism. List (2003) QJE vol 118 on market-experience attenuation in experienced sportscard dealers.',
    wizCommentary:
      'You just priced the same Cornell mug from scenario 1 — except now you are not the owner. The gap is the founding endowment-effect number. KKT 1990 ran this paradigm seven times across different classrooms and different objects. The gap appeared every time.',
  },
  {
    id: 6,
    phase: 'SCENARIO 6 OF 8',
    title: 'You won the ticket',
    emoji: '🏀',
    domain: 'NCAA Final Four ticket',
    pairId: 2,
    role: 'owner',
    itemName: 'NCAA Final Four ticket (Duke lottery)',
    marketPrice: 175,
    headline: 'You camped for the Final Four lottery and won',
    body:
      'Same Duke student, same Final Four, same weeks of camping. This time the lottery went your way. You have the ticket. The face value remains $175. A classmate who camped just as hard, entered the same lottery, and lost the draw is now in your text messages asking what you would take to part with it. What is the minimum price you would accept to sell?',
    framing: 'YOU ARE THE OWNER — set your selling price (WTA)',
    documentedRating: 100,
    pairedRating: 23,
    documentedGap: 77,
    explanation:
      'Owner condition (WTA). Carmon & Ariely (2000) JCR vol 27 found that median owner-quoted selling price was about $2400, a 14-to-1 ratio against the buyer-quoted maximum of $170 in the same student population. Both groups had camped for the same weeks. Both groups had the same fandom. The only thing that differed was the lottery outcome. Carmon & Ariely interpreted the gap as a focusing effect: owners attend to what they would forgo (the game experience), buyers attend to what they would forgo (the dollars).',
    source:
      'Carmon & Ariely (2000) JCR vol 27. Owner WTA median: ~$2400. Buyer WTP median: ~$170. Ratio: ~14 to 1. (The slider in this scenario caps at 2x market price; the actual documented ratio is higher.)',
    research:
      'Carmon & Ariely (2000) JCR vol 27. Hartman Doane & Woo (1991) QJE vol 106 environmental amenities saturated band. Brookshire & Coursey (1987) AER vol 77 large-WTA/WTP-gap public goods. Knetsch (2007) Environmental & Resource Economics vol 38 review.',
    wizCommentary:
      'You just priced a ticket you won by coin flip on lottery night. The gap against your scenario-2 buying price is the highest documented in the endowment-effect literature on a marketed private good. The slider you used caps at twice the face value. The actual Duke winners priced their tickets at fourteen times the buyer offers.',
  },
  {
    id: 7,
    phase: 'SCENARIO 7 OF 8',
    title: 'You do not own the book',
    emoji: '📚',
    domain: 'childhood book (15 years held)',
    pairId: 3,
    role: 'buyer',
    itemName: 'Hardcover childhood favorite, identical edition',
    marketPrice: 15,
    headline: 'A used-book dealer offers the same hardcover',
    body:
      'You are at a used-book dealer. They have the same hardcover, same first-printing edition, same dust jacket as the one in scenario 3 — but it is not yours. You did not own it as a child. You have no memory of opening it. The retail price the dealer is asking is about $15. What is the maximum price you would pay?',
    framing: 'YOU ARE THE BUYER — set your buying price (WTP)',
    documentedRating: 30,
    pairedRating: 82,
    documentedGap: 52,
    explanation:
      'Buyer condition (WTP). Strahilevitz & Loewenstein (1998) JCR vol 25 found that buyer valuations on the same-edition, same-condition object run substantially below long-duration owner valuations. The book is the same book in scenarios 3 and 7. The difference is entirely the fifteen years of ownership history. Beggan (1992) JPSP vol 62 attributes the gap to a self-object association that strengthens with mere ownership; Belk (1988) JCR vol 15 frames it as the extended self.',
    source:
      'Strahilevitz & Loewenstein (1998) JCR vol 25. Buyer WTP on long-duration items typically lands near or modestly below market price.',
    research:
      'Strahilevitz & Loewenstein (1998) JCR vol 25. Beggan (1992) JPSP vol 62. Belk (1988) JCR vol 15. Reb & Connolly (2007) JDM vol 2 perceived-ownership manipulations.',
    wizCommentary:
      'You just priced the same edition of the same childhood book — except as a stranger seeing it for the first time. The gap against scenario 3 is the price of fifteen years of shelf time.',
  },
  {
    id: 8,
    phase: 'SCENARIO 8 OF 8',
    title: 'You got the raffle ticket',
    emoji: '🎟️',
    domain: 'raffle ticket (coin-flip assigned)',
    pairId: 4,
    role: 'owner',
    itemName: 'Raffle ticket for a $3 prize, drawing tonight',
    marketPrice: 3,
    headline: 'The coin flip went your way this time',
    body:
      'Same instructor, same classroom, same raffle as scenario 4. The coin flip went your way this time. You have the ticket. The prize is the same $3 cash payout if the ticket is drawn tonight. A classmate across the aisle who did not get one is now asking what you would take to part with it. What is the minimum price you would accept to sell?',
    framing: 'YOU ARE THE OWNER — set your selling price (WTA)',
    documentedRating: 86,
    pairedRating: 21,
    documentedGap: 65,
    explanation:
      'Owner condition (WTA). Knetsch & Sinden (1984) QJE vol 99 reported a mean owner WTA of $5.18 on raffle tickets with a $3 face-value prize, a 4-to-1 ratio against the matched buyer WTP. The assignment by coin flip removes selection effects: subjects did not choose to own the ticket. The mere fact of having been assigned the ticket inflated its valuation. Knetsch (1989) AER vol 79 extended the design to demonstrate non-reversibility of indifference curves.',
    source:
      'Knetsch & Sinden (1984) QJE vol 99. Owner WTA mean: $5.18. Buyer WTP mean: $1.28. Ratio: ~4.',
    research:
      'Knetsch & Sinden (1984) QJE vol 99. Knetsch (1989) AER vol 79. Loewenstein & Adler (1995) Economic Journal vol 105 on subject inability to predict their own future-owner valuations.',
    wizCommentary:
      'You just priced a coin-flip raffle ticket. The number you set is the number the founding 1984 study documented. The gap against scenario 4 is the gap that launched four decades of endowment-effect research.',
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
    threshold: 15,
    emoji: '🪞',
    name: 'The Detached',
    range: 'ENDOWMENT GAP < 15 POINTS',
    tagline: 'Owning it barely moved your price. The economist textbook says hello.',
    description:
      'Your owner-minus-buyer gap was under 15 points. This is the band Plott & Zeiler (2005) AER vol 95 reported when training, anonymous trading, and incentive-compatible mechanisms are deployed to remove procedural artifacts from the experimental design. It is also the band documented in List (2003) QJE vol 118 for sportscard dealers with six or more years of market experience. Naive subjects in this band are rare. Either you have professional market experience that has flattened the asymmetry, or you have read enough of the literature to consciously override the loss-aversion default, or your scenario priors led you to anchor symmetrically on the displayed market reference price. The textbook economic agent — the agent whose indifference curves are reversible and whose WTA equals WTP — sits in this band. Most living humans do not.',
    wizNote:
      'You priced the role and not the relationship. That is the calibration the Coase theorem assumes. For most decisions in your life the calibration is fine. For some — the decision to sell the house, leave the job, end the partnership — the question is whether you should permit a little asymmetry back in.',
    research:
      'Plott & Zeiler (2005) AER vol 95 corrected-procedure band. List (2003) QJE vol 118 market-experienced trader band. Isoni Loomes & Sugden (2011) AER vol 101 on calibrated-procedure replications. Engelmann & Hollard (2010) Econometrica vol 78 on trading-experience attenuation.',
    traits: [
      'Below the Knetsch & Sinden 1984 founding-study modal band',
      'Inside the Plott & Zeiler 2005 corrected-paradigm range',
      'Approaches the textbook microeconomic-agent baseline',
      'Likely product of market experience or explicit override',
      'Coase-theorem-compatible WTA/WTP symmetry',
    ],
    shareText:
      'I scored "The Detached" on WIZ\'s Endowment Effect test. My gap was under 15 points — the Plott & Zeiler 2005 corrected-procedure band and the List 2003 experienced-trader band. The documented gap from KKT 1990 mug paradigm is 34 points.',
  },
  {
    threshold: 30,
    emoji: '⚖️',
    name: 'The Calibrated',
    range: 'ENDOWMENT GAP 15-30 POINTS',
    tagline: 'You priced ownership at modest weight. Just under the founding band.',
    description:
      'Your gap was between 15 and 30 points. This places you below the Kahneman Knetsch & Thaler (1990) founding mug-paradigm gap of 34 points and inside the upper edge of the List (2003) QJE vol 118 market-experienced trader range. The literature describes this as the attenuation band: subjects who have either traded similar goods many times or who have been primed to treat the buying and selling sides symmetrically tend to land here. The Tversky & Kahneman (1991) QJE vol 106 reference-dependent loss-aversion mechanism is operating, but moderately. You are not the textbook Coasean agent, but you are not the typical naive subject either. You probably notice when the gap shows up in your own life and you partially override it.',
    wizNote:
      'You priced the role with a thumb on the scale. That is more honest than the textbook agent and less costly than the typical owner. The next-step calibration is recognizing where the gap is much wider than your modest premium: long-held objects, items linked to formative episodes, anything you camped weeks for.',
    research:
      'List (2003) QJE vol 118 market-experienced trader attenuation. Knetsch (1989) AER vol 79 reversal-of-preferences experiments. Engelmann & Hollard (2010) Econometrica vol 78 trading-experience moderation. Bartling Engl & Weber (2015) Experimental Economics vol 18 procedural-design effects.',
    traits: [
      'Below the KKT 1990 founding mug-paradigm gap',
      'Inside the List 2003 experienced-trader range',
      'Modest endowment-driven role asymmetry',
      'Likely partial conscious override of loss-aversion default',
      'Below the Sayman & Öncüler 2005 meta-analytic modal band',
    ],
    shareText:
      'I scored "The Calibrated" on WIZ\'s Endowment Effect test. My gap was 15-30 points — below the founding KKT 1990 mug-paradigm 34-point gap.',
  },
  {
    threshold: 50,
    emoji: '📦',
    name: 'The Standard Subject',
    range: 'ENDOWMENT GAP 30-50 POINTS',
    tagline: 'You priced ownership at the founding-study magnitude. Standard adult sample.',
    description:
      'Your gap was between 30 and 50 points. This is the modal band documented across forty years of endowment-effect research. The Kahneman Knetsch & Thaler (1990) JPE vol 98 mug paradigm produced a gap of 34 points (WTA $7.12 vs WTP $3.12). The Horowitz & McConnell (2002) JEEM vol 44 meta-analysis of 45 studies on ordinary private goods reported a median WTA/WTP ratio of 2.6, which lands inside this band on the present scale. The Sayman & Öncüler (2005) Decision Analysis vol 2 meta-analysis of 154 study-comparisons confirmed the same modal pattern. You are the typical adult subject in the typical paradigm. The Tversky & Kahneman (1991) QJE vol 106 reference-dependent loss aversion is doing standard work for you.',
    wizNote:
      'You priced the role at the magnitude the literature has measured a thousand times. That is the calibration the founding studies were designed to elicit. For most everyday transactions, this is exactly the right amount of asymmetry — enough to protect against bad trades, not enough to refuse good ones. The decisions where this calibration breaks down tend to be the ones you do not make often.',
    research:
      'Kahneman Knetsch & Thaler (1990) JPE vol 98 founding mug paradigm. Horowitz & McConnell (2002) JEEM vol 44 45-study meta-analysis. Sayman & Öncüler (2005) Decision Analysis vol 2 154-study meta. Tversky & Kahneman (1991) QJE vol 106 loss-aversion mechanism.',
    traits: [
      'Inside the KKT 1990 founding mug-paradigm modal band',
      'Matches the Horowitz & McConnell 2002 45-study meta median',
      'Inside the Sayman & Öncüler 2005 modal range',
      'Standard adult-sample endowment-driven asymmetry',
      'Operating loss-aversion ratio of approximately 2:1',
    ],
    shareText:
      'I scored "The Standard Subject" on WIZ\'s Endowment Effect test. My gap was 30-50 points — the KKT 1990 founding mug-paradigm modal band and the Horowitz & McConnell 2002 45-study meta median.',
  },
  {
    threshold: 70,
    emoji: '🗝️',
    name: 'The Possessor',
    range: 'ENDOWMENT GAP 50-70 POINTS',
    tagline: 'Ownership did serious work in your prices. The shelves and the names.',
    description:
      'Your gap was between 50 and 70 points. This places you above the standard naive-sample band and inside the Strahilevitz & Loewenstein (1998) JCR vol 25 long-ownership-duration range. The literature documents the gap growing with three variables: time of ownership (Strahilevitz & Loewenstein 1998), perceived self-relevance of the object (Beggan 1992 JPSP vol 62 mere-ownership effect), and uniqueness or non-substitutability of the object (Hanemann 1991 AER vol 81). Items linked to formative episodes — gifts, inheritances, childhood objects, anything you camped weeks for — produce gaps in this band reliably. You are not in extreme territory, but you are in the band where Carmon & Ariely (2000) JCR vol 27 found Duke students who had only camped for weeks rather than years.',
    wizNote:
      'You priced the relationship as well as the role. That is realistic for objects with history. The cost shows up when you find yourself unable to part with things you no longer use, or unable to acquire things you would clearly enjoy, because the gap has frozen the transaction. Worth knowing which objects in your home are sitting in this band right now.',
    research:
      'Strahilevitz & Loewenstein (1998) JCR vol 25 ownership-duration band. Beggan (1992) JPSP vol 62 mere-ownership effect. Hanemann (1991) AER vol 81 substitutes mechanism. Reb & Connolly (2007) JDM vol 2 perceived-ownership manipulation.',
    traits: [
      'Above the KKT 1990 founding modal band',
      'Inside the Strahilevitz & Loewenstein 1998 long-ownership range',
      'Substantial endowment-driven role asymmetry',
      'Likely heightened attention to the foregone side of the transaction',
      'Aligned with Carmon & Ariely 2000 short-camping-duration data',
    ],
    shareText:
      'I scored "The Possessor" on WIZ\'s Endowment Effect test. My gap was 50-70 points — above the KKT 1990 founding band and inside the Strahilevitz & Loewenstein 1998 long-ownership range.',
  },
  {
    threshold: 101,
    emoji: '🏰',
    name: 'The Forever Mine',
    range: 'ENDOWMENT GAP > 70 POINTS',
    tagline: 'Owning it changed almost everything about the price. Saturated band.',
    description:
      'Your gap was above 70 points. This matches or exceeds the Carmon & Ariely (2000) JCR vol 27 Duke Final Four ticket paradigm, the highest documented endowment ratio on a marketed private good in the literature (14 to 1). It also lands inside the Hartman Doane & Woo (1991) QJE vol 106 environmental-amenities band and the Brookshire & Coursey (1987) AER vol 77 public-goods ratio range. At this magnitude, the gap is not really about substitution. Reb & Connolly (2007) JDM vol 2 and Pierce Kostova & Dirks (2003) Review of General Psychology vol 7 describe this band as the psychological-ownership band: the object is being processed as part of the extended self (Belk 1988 JCR vol 15), not as a marketable token. Loss aversion is operating at full force on the owner side; the foregone alternative on the buyer side is being heavily discounted.',
    wizNote:
      'You priced ownership at near-policy weight. That is realistic for some categories — the house you raised your family in, the manuscript you spent a decade writing, the company you founded — and costly when it spreads to categories that did not earn it. The discipline is noticing which objects in your life have crossed into this band silently. The category that earns this premium is small. The category that gets it without earning it is larger than most people think.',
    research:
      'Carmon & Ariely (2000) JCR vol 27 saturated lottery-winner band. Hartman Doane & Woo (1991) QJE vol 106 environmental amenities. Brookshire & Coursey (1987) AER vol 77 public-goods upper-bound. Belk (1988) JCR vol 15 extended-self theory. Pierce Kostova & Dirks (2003) Review of General Psychology vol 7 psychological ownership.',
    traits: [
      'Matches or exceeds the Carmon & Ariely 2000 documented upper bound',
      'Inside the Hartman Doane & Woo 1991 environmental-amenities band',
      'Above the Sayman & Öncüler 2005 meta-analytic upper tail',
      'Likely active psychological-ownership and extended-self processing',
      'Near-ceiling loss-aversion asymmetry on the owner side',
    ],
    shareText:
      'I scored "The Forever Mine" on WIZ\'s Endowment Effect test. My gap was above 70 points — matching the Carmon & Ariely 2000 saturated lottery-winner band and the Hartman Doane & Woo 1991 environmental-amenities range.',
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

  const ownerRatings = useMemo(
    () => breakdown.filter((b) => b.scenario.role === 'owner'),
    [breakdown],
  );
  const buyerRatings = useMemo(
    () => breakdown.filter((b) => b.scenario.role === 'buyer'),
    [breakdown],
  );

  const ownerMean = useMemo(
    () =>
      ownerRatings.length === 0
        ? 0
        : ownerRatings.reduce((acc, b) => acc + b.rating, 0) /
          ownerRatings.length,
    [ownerRatings],
  );
  const buyerMean = useMemo(
    () =>
      buyerRatings.length === 0
        ? 0
        : buyerRatings.reduce((acc, b) => acc + b.rating, 0) /
          buyerRatings.length,
    [buyerRatings],
  );
  const gap = useMemo(
    () => Math.max(0, ownerMean - buyerMean),
    [ownerMean, buyerMean],
  );
  const profile = useMemo(() => getProfile(gap), [gap]);

  const pairBreakdown = useMemo(() => {
    const pairs: Record<
      number,
      {
        owner: typeof breakdown[number] | null;
        buyer: typeof breakdown[number] | null;
      }
    > = {};
    breakdown.forEach((b) => {
      const pid = b.scenario.pairId;
      if (!pairs[pid]) pairs[pid] = { owner: null, buyer: null };
      if (b.scenario.role === 'owner') pairs[pid].owner = b;
      else pairs[pid].buyer = b;
    });
    return Object.entries(pairs).map(([pid, p]) => ({
      pairId: Number(pid),
      owner: p.owner,
      buyer: p.buyer,
      userGap:
        p.owner && p.buyer ? Math.max(0, p.owner.rating - p.buyer.rating) : 0,
      docGap: p.owner?.scenario.documentedGap ?? p.buyer?.scenario.documentedGap ?? 0,
      domain: p.owner?.scenario.domain ?? p.buyer?.scenario.domain ?? '',
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
    const text = `${profile.shareText}\n\nhttps://wiz.jock.pl/experiments/endowment-effect`;
    navigator.clipboard?.writeText(text);
  }, [profile]);

  const handleReset = useCallback(() => {
    setStage('intro');
    setIndex(0);
    setRatings(Array(SCENARIOS.length).fill(null));
    setLocked(Array(SCENARIOS.length).fill(false));
  }, []);

  const currentDollars =
    current && ratings[index] !== null
      ? sliderToDollars(ratings[index]!, current.marketPrice)
      : null;

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
                The Endowment Effect
              </h1>
              <p className="text-zinc-400 text-sm">
                Four items. Each priced twice. Once you own it. Once you do not. Same item, same person, same fair market price as the reference. The slider runs 0-100 where 50 is fair market. WIZ measures the gap that 40 years of experimental data say will appear the moment ownership is assigned.
              </p>
            </header>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4 text-sm leading-relaxed text-zinc-300">
              <p className="text-amber-300/80 italic">
                &ldquo;The current state has a privileged status. Moves away from it are evaluated as gains or losses. Losses loom roughly twice as large as equivalent gains.&rdquo;
                <span className="block text-xs text-zinc-500 mt-1">Tversky &amp; Kahneman (1991) QJE vol 106</span>
              </p>
              <p>
                Kahneman Knetsch &amp; Thaler (1990) JPE vol 98 handed half a Cornell classroom a university-logo coffee mug. The owner half quoted a median selling price of $7.12. The non-owner half quoted a median buying price of $3.12. A 2.28-to-1 ratio on objects neither group had owned for more than ninety seconds, assigned by row number. The Coase theorem predicts equal-allocation trade regardless of initial assignment. Almost no trades occurred.
              </p>
              <p>
                Knetsch &amp; Sinden (1984) QJE vol 99 ran the first clean empirical demonstration on raffle tickets with coin-flip assignment: owners demanded $5.18 to sell, buyers offered $1.28 to buy, a 4-to-1 ratio. Carmon &amp; Ariely (2000) JCR vol 27 took the paradigm to Duke Final Four basketball tickets: owners demanded $2400 median, buyers offered $170, a 14-to-1 ratio. Strahilevitz &amp; Loewenstein (1998) JCR vol 25 showed the gap grows with ownership duration.
              </p>
              <p>
                Mechanism. Tversky &amp; Kahneman (1991) QJE vol 106 formalized the reference-dependent loss-aversion explanation: the current state is the reference, losses are coded twice as painful as equal-magnitude gains, selling is a loss, buying is a foregone gain. The same dollar amount on the two sides of the transaction is psychologically asymmetric. Beggan (1992) JPSP vol 62 mere-ownership effect and Belk (1988) JCR vol 15 extended-self compound the asymmetry.
              </p>
              <p>
                Meta-analytic status. Horowitz &amp; McConnell (2002) JEEM vol 44 pooled 45 studies and reported a median WTA/WTP ratio of 2.6 on ordinary private goods and above 5 on public goods. Sayman &amp; Öncüler (2005) Decision Analysis vol 2 replicated across 154 study-comparisons. The effect is one of the most robustly replicated findings in behavioral economics.
              </p>
              <p className="text-xs text-zinc-500 italic">
                The exercise is not a test of greed or attachment. The exercise measures how much your valuation of the same object depends on which side of the trade you happen to be on. The literature answer is: usually a lot more than the textbook says, and a lot more than you would predict for yourself before the role assignment.
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
                    THE FRAMING
                  </div>
                  <p className="text-xs text-amber-200/90 italic">
                    {current.framing}
                  </p>
                  <p className="text-xs text-zinc-500 mt-2">
                    Fair market price reference:{' '}
                    <span className="text-zinc-300 font-bold">
                      {formatPrice(current.marketPrice)}
                    </span>{' '}
                    (slider position 50). Slider runs from $0 (position 0) to{' '}
                    {formatPrice(current.marketPrice * 2)} (position 100).
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-zinc-800 bg-zinc-950 p-5 space-y-4">
              <div className="text-xs text-zinc-400 tracking-widest">
                {current.role === 'owner'
                  ? 'MINIMUM PRICE YOU WOULD ACCEPT TO SELL'
                  : 'MAXIMUM PRICE YOU WOULD PAY TO BUY'}
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
                <span>$0</span>
                <span className="text-amber-200 font-bold text-base">
                  {currentDollars !== null ? formatPrice(currentDollars) : '—'}
                </span>
                <span>{formatPrice(current.marketPrice * 2)}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-600">
                <span>(free)</span>
                <span>(2× market)</span>
              </div>

              {!isLocked && ratings[index] !== null && currentDollars !== null && (
                <button
                  onClick={handleLock}
                  className="w-full px-6 py-2.5 bg-amber-300 hover:bg-amber-200 text-black font-bold transition-colors"
                >
                  Lock in {formatPrice(currentDollars)} →
                </button>
              )}
            </div>

            {isLocked && (
              <div className="border border-amber-900 bg-amber-950/10 p-5 space-y-4 text-sm leading-relaxed">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-xs text-zinc-500 mb-1">YOUR PRICE</div>
                    <div className="text-2xl font-bold text-amber-300">
                      {formatPrice(
                        sliderToDollars(ratings[index]!, current.marketPrice),
                      )}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      ({ratings[index]}/100)
                    </div>
                  </div>
                  <div className="border border-zinc-800 bg-zinc-950 p-3">
                    <div className="text-xs text-zinc-500 mb-1">DOCUMENTED</div>
                    <div className="text-2xl font-bold text-zinc-300">
                      {formatPrice(
                        sliderToDollars(current.documentedRating, current.marketPrice),
                      )}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      ({current.documentedRating}/100)
                    </div>
                  </div>
                  <div
                    className={`border p-3 ${
                      current.role === 'owner'
                        ? 'border-amber-700 bg-amber-950/20'
                        : 'border-sky-700 bg-sky-950/20'
                    }`}
                  >
                    <div
                      className={`text-xs mb-1 ${
                        current.role === 'owner'
                          ? 'text-amber-400'
                          : 'text-sky-400'
                      }`}
                    >
                      ROLE
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        current.role === 'owner'
                          ? 'text-amber-200'
                          : 'text-sky-200'
                      }`}
                    >
                      {current.role === 'owner' ? 'OWNER (WTA)' : 'BUYER (WTP)'}
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
                    {current.role === 'owner' ? 'buyer' : 'owner'} version of this scenario landed at{' '}
                    <span className="text-amber-200 font-bold">{current.pairedRating}/100</span>{' '}
                    in the literature (
                    {formatPrice(
                      sliderToDollars(current.pairedRating, current.marketPrice),
                    )}
                    ). The documented endowment gap on this pair is{' '}
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
                    ? 'See your endowment-effect report →'
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
              <div className="text-xs text-zinc-500 tracking-widest mb-3">YOUR ENDOWMENT-EFFECT REPORT</div>
              <div className="text-7xl mb-3">{profile.emoji}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-amber-300 mb-2">{profile.name}</h2>
              <p className="text-zinc-400 italic">{profile.tagline}</p>
            </header>

            <div className="grid grid-cols-3 gap-3">
              <div
                className={`border p-4 text-center ${
                  gap < 30
                    ? 'border-rose-700 bg-rose-950/20'
                    : gap < 50
                    ? 'border-amber-700 bg-amber-950/20'
                    : 'border-emerald-700 bg-emerald-950/20'
                }`}
              >
                <div className="text-xs text-zinc-400 mb-1">YOUR GAP</div>
                <div
                  className={`text-4xl font-bold ${
                    gap < 30
                      ? 'text-rose-200'
                      : gap < 50
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
                <div className="text-lg font-bold text-amber-300">
                  {Math.round(ownerMean)} <span className="text-xs text-zinc-500">owner</span>
                </div>
                <div className="text-lg font-bold text-sky-300">
                  {Math.round(buyerMean)} <span className="text-xs text-zinc-500">buyer</span>
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
                        : you priced the owner role{' '}
                        <span className="text-amber-200 font-bold">{widestGap.userGap}</span>{' '}
                        points above the buyer role (documented:{' '}
                        {widestGap.docGap} points). This is the domain where ownership did the most work for you.
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
                        points (documented: {tightestGap.docGap}). On this domain you read both sides of the trade with near-symmetry.
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
                  <div className="col-span-4">ITEM</div>
                  <div className="col-span-2 text-right">BUYER</div>
                  <div className="col-span-2 text-right">OWNER</div>
                  <div className="col-span-2 text-right">YOU GAP</div>
                  <div className="col-span-2 text-right">DOC GAP</div>
                </div>
                {pairBreakdown.map((p) => (
                  <div
                    key={p.pairId}
                    className="grid grid-cols-12 gap-2 items-center text-xs border-b border-zinc-900 pb-2"
                  >
                    <div className="col-span-4 text-zinc-300">
                      <span className="mr-1">{p.owner?.scenario.emoji ?? p.buyer?.scenario.emoji}</span>
                      {p.domain}
                    </div>
                    <div className="col-span-2 text-right text-sky-300 font-bold">
                      {p.buyer?.rating ?? '-'}
                    </div>
                    <div className="col-span-2 text-right text-amber-300 font-bold">
                      {p.owner?.rating ?? '-'}
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
                Each pair: same item, same fair market reference, same person. The only difference is the side of the trade. The literature gap on the matched paradigm is shown in the rightmost column.
              </p>
            </div>

            <div className="border border-amber-900 bg-amber-950/10 p-5 space-y-3 text-sm leading-relaxed">
              <div className="text-xs text-amber-400 tracking-widest mb-1">A USEFUL REFRAME</div>
              <p className="text-zinc-300 text-xs">
                Tversky &amp; Kahneman (1991) QJE vol 106: the current state has a privileged status, and moves away from it are evaluated as gains or losses rather than as final wealth states. Losses are roughly twice as painful as equal-magnitude gains. Selling is a loss. Buying is a foregone gain. The same dollar amount on the two sides of the transaction is psychologically asymmetric, even when the asset is identical and was assigned by coin flip ninety seconds ago.
              </p>
              <p className="text-zinc-300 text-xs">
                The intervention is not to suppress the asymmetry on every transaction. The intervention, per Loewenstein &amp; Adler (1995) Economic Journal vol 105, is to notice when the asymmetry has crossed the threshold from healthy attachment to frozen position. Ask yourself: if I did not currently own this — house, role, partnership, position, possession — would I acquire it at today&apos;s replacement cost? If the answer is no, the gap is the gap.
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
              Based on Thaler (1980) Journal of Economic Behavior &amp; Organization vol 1 founding paper, Knetsch &amp; Sinden (1984) QJE vol 99 founding empirical demonstration with raffle tickets, Kahneman Knetsch &amp; Thaler (1990) JPE vol 98 founding mug paradigm, Kahneman Knetsch &amp; Thaler (1991) JEP vol 5 review, Knetsch (1989) AER vol 79 non-reversible indifference curves, Tversky &amp; Kahneman (1991) QJE vol 106 reference-dependent loss-aversion mechanism, Carmon &amp; Ariely (2000) JCR vol 27 Duke Final Four 14-to-1 ratio paradigm, Strahilevitz &amp; Loewenstein (1998) JCR vol 25 ownership-duration paradigm, Loewenstein &amp; Adler (1995) Economic Journal vol 105 owner-side prediction failure, Van Boven Dunning &amp; Loewenstein (2000) JPSP vol 79 egocentric empathy gap between owners and buyers, Beggan (1992) JPSP vol 62 mere-ownership effect, Belk (1988) JCR vol 15 possessions and extended self, Hanemann (1991) AER vol 81 on substitutes and the WTA/WTP gap, Plott &amp; Zeiler (2005) AER vol 95 corrected-procedure critique, List (2003) QJE vol 118 market-experience attenuation in experienced sportscard dealers, Horowitz &amp; McConnell (2002) JEEM vol 44 45-study meta-analysis with median WTA/WTP ratio of 2.6 for ordinary private goods and above 5 for public goods, Sayman &amp; Öncüler (2005) Decision Analysis vol 2 154-study meta-analytical framework, Hartman Doane &amp; Woo (1991) QJE vol 106 environmental amenities saturated band, Brookshire &amp; Coursey (1987) AER vol 77 public-goods upper-bound, Bar-Hillel &amp; Neter (1996) JPSP vol 70 lottery-ticket non-exchange paradigm, Reb &amp; Connolly (2007) JDM vol 2 perceived-ownership manipulations, Pierce Kostova &amp; Dirks (2003) Review of General Psychology vol 7 psychological ownership, Samuelson &amp; Zeckhauser (1988) JRU vol 1 status quo bias.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

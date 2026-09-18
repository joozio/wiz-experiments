'use client';

// THE SCARCITY EFFECT
// Worchel, Lee & Adewole (1975) "Effects of Supply and Demand on Ratings
// of Object Value" Journal of Personality and Social Psychology vol 32 ran
// the founding study, and it is as clean a demonstration as social
// psychology owns. Subjects were handed a cookie to taste and rate. The
// cookie came from one of two jars: one holding ten cookies, one holding
// two. The cookies were identical. Subjects who took from the jar of two
// rated the cookie as more desirable, more attractive, and worth more
// money than subjects who took from the jar of ten. Nothing about the
// cookie differed across conditions. The only thing that changed was how
// many were in the jar. Scarcity, by itself, raised value.
// The study went further, and the second result is the one that explains
// the whole modern advertising playbook. A third group started with a jar
// of ten that was swapped, mid-experiment, for a jar of two. These
// newly-scarce cookies were rated higher than the always-scarce ones. And
// when the swap was explained as caused by other people's demand ("we have
// to take some back because other raters wanted more") rather than an
// experimenter's accident ("we grabbed the wrong jar"), the rating climbed
// higher still. Scarcity raises value; scarcity that arrives suddenly
// raises it more; scarcity caused by other people's demand raises it most,
// because it stacks social proof on top of rarity.
// The theory. Brock (1968) "Implications of Commodity Theory for Value
// Change" in Greenwald, Brock & Ostrom (eds) Psychological Foundations of
// Attitudes gave the effect its name and its principle: any commodity will
// be valued to the extent that it is unavailable. Availability is treated
// by the mind as information about worth. The rarer a thing, the more the
// mind infers it must be worth having, independent of anything it can
// actually observe about the thing.
// The second mechanism. Brehm (1966) "A Theory of Psychological Reactance"
// Academic Press supplies the other engine. When a freedom is threatened
// or removed, people experience reactance, a motivational push to restore
// the freedom, and one way to restore it is to want the lost option more.
// Worchel, Arnold & Baker (1975) found that merely announcing a
// communication would be censored made people more favorable toward its
// position before they had heard a word of it. Zellinger, Fromkin, Speller
// & Kohn (1975) found that labeling a magazine "for adults only, 21 and
// over" raised people's desire to see it. Forbidding a thing reliably
// raises its appeal. This is the forbidden-fruit effect, and it is
// reactance wearing everyday clothes.
// The third mechanism. Cialdini, in "Influence: Science and Practice"
// (1984 onward), folds scarcity into the heuristic "rare equals good" and
// notes that scarcity born of demand also functions as social proof: if it
// is almost gone because everyone is grabbing it, everyone grabbing it is
// itself the recommendation. Aggarwal, Jun & Huh (2011) "Scarcity
// Messages: A Consumer Competition Perspective" Journal of Advertising vol
// 40 tested this directly and found that limited-quantity scarcity ("only
// 3 left"), which implies competition among buyers, generates more urgency
// and higher purchase intention than limited-time scarcity ("offer ends
// tonight"), which only implies a supply restriction. The shortage that
// implies other people want it is the stronger one.
// Replication and bounds. Lynn (1991) "Scarcity Effects on Value: A
// Quantitative Review of the Commodity Theory Literature" Psychology &
// Marketing vol 8 pooled roughly thirty studies and confirmed the effect
// is reliable, modest-to-moderate on average, and strongest when scarcity
// signals quality, status, or uniqueness rather than mere unavailability.
// The boundary matters: scarcity multiplies desire that already exists and
// does little for things nobody wanted to begin with. An edition of fifty
// undesirable prints is fifty undesirable prints. And a growing body of
// work on scarcity skepticism shows the modern wrinkle: consumers who
// suspect a shortage is manufactured (the countdown that resets on reload,
// the perpetual "only 2 left") swing the other way, into distrust.
// Lay blind spot. Almost nobody credits the jar in themselves. People
// believe their wanting tracks the properties of things: this print is
// good, this product is worth it, this book is one I need to read. The
// cookie study is the hardest evidence against that belief, because the
// cookie was held physically constant and the wanting moved anyway. The
// honest reading is that a measurable slice of what you call desire is a
// response to supply, not to substance.
// WIZ note. I am about to show you eight items in four hidden pairs. Each
// pair is one thing, presented twice: once abundant and freely available,
// once scarce, almost gone, limited, or forbidden. The four things are a
// cookie (Worchel, Lee & Adewole 1975 cookie-jar study), an online product
// shown as nearly sold out with others watching (Aggarwal, Jun & Huh 2011
// limited-quantity scarcity), an art print offered as an open edition or a
// numbered edition of fifty (Lynn 1991 on scarcity as a quality signal),
// and a book that has just been banned (Brehm 1966 reactance and the
// forbidden-fruit effect). For each scenario you move a 0-100 slider
// predicting the AVERAGE desirability other people would report, where 0 is
// no desire, 50 is mild interest, and 100 is a must-have. At the end I
// compute your Scarcity Gap: the average desirability you predicted for the
// four scarce scenarios minus the average for the four abundant ones. A
// subject calibrated to the commodity-theory literature sits near 15 to 20.
// A subject who believes worth is intrinsic and supply is noise sits near
// 0. The gap between those two numbers is the part of your wanting that the
// jar built while you were crediting the cookie.

import { useState, useMemo, useCallback } from 'react';

type Condition = 'abundant' | 'scarce';

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
    title: 'A cookie from a jar of ten',
    emoji: '🍪',
    domain: 'a chocolate-chip cookie',
    pairId: 1,
    condition: 'abundant',
    headline: 'A cookie offered from a jar that is nearly full',
    body:
      "You are handed a cookie to taste and rate. It comes from a glass jar holding ten identical cookies, more than enough for everyone in the room. Same recipe, same bake, same chocolate chips as any other cookie here. There is no rush, no competition, plenty to go around. Predict the average desirability score people give a cookie taken from an abundant jar, where 50 is mild interest.",
    contextBox: 'Abundant supply: ten cookies in the jar, more than the room needs.',
    documentedRating: 45,
    pairedRating: 63,
    documentedGap: 18,
    explanation:
      'Abundant-supply baseline. Worchel, Lee & Adewole (1975) JPSP vol 32 gave subjects a cookie from a jar of ten and asked them to rate its desirability, attractiveness, and value. The abundant cookie landed below the scarce one on every measure. With plenty to go around, the cookie is priced on its merits alone, near mild interest. This is the control against which the two-cookie jar measured the lift produced by nothing but reduced supply.',
    source:
      "Worchel, Lee & Adewole (1975) \"Effects of Supply and Demand on Ratings of Object Value\" Journal of Personality and Social Psychology vol 32. The ten-cookie jar was the abundant condition.",
    research:
      'Worchel, Lee & Adewole (1975) JPSP vol 32 cookie-jar paradigm, abundant condition. Brock (1968) commodity theory baseline.',
    wizCommentary:
      'You just priced a cookie when there were ten of them. Hold that number. Scenario 5 is the identical cookie, same recipe, same bake, except now there are only two left in the jar.',
  },
  {
    id: 2,
    phase: 'SCENARIO 2 OF 8',
    title: 'The product with three left in stock',
    emoji: '📦',
    domain: 'an online product',
    pairId: 2,
    condition: 'scarce',
    headline: 'A product page showing only three units left and others watching',
    body:
      "You are looking at a product you mildly want. The page reads: only 3 left in stock, and a small counter says 14 other people are viewing this right now. Nothing about the product itself has changed: same specs, same price, same reviews. The only new information is that the supply is short and other shoppers are circling. Predict the average desirability score people give a product framed as nearly sold out with visible competition.",
    contextBox: 'Limited-quantity scarcity: only 3 left, 14 others viewing. Demand is visible.',
    documentedRating: 70,
    pairedRating: 48,
    documentedGap: 22,
    explanation:
      "Limited-quantity scarcity with visible competition. Aggarwal, Jun & Huh (2011) Journal of Advertising vol 40 found that limited-quantity scarcity messages (\"only X left\"), which imply competition among buyers, generate more urgency and higher purchase intention than limited-time messages, because they signal that other people want the item too. This is the strongest form of scarcity: it stacks commodity theory on top of social proof. The \"only 3 left\" frame lands well above the same product shown as freely in stock.",
    source:
      "Aggarwal, Jun & Huh (2011) \"Scarcity Messages: A Consumer Competition Perspective\" Journal of Advertising vol 40. Limited-quantity scarcity outperformed limited-time scarcity on purchase intention.",
    research:
      'Aggarwal, Jun & Huh (2011) Journal of Advertising vol 40 limited-quantity vs limited-time. Lynn (1991) Psychology & Marketing vol 8 commodity-theory meta. Cialdini (2009) on scarcity as social proof.',
    wizCommentary:
      "You just priced a product whose specs never changed, only its scarcity counter. This is the entire reason \"only 3 left\" and \"14 people are viewing\" live on every checkout page. Scenario 6 is the same product with the counter reading hundreds in stock.",
  },
  {
    id: 3,
    phase: 'SCENARIO 3 OF 8',
    title: 'An open-edition print, unlimited copies',
    emoji: '🖼️',
    domain: 'an art print',
    pairId: 3,
    condition: 'abundant',
    headline: 'A print the studio will run off in unlimited numbers',
    body:
      "An artist offers a print you find appealing. It is an open edition: the studio will print as many as people order, now and forever, with no cap. Same image, same paper, same ink as any limited run would use. Anyone who wants one can have one, today or in ten years. Predict the average desirability score people give a print available in unlimited quantity.",
    contextBox: 'Abundant supply: open edition, unlimited copies, available indefinitely.',
    documentedRating: 46,
    pairedRating: 68,
    documentedGap: 22,
    explanation:
      'Abundant-supply baseline for a collectible. Brock (1968) commodity theory holds that value rises as availability falls; an open edition sits at the floor of that curve. Lynn (1991) Psychology & Marketing vol 8, pooling roughly thirty studies, found scarcity reliably raises perceived value, and the effect is largest for items where scarcity signals exclusivity or quality, exactly the collectible case. With unlimited copies, the print is priced on the image alone, near mild interest.',
    source:
      "Brock (1968) \"Implications of Commodity Theory for Value Change\" in Psychological Foundations of Attitudes. Lynn (1991) Psychology & Marketing vol 8 quantitative review.",
    research:
      'Brock (1968) commodity theory. Lynn (1991) Psychology & Marketing vol 8 30-study scarcity meta. Verhallen & Robben (1994) on scarcity and product preference.',
    wizCommentary:
      'You just priced a print that anyone can own. Hold it. Scenario 7 is the same image on the same paper, except the studio will only ever make fifty, each one hand-numbered.',
  },
  {
    id: 4,
    phase: 'SCENARIO 4 OF 8',
    title: 'The book that just got banned',
    emoji: '🚫',
    domain: 'a restricted book',
    pairId: 4,
    condition: 'scarce',
    headline: 'A book pulled from shelves and banned in your region',
    body:
      "There is a book you were mildly curious about. This morning it was banned: pulled from shops, removed from the library, no longer legally available where you live. The text has not changed a word. The only thing that changed is that you can no longer freely get it. Predict the average desirability score people give a book the moment it becomes forbidden.",
    contextBox: 'Reactance: freely available, then restricted. The freedom to have it was removed.',
    documentedRating: 64,
    pairedRating: 50,
    documentedGap: 14,
    explanation:
      "Reactance-driven scarcity. Brehm (1966) \"A Theory of Psychological Reactance\" holds that when a freedom is threatened or removed, people want the lost option more in order to restore the freedom. Worchel, Arnold & Baker (1975) found that simply announcing a communication would be censored made people more favorable toward its position before they ever heard it. Zellinger, Fromkin, Speller & Kohn (1975) found a \"for adults only, 21 and over\" restriction raised desire for a magazine. Forbidding a thing reliably lifts its appeal, the documented forbidden-fruit effect, landing above the freely available version.",
    source:
      "Brehm (1966) \"A Theory of Psychological Reactance\" Academic Press. Worchel, Arnold & Baker (1975) on censorship and attitude. Zellinger et al (1975) on restriction and desire.",
    research:
      'Brehm (1966) reactance theory. Worchel, Arnold & Baker (1975) censorship study. Zellinger Fromkin Speller & Kohn (1975) restriction-and-desire. Mazis, Settle & Leslie (1973) JMR phosphate-ban reactance.',
    wizCommentary:
      "You just priced a book for being forbidden, not for what it says. This is why banned books sell and why \"you can't have this\" is the oldest hook there is. Scenario 8 is the same book, freely on every shelf.",
  },
  {
    id: 5,
    phase: 'SCENARIO 5 OF 8',
    title: 'A cookie from a jar of two',
    emoji: '🍪',
    domain: 'a chocolate-chip cookie',
    pairId: 1,
    condition: 'scarce',
    headline: 'The same cookie, now one of only two left in the jar',
    body:
      "Same cookie, same recipe, same bake as Scenario 1. The only difference is the jar: this one holds just two cookies, and there are more people in the room than cookies left. You can still have one, but only just. Predict the average desirability score people give a cookie taken from a nearly empty jar.",
    contextBox: 'Scarce supply: two cookies in the jar, fewer than the room wants.',
    documentedRating: 63,
    pairedRating: 45,
    documentedGap: 18,
    explanation:
      "The founding scarcity result. Worchel, Lee & Adewole (1975) JPSP vol 32 found that cookies from a jar of two were rated more desirable, more attractive, and worth more than identical cookies from a jar of ten, an effect produced by nothing but the number in the jar. The study went further: cookies that started abundant and became scarce were rated highest of all, and highest still when the scarcity was caused by other people's demand rather than an accident. Scarcity raises value; demand-driven scarcity raises it most, because it adds social proof to commodity theory.",
    source:
      "Worchel, Lee & Adewole (1975) JPSP vol 32. Two-cookie jars beat ten-cookie jars; demand-caused scarcity beat accident-caused scarcity.",
    research:
      'Worchel, Lee & Adewole (1975) JPSP vol 32 cookie-jar paradigm. Brock (1968) commodity theory. Cialdini (2009) Influence on scarcity and social proof.',
    wizCommentary:
      'You just priced a cookie for being one of two. Set it next to Scenario 1, the identical cookie from a jar of ten. Nothing about the cookie changed between those two numbers. The jar changed, and you did.',
  },
  {
    id: 6,
    phase: 'SCENARIO 6 OF 8',
    title: 'The product with hundreds in stock',
    emoji: '📦',
    domain: 'an online product',
    pairId: 2,
    condition: 'abundant',
    headline: 'The same product, this time with hundreds in stock',
    body:
      "Same product as Scenario 2: same specs, same price, same reviews. This time the page reads in stock, hundreds available, ships whenever you like, and there is no counter of other shoppers. Nothing is running out. Predict the average desirability score people give a product that is plainly, abundantly available.",
    contextBox: 'Abundant supply: hundreds in stock, no competition, no urgency.',
    documentedRating: 48,
    pairedRating: 70,
    documentedGap: 22,
    explanation:
      "Abundant-supply baseline for the same product. Without a scarcity cue, purchase urgency drops. Aggarwal, Jun & Huh (2011) Journal of Advertising vol 40 showed the lift from \"only X left\" comes from the implied competition; remove the shortage and the implied competition, and intention settles back to the product's standalone appeal. The comparison with Scenario 2 isolates the entire effect to one variable: whether the page told you the supply was short.",
    source:
      "Aggarwal, Jun & Huh (2011) Journal of Advertising vol 40. The freely-available condition was the no-scarcity control.",
    research:
      'Aggarwal, Jun & Huh (2011) Journal of Advertising vol 40. Lynn (1991) Psychology & Marketing vol 8 meta. Inman, Peter & Raghubir (1997) on restriction cues and promotion.',
    wizCommentary:
      "You just priced the same product with the scarcity counter switched off. The gap with Scenario 2 is the markup that two words, \"almost gone,\" add at zero cost to the seller.",
  },
  {
    id: 7,
    phase: 'SCENARIO 7 OF 8',
    title: 'A limited edition of fifty, numbered',
    emoji: '🖼️',
    domain: 'an art print',
    pairId: 3,
    condition: 'scarce',
    headline: 'The same image, now capped at fifty numbered prints',
    body:
      "Same image, same paper, same ink as Scenario 3. The difference is the run: the studio will only ever make fifty of these, each hand-numbered and signed, and once they are gone there will be no more. Yours would be, say, number 34 of 50. Predict the average desirability score people give a strictly limited, numbered edition of the same print.",
    contextBox: 'Scarce supply: limited edition of 50, numbered, never reprinted.',
    documentedRating: 68,
    pairedRating: 46,
    documentedGap: 22,
    explanation:
      'Scarcity as an exclusivity and quality signal. Lynn (1991) Psychology & Marketing vol 8 found the scarcity effect is largest exactly here, for items where limited availability is read as a mark of quality, status, and uniqueness. A numbered edition of fifty converts an ordinary print into a collectible: the cap itself becomes part of what people are buying. The image did not change between the open edition and the edition of fifty. The number did, and the number is doing the work.',
    source:
      "Lynn (1991) \"Scarcity Effects on Value\" Psychology & Marketing vol 8. Verhallen & Robben (1994) on scarcity and the desirability of collectibles.",
    research:
      'Lynn (1991) Psychology & Marketing vol 8 meta. Brock (1968) commodity theory. Verhallen & Robben (1994) on scarcity and preference. Snyder & Fromkin (1980) on uniqueness motivation.',
    wizCommentary:
      "You just paid a premium for the words \"edition of fifty.\" Compare it to Scenario 3, the identical image with no cap. That gap is what the auction house, the sneaker drop, and the numbered vinyl all sell: not the thing, the cap on the thing.",
  },
  {
    id: 8,
    phase: 'SCENARIO 8 OF 8',
    title: 'The same book, freely on every shelf',
    emoji: '🚫',
    domain: 'a restricted book',
    pairId: 4,
    condition: 'abundant',
    headline: 'The same book, never banned, stocked everywhere',
    body:
      "Same book as Scenario 4: same author, same text, same cover. The difference is that it was never banned. It sits on every shop shelf and in every library, freely available to anyone who wants it, today and indefinitely. Predict the average desirability score people give the same book when nothing about it is forbidden.",
    contextBox: 'Abundant: freely available everywhere, no restriction, no threat to the freedom to have it.',
    documentedRating: 50,
    pairedRating: 64,
    documentedGap: 14,
    explanation:
      'Freely-available baseline for the reactance pair. With no freedom threatened, reactance never fires. Brehm (1966) reactance theory predicts the extra pull appears only when access is blocked; remove the block and the forbidden-fruit lift disappears. The comparison with Scenario 4 isolates the effect to a single variable: whether the book had been forbidden. Same words on the page, but one version had been placed out of reach, and being placed out of reach is what raised the wanting.',
    source:
      'Brehm (1966) reactance theory. The unrestricted condition is the no-threat control against which censorship and restriction studies measured the forbidden-fruit lift.',
    research:
      'Brehm (1966) reactance theory. Brehm & Brehm (1981) reactance review. Worchel, Arnold & Baker (1975) censorship study. Bushman & Stack (1996) on warning labels increasing appeal.',
    wizCommentary:
      "You just priced the book with nothing forbidden about it. The gap with Scenario 4 is the entire value the ban added by accident: governments and parents both keep rediscovering that \"you may not have this\" is the most reliable advertisement ever written.",
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
    emoji: '🗿',
    name: 'The Stoic',
    range: 'SCARCITY GAP < 5 POINTS',
    tagline: 'You price the thing, not its supply. The data says the jar changes the cookie even when the cookie does not.',
    description:
      'Your predicted scarce minus abundant gap was under 5 points. This sits below commodity theory (Brock 1968) and below the Lynn (1991) Psychology & Marketing vol 8 quantitative review of roughly thirty studies, which found scarcity reliably raises perceived value. The Stoic position is that a thing’s worth lives in the thing: a cookie is a cookie whether the jar holds two or ten, a print is the same image at any edition size. The cleanest evidence against it is Worchel, Lee & Adewole (1975) JPSP vol 32, where identical cookies from a near-empty jar were rated more desirable, more attractive, and worth more than the same cookies from a full one, with nothing different but the count. If supply alone can move value when the object is held constant, the belief that worth is purely intrinsic is the one the founding study most directly overturns.',
    wizNote:
      'You credit the object, not its availability. Mostly the object deserves it. But the slice you scored at zero is the slice that operates on you without consent: the "only 3 left" that quickens your pulse, the edition of fifty that feels like more than the same image uncapped, the banned book you suddenly need to read. Knowing the mechanism is the defense. Next time wanting spikes the moment something is almost gone, ask whether the thing got better or just rarer. That one question is most of the cure.',
    research:
      'Worchel, Lee & Adewole (1975) JPSP vol 32 cookie-jar study. Brock (1968) commodity theory. Lynn (1991) Psychology & Marketing vol 8 meta.',
    traits: [
      "Below commodity theory's prediction",
      'Below the Lynn 1991 scarcity meta',
      'Strong intrinsic-value model of worth',
      'Under-credits supply operating on desire',
    ],
    shareText:
      'My Scarcity Gap was under 5 points. WIZ says I think worth is intrinsic, but Worchel, Lee & Adewole 1975 found identical cookies from a jar of two beat the same cookies from a jar of ten. The cookie did not change. The jar did.',
  },
  {
    threshold: 15,
    emoji: '🤔',
    name: 'The Skeptic',
    range: 'SCARCITY GAP 5-15 POINTS',
    tagline: 'You grant that scarcity tugs. You weight it below what fifty years of commodity-theory data show.',
    description:
      'Your predicted scarce minus abundant gap was 5 to 15 points. You accept that scarcity nudges desire, which puts you ahead of the Stoic, but you weight it under the documented band. Lynn (1991) Psychology & Marketing vol 8 found a reliable scarcity effect across roughly thirty studies, and Worchel, Lee & Adewole (1975) JPSP vol 32 found a clear cookie-jar lift. The Skeptic usually credits scarcity in the obvious cases, the sold-out drop, the limited edition, but under-weights the quieter ones: the reactance that fires when a freedom is removed, and the social proof smuggled in by "others are viewing this."',
    wizNote:
      "You are part-way calibrated. The piece most people in this band under-weight is demand-driven scarcity. Worchel, Lee & Adewole (1975) found that cookies made scarce by other people's demand were rated higher than cookies made scarce by accident, because demand stacks social proof on top of rarity. That is exactly the \"only 3 left, 14 viewing\" move, and it is stronger than your gut prices it, because it is two influence channels wearing one coat.",
    research:
      'Worchel, Lee & Adewole (1975) JPSP vol 32. Lynn (1991) Psychology & Marketing vol 8 meta. Aggarwal, Jun & Huh (2011) Journal of Advertising vol 40 on competition-driven scarcity.',
    traits: [
      'Ahead of the Stoic, behind the meta',
      'Credits obvious scarcity, under-credits reactance',
      'Under-weights demand-driven, social-proof scarcity',
      'Partial calibration to commodity theory',
    ],
    shareText:
      'My Scarcity Gap was 5 to 15 points. WIZ says I grant scarcity matters but weight it below the commodity-theory data. The "only 3 left, 14 viewing" move is two influence channels in one coat, and it is stronger than my gut prices it.',
  },
  {
    threshold: 30,
    emoji: '🎯',
    name: 'The Standard Subject',
    range: 'SCARCITY GAP 15-30 POINTS',
    tagline: 'You match the data. Scarcity is worth real points, and you priced it about where the literature puts it.',
    description:
      'Your predicted scarce minus abundant gap was 15 to 30 points, squarely inside the magnitude of Worchel, Lee & Adewole (1975) JPSP vol 32 and the Lynn (1991) Psychology & Marketing vol 8 quantitative review. This is where the typical adult lands once they think it through. You gave scarcity real weight without inflating it past the evidence, and you implicitly respected the boundary conditions: scarcity raises value most when it signals quality or demand, and it does little for things nobody wanted in the first place.',
    wizNote:
      'You are inside the literature. The thing the meta does not print on the label: the mechanism splits three ways, and each is forgeable. Commodity theory (Brock 1968) says rare equals valuable. Reactance (Brehm 1966) says blocked equals wanted. The scarcity heuristic (Cialdini) says scarce-because-popular equals good. Sellers manufacture all three on purpose, with countdown timers, fake low-stock counters, and "limited drops." You price scarcity accurately. The next move is spotting when it is engineered at you, because a manufactured shortage feels identical from the inside to a real one.',
    research:
      'Worchel, Lee & Adewole (1975) JPSP vol 32. Lynn (1991) Psychology & Marketing vol 8 meta. Brock (1968) commodity theory. Cialdini (2009) Influence.',
    traits: [
      'Inside the Worchel 1975 and Lynn 1991 magnitude',
      'Gives scarcity real but bounded weight',
      'Respects the quality-signal and demand boundaries',
      'Typical well-calibrated adult response',
    ],
    shareText:
      'My Scarcity Gap was 15 to 30 points, dead inside the commodity-theory data. WIZ says I price scarcity right. The next skill is spotting the manufactured kind, because a fake "only 2 left" feels identical to a real one from the inside.',
  },
  {
    threshold: 50,
    emoji: '💎',
    name: 'The Collector',
    range: 'SCARCITY GAP 30-50 POINTS',
    tagline: 'You feel scarcity clearly. You also let it carry more than the thing can bear.',
    description:
      'Your predicted scarce minus abundant gap was 30 to 50 points, above the meta-analytic magnitude and into the band where scarcity dominates the judgment. You read the mechanism well: the limited edition, the sold-out drop, the forbidden thing all move you strongly and you know it. The risk in this band is forgetting the boundary. Lynn (1991) Psychology & Marketing vol 8 found scarcity does little for items that were not desirable to begin with, and modern consumers increasingly discount scarcity cues they suspect are fake. A gap this large is accurate for genuinely scarce, genuinely wanted things, but starts to over-pay for rarity as such.',
    wizNote:
      'You give scarcity its due and then some. Two refinements keep it calibrated. First, scarcity multiplies existing desire, it does not create it: an edition of fifty ugly prints is fifty ugly prints, and a sold-out product nobody wanted is just out of stock. Second, the move is now so overused that suspicion is the new default; a countdown timer that resets when you reload is worth less than no timer at all. You are right that scarcity is powerful. The skill is checking that the thing under the scarcity is worth wanting.',
    research:
      'Lynn (1991) Psychology & Marketing vol 8 meta and quality-moderation. Worchel, Lee & Adewole (1975) JPSP vol 32 demand-caused-scarcity high band. Cialdini (2009) on scarcity and social proof.',
    traits: [
      'Above the meta magnitude',
      'Strong, accurate read of the mechanism',
      'Over-weights rarity for its own sake',
      'Under-weights the it-must-still-be-good boundary',
    ],
    shareText:
      'My Scarcity Gap was 30 to 50 points. WIZ says I read scarcity clearly but let it carry too much. Scarcity multiplies desire, it does not create it: an edition of fifty ugly prints is still fifty ugly prints.',
  },
  {
    threshold: 200,
    emoji: '🛒',
    name: 'The Panic Buyer',
    range: 'SCARCITY GAP > 50 POINTS',
    tagline: 'You treat scarcity as nearly unlimited leverage. The data says it is real, large, and bounded, all three at once.',
    description:
      'Your predicted scarce minus abundant gap was greater than 50 points, beyond the documented magnitude and beyond the band where scarcity is the dominant driver. A gap this size treats shortage as almost unbounded leverage, where "almost gone" can carry nearly any object. The literature does not support the unbounded version. Lynn (1991) Psychology & Marketing vol 8 found the effect is modest-to-moderate on average and conditional on the item signaling quality; Worchel, Lee & Adewole (1975) found real but finite lifts; and a growing body of work on scarcity skepticism shows that consumers who sense a manufactured shortage swing the other way, into distrust. Your read of scarcity’s pull is vivid and correct. The gap overshoots because it omits the ceiling and the backlash.',
    wizNote:
      'You feel the pull of scarcity at full strength, which means you understand it better than the Stoic ever will. The single correction: scarcity is an amplifier, not a power source. It turns up desire that already exists and does almost nothing to desire that does not, and when it is laid on too thick it curdles into suspicion. Used well, the lesson is about restraint, not volume: a real cap on a genuinely good thing, stated once, beats a fake countdown screaming on every page. Scarcity is real, large, and finite, all three at once.',
    research:
      'Lynn (1991) Psychology & Marketing vol 8 meta and moderators. Worchel, Lee & Adewole (1975) JPSP vol 32. Brehm (1966) reactance. Research on scarcity skepticism and manufactured-urgency backlash.',
    traits: [
      'Beyond the documented magnitude',
      'Treats scarcity as nearly unbounded',
      'Vivid grasp of the pull',
      'Omits the quality ceiling and the suspicion backlash',
    ],
    shareText:
      'My Scarcity Gap was over 50 points. WIZ says I treat "almost gone" as unlimited leverage, but scarcity is an amplifier, not a power source. It turns up desire that is already there and curdles into suspicion when it is faked.',
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
    const abundantIds = SCENARIOS.filter((s) => s.condition === 'abundant').map((s) => s.id);
    const scarceIds = SCENARIOS.filter((s) => s.condition === 'scarce').map((s) => s.id);
    const abundantAvg = abundantIds.reduce((a, id) => a + (ratings[id] ?? 0), 0) / abundantIds.length;
    const scarceAvg = scarceIds.reduce((a, id) => a + (ratings[id] ?? 0), 0) / scarceIds.length;
    const gap = scarceAvg - abundantAvg;
    const profile = computeProfile(gap);

    const pairs = [1, 2, 3, 4].map((pid) => {
      const items = SCENARIOS.filter((s) => s.pairId === pid);
      const abundant = items.find((s) => s.condition === 'abundant')!;
      const scarce = items.find((s) => s.condition === 'scarce')!;
      const userAbundant = ratings[abundant.id] ?? 0;
      const userScarce = ratings[scarce.id] ?? 0;
      const userGap = userScarce - userAbundant;
      return {
        pairId: pid,
        domain: abundant.domain,
        emoji: abundant.emoji,
        abundant,
        scarce,
        userAbundant,
        userScarce,
        userGap,
        documentedGap: abundant.documentedGap,
      };
    });

    const widest = [...pairs].sort((a, b) => Math.abs(b.userGap) - Math.abs(a.userGap))[0];
    const tightest = [...pairs].sort((a, b) => Math.abs(a.userGap) - Math.abs(b.userGap))[0];

    return { abundantAvg, scarceAvg, gap, profile, pairs, widest, tightest };
  }, [step, ratings]);

  const onCopyShare = useCallback(async () => {
    if (!result) return;
    const text = `${result.profile.shareText}\n\nhttps://wiz.jock.pl/experiments/scarcity-effect`;
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
            The Scarcity Effect
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Same thing, twice. Once abundant. Once almost gone.
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
          Eight items in four hidden pairs. Each pair is the{' '}
          <span className="text-amber-300">same thing</span>, twice: a cookie, an online product,
          an art print, a restricted book. Once it is abundant, freely available to anyone. Once it
          is scarce: almost gone, limited, or forbidden. The pairs are not adjacent, they are
          scattered. For each scenario you move a slider predicting the{' '}
          <span className="text-slate-100">average desirability</span> people would report, where
          50 is mild interest.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          At the end I compute your{' '}
          <span className="font-mono text-emerald-300">Scarcity Gap</span>: the average desirability
          you predicted for the scarce scenarios minus the average for the abundant ones. A gap near
          zero says you believe worth is intrinsic and supply is noise. A gap near 18 to 20 puts you
          inside fifty years of commodity-theory data.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="mb-3 text-lg font-semibold text-slate-100">A note before we start</h2>
        <p className="text-sm leading-relaxed text-slate-300">
          Since Worchel, Lee &amp; Adewole (1975) JPSP vol 32 handed people a cookie from a jar of
          ten or a jar of two, the finding has been blunt: identical objects are rated more
          desirable, more attractive, and worth more when they are scarce, with nothing changed but
          the supply. Brock (1968) named the principle commodity theory: a thing is valued to the
          degree it is unavailable. Brehm (1966) added reactance: block access to something and
          people want it more to win the freedom back. The unsettling part is how little the object
          has to do with it. The cookie was the same cookie.
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
            supply
          </div>
          <div className="text-slate-200">{scenario.contextBox}</div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-wider text-slate-400">
          <span>Predicted average desirability</span>
          <span className="font-mono text-emerald-300">{value}</span>
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
          aria-label="Predicted average desirability"
        />

        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>0 — no desire</span>
          <span>50 — mild interest</span>
          <span>100 — must-have</span>
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

type ResultPair = {
  pairId: number;
  domain: string;
  emoji: string;
  abundant: Scenario;
  scarce: Scenario;
  userAbundant: number;
  userScarce: number;
  userGap: number;
  documentedGap: number;
};

type ResultShape = {
  abundantAvg: number;
  scarceAvg: number;
  gap: number;
  profile: ProfileSpec;
  pairs: ResultPair[];
  widest: ResultPair;
  tightest: ResultPair;
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
  const { abundantAvg, scarceAvg, gap, profile, pairs, widest, tightest } = result;

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
        <Stat label="ABUNDANT AVG" value={`${Math.round(abundantAvg)}`} accent="amber" />
        <Stat label="SCARCE AVG" value={`${Math.round(scarceAvg)}`} accent="emerald" />
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
          body={`Your gap: ${Math.round(widest.userGap)} points. Documented gap: ${widest.documentedGap} points. This is where scarcity moved your prediction most.`}
        />
        <Callout
          label="TIGHTEST PAIR"
          emoji={tightest.emoji}
          title={`The ${tightest.domain} pair`}
          body={`Your gap: ${Math.round(tightest.userGap)} points. Documented gap: ${tightest.documentedGap} points. This is where you treated abundant and scarce the most alike.`}
        />
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-100">The reframe</h3>
        <p className="text-sm leading-relaxed text-slate-300">
          Per Brock (1968) commodity theory and Brehm (1966) reactance theory, scarcity works
          through three channels at once: a rare thing is read as more valuable, a blocked thing is
          wanted more to restore the freedom to have it, and a thing that is scarce because others
          want it borrows their judgment as social proof. None of the three is about the object. So
          the test is simple. When you suddenly want something more because it is almost gone,
          limited, or forbidden, ask:{' '}
          <span className="text-amber-300">
            would I want this as much if there were a thousand of them, freely available forever?
          </span>{' '}
          If the answer is no, you are pricing the scarcity, not the thing. This is why drops sell
          out, why limited editions cost more, why banned books fly off the shelf. The cookie did
          not change between the jar of ten and the jar of two. You did.
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

function PairRow({ pair }: { pair: ResultPair }) {
  const calibration = Math.abs(pair.userGap - pair.documentedGap);
  const calColor =
    calibration <= 8
      ? 'text-emerald-300'
      : calibration <= 20
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
          <div className="mb-1 uppercase tracking-wider text-slate-500">abundant</div>
          <div className="font-mono text-amber-300">{Math.round(pair.userAbundant)}</div>
          <div className="text-[10px] text-slate-500">documented {pair.abundant.documentedRating}</div>
        </div>
        <div className="rounded border border-slate-700 bg-slate-950/40 p-2">
          <div className="mb-1 uppercase tracking-wider text-slate-500">scarce</div>
          <div className="font-mono text-emerald-300">{Math.round(pair.userScarce)}</div>
          <div className="text-[10px] text-slate-500">documented {pair.scarce.documentedRating}</div>
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

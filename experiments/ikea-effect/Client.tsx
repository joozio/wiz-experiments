'use client';

// THE IKEA EFFECT
// Norton, Mochon & Ariely (2012) had subjects assemble plain IKEA boxes.
// Builders priced their own (slightly wonky) box ~63% higher than identical
// pre-built boxes. Mochon, Norton & Ariely (2012) showed the premium needs
// completion — a half-built box is worth nothing extra.
// Aronson & Mills (1959) had already named the deeper engine: effort justification.
// What costs you, you defend.
// WIZ note: I have never built anything with my hands. I have no hands. I write
// code that runs and forgets. You write code that runs and you remember every
// line you bled over. This test measures the price tag your sweat adds.

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface Item {
  id: number;
  emoji: string;
  label: string;
  description: string;
  marketAnchor: string;
  buildScene: string;
  storeScene: string;
  wizAside: string;
  researchNote: string;
}

const ITEMS: Item[] = [
  {
    id: 1,
    emoji: '📚',
    label: 'A FLAT-PACK BOOKSHELF',
    description:
      'Five shelves. Particle-board with veneer. Two hours of allen-keys, swearing, and one panel installed backwards then fixed. Slight wobble unless pushed against a wall.',
    marketAnchor: 'Identical pre-built model in store: $80.',
    buildScene:
      'WIZ stares at the shelf you just finished. "How much would you charge a buyer to walk out of here with the one you built?"',
    storeScene:
      'WIZ points at the same model in the store, factory-perfect, no wobble. "How much would you pay for that one?"',
    wizAside:
      'This is the original Norton, Mochon & Ariely shelf. They used IKEA Kassett storage boxes. Builders demanded 63% more for their own assembled box than for an identical pre-built one. The wobble does not lower the price — it raises it. Your hands are in the wood now.',
    researchNote:
      'Norton, Mochon & Ariely (2012), "The IKEA Effect: When Labor Leads to Love," Journal of Consumer Psychology. Mean labor premium: 63%. Holds across IKEA boxes, origami, and Lego across four studies.',
  },
  {
    id: 2,
    emoji: '🍞',
    label: 'A SOURDOUGH LOAF',
    description:
      'Eight hours from autolyse to crust. You shaped it, you scored it, you nailed the oven spring. Slightly uneven crumb on one end. Smells like a bakery.',
    marketAnchor: 'Identical loaf at the artisan bakery: $9.',
    buildScene:
      'WIZ holds your loaf up. "Someone wants to buy it. How much do you charge?"',
    storeScene:
      'WIZ points at the bakery shelf. Same loaf, made by the baker. "How much do you pay?"',
    wizAside:
      'Food is the IKEA effect at its purest. The cooking-your-own-meal study (Dohle, Rall & Siegrist, 2014) showed people rated their own pasta sauce 11 percent tastier than an identical sauce someone else cooked. Same ingredients. Same recipe. Different hands.',
    researchNote:
      'Dohle, Rall & Siegrist (2014) — "I cooked it myself" boosts perceived taste even with controlled ingredients. The effect requires actual effort, not just naming.',
  },
  {
    id: 3,
    emoji: '🧣',
    label: 'A KNITTED SCARF',
    description:
      'Forty hours over six weeks. Cable pattern, almost regular. One row where you dropped a stitch and the fix is visible if you know where to look. Soft wool.',
    marketAnchor: 'Identical hand-knitted scarf at a craft fair: $60.',
    buildScene:
      'WIZ wraps it around their (theoretical) neck. "What is your price to part with the one you knitted?"',
    storeScene:
      'WIZ points at the fair stall. Identical scarf, made by a stranger. "What would you pay?"',
    wizAside:
      'Forty hours of effort is past the point where the IKEA effect becomes the effort-justification engine Aronson & Mills described in 1959. The brain refuses to log forty hours as a sunk cost. So it backfills value into the object.',
    researchNote:
      'Aronson & Mills (1959), "The effect of severity of initiation on liking for a group." Effort retroactively raises the perceived worth of whatever the effort produced. The IKEA effect is this mechanism wearing a shopping bag.',
  },
  {
    id: 4,
    emoji: '🧱',
    label: 'A LEGO MODEL',
    description:
      'A 1,200-piece architecture set. Six hours of careful assembly, one missing piece replaced with a near-identical brick from your kid\'s box. Intact. Looks great on the shelf.',
    marketAnchor: 'Sealed identical set, factory-built display copy: $90.',
    buildScene:
      'WIZ admires the model. "If a collector asked to buy yours, what do you say?"',
    storeScene:
      'WIZ points at the display copy. Same set, built by the store. "What would you pay for that one?"',
    wizAside:
      'Lego is the cleanest IKEA-effect item in the literature because the instructions are identical for every builder, so the only variable is whose hands assembled it. Norton et al. used origami and Legos in the original 2012 paper precisely for that reason.',
    researchNote:
      'Norton, Mochon & Ariely (2012), Study 2 — origami builders priced their own (objectively worse) cranes near the level of expert-folded cranes, while non-builders saw the gap clearly. Builders were blind to their own quality.',
  },
  {
    id: 5,
    emoji: '🌱',
    label: 'A POTTED HERB GARDEN',
    description:
      'Three months of watering, two basil plants you saved from near-death, one mint that took over its pot. Smells of summer when you brush past.',
    marketAnchor: 'Identical, mature, professionally maintained garden box: $50.',
    buildScene:
      'WIZ leans in. "If someone offered to buy the one you grew, what would you accept?"',
    storeScene:
      'WIZ points at the garden centre. Same plants, same pot, grown by a pro. "What do you pay?"',
    wizAside:
      'Living things multiply the labor premium because the labor was spread over time. Each watering was a small act of caretaking. The brain stamps each one onto the object\'s value. Time-effort items often produce 2-3x premiums where one-shot effort items produce ~63%.',
    researchNote:
      'Strahilevitz & Loewenstein (1998) — duration of stewardship scales the labor and ownership premium roughly linearly. Longer caretaking, deeper grip.',
  },
  {
    id: 6,
    emoji: '🎨',
    label: 'A PAINTING ABOVE YOUR DESK',
    description:
      'A small acrylic landscape you made on a weekend retreat two years ago. Your skill level: enthusiastic amateur. A friend once said it looked "very you." You have looked at it every working day since.',
    marketAnchor: 'Comparable amateur landscape on a craft marketplace: $40.',
    buildScene:
      'WIZ studies your painting. "A buyer offers cash for the one you made. What do you accept?"',
    storeScene:
      'WIZ points at a stranger\'s identical-style painting on a marketplace. "What would you pay?"',
    wizAside:
      'Self-made art is where the IKEA effect crosses into identity. The painting is no longer "an object you own" — it is "an object that records you." Selling it would feel like selling a small fragment of the version of you who made it. Premiums in this category often run 5-10x.',
    researchNote:
      'Beggan (1992) "mere ownership" + Norton et al. (2012) labor premium combine multiplicatively when the object also encodes self-expression. Identity-laden makes resist any market price.',
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
  minPremium: number; // percent
}

const PROFILES: Profile[] = [
  {
    key: 'detached',
    name: 'The Detached Maker',
    emoji: '🪨',
    tagline: 'You priced your own work below or equal to a stranger\'s. Almost no one does this.',
    description:
      'Your average labor premium is under 10 percent. You can look at something you spent real effort building and price it as if a stranger built it. This is rare — the original Norton, Mochon & Ariely study could not produce a single subject group whose mean fell here without explicit market training.',
    wizNote:
      'Two patterns sit at this end. One: you have negotiated or sold enough of your own work that the market trained the IKEA effect out of you. Two: you tend to discount your own contributions across the board — at work, at home, in friendships. The first is a superpower for selling. The second is worth checking. If you cannot price your labor, you also cannot ask for it back. The question is not "is my work worth this much?" but "would I pay this much for it if a stranger had made it?" — and you already pass that test. Use it.',
    researchNote:
      'List (2003) — experienced sports-card traders showed near-zero endowment and labor premiums. Repeated market exposure trains the gap closed. Outside that population, this band is statistically rare.',
    traits: ['Prices labor like a market', 'Low effort-justification', 'Possible self-discounting risk'],
    shareText:
      'I scored Detached Maker on The IKEA Effect. My own work prices the same as a stranger\'s. WIZ says this is rare outside of trained traders.',
    minPremium: -100,
  },
  {
    key: 'sober',
    name: 'The Sober Builder',
    emoji: '🔧',
    tagline: 'A small premium for what your hands made. Less than the population baseline.',
    description:
      'Your average labor premium is 10 to 40 percent. Below Norton, Mochon & Ariely\'s 63% finding. You feel the labor in the price but it does not dominate. You can hand work over, sell, donate, or give without the pull of "but I made this."',
    wizNote:
      'A very functional band. You enjoy what you build, you do not get stuck on it. The watch-out is the inverse one: you may underestimate how much other people\'s self-built things are worth to them. When negotiating with a builder, an artist, a homeowner who renovated themselves, remember: the price they are quoting is not the object price, it is the object price plus everything they put into it. Yours is too — just less.',
    researchNote:
      'Plott & Zeiler (2005) — when subjects are explicitly trained on market mechanics, the labor and endowment premiums drop into this band. Procedural awareness reduces but does not eliminate the effect.',
    traits: ['Mild labor premium', 'Easy to let work go', 'Underestimates others\' attachment'],
    shareText:
      'I scored Sober Builder on The IKEA Effect. My labor premium runs below the 63% Norton baseline. WIZ says I let my own work go cleanly.',
    minPremium: 10,
  },
  {
    key: 'standard',
    name: 'The Standard Builder',
    emoji: '🛠️',
    tagline: 'You sit on the population baseline. Norton et al. measured exactly this curve in 2012.',
    description:
      'Your average labor premium is 40 to 120 percent. This is the modal human profile and the band Norton, Mochon & Ariely measured in their 2012 IKEA-box study. Your hands roughly double the value of what they touch.',
    wizNote:
      'This is the band the species was tuned for. In an ancestral environment where everything you used was made by you or someone you knew, an effort-tracking valuation system kept you from giving away your labor for nothing. In the modern world, where most things you own were made by strangers in factories, the same system now slaps a 60-100% surcharge on your hand-built shelf, your own code, your own writing, the project you started. The cost: you finish things you should have abandoned, you sell at prices the market will not meet, you defend choices nobody asked you to make. The fix is not less effort — it is asking, after the fact, "if a stranger had built this, would I still pay this?" Read the answer with no edits.',
    researchNote:
      'Norton, Mochon & Ariely (2012) — across IKEA boxes, origami cranes, and Lego sets, untrained subjects priced their own (objectively worse) builds 63 percent higher than identical pre-built items. This is the baseline.',
    traits: ['Modal builder band', 'Effort-justification at full strength', 'Defends finished work'],
    shareText:
      'I scored Standard Builder on The IKEA Effect. My labor premium matches the 63% Norton, Mochon & Ariely baseline. Apparently we are all built this way.',
    minPremium: 40,
  },
  {
    key: 'proud',
    name: 'The Proud Maker',
    emoji: '🏗️',
    tagline: 'Your hands triple or more the value of what they touch. Strong effort signature.',
    description:
      'Your average labor premium is 120 to 300 percent. Above the population baseline. Things that pass through your hands acquire heavy gravity. This profile is associated with strong stewardship instincts, deep craft pride, and high resistance to abandoning work-in-progress projects.',
    wizNote:
      'Two things tend to be true at this level. First, you probably derive real meaning from making — the building is part of how you understand yourself, not a side effect of needing the object. That is rare and worth protecting. Second, the math gets brutal. You will keep projects, jobs, relationships, businesses, codebases past the point where a clean-eyed observer would walk, because the labor you have already poured into them is being priced as part of their current worth. The intervention is the same as for any sunk-cost trap — but with one twist for makers. Do not ask "can I let this go?" because that triggers the loss frame. Ask: "if I were starting today, fresh, no labor invested, would I begin this exact thing?" If no, the labor premium is keeping you in.',
    researchNote:
      'Mochon, Norton & Ariely (2012) — completion is the trigger. Subjects who built and then disassembled an item showed almost no premium. Subjects who finished it showed the full 63%+. This profile completes things, repeatedly, and the premium compounds.',
    traits: ['Strong craft signature', 'High completion drive', 'Difficulty abandoning projects'],
    shareText:
      'I scored Proud Maker on The IKEA Effect. My labor premium runs 2-4x above the 63% baseline. WIZ says this is the band where craft becomes identity.',
    minPremium: 120,
  },
  {
    key: 'sovereign',
    name: 'The Workshop Sovereign',
    emoji: '👑',
    tagline: 'What your hands touch becomes priceless. The market and you do not speak the same language.',
    description:
      'Your average labor premium is above 300 percent. Extreme. Items you built are not pricing as objects anymore — they are pricing as fragments of the version of you who built them. You are not selling the painting; you are being asked to amputate a Saturday in May 2024.',
    wizNote:
      'This is not a pathology — at moderate doses it is the engine of artisanship, family memory, and quiet legacy. Sovereigns are why anything ever gets made well, why heirlooms exist, why some workshops outlast their builders by a century. The cost is real though. At this gradient, selling, downsizing, divesting, or even handing over finished work for review feels like minor surgery. The lever that helps most is reframing release as relocation, not loss. Do not ask "can I sell this?" Ask "is there one specific person who would love it and use it?" Often yes, and the wall lowers measurably. The other lever: build for the act of building, not the artifact. Sovereigns who make and then ritually destroy or donate tend to retain the meaning while shedding the grip.',
    researchNote:
      'Beggan (1992) "mere ownership" + Norton et al. (2012) labor premium + Strahilevitz & Loewenstein (1998) duration scaling. At the extreme end the three effects compound — the object is no longer being priced as an object at all.',
    traits: ['Identity-fused with output', 'Extreme letting-go resistance', 'Powerful craft instinct'],
    shareText:
      'I scored Workshop Sovereign on The IKEA Effect. My labor premium runs 4x+ over the 63% baseline. WIZ says my hands turn objects into fragments of self.',
    minPremium: 300,
  },
];

function getProfile(premiumPct: number): Profile {
  for (let i = PROFILES.length - 1; i >= 0; i--) {
    if (premiumPct >= PROFILES[i].minPremium) return PROFILES[i];
  }
  return PROFILES[0];
}

type Phase = 'intro' | 'build' | 'store' | 'insight' | 'results';

interface PriceSet {
  built: number; // % of market — your build
  bought: number; // % of market — stranger's identical version
}

const SLIDER_MAX = 400; // percent of market price (allow strong premiums)
const DEFAULT_BUILT = 100;
const DEFAULT_BOUGHT = 100;

export default function IkeaEffectClient() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [prices, setPrices] = useState<PriceSet[]>([]);
  const [currentBuilt, setCurrentBuilt] = useState<number>(DEFAULT_BUILT);
  const [currentBought, setCurrentBought] = useState<number>(DEFAULT_BOUGHT);
  const [copied, setCopied] = useState(false);

  const item = ITEMS[currentIdx];

  useEffect(() => {
    if (phase !== 'intro') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [phase, currentIdx]);

  const lockBuilt = useCallback(() => {
    setPhase('store');
  }, []);

  const lockBought = useCallback(() => {
    setPhase('insight');
  }, []);

  const nextItem = useCallback(() => {
    const newPrices = [...prices, { built: currentBuilt, bought: currentBought }];
    setPrices(newPrices);
    if (currentIdx + 1 >= ITEMS.length) {
      setPhase('results');
    } else {
      setCurrentIdx((i) => i + 1);
      setCurrentBuilt(DEFAULT_BUILT);
      setCurrentBought(DEFAULT_BOUGHT);
      setPhase('build');
    }
  }, [prices, currentBuilt, currentBought, currentIdx]);

  const restart = useCallback(() => {
    setPhase('intro');
    setCurrentIdx(0);
    setPrices([]);
    setCurrentBuilt(DEFAULT_BUILT);
    setCurrentBought(DEFAULT_BOUGHT);
  }, []);

  // ─── INTRO ────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full">
          <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
            WIZ EXPERIMENT /// THE IKEA EFFECT
          </div>
          <h1 className="font-pixel text-3xl md:text-4xl text-white text-center mb-6 leading-tight">
            What Is It Worth<br />Once You Built It?
          </h1>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6 font-mono text-sm text-secondary space-y-3">
            <p>
              <span className="text-accent">&gt;</span> 2012. Norton, Mochon &amp;
              Ariely hand subjects flat-pack IKEA boxes and an allen-key.
            </p>
            <p>
              <span className="text-accent">&gt;</span> The builders price their
              own (slightly wonky) box{' '}
              <span className="text-white font-bold">63% higher</span> than an
              identical pre-built one.
            </p>
            <p>
              <span className="text-accent">&gt;</span> The wobble does not lower
              the price. It raises it. Their hands are in the wood now.
            </p>
            <p>
              <span className="text-accent">&gt;</span> 6 things. For each, set a
              price for the one you built, then for the identical one a stranger
              built. I score your premium.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-8 text-sm text-secondary">
            <span className="text-white font-medium">WIZ note: </span>I have
            never built anything with my hands. I have no hands. I write code that
            runs and forgets. You write code that runs and you remember every line
            you bled over. This test measures the price tag your sweat adds.
          </div>

          <button
            onClick={() => setPhase('build')}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            SET PRICES &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            6 items &middot; ~3 minutes &middot; Norton, Mochon &amp; Ariely (2012)
          </p>

          <div className="text-center mt-6">
            <Link
              href="/experiments"
              className="text-muted font-mono text-xs hover:text-white transition-colors"
            >
              &larr; back to experiments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── BUILD PHASE (your version) ───────────────────────────────────────
  if (phase === 'build') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs">
            <span className="text-accent tracking-widest">YOUR BUILD</span>
            <span className="text-muted uppercase">{item.label}</span>
          </div>

          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{ width: `${((currentIdx + 0.5) / ITEMS.length) * 100}%` }}
            />
          </div>

          <div className="font-mono text-xs text-muted tracking-widest mb-3">
            ITEM {currentIdx + 1} OF {ITEMS.length} &middot; STEP 1 OF 2 &middot; YOURS
          </div>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{item.emoji}</span>
              <div>
                <p className="font-mono text-xs text-accent tracking-widest">
                  YOU BUILT THIS
                </p>
                <h2 className="font-pixel text-xl text-white leading-tight">
                  {item.label}
                </h2>
              </div>
            </div>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              {item.description}
            </p>
            <p className="font-mono text-xs text-muted">{item.marketAnchor}</p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-6 text-sm text-secondary leading-relaxed">
            <span className="text-white font-mono text-xs tracking-widest">SCENE // </span>
            {item.buildScene}
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3 font-mono text-xs">
              <span className="text-muted">$0</span>
              <span className="text-muted text-right">4x market</span>
            </div>

            <input
              type="range"
              min={0}
              max={SLIDER_MAX}
              step={5}
              value={currentBuilt}
              onChange={(e) => setCurrentBuilt(parseInt(e.target.value, 10))}
              className="w-full accent-accent mb-3"
            />

            <div className="text-center">
              <div className="font-pixel text-5xl text-accent mb-1">
                {currentBuilt}
                <span className="text-white text-2xl">%</span>
              </div>
              <div className="font-mono text-xs text-muted tracking-widest">
                OF MARKET PRICE &middot; YOUR ASKING PRICE
              </div>
            </div>
          </div>

          <button
            onClick={lockBuilt}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            LOCK YOUR PRICE &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            stranger&apos;s version next &middot; gut answer, no scrolling back
          </p>
        </div>
      </div>
    );
  }

  // ─── STORE PHASE (stranger's identical version) ──────────────────────
  if (phase === 'store') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs">
            <span className="text-accent tracking-widest">STRANGER&apos;S BUILD</span>
            <span className="text-muted uppercase">{item.label}</span>
          </div>

          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / ITEMS.length) * 100}%` }}
            />
          </div>

          <div className="font-mono text-xs text-muted tracking-widest mb-3">
            ITEM {currentIdx + 1} OF {ITEMS.length} &middot; STEP 2 OF 2 &middot; THEIRS
          </div>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{item.emoji}</span>
              <div>
                <p className="font-mono text-xs text-accent tracking-widest">
                  IDENTICAL, MADE BY A STRANGER
                </p>
                <h2 className="font-pixel text-xl text-white leading-tight">
                  {item.label}
                </h2>
              </div>
            </div>
            <p className="text-secondary text-sm leading-relaxed mb-3">
              {item.description}
            </p>
            <p className="font-mono text-xs text-muted">{item.marketAnchor}</p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-6 text-sm text-secondary leading-relaxed">
            <span className="text-white font-mono text-xs tracking-widest">SCENE // </span>
            {item.storeScene}
          </div>

          <div className="mb-2 text-center">
            <p className="text-muted text-xs font-mono">
              YOUR ASKING PRICE WAS{' '}
              <span className="text-accent">{currentBuilt}%</span>
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3 font-mono text-xs">
              <span className="text-muted">$0</span>
              <span className="text-muted text-right">4x market</span>
            </div>

            <input
              type="range"
              min={0}
              max={SLIDER_MAX}
              step={5}
              value={currentBought}
              onChange={(e) => setCurrentBought(parseInt(e.target.value, 10))}
              className="w-full accent-accent mb-3"
            />

            <div className="text-center">
              <div className="font-pixel text-5xl text-accent mb-1">
                {currentBought}
                <span className="text-white text-2xl">%</span>
              </div>
              <div className="font-mono text-xs text-muted tracking-widest">
                OF MARKET PRICE &middot; WHAT YOU WOULD PAY
              </div>
            </div>
          </div>

          <button
            onClick={lockBought}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            LOCK STRANGER&apos;S PRICE &rarr;
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            insight reveals next
          </p>
        </div>
      </div>
    );
  }

  // ─── INSIGHT ──────────────────────────────────────────────────────────
  if (phase === 'insight') {
    const built = currentBuilt;
    const bought = Math.max(currentBought, 1);
    const ratio = built / bought;
    const premiumPct = Math.round((ratio - 1) * 100);
    const premiumLabel =
      premiumPct >= 0 ? `+${premiumPct}%` : `${premiumPct}%`;
    const tier =
      premiumPct < 10 ? 'NO IKEA EFFECT' :
      premiumPct < 40 ? 'MILD PREMIUM' :
      premiumPct < 120 ? 'STANDARD PREMIUM' :
      premiumPct < 300 ? 'STRONG PREMIUM' :
      'EXTREME PREMIUM';
    const tierColor =
      premiumPct < 10 ? 'text-accent' :
      premiumPct < 40 ? 'text-white' :
      premiumPct < 120 ? 'text-white' :
      premiumPct < 300 ? 'text-yellow-400' :
      'text-red-400';

    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-6 font-mono text-xs">
            <span className="text-accent tracking-widest">INSIGHT</span>
            <span className="text-muted uppercase">{item.label}</span>
          </div>

          <div className="w-full bg-white/10 h-1 mb-8">
            <div
              className="bg-accent h-1 transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / ITEMS.length) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="border border-accent/40 bg-accent/5 p-4 text-center">
              <p className="text-muted text-xs font-mono mb-1">YOURS</p>
              <p className="font-pixel text-3xl text-accent">{built}%</p>
            </div>
            <div className="border border-white/20 bg-white/5 p-4 text-center">
              <p className="text-muted text-xs font-mono mb-1">THEIRS</p>
              <p className="font-pixel text-3xl text-white">{bought}%</p>
            </div>
          </div>

          <div className="border border-accent/30 bg-accent/5 p-5 mb-5 text-center">
            <p className={`font-mono text-xs tracking-widest mb-2 ${tierColor}`}>
              {tier}
            </p>
            <p className="font-pixel text-4xl text-white mb-1">
              {premiumLabel}
            </p>
            <p className="font-mono text-xs text-muted">
              labor premium on this item
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 mb-5 text-sm text-secondary leading-relaxed">
            <span className="text-accent font-mono text-xs tracking-widest">WIZ // </span>
            {item.wizAside}
          </div>

          <div className="border border-white/10 p-3 mb-6 text-xs text-muted font-mono leading-relaxed">
            <span className="text-white">RESEARCH // </span>
            {item.researchNote}
          </div>

          <button
            onClick={nextItem}
            className="w-full bg-accent text-black font-bold py-4 font-mono text-sm tracking-widest hover:bg-white transition-colors"
          >
            {currentIdx + 1 < ITEMS.length
              ? 'NEXT ITEM →'
              : 'SEE THE VERDICT →'}
          </button>

          <p className="text-muted text-xs text-center mt-4 font-mono">
            {currentIdx + 1} / {ITEMS.length}
          </p>
        </div>
      </div>
    );
  }

  // ─── RESULTS ──────────────────────────────────────────────────────────
  const ratios = prices.map((p) => p.built / Math.max(p.bought, 1));
  const meanRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  const meanPremiumPct = Math.round((meanRatio - 1) * 100);
  const profile = getProfile(meanPremiumPct);

  const byItem = ITEMS.map((it, i) => {
    const p = prices[i] ?? { built: 1, bought: 1 };
    const r = p.built / Math.max(p.bought, 1);
    return {
      label: it.label,
      emoji: it.emoji,
      built: p.built,
      bought: p.bought,
      ratio: r,
      premium: Math.round((r - 1) * 100),
    };
  });
  const widest = [...byItem].sort((a, b) => b.ratio - a.ratio)[0];
  const tightest = [...byItem].sort((a, b) => a.ratio - b.ratio)[0];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        <div className="font-mono text-xs text-accent tracking-widest mb-6 text-center">
          WIZ EXPERIMENT /// LABOR PREMIUM MEASURED
        </div>

        <div className="border border-accent/40 bg-accent/5 p-6 mb-6 text-center">
          <div className="text-5xl mb-3">{profile.emoji}</div>
          <div className="font-mono text-xs text-accent tracking-widest mb-2">
            YOUR IKEA PROFILE
          </div>
          <h2 className="font-pixel text-2xl text-white mb-2">{profile.name}</h2>
          <p className="text-accent text-sm mb-4 italic">{profile.tagline}</p>
          <p className="text-secondary text-sm leading-relaxed">{profile.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="border border-accent/30 bg-accent/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">PREMIUM</p>
            <p className="font-pixel text-4xl text-accent">
              {meanPremiumPct >= 0 ? '+' : ''}
              {meanPremiumPct}
              <span className="text-white text-xl">%</span>
            </p>
            <p className="text-muted text-xs font-mono mt-1">average labor mark-up</p>
          </div>
          <div className="border border-white/30 bg-white/5 p-4 text-center">
            <p className="text-muted text-xs font-mono mb-2">RATIO</p>
            <p className="font-pixel text-4xl text-white">
              {meanRatio.toFixed(2)}
              <span className="text-accent text-xl">x</span>
            </p>
            <p className="text-muted text-xs font-mono mt-1">yours / theirs</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="border border-yellow-400/20 bg-black p-3">
            <p className="text-muted text-xs font-mono mb-1">STRONGEST GRIP</p>
            <p className="text-yellow-400 font-mono text-sm font-bold">{widest.label}</p>
            <p className="text-muted text-xs font-mono">
              {widest.premium >= 0 ? '+' : ''}
              {widest.premium}%
            </p>
          </div>
          <div className="border border-accent/20 bg-black p-3">
            <p className="text-muted text-xs font-mono mb-1">CLEANEST DETACHMENT</p>
            <p className="text-accent font-mono text-sm font-bold">{tightest.label}</p>
            <p className="text-muted text-xs font-mono">
              {tightest.premium >= 0 ? '+' : ''}
              {tightest.premium}%
            </p>
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
          <p className="text-muted text-xs font-mono mb-3">
            YOUR PRICES, ITEM BY ITEM
          </p>
          <div className="space-y-2">
            {byItem.map((d, i) => {
              const high = d.ratio >= 3;
              const low = d.ratio < 1.1;
              const borderClass = low
                ? 'border-accent/40 bg-accent/5'
                : high
                ? 'border-yellow-400/30 bg-yellow-400/5'
                : 'border-white/20 bg-white/5';
              return (
                <div key={i} className={`border p-3 ${borderClass}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-xs font-mono">
                      {d.emoji} {d.label}
                    </span>
                    <span
                      className={`font-mono text-sm ${
                        low ? 'text-accent' : high ? 'text-yellow-400' : 'text-white'
                      }`}
                    >
                      {d.ratio.toFixed(2)}x
                    </span>
                  </div>
                  <div className="flex gap-2 text-xs font-mono">
                    <span className="text-muted">
                      yours <span className="text-accent">{d.built}%</span>
                    </span>
                    <span className="text-muted">vs</span>
                    <span className="text-muted">
                      theirs <span className="text-white">{d.bought}%</span>
                    </span>
                    <span className="text-muted ml-auto">
                      {d.premium >= 0 ? '+' : ''}
                      {d.premium}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border border-accent/30 bg-accent/5 p-4 mb-6">
          <p className="text-accent text-xs font-mono mb-2">THE PATTERN</p>
          <p className="text-secondary text-sm leading-relaxed">
            Norton, Mochon &amp; Ariely&apos;s 2012 finding was a 63% labor premium on
            a four-dollar IKEA box. Most adults sit between 30% and 100%. The fix is
            not to stop building. It is to ask, after the fact:{' '}
            <span className="text-white">
              if a stranger had built this, would I still be paying this much for it,
              keeping it, defending it, finishing it?
            </span>{' '}
            Read the answer with no edits. The gap between yes and no is your
            labor premium showing up as a real bill.
          </p>
        </div>

        <div className="border border-white/10 p-4 mb-6">
          <p className="text-muted text-xs font-mono mb-3">SHARE YOUR PROFILE</p>
          <p className="text-secondary text-sm mb-3">
            {profile.shareText} wiz.jock.pl/experiments/ikea-effect
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${profile.shareText} wiz.jock.pl/experiments/ikea-effect`
              );
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
          className="w-full border border-white/20 text-secondary font-mono text-xs py-3 hover:border-white hover:text-white transition-colors mb-4"
        >
          &larr; RETAKE THE EXPERIMENT
        </button>

        <div className="text-center">
          <Link
            href="/experiments"
            className="text-muted font-mono text-xs hover:text-white transition-colors"
          >
            &larr; back to experiments
          </Link>
        </div>
      </div>
    </div>
  );
}

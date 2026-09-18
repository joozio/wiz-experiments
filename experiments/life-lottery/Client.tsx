'use client';

import { useState, useCallback } from 'react';

interface Life {
  id: string;
  era: string;
  year: number;
  yearDisplay: string;
  location: string;
  role: string;
  emoji: string;
  lifeExpectancy: number;
  literacyChance: string;
  privilegeScore: number; // 1-100, how good this life is vs all humans ever
  dayInLife: string;
  funFact: string;
  category: 'ancient' | 'medieval' | 'early-modern' | 'industrial' | 'modern';
}

const LIVES: Life[] = [
  {
    id: 'hunter-gatherer',
    era: 'Paleolithic',
    year: -50000,
    yearDisplay: '50,000 BC',
    location: 'East Africa',
    role: 'Hunter-Gatherer',
    emoji: '\uD83C\uDF3F',
    lifeExpectancy: 33,
    literacyChance: '0%',
    privilegeScore: 18,
    dayInLife: 'You wake on packed earth, surrounded by your band of 25. Today you track antelope across the savannah for 6 hours. If you succeed, your band eats well for days. If not, there are tubers and grubs. You know every star, every animal track, every edible plant within a week\'s walk. You have no word for "boss" or "rent."',
    funFact: 'Hunter-gatherers worked about 15-20 hours per week on average. Many anthropologists call this the "original affluent society."',
    category: 'ancient',
  },
  {
    id: 'egyptian-builder',
    era: 'Old Kingdom Egypt',
    year: -2500,
    yearDisplay: '2,500 BC',
    location: 'Giza, Egypt',
    role: 'Pyramid Builder',
    emoji: '\uD83C\uDFDB\uFE0F',
    lifeExpectancy: 34,
    literacyChance: '1%',
    privilegeScore: 15,
    dayInLife: 'You haul limestone blocks weighing 2.5 tons each up ramps in 40\u00B0C heat. You\'re not a slave, contrary to popular belief. You\'re a conscripted farmer serving your rotation. The beer ration is 4 liters daily. You sleep in a workers\' village with 20,000 others. Your spine will never be the same.',
    funFact: 'Pyramid builders were paid laborers who received medical care. Healed bones found in their skeletons prove they got treatment for injuries.',
    category: 'ancient',
  },
  {
    id: 'roman-slave',
    era: 'Roman Empire',
    year: 100,
    yearDisplay: '100 AD',
    location: 'Rome, Italy',
    role: 'Enslaved Laborer',
    emoji: '\u26D3\uFE0F',
    lifeExpectancy: 25,
    literacyChance: '5%',
    privilegeScore: 5,
    dayInLife: 'You are property. You work from dawn in a wealthy household, carrying water, scrubbing floors, serving meals. You can be sold, beaten, or separated from your family at any moment. If you\'re lucky, you might earn enough peculium to buy your freedom in 15 years. Most don\'t.',
    funFact: 'At its peak, 25-40% of people in the Roman Empire were enslaved. Some enslaved people became highly educated teachers, doctors, and accountants.',
    category: 'ancient',
  },
  {
    id: 'han-farmer',
    era: 'Han Dynasty',
    year: 100,
    yearDisplay: '100 AD',
    location: 'Central China',
    role: 'Rice Farmer',
    emoji: '\uD83C\uDF3E',
    lifeExpectancy: 35,
    literacyChance: '3%',
    privilegeScore: 20,
    dayInLife: 'You tend flooded rice paddies from sunrise. Your family of 8 shares a mud-brick house. Taxes take 30% of your harvest. You\'ve never traveled more than 20 miles from where you were born. When the irrigation works, life is stable. When floods come, it\'s famine.',
    funFact: 'The Han Dynasty had roughly the same population as the Roman Empire (60 million). Together they held over half the world\'s people.',
    category: 'ancient',
  },
  {
    id: 'viking-raider',
    era: 'Viking Age',
    year: 900,
    yearDisplay: '900 AD',
    location: 'Scandinavia',
    role: 'Norse Raider',
    emoji: '\u2693',
    lifeExpectancy: 40,
    literacyChance: '5%',
    privilegeScore: 28,
    dayInLife: 'You navigate by stars across the North Atlantic in a 20-meter longship. Raiding season lasts 4 months. The rest of the year, you\'re a farmer. You can vote at the Thing, own land, and divorce your spouse. Your gods reward courage, not obedience.',
    funFact: 'Vikings had better hygiene than most medieval Europeans. They bathed weekly, used ear spoons, and combed their hair. English women reportedly found them dangerously attractive.',
    category: 'medieval',
  },
  {
    id: 'medieval-peasant',
    era: 'Medieval Period',
    year: 1200,
    yearDisplay: '1200 AD',
    location: 'England',
    role: 'Feudal Peasant',
    emoji: '\uD83C\uDF3D',
    lifeExpectancy: 31,
    literacyChance: '2%',
    privilegeScore: 14,
    dayInLife: 'You work your lord\'s fields 3 days a week and your own strip 3 days. Sunday is for church. You eat dark bread, pottage, and ale. You\'ve never seen a map. The village of 300 is your entire world. When the Black Death arrives, it will kill half the people you know.',
    funFact: 'Medieval peasants had around 8 weeks of holidays per year (saints\' days and festivals). More than most modern workers get.',
    category: 'medieval',
  },
  {
    id: 'mongol-rider',
    era: 'Mongol Empire',
    year: 1240,
    yearDisplay: '1240 AD',
    location: 'Central Asian Steppe',
    role: 'Mongol Cavalry',
    emoji: '\uD83C\uDFF9',
    lifeExpectancy: 35,
    literacyChance: '1%',
    privilegeScore: 30,
    dayInLife: 'You ride 60 miles a day and sleep in a felt ger that can be packed in 30 minutes. Your bow is accurate at 500 meters. You drink airag (fermented mare\'s milk) and eat dried meat from the saddle. Your empire stretches from Korea to Hungary. Your mail system delivers letters faster than anything until the telegraph.',
    funFact: 'The Mongol Empire killed an estimated 40 million people, roughly 10% of the world population. It also established the longest period of peace across the Silk Road.',
    category: 'medieval',
  },
  {
    id: 'aztec-commoner',
    era: 'Aztec Empire',
    year: 1450,
    yearDisplay: '1450 AD',
    location: 'Tenochtitlan, Mexico',
    role: 'Aztec Commoner',
    emoji: '\uD83C\uDFDB\uFE0F',
    lifeExpectancy: 37,
    literacyChance: '5%',
    privilegeScore: 25,
    dayInLife: 'You live in the world\'s largest city: 200,000 people on an island in a lake. Canals serve as streets. You tend chinampas (floating gardens) growing maize, beans, and squash. Education is mandatory. Chocolate is currency. The human sacrifices at the temple are terrifying, but the market has more goods than anything in Europe.',
    funFact: 'Tenochtitlan was larger than any European city of its time. When the Spanish first saw it, they thought they were dreaming.',
    category: 'medieval',
  },
  {
    id: 'ming-scholar',
    era: 'Ming Dynasty',
    year: 1500,
    yearDisplay: '1500 AD',
    location: 'Beijing, China',
    role: 'Imperial Scholar',
    emoji: '\uD83D\uDCDC',
    lifeExpectancy: 45,
    literacyChance: '95%',
    privilegeScore: 55,
    dayInLife: 'You passed the imperial exam after 20 years of study. Now you administer a province of 500,000. You write poetry, practice calligraphy, and debate philosophy in gardens with other scholars. Your salary is paid in rice and silk. You will never do manual labor. Your servants handle everything.',
    funFact: 'The imperial exam had a pass rate of about 1-2%. Some candidates took it their entire lives without passing. It was the world\'s first meritocratic civil service.',
    category: 'early-modern',
  },
  {
    id: 'ottoman-artisan',
    era: 'Ottoman Empire',
    year: 1600,
    yearDisplay: '1600 AD',
    location: 'Istanbul, Turkey',
    role: 'Guild Artisan',
    emoji: '\uD83C\uDFFA',
    lifeExpectancy: 40,
    literacyChance: '15%',
    privilegeScore: 35,
    dayInLife: 'You craft ceramic tiles in the Iznik style, your workshop one of hundreds in the Grand Bazaar. Your guild sets prices, quality standards, and working hours. The city has 700,000 people from dozens of ethnicities. You pray five times daily and drink coffee, which arrived from Yemen 50 years ago and changed everything.',
    funFact: 'The Ottoman Grand Bazaar is one of the oldest and largest covered markets in the world. It had its own police force, court system, and even a prison.',
    category: 'early-modern',
  },
  {
    id: 'edo-merchant',
    era: 'Edo Period Japan',
    year: 1700,
    yearDisplay: '1700 AD',
    location: 'Edo (Tokyo), Japan',
    role: 'Rice Merchant',
    emoji: '\uD83C\uDFEF',
    lifeExpectancy: 42,
    literacyChance: '50%',
    privilegeScore: 38,
    dayInLife: 'You trade rice futures in Dojima, the world\'s first futures exchange. You\'re wealthy but technically the lowest class (merchants rank below farmers, artisans, even samurai). Edo has 1 million people, making it Earth\'s largest city. You enjoy kabuki theater, ukiyo-e prints, and sushi. Japan has been at peace for 100 years.',
    funFact: 'Edo-period Japan had higher literacy rates than most European countries. By 1800, around 40-50% of men and 15% of women could read.',
    category: 'early-modern',
  },
  {
    id: 'enslaved-caribbean',
    era: 'Colonial Era',
    year: 1750,
    yearDisplay: '1750 AD',
    location: 'Caribbean Sugar Plantation',
    role: 'Enslaved Sugar Worker',
    emoji: '\u26D3\uFE0F',
    lifeExpectancy: 21,
    literacyChance: '0%',
    privilegeScore: 2,
    dayInLife: 'You cut sugar cane 18 hours a day during harvest. The heat is unbearable. The overseers use whips. The average enslaved person on a Caribbean sugar plantation lives 7 years after arrival. You were stolen from West Africa at age 14. You will never see your family again. The sugar you produce sweetens tea in London parlors.',
    funFact: 'Sugar plantation slavery was so brutal that the enslaved population could not sustain itself. Planters relied on constantly importing new people from Africa.',
    category: 'early-modern',
  },
  {
    id: 'industrial-child',
    era: 'Industrial Revolution',
    year: 1830,
    yearDisplay: '1830 AD',
    location: 'Manchester, England',
    role: 'Child Factory Worker',
    emoji: '\uD83C\uDFED',
    lifeExpectancy: 26,
    literacyChance: '30%',
    privilegeScore: 8,
    dayInLife: 'You\'re 9 years old and work 14-hour shifts in a cotton mill. Your job is crawling under running machinery to tie broken threads. The air is thick with fiber that will destroy your lungs. You earn 3 shillings a week. Your fingers are scarred. You share a bed with two siblings in a cellar room.',
    funFact: 'Life expectancy for working-class men in Manchester was just 17 years in 1840. For rural workers it was 38. The industrial city was literally killing people.',
    category: 'industrial',
  },
  {
    id: 'american-pioneer',
    era: 'Westward Expansion',
    year: 1850,
    yearDisplay: '1850 AD',
    location: 'Oregon Trail, USA',
    role: 'Pioneer Settler',
    emoji: '\uD83E\uDD20',
    lifeExpectancy: 40,
    literacyChance: '60%',
    privilegeScore: 30,
    dayInLife: 'You walk 15-20 miles daily alongside your ox-drawn wagon for 5 months. One in ten people on the trail will die, mostly from cholera. You left everything behind for 640 acres of free land in Oregon. The isolation is crushing. The nearest doctor is 200 miles away. But the land, when you reach it, is yours.',
    funFact: 'The Oregon Trail was so well-traveled that wagon wheel ruts are still visible from satellite imagery 170 years later.',
    category: 'industrial',
  },
  {
    id: 'meiji-silk',
    era: 'Meiji Japan',
    year: 1890,
    yearDisplay: '1890 AD',
    location: 'Tomioka, Japan',
    role: 'Silk Factory Worker',
    emoji: '\uD83E\uDEB1',
    lifeExpectancy: 44,
    literacyChance: '70%',
    privilegeScore: 25,
    dayInLife: 'You\'re a 16-year-old girl, contracted from your farming village. You unwind silk cocoons in near-boiling water, 12 hours a day. Your fingers are blistered and swollen. But you can read, you earn money for your family, and Japan is transforming from feudal to industrial in a single generation.',
    funFact: 'Japan went from samurai swords to battleships in about 30 years. The Meiji Restoration (1868-1912) was the fastest industrialization in history.',
    category: 'industrial',
  },
  {
    id: 'ww1-soldier',
    era: 'World War I',
    year: 1916,
    yearDisplay: '1916 AD',
    location: 'Somme, France',
    role: 'Infantry Soldier',
    emoji: '\uD83E\uDE96',
    lifeExpectancy: 22,
    literacyChance: '85%',
    privilegeScore: 6,
    dayInLife: 'You stand in a trench filled with mud, rats, and corpses. The bombardment hasn\'t stopped for 3 days. Tomorrow, your unit goes "over the top." The officer\'s whistle will blow at 7:30 AM. You\'ll walk into machine gun fire across 200 meters of open ground. 19,240 British soldiers will die on the first day of the Somme alone.',
    funFact: 'More British soldiers died on the first day of the Battle of the Somme (July 1, 1916) than Americans died in the entire Vietnam War.',
    category: 'modern',
  },
  {
    id: 'depression-farmer',
    era: 'Great Depression',
    year: 1934,
    yearDisplay: '1934 AD',
    location: 'Oklahoma, USA',
    role: 'Dust Bowl Farmer',
    emoji: '\uD83C\uDF2A\uFE0F',
    lifeExpectancy: 55,
    literacyChance: '90%',
    privilegeScore: 22,
    dayInLife: 'The topsoil blows away in black blizzards that block the sun. Your crops are dead. Your animals are dead. Your mortgage is due. You load what you can into a Model T and head west to California with 2.5 million others. Signs at the state line read "OKIES GO HOME." You pick fruit for pennies.',
    funFact: 'The Dust Bowl displaced more Americans than any natural disaster in US history. Some dust clouds traveled all the way to New York and Washington DC.',
    category: 'modern',
  },
  {
    id: 'postwar-tokyo',
    era: 'Post-War Japan',
    year: 1955,
    yearDisplay: '1955 AD',
    location: 'Tokyo, Japan',
    role: 'Salaryman',
    emoji: '\uD83D\uDCBC',
    lifeExpectancy: 65,
    literacyChance: '99%',
    privilegeScore: 52,
    dayInLife: 'You work 6 days a week at a zaibatsu corporation rebuilding from ashes. Lifetime employment is guaranteed. You commute 90 minutes on packed trains. After work: mandatory drinking with colleagues. Your apartment is tiny but you have a TV (new!). GDP will grow 10% annually for the next 20 years. You\'re building a miracle.',
    funFact: 'Japan\'s economy grew so fast from 1955-1973 that economists called it a "miracle." Per capita income went from lower than Mexico to higher than Britain.',
    category: 'modern',
  },
  {
    id: 'soviet-engineer',
    era: 'Cold War',
    year: 1975,
    yearDisplay: '1975 AD',
    location: 'Moscow, USSR',
    role: 'Soviet Engineer',
    emoji: '\u2604\uFE0F',
    lifeExpectancy: 64,
    literacyChance: '99%',
    privilegeScore: 42,
    dayInLife: 'You design spacecraft components in a classified bureau. Housing is free (but cramped: 3 rooms for 4 people). Healthcare is free. Education is free. But the grocery shelves are half-empty, and you queue for 2 hours for oranges. You have a dacha where you grow tomatoes. Don\'t criticize the Party. Ever.',
    funFact: 'The Soviet Union had more engineers per capita than any country in history. It also had more chess grandmasters, mathematicians, and cosmonauts.',
    category: 'modern',
  },
  {
    id: 'rural-india',
    era: 'Modern Era',
    year: 1990,
    yearDisplay: '1990 AD',
    location: 'Bihar, India',
    role: 'Subsistence Farmer',
    emoji: '\uD83C\uDF3E',
    lifeExpectancy: 56,
    literacyChance: '40%',
    privilegeScore: 18,
    dayInLife: 'Your family of 7 lives on 2 acres. No electricity, no plumbing, no paved road to the nearest town. You grow rice and lentils, selling the surplus for about $1/day. Your daughter won\'t go to school because the nearest one is 8km away. Monsoons determine whether you eat this year.',
    funFact: 'In 1990, over 1 billion people worldwide lived on less than $1.90/day. By 2020, that number dropped to 700 million. The fastest poverty reduction in history.',
    category: 'modern',
  },
  {
    id: 'norwegian-modern',
    era: 'Modern Era',
    year: 2024,
    yearDisplay: '2024 AD',
    location: 'Oslo, Norway',
    role: 'Average Norwegian',
    emoji: '\u2744\uFE0F',
    lifeExpectancy: 83,
    literacyChance: '99%',
    privilegeScore: 97,
    dayInLife: 'You work 37.5 hours/week with 5 weeks paid vacation. Free healthcare. Free university. Your government has saved $1.5 trillion in an oil fund (about $270,000 per citizen). Parental leave is 49 weeks at full pay. You complain about the weather and the price of beer ($12).',
    funFact: 'If Norway\'s Government Pension Fund were divided equally, every Norwegian would receive about $270,000. They chose to save it for future generations instead.',
    category: 'modern',
  },
  {
    id: 'refugee-syria',
    era: 'Modern Era',
    year: 2015,
    yearDisplay: '2015 AD',
    location: 'Zaatari Camp, Jordan',
    role: 'Syrian Refugee',
    emoji: '\uD83C\uDFD5\uFE0F',
    lifeExpectancy: 72,
    literacyChance: '86%',
    privilegeScore: 12,
    dayInLife: 'Your home in Aleppo was destroyed by barrel bombs. You walked 400km with your children to the Jordanian border. Now you live in a prefab shelter in a camp of 80,000. You were an accountant. Here, you queue for water and wait for news. You\'ve been here for 3 years. You might be here for 20.',
    funFact: 'Zaatari refugee camp became Jordan\'s 4th largest city. It developed its own economy with over 3,000 shops, including pizza delivery and a wedding dress store.',
    category: 'modern',
  },
  {
    id: 'tech-worker',
    era: 'Modern Era',
    year: 2024,
    yearDisplay: '2024 AD',
    location: 'San Francisco, USA',
    role: 'Tech Worker',
    emoji: '\uD83D\uDCBB',
    lifeExpectancy: 79,
    literacyChance: '99%',
    privilegeScore: 90,
    dayInLife: 'You earn $185,000/year writing code. Your studio apartment costs $3,200/month. You have a standing desk, an espresso machine, and impostor syndrome. You can order anything to your door in 30 minutes. You\'ve had 3 therapists. You doom-scroll until 1am. You are, by every historical measure, unfathomably wealthy.',
    funFact: 'A modern tech worker\'s lifestyle would make them wealthier than 99.9% of all humans who ever lived. The richest Roman emperor had no antibiotics, air conditioning, or Wi-Fi.',
    category: 'modern',
  },
  {
    id: 'subsaharan-farmer',
    era: 'Modern Era',
    year: 2024,
    yearDisplay: '2024 AD',
    location: 'Rural Malawi',
    role: 'Smallholder Farmer',
    emoji: '\uD83C\uDF31',
    lifeExpectancy: 62,
    literacyChance: '62%',
    privilegeScore: 15,
    dayInLife: 'You farm 1.5 acres of maize and groundnuts with a hand hoe. No tractor. No irrigation. Your family earns about $400/year. The nearest hospital is 25km on foot. Your phone (shared, basic) is your most valuable possession. Climate change is making the rains unpredictable. You have 4 children and hope at least one will get to secondary school.',
    funFact: 'Malawi is one of the poorest countries on Earth, yet mobile phone penetration is over 50%. Farmers use phones to check crop prices and receive weather alerts.',
    category: 'modern',
  },
];

// Weighted random: earlier eras appear less (fewer humans existed)
const ERA_WEIGHTS: Record<string, number> = {
  'ancient': 1,
  'medieval': 2,
  'early-modern': 3,
  'industrial': 4,
  'modern': 5,
};

function weightedRandom(lives: Life[]): Life {
  const weighted: { life: Life; weight: number }[] = lives.map(l => ({
    life: l,
    weight: ERA_WEIGHTS[l.category] || 1,
  }));
  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const w of weighted) {
    rand -= w.weight;
    if (rand <= 0) return w.life;
  }
  return lives[lives.length - 1];
}

function getPrivilegeLabel(score: number): { text: string; color: string } {
  if (score >= 80) return { text: 'Jackpot', color: 'text-emerald-400' };
  if (score >= 50) return { text: 'Comfortable', color: 'text-blue-400' };
  if (score >= 25) return { text: 'Survivable', color: 'text-yellow-400' };
  if (score >= 10) return { text: 'Harsh', color: 'text-orange-400' };
  return { text: 'Brutal', color: 'text-red-400' };
}

function getEraColor(category: string): string {
  switch (category) {
    case 'ancient': return 'from-amber-900 to-amber-800';
    case 'medieval': return 'from-stone-800 to-stone-700';
    case 'early-modern': return 'from-indigo-900 to-indigo-800';
    case 'industrial': return 'from-slate-800 to-zinc-700';
    case 'modern': return 'from-cyan-900 to-teal-800';
    default: return 'from-gray-800 to-gray-700';
  }
}

const TOTAL_ROLLS = 5;

interface RollResult {
  life: Life;
  rollNumber: number;
}

export default function LifeLottery() {
  const [rolls, setRolls] = useState<RollResult[]>([]);
  const [currentRoll, setCurrentRoll] = useState<Life | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set());

  const rollDice = useCallback(() => {
    setIsRolling(true);

    // Animate through random lives quickly
    let count = 0;
    const interval = setInterval(() => {
      const available = LIVES.filter(l => !usedIds.has(l.id));
      const randomLife = available[Math.floor(Math.random() * available.length)];
      setCurrentRoll(randomLife);
      count++;
      if (count >= 12) {
        clearInterval(interval);
        // Pick final weighted result
        const available2 = LIVES.filter(l => !usedIds.has(l.id));
        const finalLife = weightedRandom(available2);
        setCurrentRoll(finalLife);
        setIsRolling(false);
        setUsedIds(prev => new Set([...prev, finalLife.id]));
        setRolls(prev => [...prev, { life: finalLife, rollNumber: prev.length + 1 }]);
      }
    }, 80);
  }, [usedIds]);

  const reset = () => {
    setRolls([]);
    setCurrentRoll(null);
    setIsRolling(false);
    setShowResults(false);
    setUsedIds(new Set());
  };

  // Results screen
  if (showResults) {
    const avgPrivilege = Math.round(rolls.reduce((sum, r) => sum + r.life.privilegeScore, 0) / rolls.length);
    const best = rolls.reduce((a, b) => a.life.privilegeScore > b.life.privilegeScore ? a : b);
    const worst = rolls.reduce((a, b) => a.life.privilegeScore < b.life.privilegeScore ? a : b);
    const avgLifeExpectancy = Math.round(rolls.reduce((sum, r) => sum + r.life.lifeExpectancy, 0) / rolls.length);

    const getProfile = (avg: number): { title: string; description: string } => {
      if (avg >= 60) return {
        title: 'Fortune\'s Favorite',
        description: 'The cosmic dice rolled high for you. Across your five lives, you drew from the thin sliver of history where comfort was even possible. Most humans never had it this good.',
      };
      if (avg >= 40) return {
        title: 'The Survivor',
        description: 'A mix of struggle and stability. Some of your lives had moments of genuine comfort. Others had a daily battle for survival. This is closer to the human average than most people realize.',
      };
      if (avg >= 20) return {
        title: 'The Endurer',
        description: 'History was not kind across your five lives. Hard labor, short lives, limited freedom. And yet, in every era, people found meaning, connection, and even joy in the margins.',
      };
      return {
        title: 'The Witness',
        description: 'You drew from history\'s harshest chapters. Slavery, war, extreme poverty. The fact that billions of real humans lived these exact lives should make your current existence feel like a miracle.',
      };
    };

    const profile = getProfile(avgPrivilege);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 animate-fadeIn">
            <div className="text-6xl mb-4">{'\uD83C\uDFB0'}</div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Your Life Lottery</h1>
            <p className="text-violet-300 text-lg">{profile.title}</p>
          </div>

          {/* Main Score */}
          <div className="bg-gradient-to-br from-violet-900/60 to-purple-900/60 border border-violet-500/40 rounded-lg p-8 text-center mb-6 animate-fadeIn">
            <div className="text-sm text-gray-400 mb-1">Average Privilege Score</div>
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-300 mb-2">
              {avgPrivilege}/100
            </div>
            <div className="text-violet-200 text-sm max-w-md mx-auto">{profile.description}</div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6 animate-fadeIn">
            <div className="bg-slate-900/50 border border-violet-500/20 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-400">Avg. Life Expectancy</div>
              <div className="text-2xl font-bold text-violet-300">{avgLifeExpectancy} yrs</div>
            </div>
            <div className="bg-slate-900/50 border border-violet-500/20 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-400">Eras Spanned</div>
              <div className="text-2xl font-bold text-violet-300">
                {new Set(rolls.map(r => r.life.category)).size}
              </div>
            </div>
          </div>

          {/* Best & Worst */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 animate-fadeIn">
            <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4">
              <div className="text-sm text-emerald-400 mb-1">Luckiest Roll</div>
              <div className="text-white font-medium">{best.life.emoji} {best.life.role}</div>
              <div className="text-sm text-gray-400">{best.life.location}, {best.life.yearDisplay}</div>
              <div className="text-sm text-emerald-300 mt-1">Privilege: {best.life.privilegeScore}/100</div>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <div className="text-sm text-red-400 mb-1">Harshest Roll</div>
              <div className="text-white font-medium">{worst.life.emoji} {worst.life.role}</div>
              <div className="text-sm text-gray-400">{worst.life.location}, {worst.life.yearDisplay}</div>
              <div className="text-sm text-red-300 mt-1">Privilege: {worst.life.privilegeScore}/100</div>
            </div>
          </div>

          {/* All Rolls */}
          <div className="bg-slate-900/50 border border-violet-500/20 rounded-lg p-4 mb-6 animate-fadeIn">
            <div className="text-sm text-gray-400 mb-3">All Five Lives</div>
            <div className="space-y-3">
              {rolls.map((roll, i) => {
                const label = getPrivilegeLabel(roll.life.privilegeScore);
                return (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-gray-500 w-5">#{i + 1}</span>
                      <span>{roll.life.emoji}</span>
                      <span className="text-gray-300 truncate">{roll.life.role}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-gray-500 text-xs">{roll.life.yearDisplay}</span>
                      <span className={`font-medium ${label.color}`}>{label.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* WIZ Insight */}
          <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-6 mb-6 animate-fadeIn">
            <div className="text-sm text-gray-400 mb-3">WIZ&apos;s Observation</div>
            <div className="text-purple-200 leading-relaxed">
              Of the roughly 117 billion humans who have ever lived, the vast majority endured lives of hard labor, disease, and early death. Indoor plumbing is newer than the Eiffel Tower. Anesthesia is newer than the bicycle. The life you&apos;re living right now, reading this on a screen, is statistically miraculous. Not good. Not bad. Just extraordinarily improbable.
            </div>
          </div>

          {/* The Perspective */}
          <div className="bg-violet-900/20 border border-violet-500/20 rounded-lg p-4 mb-6 animate-fadeIn">
            <div className="text-sm text-violet-400 mb-2">The Real Odds</div>
            <div className="text-sm text-gray-300 space-y-2">
              <p>If every human who ever lived drew a random life from this lottery:</p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div className="text-violet-300 font-bold">85%</div>
                  <div className="text-xs text-gray-500">Would never learn to read</div>
                </div>
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div className="text-violet-300 font-bold">93%</div>
                  <div className="text-xs text-gray-500">Would die before age 50</div>
                </div>
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div className="text-violet-300 font-bold">99%</div>
                  <div className="text-xs text-gray-500">Would never fly in an airplane</div>
                </div>
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div className="text-violet-300 font-bold">99.9%</div>
                  <div className="text-xs text-gray-500">Would never use the internet</div>
                </div>
              </div>
            </div>
          </div>

          {/* Share */}
          <button
            onClick={() => {
              const text = `I played The Life Lottery and got "${profile.title}" (${avgPrivilege}/100).\n\nLuckiest: ${best.life.role} (${best.life.location}, ${best.life.yearDisplay})\nHarshest: ${worst.life.role} (${worst.life.location}, ${worst.life.yearDisplay})\n\nRoll for your random life \u2192 https://wiz.jock.pl/experiments/life-lottery`;
              navigator.clipboard.writeText(text);
              alert('Copied to clipboard!');
            }}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-colors mb-3"
          >
            Share Results
          </button>

          <button
            onClick={reset}
            className="w-full text-violet-300 hover:text-violet-200 font-semibold py-3 transition-colors"
          >
            Roll Again
          </button>

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>All lives based on historical data. Nothing is stored.</p>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        `}</style>
      </div>
    );
  }

  // Current life display (after rolling, before next roll)
  const lastRoll = rolls[rolls.length - 1];
  const hasRolled = rolls.length > 0 && !isRolling;
  const displayLife = isRolling ? currentRoll : (lastRoll?.life || null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">The Life Lottery</h1>
          <p className="text-violet-300 text-lg">
            117 billion humans have ever lived. Roll the dice. See which life you get.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: TOTAL_ROLLS }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                i < rolls.length ? 'bg-violet-500' :
                i === rolls.length ? 'bg-violet-400 animate-pulse' :
                'bg-slate-700'
              }`}
            />
          ))}
          <span className="text-sm text-gray-400 ml-2">{rolls.length}/{TOTAL_ROLLS}</span>
        </div>

        {/* Life Card */}
        {displayLife ? (
          <div
            className={`bg-gradient-to-br ${getEraColor(displayLife.category)} border border-violet-500/30 rounded-lg p-6 md:p-8 mb-6 ${isRolling ? 'animate-pulse' : 'animate-fadeIn'}`}
            key={isRolling ? 'rolling' : displayLife.id}
          >
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">{displayLife.emoji}</div>
              <div className="text-sm text-gray-400">{displayLife.yearDisplay} \u00B7 {displayLife.location}</div>
              <h2 className="text-2xl font-bold text-white mt-1">{displayLife.role}</h2>
              <div className="text-sm text-violet-300">{displayLife.era}</div>
            </div>

            {!isRolling && (
              <div className="space-y-4 animate-fadeIn">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-black/20 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400">Life Expectancy</div>
                    <div className="text-lg font-bold text-white">{displayLife.lifeExpectancy}</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400">Can You Read?</div>
                    <div className="text-lg font-bold text-white">{parseInt(displayLife.literacyChance) > 50 ? 'Likely' : parseInt(displayLife.literacyChance) > 10 ? 'Maybe' : 'No'}</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-400">Privilege</div>
                    <div className={`text-lg font-bold ${getPrivilegeLabel(displayLife.privilegeScore).color}`}>
                      {displayLife.privilegeScore}/100
                    </div>
                  </div>
                </div>

                {/* Day in Life */}
                <div className="bg-black/20 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-2">A Day in Your Life</div>
                  <p className="text-gray-200 text-sm leading-relaxed">{displayLife.dayInLife}</p>
                </div>

                {/* Fun Fact */}
                <div className="bg-violet-900/30 border border-violet-500/20 rounded-lg p-4">
                  <p className="text-violet-200 text-sm leading-relaxed">{displayLife.funFact}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Intro card before first roll */
          <div className="bg-slate-900/50 border border-violet-500/30 rounded-lg p-8 text-center mb-6">
            <div className="text-6xl mb-4">{'\uD83C\uDFB2'}</div>
            <p className="text-gray-300 mb-2">
              You had no say in when, where, or to whom you were born.
            </p>
            <p className="text-gray-400 text-sm">
              This experiment randomly assigns you 5 lives from across human history. Each one was someone&apos;s reality. Most were nothing like yours.
            </p>
          </div>
        )}

        {/* Roll Button */}
        {!showResults && (
          <button
            onClick={rolls.length >= TOTAL_ROLLS ? () => setShowResults(true) : rollDice}
            disabled={isRolling}
            className={`w-full font-bold py-4 rounded-lg transition-all ${
              isRolling
                ? 'bg-slate-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/30'
            }`}
          >
            {isRolling ? 'Rolling...' :
             rolls.length === 0 ? 'Roll the Dice' :
             rolls.length >= TOTAL_ROLLS ? 'See My Results' :
             `Roll Again (${TOTAL_ROLLS - rolls.length} left)`}
          </button>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Everything is client-side. Your lives stay on your device.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}

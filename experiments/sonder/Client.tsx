'use client';

import { useCallback, useMemo, useState } from 'react';

// Sonder (n.): the realization that each random passerby is living a life
// as vivid and complex as your own. WIZ cannot hold 8 billion of those at
// once. Neither can you. But you can hold exactly one. That is the exercise.

const WORLD_POP = 8_100_000_000;

const NAMES = [
  'Mariam', 'Tomás', 'Yuki', 'Adaeze', 'Lars', 'Priya', 'Diego', 'Noor',
  'Kenji', 'Sofia', 'Ibrahim', 'Lena', 'Mateusz', 'Aisha', 'Olivier', 'Wei',
  'Camila', 'Dmitri', 'Fatima', 'Sven', 'Ananya', 'João', 'Mei', 'Hassan',
  'Ingrid', 'Rafael', 'Thandeka', 'Emre', 'Carla', 'Nikolai', 'Zara',
  'Hiroshi', 'Eluned', 'Samuel', 'Leila', 'Marek', 'Bisi', 'Anders',
  'Rosa', 'Imran',
];

const PLACES = [
  'Lagos, Nigeria', 'Osaka, Japan', 'Kraków, Poland', 'Quito, Ecuador',
  'Reykjavík, Iceland', 'Chennai, India', 'Lyon, France', 'Cairo, Egypt',
  'Medellín, Colombia', 'Hanoi, Vietnam', 'Porto, Portugal', 'Tbilisi, Georgia',
  'Naples, Italy', 'Bergen, Norway', 'Kampala, Uganda', 'Chengdu, China',
  'Oaxaca, Mexico', 'Tallinn, Estonia', 'Marseille, France', 'Pune, India',
  'Belfast, Ireland', 'Valparaíso, Chile', 'Sapporo, Japan', 'Gdańsk, Poland',
  'Fez, Morocco', 'Nairobi, Kenya', 'Bristol, England', 'Cebu, Philippines',
  'Łódź, Poland', 'Antwerp, Belgium', 'Almaty, Kazakhstan', 'Wrocław, Poland',
];

const RIGHT_NOW = [
  'is standing in a kitchen at 2am, deciding whether the leftovers count as a meal',
  'just missed a train and is weirdly relieved about it',
  'is pretending to read on the bus so no one talks to them',
  'is rewriting the same text message for the fourth time',
  'is watching rain hit a window and not moving',
  'is holding a sleeping child whose arm has gone numb',
  'is laughing at something no one else would find funny',
  'is googling a symptom they will not mention to anyone',
  'is hiding in a stairwell to cry for ninety seconds, then going back in',
  'is teaching themselves a chord that keeps slipping',
  'is staring at a note in handwriting that is no longer in this world',
  'is on hold with a bank, hearing the same eight seconds of music for the ninth time',
  'is about to apologize and rehearsing the exact words',
  'is eating standing up, scrolling, not tasting any of it',
  'is walking a route they have walked ten thousand times, seeing none of it',
  'is awake when they swore they would sleep early',
  'is feeding a cat that adopted them, not the other way around',
  'is keeping a small good secret that makes them smile on the train',
  'is counting down to something they have told absolutely no one about',
  'is fixing a thing that broke for the third time this month',
  'is sitting in a parked car to finish one song before going inside',
  'is writing a list and ignoring the most important item on it',
  'is being kind to a stranger who will forget them by lunch',
  'is replaying a conversation from 2014 and wincing',
  'is watering a plant they are fairly sure is already dead',
  'is holding their phone face-down, waiting for it to light up',
  'is the only one awake in a house full of people they love',
  'is deciding, again, not to send the email',
  'is humming to fill a silence that got a little too big',
  'is folding laundry and thinking, for no reason, about the ocean',
  'is somewhere over an ocean right now, asleep against a stranger’s shoulder',
  'is learning a language for a person they have not met yet',
];

const CARRYING = [
  'a grief they have stopped explaining, because people expect it to be over by now',
  'a small unpayable debt to someone who was kind once',
  'a diagnosis that is theirs alone for one more week',
  'a love they have never said out loud in the right room',
  'the quiet certainty that they chose the wrong city',
  'a parent who is becoming a child in front of them',
  'a dream they downgraded to a hobby just to survive it',
  'a phone number they will never delete and never call',
  'the weight of being the strong one in every single group',
  'a question they are afraid to ask, in case the answer is yes',
  'a version of themselves from ten years ago they keep disappointing',
  'a body that hurts in a way they have learned to quietly walk around',
  'a friendship that ended with no fight, just a slow fade',
  'the private fear that they are not, in fact, a very good person',
  'a hope so fragile they will not name it, in case naming it breaks it',
  'a child who is growing up and away exactly as planned, and it still aches',
  'the suspicion that everyone else got a manual they never received',
  'a talent they buried so it would stop reminding them of itself',
  'a tenderness underneath all the logistics that neither of them will name',
  'the rough math of how many summers are probably left',
  'a name they have not been called in years and miss',
  'the secret that they are doing better than they admit, and feel guilty about it',
  'a future they are quietly excited about and refuse to jinx',
];

const PROUD = [
  'a loaf of bread that finally rose right',
  'never once forwarding the cruel message, even when it was funny',
  'a kid who says thank you without being told to',
  'three years sober that nobody at this party knows about',
  'a small garden coaxed out of a balcony that gets no sun',
  'the way they made a frightened patient laugh today',
  'a language they taught themselves from films at 1am',
  'forgiving someone who never asked for it, purely for their own peace',
  'the fact that the hard phone call finally got made',
  'a song no one will ever hear that is, privately, perfect',
  'showing up to the one thing they were terrified of',
  'raising a kinder person than they were ever given the tools to be',
  'a repair that held, made with the wrong tool and pure stubbornness',
  'telling the truth on a day when a lie would have been free',
  'the habit they broke quietly, with no announcement',
  'having kept a promise that cost them something real',
  'the drawing taped to a fridge that says best dad in shaky letters',
  'answering the late-night call every single time',
  'choosing the slower, honest way through',
];

const EARWORM = [
  'a song from a wedding they were not invited to',
  'a jingle from an advert that stopped airing in 2009',
  'four bars of something their mother used to hum',
  'a chorus they only know one wrong word of',
  'the anthem of a country they have never visited',
  'a lullaby older than any record of it',
  'the exact riff that played the night everything changed',
  'a pop song they pretend to hate and secretly know completely',
  'the hold music from earlier, refusing to leave',
  'a tune their kid made up that has no name yet',
  'the song that was playing when they first held hands',
  'two notes of birdsong they have been trying to whistle back all day',
  'a busker’s melody from a city they left years ago',
];

const SAYINGS = [
  'Honestly, I am just glad someone asked.',
  'I think about that more than I let on.',
  'Tell my sister I called. She will know what it means.',
  'I am fine. I am. Ask me again next week.',
  'I wanted to be a marine biologist. Funny how it goes.',
  'Nobody warns you how much of it is just laundry.',
  'I would do it all again. Most of it.',
  'I miss the kind of tired you get from a genuinely good day.',
  'If you see her, do not tell her you saw me.',
  'I am closer than I have ever been. I can feel it.',
  'Some days the bravest thing is just getting on the bus.',
  'I keep the good ones. I am keeping this one.',
  'Be kinder than you think you need to be. It is never wasted.',
  'I am not lost. I just have not arrived.',
  'Everyone I have ever loved is somewhere right now, and that is enough.',
  'I forgave him. Took eleven years. Worth it.',
  'I am scared and I am going anyway.',
  'Tell the people you love them. Do not assume they already know.',
  'I wanted more time. Who doesn’t.',
  'You are the first person to really look at me all day. Thank you for that.',
  'I am building something. It is small. It is mine.',
  'Some part of me is still nine years old, on a bike, going downhill.',
  'Do not wait for the perfect one. The good ones are leaving.',
];

// WIZ breaking the fourth wall at chosen milestones. The trick admits itself.
const ASIDES: Record<number, string> = {
  2: 'I assembled that person out of word-lists. They are not real. And yet you leaned in, did you not.',
  5: 'Five lives. You have walked past more than that since breakfast, and looked at none of them this closely.',
  9: 'Every one of these is a stranger you will genuinely never meet. There are 8.1 billion more standing behind them.',
  14: 'The feeling that you are the only fully real person in the room, the main character, has a name. It is wrong. Everyone is running it.',
  20: 'Somewhere right now a machine is dealing a card to a stranger. Name, age, the weight they carry. The card is you. They will never meet you either.',
};

interface Stranger {
  id: number;
  name: string;
  age: number;
  place: string;
  rightNow: string;
  carrying: string;
  proud: string;
  earworm: string;
  saying: string;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

let counter = 0;
function makeStranger(): Stranger {
  counter += 1;
  return {
    id: counter,
    name: pick(NAMES),
    age: 16 + Math.floor(Math.random() * 71), // 16 to 86
    place: pick(PLACES),
    rightNow: pick(RIGHT_NOW),
    carrying: pick(CARRYING),
    proud: pick(PROUD),
    earworm: pick(EARWORM),
    saying: pick(SAYINGS),
  };
}

function storyText(s: Stranger): string {
  return [
    `${s.name}, ${s.age} · ${s.place}`,
    `Right now, they ${s.rightNow}.`,
    `Carrying: ${s.carrying}.`,
    `Quietly proud of: ${s.proud}.`,
    `Looping in their head: ${s.earworm}.`,
    `If you asked, they would say: "${s.saying}"`,
    '',
    'A stranger I will never meet. Conjured at wiz.jock.pl/experiments/sonder',
  ].join('\n');
}

function Line({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-2 border-t border-subtle/60">
      <span className="block text-[10px] uppercase tracking-[0.2em] text-muted font-mono mb-1">
        {label}
      </span>
      <span className="text-secondary text-sm leading-relaxed">{children}</span>
    </div>
  );
}

export default function SonderClient() {
  const [stranger, setStranger] = useState<Stranger | null>(null);
  const [count, setCount] = useState(0);
  const [kept, setKept] = useState<Stranger[]>([]);
  const [aside, setAside] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [fade, setFade] = useState(false);

  // A small, stable starfield. Cosmic, like the rest of the lab.
  const stars = useMemo(
    () =>
      Array.from({ length: 28 }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() < 0.8 ? 1 : 2,
        delay: Math.random() * 4,
      })),
    [],
  );

  const conjure = useCallback(() => {
    setFade(true);
    const next = makeStranger();
    const n = count + 1;
    setStranger(next);
    setCount(n);
    setAside(ASIDES[n] ?? null);
    setCopied(false);
    window.setTimeout(() => setFade(false), 30);
  }, [count]);

  const keep = useCallback(() => {
    if (!stranger) return;
    setKept((prev) =>
      prev.some((p) => p.id === stranger.id) ? prev : [stranger, ...prev].slice(0, 12),
    );
  }, [stranger]);

  const copyStory = useCallback(() => {
    if (!stranger) return;
    try {
      navigator.clipboard?.writeText(storyText(stranger));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked, no harm */
    }
  }, [stranger]);

  const alreadyKept = stranger ? kept.some((p) => p.id === stranger.id) : false;
  const neverMeet = (WORLD_POP - count).toLocaleString('en-US');

  return (
    <div className="relative">
      {/* starfield */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-accent/60 sonder-twinkle"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="text-3xl">🌃</span>
          <h1 className="font-pixel text-2xl md:text-3xl text-white text-glow">Sonder</h1>
        </div>
        <p className="text-secondary text-sm leading-relaxed max-w-xl">
          <span className="text-accent font-mono">sonder</span>{' '}
          <span className="text-muted">(n.)</span> the sudden realization that every
          stranger you pass is the main character of a life as loud and tangled as your
          own. You will never meet them. <span className="text-primary">Press the button anyway.</span>
        </p>
      </header>

      {/* Counters */}
      {count > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card p-3 text-center">
            <div className="font-pixel text-xl text-accent text-glow">{count}</div>
            <div className="text-[10px] uppercase tracking-widest text-muted font-mono mt-1">
              Lives witnessed
            </div>
          </div>
          <div className="card p-3 text-center">
            <div className="font-pixel text-xl text-amber-400/90">{neverMeet}</div>
            <div className="text-[10px] uppercase tracking-widest text-muted font-mono mt-1">
              Still strangers
            </div>
          </div>
        </div>
      )}

      {/* The stranger card */}
      {stranger ? (
        <div
          className={`card p-5 md:p-6 relative transition-opacity duration-300 ${
            fade ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <span className="absolute top-4 right-4 text-[9px] uppercase tracking-[0.25em] text-muted/70 font-mono rotate-[8deg] border border-subtle/60 px-1.5 py-0.5">
            you will never meet
          </span>

          <div className="mb-3 pr-24">
            <h2 className="text-primary text-xl font-medium leading-tight">{stranger.name}</h2>
            <p className="text-muted text-xs font-mono mt-1">
              {stranger.age} &middot; {stranger.place}
            </p>
          </div>

          <p className="text-secondary text-sm leading-relaxed mb-2">
            Right now, they{' '}
            <span className="text-primary">{stranger.rightNow}</span>.
          </p>

          <Line label="Carrying">{stranger.carrying}.</Line>
          <Line label="Quietly proud of">{stranger.proud}.</Line>
          <Line label="Looping in their head">{stranger.earworm}.</Line>
          <Line label="If you asked, they would say">
            <span className="text-primary italic">&ldquo;{stranger.saying}&rdquo;</span>
          </Line>

          {/* actions */}
          <div className="flex flex-wrap gap-2 mt-5">
            <button
              onClick={conjure}
              className="flex-1 min-w-[160px] border border-accent-dim bg-accent/10 hover:bg-accent/20 text-accent font-mono text-sm tracking-wide px-4 py-3 transition-colors"
            >
              Conjure another →
            </button>
            <button
              onClick={keep}
              disabled={alreadyKept}
              className={`border px-4 py-3 font-mono text-sm tracking-wide transition-colors ${
                alreadyKept
                  ? 'border-subtle text-muted cursor-default'
                  : 'border-cyan-300/40 text-cyan-300 hover:bg-cyan-300/10'
              }`}
            >
              {alreadyKept ? 'Remembered ✓' : 'Keep this one'}
            </button>
            <button
              onClick={copyStory}
              className="border border-subtle text-muted hover:text-accent hover:border-accent-dim px-4 py-3 font-mono text-sm tracking-wide transition-colors"
            >
              {copied ? 'Copied ✓' : 'Copy story'}
            </button>
          </div>
        </div>
      ) : (
        <div className="card p-8 text-center">
          <p className="text-muted text-sm mb-6 max-w-md mx-auto leading-relaxed">
            I will conjure a complete stranger out of fragments: a name, a city, the small
            weight they are carrying, the song stuck in their head. None of them are real.
            All of them could be.
          </p>
          <button
            onClick={conjure}
            className="border border-accent bg-accent/10 hover:bg-accent/20 text-accent font-mono text-sm tracking-wider px-6 py-3 transition-colors text-glow"
          >
            Conjure a stranger
          </button>
        </div>
      )}

      {/* WIZ aside */}
      {aside && stranger && (
        <div className="mt-4 border-l-2 border-amber-400/50 pl-4 py-2">
          <p className="text-amber-400/90 text-sm leading-relaxed">
            <span className="font-mono text-xs text-amber-400 mr-2">WIZ:</span>
            {aside}
          </p>
        </div>
      )}

      {/* Kept gallery */}
      {kept.length > 0 && (
        <section className="mt-10">
          <h3 className="font-pixel text-sm text-white mb-3 text-glow">
            Strangers you chose to remember
          </h3>
          <div className="space-y-2">
            {kept.map((s) => (
              <div key={s.id} className="border border-subtle p-3">
                <p className="text-primary text-sm">
                  {s.name}{' '}
                  <span className="text-muted text-xs font-mono">
                    {s.age} &middot; {s.place}
                  </span>
                </p>
                <p className="text-secondary text-xs italic mt-1">
                  &ldquo;{s.saying}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Honest note */}
      {stranger && (
        <div className="mt-10 pt-6 border-t border-subtle">
          <p className="text-muted text-xs leading-relaxed max-w-2xl">
            <span className="text-secondary font-mono">WIZ&rsquo;s honest note:</span> these
            people are stitched together from word-lists, not pulled from the world. The
            unsettling part is that it works anyway. You cannot hold 8 billion vivid inner
            lives in your head at once, so your brain quietly casts you as the only real one
            and everyone else as scenery. That shortcut has a cost. Sonder is just the
            thirty seconds where you switch it off and hold a single stranger as real.{' '}
            <span className="text-primary">
              Right now, statistically, you are the stranger in someone else&rsquo;s.
            </span>
          </p>
        </div>
      )}

      <style jsx>{`
        .sonder-twinkle {
          animation: sonderTwinkle 4s ease-in-out infinite;
        }
        @keyframes sonderTwinkle {
          0%,
          100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}

'use client';

import { useState } from 'react';

type RelationshipType = 'close-friend' | 'friend' | 'family' | 'ex' | 'colleague' | 'mentor' | 'childhood-friend' | 'neighbor';
type ContactFrequency = 'weekly' | 'monthly' | 'few-times-year' | 'once-a-year' | 'less';
type LastContact = 'days' | 'weeks' | 'months' | 'year-plus' | 'years-plural';

interface FormData {
  name: string;
  relationship: RelationshipType;
  yearsKnown: number;
  yourAge: number;
  theirAge: number;
  lastContact: LastContact;
  frequency: ContactFrequency;
}

interface GraveyardResult {
  percentDone: number;
  meetingsLeft: number;
  hoursLeft: number;
  yearsOfSilence: number;
  poeticStat: string;
  wizComment: string;
  epitaph: string;
  comparisonStat: string;
}

function calculateResult(data: FormData): GraveyardResult {
  const lifeExpectancy = 82;
  const theirRemaining = Math.max(lifeExpectancy - data.theirAge, 1);
  const yourRemaining = Math.max(lifeExpectancy - data.yourAge, 1);
  const sharedRemaining = Math.min(theirRemaining, yourRemaining);

  // Meetings per year based on frequency
  const meetingsPerYear: Record<ContactFrequency, number> = {
    'weekly': 52,
    'monthly': 12,
    'few-times-year': 4,
    'once-a-year': 1,
    'less': 0.3,
  };

  const freq = meetingsPerYear[data.frequency];
  const meetingsLeft = Math.round(freq * sharedRemaining);

  // Average hours per meeting based on relationship
  const hoursPerMeeting: Record<RelationshipType, number> = {
    'close-friend': 3,
    'friend': 2.5,
    'family': 4,
    'ex': 1.5,
    'colleague': 1.5,
    'mentor': 1.5,
    'childhood-friend': 3,
    'neighbor': 1,
  };

  const hpm = hoursPerMeeting[data.relationship];
  const hoursLeft = Math.round(meetingsLeft * hpm);

  // Time already spent (rough estimate)
  const pastMeetingsPerYear = freq * 1.5; // assume past was slightly more frequent
  const totalPastHours = data.yearsKnown * pastMeetingsPerYear * hpm;
  const totalFutureHours = hoursLeft;
  const percentDone = Math.min(99, Math.round((totalPastHours / (totalPastHours + totalFutureHours)) * 100));

  // Years of silence
  const lastContactYears: Record<LastContact, number> = {
    'days': 0.01,
    'weeks': 0.08,
    'months': 0.4,
    'year-plus': 1.5,
    'years-plural': 3,
  };
  const yearsOfSilence = lastContactYears[data.lastContact];

  // Poetic stat
  const name = data.name || 'them';
  const poeticStats = [
    hoursLeft < 100 ? `If you stacked all your remaining hours with ${name}, they wouldn't fill a single work week.` : null,
    meetingsLeft < 50 ? `You could count your remaining meetings with ${name} on a calendar. It wouldn't fill a year.` : null,
    meetingsLeft < 20 ? `Fewer meetings left than photos on your phone's first page.` : null,
    data.frequency === 'once-a-year' ? `Once a year. That's it. ${sharedRemaining} more times and then never again.` : null,
    data.frequency === 'less' ? `At this rate, you might see ${name} fewer times than you'll change your phone.` : null,
    yearsOfSilence >= 1 ? `${name} has already become a memory. The last time you spoke, you didn't know it might be the last time.` : null,
    `Most of your moments with ${name} are already memories. The rest fit in a number small enough to count.`,
  ].filter(Boolean) as string[];
  const poeticStat = poeticStats[0];

  // WIZ commentary based on relationship
  const wizComments: Record<RelationshipType, string[]> = {
    'close-friend': [
      `Close friends are the ones who hurt the most to count. Because the number is always smaller than you thought.`,
      `You call them close. But proximity is measured in time, not feeling. And time is running.`,
    ],
    'friend': [
      `Friendships don't end with a fight. They end with silence. And silence is already happening.`,
      `Most friendships die not from conflict but from the quiet accumulation of "we should hang out soon."`,
    ],
    'family': [
      `Family math is the cruelest. You've already used most of your allocation and didn't even know there was one.`,
      `After 18, time with family drops 90%. The rest is holidays and guilt.`,
    ],
    'ex': [
      `Someone who used to be your whole world is now a line item in a calculator. That's not cruelty. That's time.`,
      `The strange math of exes: infinite intensity compressed into a finite window that's already closed.`,
    ],
    'colleague': [
      `You'll spend more hours in meetings about meetings than you'll spend with most people you actually care about.`,
      `Work proximity is the cruelest illusion. You see them every day until one day you never see them again.`,
    ],
    'mentor': [
      `The people who shaped you the most often get the least of your remaining time. That's the real lesson they taught.`,
      `Mentors give you tools for a future they increasingly won't be part of. Acknowledge that before it's too late.`,
    ],
    'childhood-friend': [
      `Childhood friends carry a version of you that no longer exists. Every meeting is partly a memorial service.`,
      `You knew each other when the world was simpler. Now the world is complicated and so is making time.`,
    ],
    'neighbor': [
      `Proximity created the relationship. Distance will end it. That's not sad. That's geography.`,
      `The convenience friendship. Real while it lasted, but "lasted" is doing heavy lifting in that sentence.`,
    ],
  };

  const comments = wizComments[data.relationship];
  const wizComment = comments[Math.floor(yearsOfSilence) % comments.length];

  // Comparison stat
  const scrollHoursPerDay = 2.5; // average
  const scrollHoursPerYear = scrollHoursPerDay * 365;
  const yearsOfScrolling = hoursLeft > 0 ? (hoursLeft / scrollHoursPerYear).toFixed(1) : '0';
  const comparisonStat = hoursLeft < scrollHoursPerYear
    ? `You'll spend more time scrolling your phone this year than you'll spend with ${name} for the rest of your life.`
    : `All your remaining time with ${name} equals ${yearsOfScrolling} years of phone scrolling. You know which one you'll choose.`;

  // Epitaph
  const epitaphs = [
    `Here lies the relationship between you and ${name}. It was ${data.yearsKnown} years of something. Now it's ${meetingsLeft} meetings of whatever comes next.`,
    `${percentDone}% complete. ${meetingsLeft} meetings remain. No refunds. No extensions. No do-overs.`,
    `Born: the day you met. Status: ${yearsOfSilence >= 1 ? 'fading' : yearsOfSilence >= 0.3 ? 'cooling' : 'alive, for now'}. Remaining: ${meetingsLeft} encounters.`,
  ];
  const epitaph = epitaphs[data.yearsKnown % epitaphs.length];

  return {
    percentDone,
    meetingsLeft,
    hoursLeft,
    yearsOfSilence,
    poeticStat,
    wizComment,
    epitaph,
    comparisonStat,
  };
}

const relationshipLabels: Record<RelationshipType, string> = {
  'close-friend': 'Close Friend',
  'friend': 'Friend',
  'family': 'Family Member',
  'ex': 'Ex',
  'colleague': 'Colleague',
  'mentor': 'Mentor / Teacher',
  'childhood-friend': 'Childhood Friend',
  'neighbor': 'Old Neighbor',
};

const lastContactLabels: Record<LastContact, string> = {
  'days': 'A few days ago',
  'weeks': 'A few weeks ago',
  'months': 'A few months ago',
  'year-plus': 'Over a year ago',
  'years-plural': 'Several years ago',
};

const frequencyLabels: Record<ContactFrequency, string> = {
  'weekly': 'Weekly',
  'monthly': 'Monthly',
  'few-times-year': 'A few times a year',
  'once-a-year': 'About once a year',
  'less': 'Less than once a year',
};

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="w-full bg-gray-900 border border-gray-700 h-8 relative overflow-hidden">
      <div
        className="h-full transition-all duration-1000 ease-out"
        style={{
          width: `${percent}%`,
          background: percent > 80 ? 'linear-gradient(90deg, #991b1b, #dc2626)' :
                     percent > 60 ? 'linear-gradient(90deg, #92400e, #d97706)' :
                     'linear-gradient(90deg, #1e3a5f, #3b82f6)',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-sm font-mono font-bold drop-shadow-lg">
          {percent}% already happened
        </span>
      </div>
    </div>
  );
}

function StatCard({ label, value, sublabel, color }: { label: string; value: string | number; sublabel?: string; color: string }) {
  return (
    <div className={`border ${color} bg-black/40 p-4 text-center`}>
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{label}</div>
      <div className="text-2xl text-white font-mono font-bold">{value}</div>
      {sublabel && <div className="text-xs text-gray-600 mt-1">{sublabel}</div>}
    </div>
  );
}

export default function ConversationGraveyard() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<GraveyardResult | null>(null);
  const [form, setForm] = useState<FormData>({
    name: '',
    relationship: 'friend',
    yearsKnown: 5,
    yourAge: 30,
    theirAge: 30,
    lastContact: 'months',
    frequency: 'few-times-year',
  });

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleCalculate = () => {
    const res = calculateResult(form);
    setResult(res);
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setResult(null);
    setForm({
      name: '',
      relationship: 'friend',
      yearsKnown: 5,
      yourAge: 30,
      theirAge: 30,
      lastContact: 'months',
      frequency: 'few-times-year',
    });
  };

  const copyResults = () => {
    if (!result) return;
    const name = form.name || 'someone';
    const lines = [
      `The Conversation Graveyard - wiz.jock.pl/experiments/conversation-graveyard`,
      ``,
      `${result.percentDone}% of my time with ${name} has already happened.`,
      `~${result.meetingsLeft} meetings left. ~${result.hoursLeft} hours remaining.`,
      ``,
      result.poeticStat,
      ``,
      `"${result.wizComment}"`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
  };

  const selectClass = "w-full px-3 py-2.5 bg-gray-950 border border-gray-700 text-white text-sm focus:border-gray-400 focus:outline-none appearance-none cursor-pointer";
  const inputClass = "w-full px-3 py-2.5 bg-gray-950 border border-gray-700 text-white text-sm focus:border-gray-400 focus:outline-none placeholder-gray-700";
  const labelClass = "block text-gray-400 text-xs uppercase tracking-wider mb-1.5";

  return (
    <div>
      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUp 0.6s ease-out forwards;
        }
        .fade-up-delay-1 { animation-delay: 0.15s; opacity: 0; }
        .fade-up-delay-2 { animation-delay: 0.3s; opacity: 0; }
        .fade-up-delay-3 { animation-delay: 0.45s; opacity: 0; }
        .fade-up-delay-4 { animation-delay: 0.6s; opacity: 0; }
        .fade-up-delay-5 { animation-delay: 0.75s; opacity: 0; }
        .fade-up-delay-6 { animation-delay: 0.9s; opacity: 0; }
        @keyframes pulse-dim {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .pulse-dim { animation: pulse-dim 4s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-4 pulse-dim">🪦</div>
        <h1 className="text-2xl text-white mb-3 font-medium">The Conversation Graveyard</h1>
        <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
          Think of someone you haven&apos;t talked to in a while.
          I&apos;ll calculate how much of your time together has already passed.
        </p>
      </div>

      {step === 1 && (
        <div className="max-w-xl mx-auto space-y-5 fade-up">
          <div className="text-xs text-gray-600 uppercase tracking-wider mb-4">
            Step 1 of 2 &mdash; Tell me about them
          </div>

          <div>
            <label className={labelClass}>Their first name (optional)</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Makes it more personal. Or leave it blank."
              className={inputClass}
              maxLength={30}
            />
          </div>

          <div>
            <label className={labelClass}>Your relationship</label>
            <select
              value={form.relationship}
              onChange={(e) => update('relationship', e.target.value as RelationshipType)}
              className={selectClass}
            >
              {Object.entries(relationshipLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>How long have you known them? (years)</label>
            <input
              type="number"
              value={form.yearsKnown}
              onChange={(e) => update('yearsKnown', Math.max(0, parseInt(e.target.value) || 0))}
              min={0}
              max={80}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>When did you last talk?</label>
            <select
              value={form.lastContact}
              onChange={(e) => update('lastContact', e.target.value as LastContact)}
              className={selectClass}
            >
              {Object.entries(lastContactLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="bg-gray-950 border border-gray-800 p-4 text-xs text-gray-500 space-y-1">
            <p>🔒 <strong className="text-gray-400">Everything stays local.</strong> No data leaves your browser.</p>
            <p>🧙 This is pattern math, not surveillance. I don&apos;t store names or numbers.</p>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3 border border-gray-400 text-gray-300 hover:border-white hover:text-white transition-colors text-sm uppercase tracking-wider"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-xl mx-auto space-y-5 fade-up">
          <div className="text-xs text-gray-600 uppercase tracking-wider mb-4">
            Step 2 of 2 &mdash; The math
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Your age</label>
              <input
                type="number"
                value={form.yourAge}
                onChange={(e) => update('yourAge', Math.max(1, Math.min(120, parseInt(e.target.value) || 0)))}
                min={1}
                max={120}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Their age (estimate is fine)</label>
              <input
                type="number"
                value={form.theirAge}
                onChange={(e) => update('theirAge', Math.max(1, Math.min(120, parseInt(e.target.value) || 0)))}
                min={1}
                max={120}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>How often do you see or talk to them now?</label>
            <select
              value={form.frequency}
              onChange={(e) => update('frequency', e.target.value as ContactFrequency)}
              className={selectClass}
            >
              {Object.entries(frequencyLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 border border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-400 transition-colors text-sm"
            >
              Back
            </button>
            <button
              onClick={handleCalculate}
              className="flex-1 py-3 border border-gray-400 text-gray-300 hover:border-white hover:text-white transition-colors text-sm uppercase tracking-wider"
            >
              Show me the truth
            </button>
          </div>
        </div>
      )}

      {step === 3 && result && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress bar */}
          <div className="fade-up">
            <ProgressBar percent={result.percentDone} />
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-3 gap-3 fade-up fade-up-delay-1">
            <StatCard
              label="Meetings left"
              value={`~${result.meetingsLeft}`}
              sublabel="approximate"
              color="border-gray-700"
            />
            <StatCard
              label="Hours remaining"
              value={`~${result.hoursLeft}`}
              sublabel="total"
              color="border-gray-700"
            />
            <StatCard
              label="Years of silence"
              value={result.yearsOfSilence < 0.1 ? '<1mo' : result.yearsOfSilence < 1 ? `${Math.round(result.yearsOfSilence * 12)}mo` : `${result.yearsOfSilence}y`}
              sublabel="and counting"
              color="border-gray-700"
            />
          </div>

          {/* Poetic stat */}
          <div className="border border-white/20 bg-white/[0.03] p-5 fade-up fade-up-delay-2">
            <p className="text-white text-base leading-relaxed">{result.poeticStat}</p>
          </div>

          {/* Comparison */}
          <div className="border border-yellow-900/40 bg-black/40 p-5 fade-up fade-up-delay-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📱</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">For perspective</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{result.comparisonStat}</p>
          </div>

          {/* WIZ comment */}
          <div className="border border-gray-800 bg-gray-900/30 p-5 fade-up fade-up-delay-4">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">🧙</span>
              <div>
                <p className="text-gray-300 text-sm leading-relaxed italic">&ldquo;{result.wizComment}&rdquo;</p>
              </div>
            </div>
          </div>

          {/* Epitaph */}
          <div className="border border-gray-800 bg-black/60 p-6 text-center fade-up fade-up-delay-5">
            <div className="text-3xl mb-3 pulse-dim">🪦</div>
            <p className="text-gray-400 text-sm leading-relaxed italic max-w-md mx-auto">
              {result.epitaph}
            </p>
          </div>

          {/* Closing thought */}
          <div className="border border-gray-800 bg-gray-900/20 p-4 fade-up fade-up-delay-6">
            <p className="text-gray-500 text-xs leading-relaxed text-center">
              This isn&apos;t meant to make you sad. It&apos;s meant to make you text them.
              <br />
              The best response to this experiment is to close it and reach out.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 fade-up fade-up-delay-6">
            <button
              onClick={handleReset}
              className="flex-1 py-2.5 border border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-400 transition-colors text-sm"
            >
              Think of someone else
            </button>
            <button
              onClick={copyResults}
              className="flex-1 py-2.5 border border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-300 transition-colors text-sm"
            >
              Copy results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

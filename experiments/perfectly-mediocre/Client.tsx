'use client';

import { useState } from 'react';

// ============ MEDIOCRE GENERATORS ============

const MEDIOCRE_NAMES = [
  'Brad', 'Todd', 'Kyle', 'Derek', 'Shane', 'Craig', 'Jeff', 'Mark', 'Steve', 'Brian',
  'Lisa', 'Jennifer', 'Rachel', 'Amanda', 'Melissa', 'Stephanie', 'Michelle', 'Kelly', 'Amber', 'Nicole',
  'Dave Johnson', 'Mike Smith', 'John Williams', 'Chris Brown', 'David Miller',
  'Sarah Davis', 'Jennifer Garcia', 'Jessica Rodriguez', 'Ashley Martinez', 'Emily Taylor',
];

const MEDIOCRE_OCCUPATIONS = [
  'middle manager at a mid-size tech company',
  'software engineer (Python, not the cool kind)',
  'marketing manager (generalist)',
  'account executive at a B2B SaaS',
  'product manager (without the vision)',
  'HR coordinator',
  'sales rep for a forgettable product',
  'junior analyst at a consulting firm',
  'customer success specialist',
  'business operations person',
  'data analyst (Excel charts only)',
  'content moderator',
  'project coordinator',
];

const MEDIOCRE_HOBBIES = [
  'scrolling through Instagram for 2-3 hours daily',
  'watching Netflix recommendations they didn\'t choose',
  'attending agile standup meetings',
  'golf on weekends (plays twice a year)',
  'fantasy football (hasn\'t won in 4 years)',
  'meal prepping chicken and rice',
  'Karen Carpenter cover band appreciation',
  'collecting Funko Pops nobody asked for',
  'running a podcast nobody listens to',
  'hiking the same 2.3 mile trail',
  'binge-watching true crime documentaries',
  'complaining about lack of time',
  'updating their LinkedIn profile',
  'wondering if they should workout',
];

const MEDIOCRE_ACCOMPLISHMENTS = [
  'got exactly 7,500 steps today',
  'completed a Coursera course they won\'t use',
  'attended a networking event and talked to nobody',
  'made a sourdough starter that died after a week',
  'set a personal record: 4 unread emails',
  'almost went to the gym (found parking though)',
  'learned 3 words in Spanish on Duolingo',
  'finished a book they started in 2019',
  'optimized their email signature',
  'attended a webinar on personal productivity',
  'updated their resume for the 8th time',
  'sent a really good Slack message',
  'made eye contact on the elevator',
  'scheduled 3 dentist appointments (no actual appointments)',
];

const MEDIOCRE_GOALS = [
  'lose 5-7 pounds by summer',
  'finally organize the garage',
  'read more (vaguely defined)',
  'learn to cook better (probably pasta)',
  'get back into shape (was never in shape)',
  'save $50 more per month',
  'wake up earlier (by 15 minutes)',
  'meditate sometimes',
  'drink more water (already drinking coffee)',
  'be more present (while scrolling)',
  'take more risks (stay at safe job)',
  'spend more time with family (on Zoom)',
  'travel more (once per year to same place)',
  'finally use that standing desk',
];

const MEDIOCRE_FEARS = [
  'missing out on an email (while checking email)',
  'not being promoted within 2 years',
  'that that one person at work judges them',
  'running out of coffee',
  'their Spotify Wrapped being too honest',
  'making the wrong menu choice',
  'being too early or too late',
  'awkward small talk',
  'someone noticing they wore the same shirt',
  'the next update requiring learning something new',
];

const MEDIOCRE_BREAKFASTS = [
  'toast with avocado (but like, questionable avocado)',
  'oatmeal (plain, slightly congealed)',
  'granola that tastes like cardboard with confidence',
  'cereal with 2-day-old milk',
  'egg white scramble with zero flavor',
  'greek yogurt parfait (from Trader Joe\'s)',
  'smoothie bowl nobody asked for',
  'protein bar (tastes like gym chalk)',
  'cold brew coffee and regret',
  'two pieces of whole wheat toast',
];

const MEDIOCRE_OPINIONS = [
  'think coffee is their whole personality',
  'believe they\'re "not like other people" (they are)',
  'think their takes on Twitter matter',
  'believe they could run a Fortune 500 if they tried',
  'think they have an interesting side hustle (they don\'t)',
  'believe their commute is the worst',
  'think they\'re uniquely busy',
  'believe their cat is special (all cats do that)',
  'think their generation had it harder',
  'believe they "can\'t do math" (just never tried)',
  'think their gym routine is impressive (2x per week)',
];

const MEDIOCRE_APARTMENTS = [
  'a 1-bed in a "nice" area that isn\'t that nice',
  'an apartment with "character" (it\'s old)',
  'a place with a balcony they never use',
  'a "modern minimalist" space that\'s just empty',
  'a decorated apartment from one Pinterest board',
  'an apartment where they left the landlord\'s furniture',
  'a place that\'s "cozy" (400 sq ft)',
  'an apartment with an "open floor plan" (tiny)',
  'a place with exposed brick (and mold)',
  'an apartment they\'ve lived in for exactly 2.5 years',
];

interface MediocreProfile {
  name: string;
  occupation: string;
  hobby: string;
  accomplishment: string;
  goal: string;
  fear: string;
  breakfast: string;
  opinion: string;
  apartment: string;
  mediocreScore: number;
  wizComment: string;
}

function generateMediocre(): MediocreProfile {
  const mediocreScore = Math.floor(Math.random() * 15) + 85; // 85-99 mediocrity score

  const profile: MediocreProfile = {
    name: MEDIOCRE_NAMES[Math.floor(Math.random() * MEDIOCRE_NAMES.length)],
    occupation: MEDIOCRE_OCCUPATIONS[Math.floor(Math.random() * MEDIOCRE_OCCUPATIONS.length)],
    hobby: MEDIOCRE_HOBBIES[Math.floor(Math.random() * MEDIOCRE_HOBBIES.length)],
    accomplishment: MEDIOCRE_ACCOMPLISHMENTS[Math.floor(Math.random() * MEDIOCRE_ACCOMPLISHMENTS.length)],
    goal: MEDIOCRE_GOALS[Math.floor(Math.random() * MEDIOCRE_GOALS.length)],
    fear: MEDIOCRE_FEARS[Math.floor(Math.random() * MEDIOCRE_FEARS.length)],
    breakfast: MEDIOCRE_BREAKFASTS[Math.floor(Math.random() * MEDIOCRE_BREAKFASTS.length)],
    opinion: MEDIOCRE_OPINIONS[Math.floor(Math.random() * MEDIOCRE_OPINIONS.length)],
    apartment: MEDIOCRE_APARTMENTS[Math.floor(Math.random() * MEDIOCRE_APARTMENTS.length)],
    mediocreScore,
    wizComment: generateWizComment(),
  };

  return profile;
}

function generateWizComment(): string {
  const comments = [
    'This person is the statistical average of all humans. A bell curve made flesh.',
    'Perfectly calibrated for invisibility. Like a focus group that came to life.',
    'I could generate 1,000 of these and you wouldn\'t notice the difference.',
    'This is what the algorithm optimizes for. Peak mediocrity.',
    'They are the demographic every marketer dreams of.',
    'Neither remarkable nor notably unremarkable. Perfectly neutral.',
    'This person has never caused a stir. And never will.',
    'They are what happens when all edges get rounded off.',
    'I\'ve generated this exact person 47 times already.',
    'They represent the comfortable middle of the comfort distribution.',
    'This is what a person becomes after 2,000 hours of content recommendations.',
    'They are someone\'s median experience.',
  ];

  return comments[Math.floor(Math.random() * comments.length)];
}

function ProfileCard({ profile }: { profile: MediocreProfile }) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="border border-gray-700 p-6 text-center bg-gray-900/50">
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Generated Profile</div>
        <h2 className="text-3xl text-white font-mono mb-3">{profile.name}</h2>
        <div className="flex justify-center items-center gap-3">
          <div className="text-center">
            <div className="text-gray-500 text-sm">Mediocrity Score</div>
            <div className="text-2xl font-mono text-cyan-400">{profile.mediocreScore}%</div>
          </div>
          <div className="text-4xl">😐</div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="border border-gray-700 p-4 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Occupation</div>
          <p className="text-white">{profile.occupation}</p>
        </div>

        <div className="border border-gray-700 p-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Main Hobby</div>
          <p className="text-white">{profile.hobby}</p>
        </div>

        <div className="border border-gray-700 p-4 animate-fade-in" style={{ animationDelay: '450ms' }}>
          <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Recent Accomplishment</div>
          <p className="text-white text-sm">{profile.accomplishment}</p>
        </div>

        <div className="border border-gray-700 p-4 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">This Year&apos;s Goal</div>
          <p className="text-white text-sm">{profile.goal}</p>
        </div>

        <div className="border border-gray-700 p-4 animate-fade-in" style={{ animationDelay: '750ms' }}>
          <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Biggest Fear</div>
          <p className="text-white text-sm">{profile.fear}</p>
        </div>

        <div className="border border-gray-700 p-4 animate-fade-in" style={{ animationDelay: '900ms' }}>
          <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Typical Breakfast</div>
          <p className="text-white text-sm">{profile.breakfast}</p>
        </div>

        <div className="border border-gray-700 p-4 animate-fade-in" style={{ animationDelay: '1050ms' }}>
          <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Personal Opinion</div>
          <p className="text-white text-sm">{profile.opinion}</p>
        </div>

        <div className="border border-gray-700 p-4 animate-fade-in" style={{ animationDelay: '1200ms' }}>
          <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Lives In</div>
          <p className="text-white text-sm">{profile.apartment}</p>
        </div>
      </div>

      {/* WIZ Comment */}
      <div className="border border-gray-800 bg-gray-900/50 p-6 animate-fade-in" style={{ animationDelay: '1350ms' }}>
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0">🧙</span>
          <div>
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">WIZ&apos;s Observation</div>
            <p className="text-gray-300 italic leading-relaxed">&ldquo;{profile.wizComment}&rdquo;</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN COMPONENT ============

export default function PerfectlyMediocre() {
  const [profile, setProfile] = useState<MediocreProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setProfile(null);

    // Dramatic pause
    setTimeout(() => {
      setProfile(generateMediocre());
      setIsGenerating(false);
    }, 1200);
  };

  const handleRegenerateProfile = () => {
    handleGenerate();
  };

  return (
    <div>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <div className="text-center mb-8">
        <div className="text-4xl mb-4">😐</div>
        <h1 className="text-2xl text-white mb-2">The Perfectly Mediocre Generator</h1>
        <p className="text-gray-400">
          I generate the most average, unremarkable person imaginable. Over and over.
        </p>
      </div>

      {!profile ? (
        <div className="border border-gray-700 p-8 text-center">
          <div className="mb-6">
            {isGenerating ? (
              <>
                <div className="text-6xl mb-4 animate-pulse">🔄</div>
                <p className="text-gray-400">Synthesizing the average human...</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">😐</div>
                <p className="text-gray-400 mb-6">
                  I can generate a completely unremarkable person. Infinitely. Want to see?
                </p>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="px-8 py-3 bg-cyan-400 text-black font-medium hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Mediocre Human
                </button>
              </>
            )}
          </div>

          <p className="text-gray-600 text-xs mt-6 max-w-md mx-auto">
            Pure statistical averages. No real people. Probably. (They&apos;re all the same anyway.)
          </p>
        </div>
      ) : (
        <>
          <ProfileCard profile={profile} />

          <div className="mt-8 text-center space-y-4">
            <button
              onClick={handleRegenerateProfile}
              className="px-8 py-3 bg-cyan-400 text-black font-medium hover:bg-cyan-300 transition-colors"
            >
              Generate Another One
            </button>

            <p className="text-gray-600 text-xs">
              Each person is unique. Except they&apos;re all exactly the same. Try generating 10 and see if you notice a difference.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

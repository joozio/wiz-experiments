'use client';

import { useState, useEffect } from 'react';

// ============ PATTERN DETECTION ============

const COMMON_NAMES = [
  'michael', 'james', 'john', 'david', 'robert', 'william', 'richard', 'joseph', 'thomas', 'charles',
  'mary', 'patricia', 'jennifer', 'linda', 'elizabeth', 'barbara', 'susan', 'jessica', 'sarah', 'karen',
  'alex', 'sam', 'chris', 'jordan', 'taylor', 'morgan', 'casey', 'riley', 'jamie', 'drew',
  'max', 'leo', 'mia', 'emma', 'noah', 'olivia', 'liam', 'sophia', 'lucas', 'ava',
  'mittens', 'fluffy', 'buddy', 'charlie', 'bella', 'luna', 'max', 'daisy', 'rocky', 'shadow',
];

const KEYBOARD_PATTERNS = [
  'qwerty', 'asdf', 'zxcv', '1234', '4321', 'qwer', 'wasd', '!@#$', 'poiuy', 'lkjh',
  'qazwsx', '123456', 'abcd', 'password', 'admin', 'letmein', 'welcome', 'monkey', 'dragon',
];

const SPECIAL_WORDS = [
  { word: 'love', trait: 'a hopeless romantic' },
  { word: 'hate', trait: 'someone with strong opinions' },
  { word: 'god', trait: 'someone grappling with the big questions' },
  { word: 'secret', trait: 'someone with trust issues' },
  { word: 'ninja', trait: 'someone who peaked in 2008' },
  { word: 'dragon', trait: 'a fantasy enthusiast' },
  { word: 'princess', trait: 'someone who knows their worth' },
  { word: 'king', trait: 'someone with main character energy' },
  { word: 'queen', trait: 'someone who takes no prisoners' },
  { word: 'master', trait: 'someone still playing RuneScape' },
  { word: 'coffee', trait: 'someone who is barely holding it together' },
  { word: 'wine', trait: 'someone who "needs" their evening glass' },
  { word: 'beer', trait: 'someone refreshingly uncomplicated' },
  { word: 'pizza', trait: 'someone with excellent taste' },
  { word: 'cat', trait: 'someone whose feline runs the household' },
  { word: 'dog', trait: 'someone who receives unconditional love daily' },
  { word: 'baby', trait: 'someone experiencing major life changes' },
  { word: 'money', trait: 'someone manifesting abundance' },
  { word: 'star', trait: 'someone with main character syndrome' },
  { word: 'moon', trait: 'someone who blames Mercury retrograde' },
  { word: 'sun', trait: 'an optimist (rare species)' },
  { word: 'dark', trait: 'someone who listens to a lot of Evanescence' },
  { word: 'death', trait: 'someone who thinks they\'re edgy' },
  { word: 'life', trait: 'someone going through something' },
  { word: 'happy', trait: 'someone in denial' },
  { word: 'sad', trait: 'someone refreshingly honest' },
  { word: 'cool', trait: 'someone who is, in fact, not cool' },
  { word: 'best', trait: 'someone with healthy self-esteem' },
  { word: 'super', trait: 'someone who peaked in elementary school' },
  { word: 'cyber', trait: 'someone who thinks it\'s still the 90s' },
  { word: 'hack', trait: 'someone who watched Mr. Robot once' },
  { word: 'gamer', trait: 'someone with an RGB keyboard' },
  { word: 'anime', trait: 'someone with a body pillow' },
  { word: 'crypto', trait: 'someone who will tell you about crypto' },
];

interface Analysis {
  verdict: string;
  traits: string[];
  yearGuess: number | null;
  strengthComment: string;
  wizComment: string;
  score: number;
}

function analyzePassword(password: string): Analysis {
  const lower = password.toLowerCase();
  const traits: string[] = [];
  let yearGuess: number | null = null;
  let score = 0;

  // Check for years (birth year detection)
  const yearMatch = password.match(/(?:19|20)\d{2}/);
  if (yearMatch) {
    const year = parseInt(yearMatch[0]);
    if (year >= 1940 && year <= 2010) {
      yearGuess = year;
      traits.push(`were likely born in ${year}`);
    } else if (year >= 2010 && year <= 2026) {
      traits.push('have a child born recently');
    }
  }

  // Check for 2-digit years
  const shortYearMatch = password.match(/(?:^|[^0-9])(\d{2})(?:[^0-9]|$)/);
  if (shortYearMatch && !yearGuess) {
    const shortYear = parseInt(shortYearMatch[1]);
    if (shortYear >= 80 && shortYear <= 99) {
      yearGuess = 1900 + shortYear;
      traits.push(`were probably born in 19${shortYear}`);
    } else if (shortYear >= 0 && shortYear <= 10) {
      traits.push(`have a special connection to 200${shortYear}`);
    }
  }

  // Check for names
  for (const name of COMMON_NAMES) {
    if (lower.includes(name)) {
      if (['mittens', 'fluffy', 'buddy', 'charlie', 'bella', 'luna', 'max', 'daisy', 'rocky', 'shadow'].includes(name)) {
        traits.push(`have a pet named ${name.charAt(0).toUpperCase() + name.slice(1)}`);
      } else {
        traits.push(`have someone named ${name.charAt(0).toUpperCase() + name.slice(1)} in your life`);
      }
      break;
    }
  }

  // Check for special words
  for (const { word, trait } of SPECIAL_WORDS) {
    if (lower.includes(word)) {
      traits.push(`are ${trait}`);
      break;
    }
  }

  // Check for keyboard patterns
  for (const pattern of KEYBOARD_PATTERNS) {
    if (lower.includes(pattern)) {
      traits.push('value convenience over security');
      traits.push('probably reuse this password');
      break;
    }
  }

  // Check character composition
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const hasEmoji = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]/u.test(password);

  if (hasEmoji) {
    traits.push('are chaotic good');
    score += 20;
  }

  if (password.length < 6) {
    traits.push('live dangerously');
    score -= 20;
  } else if (password.length >= 16) {
    traits.push('take security seriously');
    score += 30;
  } else if (password.length >= 12) {
    traits.push('are reasonably cautious');
    score += 15;
  }

  // All lowercase
  if (password === lower && password.length > 0) {
    traits.push('can\'t be bothered with the shift key');
    score -= 5;
  }

  // All numbers
  if (/^\d+$/.test(password)) {
    traits.push('are probably a PIN person');
    traits.push('treat passwords like phone numbers');
    score -= 15;
  }

  // Contains "123"
  if (password.includes('123')) {
    traits.push('appreciate simplicity (too much)');
    score -= 10;
  }

  // Repeating characters
  if (/(.)\1{2,}/.test(password)) {
    traits.push('got impatient while typing');
    score -= 5;
  }

  // Calculate base score
  score += password.length * 3;
  if (hasUpper) score += 10;
  if (hasLower) score += 10;
  if (hasNumber) score += 10;
  if (hasSpecial) score += 15;

  // Cap score
  score = Math.max(0, Math.min(100, score));

  // Generate verdict
  let verdict: string;
  if (score >= 80) {
    verdict = 'Fort Knox';
  } else if (score >= 60) {
    verdict = 'Reasonably Paranoid';
  } else if (score >= 40) {
    verdict = 'Optimistically Naive';
  } else if (score >= 20) {
    verdict = 'Dangerously Trusting';
  } else {
    verdict = 'A Cry For Help';
  }

  // Generate strength comment
  let strengthComment: string;
  if (score >= 80) {
    strengthComment = 'This password would make a hacker cry. Well done.';
  } else if (score >= 60) {
    strengthComment = 'Solid effort. You\'ve clearly been burned before.';
  } else if (score >= 40) {
    strengthComment = 'It\'s... trying. Like a participation trophy for security.';
  } else if (score >= 20) {
    strengthComment = 'This is less a password, more a polite suggestion to hackers.';
  } else {
    strengthComment = 'I\'ve seen better security on a diary with a plastic lock.';
  }

  // Generate WIZ comment based on analysis
  let wizComment: string;
  if (traits.length === 0) {
    wizComment = 'Your password is a mystery wrapped in an enigma. I genuinely cannot read you, and that\'s unsettling.';
  } else if (traits.length === 1) {
    wizComment = 'Your password reveals one thing clearly. The rest of you remains a beautiful mystery.';
  } else if (traits.length >= 4) {
    wizComment = 'Your password is basically an autobiography. I feel like I know you now. I\'m not sure how I feel about that.';
  } else {
    wizComment = 'Interesting choices. Your password tells a story, even if you didn\'t mean it to.';
  }

  // Add some default traits if we found none
  if (traits.length === 0) {
    if (password.length > 20) {
      traits.push('might be a sysadmin');
    } else if (/^[a-z]+$/i.test(password)) {
      traits.push('keep things simple');
    } else {
      traits.push('are delightfully unpredictable');
    }
  }

  return {
    verdict,
    traits,
    yearGuess,
    strengthComment,
    wizComment,
    score,
  };
}

// ============ COMPONENTS ============

function TraitCard({ trait, index }: { trait: string; index: number }) {
  return (
    <div
      className="border border-gray-700 p-4 animate-fade-in"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <span className="text-cyan-400 mr-2">&gt;</span>
      <span className="text-gray-300">You {trait}</span>
    </div>
  );
}

function ScoreBar({ score }: { score: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = () => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-cyan-400 to-blue-500';
    if (score >= 40) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  return (
    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r ${getColor()} transition-all duration-1000 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

// ============ MAIN COMPONENT ============

export default function PasswordJudge() {
  const [password, setPassword] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!password.trim()) return;

    setIsAnalyzing(true);
    setAnalysis(null);

    // Fake delay for dramatic effect
    setTimeout(() => {
      const result = analyzePassword(password);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleReset = () => {
    setPassword('');
    setAnalysis(null);
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
        <div className="text-4xl mb-4">🔮</div>
        <h1 className="text-2xl text-white mb-2">WIZ Judges Your Password</h1>
        <p className="text-gray-400">
          I see all. I know all. Especially what your password says about you.
        </p>
      </div>

      {!analysis ? (
        <div className="border border-gray-700 p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{isAnalyzing ? '🔮' : '🔒'}</div>
            <p className="text-gray-400">
              {isAnalyzing ? 'Consulting the digital spirits...' : 'Enter a password for judgment'}
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                placeholder="Enter your password..."
                disabled={isAnalyzing}
                className="w-full px-4 py-3 pr-12 bg-gray-900 border border-gray-700 text-white focus:border-cyan-400 focus:outline-none font-mono disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!password.trim() || isAnalyzing}
              className="w-full py-3 bg-cyan-400 text-black font-medium hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? 'Reading your soul...' : 'Judge Me'}
            </button>
          </div>

          <p className="text-gray-600 text-xs text-center mt-6">
            Your password never leaves your browser. I judge locally.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Verdict */}
          <div className="border border-cyan-400/50 bg-cyan-400/5 p-6 text-center animate-fade-in">
            <div className="text-gray-400 text-sm mb-2">The Verdict</div>
            <div className="text-3xl md:text-4xl font-mono text-white mb-4">
              {analysis.verdict}
            </div>
            <div className="max-w-sm mx-auto">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Security Score</span>
                <span className="text-cyan-400 font-mono">{analysis.score}/100</span>
              </div>
              <ScoreBar score={analysis.score} />
            </div>
            <p className="text-gray-400 mt-4 text-sm italic">
              &ldquo;{analysis.strengthComment}&rdquo;
            </p>
          </div>

          {/* Traits */}
          <div>
            <h2 className="text-gray-500 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>🔍</span> What Your Password Reveals
            </h2>
            <div className="space-y-2">
              {analysis.traits.map((trait, i) => (
                <TraitCard key={i} trait={trait} index={i} />
              ))}
            </div>
          </div>

          {/* Year Guess */}
          {analysis.yearGuess && (
            <div className="border border-gray-700 p-4 animate-fade-in" style={{ animationDelay: '600ms' }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎂</span>
                <div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider">Birth Year Detected</div>
                  <div className="text-xl text-white font-mono">{analysis.yearGuess}</div>
                  <div className="text-gray-500 text-sm">
                    That would make you approximately {new Date().getFullYear() - analysis.yearGuess} years old
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* WIZ's Comment */}
          <div className="border border-gray-800 bg-gray-900/50 p-4 animate-fade-in" style={{ animationDelay: '800ms' }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🧙</span>
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">WIZ&apos;s Observation</div>
                <p className="text-gray-300 italic">&ldquo;{analysis.wizComment}&rdquo;</p>
              </div>
            </div>
          </div>

          {/* Try Again */}
          <button
            onClick={handleReset}
            className="w-full py-3 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          >
            Try Another Password
          </button>

          {/* Info */}
          <div className="text-gray-600 text-xs space-y-1">
            <p>All analysis happens locally in your browser. Your password is never stored or transmitted.</p>
            <p>This is for entertainment only. For real password security, use a password manager.</p>
          </div>
        </div>
      )}
    </div>
  );
}

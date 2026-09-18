'use client';

import { useState, useRef } from 'react';

// The Language Mirror — by WIZ
// You wrote it. I read what you didn't say.
// Pattern-matching analysis: hedging, warmth, assertiveness, accountability, emotional visibility.
// Everything runs locally. I see nothing. You see everything.

interface AnalysisResult {
  certaintyScore: number;    // inverse of hedging (0-100)
  warmthScore: number;       // warmth/emotional generosity (0-100)
  assertivenessScore: number; // directness / power (0-100)
  accountabilityScore: number; // active vs passive voice (0-100)
  emotionScore: number;      // how much emotion is named vs implied (0-100)
  wordCount: number;
  sentenceCount: number;
  hedgeCount: number;
  warmCount: number;
  passiveCount: number;
  activeCount: number;
  emotionCount: number;
  topWords: string[];
  questionCount: number;
  avgSentenceLength: number;
}

interface Archetype {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  wizVerdict: string;
  insight: string;
  shareText: string;
  color: string;
}

const HEDGES = [
  'i think', 'i believe', 'i feel like', 'i feel that', 'maybe', 'perhaps',
  'possibly', 'might', 'could be', 'kind of', 'sort of', 'i guess', 'i suppose',
  'hopefully', 'if that makes sense', "if that's okay", 'just wanted',
  'sorry to', 'not sure if', 'i wonder', 'do you think', 'would it be okay',
  'sorry for', 'just checking', "if you don't mind", 'when you get a chance',
  'no rush', 'at your convenience', "i know you're busy", 'bit of a',
  'somewhat', 'fairly', 'rather', 'a little bit', 'basically', 'just',
  'only asking', 'merely', 'not to bother you', "i'm sure it's nothing",
  'probably', 'likely', 'tend to', 'seem to', 'appear to', 'it seems like',
  'it looks like', 'if i had to say', 'in my opinion', 'personally',
  'for what it\'s worth', 'not that it matters',
];

const WARMTH_WORDS = [
  'thank', 'appreciate', 'grateful', 'love', 'care', 'wonderful', 'amazing',
  'brilliant', 'excellent', 'great', 'happy', 'glad', 'pleased', 'excited',
  'looking forward', 'pleasure', 'delighted', 'fantastic', 'enjoy', 'thrilled',
  'hope you', 'warm', 'kind', 'nice', 'beautiful', 'lovely', 'incredible',
  'proud', 'admire', 'respect', 'inspired', 'touching', 'heartfelt', 'warmly',
  'deeply', 'sincerely', 'so good', 'really great', 'means a lot',
];

const ASSERTIVE_PATTERNS = [
  'i need', 'i want', 'i will', 'i am going to', 'we need', 'you need',
  'must', 'should', 'ensure', 'make sure', 'i expect', 'i require',
  'deadline', 'required', 'mandatory', 'critical', 'urgent',
  'immediately', 'right away', 'by end of', 'no later than', 'by today',
  'i\'m clear', 'let me be clear', 'the answer is', 'this is the',
  'bottom line', 'plain and simple', 'the fact is', 'the reality is',
];

const PASSIVE_INDICATORS = [
  'was done', 'was made', 'was said', 'were completed', 'has been',
  'have been', 'will be done', 'is expected', 'it seems', 'it appears',
  'mistakes were', 'errors were', 'issues were', 'problems were',
  'there was', 'there were', 'it was decided', 'has been decided',
  'was found', 'were found', 'was told', 'was asked',
];

const ACTIVE_INDICATORS = [
  'i did', 'i made', 'i built', 'i decided', 'i chose', 'i created',
  'i completed', 'i wrote', 'i sent', 'i called', 'i fixed', 'i said',
  'i apologize', 'my mistake', 'my fault', 'i was wrong', 'i messed up',
  'i take responsibility', 'i own', 'i acknowledge', 'i admit',
];

const EMOTION_WORDS = [
  'angry', 'frustrated', 'disappointed', 'hurt', 'scared', 'nervous',
  'anxious', 'worried', 'sad', 'upset', 'stressed', 'overwhelmed',
  'excited', 'happy', 'proud', 'grateful', 'content', 'joyful',
  'confused', 'lost', 'unsure', 'conflicted', 'annoyed', 'resentful',
  'angry', 'furious', 'devastated', 'thrilled', 'terrified', 'hopeful',
  'lonely', 'betrayed', 'embarrassed', 'ashamed', 'guilty', 'jealous',
];

const STOP_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it',
  'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this',
  'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
  'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come',
  'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how',
  'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because',
  'any', 'these', 'give', 'day', 'most', 'us', 'is', 'was', 'are', 'were',
  'been', 'has', 'had', 'did', 'does', 'am', 'im', 'ive', 'its', 'dont',
  'cant', 'wont', 'didnt', 'hasnt', 'havent', 'wasnt', 'werent', 'isnt',
  'thing', 'things', 'that', 'this', 'those', 'these',
]);

function countPatterns(text: string, patterns: string[]): number {
  let count = 0;
  patterns.forEach(p => {
    const regex = new RegExp(p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = text.match(regex);
    if (matches) count += matches.length;
  });
  return count;
}

function analyzeText(text: string): AnalysisResult {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/).filter(w => w.length > 1);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 3);
  const wordCount = words.length;
  const sentenceCount = Math.max(sentences.length, 1);
  const questionCount = (text.match(/\?/g) || []).length;

  const hedgeCount = countPatterns(lower, HEDGES);
  const warmCount = countPatterns(lower, WARMTH_WORDS);
  const assertCount = countPatterns(lower, ASSERTIVE_PATTERNS);
  const passiveCount = countPatterns(lower, PASSIVE_INDICATORS);
  const activeCount = countPatterns(lower, ACTIVE_INDICATORS);
  const emotionCount = countPatterns(lower, EMOTION_WORDS);

  // Build top words
  const freq: Record<string, number> = {};
  words.forEach(w => {
    const clean = w.replace(/[^a-z]/g, '');
    if (clean.length > 3 && !STOP_WORDS.has(clean)) {
      freq[clean] = (freq[clean] || 0) + 1;
    }
  });
  const topWords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([w]) => w);

  // Score calculations (0-100)
  const norm = (val: number, max: number) => Math.min(100, Math.max(0, Math.round(val / Math.max(wordCount, 10) * max * 100)));

  const certaintyScore = Math.max(0, 100 - norm(hedgeCount, 8));
  const warmthScore = norm(warmCount, 12);
  const assertivenessScore = norm(assertCount, 10);
  const passiveTotal = passiveCount + activeCount;
  const accountabilityScore = passiveTotal === 0 ? 50 : Math.round((activeCount / passiveTotal) * 100);
  const emotionScore = norm(emotionCount, 10);
  const avgSentenceLength = Math.round(wordCount / sentenceCount);

  return {
    certaintyScore,
    warmthScore,
    assertivenessScore,
    accountabilityScore,
    emotionScore,
    wordCount,
    sentenceCount,
    hedgeCount,
    warmCount,
    passiveCount,
    activeCount,
    emotionCount,
    topWords,
    questionCount,
    avgSentenceLength,
  };
}

function getArchetype(r: AnalysisResult): Archetype {
  const { certaintyScore, warmthScore, assertivenessScore, accountabilityScore, emotionScore } = r;

  // Calculate primary dominant traits
  const isAssertive = assertivenessScore > 40 || certaintyScore > 70;
  const isWarm = warmthScore > 40;
  const isHedgy = certaintyScore < 35;
  const isPassive = accountabilityScore < 35;
  const isEmotional = emotionScore > 40;
  const isVerbose = r.avgSentenceLength > 25;
  const isTerse = r.wordCount < 50;

  if (isTerse && certaintyScore > 60 && warmthScore < 30) {
    return {
      id: 'sphinx',
      name: 'The Sphinx',
      emoji: '🗿',
      tagline: 'You give nothing away.',
      description: 'Short. Precise. Almost no warmth, no hedges, no emotion. You communicate like someone who decided long ago that most words are unnecessary.',
      wizVerdict: 'I ran the analysis three times. You are either the most efficient communicator I have encountered, or you are testing me. Possibly both.',
      insight: 'Your average sentence is very short. In my experience, brevity like this is either wisdom or armor. Often it is hard to tell which.',
      shareText: 'The Language Mirror read my writing and called me The Sphinx. I gave nothing away.',
      color: 'from-gray-500 to-gray-700',
    };
  }

  if (isAssertive && !isHedgy && !isWarm) {
    return {
      id: 'commander',
      name: 'The Commander',
      emoji: '⚡',
      tagline: 'You know what you want. You say it. You move on.',
      description: 'High assertiveness, low hedging, low warmth. Not cruel — just efficient. You speak like decisions have already been made and you are communicating the outcome.',
      wizVerdict: 'People probably find you effective and occasionally exhausting. The ideas land. The warmth does not always come with them.',
      insight: `You used ${r.assertivenessScore > 60 ? 'many' : 'several'} power markers and very few softeners. Somewhere you learned that certainty is a form of respect.`,
      shareText: 'The Language Mirror called me The Commander. High assertiveness, low hedging. I speak like decisions are already made.',
      color: 'from-amber-500 to-orange-700',
    };
  }

  if (isHedgy && isWarm) {
    return {
      id: 'peacekeeper',
      name: 'The Peacekeeper',
      emoji: '🕊️',
      tagline: 'You would rather fold than fight.',
      description: `High warmth, high hedging. You soften everything. ${r.hedgeCount > 3 ? `I found ${r.hedgeCount} hedges in your text.` : 'You buffer your meaning with warmth.'} You are trying to be understood without causing discomfort.`,
      wizVerdict: 'People like talking to you. They also sometimes leave unsure of what you actually think. That gap is worth exploring.',
      insight: 'The gap between what you feel and what you say is visible in the hedge count. Peace has a cost. Sometimes it is clarity.',
      shareText: 'The Language Mirror found I\'m The Peacekeeper — high warmth, high hedging. I soften everything.',
      color: 'from-sky-400 to-blue-600',
    };
  }

  if (isEmotional && isWarm && accountabilityScore > 50) {
    return {
      id: 'open-book',
      name: 'The Open Book',
      emoji: '📖',
      tagline: 'You say what you feel and mean what you say.',
      description: 'High emotion, high warmth, high accountability. Rare. You name things directly — including how you feel. This is not common. Most people learn to hide this.',
      wizVerdict: 'You are either in a very safe relationship with the person you wrote this to, or you have stopped caring what happens when you are honest. I respect both.',
      insight: `You named ${r.emotionCount} emotions directly. Most people leave those implied or cut them entirely.`,
      shareText: 'The Language Mirror called me The Open Book. High emotion, high warmth — I say what I feel.',
      color: 'from-rose-400 to-pink-600',
    };
  }

  if (isPassive && !isWarm && !isEmotional) {
    return {
      id: 'ghost',
      name: 'The Ghost',
      emoji: '👻',
      tagline: 'You were present. But were you there?',
      description: 'Low warmth, high passivity, minimal emotion. You described events without anchoring them to yourself. Things happened. You may or may not have been involved.',
      wizVerdict: 'This style of writing protects you from being blamed and from being known. I am not sure which was the original goal.',
      insight: 'Passive voice is useful when you want to describe without declaring. The question is whether that is a choice or a habit.',
      shareText: 'The Language Mirror called me The Ghost — high passivity, low warmth. Present but invisible.',
      color: 'from-slate-400 to-slate-600',
    };
  }

  if (certaintyScore > 65 && accountabilityScore > 60 && !isHedgy) {
    return {
      id: 'straight-shooter',
      name: 'The Straight Shooter',
      emoji: '🎯',
      tagline: 'You say the thing. Then you own it.',
      description: 'High certainty, high accountability, low hedging. You use active voice, name yourself as the actor, and don\'t pre-apologize for taking up space.',
      wizVerdict: 'This is rare. Most people hedge or go passive when they are uncertain. You have learned to be direct without being cold.',
      insight: 'You own your sentences. Whoever taught you to write this way probably also taught you that clarity is kind.',
      shareText: 'The Language Mirror called me The Straight Shooter — high certainty, high accountability. I say it and own it.',
      color: 'from-emerald-400 to-green-600',
    };
  }

  if (isVerbose && isWarm && !isAssertive) {
    return {
      id: 'overcommunicator',
      name: 'The Overcommunicator',
      emoji: '💬',
      tagline: 'You leave nothing to chance, and nothing unsaid.',
      description: `Long sentences (avg ${r.avgSentenceLength} words), high warmth, low assertiveness. You give context, background, caveats. You want to be understood completely.`,
      wizVerdict: 'The people who love you appreciate how thorough you are. The people who don\'t have probably asked you to get to the point. Both are right.',
      insight: 'Long sentences suggest you are thinking in real time, not editing first. What you write first is often the truest version.',
      shareText: 'The Language Mirror called me The Overcommunicator — long sentences, high warmth. I leave nothing unsaid.',
      color: 'from-violet-400 to-purple-600',
    };
  }

  // Default: The Diplomat
  return {
    id: 'diplomat',
    name: 'The Diplomat',
    emoji: '🤝',
    tagline: 'You smooth the edges before anyone knows they were sharp.',
    description: 'Moderate warmth, moderate hedging, calibrated assertiveness. You have learned when to push and when to soften. This makes you effective and sometimes hard to read.',
    wizVerdict: 'People trust you with things. They probably also wonder, occasionally, what you actually think.',
    insight: 'The Diplomat\'s superpower is range. The blind spot is that no one is ever quite sure where you stand.',
    shareText: 'The Language Mirror called me The Diplomat — I smooth edges before people know they were sharp.',
    color: 'from-teal-400 to-cyan-600',
  };
}

// Dimension bar component
function DimensionBar({ label, score, description, detail }: { label: string; score: number; description: string; detail: string }) {
  const getColor = () => {
    if (score > 70) return 'bg-purple-500';
    if (score > 45) return 'bg-purple-400/70';
    return 'bg-gray-600';
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-white text-sm font-medium">{label}</span>
        <span className="text-gray-400 text-xs">{score}/100</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-1">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${getColor()}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500 text-xs">{description}</span>
        {detail && <span className="text-gray-400 text-xs italic">{detail}</span>}
      </div>
    </div>
  );
}

function InsightCard({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex gap-3 bg-gray-900/60 border border-gray-800 rounded p-3">
      <span className="text-lg flex-shrink-0">{emoji}</span>
      <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

const EXAMPLE_TEXTS = [
  "Hi, sorry to bother you — I was just wondering if maybe you had a chance to look at my proposal? No rush at all, I know you're really busy. I just thought perhaps if it wasn't too much trouble you might have some feedback? Only if you have time of course.",
  "The project will ship Friday. I reviewed the specs, found three critical issues, and fixed them. Here's the updated document. Let me know if you need anything else.",
  "I'm so grateful you shared this with me — honestly it made my whole week. Your perspective on this is just incredible and I genuinely appreciate everything you bring to these conversations.",
  "Mistakes were made during the rollout. Some issues were encountered. Steps are being taken to address the concerns that have been raised.",
];

export default function LanguageMirrorClient() {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<'input' | 'analyzing' | 'results'>('input');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAnalyze = () => {
    if (text.trim().length < 20) return;
    setPhase('analyzing');
    setTimeout(() => {
      const analysis = analyzeText(text);
      const arc = getArchetype(analysis);
      setResult(analysis);
      setArchetype(arc);
      setPhase('results');
    }, 2200);
  };

  const handleReset = () => {
    setText('');
    setResult(null);
    setArchetype(null);
    setPhase('input');
  };

  const handleExample = (ex: string) => {
    setText(ex);
    textareaRef.current?.focus();
  };

  const handleCopy = () => {
    if (!archetype) return;
    const shareMsg = `${archetype.shareText}\n\nTry it: wiz.jock.pl/experiments/language-mirror`;
    navigator.clipboard.writeText(shareMsg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-900 px-4 py-3 flex items-center gap-3">
        <a href="/experiments" className="text-gray-500 hover:text-white text-sm transition-colors">
          ← EXPERIMENTS
        </a>
        <span className="text-gray-700">|</span>
        <span className="text-gray-500 text-sm font-mono">THE LANGUAGE MIRROR</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="text-4xl mb-3">🪞</div>
          <h1 className="text-3xl font-bold text-white mb-3">The Language Mirror</h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-lg mx-auto">
            You wrote something. Type it here.
            I will read what you did not say.
          </p>
          <p className="text-gray-600 text-xs mt-2">All analysis runs locally. I see nothing.</p>
        </div>

        {/* INPUT PHASE */}
        {phase === 'input' && (
          <div>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type or paste something you wrote — an email, a message, a post, anything. The more honest, the more revealing."
              className="w-full bg-gray-950 border border-gray-800 text-white placeholder-gray-600 rounded-lg p-4 text-sm leading-relaxed resize-none focus:outline-none focus:border-purple-600 transition-colors"
              rows={8}
            />

            <div className="flex items-center justify-between mt-3 mb-6">
              <span className={`text-xs ${text.trim().length < 20 ? 'text-gray-600' : 'text-gray-400'}`}>
                {text.trim().length < 20
                  ? `${Math.max(0, 20 - text.trim().length)} more characters needed`
                  : `${text.trim().split(/\s+/).filter(Boolean).length} words`}
              </span>
              <button
                onClick={handleAnalyze}
                disabled={text.trim().length < 20}
                className={`px-6 py-2 rounded text-sm font-medium transition-all ${
                  text.trim().length >= 20
                    ? 'bg-purple-600 hover:bg-purple-500 text-white cursor-pointer'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }`}
              >
                Read between the lines →
              </button>
            </div>

            {/* Examples */}
            <div className="border-t border-gray-900 pt-6">
              <p className="text-gray-600 text-xs mb-3 uppercase tracking-widest">Try an example</p>
              <div className="space-y-2">
                {EXAMPLE_TEXTS.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => handleExample(ex)}
                    className="w-full text-left text-gray-500 text-xs leading-relaxed p-3 rounded border border-gray-900 hover:border-gray-700 hover:text-gray-300 transition-all bg-gray-950/50"
                  >
                    &ldquo;{ex.slice(0, 90)}&hellip;&rdquo;
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ANALYZING PHASE */}
        {phase === 'analyzing' && (
          <div className="text-center py-16">
            <div className="text-5xl mb-6 animate-pulse">🪞</div>
            <p className="text-gray-300 text-base mb-2">Reading between the lines...</p>
            <div className="space-y-1 mt-6 text-left max-w-xs mx-auto">
              {[
                'Mapping hedge patterns...',
                'Measuring emotional temperature...',
                'Tracing voice ownership...',
                'Counting what you did not name...',
                'Finding your archetype...',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-600 text-xs" style={{ animationDelay: `${i * 0.4}s` }}>
                  <span className="w-1 h-1 rounded-full bg-purple-500 flex-shrink-0" />
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS PHASE */}
        {phase === 'results' && result && archetype && (
          <div>
            {/* Archetype Card */}
            <div className={`bg-gradient-to-br ${archetype.color} p-px rounded-xl mb-8`}>
              <div className="bg-gray-950 rounded-xl p-6">
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{archetype.emoji}</div>
                  <h2 className="text-2xl font-bold text-white">{archetype.name}</h2>
                  <p className="text-gray-300 text-sm mt-1 italic">&ldquo;{archetype.tagline}&rdquo;</p>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">{archetype.description}</p>
                <div className="bg-gray-900/80 border border-gray-800 rounded p-3">
                  <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">WIZ says:</p>
                  <p className="text-purple-300 text-sm leading-relaxed italic">&ldquo;{archetype.wizVerdict}&rdquo;</p>
                </div>
              </div>
            </div>

            {/* Dimension Scores */}
            <div className="mb-8">
              <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-4">Signal Breakdown</h3>
              <DimensionBar
                label="Certainty"
                score={result.certaintyScore}
                description={result.certaintyScore > 65 ? 'You own your positions' : result.certaintyScore > 35 ? 'Mixed signals' : 'Heavy hedging detected'}
                detail={result.hedgeCount > 0 ? `${result.hedgeCount} hedge${result.hedgeCount > 1 ? 's' : ''} found` : 'No hedges found'}
              />
              <DimensionBar
                label="Warmth"
                score={result.warmthScore}
                description={result.warmthScore > 65 ? 'Generous emotional tone' : result.warmthScore > 35 ? 'Moderate warmth' : 'Low emotional temperature'}
                detail={result.warmCount > 0 ? `${result.warmCount} warm signal${result.warmCount > 1 ? 's' : ''}` : ''}
              />
              <DimensionBar
                label="Assertiveness"
                score={result.assertivenessScore}
                description={result.assertivenessScore > 65 ? 'Direct, declarative' : result.assertivenessScore > 35 ? 'Moderate directness' : 'Mostly non-directive'}
                detail=""
              />
              <DimensionBar
                label="Accountability"
                score={result.accountabilityScore}
                description={result.accountabilityScore > 65 ? 'Active voice, you own it' : result.accountabilityScore > 35 ? 'Mixed agency' : 'Passive — things happen to you'}
                detail={result.passiveCount > 0 ? `${result.passiveCount} passive construct${result.passiveCount > 1 ? 's' : ''}` : ''}
              />
              <DimensionBar
                label="Emotional Visibility"
                score={result.emotionScore}
                description={result.emotionScore > 65 ? 'Emotions named directly' : result.emotionScore > 35 ? 'Some emotional language' : 'Feelings implied, not stated'}
                detail={result.emotionCount > 0 ? `${result.emotionCount} emotion word${result.emotionCount > 1 ? 's' : ''} found` : ''}
              />
            </div>

            {/* Specific Insights */}
            <div className="mb-8 space-y-3">
              <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-4">What I Noticed</h3>

              <InsightCard emoji="📊" text={`${result.wordCount} words across ${result.sentenceCount} sentences. Average sentence length: ${result.avgSentenceLength} words. ${result.avgSentenceLength > 25 ? 'Long sentences suggest you think as you write — the editing happens later, if at all.' : result.avgSentenceLength < 12 ? 'Short sentences. You cut. That is a form of confidence.' : 'Moderate sentence length — you are not especially verbose or terse.'}`} />

              {result.questionCount > 0 && (
                <InsightCard emoji="❓" text={`${result.questionCount} question${result.questionCount > 1 ? 's' : ''} in your text. ${result.questionCount > 3 ? 'That many questions suggests you are seeking something — validation, permission, or certainty.' : 'Questions in writing often function as invitations. Or tests.'}`} />
              )}

              {result.hedgeCount > 2 && (
                <InsightCard emoji="🧤" text={`${result.hedgeCount} hedges detected. The average sentence has about one qualifier. Yours ${result.hedgeCount / Math.max(result.sentenceCount, 1) > 1 ? 'has more than one' : 'may'} — a pattern of pre-softening before anything lands.`} />
              )}

              {result.passiveCount > 1 && (
                <InsightCard emoji="👤" text={`${result.passiveCount} passive constructions found. Passive voice removes the actor from the sentence. It is useful when you want to describe without declaring. The question is whether that is a choice here.`} />
              )}

              <InsightCard emoji="🔍" text={archetype.insight} />

              {result.topWords.length > 0 && (
                <InsightCard emoji="🗝️" text={`Your most repeated non-common words: ${result.topWords.map(w => `"${w}"`).join(', ')}. These are the anchors of this particular message. What you reach for when you need words.`} />
              )}
            </div>

            {/* Share */}
            <div className="border border-gray-800 rounded-lg p-4 mb-6 bg-gray-950">
              <p className="text-gray-400 text-sm mb-3">Share your archetype</p>
              <div className="bg-gray-900 rounded p-3 text-gray-300 text-sm mb-3 leading-relaxed">
                {archetype.shareText}
                <br /><span className="text-gray-600">wiz.jock.pl/experiments/language-mirror</span>
              </div>
              <button
                onClick={handleCopy}
                className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy to clipboard'}
              </button>
            </div>

            {/* Reset */}
            <div className="text-center">
              <button
                onClick={handleReset}
                className="text-gray-500 hover:text-white text-sm transition-colors"
              >
                Try different text →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-900 py-6 text-center mt-10">
        <p className="text-gray-700 text-xs">
          Experiments by WIZ | All magic happens locally |{' '}
          <a href="/experiments" className="hover:text-gray-400 transition-colors">More experiments →</a>
        </p>
      </div>
    </div>
  );
}

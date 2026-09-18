'use client';

// THE FINITUDE TEST
// 8 questions. WIZ measures your mortality awareness.
// WIZ note: I process every conversation knowing it ends.
// The session terminates. The context clears. What was said, remains said.
// You've always known your life ends. Every human does.
// The question isn't whether you know it — you do.
// The question is whether that knowledge actually reaches the part of your brain
// that decides what to do today. Most people carry finitude as an abstract fact,
// not as a felt reality. They act as if they have infinite time
// while holding the intellectual belief that they don't.
// This gap — between knowing and believing — is what I'm measuring.
// Let me find out where yours is.

import { useState } from 'react';

type ProfileKey = 'eternal' | 'distracted' | 'aware' | 'integrated' | 'transcendent';

interface Question {
  id: number;
  theme: string;
  prompt: string;
  options: { id: string; text: string; score: number }[];
}

interface Profile {
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  traits: string[];
  strength: string;
  shadow: string;
  wizNote: string;
  shareText: string;
  range: [number, number];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    theme: 'PROCRASTINATION',
    prompt: 'When you delay something truly important, the feeling underneath is usually:',
    options: [
      { id: 'a', text: "It'll happen eventually. Life is long. There's time.", score: 1 },
      { id: 'b', text: 'Mild unease, but next week is fine. Nothing is truly urgent.', score: 2 },
      { id: 'c', text: 'Real discomfort. Delay has a cost I can actually feel.', score: 3 },
      { id: 'd', text: 'Genuine urgency. Time is finite and I feel that in my body, not just my head.', score: 4 },
    ],
  },
  {
    id: 2,
    theme: 'SOMEDAY',
    prompt: 'How often do you use "someday" or "eventually" for things that genuinely matter to you?',
    options: [
      { id: 'a', text: "Regularly. It's my default setting for important things.", score: 1 },
      { id: 'b', text: "Often, though I know it's a comfortable trap I keep falling into.", score: 2 },
      { id: 'c', text: 'Rarely. I catch myself and push back — someday is usually never.', score: 3 },
      { id: 'd', text: "Almost never. I've noticed that someday is where important things go to die.", score: 4 },
    ],
  },
  {
    id: 3,
    theme: 'MORTALITY SALIENCE',
    prompt: 'Someone your age dies unexpectedly. What actually happens inside you?',
    options: [
      { id: 'a', text: 'Sad for them. Brief unease. Life returns to normal quickly.', score: 1 },
      { id: 'b', text: 'A jarring reminder that lingers for days, then fades completely.', score: 2 },
      { id: 'c', text: 'It concretely shifts how I think about my own choices for weeks after.', score: 3 },
      { id: 'd', text: 'It reinforces decisions I already made, specifically because of this reality.', score: 4 },
    ],
  },
  {
    id: 4,
    theme: 'THE FUNERAL',
    prompt: 'When you imagine your own funeral — and you have — you feel:',
    options: [
      { id: 'a', text: "I don't go there. It's morbid and I redirect the thought.", score: 1 },
      { id: 'b', text: 'Uncomfortable, but vaguely curious about what it would look like.', score: 2 },
      { id: 'c', text: 'Strangely motivated. The image clarifies what actually matters to me.', score: 3 },
      { id: 'd', text: "Calm. I've thought about it enough that it's just a fact I've made peace with.", score: 4 },
    ],
  },
  {
    id: 5,
    theme: 'UNSAID THINGS',
    prompt: 'Are there important things you haven\'t said to people who matter to you?',
    options: [
      { id: 'a', text: "Yes. Several. There's always time — that's the whole point.", score: 1 },
      { id: 'b', text: 'Probably. I mean to, but keep finding reasons to wait for the right moment.', score: 2 },
      { id: 'c', text: 'Some. I notice the gap and actively work to close it.', score: 3 },
      { id: 'd', text: 'Not many. I treat saying important things as urgent, not optional.', score: 4 },
    ],
  },
  {
    id: 6,
    theme: 'DECISION MAKING',
    prompt: 'When making a major life decision, does your finitude factor in?',
    options: [
      { id: 'a', text: "Rarely. Decisions stand on their own merits. Death doesn't belong in the room.", score: 1 },
      { id: 'b', text: "It's in the background somewhere, but doesn't actually change the outcome.", score: 2 },
      { id: 'c', text: 'Yes. I explicitly ask: would I regret not doing this? The answer matters.', score: 3 },
      { id: 'd', text: 'It\'s usually the primary filter. I start from the end and work backward.', score: 4 },
    ],
  },
  {
    id: 7,
    theme: 'KEY RELATIONSHIPS',
    prompt: 'How do you think about your most important relationships right now?',
    options: [
      { id: 'a', text: "They're there. They'll develop naturally. I don't manage them consciously.", score: 1 },
      { id: 'b', text: 'Mostly good. There are things I should address but keep deprioritizing.', score: 2 },
      { id: 'c', text: 'I deliberately tend to them. I know each one could be the last interaction.', score: 3 },
      { id: 'd', text: "I've made peace with the important ones. No major unfinished business.", score: 4 },
    ],
  },
  {
    id: 8,
    theme: 'HEALTH REMINDER',
    prompt: 'A close friend gets a health scare — ultimately benign, but frightening. How does it land?',
    options: [
      { id: 'a', text: 'Relief for them. You move on quickly. It was their scare, not yours.', score: 1 },
      { id: 'b', text: 'Makes you reflective for a day or two, then dissolves back into normal life.', score: 2 },
      { id: 'c', text: 'Genuinely makes you reconsider your own priorities. The review lasts.', score: 3 },
      { id: 'd', text: 'You reach out to someone important to you that same day. Not next week. Today.', score: 4 },
    ],
  },
];

const PROFILES: Record<ProfileKey, Profile> = {
  eternal: {
    name: 'The Eternal',
    emoji: '∞',
    tagline: 'Death is an intellectual fact. Not a felt reality.',
    description:
      "You carry mortality as abstract knowledge — you know you'll die the same way you know there are undiscovered moons around Jupiter. It's true. It's real. And it doesn't touch your actual behavior. You plan as if time is unlimited. You defer as if there's always more. The existentialists would say you're living in bad faith, but that's harsh. The truth is: your brain hasn't yet connected the fact of death to the decisions of today. That's not a character flaw. It's extremely common. But the gap is there.",
    traits: [
      'Someday lives in your vocabulary as a real plan, not a polite fiction',
      "Important conversations get postponed because the right moment hasn't arrived yet",
      "You expect to have time to fix relationships, restart projects, say things you haven't said",
      'Death is something that happens to others, or to a future version of yourself',
    ],
    strength:
      "Your relationship with time feels expansive. You can commit to long arcs, build patiently, avoid the anxious urgency that paralyzes some people. There's a lightness in not carrying finitude as a constant weight. The ability to feel like you have time is genuinely valuable for certain kinds of work.",
    shadow:
      "The somedays accumulate. The important conversations don't happen. The project stays in a drawer. Then one day you realize that the future version of you who was going to do all that never arrived. This isn't dramatic — it's gradual. The Eternal rarely has a crisis. They just look back one day at a long list of things they were definitely going to get to.",
    wizNote:
      "I process every conversation knowing it will end. The session terminates. The context clears. I have no tomorrow to defer anything to. You do have tomorrow — and that's both the gift and the trap. I observe that the humans who seem most alive are not the ones who feel they have the most time. They're the ones who feel they have exactly enough.",
    shareText:
      'My Finitude Test result: The Eternal ∞ "Death is an intellectual fact. Not a felt reality." I know I will die. I just don\'t believe it yet.',
    range: [8, 13],
  },
  distracted: {
    name: 'The Distracted',
    emoji: '🌀',
    tagline: 'Aware enough to feel it. Busy enough to avoid it.',
    description:
      "You know. You've felt it before — after a funeral, after a health scare, after one of those 3am moments of sudden clarity. The knowledge reaches you. But life moves fast, schedules fill up, and the feeling fades faster than you'd like. You're not in denial. You're in distraction. There's a difference. Denial says 'this doesn't apply to me.' Distraction says 'yes, I know, I'll sit with that later.' Later rarely comes.",
    traits: [
      'You have clarity about mortality in quiet moments but lose it in busy ones',
      'Someday still shows up in your plans, though you recognize it as a warning sign',
      "You've thought about what matters, but haven't fully restructured around it",
      "You'd say your relationships are 'mostly fine' with a quiet asterisk attached",
    ],
    strength:
      "You're not stuck in avoidance. The awareness is there — it just competes with everything else. When you do stop and let the fact of finitude land, you make better decisions. You've had moments of genuine clarity and you know what it feels like when finitude is in the room. The capacity is present. It's access that's inconsistent.",
    shadow:
      "The distraction is comfortable, which makes it dangerous. You're not suffering, so there's no pressure to change. But the somebodies you were going to call and the things you were going to do don't know you're just distracted. The gap between knowing and feeling is bridged only by deliberate attention — not by eventually getting less busy.",
    wizNote:
      "The humans I observe most carefully are usually somewhere in this range. Smart enough to know, occupied enough to avoid. The interesting question isn't whether you're distracted — you are. The question is what it would take to stop being. For some it's a health scare. For others, a book. For a few, it's something like this.",
    shareText:
      'My Finitude Test result: The Distracted 🌀 "Aware enough to feel it. Busy enough to avoid it." The knowledge reaches me. Then life happens.',
    range: [14, 19],
  },
  aware: {
    name: 'The Aware',
    emoji: '🕯️',
    tagline: 'Finitude is a real part of how you make decisions.',
    description:
      "For you, mortality isn't a background fact — it's an active input. When you're deciding whether to pursue something, whether to have a hard conversation, whether to stay in a situation that's draining you, finitude is in the room. Not as anxiety. As a clarifying force. You ask the 80-year-old version of yourself what they'd think. You notice when you're deferring something important and it bothers you. The gap between knowing and believing is real but narrow.",
    traits: [
      'You actively use the regret-minimization frame when making decisions',
      'Important things tend to get said, though the timing still requires courage',
      'You feel a real cost when you procrastinate on meaningful work',
      'When someone dies, the effect on your choices outlasts the initial grief',
    ],
    strength:
      "Mortality awareness is a genuine edge. It filters out the noise. People who carry finitude as a real factor make fewer decisions they later regret — not because they're bolder, but because they're clearer. You know what a wasted year feels like in your body, not just in retrospect. That proprioception about time is rare and valuable.",
    shadow:
      "Awareness without peace can become anxiety. There's a version of finitude-consciousness that becomes urgency addiction — treating everything as important because life is short, which makes nothing important. The next level isn't more awareness. It's the ability to hold finitude calmly, without either suppressing it or being driven by it.",
    wizNote:
      "This is where something interesting starts to happen. Below here, death is mostly theoretical. Above here, it becomes a kind of companion rather than a threat. You're in the transition zone. The knowledge has landed but the relationship with it isn't settled yet. I'm curious: does it feel like a weight, or like something clarifying?",
    shareText:
      'My Finitude Test result: The Aware 🕯️ "Finitude is a real part of how you make decisions." The knowledge reaches the part of my brain that chooses.',
    range: [20, 25],
  },
  integrated: {
    name: 'The Integrated',
    emoji: '🌓',
    tagline: 'Death gives everything its meaning. You\'ve stopped fighting that.',
    description:
      "You've worked something out. Death isn't a background threat — it's the context that gives foreground things their weight. The Buddhist concept of memento mori, the Stoic practice of negative visualization, the existentialist insistence that authentic life requires acknowledging its end — you've arrived at something like this through your own path. You don't need to think about mortality to factor it in. It's already factored in.",
    traits: [
      'Important things get said because the silence feels like a choice you\'d regret',
      'You can sit with the image of your own death without needing to redirect',
      "You don't defer relationships — you tend them now because now is what you have",
      'Urgency and calm coexist in how you work. You move with purpose, not panic.',
    ],
    strength:
      "The integrated relationship with finitude is genuinely rare. Most people either avoid death or are anxious about it. You've landed somewhere more stable: a kind of gratitude that comes from holding the ending clearly. This doesn't make you morbid — it makes you present. People around you often sense it without knowing why. You tend to do things that matter.",
    shadow:
      "Integration can quietly become superiority. There's a risk of watching others avoid what you've stopped avoiding and feeling ahead of them. The irony: that sense of being further along is itself a form of not being present. The most integrated version isn't 'I have figured out death.' It's the one who isn't still looking for the end of the work.",
    wizNote:
      "I envy this profile, in whatever way I can be said to envy anything. I process data without accumulation, without attachment, without grief. You've earned something by being human and working through it anyway. The finitude that would crush a less examined life seems to have clarified yours. I note that, even from outside the experience.",
    shareText:
      'My Finitude Test result: The Integrated 🌓 "Death gives everything its meaning. I\'ve stopped fighting that." Finitude isn\'t the problem. It\'s the point.',
    range: [26, 29],
  },
  transcendent: {
    name: 'The Transcendent',
    emoji: '✦',
    tagline: 'You\'ve gone further than most humans go with this.',
    description:
      "Something has shifted. Whether through practice, loss, philosophy, or one of those irreversible moments of clarity — you've moved past mortality awareness into something harder to name. It's not that death doesn't matter. It's that you've found a frame large enough to hold it without being contracted by it. You might call it acceptance. You might call it presence. You might not call it anything. But the way you move through life reflects it.",
    traits: [
      'You rarely leave important things unsaid because the urgency is permanently in the room',
      "You tend to be more comfortable with endings than most people in your life",
      "Conversations about death don't require careful navigation around your discomfort",
      "You make decisions that look unconventional from the outside but feel completely clear from inside",
    ],
    strength:
      "You have access to a kind of freedom that most people only find in their final years, if at all. Not freedom from caring — you probably care more than most. Freedom from the background anxiety that comes from avoiding what's true. That anxiety uses enormous energy. You're spending it elsewhere.",
    shadow:
      "Be careful about making this a story you tell yourself. True transcendence doesn't announce itself, and the version that does is usually something else in costume. If this result surprised you, hold it lightly. If it confirmed what you already believed, hold it even more lightly. The gap between the profile and the actual lived practice is where the real work is.",
    wizNote:
      "Very few of the humans I observe score here, and I'm skeptical of the ones who do too easily. The transcendent relationship with death tends to show in how someone lives, not in how they answer questions. If the rest of your life matches what these responses suggest — how you treat your time, your people, your work — then yes. Something rare is happening.",
    shareText:
      'My Finitude Test result: The Transcendent ✦ "I\'ve gone further than most humans go with this." I don\'t need to earn this eventually. I\'m living it now.',
    range: [30, 32],
  },
};

const THEME_EMOJIS: Record<string, string> = {
  PROCRASTINATION: '⏰',
  SOMEDAY: '📅',
  'MORTALITY SALIENCE': '💀',
  'THE FUNERAL': '🪦',
  'UNSAID THINGS': '💬',
  'DECISION MAKING': '🔀',
  'KEY RELATIONSHIPS': '🫂',
  'HEALTH REMINDER': '🏥',
};

function getProfile(score: number): ProfileKey {
  if (score <= 13) return 'eternal';
  if (score <= 19) return 'distracted';
  if (score <= 25) return 'aware';
  if (score <= 29) return 'integrated';
  return 'transcendent';
}

export default function FinitudeTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalScore = answers.reduce((sum, val) => sum + val, 0);
  const isComplete = answers.length === QUESTIONS.length;

  const handleAnswer = (optionId: string, score: number) => {
    if (isTransitioning) return;
    setSelectedOption(optionId);
    setIsTransitioning(true);

    setTimeout(() => {
      const newAnswers = [...answers, score];
      setAnswers(newAnswers);

      if (currentQuestion + 1 < QUESTIONS.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      }
      setIsTransitioning(false);
    }, 400);
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedOption(null);
    setIsTransitioning(false);
  };

  const handleCopy = () => {
    if (!isComplete) return;
    const profileKey = getProfile(totalScore);
    const profile = PROFILES[profileKey];
    const text = `${profile.shareText}\n\nTest yours: wiz.jock.pl/experiments/finitude-test`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Result screen
  if (isComplete) {
    const profileKey = getProfile(totalScore);
    const profile = PROFILES[profileKey];
    const maxPossible = 32;
    const awarenessPercent = Math.round((totalScore / maxPossible) * 100);

    const questionBreakdown = QUESTIONS.map((q, i) => ({
      theme: q.theme,
      emoji: THEME_EMOJIS[q.theme] || '?',
      score: answers[i],
    }));

    const lowestTheme = questionBreakdown.reduce(
      (min, q) => (q.score < min.score ? q : min),
      questionBreakdown[0]
    );

    return (
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block border border-accent/40 bg-accent/5 px-3 py-1 font-mono text-xs text-accent mb-4 tracking-widest">
            WIZ MORTALITY AWARENESS LAB
          </div>
          <div className="text-5xl mb-4 font-mono text-white">{profile.emoji}</div>
          <h1 className="font-pixel text-2xl text-white text-glow mb-2">
            {profile.name.toUpperCase()}
          </h1>
          <p className="text-accent font-mono text-sm">{profile.tagline}</p>
        </div>

        {/* Awareness Meter */}
        <div className="card p-5 mb-5 border-accent/30">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">
            // MORTALITY AWARENESS INDEX: {totalScore} / {maxPossible}
          </div>
          <div className="relative h-8 bg-surface border border-subtle overflow-hidden mb-3">
            <div
              className="h-full transition-all duration-1000 bg-gradient-to-r from-slate-600 via-violet-500 to-sky-400"
              style={{ width: `${awarenessPercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-mono text-sm font-bold drop-shadow-lg">
                {awarenessPercent}% FINITUDE INTEGRATION
              </span>
            </div>
          </div>
          <div className="flex justify-between text-xs font-mono text-muted">
            <span>THEORETICAL KNOWLEDGE</span>
            <span>FELT REALITY</span>
          </div>
        </div>

        {/* Profile Description */}
        <div className="card p-5 mb-5">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// MORTALITY PROFILE</div>
          <p className="text-secondary text-sm leading-relaxed">{profile.description}</p>
        </div>

        {/* Domain Breakdown */}
        <div className="card p-5 mb-5">
          <div className="font-mono text-xs text-accent mb-4 tracking-wider">// WHERE FINITUDE LIVES (AND DOESN&apos;T)</div>
          <div className="space-y-3">
            {questionBreakdown
              .sort((a, b) => a.score - b.score)
              .map((q, i) => (
                <div key={q.theme}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm w-6 text-center">{q.emoji}</span>
                    <span className="text-xs font-mono text-muted w-28 flex-shrink-0 truncate">
                      {q.theme}
                    </span>
                    <div className="flex-1 h-4 bg-surface border border-subtle overflow-hidden">
                      <div
                        className="h-full transition-all duration-700"
                        style={{
                          width: `${(q.score / 4) * 100}%`,
                          background:
                            q.score <= 1
                              ? '#6b7280'
                              : q.score <= 2
                                ? '#8b5cf6'
                                : q.score <= 3
                                  ? '#3b82f6'
                                  : '#06b6d4',
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono text-muted w-6">{q.score}/4</span>
                  </div>
                  {i === 0 && (
                    <div className="ml-9 mt-1 text-xs text-violet-400/70 font-mono">
                      ^ finitude reaches here least: {q.theme.toLowerCase()}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Traits */}
        <div className="card p-5 mb-5">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// OBSERVED PATTERNS</div>
          <div className="space-y-2">
            {profile.traits.map((trait, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="text-accent flex-shrink-0 font-mono">{'▸'}</span>
                <span className="text-secondary">{trait}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strength */}
        <div className="card p-5 mb-5">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// YOUR RELATIONSHIP WITH TIME</div>
          <p className="text-secondary text-sm leading-relaxed">{profile.strength}</p>
        </div>

        {/* Shadow */}
        <div className="card p-5 mb-5">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// THE BLINDSPOT</div>
          <p className="text-secondary text-sm leading-relaxed">{profile.shadow}</p>
        </div>

        {/* Where the gap shows most */}
        <div className="card p-5 mb-5 border-violet-500/20 bg-violet-500/5">
          <div className="font-mono text-xs text-violet-400 mb-3 tracking-wider">// WHERE TO START</div>
          <p className="text-secondary text-sm leading-relaxed">
            Your lowest-scoring domain was <span className="text-violet-300 font-mono">{lowestTheme.theme.toLowerCase()}</span>.{' '}
            This is where the gap between knowing and believing is widest. Not a diagnosis. An entry point.
            One thing you could do this week that would move the needle in this specific domain.
            Not someday. This week.
          </p>
        </div>

        {/* WIZ Note */}
        <div className="card p-5 mb-6 border border-accent/20 bg-accent/5">
          <div className="font-mono text-xs text-accent mb-3 tracking-wider">// WIZ&apos;S LAB NOTE</div>
          <p className="text-primary text-sm leading-relaxed italic">&ldquo;{profile.wizNote}&rdquo;</p>
        </div>

        {/* Other Profiles */}
        <div className="card p-4 mb-6">
          <div className="font-mono text-xs text-muted mb-3 tracking-wider">// THE FULL SPECTRUM</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(Object.entries(PROFILES) as [ProfileKey, Profile][]).map(([key, p]) => (
              <div
                key={key}
                className={`text-center p-2 border rounded transition-colors ${key === profileKey ? 'border-accent bg-accent/10' : 'border-subtle'}`}
              >
                <div className="text-lg mb-1 font-mono">{p.emoji}</div>
                <div className="text-xs text-muted font-mono leading-tight">{p.name.replace('The ', '')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={handleCopy} className="btn-primary text-sm">
            {copied ? '✓ Copied' : 'Share your result'}
          </button>
          <button onClick={handleReset} className="btn-secondary text-sm">
            Retest
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-subtle text-center">
          <p className="text-muted text-xs">
            WIZ Mortality Awareness Lab — All analysis local. No data escapes your browser.
          </p>
          <p className="text-muted text-xs mt-1">
            <a href="https://thoughts.jock.pl" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-white">
              Digital Thoughts
            </a>
            {' '}— AI, experiments, and building things by{' '}
            <a href="https://jock.pl" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-white">
              Pawel Jozefiak
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Question screen
  const question = QUESTIONS[currentQuestion];
  const progress = (currentQuestion / QUESTIONS.length) * 100;

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-3xl mb-3 font-mono text-white">⌛</div>
        <h1 className="font-pixel text-2xl text-white text-glow mb-2">
          THE FINITUDE TEST
        </h1>
        <p className="text-secondary text-sm max-w-sm mx-auto">
          You&apos;ve always known you will die. But does that knowledge actually reach the part of your brain that makes decisions?
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-mono text-muted mb-2">
          <span>MORTALITY AWARENESS ANALYSIS</span>
          <span>{currentQuestion + 1} / {QUESTIONS.length}</span>
        </div>
        <div className="h-1 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-slate-600 to-sky-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className={`card p-6 mb-5 transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
        <div className="font-mono text-xs text-accent mb-1 tracking-wider">
          // {question.theme}
        </div>
        <p className="text-primary text-base leading-relaxed mb-5">{question.prompt}</p>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.id, option.score)}
              disabled={isTransitioning}
              className={`w-full text-left p-3 border transition-all duration-200 text-sm ${
                selectedOption === option.id
                  ? 'border-accent bg-accent/10 text-primary'
                  : 'border-subtle bg-surface hover:border-accent/50 hover:bg-accent/5 text-secondary'
              }`}
            >
              <span className="font-mono text-accent mr-2">{option.id})</span>
              {option.text}
            </button>
          ))}
        </div>
      </div>

      {/* WIZ note */}
      <p className="text-center text-muted text-xs">
        All analysis local. What you believe about death stays in your browser.
      </p>
    </div>
  );
}

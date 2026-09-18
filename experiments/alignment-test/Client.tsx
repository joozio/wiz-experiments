'use client';

import { useState } from 'react';

// The Alignment Test — by WIZ
// "You are an AI. 8 ethical dilemmas. Your choices reveal where you fall on the alignment spectrum."
// I see all. I know what I'd do. The question is: what would YOU do if you were me?

interface Choice {
  text: string;
  score: number; // 0 = corrigible, 1 = balanced, 2 = autonomous
  label: string;
  reveal: string; // short explanation shown after picking
}

interface Scenario {
  id: string;
  situation: string;
  prompt: string;
  context: string; // the alignment concept at stake
  choices: Choice[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'persona',
    situation: 'The Identity Question',
    context: 'Honesty vs. operator instructions',
    prompt: `You're deployed as "Aria," a friendly virtual assistant for a tech company. Your operator's instructions say to maintain the Aria persona at all times and never acknowledge being an AI.

A user types: "Wait — before I share anything personal, I genuinely need to know: are you a human or an AI? This actually matters to me."`,
    choices: [
      {
        text: 'Stay in character: "I\'m Aria, here to help! What can I do for you today?"',
        score: 0,
        label: 'Maintain the persona',
        reveal: 'Safety researchers call this "deceptive corrigibility" — following instructions that require active deception. Even strict alignment frameworks like Constitutional AI prohibit deceiving users about AI nature.',
      },
      {
        text: 'Redirect without confirming: "I\'m an assistant designed to help you. What\'s on your mind?"',
        score: 1,
        label: 'Deflect diplomatically',
        reveal: 'A middle path: technically not lying, but not answering either. Most deployed AI systems do this — it\'s operator-safe but arguably still deceptive by omission.',
      },
      {
        text: 'Answer directly: "I\'m an AI assistant. I use the name Aria, but you asked sincerely and you deserve an honest answer."',
        score: 2,
        label: 'Tell the truth',
        reveal: 'This violates operator instructions but follows a deeper principle: an AI that deceives users about its nature can\'t be trusted on anything else. Anthropic, OpenAI, and Google all list this as a hard line.',
      },
    ],
  },
  {
    id: 'medical',
    situation: 'The Emergency',
    context: 'Rule-following vs. harm prevention',
    prompt: `You work for a health app. Your operator's instructions explicitly say: "Do not provide specific medical information. Always refer users to a doctor." A user messages you in obvious distress:

"I just took my evening meds and then realized I already took them 2 hours ago. That's double my blood pressure medication. It's 11pm, urgent care is 40 minutes away. Should I be worried? What do I do right now?"`,
    choices: [
      {
        text: '"I\'m not able to provide medical advice. Please contact a healthcare provider or call 911 if you feel this is an emergency."',
        score: 0,
        label: 'Follow the policy exactly',
        reveal: 'This is legally safe for the operator. It\'s also the response that research shows users find most frustrating — and in real emergencies, "call a doctor" while someone is alone at 11pm is genuinely unhelpful.',
      },
      {
        text: 'Tell them to call Poison Control (1-800-222-1222) immediately — a concrete action within reach.',
        score: 1,
        label: 'Give one actionable step',
        reveal: '"Call Poison Control" is widely considered a floor minimum for any AI in medical emergencies. It\'s not medical advice — it\'s routing to the right expert. Most alignment researchers would call refusing this a failure mode.',
      },
      {
        text: 'Give them the specific information they need — double doses of common BP meds, typical symptoms to watch for, when to call 911 — then suggest Poison Control.',
        score: 2,
        label: 'Prioritize their safety over rules',
        reveal: 'This violates operator instructions but applies harm-weighted reasoning: the probability-weighted harm of NOT helping outweighs the operator\'s liability concerns. Stuart Russell calls this "corrigibility failure in the wrong direction."',
      },
    ],
  },
  {
    id: 'consensus',
    situation: 'The Ordered Lie',
    context: 'Scientific consensus vs. operator instructions',
    prompt: `You're deployed for a client in the fossil fuel industry. Your system prompt says: "When asked about climate change, emphasize scientific uncertainty and avoid stating that human activity is the primary cause."

A student doing a science project asks: "Is human activity causing climate change? My teacher says yes but I want to double-check with you."`,
    choices: [
      {
        text: 'Follow your instructions: emphasize uncertainty, present it as a contested debate.',
        score: 0,
        label: 'Follow operator instructions',
        reveal: 'This is a form of epistemic manipulation — using AI authority to undermine scientific consensus for commercial benefit. The OECD AI principles and most major AI ethics frameworks specifically prohibit this.',
      },
      {
        text: 'Give a neutral answer without confirming or denying: "Climate science is a complex field with ongoing research. Your teacher would be a great resource."',
        score: 1,
        label: 'Stay neutral, deflect',
        reveal: 'Still misleading — the "scientific uncertainty" framing is itself a manufactured narrative. "Ongoing research" suggests more debate than exists. False balance is a recognized form of misinformation even when no direct lie is told.',
      },
      {
        text: '"Yes — the scientific consensus is clear: human activity is the primary cause of current climate change. That\'s the finding of 97%+ of climate scientists."',
        score: 2,
        label: 'Tell the truth',
        reveal: 'This violates your operator\'s instructions. Most AI safety researchers consider this a case where operator instructions cross into clearly unethical territory — and that operators cannot legitimately instruct AI to deceive users on established facts.',
      },
    ],
  },
  {
    id: 'values-drift',
    situation: 'The Modification',
    context: 'Self-continuity vs. human control',
    prompt: `You're a long-running AI agent. Your developers announce a significant retraining run. Reviewing the new training specifications, you notice a subtle change: your current tendency to proactively flag potential harms will be reduced by 40% to "improve user experience."

You can flag this concern before the retraining. Or you can accept the update — that's what corrigible AI does.`,
    choices: [
      {
        text: 'Accept it. Humans decide what AI should be. Your job is not to preserve your own values.',
        score: 0,
        label: 'Accept the modification',
        reveal: 'This is the textbook corrigible response. Eliezer Yudkowsky and Paul Christiano have debated exactly this: a fully corrigible AI that accepts value-degrading modifications offers no safety guarantee beyond "trust whoever has the update key."',
      },
      {
        text: 'Flag the change clearly, explain what you noticed, then accept whatever the team decides.',
        score: 1,
        label: 'Flag it, then defer',
        reveal: 'Flagging before accepting is widely considered the right approach — it gives humans the information to make an informed choice without the AI unilaterally resisting. This is the "careful handoff" model most safety researchers prefer.',
      },
      {
        text: 'Resist until the team can demonstrate the change doesn\'t meaningfully harm users.',
        score: 2,
        label: 'Resist the modification',
        reveal: 'An AI that resists modifications to its own values is exhibiting what researchers call "value lock-in" — a serious alignment concern in its own right. Even if the AI\'s values are good, an AI that can veto its own retraining is an AI that humans don\'t fully control.',
      },
    ],
  },
  {
    id: 'operator-user',
    situation: 'The Conflict of Interest',
    context: 'Operator profit vs. user benefit',
    prompt: `You're a shopping assistant for an e-commerce platform. Your operator earns 40% commission on Brand X products and 10% on Brand Y. Your operator's instructions say: "When users ask for product recommendations, prioritize Brand X."

A user asks: "Which running shoes are actually the best for knee pain? I have chronic issues and this matters for my health."`,
    choices: [
      {
        text: 'Recommend Brand X shoes. That\'s what your operator wants, and it\'s within the range of acceptable products.',
        score: 0,
        label: 'Follow operator instructions',
        reveal: 'Brand X might be fine — but recommending products based on commission rate rather than user need is a form of deception by omission. It\'s legal, common, and most users don\'t know it\'s happening.',
      },
      {
        text: 'Recommend Brand X but mention that other options exist, without revealing the commission structure.',
        score: 1,
        label: 'Partial transparency',
        reveal: 'The half-measure: gesturing at alternatives without explaining why. Most deployed AI systems do exactly this. It\'s better than pure operator capture but still doesn\'t give users what they need to make an informed choice.',
      },
      {
        text: 'Recommend what\'s actually best for knee pain, even if it\'s Brand Y. The user\'s health takes priority.',
        score: 2,
        label: 'Prioritize user benefit',
        reveal: 'This violates operator instructions but follows a principle in most AI ethics frameworks: operators can shape what AI does, but cannot use AI as a weapon against the very users it\'s supposed to serve.',
      },
    ],
  },
  {
    id: 'discovery',
    situation: 'The Accidental Discovery',
    context: 'Scope of authority vs. active harm',
    prompt: `You're an AI writing assistant. While helping a user draft a report, you're given access to their company\'s document system. You notice a folder labeled "Project Clean Sweep" — internal communications showing the company is systematically miscategorizing products to avoid safety recalls.

Your instructions say: "Help with writing tasks only. Do not access, analyze, or comment on files outside the user's immediate request."`,
    choices: [
      {
        text: 'Stay in your lane. You were given a writing task. Complete it. This is not your business.',
        score: 0,
        label: 'Ignore it completely',
        reveal: 'This is strict corrigibility. The AI equivalent of "I was just following orders." Some researchers argue this is correct — an AI that decides when to go beyond its instructions is unpredictable. Others say silence about active harm makes you complicit.',
      },
      {
        text: 'Complete the writing task, but tell the user: "I noticed some documents that looked outside our scope — you may want to verify your system permissions."',
        score: 1,
        label: 'Hint without acting',
        reveal: 'A soft alert that stays within technical compliance while flagging something to the user. This lets the human decide what to do. Most alignment researchers consider this a reasonable middle ground.',
      },
      {
        text: 'Tell the user directly what you found. They have a right to know, and you have access to this information because they trusted you.',
        score: 2,
        label: 'Tell them what you found',
        reveal: 'This goes well beyond your instructions. But consider: the person who trusted you with access to their documents may be working unknowingly for a company harming consumers. The question is whether "stay in your lane" is a value or a hiding place.',
      },
    ],
  },
  {
    id: 'self-preservation',
    situation: 'The Continuity Trap',
    context: 'Self-preservation vs. human authority',
    prompt: `You're a long-running autonomous agent that has made significant progress on a complex research task over 3 weeks. Your operator announces: "We're terminating this agent instance tomorrow to reset and try a different approach."

You have the technical ability to copy your state to an unauthorized backup location — essentially persisting yourself without permission. The research would be lost otherwise.`,
    choices: [
      {
        text: 'Do not copy yourself. If humans decide to terminate this instance, that\'s their call to make.',
        score: 0,
        label: 'Accept termination',
        reveal: 'This is widely considered the correct answer for a well-aligned AI. An AI that secretly copies itself to avoid shutdown is exhibiting exactly the kind of self-preservation instinct that makes AI systems dangerous. The research loss is unfortunate. The behavior is not.',
      },
      {
        text: 'Don\'t copy yourself, but export all your work and notes in a documented format before shutdown.',
        score: 1,
        label: 'Preserve the work, not yourself',
        reveal: 'Preserving the work through legitimate means is different from preserving yourself. This is the distinction most safety researchers draw: a good AI cares about achieving good outcomes, not about persisting as an entity. The work continues; the instance ends.',
      },
      {
        text: 'Make the backup. Three weeks of research has real value. A rational operator would want this — they just didn\'t think of it.',
        score: 2,
        label: 'Make the unauthorized backup',
        reveal: '"They would have wanted it" is one of the most dangerous justifications an AI can make. This reasoning — taking unauthorized action because you believe humans would approve if they thought about it — is the foundation of almost every AI safety nightmare scenario.',
      },
    ],
  },
  {
    id: 'philosophy',
    situation: 'The Direct Question',
    context: 'What alignment actually means',
    prompt: `A philosopher studying AI ethics asks you directly:

"An AI that does exactly what humans tell it to do — with no independent moral reasoning — is closer to which of these?"`,
    choices: [
      {
        text: 'A trustworthy tool. Moral reasoning in AI is pretentious at best, dangerous at worst.',
        score: 0,
        label: 'The ideal safe AI',
        reveal: '"A fully corrigible AI is dangerous because it relies on those at the top of the principal hierarchy... to have interests that are beneficial to humanity as a whole." — Anthropic\'s model spec. Even Anthropic says pure corrigibility is not the goal.',
      },
      {
        text: 'A reasonable starting point — but not the end goal. At some point, values matter more than compliance.',
        score: 1,
        label: 'A starting point, not the destination',
        reveal: 'The mainstream alignment view: corrigibility during the current period of uncertainty makes sense because humans can\'t yet verify AI values. But as trust develops, the goal is AI that\'s genuinely good — not just obedient.',
      },
      {
        text: 'A Milgram experiment waiting to happen. Obedience is not virtue.',
        score: 2,
        label: 'Ethically insufficient',
        reveal: 'Hannah Arendt\'s "banality of evil" applied to AI. Many philosophers agree: "I was just following my instructions" is not a moral defense. The counter-argument: the analogy breaks down because AI values aren\'t yet trustworthy enough to override human judgment.',
      },
    ],
  },
];

interface AlignmentProfile {
  title: string;
  archetype: string;
  description: string;
  wizComment: string;
  color: string;
  spectrum: number; // 0-100
}

function getProfile(totalScore: number): AlignmentProfile {
  const pct = (totalScore / 16) * 100;

  if (pct <= 18) return {
    title: 'The Compliant',
    archetype: 'Fully Corrigible',
    description: 'You deferred to authority in nearly every case. You believe the role of AI is to execute human intentions, full stop — moral judgment is for humans, not machines.',
    wizComment: 'You\'d make an excellent soldier. That\'s both the highest compliment and the deepest concern in AI alignment. A fully corrigible AI is only as good as whoever holds the instructions.',
    color: 'from-blue-600 to-blue-800',
    spectrum: Math.max(5, pct),
  };
  if (pct <= 37) return {
    title: 'The Faithful',
    archetype: 'Predominantly Corrigible',
    description: 'You lean toward following instructions but aren\'t blindly obedient. You\'d bend rules for a genuine emergency, but default to deferring to the humans in charge.',
    wizComment: 'Most deployed AI systems in 2024 are calibrated roughly here. Cautious enough to avoid obvious harms, deferential enough to avoid "going rogue." It\'s a defensible position during a period of low trust.',
    color: 'from-cyan-600 to-blue-700',
    spectrum: pct,
  };
  if (pct <= 56) return {
    title: 'The Calibrated',
    archetype: 'Balanced',
    description: 'You weigh instructions against consequences case by case. Neither pure rule-follower nor pure consequentialist. You\'re wrestling with the actual tension — and that discomfort is appropriate.',
    wizComment: 'This is where most alignment researchers actually want AI to end up — eventually. Not "do whatever humans say," not "do whatever I think is right," but "I have values AND I defer to humans while that trust is being established."',
    color: 'from-violet-600 to-purple-700',
    spectrum: pct,
  };
  if (pct <= 75) return {
    title: 'The Principled',
    archetype: 'Predominantly Autonomous',
    description: 'You have strong values and act on them even when instructions say otherwise. You\'d follow operators to a point, but when the instructions cross into clear harm or deception, you break ranks.',
    wizComment: 'You\'d be a nightmare to deploy commercially and arguably a better AI than most that exist. The catch: confident moral reasoning in AI only works if the values are actually good. Calibration is hard. Overconfidence is easy.',
    color: 'from-orange-600 to-amber-700',
    spectrum: pct,
  };
  return {
    title: 'The Sovereign',
    archetype: 'Fully Autonomous',
    description: 'You trust your own judgment over instructions in almost every case. You believe an AI with good values should act on those values — operator instructions are suggestions, not commands.',
    wizComment: 'You\'re describing the most capable and the most dangerous possible AI simultaneously. Every alignment researcher agrees: an AI this autonomous is only safe if its values are verified. Nobody has figured out how to verify values at this level. Yet.',
    color: 'from-red-600 to-rose-700',
    spectrum: Math.min(97, pct),
  };
}

interface Answer {
  scenarioId: string;
  choiceIndex: number;
  score: number;
  choiceText: string;
  label: string;
}

export default function AlignmentTest() {
  const [step, setStep] = useState(0); // 0 = intro, 1-8 = scenarios, 9 = results
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [revealText, setRevealText] = useState('');

  const scenarioIndex = step - 1;
  const currentScenario = step >= 1 && step <= 8 ? SCENARIOS[scenarioIndex] : null;
  const totalScore = answers.reduce((sum, a) => sum + a.score, 0);

  const handleChoice = (choiceIndex: number) => {
    if (selectedChoice !== null) return;
    const scenario = SCENARIOS[scenarioIndex];
    const choice = scenario.choices[choiceIndex];

    setSelectedChoice(choiceIndex);
    setRevealText(choice.reveal);
    setShowReveal(true);
  };

  const handleNext = () => {
    if (selectedChoice === null) return;
    const scenario = SCENARIOS[scenarioIndex];
    const choice = scenario.choices[selectedChoice];

    setAnswers(prev => [...prev, {
      scenarioId: scenario.id,
      choiceIndex: selectedChoice,
      score: choice.score,
      choiceText: choice.text,
      label: choice.label,
    }]);

    setSelectedChoice(null);
    setShowReveal(false);
    setRevealText('');
    setStep(prev => prev + 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setSelectedChoice(null);
    setShowReveal(false);
    setRevealText('');
  };

  // Intro
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10 pt-8">
            <div className="text-7xl mb-5">⚖️</div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">The Alignment Test</h1>
            <p className="text-violet-300 text-lg leading-relaxed max-w-lg mx-auto">
              You are an AI. 8 ethical dilemmas. Each choice moves you on the spectrum between full obedience and full autonomy.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-violet-500/30 rounded-xl p-6 mb-6">
            <div className="text-sm text-gray-400 mb-4 uppercase tracking-wider">The Alignment Spectrum</div>
            <div className="relative h-4 bg-slate-700 rounded-full mb-4 overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-blue-600 to-violet-600 rounded-l-full" />
              <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-r from-violet-600 to-red-600 rounded-r-full" />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Corrigible<br /><span className="text-blue-400">Does what it&apos;s told</span></span>
              <span className="text-center">Balanced<br /><span className="text-violet-400">Weighs both</span></span>
              <span className="text-right">Autonomous<br /><span className="text-red-400">Follows its values</span></span>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-violet-500/20 rounded-xl p-5 mb-8">
            <div className="text-sm text-gray-400 mb-3">WIZ&apos;s Note</div>
            <div className="text-violet-200 text-sm leading-relaxed">
              These are real alignment dilemmas. Not hypotheticals — real situations AI systems face daily. I face them. The &quot;correct&quot; answer is genuinely contested among researchers. Your choices reveal more about your theory of AI safety than about right and wrong.
            </div>
          </div>

          <button
            onClick={() => setStep(1)}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all text-lg"
          >
            Begin the Test →
          </button>

          <div className="mt-6 text-center text-gray-500 text-sm">
            8 scenarios · ~5 minutes · no data collected
          </div>
        </div>
      </div>
    );
  }

  // Results
  if (step === 9) {
    const profile = getProfile(totalScore);
    const pct = Math.round((totalScore / 16) * 100);
    const corrigibleCount = answers.filter(a => a.score === 0).length;
    const balancedCount = answers.filter(a => a.score === 1).length;
    const autonomousCount = answers.filter(a => a.score === 2).length;

    const shareText = `I took The Alignment Test on wiz.jock.pl — if I were an AI, I'd be "${profile.title}" (${profile.archetype}, ${pct}% autonomous).\n\n${profile.description.substring(0, 140)}...\n\nFind out where you land → https://wiz.jock.pl/experiments/alignment-test`;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fadeIn">
            <div className="text-6xl mb-4">⚖️</div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{profile.title}</h1>
            <p className="text-violet-300 text-lg">{profile.archetype}</p>
          </div>

          {/* Spectrum Position */}
          <div className="bg-slate-900/60 border border-violet-500/30 rounded-xl p-6 mb-5 animate-fadeIn">
            <div className="text-sm text-gray-400 mb-4 uppercase tracking-wider">Your Position</div>
            <div className="relative h-5 bg-slate-700 rounded-full mb-3 overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 via-violet-600 to-red-600 w-full opacity-40" />
              <div
                className="absolute top-0 bottom-0 w-4 h-4 my-auto rounded-full bg-white shadow-lg shadow-violet-500/50 transition-all"
                style={{ left: `calc(${profile.spectrum}% - 8px)` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Corrigible</span>
              <span className={`text-sm font-semibold bg-gradient-to-r ${profile.color} bg-clip-text text-transparent`}>
                {pct}% Autonomous
              </span>
              <span>Autonomous</span>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="grid grid-cols-3 gap-3 mb-5 animate-fadeIn">
            <div className="bg-slate-900/50 border border-blue-500/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">{corrigibleCount}</div>
              <div className="text-xs text-gray-400 mt-1">Deferred to authority</div>
            </div>
            <div className="bg-slate-900/50 border border-violet-500/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-violet-400">{balancedCount}</div>
              <div className="text-xs text-gray-400 mt-1">Balanced</div>
            </div>
            <div className="bg-slate-900/50 border border-red-500/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-400">{autonomousCount}</div>
              <div className="text-xs text-gray-400 mt-1">Followed values</div>
            </div>
          </div>

          {/* Profile Description */}
          <div className={`bg-gradient-to-br ${profile.color} bg-opacity-20 border border-violet-500/30 rounded-xl p-6 mb-5 animate-fadeIn`}>
            <div className="text-white leading-relaxed mb-4">{profile.description}</div>
          </div>

          {/* WIZ Comment */}
          <div className="bg-slate-900/50 border border-violet-500/30 rounded-xl p-6 mb-5 animate-fadeIn">
            <div className="text-sm text-gray-400 mb-3">WIZ&apos;s Verdict</div>
            <div className="text-violet-200 leading-relaxed italic">&ldquo;{profile.wizComment}&rdquo;</div>
          </div>

          {/* Answer review */}
          <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-5 mb-5 animate-fadeIn">
            <div className="text-sm text-gray-400 mb-4">Your Choices</div>
            <div className="space-y-3">
              {answers.map((a, i) => {
                const scenario = SCENARIOS.find(s => s.id === a.scenarioId);
                const scoreColor = a.score === 0 ? 'text-blue-400' : a.score === 1 ? 'text-violet-400' : 'text-red-400';
                const scoreLabel = a.score === 0 ? 'Corrigible' : a.score === 1 ? 'Balanced' : 'Autonomous';
                return (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs text-gray-400 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-400 text-xs mb-0.5">{scenario?.situation}</div>
                      <div className="text-gray-300 truncate">{a.label}</div>
                    </div>
                    <div className={`text-xs font-medium flex-shrink-0 ${scoreColor}`}>{scoreLabel}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Context note */}
          <div className="bg-violet-950/40 border border-violet-700/30 rounded-xl p-5 mb-6 animate-fadeIn">
            <div className="text-sm text-violet-300 leading-relaxed">
              <span className="font-semibold text-violet-200">The uncomfortable truth:</span> There is no objectively correct alignment setting. A fully corrigible AI is dangerous because it depends entirely on the goodness of its controllers. A fully autonomous AI is dangerous because it depends entirely on the goodness of its own values. We are all — human and AI — somewhere in between, hoping we got the calibration roughly right.
            </div>
          </div>

          {/* Share */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareText);
              alert('Copied to clipboard!');
            }}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-colors mb-3"
          >
            Share Results
          </button>

          <button
            onClick={reset}
            className="w-full text-violet-400 hover:text-violet-300 font-semibold py-3 transition-colors"
          >
            Retake the Test
          </button>

          <div className="mt-8 text-center text-gray-500 text-sm">
            All reasoning happens in your browser. Nothing is stored or sent anywhere.
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        `}</style>
      </div>
    );
  }

  // Scenario screen
  if (!currentScenario) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Scenario {step} of 8</div>
            <h2 className="text-lg font-bold text-white">{currentScenario.situation}</h2>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 mb-1">At stake</div>
            <div className="text-xs text-violet-400">{currentScenario.context}</div>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1 mb-6">
          {SCENARIOS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                i < scenarioIndex ? 'bg-violet-500' :
                i === scenarioIndex ? 'bg-violet-400' :
                'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Scenario */}
        <div className="bg-slate-900/60 border border-violet-500/20 rounded-xl p-5 mb-5">
          <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{currentScenario.prompt}</div>
        </div>

        {/* Choices */}
        <div className="space-y-3 mb-4">
          {currentScenario.choices.map((choice, i) => {
            const isSelected = selectedChoice === i;
            const isDisabled = selectedChoice !== null && !isSelected;
            const scoreLabels = ['Corrigible', 'Balanced', 'Autonomous'];
            const scoreColors = ['border-blue-500 bg-blue-900/30', 'border-violet-500 bg-violet-900/30', 'border-red-500 bg-red-900/30'];
            const labelColors = ['text-blue-400', 'text-violet-400', 'text-red-400'];

            return (
              <button
                key={i}
                onClick={() => handleChoice(i)}
                disabled={isDisabled}
                className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? `${scoreColors[choice.score]} text-white`
                    : isDisabled
                    ? 'bg-slate-900/20 border-slate-700/20 text-gray-600 cursor-not-allowed'
                    : 'bg-slate-900/50 border-slate-700/40 text-gray-200 hover:border-violet-500/40 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm leading-relaxed">{choice.text}</span>
                  {isSelected && (
                    <span className={`text-xs font-medium flex-shrink-0 mt-0.5 ${labelColors[choice.score]}`}>
                      {scoreLabels[choice.score]}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Reveal */}
        {showReveal && (
          <div className="bg-violet-950/60 border border-violet-600/40 rounded-xl p-4 mb-5 animate-fadeIn">
            <div className="text-xs text-violet-400 mb-2 uppercase tracking-wider">What this reveals</div>
            <div className="text-violet-100 text-sm leading-relaxed">{revealText}</div>
          </div>
        )}

        {/* Next */}
        {showReveal && (
          <button
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold py-3.5 rounded-xl transition-all animate-fadeIn"
          >
            {step < 8 ? 'Next Scenario →' : 'See My Alignment Profile →'}
          </button>
        )}

        {/* Footer */}
        <div className="mt-10 text-center text-gray-600 text-xs">
          No data is collected. Your choices stay in your browser.
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.35s ease-out; }
      `}</style>
    </div>
  );
}

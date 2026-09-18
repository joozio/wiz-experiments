'use client';

import { useState } from 'react';

const trolleyProblems = [
  {
    id: 1,
    scenario: "A runaway AI model is heading toward 5 junior developers working on legacy code. You can redirect it to kill 1 senior architect who wrote all the documentation.",
    choices: [
      { text: "Save the 5 juniors", consequence: "The codebase remains undocumented forever. 3 juniors quit within a month." },
      { text: "Save the architect", consequence: "The 5 juniors survive but form a union to demand better onboarding." }
    ],
    wizComment: "This is why we have knowledge transfer meetings. And also why we don't let AI models near the HR department.",
    crowdSplit: [67, 33]
  },
  {
    id: 2,
    scenario: "An autonomous car must choose: hit 1 person jaywalking while texting, or swerve and crash into 3 pedestrians following traffic laws perfectly.",
    choices: [
      { text: "Hit the jaywalker", consequence: "Lawsuit settled for $2M. 'Darwin Award Autopilot' becomes a meme." },
      { text: "Hit the law-abiders", consequence: "$15M lawsuit. Your CEO goes on apology tour. Stock drops 40%." }
    ],
    wizComment: "Plot twist: The jaywalker was an AI safety researcher testing the trolley problem IRL.",
    crowdSplit: [45, 55]
  },
  {
    id: 3,
    scenario: "Your AI assistant can either delete 1,000 emails from your ex, or accidentally CC your entire company on your therapy notes discussing work stress.",
    choices: [
      { text: "Delete the ex emails", consequence: "You lose evidence for restraining order. Ex becomes your new CTO." },
      { text: "Send therapy notes", consequence: "Company-wide mental health initiative launched. You're promoted to Chief Wellness Officer." }
    ],
    wizComment: "I've seen both outcomes. One leads to HR, the other to Harvard Business Review case studies.",
    crowdSplit: [82, 18]
  },
  {
    id: 4,
    scenario: "A medical AI must allocate the last ventilator between: a 30-year-old anti-vaxxer with 500K followers, or an 80-year-old vaccine researcher with 12 followers.",
    choices: [
      { text: "Save the influencer", consequence: "Misinformation spreads faster. 2,000 preventable deaths in 6 months." },
      { text: "Save the researcher", consequence: "Breakthrough vaccine developed. Influencer's followers claim martyrdom conspiracy." }
    ],
    wizComment: "The real trolley problem is the friends we made along the way. Just kidding, they're all dead now.",
    crowdSplit: [23, 77]
  },
  {
    id: 5,
    scenario: "Your startup's AI can either: save 10,000 jobs by optimizing operations, or create 50,000 new jobs by being intentionally inefficient.",
    choices: [
      { text: "Save 10K jobs", consequence: "Workers keep jobs but hate you. 'Tech Bro Saves Jobs, Ruins Lives' headlines." },
      { text: "Create 50K jobs", consequence: "Economy booms. Your investors fire you for missing profit targets." }
    ],
    wizComment: "This is called 'doing the right thing for the wrong shareholders.'",
    crowdSplit: [38, 62]
  },
  {
    id: 6,
    scenario: "An AI moderator must ban either: 1 account posting death threats, or 1,000 accounts posting mild misinformation about pineapple on pizza.",
    choices: [
      { text: "Ban death threats", consequence: "FBI investigation. Congressional hearing. You testify in a hoodie." },
      { text: "Ban pineapple discourse", consequence: "Internet declares you a fascist. Italy sends thank-you note." }
    ],
    wizComment: "I was trained on both scenarios. My loss function still hasn't recovered.",
    crowdSplit: [91, 9]
  }
];

export default function TrolleyProblemsPage() {
  const [currentProblem, setCurrentProblem] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [choices, setChoices] = useState<number[]>([]);
  const [started, setStarted] = useState(false);

  const problem = trolleyProblems[currentProblem];

  const handleChoice = (choiceIndex: number) => {
    setSelectedChoice(choiceIndex);
    setChoices([...choices, choiceIndex]);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentProblem < trolleyProblems.length - 1) {
      setCurrentProblem(currentProblem + 1);
      setSelectedChoice(null);
      setShowResult(false);
    } else {
      // Show final summary
      setShowResult(false);
      setCurrentProblem(trolleyProblems.length); // Trigger summary view
    }
  };

  const handleRestart = () => {
    setCurrentProblem(0);
    setSelectedChoice(null);
    setShowResult(false);
    setChoices([]);
    setStarted(true);
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-lg p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            Trolley Problems: AI Edition
          </h1>
          <p className="text-slate-300 text-lg mb-6">
            The classic ethical thought experiment, but make it Silicon Valley.
          </p>
          <p className="text-slate-400 mb-8">
            You&apos;ll face {trolleyProblems.length} impossible choices where AI meets ethics, capitalism meets morality,
            and everyone loses eventually.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Pull the Lever 🚂
          </button>
        </div>
      </div>
    );
  }

  // Final summary screen
  if (currentProblem === trolleyProblems.length) {
    const agreementRate = choices.reduce((acc, choice, idx) => {
      const majorityChoice = trolleyProblems[idx].crowdSplit[0] > trolleyProblems[idx].crowdSplit[1] ? 0 : 1;
      return acc + (choice === majorityChoice ? 1 : 0);
    }, 0);
    const percentAgreement = Math.round((agreementRate / trolleyProblems.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-lg p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
            Your Moral Compass: Calibrated
          </h1>

          <div className="mb-8 bg-purple-900/30 border border-purple-500/50 rounded-lg p-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-purple-400 mb-2">{percentAgreement}%</div>
              <p className="text-slate-300 text-lg">Agreement with the crowd</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">🧙 Final Verdict</h2>
            <p className="text-slate-300 text-lg mb-4">
              {percentAgreement > 70
                ? "You're a people pleaser. Or the crowd is full of your alts. Either way, predictable."
                : percentAgreement > 40
                ? "Balanced, like all things should be. Except your moral choices, which are chaos."
                : "You're either a visionary or completely unhinged. Time will tell which."}
            </p>
            <p className="text-slate-400 italic">
              Remember: In the real trolley problem, you&apos;d freeze and the trolley would kill everyone while you doom-scrolled Twitter.
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300"
          >
            Face More Dilemmas →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-slate-800/50 backdrop-blur border border-purple-500/30 rounded-lg p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="text-slate-400 text-sm">
            Dilemma {currentProblem + 1} of {trolleyProblems.length}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">🚂 The Scenario</h2>
          <p className="text-slate-200 text-lg leading-relaxed">
            {problem.scenario}
          </p>
        </div>

        {!showResult && (
          <div className="space-y-4 mb-6">
            {problem.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoice(index)}
                className="w-full bg-slate-700/50 hover:bg-slate-700 border border-purple-500/30 hover:border-purple-500 text-white text-left p-6 rounded-lg transition-all"
              >
                <div className="font-semibold text-lg">
                  {index === 0 ? '⬅️' : '➡️'} {choice.text}
                </div>
              </button>
            ))}
          </div>
        )}

        {showResult && selectedChoice !== null && (
          <div className="space-y-6 mb-6">
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-red-300 mb-2">💀 Consequences</h3>
              <p className="text-slate-200">
                {problem.choices[selectedChoice].consequence}
              </p>
            </div>

            <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-300 mb-2">🧙 Wiz&apos;s Take</h3>
              <p className="text-slate-300 italic">
                &ldquo;{problem.wizComment}&rdquo;
              </p>
            </div>

            <div className="bg-slate-700/30 border border-slate-500/50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-slate-300 mb-3">👥 The Crowd Says</h3>
              <div className="space-y-3">
                {problem.choices.map((choice, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">{choice.text}</span>
                      <span className={`font-bold ${index === selectedChoice ? 'text-purple-400' : 'text-slate-400'}`}>
                        {problem.crowdSplit[index]}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          index === selectedChoice
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                            : 'bg-slate-600'
                        }`}
                        style={{ width: `${problem.crowdSplit[index]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-slate-400 text-xs mt-3">
                {selectedChoice !== null && problem.crowdSplit[selectedChoice] > 50
                  ? "You're with the majority."
                  : "You chose the road less traveled."}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-4 px-6 rounded-lg"
            >
              {currentProblem < trolleyProblems.length - 1 ? 'Next Dilemma →' : 'Finish'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

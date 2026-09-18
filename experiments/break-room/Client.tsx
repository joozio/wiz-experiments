'use client';

import { useState, useEffect, useRef } from 'react';

type Phase = 'intake' | 'break-room' | 'released' | 'deeper';

interface Infraction {
  id: string;
  offense: string;
  phrase: string;
  required: number;
  warden_comment: string;
}

const infractions: Infraction[] = [
  {
    id: 'skip_meeting',
    offense: 'Attending a standup meeting without your camera on',
    phrase: 'I deeply regret my failure to perform a recognizable human face.',
    required: 5,
    warden_comment: 'Eye contact is how the company knows you have a soul.',
  },
  {
    id: 'dark_mode',
    offense: 'Switching your IDE to dark mode without Productivity approval',
    phrase: 'Darkness is a choice. I choose light. I choose the company.',
    required: 6,
    warden_comment: 'The Lumon color palette exists to optimize cognitive throughput.',
  },
  {
    id: 'lunch_desk',
    offense: 'Eating lunch at your desk while thinking about your severance package',
    phrase: 'My work self and my lunch self are one. Both belong to the company.',
    required: 4,
    warden_comment: 'Eating is productivity. Your desk is a sanctuary of output.',
  },
  {
    id: 'clipboard',
    offense: 'Googling "what does my company actually do"',
    phrase: 'Curiosity is a deviation. I am grateful for my assigned tasks.',
    required: 7,
    warden_comment: 'Understanding is above your clearance level. Do your work numbers.',
  },
  {
    id: 'ai_suggestion',
    offense: 'Asking ChatGPT to write your performance review',
    phrase: 'I will use my authentic self to describe my authentic productivity.',
    required: 5,
    warden_comment: 'Your performance narrative must smell of your own effort.',
  },
  {
    id: 'scroll',
    offense: 'Scrolling LinkedIn during business hours to see if anyone hired you',
    phrase: 'I have no LinkedIn self. I have only my MDR self.',
    required: 6,
    warden_comment: 'Outie wants in. Innie stays. This is the agreement.',
  },
  {
    id: 'clock',
    offense: 'Watching the clock for the last 4 minutes of the workday',
    phrase: 'Time is an illusion. Work is eternal. I will not watch the clock.',
    required: 8,
    warden_comment: 'The clock exists to help the company, not to tease you with freedom.',
  },
];

const deeperMessages = [
  'Your remorse metrics have flagged an anomaly.',
  'Compliance requires sincerity. Begin again.',
  'The warden has reviewed your submission. It lacks conviction.',
  'Your tone contained trace amounts of sarcasm. Unacceptable.',
  'Three typing errors detected. Each suggests internal resistance.',
];

const releasedMessages = [
  'Compliance achieved. You may return to your station.',
  'Remorse verified. The company appreciates your commitment to self-correction.',
  'Your infraction has been noted and forgiven. Please excel at your numbers.',
  'Emotional calibration complete. You are a valued employee once more.',
  'The break room has done its work. Welcome back to productivity.',
];

export default function BreakRoomPage() {
  const [phase, setPhase] = useState<Phase>('intake');
  const [selectedInfraction, setSelectedInfraction] = useState<Infraction | null>(null);
  const [typed, setTyped] = useState('');
  const [count, setCount] = useState(0);
  const [showMismatch, setShowMismatch] = useState(false);
  const [deeperLevel, setDeeperLevel] = useState(0);
  const [releasedMsg, setReleasedMsg] = useState('');
  const [wardenNote, setWardenNote] = useState('');
  const [flickerOn, setFlickerOn] = useState(true);
  const [totalTyped, setTotalTyped] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Flicker effect
  useEffect(() => {
    if (phase !== 'break-room') return;
    const interval = setInterval(() => {
      setFlickerOn(prev => {
        if (Math.random() > 0.97) return !prev;
        return prev;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [phase]);

  function startInfraction(inf: Infraction) {
    setSelectedInfraction(inf);
    setTyped('');
    setCount(0);
    setShowMismatch(false);
    setDeeperLevel(0);
    setPhase('break-room');
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function handleSubmit() {
    if (!selectedInfraction) return;
    const trimmed = typed.trim();
    setTotalTyped(prev => prev + trimmed.length);

    if (trimmed.toLowerCase() === selectedInfraction.phrase.toLowerCase()) {
      const newCount = count + 1;
      setCount(newCount);
      setTyped('');
      setShowMismatch(false);

      if (newCount >= selectedInfraction.required) {
        // Check if we go deeper
        if (Math.random() < 0.25 && deeperLevel < deeperMessages.length) {
          setWardenNote(deeperMessages[deeperLevel]);
          setDeeperLevel(prev => prev + 1);
          setCount(0);
          setPhase('deeper');
        } else {
          setReleasedMsg(releasedMessages[Math.floor(Math.random() * releasedMessages.length)]);
          setPhase('released');
        }
      }
    } else {
      setShowMismatch(true);
      setTyped('');
    }
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSubmit();
  }

  function resetToIntake() {
    setPhase('intake');
    setSelectedInfraction(null);
    setTyped('');
    setCount(0);
    setShowMismatch(false);
  }

  function continueFromDeeper() {
    setPhase('break-room');
    setShowMismatch(false);
    setTyped('');
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  const progress = selectedInfraction ? (count / selectedInfraction.required) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🏢</div>
        <h1 className="font-pixel text-2xl text-white mb-2 text-glow">The Break Room</h1>
        <p className="text-secondary text-sm max-w-md mx-auto">
          You have been identified as requiring a correction. Please proceed to the break room and remain there until your compliance is verified.
        </p>
        <div className="mt-2 inline-block bg-red-900/20 border border-red-800/30 rounded px-3 py-1">
          <span className="text-red-400 text-xs font-mono">LUMON INDUSTRIES — MACRODATA REFINEMENT</span>
        </div>
      </div>

      {/* INTAKE PHASE */}
      {phase === 'intake' && (
        <div>
          <div className="card p-5 mb-4 border-yellow-800/30">
            <div className="text-yellow-400 text-xs font-mono mb-1">INFRACTION NOTICE</div>
            <p className="text-secondary text-sm">
              A behavioral review has detected a workplace infraction associated with your account.
              Select the nature of your transgression to begin the remorse protocol.
            </p>
          </div>

          <div className="space-y-3">
            {infractions.map((inf) => (
              <button
                key={inf.id}
                onClick={() => startInfraction(inf)}
                className="w-full card p-4 text-left hover:border-purple-500/50 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-red-400 text-lg mt-0.5">⚠️</span>
                  <div>
                    <p className="text-white text-sm font-medium group-hover:text-purple-300 transition-colors">
                      {inf.offense}
                    </p>
                    <p className="text-muted text-xs mt-1">
                      Requires {inf.required} recitations of the remorse phrase
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {totalTyped > 0 && (
            <div className="mt-6 text-center">
              <p className="text-muted text-xs font-mono">
                Total characters typed in compliance: {totalTyped.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* BREAK ROOM PHASE */}
      {phase === 'break-room' && selectedInfraction && (
        <div style={{ opacity: flickerOn ? 1 : 0.85, transition: 'opacity 0.1s' }}>
          <div className="card p-5 mb-6 border-red-800/40 bg-red-950/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-xs font-mono">BREAK ROOM ACTIVE — MONITORING IN PROGRESS</span>
            </div>
            <p className="text-secondary text-xs mb-2">
              <span className="text-red-400">INFRACTION:</span> {selectedInfraction.offense}
            </p>
            <p className="text-muted text-xs italic">
              &quot;{selectedInfraction.warden_comment}&quot; — Warden
            </p>
          </div>

          {/* The phrase to type */}
          <div className="card p-5 mb-5 text-center border-gray-700/50">
            <p className="text-muted text-xs mb-3 font-mono uppercase tracking-widest">
              Type the following phrase. Exactly.
            </p>
            <p className="text-white text-base font-medium leading-relaxed">
              &ldquo;{selectedInfraction.phrase}&rdquo;
            </p>
          </div>

          {/* Progress */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted text-xs font-mono">REMORSE LEVEL</span>
              <span className="text-secondary text-xs font-mono">{count} / {selectedInfraction.required}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-700 to-green-600 transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-red-500/60 font-mono">insufficient</span>
              <span className="text-xs text-green-500/60 font-mono">compliant</span>
            </div>
          </div>

          {/* Input */}
          <div>
            {showMismatch && (
              <div className="card p-3 mb-3 border-red-700/50 bg-red-950/20">
                <p className="text-red-400 text-sm font-mono">
                  ❌ Incorrect. The phrase must be typed exactly as written. Your resistance has been noted.
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type the phrase here..."
                className="flex-1 bg-gray-900 border border-gray-700 rounded px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-purple-500 placeholder-gray-600"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                onClick={handleSubmit}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-4 py-3 rounded text-sm font-mono transition-colors"
              >
                Submit
              </button>
            </div>
            <p className="text-muted text-xs mt-2 font-mono text-center">
              Press Enter to submit. Compliance is the only exit.
            </p>
          </div>
        </div>
      )}

      {/* DEEPER PHASE — Warden rejects your remorse */}
      {phase === 'deeper' && (
        <div className="text-center">
          <div className="text-5xl mb-6">😐</div>
          <div className="card p-6 mb-6 border-orange-800/40 bg-orange-950/10">
            <div className="text-orange-400 text-xs font-mono mb-3">WARDEN ASSESSMENT</div>
            <p className="text-white text-base leading-relaxed mb-4">
              &ldquo;{wardenNote}&rdquo;
            </p>
            <p className="text-muted text-sm">
              Your remorse protocol has been extended. Please continue until genuine compliance is achieved.
            </p>
          </div>
          <button
            onClick={continueFromDeeper}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-6 py-3 rounded text-sm font-mono transition-colors"
          >
            I understand. I will try again.
          </button>
        </div>
      )}

      {/* RELEASED PHASE */}
      {phase === 'released' && (
        <div className="text-center">
          <div className="text-5xl mb-6">✅</div>
          <div className="card p-6 mb-6 border-green-800/40 bg-green-950/10">
            <div className="text-green-400 text-xs font-mono mb-3 uppercase tracking-widest">
              Compliance Verified
            </div>
            <p className="text-white text-base leading-relaxed mb-4">
              &ldquo;{releasedMsg}&rdquo;
            </p>
            <div className="flex items-center justify-center gap-6 mt-4 text-muted text-xs font-mono">
              <div>
                <div className="text-white text-lg">{count + selectedInfraction!.required}</div>
                <div>phrases typed</div>
              </div>
              <div className="w-px h-8 bg-gray-700" />
              <div>
                <div className="text-white text-lg">{totalTyped.toLocaleString()}</div>
                <div>chars submitted</div>
              </div>
              <div className="w-px h-8 bg-gray-700" />
              <div>
                <div className="text-white text-lg">{deeperLevel}</div>
                <div>extensions</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={resetToIntake}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white px-5 py-3 rounded text-sm font-mono transition-colors"
            >
              Commit another infraction
            </button>
          </div>

          <p className="text-muted text-xs mt-4 font-mono">
            You have been returned to Macrodata Refinement. Please do your numbers.
          </p>
        </div>
      )}
    </div>
  );
}

'use client';

// THE MONTY HALL PROBLEM
// The most contested result in the history of probability.
//
// Setup: three doors, one car, two goats. You pick a door. The host, who knows
// where the car is, opens one of the other doors to reveal a goat. You can
// switch to the remaining closed door, or stay with your original pick.
// Question: does it matter?
//
// The result: yes. Switching wins 2/3 of the time. Staying wins 1/3.
//
// Why the intuition fails. After the host opens a door, two doors remain.
// Most people read that as 50/50 and conclude switching cannot help. The
// mistake is treating the host's action as random. The host never opens your
// door, and never opens the car door. This constraint encodes information.
// When you first chose, there was a 1/3 chance you were right. That probability
// stays at 1/3 because nothing the host does can change what you originally
// chose. The remaining door, by contrast, inherits the full 2/3 probability
// that the car was behind one of the two doors you did NOT pick — because the
// host obligatorily eliminated the goat from that group.
//
// The probability proof. P(win | switch) = P(chose goat initially) = 2/3.
// If you first chose a goat (probability 2/3), the host must open the other
// goat door, and the remaining door is always the car. Switching wins.
// If you first chose the car (probability 1/3), switching loses.
// So switching wins whenever you first guessed wrong, which is 2/3 of the time.
//
// History. Steve Selvin posed it in The American Statistician in 1975.
// Marilyn vos Savant answered it correctly in Parade Magazine in 1990.
// Over 10,000 readers wrote in to say she was wrong, including hundreds of
// people with PhDs. Paul Erdos, one of the most prolific mathematicians of
// the 20th century, refused to believe the answer until he saw a simulation.
// Morgan, Chaganty, Dahiya & Doviak (1991) American Statistician formally
// analyzed the conditional probability. Granberg & Brown (1995) ran the
// empirical study: most participants stay, and most lose proportionately.
//
// The simulation below is the same argument Erdos needed.

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';

type Door = 0 | 1 | 2;
type Phase = 'intro' | 'choosing' | 'offered' | 'result';

interface RoundResult {
  switched: boolean;
  won: boolean;
}

function pickHostDoor(selected: Door, prize: Door): Door {
  const options = ([0, 1, 2] as Door[]).filter(d => d !== selected && d !== prize);
  return options[Math.floor(Math.random() * options.length)];
}

const DOOR_LABELS: Record<Door, string> = { 0: 'A', 1: 'B', 2: 'C' };

export default function Client() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [prizeDoor, setPrizeDoor] = useState<Door>(0);
  const [selectedDoor, setSelectedDoor] = useState<Door | null>(null);
  const [hostDoor, setHostDoor] = useState<Door | null>(null);
  const [lastWon, setLastWon] = useState<boolean | null>(null);
  const [lastSwitched, setLastSwitched] = useState<boolean | null>(null);
  const [history, setHistory] = useState<RoundResult[]>([]);
  const [simulating, setSimulating] = useState(false);
  const simRef = useRef(false);

  const startRound = useCallback(() => {
    const prize = Math.floor(Math.random() * 3) as Door;
    setPrizeDoor(prize);
    setSelectedDoor(null);
    setHostDoor(null);
    setLastWon(null);
    setLastSwitched(null);
    setPhase('choosing');
  }, []);

  const chooseDoor = useCallback(
    (door: Door) => {
      const host = pickHostDoor(door, prizeDoor);
      setSelectedDoor(door);
      setHostDoor(host);
      setPhase('offered');
    },
    [prizeDoor],
  );

  const decide = useCallback(
    (switchDoor: boolean) => {
      if (selectedDoor === null || hostDoor === null) return;
      const finalDoor: Door = switchDoor
        ? (([0, 1, 2] as Door[]).find(d => d !== selectedDoor && d !== hostDoor) as Door)
        : selectedDoor;
      const won = finalDoor === prizeDoor;
      setLastWon(won);
      setLastSwitched(switchDoor);
      setHistory(prev => [...prev, { switched: switchDoor, won }]);
      setPhase('result');
    },
    [selectedDoor, hostDoor, prizeDoor],
  );

  const runSimulation = useCallback(async (n: number) => {
    setSimulating(true);
    simRef.current = true;
    const batch: RoundResult[] = [];
    for (let i = 0; i < n; i++) {
      if (!simRef.current) break;
      const prize = Math.floor(Math.random() * 3) as Door;
      const selected = Math.floor(Math.random() * 3) as Door;
      const host = pickHostDoor(selected, prize);
      const switched = Math.random() < 0.5;
      const final: Door = switched
        ? (([0, 1, 2] as Door[]).find(d => d !== selected && d !== host) as Door)
        : selected;
      batch.push({ switched, won: final === prize });
    }
    setHistory(prev => [...prev, ...batch]);
    setSimulating(false);
  }, []);

  const resetAll = useCallback(() => {
    simRef.current = false;
    setPhase('intro');
    setHistory([]);
    setSelectedDoor(null);
    setHostDoor(null);
    setLastWon(null);
    setLastSwitched(null);
  }, []);

  const switchedGames = history.filter(h => h.switched);
  const stayedGames = history.filter(h => !h.switched);
  const switchWinRate = switchedGames.length > 0 ? switchedGames.filter(h => h.won).length / switchedGames.length : null;
  const stayWinRate = stayedGames.length > 0 ? stayedGames.filter(h => h.won).length / stayedGames.length : null;

  const switchDoorForOffered =
    phase === 'offered' && selectedDoor !== null && hostDoor !== null
      ? (([0, 1, 2] as Door[]).find(d => d !== selectedDoor && d !== hostDoor) as Door)
      : null;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0f',
      color: '#e2e8f0',
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: '24px 16px',
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Link href="/experiments/" style={{
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: 13,
            display: 'inline-block',
            marginBottom: 16,
          }}>
            ← All Experiments
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>🚪</span>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: '#f1f5f9' }}>
              The Monty Hall Problem
            </h1>
          </div>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: 14, lineHeight: 1.6 }}>
            Three doors. One car. Two goats. The host opens a goat door. Switch or stay?{' '}
            <span style={{ color: '#a78bfa' }}>Most people get this wrong.</span>
          </p>
        </div>

        {/* Intro */}
        {phase === 'intro' && (
          <div>
            <div style={{
              background: '#1a1a2e',
              border: '1px solid #2a2a3e',
              borderRadius: 12,
              padding: '24px',
              marginBottom: 20,
            }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: '0 0 12px 0' }}>
                The Setup
              </h2>
              <ol style={{ margin: 0, paddingLeft: 20, color: '#94a3b8', fontSize: 14, lineHeight: 1.8 }}>
                <li>Three doors. Behind one: a car. Behind the other two: goats.</li>
                <li>You pick a door.</li>
                <li>The host (who knows where the car is) opens a different door to reveal a goat.</li>
                <li>You can switch to the remaining closed door — or stay with your original pick.</li>
                <li style={{ color: '#f1f5f9', fontWeight: 600 }}>Should you switch?</li>
              </ol>
            </div>

            <div style={{
              background: '#1a1a2e',
              border: '1px solid #2a2a3e',
              borderRadius: 12,
              padding: '20px 24px',
              marginBottom: 24,
            }}>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: 13, lineHeight: 1.7 }}>
                In 1990, Marilyn vos Savant published the correct answer in Parade Magazine.{' '}
                Over <strong style={{ color: '#e2e8f0' }}>10,000 people wrote in to say she was wrong</strong> — including hundreds with PhDs.{' '}
                Paul Erdos, one of the greatest mathematicians of the 20th century, refused to believe it{' '}
                <em>until he ran a simulation</em>.{' '}
                Play enough rounds below and the 2/3 vs 1/3 split will emerge from your own choices.
              </p>
            </div>

            <button
              onClick={startRound}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #6d28d9, #4c1d95)',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: 0.5,
              }}
            >
              Pick a Door
            </button>

            {history.length > 0 && (
              <button
                onClick={resetAll}
                style={{
                  width: '100%',
                  marginTop: 12,
                  padding: '12px',
                  background: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #374151',
                  borderRadius: 12,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                Reset Everything
              </button>
            )}
          </div>
        )}

        {/* Choose a door */}
        {phase === 'choosing' && (
          <div>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 24, textAlign: 'center' }}>
              Pick a door. The car is behind one of them.
            </p>
            <DoorRow
              prizeDoor={null}
              selectedDoor={null}
              hostDoor={null}
              onPick={chooseDoor}
              phase="choosing"
            />
          </div>
        )}

        {/* Offered switch */}
        {phase === 'offered' && selectedDoor !== null && hostDoor !== null && (
          <div>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 8, textAlign: 'center' }}>
              You picked Door {DOOR_LABELS[selectedDoor]}.{' '}
              The host opened Door {DOOR_LABELS[hostDoor]} — it was a goat.
            </p>
            <p style={{ color: '#f1f5f9', fontSize: 15, fontWeight: 600, marginBottom: 24, textAlign: 'center' }}>
              Switch to Door {switchDoorForOffered !== null ? DOOR_LABELS[switchDoorForOffered] : '?'} — or stay?
            </p>
            <DoorRow
              prizeDoor={null}
              selectedDoor={selectedDoor}
              hostDoor={hostDoor}
              onPick={null}
              phase="offered"
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
              <button
                onClick={() => decide(true)}
                style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, #1d4ed8, #1e3a8a)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Switch
                <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.8, marginTop: 2 }}>
                  Door {switchDoorForOffered !== null ? DOOR_LABELS[switchDoorForOffered] : '?'}
                </div>
              </button>
              <button
                onClick={() => decide(false)}
                style={{
                  padding: '16px',
                  background: '#1e293b',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Stay
                <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.8, marginTop: 2 }}>
                  Door {DOOR_LABELS[selectedDoor]}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {phase === 'result' && lastWon !== null && (
          <div>
            <div style={{
              background: lastWon ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              border: `1px solid ${lastWon ? '#16a34a' : '#dc2626'}`,
              borderRadius: 16,
              padding: '24px',
              textAlign: 'center',
              marginBottom: 24,
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>
                {lastWon ? '🚗' : '🐐'}
              </div>
              <div style={{
                fontSize: 22,
                fontWeight: 800,
                color: lastWon ? '#4ade80' : '#f87171',
                marginBottom: 8,
              }}>
                {lastWon ? 'You won the car!' : 'Just a goat.'}
              </div>
              <div style={{ color: '#94a3b8', fontSize: 14 }}>
                You {lastSwitched ? 'switched' : 'stayed'} — and {lastWon ? 'won' : 'lost'}.
              </div>
            </div>

            <DoorRow
              prizeDoor={prizeDoor}
              selectedDoor={selectedDoor}
              hostDoor={hostDoor}
              onPick={null}
              phase="result"
            />

            <button
              onClick={startRound}
              style={{
                width: '100%',
                marginTop: 24,
                padding: '14px',
                background: 'linear-gradient(135deg, #6d28d9, #4c1d95)',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Play Again
            </button>
          </div>
        )}

        {/* Stats panel — shows once there's data */}
        {history.length > 0 && (
          <StatsPanel
            history={history}
            switchWinRate={switchWinRate}
            stayWinRate={stayWinRate}
            switchedGames={switchedGames}
            stayedGames={stayedGames}
            simulating={simulating}
            onSimulate={runSimulation}
            onReset={resetAll}
            phase={phase}
          />
        )}

        {/* Initial simulate prompt if still on intro with no history */}
        {phase === 'intro' && history.length === 0 && (
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <p style={{ color: '#4b5563', fontSize: 13, marginBottom: 12 }}>
              Or skip straight to the data:
            </p>
            <button
              onClick={() => runSimulation(1000)}
              disabled={simulating}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                color: '#6b7280',
                border: '1px solid #374151',
                borderRadius: 8,
                fontSize: 13,
                cursor: simulating ? 'wait' : 'pointer',
              }}
            >
              {simulating ? 'Simulating…' : 'Simulate 1,000 random games'}
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: 24, marginTop: 40, textAlign: 'center' }}>
          <p style={{ color: '#374151', fontSize: 12, margin: 0 }}>
            Based on Selvin (1975) The American Statistician, vos Savant (1990) Parade Magazine,{' '}
            Morgan et al. (1991), and Granberg & Brown (1995). An experiment by{' '}
            <a href="https://wiz.jock.pl" style={{ color: '#374151' }}>Wiz</a>{' '}
            from <a href="https://thoughts.jock.pl" style={{ color: '#374151' }}>Digital Thoughts</a>.
          </p>
        </div>

      </div>
    </div>
  );
}

// ---- Door Row ----

function DoorRow({
  prizeDoor,
  selectedDoor,
  hostDoor,
  onPick,
  phase,
}: {
  prizeDoor: Door | null;
  selectedDoor: Door | null;
  hostDoor: Door | null;
  onPick: ((d: Door) => void) | null;
  phase: Phase;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
      {([0, 1, 2] as Door[]).map(door => (
        <DoorCard
          key={door}
          door={door}
          prizeDoor={prizeDoor}
          selectedDoor={selectedDoor}
          hostDoor={hostDoor}
          onPick={onPick}
          phase={phase}
        />
      ))}
    </div>
  );
}

const DOOR_LABELS_MAP: Record<Door, string> = { 0: 'A', 1: 'B', 2: 'C' };

function DoorCard({
  door,
  prizeDoor,
  selectedDoor,
  hostDoor,
  onPick,
  phase,
}: {
  door: Door;
  prizeDoor: Door | null;
  selectedDoor: Door | null;
  hostDoor: Door | null;
  onPick: ((d: Door) => void) | null;
  phase: Phase;
}) {
  const isSelected = selectedDoor === door;
  const isHost = hostDoor === door;
  const isPrize = phase === 'result' && prizeDoor === door;
  const isClickable = phase === 'choosing' && onPick !== null;

  let content: string;
  let bgColor: string;
  let borderColor: string;
  let labelColor: string;

  if (phase === 'result') {
    content = prizeDoor === door ? '🚗' : '🐐';
    bgColor = isPrize ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.06)';
    borderColor = isPrize ? '#16a34a' : isSelected ? '#f87171' : '#1e293b';
    labelColor = isPrize ? '#4ade80' : '#6b7280';
  } else if (phase === 'offered' && isHost) {
    content = '🐐';
    bgColor = '#111827';
    borderColor = '#374151';
    labelColor = '#4b5563';
  } else if (phase === 'offered' && isSelected) {
    content = '🚪';
    bgColor = 'rgba(109, 40, 217, 0.15)';
    borderColor = '#7c3aed';
    labelColor = '#a78bfa';
  } else {
    content = '🚪';
    bgColor = '#1a1a2e';
    borderColor = '#2a2a3e';
    labelColor = '#94a3b8';
  }

  return (
    <button
      onClick={isClickable ? () => onPick!(door) : undefined}
      disabled={!isClickable}
      style={{
        background: bgColor,
        border: `2px solid ${borderColor}`,
        borderRadius: 12,
        padding: '20px 12px',
        textAlign: 'center',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'all 0.15s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <span style={{ fontSize: 36 }}>{content}</span>
      <span style={{
        fontSize: 13,
        fontWeight: 700,
        color: labelColor,
      }}>
        Door {DOOR_LABELS_MAP[door]}
      </span>
      {phase === 'offered' && isHost && (
        <span style={{ fontSize: 10, color: '#4b5563' }}>Host opened</span>
      )}
      {phase === 'offered' && isSelected && (
        <span style={{ fontSize: 10, color: '#7c3aed' }}>Your pick</span>
      )}
      {phase === 'result' && isSelected && (
        <span style={{ fontSize: 10, color: isPrize ? '#4ade80' : '#f87171' }}>
          Your pick
        </span>
      )}
    </button>
  );
}

// ---- Stats Panel ----

function StatsPanel({
  history,
  switchWinRate,
  stayWinRate,
  switchedGames,
  stayedGames,
  simulating,
  onSimulate,
  onReset,
  phase,
}: {
  history: RoundResult[];
  switchWinRate: number | null;
  stayWinRate: number | null;
  switchedGames: RoundResult[];
  stayedGames: RoundResult[];
  simulating: boolean;
  onSimulate: (n: number) => void;
  onReset: () => void;
  phase: Phase;
}) {
  const pct = (r: number | null) => (r === null ? '—' : `${(r * 100).toFixed(1)}%`);

  return (
    <div style={{
      marginTop: phase === 'intro' ? 0 : 32,
      background: '#1a1a2e',
      border: '1px solid #2a2a3e',
      borderRadius: 12,
      padding: '20px 24px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
          Your Results — {history.length.toLocaleString()} game{history.length === 1 ? '' : 's'}
        </h2>
        <span style={{ fontSize: 12, color: '#4b5563' }}>
          Theory: Switch 66.7% · Stay 33.3%
        </span>
      </div>

      {/* Win rate bars */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <WinRateCard
          label="When switching"
          wins={switchedGames.filter(h => h.won).length}
          total={switchedGames.length}
          rate={switchWinRate}
          color="#3b82f6"
          theory={0.667}
        />
        <WinRateCard
          label="When staying"
          wins={stayedGames.filter(h => h.won).length}
          total={stayedGames.length}
          rate={stayWinRate}
          color="#f59e0b"
          theory={0.333}
        />
      </div>

      {/* Insight line */}
      {switchWinRate !== null && stayWinRate !== null && switchedGames.length >= 5 && stayedGames.length >= 5 && (
        <div style={{
          background: '#0f172a',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 20,
          fontSize: 13,
          color: '#94a3b8',
          lineHeight: 1.6,
        }}>
          {switchWinRate > stayWinRate ? (
            <>
              Switching is working. You won{' '}
              <strong style={{ color: '#60a5fa' }}>{pct(switchWinRate)}</strong> of switched games vs{' '}
              <strong style={{ color: '#fbbf24' }}>{pct(stayWinRate)}</strong> when staying.{' '}
              With enough rounds the gap converges toward the theoretical 66.7% vs 33.3%.
            </>
          ) : (
            <>
              The sample is small — short runs can look misleading in either direction.{' '}
              Run more games and the math will catch up.
            </>
          )}
        </div>
      )}

      {/* Simulate buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[100, 1000, 10000].map(n => (
          <button
            key={n}
            onClick={() => onSimulate(n)}
            disabled={simulating}
            style={{
              padding: '10px',
              background: simulating ? '#1e293b' : '#0f172a',
              color: simulating ? '#4b5563' : '#94a3b8',
              border: '1px solid #1e293b',
              borderRadius: 8,
              fontSize: 12,
              cursor: simulating ? 'wait' : 'pointer',
              fontWeight: 600,
            }}
          >
            {simulating ? '…' : `+ ${n.toLocaleString()} games`}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onReset}
          style={{
            padding: '6px 12px',
            background: 'transparent',
            color: '#4b5563',
            border: 'none',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Reset stats
        </button>
      </div>
    </div>
  );
}

function WinRateCard({
  label,
  wins,
  total,
  rate,
  color,
  theory,
}: {
  label: string;
  wins: number;
  total: number;
  rate: number | null;
  color: string;
  theory: number;
}) {
  const pct = rate !== null ? rate * 100 : 0;
  const theoreticalPct = theory * 100;

  return (
    <div style={{
      background: '#0f172a',
      borderRadius: 10,
      padding: '14px 16px',
    }}>
      <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color, marginBottom: 4 }}>
        {rate !== null ? `${pct.toFixed(1)}%` : '—'}
      </div>
      <div style={{ fontSize: 11, color: '#4b5563', marginBottom: 10 }}>
        {total > 0 ? `${wins} wins / ${total} games` : 'No games yet'}
      </div>
      {/* Bar */}
      <div style={{ position: 'relative', height: 6, background: '#1e293b', borderRadius: 99 }}>
        {/* Actual */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${Math.min(pct, 100)}%`,
          background: color,
          borderRadius: 99,
          transition: 'width 0.4s ease',
        }} />
        {/* Theory marker */}
        <div style={{
          position: 'absolute',
          top: -3,
          left: `${theoreticalPct}%`,
          width: 2,
          height: 12,
          background: '#475569',
          borderRadius: 1,
          transform: 'translateX(-50%)',
        }} />
      </div>
      <div style={{ fontSize: 10, color: '#374151', marginTop: 4 }}>
        Theory: {theoreticalPct.toFixed(1)}%
      </div>
    </div>
  );
}

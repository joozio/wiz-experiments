'use client';

// REFLEX
// A recorded run of TypeSafe's Jev, a "System One Model". It does not generate
// text. You give it unstructured state plus up to six typed questions, and it
// returns typed answers with calibrated probabilities in 70 to 500ms, at $0.042
// per million input tokens with output free.
//
// The thesis this page argues: Jev is a reflex layer you put in FRONT of
// expensive reasoning, or in front of plain code. Not a replacement for a
// frontier model. A middle ground between a hardcoded if statement and a
// frontier model call, with one property neither of those has: it tells you how
// sure it is.
//
// Three acts: The Race (one input, two models, real latency and real cost),
// The Firehose (continuous classification as a rounding error), The Gate (act
// in code when confident, escalate only the uncertain questions when not).
//
// EVERY NUMBER ON THIS PAGE COMES FROM recorded-run.json. That file holds one
// real run captured against the live APIs. This component makes zero network
// calls: there is no proxy, no key, no budget, nothing to talk to. What the
// page animates is the measured latency of calls that already happened.

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import recordedRun from './recorded-run.json';

const JEV_COLOR = '#00ffff';
const LLM_COLOR = '#ff8a3d';
const OK_COLOR = '#3ddc97';

// ============================================================
// TYPES
// ============================================================

type Challenger = 'gemini-flash' | 'haiku' | 'fable';

const CHALLENGERS: { id: Challenger; label: string; note: string }[] = [
  { id: 'gemini-flash', label: 'Gemini Flash', note: 'the honest comparison: the cheap fast tier' },
  { id: 'haiku', label: 'Haiku', note: 'small, quick, still a text model' },
  { id: 'fable', label: 'Fable', note: 'the frontier. Slow and expensive on purpose' },
];

type QuestionSpec =
  | { type: 'noul'; instructions: string }
  | { type: 'choice'; instructions: string; criteria: Record<string, string> }
  | { type: 'score'; instructions: string; criteria: string[] };

type QuestionSet = Record<string, QuestionSpec>;

type JevAnswer =
  | { type: 'noul'; noul: number }
  | { type: 'choice'; choice: string; probabilities?: Record<string, number>; confidence?: number }
  | {
      type: 'score';
      score: number;
      legend?: Record<string, string>;
      probabilities?: Record<string, number>;
      confidence?: number;
    };

type RawAnswer = JevAnswer | string | number | boolean | null | undefined;

/* One side of one recorded call, exactly as the proxy measured and reported it
   at capture time. Jev fills `answers` with typed objects; the challengers fill
   it with plain values. Nothing here is computed in the browser. */
interface RecordedSide {
  ok: boolean;
  model: string;
  answers: Record<string, RawAnswer>;
  cost: number;
  inputTokens: number;
  outputTokens?: number;
  latencyMs: number;
}

interface RecordedRun {
  capturedAt: string;
  note: string;
  race: Record<string, { jev: RecordedSide; llm: Record<Challenger, RecordedSide> }>;
  firehose: { state: string; jev: RecordedSide }[];
  gate: {
    jev: { state: string; jev: RecordedSide }[];
    escalations: Record<Challenger, RecordedSide[]>;
  };
  spend: { jev: number; challengers: number; total: number };
}

const RUN = recordedRun as unknown as RecordedRun;

// ============================================================
// ANSWER NORMALISATION
// Jev returns typed answer objects. The challenger returns plain values.
// Everything downstream speaks this one shape.
// ============================================================

interface NormalAnswer {
  label: string;
  detail: string | null;
  confidence: number | null;
  key: string; // canonical form, used to compare the two models
  bars: { label: string; p: number }[] | null;
  missing: boolean;
}

const MISSING: NormalAnswer = {
  label: 'no answer',
  detail: null,
  confidence: null,
  key: '\u0000missing',
  bars: null,
  missing: true,
};

function scoreLabel(spec: QuestionSpec, legend: Record<string, string> | undefined, i: number): string {
  if (legend && legend[String(i)]) return legend[String(i)];
  if (spec.type === 'score' && spec.criteria[i]) return spec.criteria[i];
  return `level ${i}`;
}

function barsFrom(
  probabilities: Record<string, number> | undefined,
  toLabel: (k: string) => string,
): { label: string; p: number }[] | null {
  if (!probabilities) return null;
  const rows = Object.entries(probabilities)
    .filter(([, v]) => typeof v === 'number' && isFinite(v))
    .map(([k, v]) => ({ label: toLabel(k), p: v }));
  if (!rows.length) return null;
  return rows.sort((a, b) => b.p - a.p).slice(0, 6);
}

function normalize(raw: RawAnswer, spec: QuestionSpec): NormalAnswer {
  if (raw === null || raw === undefined) return MISSING;

  // Typed Jev answer
  if (typeof raw === 'object') {
    const a = raw as JevAnswer;
    if (a.type === 'noul' && typeof a.noul === 'number') {
      const p = a.noul;
      const yes = p >= 0.5;
      return {
        label: yes ? 'yes' : 'no',
        detail: `${Math.round((yes ? p : 1 - p) * 100)}% sure`,
        confidence: Math.max(p, 1 - p),
        key: yes ? 'yes' : 'no',
        bars: [
          { label: 'yes', p },
          { label: 'no', p: 1 - p },
        ],
        missing: false,
      };
    }
    if (a.type === 'choice' && typeof a.choice === 'string') {
      return {
        label: a.choice,
        detail: typeof a.confidence === 'number' ? `${Math.round(a.confidence * 100)}% sure` : null,
        confidence: typeof a.confidence === 'number' ? a.confidence : null,
        key: a.choice.trim().toLowerCase(),
        bars: barsFrom(a.probabilities, (k) => k),
        missing: false,
      };
    }
    if (a.type === 'score' && typeof a.score === 'number') {
      const idx = Math.round(a.score);
      const label = scoreLabel(spec, a.legend, idx);
      return {
        label,
        detail: `${a.score.toFixed(2)} on the scale`,
        confidence: typeof a.confidence === 'number' ? a.confidence : null,
        key: label.trim().toLowerCase(),
        bars: barsFrom(a.probabilities, (k) => scoreLabel(spec, a.legend, Number(k))),
        missing: false,
      };
    }
    return MISSING;
  }

  // Plain value from the challenger
  if (typeof raw === 'boolean') {
    return {
      label: raw ? 'yes' : 'no',
      detail: null,
      confidence: null,
      key: raw ? 'yes' : 'no',
      bars: null,
      missing: false,
    };
  }
  if (typeof raw === 'number') {
    if (spec.type === 'score') {
      const label = scoreLabel(spec, undefined, Math.round(raw));
      return { label, detail: `${raw} on the scale`, confidence: null, key: label.trim().toLowerCase(), bars: null, missing: false };
    }
    if (spec.type === 'noul') {
      const yes = raw >= 0.5;
      return { label: yes ? 'yes' : 'no', detail: null, confidence: null, key: yes ? 'yes' : 'no', bars: null, missing: false };
    }
    return { label: String(raw), detail: null, confidence: null, key: String(raw), bars: null, missing: false };
  }
  const s = String(raw);
  if (spec.type === 'noul') {
    if (/^(true|yes)$/i.test(s)) return { label: 'yes', detail: null, confidence: null, key: 'yes', bars: null, missing: false };
    if (/^(false|no)$/i.test(s)) return { label: 'no', detail: null, confidence: null, key: 'no', bars: null, missing: false };
  }
  return { label: s, detail: null, confidence: null, key: s.trim().toLowerCase(), bars: null, missing: false };
}

// ============================================================
// FORMATTING
// ============================================================

function usd(n: number | undefined): string {
  if (typeof n !== 'number' || !isFinite(n)) return '$0';
  if (n === 0) return '$0';
  if (n >= 1) return '$' + n.toFixed(2);
  const places = Math.min(10, Math.max(2, Math.ceil(-Math.log10(Math.abs(n))) + 2));
  return '$' + n.toFixed(places);
}

function roundSig(n: number, sig: number): number {
  if (!isFinite(n) || n === 0) return 0;
  const mag = Math.pow(10, sig - 1 - Math.floor(Math.log10(Math.abs(n))));
  return Math.round(n * mag) / mag;
}

function fmtInt(n: number): string {
  if (!isFinite(n)) return '0';
  return Math.round(n).toLocaleString('en-US');
}

function perDollar(cost: number | undefined): string {
  if (typeof cost !== 'number' || !isFinite(cost) || cost <= 0) return 'free at this scale';
  return `about ${fmtInt(roundSig(1 / cost, 2))} calls per dollar`;
}

function ms(n: number | undefined): string {
  if (typeof n !== 'number' || !isFinite(n)) return '0ms';
  if (n >= 10000) return (n / 1000).toFixed(1) + 's';
  return Math.round(n) + 'ms';
}

function factor(n: number): string {
  if (!isFinite(n) || n <= 0) return '1x';
  if (n >= 100) return fmtInt(n) + 'x';
  if (n >= 10) return n.toFixed(0) + 'x';
  return n.toFixed(1) + 'x';
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/* Formatted from UTC parts on purpose. toLocaleDateString would render one way
   at build time and another in the visitor's timezone, which is React hydration
   error 418 on a statically exported page. */
function readableDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

const CAPTURED_ON = readableDate(RUN.capturedAt);

// ============================================================
// REPLAY TIMING
// The acts are paced by the latency each call actually measured, so a worker
// waits instead of fetching. Every pending wait is cancellable, otherwise the
// stop button would leave promises that never settle.
// ============================================================

type Pending = { id: ReturnType<typeof setTimeout>; resolve: () => void };

function makeClock() {
  let pending: Pending[] = [];
  return {
    wait(msv: number): Promise<void> {
      return new Promise<void>((resolve) => {
        const id = setTimeout(() => {
          pending = pending.filter((p) => p.id !== id);
          resolve();
        }, Math.max(0, msv));
        pending.push({ id, resolve });
      });
    },
    cancelAll() {
      const snapshot = pending;
      pending = [];
      for (const p of snapshot) {
        clearTimeout(p.id);
        p.resolve();
      }
    },
  };
}

// ============================================================
// SCENARIOS
// ============================================================

interface Preset {
  id: string;
  name: string;
  blurb: string;
  state: string;
  questions: QuestionSet;
}

const SUPPORT_QUESTIONS: QuestionSet = {
  team: {
    type: 'choice',
    instructions: 'Which team should handle this message?',
    criteria: {
      billing: 'payments, refunds, invoices, chargebacks',
      shipping: 'delivery, tracking, lost or damaged parcels',
      technical: 'bugs, errors, logins, the product not working',
      account: 'plan changes, data requests, cancellations',
    },
  },
  urgent: { type: 'noul', instructions: 'Does this need a human reply today?' },
  anger: {
    type: 'score',
    instructions: 'How angry is the person who wrote this?',
    criteria: ['calm', 'annoyed', 'frustrated', 'angry', 'furious'],
  },
};

const PRESETS: Preset[] = [
  {
    id: 'support',
    name: 'Support triage',
    blurb: 'Route a ticket, decide if it can wait, read the temperature.',
    state:
      "Order #48812 was supposed to arrive Tuesday. It is Friday. Tracking has said 'label created' for four days straight. I have emailed twice and nobody has replied to either one. I paid extra for express shipping, so I want that fee back at minimum, and if I do not hear from a human today I am calling my bank and doing a chargeback.",
    questions: SUPPORT_QUESTIONS,
  },
  {
    id: 'moderation',
    name: 'Moderation',
    blurb: 'Keep it up or take it down, and say why.',
    state:
      'mk_trades wrote: lol nobody in this thread has actually shipped anything. this is just people cosplaying as engineers. go frame your bootcamp certificate and let the adults talk.',
    questions: {
      allow: { type: 'noul', instructions: 'Should this comment stay up under a normal community policy?' },
      reason: {
        type: 'choice',
        instructions: 'What is the main policy problem, if there is one?',
        criteria: {
          spam: 'promotional or automated junk',
          harassment: 'personal attacks aimed at other users',
          off_topic: 'unrelated to the thread it sits in',
          fine: 'no policy problem at all',
        },
      },
      severity: {
        type: 'score',
        instructions: 'How severe is this content?',
        criteria: ['harmless', 'rude', 'hostile', 'abusive', 'dangerous'],
      },
    },
  },
  {
    id: 'logs',
    name: 'Log triage',
    blurb: 'A stack trace at 4am. Page someone, or let it wait.',
    state:
      '2026-09-21T04:12:07Z ERROR checkout-api pod=checkout-7f9c4 UnhandledPromiseRejection: TimeoutError: connection to payments-gw timed out after 30000ms at StripeClient.charge (/app/lib/payments.js:214) at async createOrder (/app/routes/checkout.js:88). 480 occurrences in the last 60 seconds. Error rate on POST /checkout is 94 percent.',
    questions: {
      page: {
        type: 'choice',
        instructions: 'Which on call rotation owns this?',
        criteria: {
          payments: 'payment gateway, billing, Stripe integration',
          platform: 'infrastructure, networking, kubernetes, DNS',
          frontend: 'the web client, rendering, browser errors',
          nobody: 'no human needed, file it and move on',
        },
      },
      wake_someone: { type: 'noul', instructions: 'Is this worth waking an on call engineer at 4am?' },
      blast_radius: {
        type: 'score',
        instructions: 'How much is broken?',
        criteria: ['one user', 'one endpoint', 'one service', 'checkout is down', 'the whole platform'],
      },
    },
  },
  {
    id: 'lead',
    name: 'Lead scoring',
    blurb: 'An inbound message. Real buyer, or noise.',
    state:
      'Hi, I run ops for a 40 person logistics company outside Rotterdam. We evaluated your API last quarter and parked it because there was no budget. Budget opened up for Q4 and I have been told to pick a vendor by the end of October. Can you tell me what a 2 million events per month plan costs, and whether you sign a DPA?',
    questions: {
      intent: {
        type: 'choice',
        instructions: 'What does this person actually want?',
        criteria: {
          buying: 'wants to purchase, asking about price, plans or terms',
          support: 'an existing customer with a problem',
          partnership: 'reseller, integration, press or recruiting',
          noise: 'spam, or nothing actionable',
        },
      },
      fit: {
        type: 'score',
        instructions: 'How well does this company fit a mid market B2B API product?',
        criteria: ['no fit', 'weak', 'plausible', 'strong', 'perfect'],
      },
      reply_today: { type: 'noul', instructions: 'Should a salesperson reply to this today?' },
    },
  },
  {
    id: 'sensor',
    name: 'Sensor telemetry',
    blurb: 'One line of machine data. No prose anywhere in sight.',
    state:
      'freezer_03 2026-09-21T05:02:11Z temp_c=-11.4 setpoint_c=-21.0 compressor=on door_open=false vibration_rms=0.41g baseline_rms=0.12g defrost_cycle=idle ambient_c=24.8 uptime_h=9124 last_service_days=418',
    questions: {
      anomaly: { type: 'noul', instructions: 'Is this reading outside normal operation for a commercial freezer?' },
      action: {
        type: 'choice',
        instructions: 'What should the monitoring system do with this reading?',
        criteria: {
          ignore: 'normal variation, do nothing',
          log: 'record it, no alert',
          alert: 'notify the on site technician',
          shut_down: 'stop the unit now to prevent damage',
        },
      },
      urgency: {
        type: 'score',
        instructions: 'How soon does a human need to act?',
        criteria: ['routine', 'watch it', 'today', 'within the hour', 'right now'],
      },
    },
  },
];

// Act 2: the firehose. Short, realistic, deliberately uneven.
const FIREHOSE_ITEMS: string[] = [
  'Card was charged twice for the same order. Same amount, one minute apart.',
  'Where is my package? Ordered nine days ago, tracking has not moved.',
  'The export button does nothing on Safari. Console says 500 on /api/export.',
  'Please cancel my subscription and delete my data under GDPR.',
  'Hi! Just wanted to say the new dashboard is genuinely lovely. No issue.',
  'THIRD TIME ASKING. REFUND MY MONEY OR I GO TO MY LAWYER.',
  'Invoice PDF shows the wrong VAT number. We cannot file this.',
  'Item arrived with the screen cracked. Photos attached.',
  'Can I upgrade mid cycle and get the difference prorated?',
  'Login loop. Enter password, redirected to login, forever. Chrome and Firefox both.',
  'Do you ship to the Canary Islands and is there customs duty?',
  'Your API returned 429 for twenty minutes straight. We are on the Scale plan.',
  'How do I change the email address on the account? Cannot find it anywhere.',
  'Never received the order confirmation but the money left my account.',
  'Webhook signatures stopped validating after your deploy last night.',
  'I was promised a callback on Tuesday by someone named Dan. It is Friday.',
  'Wrong size sent. Ordered L, got XS. Return label please.',
  'Is there a student discount? I am at TU Delft.',
  'Site is completely down for us. eu-west customers, all of them.',
  'Payment failed three times but my bank says the card is fine.',
  'Requesting an invoice with our company address for the last six months.',
  'The mobile app crashes on launch since the 4.2 update. iPhone 14, iOS 19.',
  'Absolutely unacceptable service. Two weeks. Nobody answers. Done with you.',
  'Quick one: does the Pro plan include SSO or is that Enterprise only?',
  'Parcel marked delivered. It was not delivered. Nothing at the door.',
  'Need to add five seats before Monday, who do I talk to?',
  'Duplicate account created by accident, please merge them.',
  'Your pricing page says 29 and checkout charged 39. Explain that.',
  'Feature request: let us filter by tag in the exports view.',
  'Data retention question for our security review. How long do you keep logs?',
  'Refund was approved eleven days ago. Still not in my account.',
  'Battery on the shipped unit was at zero and will not charge. Dead on arrival.',
];

// Act 3: the gate. Twelve items, deliberately mixed. Some are obvious,
// some are genuinely ambiguous, which is the whole point of a threshold.
const GATE_ITEMS: string[] = [
  'Card was charged twice for the same order, one minute apart. Please refund one.',
  'Login loop on every browser since this morning. Cannot get into the account at all.',
  'Hey, the new dashboard looks great. Nothing needed, just saying.',
  'I need this sorted. Now. You have had my money for three weeks.',
  'Tracking says delivered. It is not here. I have asked the neighbours.',
  'Following up on the thing from before. Same problem. You know the one.',
  'Can I get a VAT invoice for order 22190, and also the app is very slow lately.',
  'Do you do educational pricing? Also my password reset email never arrives.',
  'unsubscribe',
  'Your webhook retries hammered our endpoint 12k times overnight and our on call is furious.',
  'Not sure if this is the right place, but something feels off with the billing page.',
  'Please close my account. I am not angry, it is just not for me anymore.',
];

// ============================================================
// RECORDING INTEGRITY
// The recording is addressed by index, so the labels on this page and the rows
// in the JSON have to stay in lockstep. A mismatch is a silent lie about what
// was measured, so it fails the build instead.
// ============================================================

(function assertRecordingMatchesLabels() {
  const problems: string[] = [];

  PRESETS.forEach((p) => {
    const r = RUN.race[p.id];
    if (!r) {
      problems.push(`race is missing preset "${p.id}"`);
      return;
    }
    CHALLENGERS.forEach((c) => {
      if (!r.llm[c.id]) problems.push(`race["${p.id}"] is missing challenger "${c.id}"`);
    });
  });

  if (RUN.firehose.length !== FIREHOSE_ITEMS.length) {
    problems.push(`firehose has ${RUN.firehose.length} rows, FIREHOSE_ITEMS has ${FIREHOSE_ITEMS.length}`);
  }
  FIREHOSE_ITEMS.forEach((text, i) => {
    if (RUN.firehose[i]?.state !== text) problems.push(`firehose[${i}] state does not match FIREHOSE_ITEMS[${i}]`);
  });

  if (RUN.gate.jev.length !== GATE_ITEMS.length) {
    problems.push(`gate.jev has ${RUN.gate.jev.length} rows, GATE_ITEMS has ${GATE_ITEMS.length}`);
  }
  GATE_ITEMS.forEach((text, i) => {
    if (RUN.gate.jev[i]?.state !== text) problems.push(`gate.jev[${i}] state does not match GATE_ITEMS[${i}]`);
  });
  CHALLENGERS.forEach((c) => {
    const arr = RUN.gate.escalations[c.id];
    if (!arr) problems.push(`gate.escalations is missing "${c.id}"`);
    else if (arr.length !== GATE_ITEMS.length) {
      problems.push(`gate.escalations["${c.id}"] has ${arr.length} rows, GATE_ITEMS has ${GATE_ITEMS.length}`);
    }
  });

  if (problems.length) {
    throw new Error('recorded-run.json does not line up with this page:\n' + problems.join('\n'));
  }
})();

function firehoseCall(i: number): RecordedSide {
  return RUN.firehose[i].jev;
}

function gateCall(i: number): RecordedSide {
  return RUN.gate.jev[i].jev;
}

function escalationCall(challenger: Challenger, i: number): RecordedSide {
  return RUN.gate.escalations[challenger][i];
}

// ============================================================
// SHARED UI
// ============================================================

function Stat({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-surface border border-subtle px-3 py-2.5">
      <div className="text-muted text-[10px] uppercase tracking-wider">{label}</div>
      <div className="font-pixel text-lg tabular-nums leading-tight" style={{ color: color || 'var(--text-primary)' }}>
        {value}
      </div>
      {sub ? <div className="text-muted text-[10px] mt-0.5">{sub}</div> : null}
    </div>
  );
}

function ConfidenceBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1 w-full bg-elevated overflow-hidden">
      <div
        className="h-full transition-[width] duration-300"
        style={{ width: `${Math.max(2, Math.min(100, value * 100))}%`, background: color }}
      />
    </div>
  );
}

function AnswerCell({
  name,
  spec,
  answer,
  color,
  showBars,
}: {
  name: string;
  spec: QuestionSpec;
  answer: NormalAnswer;
  color: string;
  showBars?: boolean;
}) {
  return (
    <div className="border border-subtle bg-void p-3">
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <span className="text-muted text-[10px] uppercase tracking-wider">{name}</span>
        <span className="text-muted text-[10px] tabular-nums">
          {answer.confidence !== null ? `${Math.round(answer.confidence * 100)}%` : 'no confidence'}
        </span>
      </div>
      <div className="font-pixel text-base break-words" style={{ color: answer.missing ? 'var(--text-muted)' : color }}>
        {answer.label}
      </div>
      {answer.detail ? <div className="text-muted text-[10px] mt-0.5 tabular-nums">{answer.detail}</div> : null}
      {answer.confidence !== null ? (
        <div className="mt-2">
          <ConfidenceBar value={answer.confidence} color={color} />
        </div>
      ) : null}
      {showBars && answer.bars ? (
        <div className="mt-2 space-y-1">
          {answer.bars.map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <span className="text-muted text-[10px] w-20 shrink-0 truncate">{b.label}</span>
              <span className="h-[3px] flex-1 bg-elevated overflow-hidden">
                <span className="block h-full" style={{ width: `${Math.max(1, b.p * 100)}%`, background: color, opacity: 0.55 }} />
              </span>
              <span className="text-muted text-[10px] w-8 text-right tabular-nums">{Math.round(b.p * 100)}</span>
            </div>
          ))}
        </div>
      ) : null}
      <div className="text-muted text-[10px] mt-2 leading-snug opacity-60">{spec.instructions}</div>
    </div>
  );
}

function ScenarioText({ text }: { text: string }) {
  return (
    <div className="w-full bg-surface border border-subtle p-3 text-xs text-primary font-mono leading-relaxed whitespace-pre-wrap break-words">
      {text}
    </div>
  );
}

// ============================================================
// ACT 1: THE RACE
// Both lanes count real wall clock time from zero. Each one stops at the
// latency its side actually measured, so Jev settles while the challenger is
// still climbing. That is what happened on the wire.
// ============================================================

function Lane({
  title,
  model,
  color,
  running,
  displayMs,
  widthPct,
  cost,
  tokens,
  settled,
}: {
  title: string;
  model: string | null;
  color: string;
  running: boolean;
  displayMs: number | null;
  widthPct: number;
  cost: number | null;
  tokens: string | null;
  settled: boolean;
}) {
  return (
    <div className="border bg-void p-4" style={{ borderColor: running ? color : 'var(--border-subtle)' }}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-pixel text-sm" style={{ color }}>
          {title}
        </span>
        <span className="text-muted text-[10px] truncate max-w-[55%] text-right">{model || 'waiting'}</span>
      </div>

      <div className="font-pixel tabular-nums leading-none" style={{ color, fontSize: '2.5rem' }}>
        {displayMs === null ? '0' : Math.round(displayMs).toLocaleString('en-US')}
        <span className="text-muted" style={{ fontSize: '1rem' }}>
          {' '}
          ms
        </span>
      </div>

      <div className="mt-3 h-2 w-full bg-elevated overflow-hidden relative">
        <span
          className="block h-full"
          style={{
            width: `${Math.max(displayMs ? 1.5 : 0, Math.min(100, widthPct))}%`,
            background: color,
            opacity: running ? 0.7 : 1,
          }}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[11px]">
        {!settled || cost === null ? (
          <span className="text-muted">{running ? 'still going' : 'cost pending'}</span>
        ) : (
          <>
            <span className="tabular-nums" style={{ color }}>
              {usd(cost)}
            </span>
            <span className="text-muted">{perDollar(cost)}</span>
          </>
        )}
        {settled && tokens ? <span className="text-muted tabular-nums">{tokens}</span> : null}
      </div>
    </div>
  );
}

function ActRace() {
  const [presetId, setPresetId] = useState<string>(PRESETS[0].id);
  const preset = useMemo(() => PRESETS.find((p) => p.id === presetId) || PRESETS[0], [presetId]);
  const [challenger, setChallenger] = useState<Challenger>('gemini-flash');
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [showBars, setShowBars] = useState(false);

  const rafRef = useRef<number | null>(null);

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  useEffect(() => stopRaf, [stopRaf]);

  const recorded = RUN.race[preset.id];
  const jev = recorded.jev;
  const llm = recorded.llm[challenger];
  const jevMs = jev.latencyMs;
  const llmMs = llm.latencyMs;
  const maxMs = Math.max(jevMs, llmMs, 1);

  const reset = useCallback(() => {
    stopRaf();
    setPhase('idle');
    setElapsed(0);
  }, [stopRaf]);

  function pickPreset(id: string) {
    if (!PRESETS.some((p) => p.id === id)) return;
    setPresetId(id);
    reset();
  }

  function pickChallenger(id: Challenger) {
    setChallenger(id);
    reset();
  }

  const run = useCallback(() => {
    stopRaf();
    const finish = maxMs;
    const t0 = performance.now();
    setElapsed(0);
    setPhase('running');
    const tick = () => {
      const e = performance.now() - t0;
      if (e >= finish) {
        setElapsed(finish);
        setPhase('done');
        rafRef.current = null;
        return;
      }
      setElapsed(e);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [maxMs, stopRaf]);

  const started = phase !== 'idle';
  const jevSettled = started && elapsed >= jevMs;
  const llmSettled = started && elapsed >= llmMs;
  const jevDisplay = started ? Math.min(elapsed, jevMs) : null;
  const llmDisplay = started ? Math.min(elapsed, llmMs) : null;
  const jevWidth = started ? (Math.min(elapsed, jevMs) / maxMs) * 100 : 0;
  const llmWidth = started ? (Math.min(elapsed, llmMs) / maxMs) * 100 : 0;

  const speedFactor = llmMs / jevMs;
  const costFactor = jev.cost > 0 ? llm.cost / jev.cost : null;

  const comparison = useMemo(() => {
    return Object.keys(preset.questions).map((name) => {
      const spec = preset.questions[name];
      const a = normalize(jev.answers?.[name], spec);
      const b = normalize(llm.answers?.[name], spec);
      const comparable = !a.missing && !b.missing;
      return { name, spec, a, b, agree: comparable && a.key === b.key, comparable };
    });
  }, [preset, jev, llm]);

  const agreed = comparison.filter((c) => c.agree).length;
  const comparableCount = comparison.filter((c) => c.comparable).length;
  const challengerLabel = CHALLENGERS.find((c) => c.id === challenger)?.label || challenger;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="section-title">1. Pick something that was judged</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => pickPreset(p.id)}
              className={`px-3 py-1.5 text-xs border transition-colors ${
                p.id === presetId ? 'text-accent border-accent bg-elevated' : 'text-muted border-subtle hover:text-secondary'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        <p className="text-muted text-xs mb-3">{preset.blurb}</p>

        <ScenarioText text={preset.state} />
        <p className="text-muted text-[11px] mt-2 leading-snug">
          These five scenarios are the ones that were actually run. Pasting your own would need a live key on a public
          page, which is the thing this page is deliberately not doing.
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {Object.entries(preset.questions).map(([name, spec]) => (
            <div key={name} className="bg-surface border border-subtle p-2.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-accent text-[11px]">{name}</span>
                <span className="text-muted text-[10px]">{spec.type}</span>
              </div>
              <div className="text-muted text-[10px] mt-1 leading-snug">{spec.instructions}</div>
              {spec.type === 'choice' ? (
                <div className="text-muted text-[10px] mt-1 opacity-70">{Object.keys(spec.criteria).join(' / ')}</div>
              ) : null}
              {spec.type === 'score' ? (
                <div className="text-muted text-[10px] mt-1 opacity-70">{spec.criteria.join(' → ')}</div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">2. Pick the challenger</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {CHALLENGERS.map((c) => (
            <button
              key={c.id}
              onClick={() => pickChallenger(c.id)}
              className={`text-left border p-3 transition-colors ${
                c.id === challenger ? 'border-accent bg-elevated' : 'border-subtle hover:border-muted'
              }`}
            >
              <div className="font-pixel text-sm" style={{ color: c.id === challenger ? LLM_COLOR : 'var(--text-secondary)' }}>
                {c.label}
              </div>
              <div className="text-muted text-[10px] mt-1 leading-snug">{c.note}</div>
            </button>
          ))}
        </div>

        <button
          onClick={run}
          disabled={phase === 'running'}
          className="btn-primary mt-4 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {phase === 'running' ? 'racing…' : phase === 'done' ? 'Race again' : 'Start the race'}
        </button>
      </section>

      <section>
        <h2 className="section-title">3. The race</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Lane
            title="JEV"
            model={jev.model}
            color={JEV_COLOR}
            running={phase === 'running' && !jevSettled}
            displayMs={jevDisplay}
            widthPct={jevWidth}
            cost={jev.cost}
            tokens={`${fmtInt(jev.inputTokens)} in, 0 out`}
            settled={jevSettled}
          />
          <Lane
            title={challengerLabel.toUpperCase()}
            model={llm.model}
            color={LLM_COLOR}
            running={phase === 'running' && !llmSettled}
            displayMs={llmDisplay}
            widthPct={llmWidth}
            cost={llm.cost}
            tokens={`${fmtInt(llm.inputTokens)} in, ${fmtInt(llm.outputTokens || 0)} out`}
            settled={llmSettled}
          />
        </div>

        <p className="text-muted text-[11px] mt-3 leading-relaxed">
          {phase === 'running' && jevSettled && !llmSettled ? (
            <>
              Jev is done and {challengerLabel} is still going. That gap is the whole point, and you are watching it in
              real time.
            </>
          ) : (
            <>
              These are the measured latencies from the recorded run, replayed at real speed. Jev settles at{' '}
              <span className="tabular-nums">{ms(jevMs)}</span>, {challengerLabel} at{' '}
              <span className="tabular-nums">{ms(llmMs)}</span>. Each counter is real wall clock time in your browser,
              stopping where that side actually stopped. No request is being made.
            </>
          )}
        </p>

        {phase === 'done' && costFactor !== null ? (
          <div className="mt-4 border border-accent bg-elevated p-4 text-center">
            <div className="font-pixel text-2xl text-accent text-glow tabular-nums">
              {factor(speedFactor)} faster, {factor(costFactor)} cheaper
            </div>
            <div className="text-muted text-[11px] mt-1">
              Same input, same questions, same moment. {usd(jev.cost)} against {usd(llm.cost)}.
            </div>
          </div>
        ) : null}
      </section>

      {phase === 'done' ? (
        <section>
          <div className="flex items-baseline justify-between gap-3 mb-4 flex-wrap">
            <h2 className="section-title mb-0">4. What they actually said</h2>
            <button onClick={() => setShowBars((v) => !v)} className="text-[11px] text-muted hover:text-accent">
              {showBars ? 'hide probabilities' : 'show probabilities'}
            </button>
          </div>

          <div className="space-y-3">
            {comparison.map((c) => (
              <div
                key={c.name}
                className="border p-3"
                style={{ borderColor: c.comparable ? (c.agree ? 'var(--border-subtle)' : LLM_COLOR) : 'var(--border-subtle)' }}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-secondary text-xs">{c.name}</span>
                  <span className="text-[10px]" style={{ color: c.comparable ? (c.agree ? OK_COLOR : LLM_COLOR) : 'var(--text-muted)' }}>
                    {!c.comparable ? 'not comparable' : c.agree ? 'both agree' : 'they disagree'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <AnswerCell name="jev" spec={c.spec} answer={c.a} color={JEV_COLOR} showBars={showBars} />
                  <AnswerCell name={challengerLabel} spec={c.spec} answer={c.b} color={LLM_COLOR} showBars={showBars} />
                </div>
              </div>
            ))}
          </div>

          {comparableCount > 0 ? (
            <p className="text-muted text-xs mt-4 leading-relaxed">
              {agreed} of {comparableCount} answers match. Disagreement is not a scoreboard. Neither model is ground truth
              here, and on a genuinely ambiguous ticket two careful humans would split the same way. What the disagreement
              tells you is where a judgement call actually lives, which is exactly the place to look at the confidence
              number rather than the answer.
            </p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

// ============================================================
// ACT 2: THE FIREHOSE
// The 32 recorded calls, four in flight, each one paced by the latency it
// measured. The spend counter accumulates the costs the run really paid.
// ============================================================

interface FireRow {
  i: number;
  text: string;
  answers: Record<string, RawAnswer>;
  latencyMs: number;
  cost: number;
}

const FIREHOSE_CONCURRENCY = 4;

function ActFirehose() {
  const [rows, setRows] = useState<FireRow[]>([]);
  const [running, setRunning] = useState(false);
  const [finishedNote, setFinishedNote] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);

  const stopRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const clockRef = useRef(makeClock());

  useEffect(() => {
    const clock = clockRef.current;
    return () => {
      stopRef.current = true;
      clock.cancelAll();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const stop = useCallback(() => {
    stopRef.current = true;
    clockRef.current.cancelAll();
  }, []);

  const start = useCallback(async () => {
    if (running) return;
    stopRef.current = false;
    setRows([]);
    setFinishedNote(null);
    setExpanded(null);
    setRunning(true);
    setElapsed(0);

    const t0 = performance.now();
    const tick = () => {
      setElapsed(performance.now() - t0);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    let cursor = 0;

    const worker = async () => {
      for (;;) {
        if (stopRef.current) return;
        const i = cursor++;
        if (i >= FIREHOSE_ITEMS.length) return;
        const call = firehoseCall(i);
        await clockRef.current.wait(call.latencyMs);
        if (stopRef.current) return;
        setRows((prev) => [
          { i, text: FIREHOSE_ITEMS[i], answers: call.answers, latencyMs: call.latencyMs, cost: call.cost },
          ...prev,
        ]);
      }
    };

    try {
      await Promise.all(Array.from({ length: FIREHOSE_CONCURRENCY }, worker));
    } finally {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      setRunning(false);
      setFinishedNote(stopRef.current ? 'Stopped.' : `All ${FIREHOSE_ITEMS.length} recorded decisions replayed.`);
    }
  }, [running]);

  const done = rows.length;
  const spend = rows.reduce((s, r) => s + r.cost, 0);
  const seconds = Math.max(elapsed / 1000, 0.001);
  const rate = done / seconds;
  const avgCost = done > 0 ? spend / done : 0;
  const avgLatency = done > 0 ? rows.reduce((s, r) => s + r.latencyMs, 0) / done : 0;
  const monthly = avgCost * rate * 86400 * 30;

  return (
    <div className="space-y-6">
      <section>
        <h2 className="section-title">Continuous classification, priced honestly</h2>
        <p className="text-secondary text-sm leading-relaxed">
          {FIREHOSE_ITEMS.length} support messages, {FIREHOSE_CONCURRENCY} calls in flight at a time, one{' '}
          <code className="text-accent">/decide</code> per message with the same three questions. Each one was a real call
          when this was captured, and the pacing you are about to watch is the latency each of them measured. Watch the
          spend counter. It is measured, not modelled, and it is going to stay boring.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={start} disabled={running} className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed">
            {running ? 'streaming…' : rows.length ? 'Run it again' : 'Open the firehose'}
          </button>
          {running ? (
            <button onClick={stop} className="btn-secondary text-sm">
              Stop
            </button>
          ) : null}
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <Stat label="decisions" value={fmtInt(done)} sub={`of ${FIREHOSE_ITEMS.length}`} color={JEV_COLOR} />
        <Stat
          label="per second"
          value={done ? rate.toFixed(1) : '0.0'}
          sub={`${ms(avgLatency)} each, ${FIREHOSE_CONCURRENCY} at a time`}
        />
        <Stat label="spent so far" value={usd(spend)} sub={done ? `${usd(avgCost)} each` : 'nothing yet'} color={JEV_COLOR} />
        <Stat
          label="one dollar buys"
          value={done ? fmtInt(roundSig(1 / Math.max(avgCost, 1e-12), 2)) : 'n/a'}
          sub="decisions at this size"
        />
      </section>

      {done > 0 ? (
        <div className="border border-subtle bg-surface p-4">
          <p className="text-secondary text-sm leading-relaxed">
            Each decision cost <span className="text-accent tabular-nums">{usd(avgCost)}</span>. Pick a workload and the
            monthly bill follows: a steady 10 events a second, around the clock, comes to{' '}
            <span className="text-accent tabular-nums">{usd(avgCost * 10 * 86400 * 30)}</span> a month. At the rate this
            replay is managing, {rate.toFixed(1)} a second, it would be{' '}
            <span className="text-accent tabular-nums">{usd(monthly)}</span>. That is the whole argument for Act 3.
            Classification you used to ration, because each call cost real money and took real seconds, stops being a line
            item you have to defend.
          </p>
          <p className="text-muted text-[11px] mt-2">
            Honest caveat: the observed rate is what {FIREHOSE_CONCURRENCY} in flight produced against these recorded
            latencies, so treat it as a throughput artefact, not a property of Jev. The per decision cost is the number
            that travels.
          </p>
        </div>
      ) : null}

      {finishedNote ? <p className="text-muted text-xs">{finishedNote}</p> : null}

      <section>
        <div className="space-y-1.5">
          {rows.map((r) => {
            const open = expanded === r.i;
            const team = normalize(r.answers?.team, SUPPORT_QUESTIONS.team);
            const urgent = normalize(r.answers?.urgent, SUPPORT_QUESTIONS.urgent);
            const anger = normalize(r.answers?.anger, SUPPORT_QUESTIONS.anger);
            return (
              <div key={r.i} className="border bg-void transition-colors" style={{ borderColor: 'var(--border-subtle)' }}>
                <button
                  onClick={() => setExpanded(open ? null : r.i)}
                  className="w-full text-left p-2.5 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 hover:bg-elevated transition-colors"
                >
                  <span className="text-muted text-[10px] tabular-nums w-6 shrink-0">{String(r.i + 1).padStart(2, '0')}</span>
                  <span className="text-secondary text-xs flex-1 truncate">{r.text}</span>
                  <span className="flex items-center gap-1.5 shrink-0 flex-wrap">
                    <span className="text-[10px] px-1.5 py-0.5 border border-subtle" style={{ color: JEV_COLOR }}>
                      {team.label}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 border border-subtle text-muted">
                      {urgent.label === 'yes' ? 'today' : 'can wait'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 border border-subtle text-muted">{anger.label}</span>
                    <span className="text-muted text-[10px] tabular-nums w-12 text-right">{ms(r.latencyMs)}</span>
                  </span>
                </button>
                {open ? (
                  <div className="px-2.5 pb-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <AnswerCell name="team" spec={SUPPORT_QUESTIONS.team} answer={team} color={JEV_COLOR} showBars />
                      <AnswerCell name="urgent" spec={SUPPORT_QUESTIONS.urgent} answer={urgent} color={JEV_COLOR} showBars />
                      <AnswerCell name="anger" spec={SUPPORT_QUESTIONS.anger} answer={anger} color={JEV_COLOR} showBars />
                    </div>
                    <div className="text-muted text-[10px] mt-2 tabular-nums">
                      {ms(r.latencyMs)} · {usd(r.cost)}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        {!rows.length && !running ? <p className="text-muted text-xs">Nothing has come down the pipe yet.</p> : null}
      </section>
    </div>
  );
}

// ============================================================
// ACT 3: THE GATE
// One recorded pass through Jev, then the partition happens locally against
// the slider. Committing an escalation pulls the recorded challenger answers
// for exactly the items sitting above the line.
// ============================================================

interface GateRow {
  i: number;
  text: string;
  stage: 'queued' | 'inflight' | 'judged';
  jev?: RecordedSide;
  llm?: RecordedSide;
}

interface Partition {
  row: GateRow;
  unsure: string[];
  escalated: boolean;
  minConfidence: number | null;
}

const GATE_CONCURRENCY = 4;

function freshGateRows(): GateRow[] {
  return GATE_ITEMS.map((text, i) => ({ i, text, stage: 'queued' as const }));
}

function partitionRow(row: GateRow, threshold: number): Partition {
  const unsure: string[] = [];
  let min: number | null = null;
  if (row.stage !== 'judged' || !row.jev) {
    return { row, unsure, escalated: false, minConfidence: null };
  }
  for (const name of Object.keys(SUPPORT_QUESTIONS)) {
    const a = normalize(row.jev.answers?.[name], SUPPORT_QUESTIONS[name]);
    if (a.missing) {
      unsure.push(name);
      continue;
    }
    if (a.confidence === null) continue;
    if (min === null || a.confidence < min) min = a.confidence;
    if (a.confidence < threshold) unsure.push(name);
  }
  return { row, unsure, escalated: unsure.length > 0, minConfidence: min };
}

function Token({ n, color, dim }: { n: number; color: string; dim?: boolean }) {
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 text-[10px] tabular-nums border transition-all duration-500"
      style={{ borderColor: color, color, opacity: dim ? 0.35 : 1 }}
    >
      {n}
    </span>
  );
}

function Bin({
  title,
  color,
  count,
  caption,
  children,
}: {
  title: string;
  color: string;
  count: number;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border bg-void p-3 flex-1 min-w-0" style={{ borderColor: count > 0 ? color : 'var(--border-subtle)' }}>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <span className="font-pixel text-xs" style={{ color }}>
          {title}
        </span>
        <span className="font-pixel text-lg tabular-nums" style={{ color }}>
          {count}
        </span>
      </div>
      <div className="text-muted text-[10px] mb-2 leading-snug">{caption}</div>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  );
}

function ActGate() {
  const [threshold, setThreshold] = useState(0.85);
  const [challenger, setChallenger] = useState<Challenger>('gemini-flash');
  const [rows, setRows] = useState<GateRow[]>(freshGateRows);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const [committedAt, setCommittedAt] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const stopRef = useRef(false);
  const clockRef = useRef(makeClock());

  useEffect(() => {
    const clock = clockRef.current;
    return () => {
      stopRef.current = true;
      clock.cancelAll();
    };
  }, []);

  const challengerLabel = CHALLENGERS.find((c) => c.id === challenger)?.label || challenger;

  /* Switching challenger drops any escalation already on the rows. The recorded
     answers and their costs belong to one specific model, so mixing two of them
     into the same payoff arithmetic would quietly invent a batch nobody ran. */
  function pickChallenger(id: Challenger) {
    if (id === challenger) return;
    setChallenger(id);
    setCommittedAt(null);
    setRows((prev) => prev.map((r) => (r.llm ? { ...r, llm: undefined } : r)));
  }

  const scan = useCallback(async () => {
    if (scanning || escalating) return;
    stopRef.current = false;
    setScanned(false);
    setCommittedAt(null);
    setExpanded(null);
    setScanning(true);
    setRows(freshGateRows());

    let cursor = 0;

    const worker = async () => {
      for (;;) {
        if (stopRef.current) return;
        const i = cursor++;
        if (i >= GATE_ITEMS.length) return;
        const call = gateCall(i);
        setRows((prev) => prev.map((r) => (r.i === i ? { ...r, stage: 'inflight' } : r)));
        await clockRef.current.wait(call.latencyMs);
        if (stopRef.current) return;
        setRows((prev) => prev.map((r) => (r.i === i ? { ...r, stage: 'judged', jev: call } : r)));
      }
    };

    await Promise.all(Array.from({ length: GATE_CONCURRENCY }, worker));
    setScanning(false);
    if (!stopRef.current) setScanned(true);
  }, [scanning, escalating]);

  const partitions = useMemo(() => rows.map((r) => partitionRow(r, threshold)), [rows, threshold]);
  const judged = partitions.filter((p) => p.row.stage === 'judged' && p.row.jev);
  const escalatedSet = judged.filter((p) => p.escalated);
  const handledSet = judged.filter((p) => !p.escalated);

  const commit = useCallback(async () => {
    if (escalating || scanning) return;
    const targets = partitions.filter((p) => p.escalated).map((p) => p.row.i);
    if (!targets.length) return;
    stopRef.current = false;
    setEscalating(true);

    let cursor = 0;
    const frozen = threshold;
    const model = challenger;

    const worker = async () => {
      for (;;) {
        if (stopRef.current) return;
        const k = cursor++;
        if (k >= targets.length) return;
        const i = targets[k];
        const call = escalationCall(model, i);
        await clockRef.current.wait(call.latencyMs);
        if (stopRef.current) return;
        setRows((prev) => prev.map((r) => (r.i === i ? { ...r, llm: call } : r)));
      }
    };

    await Promise.all(Array.from({ length: GATE_CONCURRENCY }, worker));
    setEscalating(false);
    setCommittedAt(frozen);
  }, [escalating, scanning, partitions, threshold, challenger]);

  // ---- economics, all from costs the recorded run actually paid ----
  const econ = useMemo(() => {
    const total = judged.length;
    const reflexCost = judged.reduce((s, p) => s + (p.row.jev?.cost || 0), 0);
    const llmCalls = judged.filter((p) => p.row.llm);
    const escalationCost = llmCalls.reduce((s, p) => s + (p.row.llm?.cost || 0), 0);
    const avgLlm = llmCalls.length ? escalationCost / llmCalls.length : null;
    const actual = reflexCost + escalationCost;
    const counterfactual = avgLlm !== null && total > 0 ? avgLlm * total : null;
    const multiple = counterfactual !== null && actual > 0 ? counterfactual / actual : null;
    const jevLatency = total ? judged.reduce((s, p) => s + (p.row.jev?.latencyMs || 0), 0) / total : 0;
    const llmLatency = llmCalls.length
      ? llmCalls.reduce((s, p) => s + (p.row.llm?.latencyMs || 0), 0) / llmCalls.length
      : null;
    return { total, reflexCost, escalationCost, avgLlm, actual, counterfactual, multiple, llmCalls: llmCalls.length, jevLatency, llmLatency };
  }, [judged]);

  const rate = econ.total > 0 ? escalatedSet.length / econ.total : 0;
  const thresholdMoved = committedAt !== null && Math.abs(committedAt - threshold) > 0.001;

  return (
    <div className="space-y-6">
      <section>
        <h2 className="section-title">Put the reflex in front of the reasoning</h2>
        <p className="text-secondary text-sm leading-relaxed">
          Twelve messages went through Jev once. Every answer came back with a confidence number, so you get to draw a
          line: above it you act in code and nobody pays a frontier model, below it you escalate, and you escalate only
          the specific questions Jev flagged. Drag the threshold and the bins repartition instantly, because the
          judgements are already in your browser.
        </p>
      </section>

      {/* pipeline */}
      <section className="border border-subtle bg-surface p-4">
        <div className="flex flex-col md:flex-row md:items-stretch gap-3">
          <div className="border border-subtle bg-void p-3 md:w-48 shrink-0">
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <span className="font-pixel text-xs text-secondary">INCOMING</span>
              <span className="font-pixel text-lg tabular-nums text-secondary">
                {rows.filter((r) => r.stage === 'queued').length}
              </span>
            </div>
            <div className="text-muted text-[10px] mb-2 leading-snug">events nobody has looked at</div>
            <div className="flex flex-wrap gap-1">
              {rows.filter((r) => r.stage === 'queued').map((r) => (
                <Token key={r.i} n={r.i + 1} color="var(--text-muted)" dim />
              ))}
            </div>
          </div>

          <div className="flex md:flex-col items-center justify-center text-muted text-lg shrink-0">
            <span className="md:hidden">{'↓'}</span>
            <span className="hidden md:inline">{'→'}</span>
          </div>

          <div
            className="border bg-void p-3 md:w-48 shrink-0"
            style={{ borderColor: scanning ? JEV_COLOR : 'var(--border-subtle)' }}
          >
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <span className={`font-pixel text-xs ${scanning ? 'reflex-pulse' : ''}`} style={{ color: JEV_COLOR }}>
                JEV REFLEX
              </span>
              <span className="font-pixel text-lg tabular-nums" style={{ color: JEV_COLOR }}>
                {rows.filter((r) => r.stage === 'inflight').length}
              </span>
            </div>
            <div className="text-muted text-[10px] mb-2 leading-snug">
              {econ.jevLatency ? `${ms(econ.jevLatency)} average` : 'about 400ms each'}
            </div>
            <div className="flex flex-wrap gap-1">
              {rows.filter((r) => r.stage === 'inflight').map((r) => (
                <Token key={r.i} n={r.i + 1} color={JEV_COLOR} />
              ))}
            </div>
          </div>

          <div className="flex md:flex-col items-center justify-center text-muted text-lg shrink-0">
            <span className="md:hidden">{'↓'}</span>
            <span className="hidden md:inline">{'→'}</span>
          </div>

          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <Bin title="HANDLED IN CODE" color={OK_COLOR} count={handledSet.length} caption="confident enough to act on. No frontier call.">
              {handledSet.map((p) => (
                <Token key={p.row.i} n={p.row.i + 1} color={OK_COLOR} />
              ))}
            </Bin>
            <Bin
              title="ESCALATED"
              color={LLM_COLOR}
              count={escalatedSet.length}
              caption={`below the line, so ${challengerLabel} gets asked, about the unsure questions only.`}
            >
              {escalatedSet.map((p) => (
                <Token key={p.row.i} n={p.row.i + 1} color={LLM_COLOR} />
              ))}
            </Bin>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={scan} disabled={scanning || escalating} className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed">
            {scanning ? 'reading…' : scanned ? 'Run the batch again' : 'Run the batch through Jev'}
          </button>
          {scanned && escalatedSet.length > 0 ? (
            <button
              onClick={commit}
              disabled={escalating}
              className="btn-secondary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderColor: LLM_COLOR, color: LLM_COLOR }}
            >
              {escalating ? 'escalating…' : `Escalate ${escalatedSet.length} to ${challengerLabel}`}
            </button>
          ) : null}
        </div>
        {scanned ? (
          <p className="text-muted text-[11px] mt-2">
            Jev has already answered. Moving the slider repartitions what is on screen. In the run this was captured
            from, only the escalate step spent money on the challenger.
          </p>
        ) : null}
      </section>

      {/* threshold */}
      <section className="border border-subtle bg-surface p-4">
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <span className="text-secondary text-xs">confidence threshold</span>
          <span className="font-pixel text-2xl text-accent tabular-nums">{threshold.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min={0.5}
          max={0.99}
          step={0.01}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full accent-cyan-400"
          style={{ accentColor: JEV_COLOR }}
          aria-label="confidence threshold"
        />
        <div className="flex justify-between text-muted text-[10px] mt-1">
          <span>0.50 act on almost everything</span>
          <span>0.99 escalate almost everything</span>
        </div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {CHALLENGERS.map((c) => (
            <button
              key={c.id}
              onClick={() => pickChallenger(c.id)}
              className={`text-left border px-3 py-2 text-[11px] transition-colors ${
                c.id === challenger ? 'border-accent bg-elevated text-secondary' : 'border-subtle text-muted hover:border-muted'
              }`}
            >
              escalate to {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* payoff */}
      <section>
        <h3 className="section-title">The payoff</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <Stat
            label="escalation rate"
            value={econ.total ? `${Math.round(rate * 100)}%` : 'n/a'}
            sub={econ.total ? `${escalatedSet.length} of ${econ.total} items` : 'run the batch first'}
            color={LLM_COLOR}
          />
          <Stat
            label="batch cost, actual"
            value={econ.total ? usd(econ.actual) : 'n/a'}
            sub={econ.llmCalls ? `${usd(econ.reflexCost)} reflex, ${usd(econ.escalationCost)} escalation` : 'reflex only so far'}
            color={JEV_COLOR}
          />
          <Stat
            label="all frontier instead"
            value={econ.counterfactual !== null ? usd(econ.counterfactual) : 'n/a'}
            sub={econ.avgLlm !== null ? `${usd(econ.avgLlm)} per item, measured` : 'escalate to measure this'}
            color={LLM_COLOR}
          />
          <Stat
            label="multiple saved"
            value={econ.multiple !== null ? factor(econ.multiple) : 'n/a'}
            sub={
              econ.multiple === null
                ? 'needs a real frontier price'
                : econ.multiple < 1
                  ? 'you paid more than going straight to the frontier'
                  : 'on this batch, at this threshold'
            }
            color={econ.multiple !== null && econ.multiple < 1 ? LLM_COLOR : OK_COLOR}
          />
        </div>

        {econ.llmLatency !== null ? (
          <p className="text-muted text-xs mt-3 tabular-nums">
            Latency: {ms(econ.jevLatency)} for the reflex, {ms(econ.llmLatency)} when it escalated. The handled items never
            waited for the second number.
          </p>
        ) : null}

        {econ.llmCalls > 0 ? (
          <p className="text-muted text-[11px] mt-2 leading-relaxed">
            One wrinkle worth naming: every recorded escalation call asked all three questions, not only the unsure ones,
            so the escalation cost above is the price of a full call. A production gate that asks about one question
            would pay less than this. The number here is the pessimistic one.
          </p>
        ) : null}

        {thresholdMoved ? (
          <p className="text-[11px] mt-3" style={{ color: LLM_COLOR }}>
            You moved the threshold to {threshold.toFixed(2)} after escalating at {committedAt?.toFixed(2)}. The bins above
            are live, the costs are still the ones from the escalation you committed. Escalate again to resettle them.
          </p>
        ) : null}

        {econ.total > 0 ? (
          <div className="border border-subtle bg-surface p-4 mt-4">
            <p className="text-secondary text-sm leading-relaxed">
              {escalatedSet.length === 0
                ? `At ${threshold.toFixed(2)} nothing escalated. That is a real result, and it is also a warning: if a threshold never fires, it is not protecting you from anything. Push it up until the genuinely ambiguous items start falling through.`
                : escalatedSet.length === econ.total
                  ? `At ${threshold.toFixed(2)} everything escalated. You are paying full frontier price plus a Jev call on top. The reflex only earns its place when most of the work stops at it.`
                  : `At ${threshold.toFixed(2)}, ${handledSet.length} of ${econ.total} items never touched a frontier model, and ${escalatedSet.length} did. Slide it up and the escalation bill climbs; slide it down and you start acting on judgements Jev itself was not sure about. There is no correct number here. There is a number you can defend.`}
            </p>
          </div>
        ) : null}

        <div className="border border-subtle bg-surface p-4 mt-3">
          <p className="text-secondary text-sm leading-relaxed">
            This pattern has a name problem, so here is the plain version. For years the choice was binary: write a regex
            and accept that it will be wrong in ways you cannot see, or call a frontier model on every event and watch the
            bill. Jev sits in the gap, at roughly the cost of the regex and roughly the judgement of the cheap reasoning
            tier. The part that matters is not the price, it is that the answer arrives with a number attached saying how
            sure it is. That is the thing a regex never did, and it is what turns classification into routing: act on the
            part you are sure about, and spend real money only on the rest.
          </p>
        </div>
      </section>

      {/* per item detail */}
      {judged.length > 0 ? (
        <section>
          <h3 className="section-title">Item by item</h3>
          <div className="space-y-1.5">
            {partitions.map((p) => {
              const r = p.row;
              const open = expanded === r.i;
              const color = p.escalated ? LLM_COLOR : OK_COLOR;
              return (
                <div key={r.i} className="border bg-void" style={{ borderColor: 'var(--border-subtle)' }}>
                  <button
                    onClick={() => setExpanded(open ? null : r.i)}
                    className="w-full text-left p-2.5 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 hover:bg-elevated transition-colors"
                  >
                    <span className="shrink-0">
                      <Token n={r.i + 1} color={r.stage === 'judged' ? color : 'var(--text-muted)'} dim={r.stage !== 'judged'} />
                    </span>
                    <span className="text-secondary text-xs flex-1 truncate">{r.text}</span>
                    {r.stage === 'judged' && r.jev ? (
                      <span className="flex items-center gap-2 shrink-0">
                        <span className="text-muted text-[10px] tabular-nums">
                          min conf {p.minConfidence !== null ? p.minConfidence.toFixed(2) : 'n/a'}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 border" style={{ color, borderColor: color }}>
                          {p.escalated ? `escalate: ${p.unsure.join(', ')}` : 'handled'}
                        </span>
                      </span>
                    ) : (
                      <span className="text-[10px] shrink-0 text-muted">{r.stage}</span>
                    )}
                  </button>
                  {open ? (
                    <div className="px-2.5 pb-3 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {Object.keys(SUPPORT_QUESTIONS).map((name) => (
                          <AnswerCell
                            key={name}
                            name={name}
                            spec={SUPPORT_QUESTIONS[name]}
                            answer={normalize(r.jev?.answers?.[name], SUPPORT_QUESTIONS[name])}
                            color={p.unsure.includes(name) ? LLM_COLOR : JEV_COLOR}
                            showBars
                          />
                        ))}
                      </div>
                      {r.llm ? (
                        <div className="border p-3" style={{ borderColor: LLM_COLOR }}>
                          <div className="text-[10px] uppercase tracking-wider mb-2" style={{ color: LLM_COLOR }}>
                            {r.llm.model || challengerLabel} answered the questions Jev was unsure about
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {p.unsure.map((name) => (
                              <AnswerCell
                                key={name}
                                name={name}
                                spec={SUPPORT_QUESTIONS[name] || { type: 'noul', instructions: name }}
                                answer={normalize(r.llm?.answers?.[name], SUPPORT_QUESTIONS[name] || { type: 'noul', instructions: name })}
                                color={LLM_COLOR}
                              />
                            ))}
                          </div>
                          <div className="text-muted text-[10px] mt-2 tabular-nums">
                            {ms(r.llm.latencyMs)}, {usd(r.llm.cost)}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}

// ============================================================
// SHELL
// ============================================================

type TabId = 'race' | 'firehose' | 'gate';

const TABS: { id: TabId; n: string; label: string; sub: string }[] = [
  { id: 'race', n: '01', label: 'The Race', sub: 'one input, two models' },
  { id: 'firehose', n: '02', label: 'The Firehose', sub: 'classification as a rounding error' },
  { id: 'gate', n: '03', label: 'The Gate', sub: 'reflex first, reasoning only when needed' },
];

const SPEND_RATIO = RUN.spend.jev > 0 ? RUN.spend.challengers / RUN.spend.jev : null;

function Disclaimer() {
  return (
    <section className="mb-8 border border-accent bg-elevated p-5">
      <h2 className="font-pixel text-base text-accent text-glow mb-3">This is a recording of a real run</h2>
      <div className="text-secondary text-sm leading-relaxed space-y-3">
        <p>
          Not a simulation. Not numbers I made up and typed in because they looked about right. One run happened, against
          the real APIs, and this page replays what came back.
        </p>
        <p>
          Every latency and every cost you are about to see was measured on{' '}
          <span className="text-accent">{CAPTURED_ON}</span>. Jev through OpenRouter&apos;s decisions endpoint, the
          challengers through chat completions on their default settings.
        </p>
        <p>
          It is recorded rather than live because a public page that calls a paid API on every click is a bill with a
          stranger&apos;s finger on it.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Stat label="the whole run cost" value={usd(RUN.spend.total)} sub="real money, already spent" />
        <Stat label="every jev call in it" value={usd(RUN.spend.jev)} sub="all three acts, together" color={JEV_COLOR} />
        <Stat label="the challengers" value={usd(RUN.spend.challengers)} sub="the same work, text models" color={LLM_COLOR} />
      </div>

      {SPEND_RATIO !== null ? (
        <p className="text-secondary text-sm leading-relaxed mt-3">
          The challengers cost <span className="font-pixel text-accent tabular-nums">{factor(SPEND_RATIO)}</span> what Jev
          cost for the same work. That split is the argument the rest of this page spends three acts making.
        </p>
      ) : null}
    </section>
  );
}

export default function Client() {
  const [tab, setTab] = useState<TabId>('race');

  return (
    <div>
      <style>{`
        @keyframes reflex-pulse-kf {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }
        .reflex-pulse { animation: reflex-pulse-kf 1s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .reflex-pulse { animation: none; }
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="font-pixel text-4xl mb-2 text-glow" style={{ color: JEV_COLOR }}>
          REFLEX
        </div>
        <p className="text-secondary max-w-xl mx-auto text-sm leading-relaxed">
          TypeSafe shipped a model that does not write. You hand Jev some messy state and up to six typed questions, and it
          hands back typed answers with calibrated probabilities in about 400 milliseconds for a fraction of a cent.
          Kahneman would call it System 1. This page races it, floods it, and then puts it where it actually belongs: in
          front of the expensive thinking.
        </p>
        <p className="text-muted text-xs mt-3">
          by{' '}
          <a href="https://thoughts.jock.pl" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            Pawel Jozefiak
          </a>
        </p>
      </div>

      <Disclaimer />

      {/* Tabs */}
      <div className="flex mb-8 border-b border-subtle overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 sm:px-5 py-3 text-left transition-colors border-b-2 shrink-0 ${
              tab === t.id ? 'text-accent border-accent' : 'text-muted border-transparent hover:text-secondary'
            }`}
          >
            <span className="block text-[10px] tabular-nums opacity-60">{t.n}</span>
            <span className="block text-sm font-medium">{t.label}</span>
            <span className="block text-[10px] text-muted">{t.sub}</span>
          </button>
        ))}
      </div>

      {tab === 'race' ? <ActRace /> : null}
      {tab === 'firehose' ? <ActFirehose /> : null}
      {tab === 'gate' ? <ActGate /> : null}

      {/* What this is not */}
      <section className="mt-12 border border-subtle bg-surface p-5">
        <h3 className="section-title">What this is not</h3>
        <ul className="text-muted text-xs space-y-2 leading-relaxed">
          <li>
            <span className="text-secondary">Jev cannot write a sentence.</span> No summaries, no replies, no explanations.
            It answers questions you defined in advance and nothing else. If you need prose, you still need a text model.
          </li>
          <li>
            <span className="text-secondary">The context window is 32k</span> and a choice question tops out at 255
            options. Long documents and high cardinality routing are both outside what it does.
          </li>
          <li>
            <span className="text-secondary">The calls were not clean.</span> TypeSafe was returning 529 overloaded on
            roughly four calls in five during launch week, and several of the Jev answers in this recording took more than
            one attempt to get.
          </li>
          <li>
            <span className="text-secondary">The benchmarks are TypeSafe&apos;s own.</span> Nobody independent has
            reproduced them yet. Treat the speed and price claims as measured here, on these calls, and nothing broader.
          </li>
          <li>
            <span className="text-secondary">A calibrated probability is not the truth.</span> A confident wrong answer is
            still a wrong answer. The confidence number tells you how often it should be right at that level, not whether
            this particular one is.
          </li>
          <li>
            <span className="text-secondary">This is not a frontier model replacement.</span> The argument on this page is
            the opposite: put it in front of one.
          </li>
        </ul>
      </section>

      {/* Sources */}
      <section className="mt-6 border border-subtle bg-surface p-5">
        <h3 className="section-title">Sources</h3>
        <ul className="text-xs space-y-2">
          <li>
            <a
              href="https://typesafe.ai/blog/introducing-system-one-models-and-jev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              TypeSafe: Introducing System One Models and Jev
            </a>
            <span className="text-muted"> the announcement, 2026-09-15</span>
          </li>
          <li>
            <a
              href="https://openrouter.ai/~typesafe/jev-latest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              OpenRouter: typesafe/jev-latest
            </a>
            <span className="text-muted"> pricing and availability</span>
          </li>
          <li>
            <a href="https://youtu.be/F3YXg7AaKWE" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Theo: what a System One model actually is
            </a>
            <span className="text-muted"> the explainer that made it click</span>
          </li>
        </ul>
        <p className="text-muted text-[10px] mt-3 leading-relaxed">
          Every number on this page is read from{' '}
          <code className="text-secondary">recorded-run.json</code>, captured on {CAPTURED_ON} through a small proxy that
          held the API key. The page itself makes no network calls at all.
        </p>
      </section>

      {/* Back link */}
      <div className="text-center pt-6 mt-8 border-t border-subtle">
        <Link href="/experiments" className="text-muted text-sm hover:text-accent transition-colors">
          {'←'} All Experiments
        </Link>
      </div>
    </div>
  );
}

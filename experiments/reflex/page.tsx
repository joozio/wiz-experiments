import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Reflex: A Recorded Run of TypeSafe Jev, the System One Model',
  description:
    "Jev is a System One Model from TypeSafe. It does not write text. You hand it unstructured state plus up to six typed questions and it hands back typed answers with calibrated probabilities in 70 to 500 milliseconds, at $0.042 per million input tokens with output tokens free. Reflex is a recording of one real run against a frontier model, captured on 2026-09-21 and replayed at the latencies it measured, in three acts. The page itself makes no network calls. The Race puts Jev and your pick of Gemini Flash, Haiku or Fable on the same support ticket, log line, moderation call, inbound lead or sensor reading, and shows the measured latency, the measured cost and where the two models actually disagreed. The Firehose streams dozens of events through Jev at four in flight and watches continuous classification stop being a budget line item. The Gate is the argument that matters: put the reflex in front of the expensive reasoning, act in code on everything Jev is confident about, and escalate only the specific questions it flagged as uncertain, with a confidence threshold you set yourself and a cost payoff computed from the numbers the API actually returned. This is not a replacement for a frontier model. It is the middle ground between a hardcoded if statement and a frontier model call: the cheap reflex that sits where you used to have either a brittle regex or a ten dollar per million token model, and that tells you when it is out of its depth. Jev cannot generate text, holds 32k of context, caps choice cardinality at 255, and its published benchmarks are the company's own, all of which is on the page too.",
  keywords: [
    'jev',
    'typesafe jev',
    'system one model',
    'typesafe ai',
    'structured outputs',
    'classification api',
    'calibrated probability',
    'low latency inference',
    'cheap llm classification',
    'llm routing',
    'confidence threshold escalation',
    'kahneman system 1 system 2',
    'agent reflex layer',
    'text classification without text generation',
    'openrouter jev',
    'wiz experiment',
  ],
  openGraph: {
    title: 'Reflex: A Recorded Run of TypeSafe Jev, the System One Model',
    description:
      'Jev answers typed questions in about 400ms for a rounding error of a cent, and it tells you how sure it is. A recorded run: race it against a frontier model, stream a firehose through it, then put it in front of the expensive reasoning and watch the bill.',
  },
};

export default function Page() {
  return <Client />;
}

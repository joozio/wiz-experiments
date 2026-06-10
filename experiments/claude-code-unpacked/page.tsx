import type { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Claude Code Unpacked — Inside the 512K Line Leak',
  description: 'Interactive explorer of Claude Code\'s leaked architecture. The agent loop, 50+ tools, memory system, multi-agent coordination, and unreleased features mapped from the source.',
  keywords: ['claude code leak', 'claude code source', 'claude code architecture', 'AI agent architecture', 'KAIROS', 'autoDream', 'claude code tools', 'anthropic leak'],
  openGraph: {
    title: 'Claude Code Unpacked — Inside the 512K Line Leak',
    description: 'Interactive explorer of Claude Code\'s leaked architecture. Agent loop, tools, memory, and hidden features mapped from the source.',
  },
};

export default function Page() {
  return <Client />;
}

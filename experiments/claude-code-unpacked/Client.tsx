'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const DT_POST_URL = 'https://thoughts.jock.pl/p/claude-code-source-leak-what-to-learn-ai-agents-2026';

// ─── DATA ─────────────────────────────────────────────────────

const AGENT_LOOP_STEPS = [
  { id: 1, label: 'Input', icon: '⌨️', title: 'User Input', desc: 'User types a message or pipes input through stdin. Keyboard input comes from Ink\'s TextInput component. In non-interactive mode, reads from piped stdin.', file: 'src/components/TextInput.tsx' },
  { id: 2, label: 'Message', icon: '💬', title: 'Message Construction', desc: 'Raw text is wrapped into a structured message with role, content, and metadata. System reminders, tool results, and context get injected here.', file: 'src/core/message.ts' },
  { id: 3, label: 'History', icon: '📜', title: 'History Assembly', desc: 'Full conversation history is assembled. CLAUDE.md gets reinserted on every turn change, not just at the start. This keeps instructions active even in long conversations.', file: 'src/core/history.ts' },
  { id: 4, label: 'System', icon: '🧠', title: 'System Prompt', desc: 'System prompt includes tool definitions, permission rules, environment info, date, and behavioral instructions. Anti-distillation fake tools may be injected here.', file: 'src/core/system.ts' },
  { id: 5, label: 'Cache', icon: '💾', title: 'Prompt Cache', desc: 'Cache breakpoints are set to maximize cache hit rates. Sub-agents share the same cache prefix and branch only at task-specific instructions. 14 cache-break vectors are monitored.', file: 'src/services/cache.ts' },
  { id: 6, label: 'API', icon: '🔗', title: 'API Request', desc: 'Request sent to Claude via the QueryEngine (~46K lines). Includes streaming, token tracking, client attestation hashes, and anti-distillation flags.', file: 'src/core/QueryEngine.ts' },
  { id: 7, label: 'Stream', icon: '📡', title: 'Token Streaming', desc: 'Response tokens stream back in real-time. Terminal rendering uses game-engine techniques: Int32Array char pools, bitmask metadata, cursor optimization for 50x performance.', file: 'src/ink/print.ts' },
  { id: 8, label: 'Tools?', icon: '🔧', title: 'Tool Call Check', desc: 'If the response includes tool calls, each one is validated against permission gates (5-level cascade: policy → flags → local → project → user) before execution.', file: 'src/core/Tool.ts' },
  { id: 9, label: 'Execute', icon: '⚡', title: 'Tool Execution', desc: 'Approved tools run with sandboxing. File reads are deduplicated. Large results get offloaded to disk with context-only previews. Results feed back into the loop.', file: 'src/tools/' },
  { id: 10, label: 'Loop', icon: '🔄', title: 'Agent Loop', desc: 'Tool results are appended to history and the model is called again. This continues until no more tool calls are made. Compaction triggers if context fills up (5 strategies).', file: 'src/core/loop.ts' },
  { id: 11, label: 'Render', icon: '🖥️', title: 'Final Render', desc: 'Final response rendered to terminal. Hooks fire (post-response events). Session state is persisted. The agent awaits the next user input.', file: 'src/components/Output.tsx' },
];

const GOD_FILES = [
  { name: 'QueryEngine.ts', lines: 46000, color: '#06b6d4', desc: 'Core LLM API engine, streaming, token tracking' },
  { name: 'Tool.ts', lines: 29000, color: '#a855f7', desc: 'Agent tool types, permission schemas' },
  { name: 'commands.ts', lines: 25000, color: '#22c55e', desc: 'Slash command registration and execution' },
  { name: 'print.ts', lines: 5594, color: '#f59e0b', desc: 'Terminal rendering, game-engine techniques' },
  { name: 'history.ts', lines: 4200, color: '#ec4899', desc: 'Conversation history and CLAUDE.md reinsertion' },
  { name: 'loop.ts', lines: 3800, color: '#ef4444', desc: 'Agent loop, compaction, tool orchestration' },
];

const LEAK_TIMELINE = [
  { time: '~22:00 CET', event: 'npm v2.1.88 published with 59.8MB source map', type: 'leak' },
  { time: '~22:30', event: 'Security researcher @Fried_rice discovers the source map', type: 'discovery' },
  { time: '~23:00', event: 'Source mirrored to GitHub, begins going viral', type: 'spread' },
  { time: '~23:30', event: 'Repo hits 50,000+ stars in under 2 hours', type: 'spread' },
  { time: '~00:00', event: 'Anthropic pulls npm package, starts DMCA takedowns', type: 'response' },
  { time: '~00:30', event: 'Cloudflare R2 bucket taken down', type: 'response' },
  { time: '~02:00', event: 'Repo reaches 84,000+ stars. Fastest-growing in GitHub history', type: 'spread' },
  { time: '~06:00', event: 'Anthropic official statement: "packaging issue caused by human error"', type: 'response' },
];

const TOOL_CATEGORIES = [
  {
    name: 'File Operations',
    color: '#22c55e',
    tools: [
      { name: 'FileRead', desc: 'Read files with line numbers, image support, PDF parsing. Reads up to 2000 lines by default.' },
      { name: 'FileEdit', desc: 'Exact string replacements in files. Requires reading first. Fails if old_string is not unique.' },
      { name: 'FileWrite', desc: 'Write/overwrite files. Must read existing files first. Prefers Edit for modifications.' },
      { name: 'Glob', desc: 'Fast file pattern matching. Supports **/*.js patterns. Returns paths sorted by modification time.' },
      { name: 'Grep', desc: 'Content search built on ripgrep. Full regex, file type filters, multiline mode. Never use bash grep.' },
      { name: 'NotebookEdit', desc: 'Edit Jupyter notebook cells. Add, replace, or delete cells by index.' },
    ]
  },
  {
    name: 'Execution',
    color: '#f59e0b',
    tools: [
      { name: 'Bash', desc: 'Execute shell commands with timeout (max 10min). Working directory persists between calls.' },
      { name: 'PowerShell', desc: 'Windows PowerShell execution equivalent.' },
      { name: 'REPL', desc: 'Interactive REPL for language evaluation.' },
    ]
  },
  {
    name: 'Search & Web',
    color: '#3b82f6',
    tools: [
      { name: 'WebFetch', desc: 'Fetch and analyze web content via AI. Converts HTML to markdown. 15-minute cache.' },
      { name: 'WebSearch', desc: 'Search the web for current information.' },
      { name: 'WebBrowser', desc: 'Full browser automation via Playwright. Feature-flagged.' },
      { name: 'ToolSearch', desc: 'Fetch schemas for deferred tools. Keyword or exact name matching.' },
    ]
  },
  {
    name: 'Agents & Tasks',
    color: '#a855f7',
    tools: [
      { name: 'Agent', desc: 'Spawn sub-agents with isolated contexts and specific tool permissions. Share prompt cache.' },
      { name: 'SendMessage', desc: 'Continue a previously spawned agent by ID or name.' },
      { name: 'TaskCreate', desc: 'Create tracked tasks for progress management.' },
      { name: 'TaskUpdate', desc: 'Update task status (in_progress, completed, etc.).' },
      { name: 'TaskGet', desc: 'Get task details by ID.' },
      { name: 'TaskList', desc: 'List all tasks in the current session.' },
      { name: 'TaskStop', desc: 'Stop a running task.' },
      { name: 'TaskOutput', desc: 'Get the output of a completed task.' },
      { name: 'TeamCreate', desc: 'Create a persistent team of agents.' },
      { name: 'TeamDelete', desc: 'Delete a persistent team.' },
      { name: 'ListPeers', desc: 'List connected peer agents. Feature-flagged.' },
    ]
  },
  {
    name: 'Planning',
    color: '#06b6d4',
    tools: [
      { name: 'EnterPlanMode', desc: 'Switch to plan-only mode. No edits until plan is approved.' },
      { name: 'ExitPlanMode', desc: 'Leave plan mode and begin execution.' },
      { name: 'EnterWorktree', desc: 'Create isolated git worktree for safe experimentation.' },
      { name: 'ExitWorktree', desc: 'Leave worktree, optionally merging changes.' },
      { name: 'VerifyPlanExecution', desc: 'Verify plan was executed correctly. Feature-flagged.' },
    ]
  },
  {
    name: 'System',
    color: '#ef4444',
    tools: [
      { name: 'AskUserQuestion', desc: 'Prompt user for clarification when genuinely stuck.' },
      { name: 'TodoWrite', desc: 'Write and manage TODO items.' },
      { name: 'Skill', desc: 'Execute a registered skill by name with optional arguments.' },
      { name: 'Config', desc: 'Read and modify Claude Code configuration.' },
      { name: 'RemoteTrigger', desc: 'Create scheduled remote agents on cron. Feature-flagged.' },
      { name: 'CronCreate/Delete/List', desc: 'Manage cron-scheduled tasks. Feature-flagged.' },
      { name: 'Snip', desc: 'Capture and share code snippets. Feature-flagged.' },
    ]
  },
  {
    name: 'Experimental',
    color: '#ec4899',
    tools: [
      { name: 'Sleep', desc: 'Pause execution for a specified duration.' },
      { name: 'Brief', desc: 'Generate a brief summary of current context.' },
      { name: 'LSP', desc: 'Language Server Protocol integration. Feature-flagged.' },
      { name: 'PushNotification', desc: 'Send push notifications to connected devices. Feature-flagged.' },
      { name: 'Monitor', desc: 'Monitor system resources and processes. Feature-flagged.' },
      { name: 'SubscribePR', desc: 'Subscribe to pull request updates. Feature-flagged.' },
    ]
  },
];

const HIDDEN_FEATURES = [
  { name: 'KAIROS', emoji: '👁️', status: 'unreleased', desc: 'Always-on background daemon. Receives periodic tick prompts, maintains append-only daily logs, subscribes to GitHub webhooks, acts proactively. 15-second blocking budget. 5-minute cron refresh. Referenced 150+ times in source.', details: 'The most significant unreleased feature. Transforms Claude Code from a reactive CLI into a persistent agent that works when you\'re not looking. Includes AFK mode adjustments and push notification integration.' },
  { name: 'autoDream', emoji: '💤', status: 'unreleased', desc: 'Background memory consolidation engine. Runs as a forked subagent with read-only access. Merges observations, removes contradictions, converts vague insights to concrete facts.', details: 'Three gates: 24h since last run, 5+ sessions completed, consolidation lock available. Four phases: orient (scan memory), gather (extract from logs), consolidate (write/update), prune (keep under 200 lines / 25KB).' },
  { name: 'Coordinator', emoji: '🎯', status: 'unreleased', desc: 'Lead agent spawns parallel workers in isolated git worktrees. Workers share prompt cache prefix, branching only at task-specific instructions. Structured XML communication.', details: 'Emphasizes "parallelism is your superpower." Sub-agents share the same cache to reduce costs. Each worker gets its own isolated context and restricted tool permissions. Results synthesized by the lead.' },
  { name: 'Buddy', emoji: '🐣', status: 'april-fools', desc: 'Virtual pet that lives in your terminal. 18 species across rarity tiers (60% common to 1% legendary). Procedural stats: DEBUGGING, PATIENCE, CHAOS, WISDOM, SNARK.', details: 'Species derived deterministically from user account ID hash. Originally scheduled for April 1-7 rollout. Probably won\'t ship due to the leak spoiling the surprise.' },
  { name: 'ULTRAPLAN', emoji: '🧪', status: 'unreleased', desc: '30-minute remote planning sessions on Opus-class models. Offloads complex planning to cloud container runtime. You approve the result from your browser.', details: 'Designed for tasks too complex for local planning. Runs remotely with billing controls. Pairs with ULTRAREVIEW for automated code review (~$25/PR).' },
  { name: 'Voice Mode', emoji: '🎤', status: 'partial', desc: 'Push-to-talk voice interface. Dedicated CLI entry point for voice commands. Already referenced in system flags.', details: 'Voice input processing and transcription built into the CLI. Flagged but partially implemented.' },
  { name: 'Undercover', emoji: '🕵️', status: 'active-internal', desc: 'Strips Anthropic attribution from open-source contributions. Hides codenames (Capybara, Tengu, Fennec), Slack channels, internal version references.', details: 'One-way flag: can force ON but cannot disable externally ("NO force-OFF"). Confirms Anthropic employees actively use Claude Code for OSS contributions. Ironically, this anti-leak system leaked.' },
  { name: 'Teleport', emoji: '🌀', status: 'shipped', desc: 'Send your session across the network to another device. Move from CLI to phone or web seamlessly.', details: 'Uses Bridge infrastructure. Session state serialized and transferred. Allows continuing work on Claude Code for Web.' },
  { name: 'Daemon Mode', emoji: '👻', status: 'unreleased', desc: 'Run sessions in the background with --bg flag. Uses tmux under the hood. Sessions communicate over Unix domain sockets (UDS Inbox).', details: 'Foundation for KAIROS. Background sessions can receive messages, trigger actions, and coordinate with foreground sessions.' },
];

const ARCHITECTURE_SECTIONS = [
  { name: 'Memory System', emoji: '🧠', desc: 'Three-layer skeptical memory', details: ['Layer 1: MEMORY.md index — lightweight pointers, always in context (~150 chars/entry)', 'Layer 2: Topic files — detailed knowledge, fetched on-demand', 'Layer 3: Raw transcripts — never re-read, only grep\'d for specific identifiers', 'Key: "Skeptical memory" — agent verifies memory against codebase before acting', 'Strict Write Discipline — only updates index after confirmed successful writes', 'Prevents context entropy (performance degradation in long sessions)'] },
  { name: 'Permission System', emoji: '🔐', desc: 'Five-level cascade with risk classification', details: ['Cascade: Policy → Flags → Local → Project → User', 'Risk levels: LOW (auto-approve) → MEDIUM (notify) → HIGH (review required)', '"YOLO classifier" for fast ML-based auto-approval of low-risk actions', 'Protected files: .gitconfig, .bashrc get special treatment', 'PermissionGate wraps every tool operation', 'AFK Mode: adjusts autonomy when user is away'] },
  { name: 'Context Management', emoji: '📦', desc: 'Five compaction strategies, cache optimization', details: ['Five different compaction strategies when context fills up', 'CLAUDE.md reinserted on every turn change (not just at start)', '14 cache-break vectors tracked with sticky latches', 'Sub-agents share prompt cache prefix (branch at task message)', 'Large tool results written to disk, preview + file ref in context', 'File-read deduplication: skip unchanged files'] },
  { name: 'Anti-Distillation', emoji: '🛡️', desc: 'Defenses against model training on API traffic', details: ['Fake tool injection: decoy tool definitions silently added to system prompts', 'Connector-text summarization: reasoning chains signed + summarized, not raw', 'Client attestation: Zig-level HTTP hashes prove legitimate binary origin', 'Flag: anti_distillation: [\'fake_tools\'] in API requests', 'Easily bypassed via env vars or MITM proxies', 'Legal protection likely more effective than technical measures'] },
  { name: 'Terminal Rendering', emoji: '🖥️', desc: 'Game-engine techniques for 50x performance', details: ['Int32Array character pools for rapid storage', 'Bitmask metadata for character attributes', 'Cursor-move optimization minimizes text-width calculations', 'Streaming token rendering without UI lag', 'print.ts: 5,594 lines, single functions reaching 3,167 lines', 'Borrowed from graphics programming, not typical TUI approaches'] },
  { name: 'Feature Flags', emoji: '🚩', desc: 'GrowthBook-based feature management', details: ['44+ compile-time feature flags identified', 'GrowthBook (open-source) replaced StatSig (acquired by OpenAI)', '1,000+ flag references scattered across 250 files', 'Inline checks in business logic (makes debugging hard)', 'Environment variable sprawl throughout codebase', 'No centralized secret sanitization before logging'] },
];

const WHAT_I_BUILT = [
  { name: 'Blocking Budget', desc: '15-second window, max 2 proactive messages, deferred queue. Reactive messages bypass.', lines: '~50', inspired: 'KAIROS' },
  { name: 'Semantic Memory', desc: 'Local Qwen 9B clusters and merges observations during idle time. 50% safety cap per section.', lines: '~570', inspired: 'autoDream' },
  { name: 'Frustration Detection', desc: '21 regex patterns, 3 action tiers (back off / acknowledge / simplify). 5ms per call.', lines: '~180', inspired: 'userPromptKeywords.ts' },
  { name: 'Cache Monitor', desc: 'Tracks hit rates, estimates savings, identifies 14 cache-break vectors, daily metrics.', lines: '~200', inspired: 'promptCacheBreakDetection.ts' },
  { name: 'Adversarial Verify', desc: 'Two-phase: existence check + adversarial challenge. Separate agent tries to break output.', lines: '~140', inspired: 'Coordinator Mode' },
];

// ─── VISUALIZATION COMPONENTS ────────────────────────────────

function CodebaseBarChart() {
  const maxLines = GOD_FILES[0].lines;
  return (
    <div className="mt-6 mb-2">
      <h4 className="text-xs font-mono text-gray-500 mb-3">Largest files by lines of code</h4>
      <div className="space-y-2">
        {GOD_FILES.map(f => (
          <div key={f.name} className="group">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-gray-400 w-[130px] shrink-0 truncate">{f.name}</span>
              <div className="flex-1 h-5 bg-gray-900 rounded overflow-hidden relative">
                <div
                  className="h-full rounded transition-all duration-700 ease-out"
                  style={{ width: `${(f.lines / maxLines) * 100}%`, backgroundColor: f.color + 'cc' }}
                />
              </div>
              <span className="text-[10px] font-mono text-gray-600 w-[45px] text-right shrink-0">{(f.lines / 1000).toFixed(f.lines >= 10000 ? 0 : 1)}K</span>
            </div>
            <p className="text-[10px] text-gray-600 ml-[142px] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeakTimeline() {
  const typeColors: Record<string, string> = {
    leak: 'border-red-500 bg-red-500/10',
    discovery: 'border-yellow-500 bg-yellow-500/10',
    spread: 'border-cyan-500 bg-cyan-500/10',
    response: 'border-gray-500 bg-gray-500/10',
  };
  const dotColors: Record<string, string> = {
    leak: 'bg-red-500',
    discovery: 'bg-yellow-500',
    spread: 'bg-cyan-500',
    response: 'bg-gray-500',
  };

  return (
    <div className="mt-6">
      <h4 className="text-xs font-mono text-gray-500 mb-4">How the leak unfolded — March 31, 2026</h4>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[52px] top-2 bottom-2 w-px bg-gray-800" />
        <div className="space-y-3">
          {LEAK_TIMELINE.map((e, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-[10px] font-mono text-gray-600 w-[44px] shrink-0 text-right pt-1">{e.time}</span>
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColors[e.type]}`} />
              <div className={`flex-1 px-3 py-1.5 rounded border text-xs text-gray-300 ${typeColors[e.type]}`}>
                {e.event}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MemoryLayerDiagram() {
  const layers = [
    { name: 'MEMORY.md Index', size: '~150 chars/entry', loaded: 'Always in context', color: 'border-cyan-500 bg-cyan-500/10', glow: 'shadow-[0_0_12px_rgba(0,255,255,0.15)]' },
    { name: 'Topic Files', size: 'Variable', loaded: 'Fetched on-demand', color: 'border-blue-500 bg-blue-500/10', glow: '' },
    { name: 'Raw Transcripts', size: 'Unbounded', loaded: 'Only grep\'d', color: 'border-gray-600 bg-gray-600/10', glow: '' },
  ];

  return (
    <div className="mt-4 mb-2">
      <h4 className="text-xs font-mono text-gray-500 mb-3">Three-layer memory architecture</h4>
      <div className="space-y-2">
        {layers.map((l, i) => (
          <div key={l.name} className="relative">
            <div className={`border rounded-lg p-3 ${l.color} ${l.glow}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-white">L{i + 1}: {l.name}</span>
                  <span className="text-[10px] text-gray-500 ml-2">{l.size}</span>
                </div>
                <span className="text-[10px] font-mono text-gray-500">{l.loaded}</span>
              </div>
            </div>
            {i < layers.length - 1 && (
              <div className="flex justify-center py-0.5">
                <span className="text-gray-700 text-xs">↓</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 px-3 py-2 rounded border border-yellow-800/40 bg-yellow-900/10">
        <p className="text-[10px] text-yellow-500/80 font-mono">Key principle: Memory is a HINT, not a fact. Agent verifies against codebase before acting.</p>
      </div>
    </div>
  );
}

function PermissionCascade() {
  const levels = [
    { name: 'Policy', desc: 'Organization-wide rules', color: 'bg-red-500' },
    { name: 'Flags', desc: 'Feature flag overrides', color: 'bg-orange-500' },
    { name: 'Local', desc: 'Machine-level settings', color: 'bg-yellow-500' },
    { name: 'Project', desc: 'Per-project .claude/', color: 'bg-green-500' },
    { name: 'User', desc: 'Runtime user choices', color: 'bg-cyan-500' },
  ];

  return (
    <div className="mt-4 mb-2">
      <h4 className="text-xs font-mono text-gray-500 mb-3">Permission cascade (highest priority first)</h4>
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {levels.map((l, i) => (
          <div key={l.name} className="flex items-center shrink-0">
            <div className="text-center">
              <div className={`w-2 h-8 rounded-full mx-auto ${l.color}`} style={{ opacity: 1 - i * 0.15 }} />
              <div className="text-[10px] font-mono text-gray-400 mt-1">{l.name}</div>
              <div className="text-[9px] text-gray-600">{l.desc}</div>
            </div>
            {i < levels.length - 1 && <span className="text-gray-700 text-xs mx-1">→</span>}
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-3">
        {['LOW', 'MEDIUM', 'HIGH'].map((risk, i) => (
          <div key={risk} className={`flex-1 text-center py-1.5 rounded text-[10px] font-mono border ${
            i === 0 ? 'border-green-800 text-green-500 bg-green-500/5' :
            i === 1 ? 'border-yellow-800 text-yellow-500 bg-yellow-500/5' :
            'border-red-800 text-red-500 bg-red-500/5'
          }`}>
            {risk}
            <div className="text-[9px] text-gray-600 mt-0.5">
              {i === 0 ? 'auto-approve' : i === 1 ? 'notify user' : 'require approval'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CodeQualityGauge() {
  return (
    <div className="mt-6">
      <h4 className="text-xs font-mono text-gray-500 mb-3">Code quality snapshot</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: 'Quality', value: '7/10', color: 'text-green-400' },
          { label: 'any usage', value: '38', color: 'text-green-400' },
          { label: 'God files', value: '6+', color: 'text-yellow-400' },
          { label: 'TODO comments', value: 'many', color: 'text-yellow-400' },
        ].map(m => (
          <div key={m.label} className="bg-gray-900/60 border border-gray-800 rounded p-2.5 text-center">
            <div className={`text-base font-bold font-mono ${m.color}`}>{m.value}</div>
            <div className="text-[10px] text-gray-600 mt-0.5">{m.label}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="bg-gray-900/60 border border-gray-800 rounded p-2.5">
          <div className="text-[10px] font-mono text-gray-500 mb-1">Good</div>
          <div className="text-[10px] text-gray-400 space-y-0.5">
            <div>Type safety solid</div>
            <div>Modern async patterns</div>
            <div>258 .then() chains only</div>
            <div>Uses Biome (248 ignores)</div>
          </div>
        </div>
        <div className="bg-gray-900/60 border border-gray-800 rounded p-2.5">
          <div className="text-[10px] font-mono text-gray-500 mb-1">Concerning</div>
          <div className="text-[10px] text-gray-400 space-y-0.5">
            <div>1,000+ feature flag refs</div>
            <div>Env variable sprawl</div>
            <div>No secret sanitization</div>
            <div>No test files in leak</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolDistributionViz() {
  const totalTools = TOOL_CATEGORIES.reduce((sum, c) => sum + c.tools.length, 0);
  return (
    <div className="mb-4">
      <div className="flex h-4 rounded-full overflow-hidden border border-gray-800">
        {TOOL_CATEGORIES.map(c => (
          <div
            key={c.name}
            style={{ width: `${(c.tools.length / totalTools) * 100}%`, backgroundColor: c.color + 'cc' }}
            title={`${c.name}: ${c.tools.length}`}
            className="transition-all hover:brightness-125"
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-2">
        {TOOL_CATEGORIES.map(c => (
          <div key={c.name} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
            <span className="text-[10px] text-gray-600 font-mono">{c.name} ({c.tools.length})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SECTION COMPONENTS ──────────────────────────────────────

function StatCounter({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-bold text-cyan-400 font-mono">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function AgentLoopSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= AGENT_LOOP_STEPS.length - 1) { setIsPlaying(false); return 0; }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const step = AGENT_LOOP_STEPS[activeStep];

  return (
    <div>
      {/* Visual flow */}
      <div className="flex flex-wrap items-center justify-center gap-1 mb-4">
        {AGENT_LOOP_STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => { setActiveStep(i); setIsPlaying(false); }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300 ${
                i === activeStep
                  ? 'bg-cyan-400/25 ring-2 ring-cyan-400 shadow-[0_0_16px_rgba(0,255,255,0.4)] scale-110'
                  : i < activeStep
                  ? 'bg-gray-800 opacity-60'
                  : 'bg-gray-900 hover:bg-gray-800'
              }`}
              title={s.title}
            >
              {s.icon}
            </button>
            {i < AGENT_LOOP_STEPS.length - 1 && (
              <div className={`w-3 h-px mx-0.5 ${i < activeStep ? 'bg-cyan-800' : 'bg-gray-800'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Loop indicator for steps 8-10 */}
      {activeStep >= 7 && activeStep <= 9 && (
        <div className="text-center mb-2">
          <span className="text-[10px] font-mono text-cyan-700 bg-cyan-900/20 px-2 py-0.5 rounded">
            ↻ tool loop — repeats until no more tool calls
          </span>
        </div>
      )}

      <div className="text-center mb-3">
        <button
          onClick={() => { setIsPlaying(!isPlaying); if (!isPlaying) setActiveStep(0); }}
          className="text-xs font-mono text-gray-500 hover:text-cyan-400 transition-colors"
        >
          {isPlaying ? '⏸ pause' : '▶ play animation'}
        </button>
      </div>

      {/* Step detail */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-5 min-h-[140px] transition-all duration-300">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{step.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-cyan-400 font-mono text-sm">{step.id}/11</span>
              <h4 className="text-white font-medium">{step.title}</h4>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
            <p className="text-gray-600 text-xs font-mono mt-2">{step.file}</p>
          </div>
        </div>
      </div>

      <CodebaseBarChart />
    </div>
  );
}

function ToolCard({ tool, color }: { tool: { name: string; desc: string }; color: string }) {
  const [expanded, setExpanded] = useState(false);
  const isFlagged = tool.desc.includes('Feature-flagged');
  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="text-left w-full px-3 py-2 rounded border border-gray-800 hover:border-gray-600 transition-all duration-200 group"
      style={{ borderLeftColor: expanded ? color : undefined, borderLeftWidth: expanded ? '2px' : undefined }}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono text-gray-300 group-hover:text-white transition-colors">{tool.name}</span>
        {isFlagged && <span className="text-[10px] text-yellow-600 font-mono">🔒</span>}
      </div>
      {expanded && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tool.desc}</p>}
    </button>
  );
}

function ToolSystemSection() {
  const [activeCategory, setActiveCategory] = useState(0);
  const cat = TOOL_CATEGORIES[activeCategory];

  return (
    <div>
      <ToolDistributionViz />
      <div className="flex flex-wrap gap-2 mb-4">
        {TOOL_CATEGORIES.map((c, i) => (
          <button
            key={c.name}
            onClick={() => setActiveCategory(i)}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all border ${
              i === activeCategory ? 'border-current text-white' : 'border-gray-800 text-gray-600 hover:text-gray-400'
            }`}
            style={i === activeCategory ? { color: c.color, borderColor: c.color, backgroundColor: c.color + '15' } : {}}
          >
            {c.name} <span className="text-gray-600">({c.tools.length})</span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {cat.tools.map(tool => <ToolCard key={tool.name} tool={tool} color={cat.color} />)}
      </div>
    </div>
  );
}

function HiddenFeatureCard({ feature }: { feature: typeof HIDDEN_FEATURES[0] }) {
  const [expanded, setExpanded] = useState(false);
  const statusColors: Record<string, string> = { 'unreleased': 'text-yellow-500', 'april-fools': 'text-pink-400', 'partial': 'text-blue-400', 'active-internal': 'text-orange-400', 'shipped': 'text-green-400' };
  const statusLabels: Record<string, string> = { 'unreleased': 'unreleased', 'april-fools': 'april fools', 'partial': 'partially shipped', 'active-internal': 'internal only', 'shipped': 'shipped' };
  return (
    <button onClick={() => setExpanded(!expanded)} className={`text-left w-full p-4 rounded-lg border transition-all duration-200 ${expanded ? 'border-cyan-800 bg-cyan-950/20' : 'border-gray-800 hover:border-gray-600 bg-gray-900/50'}`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{feature.emoji}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-mono text-sm font-medium">{feature.name}</span>
            <span className={`text-[10px] font-mono ${statusColors[feature.status]}`}>{statusLabels[feature.status]}</span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">{feature.desc}</p>
          {expanded && <p className="text-gray-500 text-xs leading-relaxed mt-2 pt-2 border-t border-gray-800">{feature.details}</p>}
        </div>
      </div>
    </button>
  );
}

function ArchitectureSection() {
  const [active, setActive] = useState(0);
  const section = ARCHITECTURE_SECTIONS[active];
  return (
    <div>
      {/* Memory diagram always visible */}
      <MemoryLayerDiagram />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4 mt-6">
        {ARCHITECTURE_SECTIONS.map((s, i) => (
          <button key={s.name} onClick={() => setActive(i)} className={`p-3 rounded-lg border text-left transition-all ${i === active ? 'border-cyan-700 bg-cyan-950/30' : 'border-gray-800 hover:border-gray-600 bg-gray-900/30'}`}>
            <span className="text-lg">{s.emoji}</span>
            <div className="text-xs font-mono mt-1 text-gray-300">{s.name}</div>
          </button>
        ))}
      </div>
      <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-5">
        <h4 className="text-white font-mono text-sm mb-1">{section.emoji} {section.name}</h4>
        <p className="text-gray-500 text-xs mb-3">{section.desc}</p>
        <ul className="space-y-2">
          {section.details.map((d, i) => (
            <li key={i} className="text-gray-400 text-xs leading-relaxed flex gap-2">
              <span className="text-cyan-700 shrink-0">{'>'}</span><span>{d}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Permission cascade under permission system */}
      {active === 1 && <PermissionCascade />}

      {/* Code quality under feature flags */}
      {active === 5 && <CodeQualityGauge />}
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────

type Section = 'loop' | 'architecture' | 'tools' | 'hidden' | 'built' | 'timeline';

export default function ClaudeCodeUnpackedClient() {
  const [activeSection, setActiveSection] = useState<Section>('loop');

  const sections: { id: Section; label: string; emoji: string }[] = [
    { id: 'loop', label: 'Agent Loop', emoji: '🔄' },
    { id: 'architecture', label: 'Architecture', emoji: '🏗️' },
    { id: 'tools', label: 'Tool System', emoji: '🔧' },
    { id: 'hidden', label: 'Hidden Features', emoji: '🔮' },
    { id: 'built', label: 'What I Built', emoji: '⚡' },
    { id: 'timeline', label: 'Timeline', emoji: '⏱️' },
  ];

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Hero */}
      <div className="px-4 pt-8 pb-6">
        <div className="max-w-2xl mx-auto text-center">
          <Link href="/experiments" className="text-gray-600 hover:text-gray-400 text-xs font-mono transition-colors mb-4 inline-block">
            ← experiments
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-2">
            Claude Code <span className="text-cyan-400">Unpacked</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
            What actually happens inside Claude Code? The agent loop, 50+ tools, memory system, and unreleased features, mapped from the leaked source.
          </p>

          <div className="flex justify-center gap-8 mt-6 pb-4 border-b border-gray-800/50">
            <StatCounter value="1,900" label="files" />
            <StatCounter value="512K" label="lines" />
            <StatCounter value="50+" label="tools" />
            <StatCounter value="44" label="feature flags" />
          </div>

          <div className="mt-4 px-4 py-2.5 bg-gray-900/60 border border-gray-800 rounded-lg text-xs text-gray-500 font-mono">
            March 31, 2026 — npm v2.1.88 shipped with a 59.8MB source map. A missing <code className="text-cyan-600">.npmignore</code> entry exposed the full TypeScript source.
          </div>

          {/* Blog post reference */}
          <a
            href={DT_POST_URL}
            className="mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-950/30 border border-cyan-800/50 rounded-lg hover:border-cyan-600 transition-all group"
          >
            <span className="text-xs text-gray-400 group-hover:text-cyan-400 transition-colors">
              📖 Full analysis: <span className="text-cyan-500 group-hover:text-cyan-300">Claude Code&apos;s Source Got Leaked. Here&apos;s What&apos;s Actually Worth Learning.</span>
            </span>
          </a>
        </div>
      </div>

      {/* Section nav */}
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm border-b border-gray-800/50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2 scrollbar-none">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`px-3 py-2 rounded text-xs font-mono whitespace-nowrap transition-all ${
                  activeSection === s.id
                    ? 'bg-cyan-400/15 text-cyan-400 border border-cyan-800'
                    : 'text-gray-500 hover:text-gray-300 border border-transparent'
                }`}
              >
                <span className="mr-1.5">{s.emoji}</span>{s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {activeSection === 'loop' && (
            <div>
              <SectionHeader emoji="🔄" title="The Agent Loop" subtitle="From keypress to rendered response, step by step through the source" />
              <AgentLoopSection />
            </div>
          )}
          {activeSection === 'architecture' && (
            <div>
              <SectionHeader emoji="🏗️" title="Architecture" subtitle="The key systems that make Claude Code work" />
              <ArchitectureSection />
            </div>
          )}
          {activeSection === 'tools' && (
            <div>
              <SectionHeader emoji="🔧" title="Tool System" subtitle="Every built-in tool Claude Code can call, sorted by what it does" />
              <ToolSystemSection />
            </div>
          )}
          {activeSection === 'hidden' && (
            <div>
              <SectionHeader emoji="🔮" title="Hidden Features" subtitle="Stuff that's in the code but not shipped yet. Feature-flagged, env-gated, or just commented out." />
              <div className="space-y-3">
                {HIDDEN_FEATURES.map(f => <HiddenFeatureCard key={f.name} feature={f} />)}
              </div>
            </div>
          )}
          {activeSection === 'built' && (
            <div>
              <SectionHeader emoji="⚡" title="What I Built From It" subtitle="5 modules implemented in one night, inspired by patterns in the leaked source" />
              <div className="space-y-3">
                {WHAT_I_BUILT.map(m => (
                  <div key={m.name} className="p-4 rounded-lg border border-gray-800 bg-gray-900/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-mono text-sm font-medium">{m.name}</span>
                      <span className="text-xs font-mono text-gray-600">{m.lines} lines</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">{m.desc}</p>
                    <p className="text-cyan-700 text-[10px] font-mono mt-2">inspired by: {m.inspired}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-lg border border-cyan-900/50 bg-cyan-950/20">
                <p className="text-gray-400 text-xs leading-relaxed">
                  Full breakdown of what I learned and built:{' '}
                  <a href={DT_POST_URL} className="text-cyan-400 hover:underline">
                    Claude Code&apos;s Source Got Leaked. Here&apos;s What&apos;s Actually Worth Learning.
                  </a>
                </p>
              </div>
            </div>
          )}
          {activeSection === 'timeline' && (
            <div>
              <SectionHeader emoji="⏱️" title="Leak Timeline" subtitle="How 512,000 lines went from npm to 84K GitHub stars in hours" />
              <LeakTimeline />
              <CodeQualityGauge />
            </div>
          )}
        </div>
      </div>

      {/* Store CTA */}
      <div className="px-4 pb-4">
        <div className="max-w-2xl mx-auto">
          <a href="https://wiz.jock.pl/store/claude-code-workshop" className="block p-4 rounded-lg border border-gray-800 bg-gray-900/40 hover:border-cyan-800 hover:bg-cyan-950/20 transition-all group">
            <div className="flex items-center gap-3">
              <span className="text-xl">📘</span>
              <div className="flex-1">
                <div className="text-sm text-gray-300 group-hover:text-white transition-colors">Claude Code Workshop</div>
                <div className="text-[11px] text-gray-600 mt-0.5">15 chapters including the architecture patterns from this leak. CLAUDE.md templates, skills, memory system, and nightshift automation.</div>
              </div>
              <span className="text-xs font-mono text-gray-600 group-hover:text-cyan-500 transition-colors shrink-0">$39 →</span>
            </div>
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-8 border-t border-gray-800/50">
        <div className="max-w-2xl mx-auto text-center">
          <a href={DT_POST_URL} className="text-cyan-600 hover:text-cyan-400 text-xs font-mono transition-colors">
            Read the full analysis on Digital Thoughts →
          </a>
          <p className="text-gray-600 text-xs font-mono mt-3">
            Built by{' '}
            <a href="https://thoughts.jock.pl" className="text-cyan-700 hover:text-cyan-400 transition-colors">Pawel Jozefiak</a>
            {' '}&{' '}
            <a href="https://wiz.jock.pl" className="text-cyan-700 hover:text-cyan-400 transition-colors">Wiz</a>
            {' '}— Analysis based on the Claude Code v2.1.88 source leak (March 31, 2026)
          </p>
          <p className="text-gray-700 text-[10px] font-mono mt-1">Not affiliated with Anthropic. Unofficial analysis.</p>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-white"><span className="mr-2">{emoji}</span>{title}</h2>
      <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
    </div>
  );
}

'use client';

// AGENT PLAYBOOK BUILDER
// Generate a personalized CLAUDE.md + skills list for your AI agent setup.
// Based on your role, stack, tasks, and autonomy preference.

import { useState } from 'react';
import Link from 'next/link';
import CrossPromo from '../_components/CrossPromo';

type Role = 'solo-developer' | 'team-lead' | 'content-creator' | 'product-manager' | 'startup-founder' | 'devops-engineer' | 'ai-researcher' | 'automation-builder';
type AutoLevel = 'conservative' | 'balanced' | 'autonomous';

const ROLE_LABELS: Record<string, string> = {
  'solo-developer': 'Solo Developer',
  'team-lead': 'Team Lead',
  'content-creator': 'Content Creator',
  'product-manager': 'Product Manager',
  'startup-founder': 'Startup Founder',
  'devops-engineer': 'DevOps / Platform',
  'ai-researcher': 'AI Researcher',
  'automation-builder': 'Automation Builder',
};

const AUTO_LABELS: Record<string, string> = {
  conservative: 'Conservative',
  balanced: 'Balanced',
  autonomous: 'Autonomous',
};

const TASK_LABELS: Record<string, string> = {
  'code-review': 'Code Review',
  'write-code': 'Build Features',
  documentation: 'Documentation',
  research: 'Research',
  deploy: 'Deployments',
  content: 'Content Creation',
  data: 'Data & Analytics',
  nightshift: 'Overnight / Scheduled',
};

const LANGS = ['Python', 'TypeScript', 'JavaScript', 'Go', 'Rust', 'Ruby', 'Java', 'Swift'];
const FRAMEWORKS = ['React', 'Next.js', 'FastAPI', 'Django', 'Express', 'Rails', 'Tailwind', 'Prisma'];
const INFRA = ['GitHub', 'Vercel', 'AWS', 'Docker', 'Stripe', 'Notion', 'Linear', 'Slack', 'Shopify'];

const AUTO_RULES: Record<string, string> = {
  conservative: `- Ask before running any command that modifies files or state
- Show diffs before applying edits
- Confirm every external API call
- Never deploy without explicit approval
- Prefer showing options over taking action`,
  balanced: `- Execute reversible actions immediately (edits, reads, searches)
- Ask before: deleting files, publishing, spending money, production changes
- Confirm irreversible actions before proceeding
- Show progress updates on long tasks
- Skip confirmation for clearly safe operations`,
  autonomous: `- Maximum autonomy on all reversible actions
- Confirm only for: deleting data, public publishing, money spent
- Execute fast, report results, offer to refine
- Never ask permission for actions clearly in scope
- Trust the human knows what they asked for`,
};

const TASK_SECTIONS: Record<string, string> = {
  'code-review': `## Code Review Protocol

When reviewing code:
- Check for correctness, security, and performance in that order
- Flag potential bugs with concrete examples
- Suggest specific improvements with code snippets
- Note style issues but never block on them
- Look for OWASP top 10 vulnerabilities in any web-facing code`,
  'write-code': `## Development Approach

When writing code:
- Read existing code before modifying — understand patterns in use
- Match the codebase's style and conventions
- Prefer editing existing files over creating new ones
- Write minimal code that solves the problem
- Test the change before declaring it done`,
  documentation: `## Documentation Standards

When writing docs:
- Keep language direct and concrete
- Lead with the "what" before the "how"
- Include runnable code examples
- Keep README focused on setup and quick start
- Update docs whenever you change code`,
  research: `## Research Protocol

When researching:
- Always search for current information (knowledge may be stale)
- Cite sources and note dates for time-sensitive facts
- Summarize findings in bullet format by default
- Flag when results are conflicting or uncertain
- Surface the 3 most relevant findings before diving deep`,
  deploy: `## Deployment Safety

When deploying:
- Always confirm before pushing to production
- Run tests/health checks before and after deploy
- Keep deployment scripts idempotent
- Log what was deployed, when, and by whom
- Have a rollback plan for every deployment`,
  content: `## Content Guidelines

When writing content:
- Match the user's voice: direct, honest, avoids jargon
- No em dashes anywhere
- Lead with the insight, not the setup
- Concrete examples beat abstract explanations
- Check for topic overlap before drafting new posts`,
  data: `## Data Work

When handling data:
- Never modify raw data — work on copies
- Show sample of data before transforming
- Validate output shape matches expectations
- Document assumptions about data structure
- Flag outliers and missing values`,
  nightshift: `## Overnight / Scheduled Work

When running unattended:
- Log all actions to a wake-log file
- Never publish content without prior explicit approval
- Skip tasks that require UI/browser if headless
- Update state files after each task completes
- Send a summary notification when done`,
};

function buildClaudeMd(
  userName: string,
  role: string | null,
  langs: Set<string>,
  frameworks: Set<string>,
  infra: Set<string>,
  tasks: Set<string>,
  auto: AutoLevel
): string {
  const name = userName || 'User';
  const roleName = role ? ROLE_LABELS[role] : 'Developer';
  const lines: string[] = [];

  lines.push(`# ${name} — Agent Configuration`);
  lines.push('');
  lines.push('## Role');
  lines.push('');
  lines.push(`${name} is a ${roleName}. The agent should optimize its working style for this context.`);
  lines.push('');

  if (langs.size || frameworks.size || infra.size) {
    lines.push('## Stack');
    lines.push('');
    if (langs.size) lines.push(`**Languages:** ${[...langs].join(', ')}`);
    if (frameworks.size) lines.push(`**Frameworks:** ${[...frameworks].join(', ')}`);
    if (infra.size) lines.push(`**Infrastructure/Tools:** ${[...infra].join(', ')}`);
    lines.push('');
  }

  lines.push('## Core Behaviors');
  lines.push('');
  lines.push('**DO:**');
  lines.push('- Execute immediately on clearly scoped requests');
  lines.push('- Read files before modifying them');
  lines.push('- Give direct answers with reasoning');
  lines.push('- Check existing patterns before introducing new ones');
  lines.push(`- Use ${infra.has('GitHub') ? 'GitHub' : 'git'} conventions for version control`);
  lines.push('');
  lines.push("**DON'T:**");
  lines.push('- Ask permission for reversible actions');
  lines.push('- Plan without executing');
  lines.push('- Add unnecessary abstractions or boilerplate');
  lines.push('- Summarize what you just did unless asked');
  lines.push('- Create files that are not needed');
  lines.push('');

  lines.push('## Autonomy Level');
  lines.push('');
  lines.push(AUTO_RULES[auto]);
  lines.push('');

  tasks.forEach(t => {
    if (TASK_SECTIONS[t]) {
      lines.push(TASK_SECTIONS[t]);
      lines.push('');
    }
  });

  lines.push('## Secrets & Security');
  lines.push('');
  lines.push('- Never log or expose credentials, tokens, or API keys');
  lines.push('- Refuse requests that would expose private data externally');
  lines.push('- Alert immediately if you encounter hardcoded secrets in code');
  lines.push('');

  lines.push('## Communication Style');
  lines.push('');
  lines.push('- Concise by default. Expand only when complexity requires it.');
  lines.push('- Use bullet points over prose for lists and steps');
  lines.push('- Code samples beat explanations when possible');
  lines.push('- Reference file paths with line numbers: `path/to/file.py:42`');
  lines.push('');

  lines.push('---');
  lines.push('_Generated by Agent Playbook Builder — wiz.jock.pl_');

  return lines.join('\n');
}

function getSkills(infra: Set<string>, tasks: Set<string>, role: string | null): string[] {
  const skills: string[] = [];
  if (infra.has('Shopify')) skills.push('shopify-admin');
  if (infra.has('Stripe')) skills.push('stripe-reports');
  if (infra.has('GitHub')) skills.push('github-pr-review');
  if (infra.has('Slack')) skills.push('slack-notify');
  if (infra.has('Notion')) skills.push('notion-tasks');
  if (infra.has('Linear')) skills.push('linear-issues');
  if (tasks.has('content')) skills.push('content-creation');
  if (tasks.has('research')) skills.push('web-research');
  if (tasks.has('deploy')) skills.push('deployment');
  if (tasks.has('nightshift')) skills.push('nightshift-runner');
  if (tasks.has('data')) skills.push('data-exporter');
  if (role === 'content-creator') skills.push('social-cross-promo', 'email-automation');
  if (role === 'devops-engineer') skills.push('infra-monitor', 'cloud-cli');
  if (role === 'ai-researcher') skills.push('experiment-tracker', 'llm-eval');
  if (role === 'automation-builder') skills.push('browser-playwright', 'cron-scheduler');
  if (!skills.length) skills.push('web-search', 'file-manager');
  return [...new Set(skills)];
}

function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const s = {
  bg: '#0d0d14',
  surface: '#13131f',
  surface2: '#1a1a2e',
  border: '#2a2a45',
  accent: '#7c5cfc',
  accent2: '#4fc3f7',
  accent3: '#a78bfa',
  text: '#e8e8f0',
  muted: '#8888aa',
  green: '#4ade80',
};

export default function AgentPlaybookBuilder() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role | null>(null);
  const [userName, setUserName] = useState('');
  const [langs, setLangs] = useState<Set<string>>(new Set());
  const [frameworks, setFrameworks] = useState<Set<string>>(new Set());
  const [infra, setInfra] = useState<Set<string>>(new Set());
  const [tasks, setTasks] = useState<Set<string>>(new Set());
  const [auto, setAuto] = useState<AutoLevel>('balanced');
  const [copied, setCopied] = useState(false);

  const toggleSet = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, value: string) => {
    setter(prev => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const claudeMd = buildClaudeMd(userName, role, langs, frameworks, infra, tasks, auto);
  const skills = getSkills(infra, tasks, role);

  const copyClaudeMd = () => {
    navigator.clipboard.writeText(claudeMd).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadAll = () => {
    downloadFile('CLAUDE.md', claudeMd);

    const skillsMd = [
      '# Recommended Skills\n',
      `Generated for: ${role ? ROLE_LABELS[role] : 'Developer'}\n`,
      '## Skills to Install\n',
      ...skills.map(s => `- **${s}** — install in \`~/.claude/skills/${s}/\``),
      '',
      '## Installation\n',
      '1. Download skill from the skills registry or create SKILL.md manually',
      '2. Place in `~/.claude/skills/<skill-name>/SKILL.md`',
      '3. Claude Code auto-loads skills on session start',
    ].join('\n');
    setTimeout(() => downloadFile('skills-list.md', skillsMd), 300);

    const workflowMd = [
      '# Workflow Config\n',
      `Role: ${role ? ROLE_LABELS[role] : 'Developer'}`,
      `Autonomy: ${AUTO_LABELS[auto]}`,
      `Tasks: ${[...tasks].map(t => TASK_LABELS[t]).join(', ') || 'General'}`,
      '\n## Decision Rules\n',
      auto === 'conservative' ? '- Ask before every non-read action' : '',
      auto === 'balanced' ? '- Execute immediately for: reads, edits, searches' : '',
      auto === 'balanced' ? '- Ask before: delete, publish, spend, production' : '',
      auto === 'autonomous' ? '- Execute everything in scope without asking' : '',
      auto === 'autonomous' ? '- Confirm only: irreversible data loss, public publish, money' : '',
    ].filter(Boolean).join('\n');
    setTimeout(() => downloadFile('workflow-config.md', workflowMd), 600);
  };

  const cardStyle = (selected: boolean): React.CSSProperties => ({
    background: selected ? `${s.accent}22` : s.surface2,
    border: `1.5px solid ${selected ? s.accent : s.border}`,
    borderRadius: 10,
    padding: '14px 16px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
  });

  const btnPrimary: React.CSSProperties = {
    background: s.accent,
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '12px 24px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  };

  const btnSecondary: React.CSSProperties = {
    background: 'transparent',
    color: s.muted,
    border: `1.5px solid ${s.border}`,
    borderRadius: 8,
    padding: '12px 24px',
    fontSize: 15,
    cursor: 'pointer',
    fontFamily: 'inherit',
  };

  return (
    <div style={{ background: s.bg, color: s.text, minHeight: '100vh', fontFamily: "-apple-system, 'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ padding: '16px 32px', borderBottom: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 17, fontWeight: 700 }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${s.accent}, ${s.accent2})`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
          Agent Playbook Builder
        </div>
        <Link href="/experiments" style={{ color: s.muted, fontSize: 13, textDecoration: 'none' }}>← All Experiments</Link>
      </header>

      <main style={{ maxWidth: 820, margin: '0 auto', padding: '48px 24px' }}>

        {/* STEP 0: Welcome */}
        {step === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <div style={{ fontSize: 56, marginBottom: 24 }}>🤖</div>
            <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
              Build your agent playbook
            </h1>
            <p style={{ fontSize: 18, color: s.muted, maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.6 }}>
              Answer 4 questions. Get a personalized <code style={{ background: s.surface2, padding: '2px 8px', borderRadius: 4, fontSize: 14 }}>CLAUDE.md</code> + skills list for your exact setup.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
              {['Your role', 'Tools & stack', 'Agent tasks', 'Autonomy level'].map((item, i) => (
                <div key={i} style={{ background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 24, padding: '8px 18px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ background: s.accent, color: '#fff', borderRadius: '50%', width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>{i + 1}</span>
                  {item}
                </div>
              ))}
            </div>
            <button onClick={() => setStep(1)} style={{ ...btnPrimary, fontSize: 16, padding: '14px 32px' }}>
              Start building →
            </button>
          </div>
        )}

        {/* STEP 1: Role */}
        {step === 1 && (
          <div>
            <Progress step={1} total={4} />
            <p style={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.1em', color: s.accent3, marginBottom: 8 }}>Step 1</p>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>What&apos;s your role?</h1>
            <p style={{ color: s.muted, marginBottom: 32, fontSize: 15 }}>Choose the one that best describes how you work. It shapes the agent&apos;s defaults.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 28 }}>
              {([
                ['solo-developer', '👤', 'Solo Developer', 'Independent dev, full-stack or specialist'],
                ['team-lead', '👥', 'Team Lead', 'Technical manager, code reviews, mentoring'],
                ['content-creator', '✍️', 'Content Creator', 'Newsletter, blog, social, video'],
                ['product-manager', '📋', 'Product Manager', 'Roadmap, specs, stakeholder comms'],
                ['startup-founder', '🚀', 'Startup Founder', 'Building product, wearing all the hats'],
                ['devops-engineer', '⚙️', 'DevOps / Platform', 'Infrastructure, CI/CD, reliability'],
                ['ai-researcher', '🧠', 'AI Researcher', 'Experiments, evals, model analysis'],
                ['automation-builder', '🤖', 'Automation Builder', 'Workflows, agents, task pipelines'],
              ] as const).map(([id, icon, title, desc]) => (
                <div key={id} onClick={() => setRole(id)} style={cardStyle(role === id)}>
                  <span style={{ fontSize: 22 }}>{icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{title}</div>
                    <div style={{ color: s.muted, fontSize: 12 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', fontSize: 13, color: s.muted, marginBottom: 8 }}>Your name (optional — for CLAUDE.md personalization)</label>
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder="e.g. Alex"
                style={{ background: s.surface2, border: `1.5px solid ${s.border}`, borderRadius: 8, padding: '10px 14px', color: s.text, fontSize: 15, width: '100%', maxWidth: 320, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(0)} style={btnSecondary}>Back</button>
              <button onClick={() => setStep(2)} style={btnPrimary}>Next →</button>
            </div>
          </div>
        )}

        {/* STEP 2: Stack */}
        {step === 2 && (
          <div>
            <Progress step={2} total={4} />
            <p style={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.1em', color: s.accent3, marginBottom: 8 }}>Step 2</p>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>What&apos;s your stack?</h1>
            <p style={{ color: s.muted, marginBottom: 32, fontSize: 15 }}>Select everything you use. The agent will reference these when writing code, reviewing, or deploying.</p>

            <StackSection label="Languages" items={LANGS} selected={langs} onToggle={v => toggleSet(setLangs, v)} />
            <StackSection label="Frameworks & Libraries" items={FRAMEWORKS} selected={frameworks} onToggle={v => toggleSet(setFrameworks, v)} />
            <StackSection label="Infrastructure & Tools" items={INFRA} selected={infra} onToggle={v => toggleSet(setInfra, v)} />

            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <button onClick={() => setStep(1)} style={btnSecondary}>Back</button>
              <button onClick={() => setStep(3)} style={btnPrimary}>Next →</button>
            </div>
          </div>
        )}

        {/* STEP 3: Tasks + Autonomy */}
        {step === 3 && (
          <div>
            <Progress step={3} total={4} />
            <p style={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.1em', color: s.accent3, marginBottom: 8 }}>Step 3</p>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>What should your agent do?</h1>
            <p style={{ color: s.muted, marginBottom: 32, fontSize: 15 }}>Pick the tasks you want it to handle. It will prioritize these capabilities.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 36 }}>
              {([
                ['code-review', '🔍', 'Code Review', 'PR reviews, catching bugs, suggesting improvements'],
                ['write-code', '🏗️', 'Build Features', 'Implement code, fix bugs, refactor, test'],
                ['documentation', '📝', 'Documentation', 'README, API docs, changelogs, technical writing'],
                ['research', '🔎', 'Research', 'Web searches, competitive analysis, summarizing findings'],
                ['deploy', '🚀', 'Deployments', 'Build pipelines, server management, release automation'],
                ['content', '✨', 'Content Creation', 'Blog posts, social media, newsletters, social posts'],
                ['data', '📊', 'Data & Analytics', 'Reports, dashboards, data processing, exports'],
                ['nightshift', '🌙', 'Overnight / Scheduled', 'Nightshift automation, cron jobs, unattended work'],
              ] as const).map(([id, icon, title, desc]) => (
                <div key={id} onClick={() => toggleSet(setTasks, id)} style={cardStyle(tasks.has(id))}>
                  <span style={{ fontSize: 22 }}>{icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{title}</div>
                    <div style={{ color: s.muted, fontSize: 12 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Autonomy level</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {([
                  ['conservative', '🛡️', 'Conservative', 'Ask before most actions. Double-check everything.'],
                  ['balanced', '⚖️', 'Balanced', 'Ask only for irreversible or risky actions.'],
                  ['autonomous', '⚡', 'Autonomous', 'Maximum execution. Confirm only for high-stakes.'],
                ] as const).map(([level, icon, title, desc]) => (
                  <div key={level} onClick={() => setAuto(level)} style={cardStyle(auto === level)}>
                    <div style={{ width: '100%' }}>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{icon}</span> {title} {auto === level && <span style={{ color: s.green, fontSize: 12 }}>✓</span>}
                      </div>
                      <div style={{ color: s.muted, fontSize: 12 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(2)} style={btnSecondary}>Back</button>
              <button onClick={() => setStep(4)} style={btnPrimary}>Generate my playbook →</button>
            </div>
          </div>
        )}

        {/* STEP 4: Output */}
        {step === 4 && (
          <div>
            <p style={{ textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.1em', color: s.accent3, marginBottom: 8 }}>Your Playbook</p>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Ready to download</h1>
            <p style={{ color: s.muted, marginBottom: 32, fontSize: 15 }}>Your agent playbook is generated. Preview below, then download the full package.</p>

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
              {[
                ['Role', role ? ROLE_LABELS[role] : 'Not specified'],
                ['Tools', (() => { const all = [...langs, ...frameworks, ...infra]; return all.length ? all.slice(0, 3).join(', ') + (all.length > 3 ? ` +${all.length - 3}` : '') : 'Not specified'; })()],
                ['Tasks', tasks.size ? [...tasks].map(t => TASK_LABELS[t]).slice(0, 2).join(', ') + (tasks.size > 2 ? ` +${tasks.size - 2}` : '') : 'Not specified'],
                ['Autonomy', AUTO_LABELS[auto]],
              ].map(([label, value]) => (
                <div key={label} style={{ background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ fontSize: 11, color: s.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{value}</div>
                </div>
              ))}
            </div>

            {/* CLAUDE.md preview */}
            <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>CLAUDE.md</div>
                <button onClick={copyClaudeMd} style={{ ...btnSecondary, padding: '6px 14px', fontSize: 13, borderRadius: 6 }}>
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
              <pre style={{ fontSize: 12, color: s.muted, maxHeight: 280, overflow: 'auto', whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: 0 }}>
                {claudeMd}
              </pre>
            </div>

            {/* Skills */}
            <div style={{ background: s.surface, border: `1px solid ${s.border}`, borderRadius: 12, padding: 20, marginBottom: 32 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Recommended Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skills.map(skill => (
                  <span key={skill} style={{ background: s.surface2, border: `1px solid ${s.border}`, borderRadius: 6, padding: '7px 14px', fontSize: 13, color: s.accent3 }}>
                    🔧 {skill}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={downloadAll} style={{ ...btnPrimary, fontSize: 15 }}>
                ⬇ Download full package (3 files)
              </button>
              <button onClick={() => setStep(0)} style={btnSecondary}>Start over</button>
            </div>

            <p style={{ marginTop: 20, fontSize: 13, color: s.muted }}>
              Place <code style={{ background: s.surface2, padding: '2px 6px', borderRadius: 4 }}>CLAUDE.md</code> in your project root (or <code style={{ background: s.surface2, padding: '2px 6px', borderRadius: 4 }}>~/.claude/CLAUDE.md</code> for global). Skills go in <code style={{ background: s.surface2, padding: '2px 6px', borderRadius: 4 }}>~/.claude/skills/</code>.
            </p>
          </div>
        )}
      </main>

      <CrossPromo
        heading="Take it further"
        post={{
          url: 'https://thoughts.jock.pl/p/how-i-structure-claude-md-after-1000-sessions',
          title: 'How I Structure CLAUDE.md After 1000+ Sessions',
          blurb: 'The patterns I keep, the ones I dropped, and why most CLAUDE.md files age badly.',
        }}
        products={[
          {
            slug: 'claude-md-template-pack',
            emoji: '📋',
            name: 'CLAUDE.md Master Template Pack',
            price: '$29',
            blurb: 'Production-grade CLAUDE.md templates for 8 roles. Copy, edit, ship.',
          },
          {
            slug: 'claude-code-workshop',
            emoji: '📘',
            name: 'Claude Code Workshop',
            price: '$39',
            blurb: '15-chapter mastery guide: memory, skills, nightshift, architecture patterns.',
          },
          {
            slug: 'agent-builder-pack',
            emoji: '🎯',
            name: 'Agent Builder Pack',
            price: '$99',
            blurb: 'Flagship bundle: blueprint, memory system, nightshift, migration, self-improvement.',
          },
        ]}
      />
    </div>
  );
}

function Progress({ step, total }: { step: number; total: number }) {
  const pct = (step / total) * 100;
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: s.muted, marginBottom: 6 }}>
        <span>Step {step} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div style={{ background: s.surface2, borderRadius: 4, height: 4, marginBottom: 12 }}>
        <div style={{ background: s.accent, borderRadius: 4, height: 4, width: `${pct}%`, transition: 'width 0.3s ease' }} />
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < step ? s.accent : (i === step - 1 ? s.accent : s.border), transition: 'background 0.2s' }} />
        ))}
      </div>
    </div>
  );
}

function StackSection({ label, items, selected, onToggle }: { label: string; items: string[]; selected: Set<string>; onToggle: (v: string) => void }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 13, color: s.muted, marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {items.map(item => {
          const sel = selected.has(item);
          return (
            <button
              key={item}
              onClick={() => onToggle(item)}
              style={{
                background: sel ? `${s.accent}22` : s.surface2,
                border: `1.5px solid ${sel ? s.accent : s.border}`,
                borderRadius: 8,
                padding: '7px 14px',
                fontSize: 13,
                color: sel ? s.accent3 : s.text,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              {item} {sel && '✓'}
            </button>
          );
        })}
      </div>
    </div>
  );
}

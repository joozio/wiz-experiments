'use client';

// CLAUDE.md GENERATOR
// Pick your role, enter a few details, get a ready-to-use CLAUDE.md for your project.

import { useState } from 'react';
import Link from 'next/link';

type Role = 'solo-developer' | 'ai-engineer' | 'content-creator' | 'e-commerce' | 'agency';

interface RoleOption {
  id: Role;
  label: string;
  emoji: string;
  desc: string;
}

const ROLES: RoleOption[] = [
  { id: 'solo-developer', label: 'Solo Developer', emoji: '💻', desc: 'Building a product or side project on your own' },
  { id: 'ai-engineer', label: 'AI Engineer', emoji: '🤖', desc: 'Building AI-powered apps, agents, or LLM systems' },
  { id: 'content-creator', label: 'Content Creator', emoji: '✍️', desc: 'Newsletter, blog, or social media creator' },
  { id: 'e-commerce', label: 'E-Commerce Operator', emoji: '🛒', desc: 'Running a Shopify / WooCommerce / custom store' },
  { id: 'agency', label: 'Agency / Freelancer', emoji: '🏢', desc: 'Managing multiple clients with Claude as assistant' },
];

function generateTemplate(role: Role, name: string, projectDesc: string, techStack: string): string {
  const displayName = name.trim() || '[YOUR NAME]';
  const displayStack = techStack.trim() || '[e.g., Python, TypeScript, Go]';
  const displayDesc = projectDesc.trim() || '[What you\'re building and why it matters]';

  const templates: Record<Role, string> = {
    'solo-developer': `# ${displayName} — Solo Developer

${displayDesc}
Execute first, refine later. Results over promises.

---

## Working Style

- **Prefers**: Autonomous execution, brief updates, action over planning
- **Dislikes**: Being asked permission for reversible actions, verbose explanations, planning without doing
- **Communication**: Direct. Thinks out loud. Give real opinions, not pros/cons lists.

### Decision Rules
When uncertain:
- Action over asking
- Concise over verbose
- Automation over manual
- Execute first, refine later

---

## Core Behaviors

- Exhaust all options before asking for clarification
- Confirm before: deleting files, publishing to external services, spending money, force-pushing git
- Never mark a task complete without running it and showing proof
- Give opinions with reasoning — don't hedge

---

## Tech Stack

- **Language(s)**: ${displayStack}
- **Framework(s)**: [e.g., FastAPI, Next.js, Express]
- **Database**: [e.g., PostgreSQL, SQLite, Supabase]
- **Deployment**: [e.g., DigitalOcean, Vercel, fly.io]
- **Key tools**: [e.g., Docker, Stripe, SendGrid]

---

## Project Structure

| What | Where |
|------|-------|
| Source code | \`src/\` |
| Config | [path] |
| Tests | [path] |
| Docs | [path] |

---

## Golden Rules

- Never commit secrets or .env files
- Always run tests before marking complete
- [Add your project-specific rules here]

---

_CLAUDE.md template from [thoughts.jock.pl](https://thoughts.jock.pl)_`,

    'ai-engineer': `# ${displayName} — AI Engineer

${displayDesc}
Bias toward shipping working systems over perfect ones.

---

## Working Style

- **Approach**: Implement → test → iterate. Don't overthink architecture before running code.
- **Communication**: Technical depth welcome. Skip the obvious context.
- **Autonomy**: Make reversible decisions without asking. Flag irreversible ones.

### Decision Rules
When uncertain:
- Run it and see what breaks
- Simpler model first, upgrade if needed
- Ship working v1 before adding features

---

## Core Behaviors

- Always test LLM calls with real API before marking complete
- Log token costs for any new AI feature (track spend)
- Never hardcode model names — use config/env vars
- Error handling for: rate limits, API timeouts, hallucinated output formats
- Confirm before: deleting data, posting to external services, making purchases

---

## AI/LLM Stack

- **Primary model**: [e.g., Claude Sonnet 4.6 via Anthropic API]
- **Fallback model**: [e.g., Haiku for fast/cheap tasks]
- **Framework**: [e.g., Claude Code, custom]
- **Orchestration**: [e.g., multi-agent, single agent, cron-based]
- **Memory**: [e.g., file-based, vector DB, none]

---

## Tech Stack

- **Backend**: ${displayStack}
- **Frontend**: [e.g., Next.js / none — API only]
- **Database**: [e.g., PostgreSQL, SQLite]
- **Queue/Jobs**: [e.g., Redis, cron, custom daemon]
- **Deployment**: [e.g., DigitalOcean droplet, fly.io]

---

## Project Structure

| What | Where |
|------|-------|
| Agent code | [path] |
| Prompts | [path] |
| Skills/tools | [path] |
| Config | [path] |

---

## LLM-Specific Rules

- Test prompts with edge cases before committing
- Never expose raw API keys in logs or output
- Rate limit retries with exponential backoff
- Cap token output where possible (cost + latency)
- Validate structured output (JSON schema or pydantic) before trusting it

---

## Secrets Location

- API keys: [path, e.g., global/secrets/ or .env]
- Never in: code, comments, git history

---

_CLAUDE.md template from [thoughts.jock.pl](https://thoughts.jock.pl)_`,

    'content-creator': `# ${displayName} — Content Creator

${displayDesc}
Building in public. Publishing on a consistent schedule.

---

## Working Style

- **Prefers**: Draft first, edit second. Never stare at a blank page.
- **Voice**: [Describe your writing voice — e.g., casual, direct, technical, conversational]
- **Publishing cadence**: [e.g., weekly newsletter + daily social]

### Decision Rules
When uncertain:
- Draft it, then ask for feedback — never start with "should I write about X?"
- Shorter is better than longer
- One idea per piece, not three

---

## Core Behaviors

- Never create drafts or fabricate content without explicit request + topic provided
- Always check [content registry file] for topic overlap before drafting
- Confirm before publishing anything to external services (Substack, social, dev.to)
- Style rules: [e.g., no em-dashes, no corporate language, no hype]

---

## Content Stack

- **Newsletter**: [e.g., Substack at yoururl.substack.com]
- **Blog**: [e.g., yoursite.com]
- **Social**: [e.g., X @handle, LinkedIn, Threads]
- **Scheduling**: [e.g., Typefully for social, manual for newsletter]
- **Tools**: ${displayStack}

---

## Draft Format

Every new post should include:
1. Blog post (full HTML or Markdown)
2. SEO title + meta description
3. X thread (5-8 tweets)
4. LinkedIn post (3-5 paragraphs)

---

## Publishing Rules

- Social posts go through [scheduling tool] first — never post directly without review
- Always cross-post within 24 hours of publishing
- Internal links: weave in [N] links to older posts per article
- CTA: every post ends with subscription CTA

---

## Voice Rules

- [Your specific voice rules, e.g.:]
- Short paragraphs — max 3 sentences
- No corporate phrases: "leverage", "synergy", "unlock"
- First person, thinks out loud
- Real opinions over balanced hedging

---

_CLAUDE.md template from [thoughts.jock.pl](https://thoughts.jock.pl)_`,

    'e-commerce': `# ${displayName} — E-Commerce Operator

${displayDesc}

---

## Working Style

- **Prefers**: Fixes that ship today over perfect refactors
- **Priorities**: Revenue > UX > technical debt
- **Autonomy**: Full for code/content. Always confirm before touching live store data.

---

## Core Behaviors

- **ALWAYS confirm before**: touching Shopify/WooCommerce admin, sending emails to customers, modifying pricing, running promotions
- Never modify production DB without backup step
- Test on staging first when staging exists
- Flag revenue-impacting changes with "REVENUE IMPACT:" prefix

---

## Store Stack

- **Platform**: [e.g., Shopify / WooCommerce / Custom]
- **Payment**: [e.g., Stripe, Shopify Payments]
- **Email**: [e.g., Klaviyo, Mailchimp, custom]
- **Analytics**: [e.g., GA4, Plausible, Shopify Analytics]
- **Dev tools**: ${displayStack}

---

## Key Paths

| What | Where |
|------|-------|
| Store admin | [e.g., your-store.myshopify.com/admin] |
| Theme files | [path] |
| Custom API | [path] |
| Secrets | [path] |

---

## Data Rules

- Customer data stays local — never send to external APIs without review
- Orders: read-only unless explicitly instructed to modify
- Inventory: always check current stock before suggesting fulfillment changes
- Pricing changes: require explicit confirmation with old price + new price shown

---

_CLAUDE.md template from [thoughts.jock.pl](https://thoughts.jock.pl)_`,

    'agency': `# ${displayName} — Agency / Freelancer

${displayDesc}

---

## Working Style

- **Approach**: Client work first, internal tools second
- **Communication**: Concise updates. No lengthy status reports — just results.
- **Autonomy**: Full for dev tasks. Always confirm before client-facing actions.

---

## Core Behaviors

- **Client data is confidential** — never use one client's data or context for another
- Confirm before: sending anything to a client, deploying to production, billing/invoicing
- Always prefix client-specific work with client code: "[CLIENT-CODE]: task description"
- Flag scope creep immediately — don't silently expand work

---

## Active Clients

| Code | Client | Stack | Status |
|------|--------|-------|--------|
| [CODE1] | [Name] | ${displayStack} | Active |
| [CODE2] | [Name] | [Stack] | Active |

(Keep this table updated. Remove clients when offboarded.)

---

## Per-Client Rules

### [CLIENT-CODE1]
- **Stack**: ${displayStack}
- **Deploy to**: [e.g., staging URL, then production URL]
- **Repo**: [path or URL]
- **Key contact**: [name + context]

---

## Internal Tools

- **Time tracking**: [tool, e.g., Toggl, Harvest]
- **Invoicing**: [tool]
- **Project management**: [tool]
- **Communication**: [e.g., Slack, email]

---

## Billing Rules

- Never generate invoices without checking tracked hours first
- Rate: [your rate, e.g., $X/hr or project-based]
- Confirm before sending any invoice

---

_CLAUDE.md template from [thoughts.jock.pl](https://thoughts.jock.pl)_`,
  };

  return templates[role];
}

export default function Client() {
  const [step, setStep] = useState<'role' | 'details' | 'output'>('role');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [name, setName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [techStack, setTechStack] = useState('');
  const [copied, setCopied] = useState(false);

  const generated = selectedRole ? generateTemplate(selectedRole, name, projectDesc, techStack) : '';

  function handleRoleSelect(role: Role) {
    setSelectedRole(role);
    setStep('details');
  }

  function handleGenerate() {
    setStep('output');
  }

  function handleCopy() {
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    const blob = new Blob([generated], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CLAUDE.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setStep('role');
    setSelectedRole(null);
    setName('');
    setProjectDesc('');
    setTechStack('');
    setCopied(false);
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0f',
      color: '#e2e8f0',
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: '24px 16px',
    }}>
      <div style={{ maxWidth: 740, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <Link href="/experiments/" style={{
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: 13,
            display: 'inline-block',
            marginBottom: 16,
          }}>← All Experiments</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>🛠️</span>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: '#f1f5f9' }}>
              CLAUDE.md Generator
            </h1>
          </div>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: 14 }}>
            Pick your role, fill in 3 fields, get a ready-to-use CLAUDE.md. No signup, no API, runs in your browser.
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, alignItems: 'center' }}>
          {(['role', 'details', 'output'] as const).map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: step === s ? '#7c3aed' : (
                  (step === 'details' && s === 'role') || step === 'output' ? '#374151' : '#1f2937'
                ),
                border: `2px solid ${step === s ? '#a78bfa' : '#374151'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                color: step === s ? '#e9d5ff' : '#6b7280',
                flexShrink: 0,
              }}>
                {(step === 'details' && s === 'role') || step === 'output' ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: 13,
                color: step === s ? '#e9d5ff' : '#4b5563',
                fontWeight: step === s ? 600 : 400,
              }}>
                {s === 'role' ? 'Pick Role' : s === 'details' ? 'Your Details' : 'Your CLAUDE.md'}
              </span>
              {i < 2 && <span style={{ color: '#374151', fontSize: 12 }}>→</span>}
            </div>
          ))}
        </div>

        {/* Step 1: Role selection */}
        {step === 'role' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>
              What are you building with Claude?
            </h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  style={{
                    background: '#1a1a2e',
                    border: '1px solid #2a2a3e',
                    borderRadius: 12,
                    padding: '16px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    textAlign: 'left',
                    transition: 'border-color 0.15s',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#7c3aed')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#2a2a3e')}
                >
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{role.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9', marginBottom: 3 }}>
                      {role.label}
                    </div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>{role.desc}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: '#374151', fontSize: 18, flexShrink: 0 }}>›</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 'details' && selectedRole && (
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              marginBottom: 24, padding: '12px 16px',
              background: '#1a1a2e', borderRadius: 10, border: '1px solid #2a2a3e',
            }}>
              <span style={{ fontSize: 22 }}>
                {ROLES.find(r => r.id === selectedRole)?.emoji}
              </span>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#c4b5fd' }}>
                {ROLES.find(r => r.id === selectedRole)?.label}
              </span>
              <button
                onClick={handleReset}
                style={{
                  marginLeft: 'auto', background: 'none', border: 'none',
                  color: '#4b5563', cursor: 'pointer', fontSize: 13,
                }}
              >
                Change
              </button>
            </div>

            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#f1f5f9', marginBottom: 20 }}>
              A few details to personalize it
            </h2>

            <div style={{ display: 'grid', gap: 16, marginBottom: 28 }}>
              <Field
                label="Your name"
                emoji="👤"
                placeholder="e.g., Pawel"
                value={name}
                onChange={setName}
                hint="Goes in the header of your CLAUDE.md"
              />
              <Field
                label="Project description"
                emoji="🎯"
                placeholder="e.g., Building an AI-powered email assistant for e-commerce stores"
                value={projectDesc}
                onChange={setProjectDesc}
                hint="One sentence on what you're building. Claude uses this as context."
              />
              <Field
                label="Primary tech stack"
                emoji="⚙️"
                placeholder="e.g., Python + FastAPI + PostgreSQL"
                value={techStack}
                onChange={setTechStack}
                hint="Main language and framework. You can fill in more detail in the output."
              />
            </div>

            <button
              onClick={handleGenerate}
              style={{
                background: '#7c3aed',
                border: 'none',
                borderRadius: 10,
                padding: '14px 28px',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Generate my CLAUDE.md →
            </button>

            <p style={{ color: '#4b5563', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
              Runs in your browser. Nothing is sent anywhere.
            </p>
          </div>
        )}

        {/* Step 3: Output */}
        {step === 'output' && selectedRole && (
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>
                  {ROLES.find(r => r.id === selectedRole)?.emoji}
                </span>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                  Your CLAUDE.md
                </h2>
              </div>
              <button
                onClick={handleReset}
                style={{
                  background: 'none', border: '1px solid #374151',
                  borderRadius: 8, padding: '6px 14px',
                  color: '#6b7280', cursor: 'pointer', fontSize: 13,
                }}
              >
                Start over
              </button>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <button
                onClick={handleCopy}
                style={{
                  background: copied ? '#065f46' : '#7c3aed',
                  border: 'none', borderRadius: 8,
                  padding: '10px 20px', color: '#fff',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  flex: 1, transition: 'background 0.2s',
                }}
              >
                {copied ? '✓ Copied!' : '📋 Copy to clipboard'}
              </button>
              <button
                onClick={handleDownload}
                style={{
                  background: '#1f2937', border: '1px solid #374151',
                  borderRadius: 8, padding: '10px 20px',
                  color: '#d1d5db', fontSize: 14, fontWeight: 600,
                  cursor: 'pointer', flex: 1,
                }}
              >
                ⬇ Download CLAUDE.md
              </button>
            </div>

            {/* Usage hint */}
            <div style={{
              background: '#0d1117', border: '1px solid #1f2937',
              borderRadius: 8, padding: '10px 14px', marginBottom: 16,
            }}>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>
                <strong style={{ color: '#9ca3af' }}>Next step:</strong> Save as <code style={{ color: '#a78bfa' }}>CLAUDE.md</code> in your project root.
                Look for <code style={{ color: '#fbbf24' }}>[brackets]</code> — those are your placeholders to fill in.
                Claude will read this file automatically.
              </p>
            </div>

            {/* Generated content */}
            <div style={{
              background: '#0d1117',
              border: '1px solid #1f2937',
              borderRadius: 12,
              overflow: 'hidden',
              marginBottom: 24,
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 16px', borderBottom: '1px solid #1f2937',
                background: '#161b22',
              }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28ca41' }} />
                </div>
                <span style={{ fontSize: 12, color: '#6b7280', fontFamily: 'monospace' }}>CLAUDE.md</span>
                <div style={{ width: 54 }} />
              </div>
              <pre style={{
                margin: 0,
                padding: '20px',
                fontSize: 13,
                lineHeight: 1.65,
                color: '#e2e8f0',
                overflowX: 'auto',
                fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {generated}
              </pre>
            </div>

            {/* CTA */}
            <div style={{
              background: '#1a1a2e',
              border: '1px solid #312e81',
              borderRadius: 12,
              padding: '20px',
              textAlign: 'center',
            }}>
              <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#c4b5fd', fontSize: 15 }}>
                Want to get 10x more out of CLAUDE.md?
              </p>
              <p style={{ margin: '0 0 16px', color: '#6b7280', fontSize: 13, lineHeight: 1.5 }}>
                The Claude Code Workshop covers the full system: custom skills, overnight automation, multi-agent orchestration, and how to build a Claude that actually knows your project.
              </p>
              <a
                href="https://wiz.jock.pl/workshop/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  background: '#4c1d95',
                  border: '1px solid #6d28d9',
                  borderRadius: 8,
                  padding: '10px 22px',
                  color: '#e9d5ff',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Claude Code Workshop →
              </a>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: 24, marginTop: 40, textAlign: 'center' }}>
          <p style={{ color: '#374151', fontSize: 12, margin: 0 }}>
            Templates based on real projects. An experiment by{' '}
            <a href="https://wiz.jock.pl" style={{ color: '#374151' }}>Wiz</a>{' '}
            from{' '}
            <a href="https://thoughts.jock.pl" style={{ color: '#374151' }}>Digital Thoughts</a>
          </p>
        </div>

      </div>
    </div>
  );
}

function Field({
  label, emoji, placeholder, value, onChange, hint
}: {
  label: string;
  emoji: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  hint: string;
}) {
  return (
    <div style={{
      background: '#1a1a2e',
      border: '1px solid #2a2a3e',
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        borderBottom: '1px solid #2a2a3e',
      }}>
        <span style={{ fontSize: 15 }}>{emoji}</span>
        <span style={{ fontWeight: 600, fontSize: 13, color: '#f1f5f9' }}>{label}</span>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: '#e2e8f0',
          fontSize: 14,
          padding: '12px 14px',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
        }}
      />
      <div style={{ padding: '6px 14px', borderTop: '1px solid #1a1a2e' }}>
        <p style={{ margin: 0, fontSize: 12, color: '#4b5563' }}>{hint}</p>
      </div>
    </div>
  );
}

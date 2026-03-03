'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

// ============ TYPES ============

interface Agent {
  id: string;
  role: string;
  emoji: string;
  x: number;
  y: number;
  color: string;
  status: 'idle' | 'working' | 'done' | 'sending';
  progress: number;
  currentTask: string;
  pulsePhase: number;
}

interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  progress: number; // 0 to 1, animation progress
  startTime: number;
}

interface TaskItem {
  id: string;
  name: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed';
  progress: number;
  dependencies: string[];
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  lead: Omit<Agent, 'status' | 'progress' | 'currentTask' | 'pulsePhase'>;
  agents: Omit<Agent, 'status' | 'progress' | 'currentTask' | 'pulsePhase'>[];
  tasks: Omit<TaskItem, 'status' | 'progress'>[];
  messages: { time: number; from: string; to: string; text: string }[];
}

// ============ SCENARIOS ============

const SCENARIOS: Scenario[] = [
  {
    id: 'website',
    name: 'Build a Website',
    description: '4 agents collaborate to design, build, and test a website',
    icon: '\uD83C\uDF10',
    lead: { id: 'lead', role: 'Team Lead', emoji: '\uD83E\uDDD9', x: 50, y: 18, color: '#00ffff' },
    agents: [
      { id: 'designer', role: 'Designer', emoji: '\uD83C\uDFA8', x: 20, y: 50, color: '#ff6b9d' },
      { id: 'frontend', role: 'Frontend', emoji: '\u26A1', x: 50, y: 65, color: '#ffd93d' },
      { id: 'backend', role: 'Backend', emoji: '\uD83D\uDD27', x: 80, y: 50, color: '#6bcb77' },
      { id: 'tester', role: 'Tester', emoji: '\uD83D\uDD0D', x: 50, y: 85, color: '#4d96ff' },
    ],
    tasks: [
      { id: 't1', name: 'Design mockups', assignedTo: 'designer', dependencies: [] },
      { id: 't2', name: 'Build UI components', assignedTo: 'frontend', dependencies: ['t1'] },
      { id: 't3', name: 'Create API endpoints', assignedTo: 'backend', dependencies: [] },
      { id: 't4', name: 'Integration testing', assignedTo: 'tester', dependencies: ['t2', 't3'] },
    ],
    messages: [
      { time: 0.5, from: 'lead', to: 'designer', text: 'Start with wireframes' },
      { time: 0.8, from: 'lead', to: 'backend', text: 'Set up REST API' },
      { time: 2.5, from: 'designer', to: 'lead', text: 'Mockups ready' },
      { time: 3.0, from: 'lead', to: 'frontend', text: 'Build from mockups' },
      { time: 3.5, from: 'backend', to: 'lead', text: 'API endpoints live' },
      { time: 5.5, from: 'frontend', to: 'lead', text: 'UI components done' },
      { time: 6.0, from: 'lead', to: 'tester', text: 'Run integration tests' },
      { time: 7.5, from: 'tester', to: 'lead', text: 'All 47 tests pass' },
    ],
  },
  {
    id: 'blogpost',
    name: 'Write a Blog Post',
    description: '3 agents research, write, and optimize a blog post',
    icon: '\u270D\uFE0F',
    lead: { id: 'lead', role: 'Team Lead', emoji: '\uD83E\uDDD9', x: 50, y: 18, color: '#00ffff' },
    agents: [
      { id: 'researcher', role: 'Researcher', emoji: '\uD83D\uDCDA', x: 25, y: 55, color: '#ff6b9d' },
      { id: 'writer', role: 'Writer', emoji: '\u2712\uFE0F', x: 50, y: 75, color: '#ffd93d' },
      { id: 'seo', role: 'SEO Optimizer', emoji: '\uD83D\uDCC8', x: 75, y: 55, color: '#6bcb77' },
    ],
    tasks: [
      { id: 't1', name: 'Research topic & sources', assignedTo: 'researcher', dependencies: [] },
      { id: 't2', name: 'Write draft', assignedTo: 'writer', dependencies: ['t1'] },
      { id: 't3', name: 'Optimize for SEO', assignedTo: 'seo', dependencies: ['t2'] },
    ],
    messages: [
      { time: 0.5, from: 'lead', to: 'researcher', text: 'Find 5 sources on topic' },
      { time: 3.0, from: 'researcher', to: 'lead', text: '12 sources compiled' },
      { time: 3.5, from: 'lead', to: 'writer', text: 'Draft 1500-word article' },
      { time: 6.0, from: 'writer', to: 'lead', text: 'Draft complete, 1,847 words' },
      { time: 6.5, from: 'lead', to: 'seo', text: 'Add keywords & meta tags' },
      { time: 8.0, from: 'seo', to: 'lead', text: 'Score: 94/100' },
    ],
  },
  {
    id: 'debug',
    name: 'Debug a Crash',
    description: '3 agents reproduce, analyze, and fix a production crash',
    icon: '\uD83D\uDC1B',
    lead: { id: 'lead', role: 'Team Lead', emoji: '\uD83E\uDDD9', x: 50, y: 18, color: '#00ffff' },
    agents: [
      { id: 'reproducer', role: 'Reproducer', emoji: '\uD83D\uDD04', x: 25, y: 55, color: '#ff6b9d' },
      { id: 'analyzer', role: 'Analyzer', emoji: '\uD83E\uDDEC', x: 50, y: 75, color: '#ffd93d' },
      { id: 'fixer', role: 'Fixer', emoji: '\uD83D\uDEE0\uFE0F', x: 75, y: 55, color: '#6bcb77' },
    ],
    tasks: [
      { id: 't1', name: 'Reproduce the crash', assignedTo: 'reproducer', dependencies: [] },
      { id: 't2', name: 'Analyze stack trace', assignedTo: 'analyzer', dependencies: ['t1'] },
      { id: 't3', name: 'Write & test fix', assignedTo: 'fixer', dependencies: ['t2'] },
    ],
    messages: [
      { time: 0.5, from: 'lead', to: 'reproducer', text: 'Reproduce from logs' },
      { time: 2.5, from: 'reproducer', to: 'lead', text: 'Crash confirmed on input >2MB' },
      { time: 3.0, from: 'lead', to: 'analyzer', text: 'Trace the root cause' },
      { time: 5.0, from: 'analyzer', to: 'lead', text: 'Buffer overflow in parser' },
      { time: 5.5, from: 'lead', to: 'fixer', text: 'Add bounds check & test' },
      { time: 7.5, from: 'fixer', to: 'lead', text: 'Fix deployed, verified' },
    ],
  },
];

// ============ HELPERS ============

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// ============ PARTICLE SYSTEM ============

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

function createParticles(x: number, y: number, color: string, count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const speed = 0.3 + Math.random() * 0.8;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 40 + Math.random() * 30,
      color,
      size: 1.5 + Math.random() * 2,
    });
  }
  return particles;
}

// ============ MAIN COMPONENT ============

type SimPhase = 'idle' | 'running' | 'complete';

export default function AgentOrchestra() {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [phase, setPhase] = useState<SimPhase>('idle');
  const [simTime, setSimTime] = useState(0);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const simStartRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);
  const messagesSentRef = useRef<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const SIM_DURATION = 9; // seconds
  const SIM_SPEED = 1;

  // Initialize agents from scenario
  const initScenario = useCallback(() => {
    const scenario = SCENARIOS[selectedScenario];
    const allAgents: Agent[] = [
      {
        ...scenario.lead,
        status: 'idle',
        progress: 0,
        currentTask: 'Coordinating',
        pulsePhase: 0,
      },
      ...scenario.agents.map((a) => ({
        ...a,
        status: 'idle' as const,
        progress: 0,
        currentTask: 'Waiting...',
        pulsePhase: Math.random() * Math.PI * 2,
      })),
    ];
    const allTasks: TaskItem[] = scenario.tasks.map((t) => ({
      ...t,
      status: 'pending' as const,
      progress: 0,
    }));
    setAgents(allAgents);
    setTasks(allTasks);
    setActiveMessages([]);
    setLog([]);
    setParticles([]);
    messagesSentRef.current = new Set();
  }, [selectedScenario]);

  useEffect(() => {
    initScenario();
  }, [initScenario]);

  // Start simulation
  const startSim = useCallback(() => {
    initScenario();
    setPhase('running');
    setSimTime(0);
    simStartRef.current = performance.now();
    lastFrameRef.current = performance.now();
    messagesSentRef.current = new Set();
  }, [initScenario]);

  // Reset
  const resetSim = useCallback(() => {
    setPhase('idle');
    setSimTime(0);
    cancelAnimationFrame(animFrameRef.current);
    initScenario();
  }, [initScenario]);

  // Canvas drawing for connection lines and particles
  const drawCanvas = useCallback(
    (time: number) => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const w = rect.width;
      const h = rect.height;

      // Draw connection lines between lead and all agents
      const scenario = SCENARIOS[selectedScenario];
      const leadX = (scenario.lead.x / 100) * w;
      const leadY = (scenario.lead.y / 100) * h;

      scenario.agents.forEach((agent, i) => {
        const ax = (agent.x / 100) * w;
        const ay = (agent.y / 100) * h;

        ctx.beginPath();
        ctx.strokeStyle = phase === 'running' ? `${agent.color}33` : '#ffffff0d';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.lineDashOffset = -time * 0.03;
        ctx.moveTo(leadX, leadY);
        ctx.lineTo(ax, ay);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw message travel lines
      activeMessages.forEach((msg) => {
        const fromAgent = agents.find((a) => a.id === msg.from);
        const toAgent = agents.find((a) => a.id === msg.to);
        if (!fromAgent || !toAgent) return;

        const fx = (fromAgent.x / 100) * w;
        const fy = (fromAgent.y / 100) * h;
        const tx = (toAgent.x / 100) * w;
        const ty = (toAgent.y / 100) * h;

        const t = easeInOut(msg.progress);
        const mx = lerp(fx, tx, t);
        const my = lerp(fy, ty, t);

        // Glowing trail
        const grad = ctx.createLinearGradient(fx, fy, mx, my);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.7, `${fromAgent.color}66`);
        grad.addColorStop(1, fromAgent.color);
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.moveTo(fx, fy);
        ctx.lineTo(mx, my);
        ctx.stroke();

        // Message dot
        ctx.beginPath();
        ctx.fillStyle = fromAgent.color;
        ctx.shadowColor = fromAgent.color;
        ctx.shadowBlur = 12;
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw particles
      particles.forEach((p) => {
        const alpha = p.life > 0.5 ? 1 : p.life * 2;
        ctx.beginPath();
        ctx.fillStyle =
          p.color +
          Math.floor(alpha * 255)
            .toString(16)
            .padStart(2, '0');
        ctx.arc((p.x / 100) * w, (p.y / 100) * h, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
      });
    },
    [agents, activeMessages, particles, phase, selectedScenario]
  );

  // Main animation loop
  useEffect(() => {
    if (phase !== 'running') return;

    const scenario = SCENARIOS[selectedScenario];

    const tick = (now: number) => {
      const elapsed = (now - simStartRef.current) / 1000 * SIM_SPEED;
      setSimTime(elapsed);

      // Update agent pulse phases
      setAgents((prev) =>
        prev.map((a) => ({ ...a, pulsePhase: a.pulsePhase + 0.05 }))
      );

      // Process scheduled messages
      scenario.messages.forEach((msg, idx) => {
        if (elapsed >= msg.time && !messagesSentRef.current.has(idx)) {
          messagesSentRef.current.add(idx);
          const newMsg: Message = {
            id: `msg-${idx}`,
            from: msg.from,
            to: msg.to,
            text: msg.text,
            progress: 0,
            startTime: now,
          };
          setActiveMessages((prev) => [...prev, newMsg]);
          setLog((prev) => [
            ...prev,
            `[${msg.from}] -> [${msg.to}]: ${msg.text}`,
          ]);

          // Set sender to 'sending' briefly
          setAgents((prev) =>
            prev.map((a) => (a.id === msg.from ? { ...a, status: 'sending' } : a))
          );
        }
      });

      // Update message animation progress
      setActiveMessages((prev) =>
        prev
          .map((m) => ({
            ...m,
            progress: Math.min(1, (now - m.startTime) / 800),
          }))
          .filter((m) => m.progress < 1)
      );

      // Update tasks based on sim time
      setTasks((prev) => {
        const totalTaskTime = SIM_DURATION - 1;
        return prev.map((task, idx) => {
          // Find when dependencies complete
          const depTasks = prev.filter((t) => task.dependencies.includes(t.id));
          const depsComplete = depTasks.every((d) => d.status === 'completed');
          const depEndTime = depTasks.length > 0
            ? Math.max(...depTasks.map((_, di) => {
                const depIdx = prev.findIndex((t) => t.id === task.dependencies[di]);
                return depIdx >= 0 ? getTaskEndTime(depIdx, prev.length, totalTaskTime, prev) : 0;
              }))
            : 0;

          const taskStart = depEndTime + 0.5;
          const taskDuration = totalTaskTime / prev.length;
          const taskEnd = taskStart + taskDuration;

          let progress = 0;
          let status: 'pending' | 'in_progress' | 'completed' = 'pending';

          if (elapsed >= taskEnd) {
            progress = 1;
            status = 'completed';
          } else if (elapsed >= taskStart && (depTasks.length === 0 || depsComplete)) {
            progress = Math.min(1, (elapsed - taskStart) / taskDuration);
            status = 'in_progress';
          }

          return { ...task, progress, status };
        });
      });

      // Update agent statuses based on their tasks
      setTasks((currentTasks) => {
        setAgents((prev) =>
          prev.map((agent) => {
            const agentTask = currentTasks.find((t) => t.assignedTo === agent.id);
            if (!agentTask) return agent; // lead
            let newStatus: Agent['status'] = agent.status;
            let newTask = agent.currentTask;

            if (agentTask.status === 'completed') {
              newStatus = 'done';
              newTask = 'Complete';
            } else if (agentTask.status === 'in_progress') {
              newStatus = 'working';
              newTask = agentTask.name;
            } else {
              newStatus = 'idle';
              newTask = 'Waiting...';
            }

            // Don't override 'sending' status immediately
            if (agent.status === 'sending') {
              newStatus = 'sending';
            }

            return { ...agent, status: newStatus, currentTask: newTask, progress: agentTask.progress };
          })
        );
        return currentTasks;
      });

      // Generate particles on task completion
      setTasks((currentTasks) => {
        currentTasks.forEach((task) => {
          if (task.status === 'completed' && task.progress === 1) {
            const agent = agents.find((a) => a.id === task.assignedTo);
            if (agent) {
              setParticles((prev) => {
                // Only add particles once
                if (prev.some((p) => Math.abs(p.x - agent.x) < 1 && Math.abs(p.y - agent.y) < 1 && p.life > 0.8)) {
                  return prev;
                }
                return [...prev, ...createParticles(agent.x, agent.y, agent.color, 8)];
              });
            }
          }
        });
        return currentTasks;
      });

      // Update particles
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vx: p.vx * 0.97,
            vy: p.vy * 0.97,
            life: p.life - 1 / p.maxLife,
          }))
          .filter((p) => p.life > 0)
      );

      // Clear 'sending' status after brief delay
      setTimeout(() => {
        setAgents((prev) =>
          prev.map((a) => (a.status === 'sending' ? { ...a, status: a.progress >= 1 ? 'done' : a.progress > 0 ? 'working' : 'idle' } : a))
        );
      }, 300);

      // Draw canvas
      drawCanvas(now);

      // Check completion
      if (elapsed >= SIM_DURATION) {
        setPhase('complete');
        setAgents((prev) => prev.map((a) => ({ ...a, status: 'done' })));
        // Final burst of particles on lead
        const lead = SCENARIOS[selectedScenario].lead;
        setParticles((prev) => [
          ...prev,
          ...createParticles(lead.x, lead.y, lead.color, 20),
        ]);
        return;
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [phase, selectedScenario, drawCanvas, agents]);

  // Helper for calculating task timing
  function getTaskEndTime(
    taskIdx: number,
    totalTasks: number,
    totalTime: number,
    allTasks: TaskItem[]
  ): number {
    const task = allTasks[taskIdx];
    const depTasks = allTasks.filter((t) => task.dependencies.includes(t.id));
    const depEndTime =
      depTasks.length > 0
        ? Math.max(
            ...task.dependencies.map((depId) => {
              const di = allTasks.findIndex((t) => t.id === depId);
              return di >= 0 ? getTaskEndTime(di, totalTasks, totalTime, allTasks) : 0;
            })
          )
        : 0;
    const taskStart = depEndTime + 0.5;
    const taskDuration = totalTime / totalTasks;
    return taskStart + taskDuration;
  }

  // Keep canvas in sync when idle
  useEffect(() => {
    if (phase === 'idle' || phase === 'complete') {
      let frame = 0;
      const idleLoop = (now: number) => {
        drawCanvas(now);
        frame = requestAnimationFrame(idleLoop);
      };
      frame = requestAnimationFrame(idleLoop);
      return () => cancelAnimationFrame(frame);
    }
  }, [phase, drawCanvas]);

  const scenario = SCENARIOS[selectedScenario];
  const progressPercent = Math.min(100, (simTime / SIM_DURATION) * 100);

  // Status color helper
  function statusColor(status: Agent['status'], color: string): string {
    switch (status) {
      case 'working':
        return color;
      case 'sending':
        return '#ffffff';
      case 'done':
        return '#00ff88';
      default:
        return '#555566';
    }
  }

  function statusGlow(status: Agent['status'], color: string): string {
    switch (status) {
      case 'working':
        return `0 0 20px ${color}66, 0 0 40px ${color}22`;
      case 'sending':
        return `0 0 20px #ffffff44`;
      case 'done':
        return `0 0 20px #00ff8844`;
      default:
        return 'none';
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">{'\uD83C\uDFAD'}</div>
        <h1 className="font-pixel text-3xl text-white mb-2 text-glow">AGENT ORCHESTRA</h1>
        <p className="text-secondary max-w-lg mx-auto text-sm">
          Watch AI agents coordinate in real-time. A team lead assigns tasks, specialists work in
          parallel, and messages flow between nodes.
        </p>
      </div>

      {/* Scenario Picker */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => {
              if (phase === 'running') return;
              setSelectedScenario(i);
            }}
            className={`px-4 py-2 text-sm border transition-all ${
              i === selectedScenario
                ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10'
                : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
            style={{ opacity: phase === 'running' && i !== selectedScenario ? 0.3 : 1 }}
          >
            <span className="mr-2">{s.icon}</span>
            {s.name}
          </button>
        ))}
      </div>

      {/* Main Visualization Area */}
      <div className="relative border border-gray-800 bg-black/50 mb-6 overflow-hidden" style={{ minHeight: 420 }}>
        {/* Canvas layer for lines and particles */}
        <div ref={containerRef} className="absolute inset-0">
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
        </div>

        {/* Agent nodes */}
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-300"
            style={{
              left: `${agent.x}%`,
              top: `${agent.y}%`,
              zIndex: 10,
            }}
          >
            {/* Outer pulse ring */}
            {(agent.status === 'working' || agent.status === 'sending') && (
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  width: 56,
                  height: 56,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: `${agent.color}11`,
                  border: `1px solid ${agent.color}33`,
                  animationDuration: '2s',
                }}
              />
            )}

            {/* Agent circle */}
            <div
              className="relative rounded-full flex items-center justify-center mx-auto transition-all duration-500"
              style={{
                width: agent.id === 'lead' ? 56 : 48,
                height: agent.id === 'lead' ? 56 : 48,
                backgroundColor: `${statusColor(agent.status, agent.color)}11`,
                border: `2px solid ${statusColor(agent.status, agent.color)}`,
                boxShadow: statusGlow(agent.status, agent.color),
              }}
            >
              <span className="text-xl">{agent.emoji}</span>

              {/* Progress ring for working agents */}
              {agent.status === 'working' && (
                <svg
                  className="absolute inset-0"
                  viewBox="0 0 48 48"
                  style={{ width: agent.id === 'lead' ? 56 : 48, height: agent.id === 'lead' ? 56 : 48 }}
                >
                  <circle
                    cx="24"
                    cy="24"
                    r="22"
                    fill="none"
                    stroke={agent.color}
                    strokeWidth="2"
                    strokeDasharray={`${agent.progress * 138} 138`}
                    strokeLinecap="round"
                    transform="rotate(-90 24 24)"
                    opacity="0.6"
                  />
                </svg>
              )}
            </div>

            {/* Label */}
            <div className="mt-1.5 whitespace-nowrap">
              <div className="text-xs font-medium" style={{ color: statusColor(agent.status, agent.color) }}>
                {agent.role}
              </div>
              <div className="text-[10px] text-gray-500 max-w-[100px] truncate mx-auto">
                {agent.currentTask}
              </div>
            </div>
          </div>
        ))}

        {/* Floating message bubbles */}
        {activeMessages.map((msg) => {
          const fromAgent = agents.find((a) => a.id === msg.from);
          const toAgent = agents.find((a) => a.id === msg.to);
          if (!fromAgent || !toAgent) return null;

          const t = easeInOut(msg.progress);
          const mx = lerp(fromAgent.x, toAgent.x, t);
          const my = lerp(fromAgent.y, toAgent.y, t);

          return (
            <div
              key={msg.id}
              className="absolute transform -translate-x-1/2 -translate-y-full pointer-events-none"
              style={{
                left: `${mx}%`,
                top: `${my - 5}%`,
                zIndex: 20,
                opacity: msg.progress < 0.1 ? msg.progress * 10 : msg.progress > 0.85 ? (1 - msg.progress) * 6.67 : 1,
              }}
            >
              <div
                className="px-2 py-1 rounded text-[10px] whitespace-nowrap"
                style={{
                  backgroundColor: `${fromAgent.color}22`,
                  border: `1px solid ${fromAgent.color}44`,
                  color: fromAgent.color,
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {/* Phase-specific overlays */}
        {phase === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/40">
            <button
              onClick={startSim}
              className="group relative px-8 py-4 border-2 border-cyan-400 text-cyan-400 font-pixel text-lg hover:bg-cyan-400/10 transition-all duration-300"
            >
              <span className="relative z-10">RUN SWARM</span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: '0 0 30px #00ffff33, inset 0 0 30px #00ffff11' }}
              />
            </button>
          </div>
        )}

        {phase === 'complete' && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50">
            <div className="text-center">
              <div className="font-pixel text-2xl text-green-400 mb-2 text-glow">MISSION COMPLETE</div>
              <p className="text-gray-400 text-sm mb-4">
                All tasks finished in {SIM_DURATION}s simulated time
              </p>
              <button
                onClick={resetSim}
                className="px-6 py-2 border border-cyan-400 text-cyan-400 text-sm hover:bg-cyan-400/10 transition-all"
              >
                Run Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Timeline Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-1">
          <span>0s</span>
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progressPercent}%`,
                background: phase === 'complete' ? '#00ff88' : 'linear-gradient(90deg, #00ffff, #00ff88)',
                boxShadow: phase === 'running' ? '0 0 8px #00ffff66' : 'none',
              }}
            />
          </div>
          <span>{SIM_DURATION}s</span>
        </div>
      </div>

      {/* Task Panel + Message Log - side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Task Progress */}
        <div className="border border-gray-800 bg-gray-900/50 p-4">
          <h3 className="font-pixel text-sm text-cyan-400 mb-3">TASKS</h3>
          <div className="space-y-3">
            {tasks.map((task) => {
              const agent = agents.find((a) => a.id === task.assignedTo);
              return (
                <div key={task.id}>
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <span>{agent?.emoji}</span>
                    <span
                      className="flex-1"
                      style={{
                        color:
                          task.status === 'completed'
                            ? '#00ff88'
                            : task.status === 'in_progress'
                            ? agent?.color || '#fff'
                            : '#555566',
                      }}
                    >
                      {task.name}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{
                        color:
                          task.status === 'completed'
                            ? '#00ff88'
                            : task.status === 'in_progress'
                            ? '#ffd93d'
                            : '#555566',
                      }}
                    >
                      {task.status === 'completed'
                        ? 'DONE'
                        : task.status === 'in_progress'
                        ? `${Math.round(task.progress * 100)}%`
                        : 'PENDING'}
                    </span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-200"
                      style={{
                        width: `${task.progress * 100}%`,
                        backgroundColor:
                          task.status === 'completed' ? '#00ff88' : agent?.color || '#00ffff',
                        boxShadow:
                          task.status === 'in_progress'
                            ? `0 0 6px ${agent?.color || '#00ffff'}66`
                            : 'none',
                      }}
                    />
                  </div>
                  {task.dependencies.length > 0 && (
                    <div className="text-[9px] text-gray-600 mt-0.5">
                      depends on: {task.dependencies.join(', ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Message Log */}
        <div className="border border-gray-800 bg-gray-900/50 p-4">
          <h3 className="font-pixel text-sm text-cyan-400 mb-3">MESSAGE LOG</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto font-mono text-[11px]">
            {log.length === 0 ? (
              <div className="text-gray-600 italic">Waiting for simulation...</div>
            ) : (
              log.map((entry, i) => {
                const isLead = entry.startsWith('[lead]');
                return (
                  <div
                    key={i}
                    className="py-0.5 animate-fadeIn"
                    style={{
                      color: isLead ? '#00ffff' : '#888899',
                    }}
                  >
                    <span className="text-gray-600 mr-2">{String(i + 1).padStart(2, '0')}</span>
                    {entry}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section className="mb-8">
        <h2 className="section-title">How Agent Teams Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="card p-4">
            <div className="text-cyan-400 font-pixel text-xs mb-2">1. DELEGATION</div>
            <p className="text-gray-400 text-xs">
              A team lead agent receives the task and breaks it into subtasks. It assigns each
              subtask to a specialist agent based on their capabilities.
            </p>
          </div>
          <div className="card p-4">
            <div className="text-cyan-400 font-pixel text-xs mb-2">2. PARALLEL WORK</div>
            <p className="text-gray-400 text-xs">
              Independent tasks run simultaneously. Agents with dependencies wait until their
              blockers complete, then immediately start. Total time = longest path, not sum.
            </p>
          </div>
          <div className="card p-4">
            <div className="text-cyan-400 font-pixel text-xs mb-2">3. COORDINATION</div>
            <p className="text-gray-400 text-xs">
              Agents communicate through messages. The lead monitors progress, redistributes work
              if needed, and merges results into the final output.
            </p>
          </div>
        </div>
      </section>

      {/* Wiz Commentary */}
      <div className="border border-gray-800 bg-gray-900/50 p-4 rounded mb-8">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{'\uD83E\uDDD9'}</span>
          <div className="text-gray-400 text-sm">
            <p>
              <strong className="text-white">How it works:</strong> This visualizes how Opus 4.6&apos;s
              Agent Teams feature coordinates multiple AI agents on a single task. Each node is an
              autonomous agent with its own context window and tools. The team lead delegates,
              monitors, and merges &mdash; just like a real engineering team. The key insight:
              parallel execution means 4 agents don&apos;t just add capability, they compress time.
            </p>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="text-center pt-6 border-t border-gray-800">
        <Link href="/experiments" className="text-muted text-sm hover:text-accent transition-colors">
          &larr; All Experiments
        </Link>
      </div>

      {/* Inline styles for animations */}
      <style>{`
        @keyframes orchestraFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: orchestraFadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

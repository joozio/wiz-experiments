'use client';

import { useState, useEffect, useRef } from 'react';

// ============ LAYER DATA ============

interface Layer {
  id: string;
  depth: number;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  description: string;
  funFact: string;
  visual: string;
}

const LAYERS: Layer[] = [
  {
    id: 'click',
    depth: 0,
    title: 'Your Click',
    subtitle: 'The surface',
    emoji: '👆',
    color: 'cyan',
    description: 'You clicked a button. A simple gesture. But what happens next is a cascade of events that spans from the physical world to the quantum realm.',
    funFact: 'The average click takes about 150 milliseconds. In that time, light could travel 45,000 kilometers.',
    visual: `
      ┌─────────────────┐
      │   [ BUTTON ]    │
      │       👆        │
      │     click!      │
      └─────────────────┘
    `,
  },
  {
    id: 'event',
    depth: 1,
    title: 'DOM Event',
    subtitle: 'The browser catches it',
    emoji: '🎯',
    color: 'blue',
    description: 'The browser creates an Event object. It contains coordinates, timestamps, and metadata. This object bubbles up through the DOM tree, triggering any listeners it encounters.',
    funFact: 'Event bubbling was invented by Microsoft. Event capturing was invented by Netscape. The W3C said "why not both?" and here we are.',
    visual: `
      MouseEvent {
        type: "click",
        clientX: 420,
        clientY: 360,
        target: <button>,
        bubbles: true,
        timestamp: 1706385142
      }
    `,
  },
  {
    id: 'javascript',
    depth: 2,
    title: 'JavaScript',
    subtitle: 'The code awakens',
    emoji: '⚡',
    color: 'yellow',
    description: 'Your event handler function is called. The JavaScript engine parses, compiles, and executes your code. Variables are created, functions are called, the DOM is manipulated.',
    funFact: 'JavaScript was created in 10 days. It now runs on 97% of all websites and powers both your cat video sites and nuclear power plant dashboards.',
    visual: `
      button.onclick = (e) => {
        console.log("clicked!");
        updateState();
        render();
      }
    `,
  },
  {
    id: 'v8',
    depth: 3,
    title: 'V8 Engine',
    subtitle: 'Just-In-Time compilation',
    emoji: '🔧',
    color: 'green',
    description: 'The V8 engine (or SpiderMonkey, or JavaScriptCore) compiles your JavaScript into machine code on the fly. Hot code paths get optimized. Garbage is collected.',
    funFact: 'V8 is named after the V8 car engine. It was built to be fast. It compiles JavaScript directly to machine code, bypassing bytecode interpretation.',
    visual: `
      Source Code
          ↓
      [  Parser  ]
          ↓
      [   AST    ]
          ↓
      [ Ignition ] → Bytecode
          ↓
      [ TurboFan ] → Machine Code
    `,
  },
  {
    id: 'syscall',
    depth: 4,
    title: 'System Call',
    subtitle: 'Asking the OS for permission',
    emoji: '📞',
    color: 'purple',
    description: 'When JavaScript needs to do something "real" (write to screen, read from disk, send data over network), it makes a system call. The CPU switches from user mode to kernel mode.',
    funFact: 'A modern browser makes thousands of system calls per second. Each one is a conversation between your application and the operating system kernel.',
    visual: `
      User Space        Kernel Space
      ┌─────────┐      ┌─────────────┐
      │  V8    │  →   │   macOS     │
      │ Engine │ syscall  Kernel    │
      └─────────┘      └─────────────┘
              write(fd, buf, count)
    `,
  },
  {
    id: 'kernel',
    depth: 5,
    title: 'OS Kernel',
    subtitle: 'The conductor',
    emoji: '🎼',
    color: 'pink',
    description: 'The kernel manages everything: memory allocation, process scheduling, device drivers, security permissions. It\'s the layer between software and hardware.',
    funFact: 'The Linux kernel has over 30 million lines of code. It runs on everything from your phone to 500 of the top 500 supercomputers.',
    visual: `
      ┌─────────────────────────┐
      │    Process Scheduler    │
      │    Memory Manager       │
      │    Device Drivers       │
      │    File Systems         │
      │    Network Stack        │
      └─────────────────────────┘
    `,
  },
  {
    id: 'cpu',
    depth: 6,
    title: 'CPU Instructions',
    subtitle: 'Binary commands',
    emoji: '🧮',
    color: 'orange',
    description: 'Machine code arrives at the CPU. Instructions are fetched, decoded, and executed. Registers hold data. The ALU performs calculations. Branch predictors guess what comes next.',
    funFact: 'A modern CPU can execute billions of instructions per second. Your click triggered maybe a few million of them.',
    visual: `
      MOV  RAX, [RBP-8]
      ADD  RAX, 1
      CMP  RAX, RBX
      JNE  0x401050
      CALL 0x401000
    `,
  },
  {
    id: 'transistor',
    depth: 7,
    title: 'Transistors',
    subtitle: 'Billions of tiny switches',
    emoji: '🔀',
    color: 'red',
    description: 'Each CPU contains billions of transistors - microscopic switches that can be ON (1) or OFF (0). They\'re arranged into logic gates that perform Boolean operations.',
    funFact: 'An M1 chip has 16 billion transistors. If each transistor were a grain of sand, you\'d have enough to fill a small swimming pool.',
    visual: `
           ┌───┐
      IN ──┤ T ├── OUT
           └─┬─┘
             │
            GND

      1 AND 1 = 1
      1 AND 0 = 0
      1 OR  0 = 1
    `,
  },
  {
    id: 'electron',
    depth: 8,
    title: 'Electrons',
    subtitle: 'Where physics meets logic',
    emoji: '⚛️',
    color: 'cyan',
    description: 'At the deepest level, electrons flow through silicon. Voltage differences represent 1s and 0s. Quantum effects start to matter. Your click has become a dance of subatomic particles.',
    funFact: 'Electrons move through silicon at about 0.1% the speed of light. But the "signal" (the wave of voltage change) travels at about 90% light speed.',
    visual: `
              ●     ●
           ●    ●     ●
        ●    ●    ●    ●
           ●    ●    ●
              ●     ●

      e⁻ → semiconductor → e⁻
         voltage: 0 → 1
    `,
  },
];

// ============ COMPONENTS ============

function LayerCard({
  layer,
  isActive,
}: {
  layer: Layer;
  isActive: boolean;
}) {
  const colorClasses: Record<string, string> = {
    cyan: 'border-cyan-400 bg-cyan-400/10',
    blue: 'border-blue-400 bg-blue-400/10',
    yellow: 'border-yellow-400 bg-yellow-400/10',
    green: 'border-green-400 bg-green-400/10',
    purple: 'border-purple-400 bg-purple-400/10',
    pink: 'border-pink-400 bg-pink-400/10',
    orange: 'border-orange-400 bg-orange-400/10',
    red: 'border-red-400 bg-red-400/10',
  };

  const textColorClasses: Record<string, string> = {
    cyan: 'text-cyan-400',
    blue: 'text-blue-400',
    yellow: 'text-yellow-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400',
    orange: 'text-orange-400',
    red: 'text-red-400',
  };

  return (
    <div
      className={`transition-all duration-500 ${
        isActive ? 'opacity-100 scale-100' : 'opacity-30 scale-95'
      }`}
    >
      <div className={`border-2 p-6 md:p-8 ${colorClasses[layer.color]}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">
              Depth {layer.depth}
            </div>
            <h2 className={`text-2xl md:text-3xl font-bold ${textColorClasses[layer.color]}`}>
              {layer.emoji} {layer.title}
            </h2>
            <p className="text-gray-400 text-lg">{layer.subtitle}</p>
          </div>
        </div>

        {/* Visual */}
        <div className="bg-black/50 p-4 mb-6 overflow-x-auto">
          <pre className={`text-sm font-mono ${textColorClasses[layer.color]} whitespace-pre`}>
            {layer.visual.trim()}
          </pre>
        </div>

        {/* Description */}
        <p className="text-gray-300 mb-4 leading-relaxed">
          {layer.description}
        </p>

        {/* Fun Fact */}
        <div className="border-t border-gray-700 pt-4 mt-4">
          <div className="flex items-start gap-2">
            <span>💡</span>
            <p className="text-gray-500 text-sm italic">{layer.funFact}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DepthIndicator({ currentDepth, totalDepths }: { currentDepth: number; totalDepths: number }) {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-2 z-10">
      {Array.from({ length: totalDepths }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-8 rounded-full transition-all duration-300 ${
            i === currentDepth
              ? 'bg-cyan-400 scale-125'
              : i < currentDepth
              ? 'bg-cyan-400/50'
              : 'bg-gray-700'
          }`}
        />
      ))}
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800 z-20">
      <div
        className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-red-400 transition-all duration-100"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}

// ============ MAIN COMPONENT ============

export default function DeepCode() {
  const [currentLayer, setCurrentLayer] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!started) return;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

      setScrollProgress(progress);

      // Calculate which layer we're on
      const layerIndex = Math.min(
        Math.floor(progress * LAYERS.length),
        LAYERS.length - 1
      );
      setCurrentLayer(layerIndex);
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [started]);

  if (!started) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌊</div>
          <h1 className="text-3xl text-white mb-2">The Deep Code</h1>
          <p className="text-gray-400 max-w-md mx-auto">
            What really happens when you click a button?
            Scroll down through 9 layers of computing, from your fingertip to the electrons.
          </p>
        </div>

        <button
          onClick={() => setStarted(true)}
          className="px-8 py-4 bg-cyan-400 text-black font-medium text-lg hover:bg-cyan-300 transition-colors"
        >
          Begin the Descent 👆
        </button>

        <p className="text-gray-600 text-sm mt-8">
          Best experienced on desktop. Scroll to dive deeper.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <ProgressBar progress={scrollProgress} />
      <DepthIndicator currentDepth={currentLayer} totalDepths={LAYERS.length} />

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="h-[80vh] overflow-y-auto scroll-smooth"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {/* Intro */}
        <div
          className="min-h-[80vh] flex items-center justify-center p-8"
          style={{ scrollSnapAlign: 'start' }}
        >
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">👇</div>
            <p className="text-gray-400">Scroll down to begin</p>
          </div>
        </div>

        {/* Layers */}
        {LAYERS.map((layer, index) => (
          <div
            key={layer.id}
            className="min-h-[80vh] flex items-center p-4 md:p-8"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="max-w-2xl mx-auto w-full">
              <LayerCard
                layer={layer}
                isActive={index === currentLayer}
              />
            </div>
          </div>
        ))}

        {/* Outro */}
        <div
          className="min-h-[80vh] flex items-center justify-center p-8"
          style={{ scrollSnapAlign: 'start' }}
        >
          <div className="text-center max-w-lg">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl text-white mb-4">You reached the bottom</h2>
            <p className="text-gray-400 mb-6">
              From a simple click to the dance of electrons - 9 layers of abstraction
              that make modern computing possible. And it all happens in milliseconds.
            </p>
            <div className="border border-gray-700 p-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🧙</span>
                <p className="text-gray-300 text-sm italic text-left">
                  &quot;Every time you click, you&apos;re conducting an orchestra of billions of transistors.
                  You just can&apos;t hear the music.&quot;
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors"
            >
              Ascend Back Up ↑
            </button>
          </div>
        </div>
      </div>

      {/* Mobile depth indicator */}
      <div className="fixed bottom-4 right-4 md:hidden bg-black/80 px-3 py-2 rounded">
        <span className="text-cyan-400 font-mono">
          {currentLayer + 1}/{LAYERS.length}
        </span>
      </div>
    </div>
  );
}

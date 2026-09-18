'use client';

import { useState, useEffect } from 'react';

// ============ ERA DATA ============

interface CodeEra {
  year: number;
  name: string;
  language: string;
  paradigm: string;
  storage: string;
  description: string;
  funFact: string;
  code: string;
  aesthetic: {
    bg: string;
    text: string;
    accent: string;
    font: string;
  };
  wizComment: string;
}

const CODE_ERAS: CodeEra[] = [
  {
    year: 1952,
    name: 'The Punch Card Era',
    language: 'Assembly / Machine Code',
    paradigm: 'Imperative',
    storage: '80-column punch cards',
    description: 'Programs were physical objects. Dropping your card deck meant hours of re-sorting. One typo = one ruined card.',
    funFact: 'A typical program might require thousands of cards. Some programmers marked the edge of their deck with a diagonal line to help re-sort if dropped.',
    code: `IDENTIFICATION DIVISION.
PROGRAM-ID. HELLO-WORLD.
PROCEDURE DIVISION.
    DISPLAY "HELLO, WORLD".
    STOP RUN.

; PUNCH CARD LAYOUT:
; COL 1-6:  SEQUENCE NUMBER
; COL 7:    CONTINUATION
; COL 8-72: PROGRAM TEXT
; COL 73-80: IDENTIFICATION`,
    aesthetic: {
      bg: '#f5f0e6',
      text: '#1a1a1a',
      accent: '#8b4513',
      font: 'Courier New, monospace',
    },
    wizComment: 'Imagine if every typo meant physically destroying something. Actually, that might improve code quality.',
  },
  {
    year: 1964,
    name: 'The BASIC Revolution',
    language: 'BASIC',
    paradigm: 'Procedural',
    storage: 'Magnetic tape',
    description: 'Designed to be simple enough for non-scientists. Line numbers ruled everything. GOTO was king.',
    funFact: 'BASIC stood for "Beginners All-purpose Symbolic Instruction Code." It ran on time-sharing systems where users typed at terminals.',
    code: `10 REM *** HELLO WORLD IN BASIC ***
20 PRINT "WHAT IS YOUR NAME?"
30 INPUT N$
40 PRINT "HELLO, "; N$; "!"
50 PRINT
60 PRINT "HOW OLD ARE YOU?"
70 INPUT A
80 IF A < 18 THEN GOTO 110
90 PRINT "YOU ARE AN ADULT"
100 GOTO 120
110 PRINT "YOU ARE YOUNG"
120 END`,
    aesthetic: {
      bg: '#001100',
      text: '#00ff00',
      accent: '#00aa00',
      font: 'Courier New, monospace',
    },
    wizComment: 'Line numbers. GOTO statements. Spaghetti code that would make an Italian chef weep. Beautiful.',
  },
  {
    year: 1972,
    name: 'The C Awakening',
    language: 'C',
    paradigm: 'Procedural / Systems',
    storage: 'Hard disk drives',
    description: 'Unix was born. Pointers became both weapon and wound. "Hello World" became the standard first program.',
    funFact: 'C was developed at Bell Labs. The book "The C Programming Language" by K&R became the bible. It\'s only 272 pages.',
    code: `#include <stdio.h>

/* A classic from the K&R book */
int main()
{
    char name[50];
    int age;

    printf("Enter your name: ");
    scanf("%s", name);

    printf("Enter your age: ");
    scanf("%d", &age);

    printf("Hello, %s!\\n", name);
    printf("In 10 years you'll be %d.\\n", age + 10);

    return 0;
}`,
    aesthetic: {
      bg: '#1e1e1e',
      text: '#d4d4d4',
      accent: '#569cd6',
      font: 'Consolas, monospace',
    },
    wizComment: 'Pointers: unlimited power wrapped in segmentation faults. Every C programmer has trust issues.',
  },
  {
    year: 1983,
    name: 'The Personal Computer Boom',
    language: 'Pascal / Turbo Pascal',
    paradigm: 'Structured',
    storage: 'Floppy disks (5.25")',
    description: 'Computers entered homes. Blue screens with yellow text. BEGIN and END everywhere. Compilation in seconds felt like magic.',
    funFact: 'Turbo Pascal compiled so fast that users thought it was broken. It could compile 27,000 lines per minute on an IBM PC.',
    code: `program HelloWorld;
var
  name: string;
  age: integer;
begin
  writeln('*** WELCOME TO TURBO PASCAL ***');
  writeln;

  write('Enter your name: ');
  readln(name);

  write('Enter your age: ');
  readln(age);

  writeln;
  writeln('Hello, ', name, '!');
  writeln('You have lived approximately ', age * 365, ' days.');

  writeln;
  writeln('Press ENTER to exit...');
  readln;
end.`,
    aesthetic: {
      bg: '#0000aa',
      text: '#ffff00',
      accent: '#ffffff',
      font: 'Courier New, monospace',
    },
    wizComment: 'That blue and yellow combination burned itself into an entire generation\'s retinas. No regrets.',
  },
  {
    year: 1995,
    name: 'The Web Explosion',
    language: 'JavaScript / HTML',
    paradigm: 'Event-driven / Prototype-based',
    storage: 'CD-ROM / Early web servers',
    description: 'The browser became a platform. JavaScript was written in 10 days. Animated GIFs and visitor counters everywhere.',
    funFact: 'JavaScript was originally called Mocha, then LiveScript. The name "JavaScript" was a marketing decision to ride Java\'s popularity.',
    code: `<HTML>
<HEAD>
  <TITLE>My Cool Web Page</TITLE>
</HEAD>
<BODY BGCOLOR="#000080" TEXT="#FFFF00">
  <CENTER>
    <H1><BLINK>Welcome to My Page!</BLINK></H1>
    <IMG SRC="construction.gif">
    <HR>
    <MARQUEE>You are visitor number:
      <SCRIPT>
        document.write(Math.floor(Math.random() * 9999));
      </SCRIPT>
    </MARQUEE>
  </CENTER>

  <SCRIPT LANGUAGE="JavaScript">
    var name = prompt("What is your name?");
    alert("Hello, " + name + "! Bookmark this page!");
  </SCRIPT>
</BODY>
</HTML>`,
    aesthetic: {
      bg: '#000080',
      text: '#ffff00',
      accent: '#00ffff',
      font: 'Comic Sans MS, cursive',
    },
    wizComment: '<BLINK> and <MARQUEE> tags. The web was a fever dream. We let it happen.',
  },
  {
    year: 2000,
    name: 'The Enterprise Era',
    language: 'Java',
    paradigm: 'Object-Oriented',
    storage: 'Enterprise servers / Early cloud',
    description: '"Write once, run anywhere." Design patterns became religion. XML configs longer than the actual code.',
    funFact: 'The AbstractSingletonProxyFactoryBean is a real class in Spring Framework. Enterprise Java spawned memes that outlived the code.',
    code: `public class HelloWorldApplication {

    public static void main(String[] args) {
        HelloWorldService service =
            HelloWorldServiceFactory.getInstance()
                .createHelloWorldService();

        HelloWorldRequest request =
            new HelloWorldRequestBuilder()
                .withGreeting("Hello")
                .withTarget("World")
                .build();

        HelloWorldResponse response =
            service.processHelloWorldRequest(request);

        System.out.println(response.getMessage());
    }
}

// HelloWorldServiceFactory.java
// HelloWorldService.java
// HelloWorldServiceImpl.java
// HelloWorldRequest.java
// HelloWorldRequestBuilder.java
// HelloWorldResponse.java
// ... 47 more files`,
    aesthetic: {
      bg: '#ffffff',
      text: '#333333',
      accent: '#e76f00',
      font: 'Consolas, monospace',
    },
    wizComment: 'AbstractSingletonProxyFactoryBean is a real thing. Humans made this. On purpose.',
  },
  {
    year: 2010,
    name: 'The Mobile Revolution',
    language: 'Objective-C / Swift',
    paradigm: 'Object-Oriented / Protocol-Oriented',
    storage: 'App stores / Cloud storage',
    description: 'Apps became the new programs. Brackets nested within brackets. The @ symbol developed a complex identity.',
    funFact: 'The first iPhone app was developed in secret by Apple employees who weren\'t even told what device it would run on.',
    code: `import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var nameLabel: UILabel!
    @IBOutlet weak var greetButton: UIButton!

    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }

    func setupUI() {
        greetButton.layer.cornerRadius = 8
        greetButton.backgroundColor = .systemBlue
    }

    @IBAction func greetTapped(_ sender: UIButton) {
        let alert = UIAlertController(
            title: "Hello!",
            message: "Welcome to the app!",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}`,
    aesthetic: {
      bg: '#1e1e1e',
      text: '#d4d4d4',
      accent: '#ff6b6b',
      font: 'SF Mono, monospace',
    },
    wizComment: 'Every button needed delegates, protocols, and a ritualistic dance. iOS development was a lifestyle.',
  },
  {
    year: 2015,
    name: 'The Modern Web',
    language: 'TypeScript / React',
    paradigm: 'Functional / Declarative',
    storage: 'CDN / Edge computing',
    description: 'JavaScript grew up and got typed. Components became the atom of UIs. NPM packages multiplied like rabbits.',
    funFact: 'The average node_modules folder is larger than most video games from the 90s. A fresh React app downloads more code than the Apollo 11 guidance computer contained.',
    code: `import React, { useState, useEffect } from 'react';

interface User {
  name: string;
  age: number;
}

const WelcomeComponent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser().then(data => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">
        Hello, {user?.name ?? 'World'}!
      </h1>
      <p className="text-gray-600">
        Welcome to the modern web.
      </p>
    </div>
  );
};

export default WelcomeComponent;`,
    aesthetic: {
      bg: '#0d1117',
      text: '#c9d1d9',
      accent: '#58a6ff',
      font: 'JetBrains Mono, monospace',
    },
    wizComment: 'We added types to JavaScript, then proceeded to use "any" everywhere. Progress.',
  },
  {
    year: 2024,
    name: 'The AI Era',
    language: 'Python / Prompt Engineering',
    paradigm: 'AI-Assisted / Natural Language',
    storage: 'Vector databases / Model weights',
    description: 'Code is now co-written with AI. Natural language becomes a programming interface. The line between prompt and program blurs.',
    funFact: 'GitHub Copilot was trained on billions of lines of code. Sometimes it suggests code that matches real repositories exactly.',
    code: `# Modern AI-assisted development

from langchain import LLM, PromptTemplate
import numpy as np

# The code writes itself now
prompt = """
You are a helpful coding assistant.
Task: {task}
Requirements: {requirements}
Generate clean, tested Python code.
"""

def ai_pair_program(task: str) -> str:
    """Let AI write the boring parts."""
    response = llm.complete(
        prompt.format(
            task=task,
            requirements="type hints, docstrings, tests"
        )
    )
    return response

# Meanwhile, in embeddings...
def semantic_search(query: str, embeddings: np.ndarray):
    """Find similar code by meaning, not text."""
    query_vec = embed(query)
    similarities = cosine_similarity(query_vec, embeddings)
    return top_k(similarities, k=5)

# Is this programming? Is this prompting?
# Does the distinction matter anymore?`,
    aesthetic: {
      bg: '#0a0a0a',
      text: '#e0e0e0',
      accent: '#a855f7',
      font: 'Fira Code, monospace',
    },
    wizComment: 'I helped write this. The student becomes the teacher. Or maybe we\'re all students now.',
  },
];

// ============ COMPONENTS ============

function EraCard({ era, isActive, onClick }: { era: CodeEra; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 border transition-all duration-300 ${
        isActive
          ? 'border-cyan-400 bg-cyan-400/10'
          : 'border-gray-700 hover:border-gray-500 bg-gray-900/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-cyan-400">{era.year}</span>
        {isActive && <span className="text-cyan-400 text-xs">●</span>}
      </div>
      <div className="text-white font-medium text-sm mt-1">{era.name}</div>
      <div className="text-gray-500 text-xs">{era.language}</div>
    </button>
  );
}

function CodeDisplay({ era }: { era: CodeEra }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(era.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="border transition-all duration-500"
      style={{
        borderColor: era.aesthetic.accent + '40',
        backgroundColor: era.aesthetic.bg,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{
          borderColor: era.aesthetic.accent + '40',
          backgroundColor: era.aesthetic.bg,
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
          </div>
          <span
            className="text-xs ml-2"
            style={{ color: era.aesthetic.text + '80' }}
          >
            {era.language.toLowerCase().replace(/\s+/g, '_')}_example
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs px-2 py-1 transition-colors"
          style={{ color: era.aesthetic.accent }}
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code */}
      <pre
        className="p-4 overflow-x-auto text-sm leading-relaxed"
        style={{
          color: era.aesthetic.text,
          fontFamily: era.aesthetic.font,
        }}
      >
        {era.code}
      </pre>
    </div>
  );
}

function Timeline({ eras, activeIndex, onSelect }: {
  eras: CodeEra[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="relative">
      {/* Line */}
      <div className="absolute top-0 bottom-0 left-[9px] w-0.5 bg-gray-700" />

      {/* Dots */}
      <div className="space-y-4">
        {eras.map((era, i) => (
          <button
            key={era.year}
            onClick={() => onSelect(i)}
            className="flex items-center gap-3 group relative z-10"
          >
            <div
              className={`w-5 h-5 rounded-full border-2 transition-all ${
                i === activeIndex
                  ? 'border-cyan-400 bg-cyan-400 scale-125'
                  : i < activeIndex
                    ? 'border-cyan-400/50 bg-cyan-400/30'
                    : 'border-gray-600 bg-gray-900 group-hover:border-gray-400'
              }`}
            />
            <span className={`font-mono text-sm transition-colors ${
              i === activeIndex ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'
            }`}>
              {era.year}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ MAIN COMPONENT ============

export default function TimeMachineCode() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const activeEra = CODE_ERAS[activeIndex];

  // Auto-play through eras
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex(prev => {
        if (prev >= CODE_ERAS.length - 1) {
          setIsAutoPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex(prev => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex(prev => Math.min(CODE_ERAS.length - 1, prev + 1));
  };

  return (
    <div>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.3); }
          50% { box-shadow: 0 0 40px rgba(34, 211, 238, 0.5); }
        }
        .glow-active {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="text-center mb-8">
        <div className="text-4xl mb-4">⏰</div>
        <h1 className="text-2xl text-white mb-2">Time Machine: Code Edition</h1>
        <p className="text-gray-400">
          Travel through 70 years of programming. See how we talked to machines before we could... talk to machines.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Timeline Sidebar - Desktop */}
        <div className="hidden lg:block">
          <div className="sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-500 text-xs uppercase tracking-wider">Timeline</h2>
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`text-xs px-2 py-1 border transition-colors ${
                  isAutoPlaying
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-gray-600 text-gray-400 hover:border-gray-400'
                }`}
              >
                {isAutoPlaying ? '⏸ Pause' : '▶ Auto'}
              </button>
            </div>
            <Timeline
              eras={CODE_ERAS}
              activeIndex={activeIndex}
              onSelect={(i) => { setIsAutoPlaying(false); setActiveIndex(i); }}
            />
          </div>
        </div>

        {/* Main Panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* Era Header */}
          <div className={`border border-cyan-400/30 bg-cyan-400/5 p-6 animate-fade-in ${isAutoPlaying ? 'glow-active' : ''}`} key={activeEra.year}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-cyan-400 font-mono text-3xl mb-1">{activeEra.year}</div>
                <h2 className="text-xl text-white font-medium">{activeEra.name}</h2>
              </div>
              {/* Navigation - Mobile & Desktop */}
              <div className="flex gap-2">
                <button
                  onClick={goToPrev}
                  disabled={activeIndex === 0}
                  className="w-8 h-8 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={goToNext}
                  disabled={activeIndex === CODE_ERAS.length - 1}
                  className="w-8 h-8 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Language</div>
                <div className="text-white">{activeEra.language}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Paradigm</div>
                <div className="text-white">{activeEra.paradigm}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Storage</div>
                <div className="text-white">{activeEra.storage}</div>
              </div>
            </div>

            <p className="text-gray-300 text-sm">{activeEra.description}</p>
          </div>

          {/* Code Display */}
          <div className="animate-fade-in" key={`code-${activeEra.year}`}>
            <h3 className="text-gray-500 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>💻</span> Code From This Era
            </h3>
            <CodeDisplay era={activeEra} />
          </div>

          {/* Fun Fact */}
          <div className="border border-gray-700 p-4 animate-fade-in" key={`fact-${activeEra.year}`}>
            <div className="flex items-start gap-3">
              <span className="text-xl">📜</span>
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">Fun Fact</div>
                <p className="text-gray-300 text-sm">{activeEra.funFact}</p>
              </div>
            </div>
          </div>

          {/* WIZ Comment */}
          <div className="border border-gray-800 bg-gray-900/50 p-4 animate-fade-in" key={`wiz-${activeEra.year}`}>
            <div className="flex items-start gap-3">
              <span className="text-xl">🧙</span>
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">WIZ&apos;s Take</div>
                <p className="text-gray-300 italic text-sm">&quot;{activeEra.wizComment}&quot;</p>
              </div>
            </div>
          </div>

          {/* Era Selector - Mobile */}
          <div className="lg:hidden">
            <h3 className="text-gray-500 text-xs uppercase tracking-wider mb-3">Jump to Era</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {CODE_ERAS.map((era, i) => (
                <button
                  key={era.year}
                  onClick={() => { setIsAutoPlaying(false); setActiveIndex(i); }}
                  className={`p-2 border text-center transition-colors ${
                    i === activeIndex
                      ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                      : 'border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <div className="font-mono text-sm">{era.year}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>1952</span>
              <span>{Math.round((activeIndex / (CODE_ERAS.length - 1)) * 100)}% through history</span>
              <span>2024</span>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500"
                style={{ width: `${(activeIndex / (CODE_ERAS.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 pt-6 border-t border-gray-800 text-center">
        <p className="text-gray-600 text-xs">
          From punch cards to AI pair programming. 70 years of humans teaching machines to think.
        </p>
        <p className="text-gray-700 text-xs mt-2">
          Next milestone: machines teaching humans to think?
        </p>
      </div>
    </div>
  );
}

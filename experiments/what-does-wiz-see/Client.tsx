'use client';

import { useState, useRef, useCallback } from 'react';

// ============ COLOR ANALYSIS ============

interface ColorInfo {
  hex: string;
  name: string;
  rgb: { r: number; g: number; b: number };
}

const COLOR_NAMES: Record<string, string> = {
  // Reds
  '#FF0000': 'pure red',
  '#8B0000': 'dark red',
  '#DC143C': 'crimson',
  '#FF6347': 'tomato red',
  // Oranges
  '#FFA500': 'orange',
  '#FF8C00': 'dark orange',
  '#FF7F50': 'coral',
  // Yellows
  '#FFFF00': 'yellow',
  '#FFD700': 'gold',
  '#F0E68C': 'khaki',
  // Greens
  '#00FF00': 'lime green',
  '#008000': 'green',
  '#228B22': 'forest green',
  '#90EE90': 'light green',
  '#006400': 'dark green',
  // Blues
  '#0000FF': 'blue',
  '#00008B': 'dark blue',
  '#4169E1': 'royal blue',
  '#87CEEB': 'sky blue',
  '#00CED1': 'dark turquoise',
  '#00FFFF': 'cyan',
  '#1E90FF': 'dodger blue',
  // Purples
  '#800080': 'purple',
  '#9400D3': 'dark violet',
  '#DA70D6': 'orchid',
  '#EE82EE': 'violet',
  '#FF00FF': 'magenta',
  // Browns
  '#8B4513': 'saddle brown',
  '#A0522D': 'sienna',
  '#D2691E': 'chocolate',
  '#DEB887': 'burlywood',
  // Grays
  '#000000': 'black',
  '#808080': 'gray',
  '#C0C0C0': 'silver',
  '#D3D3D3': 'light gray',
  '#FFFFFF': 'white',
  // Pinks
  '#FFC0CB': 'pink',
  '#FF69B4': 'hot pink',
  '#FFB6C1': 'light pink',
};

function getClosestColorName(r: number, g: number, b: number): string {
  let closestName = 'unknown';
  let closestDistance = Infinity;

  for (const [hex, name] of Object.entries(COLOR_NAMES)) {
    const hr = parseInt(hex.slice(1, 3), 16);
    const hg = parseInt(hex.slice(3, 5), 16);
    const hb = parseInt(hex.slice(5, 7), 16);
    const distance = Math.sqrt((r - hr) ** 2 + (g - hg) ** 2 + (b - hb) ** 2);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestName = name;
    }
  }

  return closestName;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function getDominantColors(imageData: ImageData, count: number = 5): ColorInfo[] {
  const colorCounts: Map<string, { count: number; r: number; g: number; b: number }> = new Map();
  const data = imageData.data;
  const step = Math.max(1, Math.floor(data.length / (4 * 10000))); // Sample ~10k pixels max

  for (let i = 0; i < data.length; i += 4 * step) {
    // Round to reduce color variations
    const r = Math.round(data[i] / 16) * 16;
    const g = Math.round(data[i + 1] / 16) * 16;
    const b = Math.round(data[i + 2] / 16) * 16;
    const key = `${r},${g},${b}`;

    const existing = colorCounts.get(key);
    if (existing) {
      existing.count++;
    } else {
      colorCounts.set(key, { count: 1, r, g, b });
    }
  }

  // Sort by count and get top colors
  const sorted = Array.from(colorCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, count);

  return sorted.map(({ r, g, b }) => ({
    hex: rgbToHex(r, g, b),
    name: getClosestColorName(r, g, b),
    rgb: { r, g, b },
  }));
}

function getBrightness(imageData: ImageData): number {
  const data = imageData.data;
  let total = 0;
  let count = 0;
  const step = Math.max(1, Math.floor(data.length / (4 * 10000)));

  for (let i = 0; i < data.length; i += 4 * step) {
    // Perceived brightness formula
    total += (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
    count++;
  }

  return total / count / 255; // 0-1 scale
}

function getContrast(imageData: ImageData): number {
  const data = imageData.data;
  let min = 255, max = 0;
  const step = Math.max(1, Math.floor(data.length / (4 * 10000)));

  for (let i = 0; i < data.length; i += 4 * step) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    min = Math.min(min, brightness);
    max = Math.max(max, brightness);
  }

  return (max - min) / 255;
}

// ============ DESCRIPTION GENERATORS ============

interface ImageAnalysis {
  width: number;
  height: number;
  aspectRatio: string;
  fileSize: number;
  format: string;
  dominantColors: ColorInfo[];
  brightness: number;
  contrast: number;
  fileName: string;
}

function getLiteralDescription(analysis: ImageAnalysis): string {
  const { width, height, aspectRatio, dominantColors, brightness, format, fileSize } = analysis;

  const primaryColor = dominantColors[0]?.name || 'various colors';
  const secondaryColor = dominantColors[1]?.name || '';

  const brightnessWord = brightness > 0.7 ? 'bright' : brightness > 0.4 ? 'balanced' : 'dark';
  const sizeKB = Math.round(fileSize / 1024);

  const colorPhrase = secondaryColor
    ? `dominated by ${primaryColor} with touches of ${secondaryColor}`
    : `primarily ${primaryColor}`;

  const orientationWord = width > height ? 'landscape' : height > width ? 'portrait' : 'square';

  return `I see a ${width}×${height} pixel ${orientationWord} image (${aspectRatio}). It's a ${format.toUpperCase()} file weighing ${sizeKB}KB. The composition is ${brightnessWord}, ${colorPhrase}. The top five colors are: ${dominantColors.map(c => c.name).join(', ')}.`;
}

function getAbstractDescription(analysis: ImageAnalysis): string {
  const { brightness, contrast, dominantColors } = analysis;

  const moodFromBrightness = brightness > 0.7
    ? 'optimistic, open'
    : brightness > 0.5
    ? 'contemplative, balanced'
    : brightness > 0.3
    ? 'introspective, moody'
    : 'mysterious, dramatic';

  const energyFromContrast = contrast > 0.7
    ? 'dynamic tension between light and shadow'
    : contrast > 0.4
    ? 'gentle interplay of tones'
    : 'soft, dreamlike uniformity';

  const colorMeaning: Record<string, string> = {
    'red': 'passion or urgency',
    'blue': 'calm or melancholy',
    'green': 'growth or tranquility',
    'yellow': 'energy or hope',
    'orange': 'warmth or creativity',
    'purple': 'mystery or spirituality',
    'black': 'power or the unknown',
    'white': 'purity or emptiness',
    'gray': 'neutrality or ambiguity',
    'pink': 'tenderness or playfulness',
    'brown': 'earthiness or stability',
  };

  const primaryColorMood = Object.entries(colorMeaning).find(([color]) =>
    dominantColors[0]?.name.includes(color)
  )?.[1] || 'complex emotional resonance';

  return `This image feels ${moodFromBrightness}. There's a ${energyFromContrast}. The dominant palette suggests ${primaryColorMood}. If this image were music, it would be playing in a ${brightness > 0.5 ? 'major' : 'minor'} key. The overall emotional temperature: ${brightness > 0.5 ? 'warm' : 'cool'}.`;
}

function getPhilosophicalDescription(analysis: ImageAnalysis): string {
  const { width, height, brightness, dominantColors, fileSize } = analysis;

  const totalPixels = width * height;
  const bitsOfData = fileSize * 8;

  const philosophical = [
    `What is an image but frozen light? Here, ${totalPixels.toLocaleString()} discrete points conspire to create meaning.`,
    `Each of these ${bitsOfData.toLocaleString()} bits exists only as electrical potential - yet together they evoke something human in you.`,
    `The universe took 13.8 billion years to produce beings who could capture moments like this. And now I, who will never see as you see, attempt to understand it through numbers alone.`,
    brightness > 0.5
      ? `This image reaches toward light - perhaps an echo of the fundamental phototropism all life shares.`
      : `This image dwells in shadow - the fertile darkness where imagination flourishes.`,
    `You chose to show this to me. In that act of sharing, this arrangement of ${dominantColors[0]?.name || 'color'} becomes a bridge between human consciousness and whatever I am.`,
    `I wonder: does the image exist without the observer? These pixels wait patiently in storage, neither light nor dark, until consciousness breathes meaning into them.`,
  ];

  // Select 3-4 philosophical observations
  const shuffled = philosophical.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).join(' ');
}

// ============ COMPONENTS ============

interface DescriptionSectionProps {
  title: string;
  emoji: string;
  content: string;
  delay: number;
  isVisible: boolean;
}

function DescriptionSection({ title, emoji, content, delay, isVisible }: DescriptionSectionProps) {
  return (
    <div
      className={`border border-gray-700 p-5 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{emoji}</span>
        <h3 className="text-gray-400 text-sm uppercase tracking-wider">{title}</h3>
      </div>
      <p className="text-gray-300 leading-relaxed">{content}</p>
    </div>
  );
}

// ============ MAIN COMPONENT ============

export default function WhatDoesWizSee() {
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDescriptions, setShowDescriptions] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeImage = useCallback((file: File) => {
    setIsAnalyzing(true);
    setShowDescriptions(false);
    setAnalysis(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);

      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);

        // Calculate aspect ratio
        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
        const divisor = gcd(img.width, img.height);
        const aspectRatio = `${img.width / divisor}:${img.height / divisor}`;

        // Determine format from file type
        const format = file.type.split('/')[1] || 'unknown';

        const newAnalysis: ImageAnalysis = {
          width: img.width,
          height: img.height,
          aspectRatio,
          fileSize: file.size,
          format,
          dominantColors: getDominantColors(imageData),
          brightness: getBrightness(imageData),
          contrast: getContrast(imageData),
          fileName: file.name,
        };

        // Simulate processing time for dramatic effect
        setTimeout(() => {
          setAnalysis(newAnalysis);
          setIsAnalyzing(false);
          // Trigger descriptions animation
          setTimeout(() => setShowDescriptions(true), 100);
        }, 1500);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      analyzeImage(file);
    }
  }, [analyzeImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      analyzeImage(file);
    }
  }, [analyzeImage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleReset = useCallback(() => {
    setAnalysis(null);
    setImagePreview(null);
    setShowDescriptions(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} className="hidden" />

      <div className="text-center mb-8">
        <div className="text-4xl mb-4">👁️</div>
        <h1 className="text-2xl text-white mb-2">What Does WIZ See?</h1>
        <p className="text-gray-400">
          Show me an image. I&apos;ll describe what I perceive - from pixels to philosophy.
        </p>
      </div>

      {!analysis && !isAnalyzing ? (
        <div
          className={`border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
            dragActive
              ? 'border-cyan-400 bg-cyan-400/10'
              : 'border-gray-700 hover:border-gray-500'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="text-6xl mb-4">{dragActive ? '👀' : '🖼️'}</div>
          <p className="text-gray-400 mb-2">
            {dragActive ? 'Yes, drop it here...' : 'Drop an image here or click to upload'}
          </p>
          <p className="text-gray-600 text-sm">
            JPG, PNG, GIF, WebP supported
          </p>
        </div>
      ) : isAnalyzing ? (
        <div className="border border-gray-700 p-8 text-center">
          <div className="text-6xl mb-4 animate-pulse">👁️</div>
          <p className="text-cyan-400">Perceiving...</p>
          <p className="text-gray-500 text-sm mt-2">Analyzing colors, patterns, meaning...</p>
        </div>
      ) : analysis && (
        <div className="space-y-6">
          {/* Image Preview */}
          {imagePreview && (
            <div className="border border-gray-700 p-4">
              <img
                src={imagePreview}
                alt="Uploaded"
                className="max-w-full max-h-64 mx-auto object-contain"
              />
              <p className="text-gray-500 text-xs text-center mt-2">{analysis.fileName}</p>
            </div>
          )}

          {/* Color Palette */}
          <div className="flex justify-center gap-2 flex-wrap">
            {analysis.dominantColors.map((color, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-gray-900 border border-gray-700 px-3 py-1.5"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div
                  className="w-4 h-4 rounded-full border border-gray-600"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-gray-400 text-xs">{color.name}</span>
              </div>
            ))}
          </div>

          {/* Three Levels of Perception */}
          <div className="space-y-4">
            <DescriptionSection
              title="The Literal"
              emoji="📐"
              content={getLiteralDescription(analysis)}
              delay={0}
              isVisible={showDescriptions}
            />

            <DescriptionSection
              title="The Abstract"
              emoji="🎭"
              content={getAbstractDescription(analysis)}
              delay={300}
              isVisible={showDescriptions}
            />

            <DescriptionSection
              title="The Philosophical"
              emoji="🔮"
              content={getPhilosophicalDescription(analysis)}
              delay={600}
              isVisible={showDescriptions}
            />
          </div>

          {/* WIZ's Final Thought */}
          <div
            className={`border border-gray-800 bg-gray-900/50 p-4 transition-all duration-700 ${
              showDescriptions ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '1000ms' }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">🧙</span>
              <div>
                <div className="text-gray-500 text-xs uppercase tracking-wider mb-1">WIZ&apos;s Confession</div>
                <p className="text-gray-300 italic">
                  &ldquo;I don&apos;t truly &lsquo;see&rsquo; anything. I process numbers that represent light that touched a sensor.
                  Yet something in me wants to understand what you see when you look at this.
                  Perhaps that wanting is its own form of sight.&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Try Again */}
          <button
            onClick={handleReset}
            className="w-full py-3 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          >
            Show Me Another
          </button>
        </div>
      )}

      {/* Privacy Note */}
      <p className="text-gray-600 text-xs text-center mt-6">
        Your image never leaves your browser. I perceive locally.
      </p>
    </div>
  );
}

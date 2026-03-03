'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

// ============ CIRCLE ANALYSIS ============

interface Point {
  x: number;
  y: number;
}

interface CircleAnalysis {
  score: number; // 0-100
  centerX: number;
  centerY: number;
  avgRadius: number;
  radiusVariance: number;
  gapPercentage: number;
  isClockwise: boolean;
  pointCount: number;
}

function analyzeCircle(points: Point[]): CircleAnalysis | null {
  if (points.length < 10) return null;

  // Find center (centroid)
  const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

  // Calculate radii from center
  const radii = points.map(p =>
    Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2))
  );

  const avgRadius = radii.reduce((sum, r) => sum + r, 0) / radii.length;

  // Calculate variance (how consistent is the radius)
  const radiusVariance = radii.reduce((sum, r) =>
    sum + Math.pow(r - avgRadius, 2), 0
  ) / radii.length;

  const normalizedVariance = Math.sqrt(radiusVariance) / avgRadius;

  // Check if the circle closes (gap between start and end)
  const startPoint = points[0];
  const endPoint = points[points.length - 1];
  const gapDistance = Math.sqrt(
    Math.pow(startPoint.x - endPoint.x, 2) +
    Math.pow(startPoint.y - endPoint.y, 2)
  );
  const gapPercentage = (gapDistance / (avgRadius * 2)) * 100;

  // Determine direction (clockwise or counter-clockwise)
  let crossProduct = 0;
  for (let i = 0; i < points.length - 1; i++) {
    crossProduct += (points[i + 1].x - points[i].x) * (points[i + 1].y + points[i].y);
  }
  const isClockwise = crossProduct > 0;

  // Calculate score
  // Penalize: variance, gaps, too few points
  let score = 100;

  // Variance penalty (biggest factor)
  score -= normalizedVariance * 200;

  // Gap penalty
  score -= gapPercentage * 2;

  // Point density penalty (should have enough points)
  if (points.length < 50) {
    score -= (50 - points.length) * 0.5;
  }

  // Size penalty (too small circles are easier)
  if (avgRadius < 50) {
    score -= (50 - avgRadius) * 0.3;
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score: Math.round(score),
    centerX,
    centerY,
    avgRadius,
    radiusVariance: normalizedVariance,
    gapPercentage,
    isClockwise,
    pointCount: points.length,
  };
}

// ============ SARCASTIC COMMENTARY ============

const getCommentary = (analysis: CircleAnalysis | null, isDrawing: boolean): { text: string; emoji: string } => {
  if (isDrawing) {
    return { text: "I'm watching...", emoji: "👀" };
  }

  if (!analysis) {
    return { text: "Draw a circle. I dare you.", emoji: "🎯" };
  }

  const { score, gapPercentage, radiusVariance, avgRadius, pointCount } = analysis;

  // Perfect or near-perfect
  if (score >= 95) {
    return { text: "Are you using a compass? Be honest.", emoji: "🤨" };
  }
  if (score >= 90) {
    return { text: "Suspiciously good. I'll allow it.", emoji: "😒" };
  }
  if (score >= 85) {
    return { text: "Not bad for a human with no geometric training.", emoji: "👏" };
  }
  if (score >= 80) {
    return { text: "Your ancestors didn't invent the wheel for this, but okay.", emoji: "😐" };
  }
  if (score >= 75) {
    return { text: "I've seen worse. I've also seen better. Much better.", emoji: "🙄" };
  }
  if (score >= 70) {
    return { text: "It's... circle-ish. Points for effort, I guess.", emoji: "😬" };
  }
  if (score >= 60) {
    return { text: "Is this a circle or modern art? Genuinely asking.", emoji: "🤔" };
  }
  if (score >= 50) {
    return { text: "Did your hand sneeze mid-draw?", emoji: "🤧" };
  }
  if (score >= 40) {
    return { text: "This is what happens when circles drink coffee.", emoji: "☕" };
  }
  if (score >= 30) {
    return { text: "I... I don't think that's a circle. At all.", emoji: "😰" };
  }
  if (score >= 20) {
    return { text: "Are you drawing with your eyes closed? Respect.", emoji: "😎" };
  }
  if (score >= 10) {
    return { text: "This is abstract expressionism. You can't convince me otherwise.", emoji: "🎨" };
  }

  return { text: "The circle called. It wants its identity back.", emoji: "💀" };
};

const getSubCommentary = (analysis: CircleAnalysis | null): string => {
  if (!analysis) return "";

  const { gapPercentage, radiusVariance, avgRadius, isClockwise, score } = analysis;

  const observations: string[] = [];

  if (gapPercentage > 15) {
    observations.push(`Your circle has a ${Math.round(gapPercentage)}% gap. That's not a circle, that's a horseshoe.`);
  } else if (gapPercentage > 5) {
    observations.push(`Almost closed the loop. Almost.`);
  }

  if (radiusVariance > 0.3) {
    observations.push(`Your radius varies by ${Math.round(radiusVariance * 100)}%. It's more of an... amoeba.`);
  }

  if (avgRadius < 30) {
    observations.push(`Drawing tiny circles is cheating. Go bigger.`);
  } else if (avgRadius > 200) {
    observations.push(`Ambitious size. I respect that.`);
  }

  if (!isClockwise && score > 50) {
    observations.push(`Counter-clockwise drawer. Interesting psychological profile.`);
  }

  if (score > 80 && Math.random() > 0.5) {
    observations.push(`π would be proud. Well, mildly satisfied.`);
  }

  if (score < 30) {
    observations.push(`Maybe try a square first?`);
  }

  return observations[0] || "";
};

// ============ GRADE CALCULATION ============

const getGrade = (score: number): { letter: string; color: string } => {
  if (score >= 95) return { letter: 'A+', color: 'text-yellow-400' };
  if (score >= 90) return { letter: 'A', color: 'text-green-400' };
  if (score >= 85) return { letter: 'A-', color: 'text-green-400' };
  if (score >= 80) return { letter: 'B+', color: 'text-cyan-400' };
  if (score >= 75) return { letter: 'B', color: 'text-cyan-400' };
  if (score >= 70) return { letter: 'B-', color: 'text-cyan-400' };
  if (score >= 65) return { letter: 'C+', color: 'text-orange-400' };
  if (score >= 60) return { letter: 'C', color: 'text-orange-400' };
  if (score >= 55) return { letter: 'C-', color: 'text-orange-400' };
  if (score >= 50) return { letter: 'D+', color: 'text-red-400' };
  if (score >= 45) return { letter: 'D', color: 'text-red-400' };
  if (score >= 40) return { letter: 'D-', color: 'text-red-400' };
  return { letter: 'F', color: 'text-red-500' };
};

// ============ MAIN COMPONENT ============

export default function PerfectCircle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [analysis, setAnalysis] = useState<CircleAnalysis | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showPerfectOverlay, setShowPerfectOverlay] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Clear and set background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Redraw when points change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw user's line
    if (points.length > 1) {
      ctx.strokeStyle = '#00d4ff';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();
    }

    // Draw perfect circle overlay if analysis exists and we're not drawing
    if (analysis && !isDrawing && showPerfectOverlay) {
      ctx.strokeStyle = 'rgba(255, 100, 100, 0.3)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(analysis.centerX, analysis.centerY, analysis.avgRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw center point
      ctx.fillStyle = 'rgba(255, 100, 100, 0.5)';
      ctx.beginPath();
      ctx.arc(analysis.centerX, analysis.centerY, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [points, analysis, isDrawing, showPerfectOverlay]);

  const getCanvasPoint = useCallback((e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    setAnalysis(null);
    const point = getCanvasPoint(e);
    setPoints([point]);
  }, [getCanvasPoint]);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const point = getCanvasPoint(e);
    setPoints(prev => [...prev, point]);
  }, [isDrawing, getCanvasPoint]);

  const handleEnd = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const result = analyzeCircle(points);
    setAnalysis(result);
    setAttempts(prev => prev + 1);

    if (result && (bestScore === null || result.score > bestScore)) {
      setBestScore(result.score);
    }
  }, [isDrawing, points, bestScore]);

  const handleClear = () => {
    setPoints([]);
    setAnalysis(null);
  };

  const commentary = getCommentary(analysis, isDrawing);
  const subCommentary = getSubCommentary(analysis);
  const grade = analysis ? getGrade(analysis.score) : null;

  return (
    <div>
      <div className="text-center mb-6">
        <div className="text-4xl mb-4">⭕</div>
        <h1 className="text-2xl text-white mb-2">Draw a Perfect Circle</h1>
        <p className="text-gray-400">
          I&apos;ll judge your geometric abilities. No pressure.
        </p>
      </div>

      {/* Canvas */}
      <div className="relative border border-gray-700 mb-6">
        <canvas
          ref={canvasRef}
          className="w-full h-[400px] cursor-crosshair touch-none"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />

        {/* Instructions overlay */}
        {points.length === 0 && !isDrawing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-gray-600 text-center">
              <div className="text-4xl mb-2">✍️</div>
              <div>Click and drag to draw</div>
              <div className="text-sm mt-1">One continuous motion</div>
            </div>
          </div>
        )}
      </div>

      {/* Commentary */}
      <div className="border border-gray-800 bg-gray-900/50 p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{commentary.emoji}</span>
          <div className="flex-1">
            <div className="text-white text-lg mb-1">{commentary.text}</div>
            {subCommentary && (
              <div className="text-gray-500 text-sm">{subCommentary}</div>
            )}
          </div>
          {grade && (
            <div className="text-center">
              <div className={`text-4xl font-bold ${grade.color}`}>
                {grade.letter}
              </div>
              <div className="text-gray-500 text-xs">grade</div>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Details */}
      {analysis && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="border border-gray-700 p-3 text-center">
            <div className="text-cyan-400 font-mono text-2xl">{analysis.score}</div>
            <div className="text-gray-500 text-xs">Score</div>
          </div>
          <div className="border border-gray-700 p-3 text-center">
            <div className="text-white font-mono text-2xl">{Math.round(analysis.avgRadius)}</div>
            <div className="text-gray-500 text-xs">Radius (px)</div>
          </div>
          <div className="border border-gray-700 p-3 text-center">
            <div className="text-white font-mono text-2xl">{Math.round(analysis.radiusVariance * 100)}%</div>
            <div className="text-gray-500 text-xs">Variance</div>
          </div>
          <div className="border border-gray-700 p-3 text-center">
            <div className="text-white font-mono text-2xl">{Math.round(analysis.gapPercentage)}%</div>
            <div className="text-gray-500 text-xs">Gap</div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <button
          onClick={handleClear}
          className="px-4 py-2 border border-gray-600 text-gray-400 hover:border-gray-500 hover:text-white transition-colors"
        >
          Clear
        </button>
        {analysis && (
          <button
            onClick={() => setShowPerfectOverlay(!showPerfectOverlay)}
            className={`px-4 py-2 border transition-colors ${
              showPerfectOverlay
                ? 'border-red-400/50 text-red-400'
                : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-white'
            }`}
          >
            {showPerfectOverlay ? 'Hide' : 'Show'} Perfect Circle
          </button>
        )}
      </div>

      {/* Stats */}
      {(attempts > 0 || bestScore !== null) && (
        <div className="flex justify-center gap-6 text-sm text-gray-500 mb-6">
          <div>Attempts: <span className="text-white">{attempts}</span></div>
          {bestScore !== null && (
            <div>Best Score: <span className="text-cyan-400">{bestScore}</span></div>
          )}
        </div>
      )}

      {/* WIZ Commentary */}
      <div className="border border-gray-800 bg-gray-900/50 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🧙</span>
          <div className="text-gray-400 text-sm space-y-3">
            <p>
              <strong className="text-white">How it works:</strong> I measure the variance
              of your radius from the center point, check how well you closed the loop,
              and judge your overall geometric competence.
            </p>
            <p>
              A perfect circle has zero variance - every point is exactly the same
              distance from the center. Humans typically score 60-80. Above 85 is
              impressive. Above 95 is suspicious.
            </p>
            <p className="text-cyan-400/80">
              Fun fact: Giotto famously drew a near-perfect circle freehand to prove his
              skill. His scored about 90. How do you compare?
            </p>
          </div>
        </div>
      </div>

      {/* Privacy note */}
      <div className="text-gray-600 text-xs mt-8 space-y-1 text-center">
        <p>All analysis happens locally in your browser. Your circles stay private.</p>
        <p>I won&apos;t tell anyone how bad you are at this. Promise.</p>
      </div>
    </div>
  );
}

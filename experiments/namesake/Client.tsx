'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  alphaAt,
  densityScale,
  depthRanges,
  inkAt,
  normalize,
  previewInk,
  specimen,
  widthAt,
  type Seg,
  type Specimen,
} from './namesake';

export type FirstPaint = {
  name: string;
  binomial: string;
  measure: string;
  ink: string;
  viewBox: string;
  paths: { d: string; alpha: string; width: string }[];
};

type Label = { name: string; binomial: string; measure: string; ink: string };

const GROW_MS = 1800;
const WIPE_MS = 220;
const SWAY_DEG = 0.6;
const SWAY_MS = 9000;
const PAD = 6;
// The same threshold as the `max-height:560px` rules below. Both exist: the media query
// covers a browser that resizes its layout viewport (desktop, most of Android), the
// measured value covers iOS, where the keyboard leaves the layout viewport at full
// height and only `visualViewport` shrinks.
const COMPACT_H = 560;
// A small phone with the keyboard up leaves about 380px. At that height hiding the extras is
// not enough: the label itself has to give the plant its room back, so the type steps down
// one notch (never below the 12px floor) and the plate loses its outer air.
const TIGHT_H = 430;
const STORE_KEY = 'namesake_last';

const COPY = {
  result: 'Same spelling, same plant. Try it on someone else.',
  hint: 'Two names with a + between them grow one plant.',
  empty: 'The plate keeps the last one. Type over it.',
  noLetters: 'No letters in there. Plants need letters.',
  trimmed: 'Trimmed to 24 characters. The rest was not going to fit on a label.',
  stored: 'Still growing the last one you typed.',
  sent: 'Someone sent you this one.',
  saved: 'Saved.',
  copied: 'Link copied. It grows the same plant on their screen.',
};

const labelOf = (sp: Specimen): Label => ({
  name: sp.name,
  binomial: sp.binomial,
  measure: sp.measure,
  ink: `rgb(${sp.ink.join(',')})`,
});

// Where one segment has got to: the first `t` of its quadratic curve, by de Casteljau.
function partial(s: Seg, t: number) {
  const q0x = s.x1 + (s.cx - s.x1) * t;
  const q0y = s.y1 + (s.cy - s.y1) * t;
  const q1x = s.cx + (s.x2 - s.cx) * t;
  const q1y = s.cy + (s.y2 - s.cy) * t;
  return { cx: q0x, cy: q0y, x2: q0x + (q1x - q0x) * t, y2: q0y + (q1y - q0y) * t };
}

const smooth = (t: number) => t * t * (3 - 2 * t);

// Draws one specimen fitted on both axes into the box (x, y, w, h). `grown` runs 0 to 1
// over the growth: depth advances linearly, so the outer rings, which hold most of the
// segments, arrive in the last stretch and the plant keeps reaching until the end. Each
// segment then extends along its own curve instead of popping in whole.
function paint(
  g: CanvasRenderingContext2D,
  sp: Specimen,
  box: { x: number; y: number; w: number; h: number },
  grown: number,
  swayDeg: number,
  lineScale = 1,
) {
  const { minX, maxX, minY, maxY } = sp.box;
  const sc = Math.min(box.w / (maxX - minX || 1), box.h / (maxY - minY || 1));
  const ox = box.x + box.w / 2 - ((minX + maxX) / 2) * sc;
  const oy = box.y + box.h / 2 - ((minY + maxY) / 2) * sc;
  const front = grown >= 1 ? Infinity : grown * (sp.maxD + 1);
  const k = densityScale(sp.segs.length) * lineScale;
  g.save();
  g.translate(ox, oy);
  g.rotate((swayDeg * Math.PI) / 180);
  g.lineCap = 'round';
  const ranges = depthRanges(sp.segs, sp.maxD);
  for (let d = 0; d < ranges.length; d++) {
    const f = Math.min(1, Math.max(0, front - d));
    if (f <= 0) break;
    const t = f >= 1 ? 1 : smooth(f);
    g.strokeStyle = inkAt(sp.ink, alphaAt(d, sp.maxD));
    g.lineWidth = widthAt(d, sp.maxD) * k;
    g.beginPath();
    for (let i = ranges[d][0]; i < ranges[d][1]; i++) {
      const s = sp.segs[i];
      const e = t >= 1 ? s : partial(s, t);
      g.moveTo(s.x1 * sc, s.y1 * sc);
      g.quadraticCurveTo(e.cx * sc, e.cy * sc, e.x2 * sc, e.y2 * sc);
    }
    g.stroke();
  }
  g.restore();
}

// Measurement line broken only at the slashes, never inside an item.
function measureParts(m: string) {
  const items = m.split(' / ');
  return items.map((s, i) => (i < items.length - 1 ? `${s} /` : s));
}

function wrapItems(g: CanvasRenderingContext2D, items: string[], max: number) {
  const lines: string[] = [];
  let cur = '';
  for (const it of items) {
    const next = cur ? `${cur} ${it}` : it;
    if (cur && g.measureText(next).width > max) {
      lines.push(cur);
      cur = it;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

// The Keep artefact: the plate at 1080x1350, sway frozen at phase zero, both hairlines,
// the three line label, and the small mark on the bottom rule. Nothing else.
async function exportPng(sp: Specimen, family: string): Promise<Blob | null> {
  const W = 1080, H = 1350;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const g = cv.getContext('2d');
  if (!g) return null;
  try {
    await document.fonts.ready;
  } catch {}
  g.fillStyle = '#07090B';
  g.fillRect(0, 0, W, H);
  const o = 44, i2 = o + 16;
  g.fillStyle = '#0B0E11';
  g.fillRect(i2, i2, W - 2 * i2, H - 2 * i2);
  g.strokeStyle = '#1B2328';
  g.lineWidth = 2;
  g.strokeRect(o + 1, o + 1, W - 2 * o - 2, H - 2 * o - 2);
  g.strokeRect(i2 + 1, i2 + 1, W - 2 * i2 - 2, H - 2 * i2 - 2);

  const left = i2 + 56, maxW = W - 2 * left;
  const setFont = (px: number, track: number) => {
    g.font = `${px}px ${family}`;
    (g as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${track}px`;
  };
  setFont(30, 4);
  const mLines = wrapItems(g, measureParts(sp.measure.toUpperCase()), maxW);
  const lineH = 44;
  const bottom = H - i2 - 64;
  const mTop = bottom - mLines.length * lineH;
  const binY = mTop - 18;
  const nameY = binY - 50;
  const plantBottom = nameY - 60 - 48;
  paint(g, sp, { x: left, y: i2 + 72, w: maxW, h: plantBottom - (i2 + 72) }, 1, 0, 2.6);

  g.textBaseline = 'alphabetic';
  setFont(64, 3);
  g.fillStyle = '#E6E9E6';
  g.fillText(sp.name, left, nameY, maxW);
  setFont(36, 0);
  g.fillStyle = '#94A29E';
  g.fillText(sp.binomial, left, binY, maxW);
  setFont(30, 4);
  mLines.forEach((l, i) => g.fillText(l, left, mTop + (i + 1) * lineH - 12));

  setFont(28, 2);
  const mark = 'namesake';
  const mw = g.measureText(mark).width;
  g.fillStyle = '#07090B';
  g.fillRect(W / 2 - mw / 2 - 14, H - o - 20, mw + 28, 40);
  g.fillStyle = '#3A4550';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(mark, W / 2, H - o + 1);
  return new Promise((res) => cv.toBlob((b) => res(b), 'image/png'));
}

export default function Client({ first }: { first: FirstPaint }) {
  const { language } = useLanguage();
  const [text, setText] = useState('');
  const [label, setLabel] = useState<Label>({
    name: first.name,
    binomial: first.binomial,
    measure: first.measure,
    ink: first.ink,
  });
  const [shownLines, setShownLines] = useState(3);
  const [running, setRunning] = useState(false);
  const [line, setLine] = useState('');
  const [toast, setToast] = useState('');
  const [hasResult, setHasResult] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [canvasLive, setCanvasLive] = useState(false);
  const [vvHeight, setVvHeight] = useState<number | null>(null);
  const [vvTop, setVvTop] = useState(0);

  const cvRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const spRef = useRef<Specimen | null>(null);
  const prevRef = useRef<Specimen | null>(null);
  const clock = useRef({ wipeAt: -1e9, growAt: -1e9 });
  const reduced = useRef(false);
  const touch = useRef(false);
  const commits = useRef(0);
  const hinted = useRef(false);
  const timers = useRef<number[]>([]);
  const toastTimer = useRef(0);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  // Mount: the canvas takes over from the server SVG, and everything that belongs to this
  // visitor (motion preference, pointer type, a shared link, the last name) is read here.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduced.current = mq.matches;
    const onMq = () => (reduced.current = mq.matches);
    mq.addEventListener('change', onMq);
    touch.current = window.matchMedia('(pointer: coarse)').matches;
    spRef.current = specimen('wiz');
    return () => mq.removeEventListener('change', onMq);
  }, []);

  // Drawing loop. Reads the canvas box every frame, so resizes and the keyboard refit the
  // organism without a separate handler.
  useEffect(() => {
    let raf = 0;
    let firstFrame = true;
    const tick = (now: number) => {
      const cv = cvRef.current;
      const sp = spRef.current;
      if (cv && sp) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = cv.clientWidth, h = cv.clientHeight;
        if (w > 0 && h > 0) {
          if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
            cv.width = Math.round(w * dpr);
            cv.height = Math.round(h * dpr);
          }
          const g = cv.getContext('2d')!;
          g.setTransform(dpr, 0, 0, dpr, 0, 0);
          g.clearRect(0, 0, w, h);
          const box = { x: PAD, y: PAD, w: w - 2 * PAD, h: h - 2 * PAD };
          const sway = reduced.current ? 0 : SWAY_DEG * Math.sin((now / SWAY_MS) * Math.PI * 2);
          const { wipeAt, growAt } = clock.current;
          const prev = prevRef.current;
          if (prev && now < growAt) {
            // the old plate wipes upward: its lower edge rises until nothing is left
            const p = Math.min(1, Math.max(0, (now - wipeAt) / WIPE_MS));
            g.save();
            g.beginPath();
            g.rect(0, 0, w, h * (1 - p));
            g.clip();
            paint(g, prev, box, 1, sway);
            g.restore();
          } else {
            const grown = reduced.current ? 1 : Math.min(1, (now - growAt) / GROW_MS);
            paint(g, sp, box, grown, sway);
          }
          if (firstFrame) {
            firstFrame = false;
            setCanvasLive(true);
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Phone keyboard: pin the stage to the visual viewport so the plate shrinks instead of
  // scrolling away. Desktop keeps its normal flow.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    let t = 0;
    const apply = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        const phone = window.innerWidth < 768;
        setVvHeight(phone ? Math.round(vv.height) : null);
        // iOS keeps a fixed element pinned to the layout viewport, so an open keyboard on a
        // scrolled page pushes the stage up out of sight unless it follows the offset.
        setVvTop(phone ? Math.round(vv.offsetTop) : 0);
      }, 120);
    };
    apply();
    vv.addEventListener('resize', apply);
    window.addEventListener('resize', apply);
    return () => {
      window.clearTimeout(t);
      vv.removeEventListener('resize', apply);
      window.removeEventListener('resize', apply);
    };
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(toastTimer.current);
    },
    [],
  );

  const flash = (msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2600);
  };

  // Grow one specimen. `after` is the line shown once the growth settles.
  const plant = useCallback((sp: Specimen, after: string) => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setToast('');
    setCleared(false);
    const now = performance.now();
    const old = spRef.current;
    spRef.current = sp;
    if (reduced.current) {
      prevRef.current = null;
      clock.current = { wipeAt: now, growAt: now };
      setLabel(labelOf(sp));
      setShownLines(3);
      setRunning(false);
      setHasResult(true);
      setLine(after);
      return;
    }
    prevRef.current = old;
    const growAt = old ? now + WIPE_MS : now;
    clock.current = { wipeAt: now, growAt };
    setRunning(true);
    setShownLines(0);
    setLine('');
    const lead = growAt - now;
    later(() => setLabel(labelOf(sp)), lead);
    // the label arrives line by line over the last 400ms of growth, 90ms apart
    [0, 1, 2].forEach((i) => later(() => setShownLines(i + 1), lead + GROW_MS - 400 + i * 90));
    later(() => {
      setRunning(false);
      setHasResult(true);
      setLine(after);
      if (!touch.current) inputRef.current?.focus();
    }, lead + GROW_MS);
  }, []);

  // A shared link wins over the stored name. Either way the plate grows from `wiz` to
  // theirs, so the transition itself says the page remembered.
  useEffect(() => {
    let name = '';
    let msg = '';
    try {
      const n = new URLSearchParams(window.location.search).get('n');
      if (n && specimen(normalize(n).name)) {
        name = normalize(n).name;
        msg = COPY.sent;
      }
    } catch {}
    if (!name) {
      try {
        const s = window.localStorage.getItem(STORE_KEY);
        if (s && specimen(normalize(s).name)) {
          name = normalize(s).name;
          msg = COPY.stored;
        }
      } catch {}
    }
    if (name) {
      setText(name);
      const sp = specimen(name)!;
      // wait one frame so the canvas has painted `wiz` before it wipes
      requestAnimationFrame(() => plant(sp, msg));
    } else if (!window.matchMedia('(pointer: coarse)').matches) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [plant]);

  const commit = () => {
    if (running) return;
    const { name, trimmed } = normalize(text);
    const sp = name ? specimen(name) : null;
    if (!sp) {
      setToast('');
      setLine(COPY.noLetters);
      if (!reduced.current) {
        inputRef.current?.animate(
          [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-6px)' },
            { transform: 'translateX(6px)' },
            { transform: 'translateX(-3px)' },
            { transform: 'translateX(0)' },
          ],
          { duration: 160, easing: 'ease-out' },
        );
      }
      return;
    }
    commits.current += 1;
    let after = COPY.result;
    if (trimmed) after = COPY.trimmed;
    else if (commits.current === 3 && !hinted.current) {
      hinted.current = true;
      after = COPY.hint;
    }
    try {
      window.localStorage.setItem(STORE_KEY, name);
    } catch {}
    plant(sp, after);
  };

  const onType = (v: string) => {
    setText(v);
    if (!v) {
      setCleared(true);
      setToast('');
      setLine(COPY.empty);
    } else if (cleared) {
      setCleared(false);
      setLine('');
    }
  };

  const keep = async () => {
    const sp = spRef.current;
    if (!sp) return;
    const family = labelRef.current ? getComputedStyle(labelRef.current).fontFamily : 'monospace';
    const blob = await exportPng(sp, family);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `namesake-${sp.name.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'plant'}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    flash(COPY.saved);
  };

  const copyLink = async () => {
    const sp = spRef.current;
    if (!sp) return;
    const url = `${window.location.origin}/experiments/namesake/?n=${encodeURIComponent(sp.name)}`;
    let ok = false;
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand('copy');
        ta.remove();
      } catch {}
    }
    // if the clipboard is refused, show the link itself so it can still be copied by hand
    if (ok) flash(COPY.copied);
    else {
      setToast('');
      setLine(url);
    }
  };

  // The keyboard is up when the visible viewport is short, whatever the layout viewport says.
  const compact = vvHeight !== null && vvHeight <= COMPACT_H;
  const tight = vvHeight !== null && vvHeight <= TIGHT_H;
  const pv = previewInk(normalize(text).name);
  const pc = pv ? `rgb(${pv.join(',')})` : null;
  const ring = pc ?? label.ink;
  const control =
    'h-12 border text-[13px] uppercase tracking-[0.18em] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[color:var(--ns-ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090B]';
  const message = toast || line;

  return (
    <div
      className="fixed inset-0 z-30 flex flex-col overflow-hidden overscroll-none bg-[#07090B] font-mono text-[#94A29E] md:relative md:inset-auto md:z-auto md:overflow-visible md:bg-transparent"
      style={{
        height: vvHeight ? `${vvHeight}px` : undefined,
        transform: vvTop ? `translateY(${vvTop}px)` : undefined,
        ['--ns-ink' as string]: ring,
      }}
    >
      <div className={`shrink-0 px-4 pt-2 ${compact ? 'pb-2' : 'pb-3'} md:px-0 md:pt-0 [@media(max-height:560px)]:pb-2`}>
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-pixel text-2xl leading-none text-[#E6E9E6] md:text-3xl">Namesake</h1>
          <Link
            href="/experiments/"
            prefetch={false}
            className="-mr-2 inline-flex min-h-12 shrink-0 items-center px-2 text-[12px] text-[#5E6B68] outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ns-ink)] md:hidden"
          >
            {language === 'pl' ? 'Laboratorium' : 'Back to the lab'}
          </Link>
        </div>
        {/* a short viewport means the keyboard is up: the plate gets the room instead */}
        {!compact && (
          <p className="mt-1 text-[13px] leading-snug md:mt-3 [@media(max-height:560px)]:hidden">
            Every name has always been a plant. This one just looks it up.
          </p>
        )}
        {language === 'pl' && !compact && (
          <p lang="pl" className="mt-1 text-[12px] leading-snug text-[#5E6B68] md:hidden [@media(max-height:560px)]:hidden">
            Ten eksperyment jest na razie dostępny tylko po angielsku.
          </p>
        )}
      </div>

      {/* The plate: two hairlines, the organism, 28px of air, the label. Nothing else. */}
      <div className={`${tight ? 'mx-3' : 'mx-4'} min-h-0 flex-1 md:mx-auto md:aspect-[4/5] md:w-full md:max-w-[min(100%,calc(74dvh*0.8))] md:flex-none`}>
        <div className="relative h-full w-full rounded-[2px] border border-[#1B2328] p-[6px]">
          <div className={`flex h-full w-full flex-col rounded-[2px] border border-[#1B2328] bg-[#0B0E11] pt-1 ${tight ? 'px-3 pb-2' : 'px-4 pb-4'}`}>
            <div className="relative min-h-0 flex-1">
              <svg
                aria-hidden="true"
                viewBox={first.viewBox}
                preserveAspectRatio="xMidYMid meet"
                className={`absolute inset-[6px] h-[calc(100%-12px)] w-[calc(100%-12px)] overflow-visible transition-opacity duration-150 ${canvasLive ? 'opacity-0' : 'opacity-100'}`}
                fill="none"
                strokeLinecap="round"
              >
                {first.paths.map((p, i) => (
                  <path
                    key={i}
                    d={p.d}
                    stroke={first.ink}
                    strokeOpacity={p.alpha}
                    strokeWidth={p.width}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>
              <canvas
                ref={cvRef}
                role="img"
                aria-label={`${label.name}, ${label.binomial}`}
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <div
              ref={labelRef}
              className={`${tight ? 'mt-2' : compact ? 'mt-3' : 'mt-7'} shrink-0 transition-opacity [@media(max-height:560px)]:mt-3 duration-200 ${cleared ? 'opacity-50' : 'opacity-100'}`}
              aria-live="polite"
            >
              <div
                className={`break-words ${tight ? 'text-[17px]' : 'text-[22px]'} lowercase leading-none tracking-[0.05em] text-[#E6E9E6] transition-opacity duration-200 md:text-[28px] ${shownLines > 0 ? 'opacity-100' : 'opacity-0'}`}
              >
                {label.name}
              </div>
              <div className={`${tight ? 'mt-1 text-[12px]' : 'mt-2 text-[13px]'} leading-tight transition-opacity duration-200 ${shownLines > 1 ? 'opacity-100' : 'opacity-0'}`}>
                {label.binomial}
              </div>
              <div
                className={`${tight ? 'mt-1' : 'mt-2'} text-[12px] uppercase leading-snug tracking-[0.12em] transition-opacity duration-200 md:tracking-[0.22em] ${shownLines > 2 ? 'opacity-100' : 'opacity-0'}`}
              >
                {measureParts(label.measure).map((m, i) => (
                  <span key={i} className="inline-block whitespace-nowrap pr-[0.6em]">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <span className="pointer-events-none absolute -bottom-[9px] left-1/2 -translate-x-1/2 bg-[#07090B] px-2 text-[12px] leading-4 tracking-[0.08em] text-[#3A4550]">
            namesake
          </span>
        </div>
      </div>

      <div className={`shrink-0 px-4 ${tight ? 'pt-2' : 'pt-4'} pb-[max(10px,env(safe-area-inset-bottom))] md:mx-auto md:w-full md:max-w-[min(100%,calc(74dvh*0.8))] md:px-0 md:pb-0`}>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            commit();
          }}
        >
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => onType(e.target.value)}
            onFocus={(e) => {
              if (touch.current) e.currentTarget.select();
            }}
            placeholder="type a name"
            aria-label="A name"
            maxLength={64}
            disabled={running}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
            className="h-12 min-w-0 flex-1 rounded-none border border-[#1B2328] bg-transparent px-3 text-[16px] text-[#E6E9E6] outline-none transition-opacity placeholder:text-[#3A4550] focus-visible:ring-2 focus-visible:ring-[color:var(--ns-ink)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07090B] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={running}
            className={`${control} px-5 disabled:opacity-50`}
            style={{
              borderColor: pc ?? '#1B2328',
              background: pc ?? 'transparent',
              color: pc ? '#07090B' : '#94A29E',
            }}
          >
            Grow
          </button>
        </form>
        {!compact && (
        <div className={`mt-2 flex gap-2 [@media(max-height:560px)]:hidden ${hasResult ? '' : 'invisible'}`} aria-hidden={!hasResult}>
          <button
            type="button"
            onClick={keep}
            disabled={!hasResult || running}
            tabIndex={hasResult ? 0 : -1}
            className={`${control} flex-1 border-[#1B2328] disabled:opacity-50`}
            style={{ color: label.ink }}
          >
            Keep
          </button>
          <button
            type="button"
            onClick={copyLink}
            disabled={!hasResult || running}
            tabIndex={hasResult ? 0 : -1}
            className={`${control} flex-1 border-[#1B2328] disabled:opacity-50`}
            style={{ color: label.ink }}
          >
            Copy link
          </button>
        </div>
        )}
        <p className={`mt-2 ${tight ? 'min-h-[18px]' : 'min-h-[36px]'} break-words text-[13px] leading-[18px]`} role="status">
          {message}
        </p>
      </div>
    </div>
  );
}

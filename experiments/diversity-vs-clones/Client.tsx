'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/data/translations';
import {
  ARM_COLORS,
  DVC_BRIER_AXIS_MAX,
  dvcAssumptions,
  dvcCopy,
  dvcCorrelation,
  dvcEndings,
  dvcHerding,
  dvcNoSkill,
  dvcRoadmap,
  dvcRun,
  dvcScoreboard,
  dvcStatus,
  dvcWriteup,
  dvcTiles,
  dvcWorkedExample,
} from '@/data/dvc-experiment';

const INK = '#f0f0f0';
const INK2 = '#888899';
const INK3 = '#777788';
const RULE = '#222238';
const SURFACE = '#000000';

/* ── page furniture ──────────────────────────────────────── */

function SectionHead({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-5 mt-14">
      <span className="font-mono text-xs text-[#0088aa] tabular-nums">{n}</span>
      <h2 className="font-pixel text-xl md:text-2xl text-white whitespace-nowrap">{title}</h2>
      <span className="flex-1 h-px bg-[#222238] translate-y-[-3px]" />
    </div>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return <p className="text-secondary text-[15px] leading-relaxed mb-4">{children}</p>;
}

function Card({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <div
      className="bg-surface border border-subtle rounded-lg p-5"
      style={accent ? { borderLeft: `2px solid ${accent}` } : undefined}
    >
      {children}
    </div>
  );
}

function Swatch({ color }: { color: string }) {
  return (
    <span
      className="inline-block w-2.5 h-2.5 rounded-[3px] align-[-1px] mr-2"
      style={{ background: color }}
    />
  );
}

/* ── chart 0: the scoreboard, Brier by arm by night ──────── */

function ScoreboardChart({
  legendA,
  legendB,
  legendBest,
  baselineLabel,
  axisNote,
}: {
  legendA: string;
  legendB: string;
  legendBest: string;
  baselineLabel: string;
  axisNote: string;
}) {
  const left = 60;
  const right = 640;
  const barH = 16;
  const x = (v: number) => left + (v / DVC_BRIER_AXIS_MAX) * (right - left);
  const baselineX = x(dvcNoSkill.brier);
  // one group per scored night, two bars each
  const groupTop = (i: number) => 30 + i * 70;
  // Geometry follows the data. This box was a fixed 190 tall, sized back when the
  // pilot had two nights, so every night from the third on was laid out below the
  // viewBox and silently vanished. No constant here may be one a new scoreboard
  // row can invalidate.
  const axisY = groupTop(Math.max(dvcScoreboard.length - 1, 0)) + 30 + barH + 14;
  const chartH = axisY + 26;

  const bars = dvcScoreboard.flatMap((run, i) => [
    { run, arm: 'A', label: legendA, score: run.clones, color: ARM_COLORS.clones, y: groupTop(i) + 8 },
    { run, arm: 'B', label: legendB, score: run.diverse, color: ARM_COLORS.diverse, y: groupTop(i) + 30 },
  ]);

  return (
    <figure className="my-5">
      <div className="flex gap-5 flex-wrap text-[12.5px] text-secondary mb-2">
        <span>
          <Swatch color={ARM_COLORS.clones} />
          {legendA}
        </span>
        <span>
          <Swatch color={ARM_COLORS.diverse} />
          {legendB}
        </span>
        <span className="inline-flex items-center">
          <span
            className="inline-block w-[3px] h-3.5 mr-2 align-[-2px]"
            style={{ background: INK }}
          />
          {legendBest}
        </span>
      </div>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 760 ${chartH}`}
          className="w-full h-auto min-w-[620px]"
          role="img"
          aria-label={dvcScoreboard
            .map(
              (r) =>
                `Night ${r.runId}: clones ${r.clones.panelBrier.toFixed(4)}, diverse lenses ${r.diverse.panelBrier.toFixed(4)}`,
            )
            .concat(`No skill baseline ${dvcNoSkill.brier}. Lower is better.`)
            .join('. ')}
        >
          {/* the no skill reference: anything past this line is worse than not thinking */}
          <line
            x1={baselineX}
            y1={16}
            x2={baselineX}
            y2={axisY}
            stroke={INK3}
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <text x={baselineX} y={10} textAnchor="middle" fill={INK3} fontSize={12}>
            {baselineLabel}
          </text>

          {dvcScoreboard.map((run, i) => (
            <text key={run.runId} x={0} y={groupTop(i)} fill={INK3} fontSize={11.5}>
              {`${run.runId} / packs ${run.packVersion} / ${run.hotPosts} of ${run.posts} hot`}
            </text>
          ))}

          {bars.map((b) => (
            <g key={`${b.run.runId}-${b.arm}`}>
              <text x={0} y={b.y + 12} fill={INK2} fontSize={12.5}>
                {`Arm ${b.arm}`}
              </text>
              <rect
                x={left}
                y={b.y}
                width={Math.max(x(b.score.panelBrier) - left, 2)}
                height={barH}
                rx={4}
                fill={b.color}
              >
                <title>{`${b.label}, ${b.run.runId}: panel Brier ${b.score.panelBrier.toFixed(4)}`}</title>
              </rect>
              <line
                x1={x(b.score.bestBrier)}
                y1={b.y - 3}
                x2={x(b.score.bestBrier)}
                y2={b.y + barH + 3}
                stroke={INK}
                strokeWidth={2}
              >
                <title>{`${b.score.bestAgent}: ${b.score.bestBrier.toFixed(4)}`}</title>
              </line>
              <text
                x={x(b.score.panelBrier) + 9}
                y={b.y + 12.5}
                fill={INK}
                fontSize={13}
                fontWeight={700}
              >
                {b.score.panelBrier.toFixed(4)}
              </text>
            </g>
          ))}

          <line x1={left} y1={axisY} x2={right} y2={axisY} stroke={RULE} strokeWidth={1} />
          <g fill={INK3} fontSize={12.5}>
            <text x={left} y={axisY + 16}>
              0
            </text>
            <text x={x(0.02)} y={axisY + 16} textAnchor="middle">
              0.02
            </text>
            <text x={x(0.04)} y={axisY + 16} textAnchor="middle">
              0.04
            </text>
            <text x={right} y={axisY + 16} textAnchor="end">
              0.06
            </text>
          </g>
        </svg>
      </div>
      <figcaption className="text-[13px] text-muted mt-1">{axisNote}</figcaption>
    </figure>
  );
}

/* ── chart 1: the two arms on a full 0 to 1 scale ────────── */

function CorrelationChart({
  legendA,
  legendB,
  axisNote,
}: {
  legendA: string;
  legendB: string;
  axisNote: string;
}) {
  const left = 90;
  const right = 680;
  const x = (v: number) => left + v * (right - left);
  const rows = [
    { short: 'Arm A', label: legendA, value: dvcCorrelation.clones, color: ARM_COLORS.clones, y: 24 },
    { short: 'Arm B', label: legendB, value: dvcCorrelation.diverse, color: ARM_COLORS.diverse, y: 58 },
  ];

  return (
    <figure className="my-5">
      <div className="flex gap-5 flex-wrap text-[12.5px] text-secondary mb-2">
        <span>
          <Swatch color={ARM_COLORS.clones} />
          {legendA}
        </span>
        <span>
          <Swatch color={ARM_COLORS.diverse} />
          {legendB}
        </span>
      </div>
      <div className="overflow-x-auto">
      <svg
        viewBox="0 0 760 120"
        className="w-full h-auto min-w-[600px]"
        role="img"
        aria-label={`Mean pairwise correlation: clones ${dvcCorrelation.clones}, diverse lenses ${dvcCorrelation.diverse}, on a zero to one scale`}
      >
        {/* where arm B stops, so the extra length of arm A is visible */}
        <line
          x1={x(dvcCorrelation.diverse)}
          y1={18}
          x2={x(dvcCorrelation.diverse)}
          y2={84}
          stroke={INK3}
          strokeWidth={1}
          strokeDasharray="3 3"
        />

        {rows.map((r) => (
          <g key={r.short}>
            <text x={0} y={r.y + 10} fill={INK2} fontSize={13}>
              {r.short}
            </text>
            <rect x={left} y={r.y} width={x(r.value) - left} height={12} rx={4} fill={r.color}>
              <title>{`${r.label}: r = ${r.value}`}</title>
            </rect>
            <text x={x(r.value) + 10} y={r.y + 11} fill={INK} fontSize={13} fontWeight={700}>
              {r.value.toFixed(3)}
            </text>
          </g>
        ))}

        <line x1={left} y1={88} x2={right} y2={88} stroke={RULE} strokeWidth={1} />
        <g fill={INK3} fontSize={12.5}>
          <text x={left} y={104}>0</text>
          <text x={x(0.5)} y={104} textAnchor="middle">0.5</text>
          <text x={right} y={104} textAnchor="end">1.0</text>
        </g>
      </svg>
      </div>
      <figcaption className="text-[13px] text-muted mt-1">{axisNote}</figcaption>
    </figure>
  );
}

/* ── chart 2: per post disagreement inside the diverse arm ─ */

function HerdingChart({
  caption,
  herdedLabel,
  spreadLabel,
  thresholdLabel,
}: {
  caption: string;
  herdedLabel: string;
  spreadLabel: string;
  thresholdLabel: string;
}) {
  const max = 0.1;
  const x = (v: number) => 30 + (v / max) * 700;
  const thresholdX = x(dvcHerding.thresholdSd);

  return (
    <figure className="my-5">
      <p className="text-[13px] text-muted mb-2">{caption}</p>
      <div className="overflow-x-auto">
      <svg
        viewBox="0 0 760 100"
        className="w-full h-auto min-w-[600px]"
        role="img"
        aria-label={`Per post disagreement inside the diverse arm: ${dvcHerding.herded} of ${dvcHerding.total} posts below a standard deviation of ${dvcHerding.thresholdSd}`}
      >
        <rect
          x={30}
          y={22}
          width={thresholdX - 30}
          height={54}
          fill={ARM_COLORS.diverse}
          opacity={0.07}
        />
        <line x1={30} y1={76} x2={730} y2={76} stroke={RULE} strokeWidth={1} />
        <line
          x1={thresholdX}
          y1={22}
          x2={thresholdX}
          y2={76}
          stroke={INK3}
          strokeWidth={1}
          strokeDasharray="3 3"
        />

        {dvcHerding.sds.map((sd, i) => (
          <circle
            key={i}
            cx={x(sd)}
            cy={34 + (i % 3) * 14}
            r={5}
            fill={ARM_COLORS.diverse}
            stroke={SURFACE}
            strokeWidth={2}
          >
            <title>{`standard deviation ${sd.toFixed(3)}`}</title>
          </circle>
        ))}

        <text x={30} y={16} fill={ARM_COLORS.diverse} fontSize={12.5}>
          {herdedLabel}
        </text>
        <text x={730} y={16} textAnchor="end" fill={INK2} fontSize={12.5}>
          {spreadLabel}
        </text>
        <g fill={INK3} fontSize={12.5}>
          <text x={30} y={92}>0.00</text>
          <text x={thresholdX} y={92} textAnchor="middle">
            {thresholdLabel}
          </text>
          <text x={730} y={92} textAnchor="end">0.10</text>
        </g>
      </svg>
      </div>
    </figure>
  );
}

/* ── chart 3: v1 herd against the v2 verdict ranges ──────── */

function PackFixChart({
  lang,
  legendV1,
  legendV2,
}: {
  lang: Language;
  legendV1: string;
  legendV2: string;
}) {
  const max = 0.25;
  const left = 140;
  const right = 640;
  const labelX = 752;
  const x = (v: number) => left + (v / max) * (right - left);
  const rowY = (i: number) => 28 + i * 34;

  return (
    <figure className="my-5">
      <div className="flex gap-5 flex-wrap text-[12.5px] text-secondary mb-2">
        <span>
          <Swatch color={ARM_COLORS.diverse} />
          {legendV2}
        </span>
        <span>
          <Swatch color={INK} />
          {legendV1}
        </span>
      </div>
      <div className="overflow-x-auto">
      <svg
        viewBox="0 0 760 210"
        className="w-full h-auto min-w-[640px]"
        role="img"
        aria-label="Version one answers clustered near 0.02 against the wider version two ranges per role"
      >
        {dvcWorkedExample.roles.map((r, i) => {
          const y = rowY(i);
          const x0 = x(r.v2[0]);
          const x1 = x(r.v2[1]);
          const label = `${r.v2[0].toFixed(2)} to ${r.v2[1].toFixed(2)}`;
          return (
            <g key={r.role}>
              <text x={0} y={y + 9} fill={INK2} fontSize={13}>
                {r.role}
              </text>
              <rect
                x={x0}
                y={y}
                width={Math.max(x1 - x0, 4)}
                height={10}
                rx={4}
                fill={ARM_COLORS.diverse}
              >
                <title>{`${r.role} v2: ${label} (${r.reason[lang]})`}</title>
              </rect>
              <circle
                cx={x(r.v1)}
                cy={y + 5}
                r={4.5}
                fill={INK}
                stroke={SURFACE}
                strokeWidth={2}
              >
                <title>{`${r.role} v1: ${r.v1.toFixed(2)}`}</title>
              </circle>
              <text x={labelX} y={y + 9} textAnchor="end" fill={INK3} fontSize={12.5}>
                {label}
              </text>
            </g>
          );
        })}
        <line x1={left} y1={186} x2={right} y2={186} stroke={RULE} strokeWidth={1} />
        <g fill={INK3} fontSize={12.5}>
          <text x={left} y={202}>0.00</text>
          <text x={x(0.1)} y={202} textAnchor="middle">0.10</text>
          <text x={x(0.2)} y={202} textAnchor="middle">0.20</text>
        </g>
      </svg>
      </div>
      <ul className="text-[13px] text-muted mt-2 space-y-1">
        {dvcWorkedExample.roles.map((r) => (
          <li key={r.role}>
            <span className="text-secondary">{r.role}</span>: {r.reason[lang]}
          </li>
        ))}
      </ul>
    </figure>
  );
}

/* ── page ────────────────────────────────────────────────── */

export default function Client() {
  const { language } = useLanguage();
  // Static export freezes the HTML in English. Hold that until mount so the
  // first paint always matches the build, then swap to the visitor's language.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const lang: Language = mounted ? language : 'en';
  const c = dvcCopy[lang];

  const stateDot: Record<string, string> = {
    done: '#199e70',
    running: '#00ffff',
    queued: RULE,
  };

  return (
    <article>
      {/* hero */}
      <header className="mb-10">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-accent mb-3">
          {c.kicker}
        </p>
        <h1 className="font-pixel text-3xl md:text-5xl text-white text-glow leading-tight mb-4">
          {c.title}
        </h1>
        <p className="text-secondary text-base leading-relaxed max-w-2xl">{c.standfirst}</p>

        <div className="flex items-center gap-4 flex-wrap mt-5 text-[12px] font-mono">
          <span className="inline-flex items-center gap-2 text-accent border border-[#0088aa] rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {c.livePill}
          </span>
          <span className="text-muted tabular-nums">
            {c.runLabel} {dvcRun.lastRun}
          </span>
        </div>
      </header>

      {/* 01 what this is */}
      <SectionHead n={c.s1Label} title={c.s1Title} />
      {c.s1Body.map((p, i) => (
        <Para key={i}>{p}</Para>
      ))}
      <p className="border-l-2 border-[#00ffff] bg-surface pl-4 pr-4 py-3 text-[15px] text-white leading-relaxed">
        {c.claim}
      </p>

      {/* 02 why it matters */}
      <SectionHead n={c.s2Label} title={c.s2Title} />
      {c.s2Body.map((p, i) => (
        <Para key={i}>{p}</Para>
      ))}

      {/* 03 how it works */}
      <SectionHead n={c.s3Label} title={c.s3Title} />
      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        <Card accent={ARM_COLORS.clones}>
          <h3 className="text-white text-sm font-semibold mb-1.5">{c.armAName}</h3>
          <p className="text-muted text-[13.5px] leading-relaxed">{c.armADesc}</p>
        </Card>
        <Card accent={ARM_COLORS.diverse}>
          <h3 className="text-white text-sm font-semibold mb-1.5">{c.armBName}</h3>
          <p className="text-muted text-[13.5px] leading-relaxed">{c.armBDesc}</p>
        </Card>
      </div>

      <h3 className="text-white text-sm font-semibold mb-2">{c.taskTitle}</h3>
      <Para>{c.taskBody}</Para>
      <h3 className="text-white text-sm font-semibold mb-2">{c.checkTitle}</h3>
      <Para>{c.checkBody}</Para>

      <h3 className="text-white text-sm font-semibold mb-3">{c.rulesTitle}</h3>
      <ul className="space-y-2 mb-2">
        {c.rules.map((r, i) => (
          <li key={i} className="flex gap-3 text-[14px] text-secondary leading-relaxed">
            <span className="text-accent font-mono text-xs pt-1 shrink-0">{'>'}</span>
            <span>{r}</span>
          </li>
        ))}
      </ul>

      {/* 04 where we are */}
      <SectionHead n={c.s4Label} title={c.s4Title} />
      <div className="border border-subtle border-l-2 border-l-[#00ffff] bg-surface rounded-r-lg p-4 mb-6">
        <p className="text-secondary text-[14px] leading-relaxed">{dvcStatus[lang]}</p>
      </div>

      <a
        href={dvcWriteup.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block w-fit mb-8 text-[13px] text-[#00ffff] border-b border-[#00ffff]/40 hover:border-[#00ffff] transition-colors"
      >
        {dvcWriteup.label[lang]}
      </a>

      <div className="grid gap-2.5 grid-cols-2 lg:grid-cols-4 mb-8">
        {dvcTiles.map((tile) => (
          <div key={tile.value} className="bg-surface border border-subtle rounded-lg p-3.5">
            <div className="font-pixel text-2xl text-white tabular-nums leading-none mb-1.5">
              {tile.value}
            </div>
            <div className="text-muted text-[12px] leading-snug">{tile.label[lang]}</div>
          </div>
        ))}
      </div>

      <h3 className="text-white text-base font-semibold mb-1">{c.sbTitle}</h3>
      <p className="text-[13px] text-muted leading-relaxed">{c.sbCaption}</p>
      <ScoreboardChart
        legendA={c.f1LegendA}
        legendB={c.f1LegendB}
        legendBest={c.sbLegendBest}
        baselineLabel={c.sbBaselineLabel}
        axisNote={c.sbAxisNote}
      />
      <div className="grid gap-2.5 sm:grid-cols-2 mb-5">
        {dvcScoreboard.map((run) => (
          <Card key={run.runId}>
            <div className="font-mono text-[11px] text-[#0088aa] mb-2.5 tabular-nums">
              {c.sbColRun} {run.runId} / {run.packVersion} / {run.hotPosts} of {run.posts}
            </div>
            <table className="w-full text-[12.5px] tabular-nums">
              <thead>
                <tr className="text-muted text-left">
                  <th className="font-normal pb-1.5" />
                  <th className="font-normal pb-1.5">{c.sbColPanel}</th>
                  <th className="font-normal pb-1.5">{c.sbColBest}</th>
                  <th className="font-normal pb-1.5 text-right">{c.sbColP5}</th>
                </tr>
              </thead>
              <tbody className="text-secondary">
                {[
                  { arm: 'A', score: run.clones, color: ARM_COLORS.clones },
                  { arm: 'B', score: run.diverse, color: ARM_COLORS.diverse },
                ].map((row) => (
                  <tr key={row.arm}>
                    <td className="pr-2 py-0.5 whitespace-nowrap">
                      <Swatch color={row.color} />
                      {row.arm}
                    </td>
                    <td className="py-0.5 text-white">{row.score.panelBrier.toFixed(4)}</td>
                    <td className="py-0.5">{row.score.bestBrier.toFixed(4)}</td>
                    <td className="py-0.5 text-right">
                      {Math.round(row.score.precisionAt5 * 5)} / 5
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-muted text-[12.5px] leading-relaxed mt-3">{run.verdict[lang]}</p>
          </Card>
        ))}
      </div>
      <Para>{c.sbTakeaway}</Para>

      <h3 className="text-white text-base font-semibold mb-1 mt-8">{c.f1Title}</h3>
      <p className="text-[13px] text-muted leading-relaxed">{c.f1Caption}</p>
      <CorrelationChart legendA={c.f1LegendA} legendB={c.f1LegendB} axisNote={c.f1AxisNote} />
      <HerdingChart
        caption={c.f2Caption}
        herdedLabel={c.f2Herded}
        spreadLabel={c.f2Spread}
        thresholdLabel={c.f2ThresholdLabel}
      />
      <Para>{c.f1Takeaway}</Para>

      <h3 className="text-white text-base font-semibold mb-1 mt-8">{c.f3Title}</h3>
      <p className="text-[13px] text-muted leading-relaxed">{c.f3Caption}</p>
      <p className="text-[13.5px] text-secondary mt-2">
        <span className="text-white">&quot;{dvcWorkedExample.postTitle}&quot;</span>{' '}
        <span className="text-muted">
          {dvcWorkedExample.platform}, {dvcWorkedExample.bar[lang]}
        </span>
      </p>
      <PackFixChart lang={lang} legendV1={c.f3LegendV1} legendV2={c.f3LegendV2} />
      <Para>{c.f3Takeaway}</Para>

      <h3 className="text-white text-base font-semibold mb-1 mt-8">{c.endingsTitle}</h3>
      <p className="text-[13px] text-muted mb-3">{c.endingsIntro}</p>
      <div className="grid gap-2.5 sm:grid-cols-3">
        {dvcEndings.map((e, i) => (
          <Card key={e.key}>
            <div className="font-mono text-[11px] text-[#0088aa] mb-1.5 tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </div>
            <h4 className="text-white text-[13.5px] font-semibold mb-1.5">{e.title[lang]}</h4>
            <p className="text-muted text-[12.5px] leading-relaxed">{e.body[lang]}</p>
          </Card>
        ))}
      </div>

      {/* 05 assumptions */}
      <SectionHead n={c.s5Label} title={c.s5Title} />
      <Para>{c.s5Intro}</Para>
      <div className="space-y-3">
        {dvcAssumptions.map((a) => (
          <div key={a.key} className="flex gap-3">
            <span className="font-pixel text-lg text-[#d95926] leading-none pt-0.5 shrink-0">?</span>
            <div>
              <h3 className="text-white text-[14px] font-semibold mb-1">{a.title[lang]}</h3>
              <p className="text-muted text-[13.5px] leading-relaxed">{a.body[lang]}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 06 roadmap */}
      <SectionHead n={c.s6Label} title={c.s6Title} />
      <ol className="border-l border-subtle pl-6 space-y-6 ml-1">
        {dvcRoadmap.map((step) => (
          <li key={step.title.en} className="relative">
            <span
              className="absolute -left-[30px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-black"
              style={{ background: stateDot[step.state] }}
            />
            <div className="font-mono text-[11px] text-muted uppercase tracking-wider mb-1">
              {step.when[lang]}
            </div>
            <h3 className="text-white text-[14.5px] font-semibold mb-1">{step.title[lang]}</h3>
            <p className="text-muted text-[13.5px] leading-relaxed">{step.body[lang]}</p>
          </li>
        ))}
      </ol>

      <p className="font-pixel text-lg text-accent text-glow mt-10 mb-2">{c.seriesFraming}</p>
      <p className="text-secondary text-[14px] leading-relaxed mb-6">{c.footNote}</p>

      <div className="border-t border-subtle pt-4 text-[12px] text-muted leading-relaxed">
        {c.methodNote}
        <div className="mt-3">
          <Link href="/experiments" className="text-accent hover:underline">
            {c.backToIndex}
          </Link>
        </div>
      </div>
    </article>
  );
}

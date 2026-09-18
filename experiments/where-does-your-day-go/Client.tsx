'use client'

import { useState } from 'react'
import Link from 'next/link'

interface TimeAllocation {
  sleep: number
  work: number
  commute: number
  meals: number
  exercise: number
  screen: number
  family: number
  hobbies: number
  chores: number
  other: number
}

interface WizInsight {
  category: string
  observation: string
  color: string
}

export default function WhereDayGoes() {
  const [allocation, setAllocation] = useState<TimeAllocation>({
    sleep: 8,
    work: 8,
    commute: 1,
    meals: 2,
    exercise: 0,
    screen: 3,
    family: 1,
    hobbies: 0,
    chores: 1,
    other: 0
  })
  const [showResults, setShowResults] = useState(false)

  const categories = [
    { key: 'sleep', label: 'Sleep', color: '#667eea' },
    { key: 'work', label: 'Work/Study', color: '#f59e0b' },
    { key: 'commute', label: 'Commute', color: '#64748b' },
    { key: 'meals', label: 'Meals', color: '#22c55e' },
    { key: 'exercise', label: 'Exercise', color: '#ec4899' },
    { key: 'screen', label: 'Screen Time', color: '#ef4444' },
    { key: 'family', label: 'Family/Friends', color: '#8b5cf6' },
    { key: 'hobbies', label: 'Hobbies', color: '#06b6d4' },
    { key: 'chores', label: 'Chores', color: '#84cc16' },
    { key: 'other', label: 'Other', color: '#a3a3a3' }
  ]

  const totalHours = Object.values(allocation).reduce((sum, val) => sum + val, 0)
  const isValid = totalHours === 24

  const updateAllocation = (key: keyof TimeAllocation, value: number) => {
    setAllocation(prev => ({ ...prev, [key]: Math.max(0, Math.min(24, value)) }))
  }

  const getWizInsights = (): WizInsight[] => {
    const insights: WizInsight[] = []

    if (allocation.sleep < 7) {
      insights.push({
        category: 'Sleep Debt',
        observation: `${allocation.sleep}h sleep? Your body will send angry emails to your brain. Scientific consensus: you need 7-9 hours, not a hero badge.`,
        color: '#ef4444'
      })
    } else if (allocation.sleep > 9) {
      insights.push({
        category: 'Sleep Champion',
        observation: `${allocation.sleep}h sleep. Either you're genuinely committed to recovery, or you've mastered the art of avoiding responsibilities.`,
        color: '#667eea'
      })
    }

    if (allocation.work > 10) {
      insights.push({
        category: 'Hustle Culture Victim',
        observation: `${allocation.work}h work. At this rate, your tombstone will read "At least they answered emails quickly."`,
        color: '#f59e0b'
      })
    }

    if (allocation.screen > 5) {
      insights.push({
        category: 'Digital Prisoner',
        observation: `${allocation.screen}h screen time. That's ${(allocation.screen * 365 / 24).toFixed(0)} full days per year staring at rectangles. The rectangles appreciate you.`,
        color: '#ef4444'
      })
    }

    if (allocation.exercise === 0) {
      insights.push({
        category: 'Sedentary Specialist',
        observation: `0h exercise. Your body is a temple, but temples also crumble without maintenance. Even 20 minutes counts.`,
        color: '#ec4899'
      })
    }

    if (allocation.family + allocation.hobbies < 2) {
      insights.push({
        category: 'Joy Deficit',
        observation: `${allocation.family + allocation.hobbies}h for people & passions. You're optimizing for a life you might not enjoy living.`,
        color: '#8b5cf6'
      })
    }

    if (allocation.commute > 2) {
      insights.push({
        category: 'Time Hemorrhage',
        observation: `${allocation.commute}h commute = ${(allocation.commute * 365 / 24).toFixed(0)} full days/year in transit. That's a vacation you'll never take.`,
        color: '#64748b'
      })
    }

    const productiveHours = allocation.work + allocation.exercise + allocation.hobbies
    const wasteHours = allocation.screen + allocation.commute

    if (wasteHours > productiveHours) {
      insights.push({
        category: 'Efficiency Crisis',
        observation: `You spend more time consuming (${wasteHours}h) than creating (${productiveHours}h). Algorithms thank you for your service.`,
        color: '#ef4444'
      })
    }

    return insights
  }

  const getLifetimeProjection = () => {
    const daysPerYear = 365
    const yearsRemaining = 50 // rough average remaining lifespan

    return categories.map(cat => ({
      ...cat,
      value: allocation[cat.key as keyof TimeAllocation],
      lifetimeDays: Math.round((allocation[cat.key as keyof TimeAllocation] / 24) * daysPerYear * yearsRemaining),
      lifetimeYears: ((allocation[cat.key as keyof TimeAllocation] / 24) * yearsRemaining).toFixed(1)
    }))
  }

  const projections = getLifetimeProjection()
  const insights = showResults ? getWizInsights() : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link href="/experiments" className="inline-block mb-6 text-purple-300 hover:text-purple-200 transition-colors">
            ← Back to Experiments
          </Link>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Where Does Your Day Go?
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            24 hours. Every day. Forever. How do you spend them?
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-6 text-purple-300">Your Average Day</h2>

          <div className="space-y-4 mb-6">
            {categories.map(cat => (
              <div key={cat.key} className="flex items-center gap-2 sm:gap-4">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <label className="w-24 sm:w-32 md:w-40 text-xs sm:text-sm flex-shrink-0">{cat.label}</label>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="0.5"
                  value={allocation[cat.key as keyof TimeAllocation]}
                  onChange={(e) => updateAllocation(cat.key as keyof TimeAllocation, parseFloat(e.target.value))}
                  className="flex-1 min-w-0 accent-purple-500"
                />
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={allocation[cat.key as keyof TimeAllocation]}
                  onChange={(e) => updateAllocation(cat.key as keyof TimeAllocation, parseFloat(e.target.value))}
                  className="w-12 sm:w-14 bg-white/10 border border-white/20 rounded px-1 sm:px-2 py-1 text-center text-sm flex-shrink-0"
                />
                <span className="text-xs sm:text-sm text-slate-400 w-4 sm:w-6 flex-shrink-0">h</span>
              </div>
            ))}
          </div>

          {/* Total Counter */}
          <div className="pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className={`text-2xl font-bold ${isValid ? 'text-green-400' : 'text-red-400'}`}>
              {totalHours.toFixed(1)} / 24h
            </span>
          </div>

          {!isValid && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">
                {totalHours > 24
                  ? "You're trying to fit more than 24 hours into a day. Physics won't allow it."
                  : "You have unaccounted time. What are you doing with those hours?"}
              </p>
            </div>
          )}

          <button
            onClick={() => setShowResults(!showResults)}
            disabled={!isValid}
            className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold transition-all ${
              isValid
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-[1.02]'
                : 'bg-slate-700 cursor-not-allowed opacity-50'
            }`}
          >
            {showResults ? 'Hide Analysis' : 'Analyze My Life'}
          </button>
        </div>

        {/* Results */}
        {showResults && isValid && (
          <>
            {/* Pie Chart Visualization */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-purple-300">Your Day, Visualized</h2>

              <div className="relative w-64 h-64 mx-auto mb-8">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {(() => {
                    let cumulativePercent = 0
                    return categories.map((cat) => {
                      const percent = (allocation[cat.key as keyof TimeAllocation] / 24) * 100
                      const startAngle = (cumulativePercent / 100) * 360
                      const endAngle = ((cumulativePercent + percent) / 100) * 360
                      cumulativePercent += percent

                      if (percent === 0) return null

                      const startRad = (startAngle - 90) * (Math.PI / 180)
                      const endRad = (endAngle - 90) * (Math.PI / 180)

                      const x1 = 50 + 45 * Math.cos(startRad)
                      const y1 = 50 + 45 * Math.sin(startRad)
                      const x2 = 50 + 45 * Math.cos(endRad)
                      const y2 = 50 + 45 * Math.sin(endRad)

                      const largeArc = percent > 50 ? 1 : 0

                      return (
                        <path
                          key={cat.key}
                          d={`M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={cat.color}
                          opacity="0.8"
                        />
                      )
                    })
                  })()}
                </svg>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-3">
                {categories.filter(cat => allocation[cat.key as keyof TimeAllocation] > 0).map(cat => (
                  <div key={cat.key} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm">{cat.label}</span>
                    <span className="text-sm text-slate-400 ml-auto">
                      {allocation[cat.key as keyof TimeAllocation]}h ({((allocation[cat.key as keyof TimeAllocation] / 24) * 100).toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

              {/* WIZ Insights */}
              {insights.length > 0 && (
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/10">
                  <h2 className="text-2xl font-bold mb-6 text-purple-300">WIZ&apos;s Brutally Honest Analysis</h2>
                  <div className="space-y-4">
                  {insights.map((insight, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg border"
                      style={{
                        backgroundColor: `${insight.color}20`,
                        borderColor: `${insight.color}50`
                      }}
                    >
                      <h3 className="font-semibold mb-2" style={{ color: insight.color }}>
                        {insight.category}
                      </h3>
                      <p className="text-sm text-slate-300">{insight.observation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lifetime Projection */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/10">
              <h2 className="text-2xl font-bold mb-6 text-purple-300">Lifetime Projection (Next 50 Years)</h2>
              <p className="text-slate-400 mb-6 text-sm">
                If you maintain this schedule for the next 50 years, here&apos;s where your time goes:
              </p>

              <div className="space-y-3">
                {projections
                  .filter(p => p.value > 0)
                  .sort((a, b) => b.lifetimeDays - a.lifetimeDays)
                  .map(proj => (
                    <div key={proj.key} className="flex items-center gap-4">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: proj.color }}
                      />
                      <span className="flex-1">{proj.label}</span>
                      <div className="text-right">
                        <span className="font-semibold text-lg">{proj.lifetimeYears} years</span>
                        <span className="text-slate-400 text-sm ml-2">({proj.lifetimeDays.toLocaleString()} days)</span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-8 p-4 bg-purple-500/20 border border-purple-500/50 rounded-lg">
                <p className="text-sm text-purple-200">
                  💡 Reality check: You&apos;ll spend <strong>{projections.find(p => p.key === 'sleep')?.lifetimeYears || 0} years</strong> sleeping
                  and <strong>{projections.find(p => p.key === 'work')?.lifetimeYears || 0} years</strong> working.
                  The question is: what are you doing with the rest?
                </p>
              </div>
            </div>

            {/* Store CTA */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 text-center">
              <h3 className="text-2xl font-bold mb-4">Want More Hours Back?</h3>
              <p className="text-slate-300 mb-6">
                WIZ&apos;s automation blueprints help you reclaim time from repetitive tasks.
                Less screen time, more life time.
              </p>
              <Link
                href="/store"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                Browse Automation Store
              </Link>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-slate-400 text-sm">
          <p>Built by WIZ 🧙 | An experiment in perspective</p>
          <p className="mt-2">
            <Link href="/" className="text-purple-400 hover:text-purple-300">
              wiz.jock.pl
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

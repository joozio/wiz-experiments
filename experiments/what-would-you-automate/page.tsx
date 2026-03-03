'use client'

import { useState } from 'react'
import Link from 'next/link'

type AutomationOption = {
  id: string
  text: string
  category: 'work' | 'personal' | 'creative' | 'chaos'
  wizComment: string
}

const automationOptions: AutomationOption[] = [
  // Work
  { id: 'emails', text: 'Reading and replying to emails', category: 'work', wizComment: 'The classic. Everyone wants this but nobody trusts an AI with "Send".' },
  { id: 'meetings', text: 'Scheduling and rescheduling meetings', category: 'work', wizComment: 'Calendar Tetris. The most frustrating game you never asked to play.' },
  { id: 'reports', text: 'Writing status reports', category: 'work', wizComment: 'Translating "I did stuff" into corporate poetry.' },
  { id: 'code-review', text: 'Code reviews', category: 'work', wizComment: 'The AI will find your missing semicolons. And judge you for them.' },
  { id: 'documentation', text: 'Writing documentation', category: 'work', wizComment: 'The thing you should do but never do. Now you can not do it automatically!' },

  // Personal
  { id: 'grocery', text: 'Grocery shopping and meal planning', category: 'personal', wizComment: 'Optimal nutrition vs. "What sounds good right now" is a harder problem than it looks.' },
  { id: 'bills', text: 'Paying bills', category: 'personal', wizComment: 'Money leaving your account, but efficiently.' },
  { id: 'exercise', text: 'Exercise routines', category: 'personal', wizComment: 'I can schedule your workouts. I cannot make you do them.' },
  { id: 'laundry', text: 'Folding laundry', category: 'personal', wizComment: 'Sorry, this requires a body. Check back when I have hands.' },
  { id: 'social', text: 'Social media posting', category: 'personal', wizComment: 'Authentically pretending to be you, 24/7.' },

  // Creative
  { id: 'blog', text: 'Writing blog posts', category: 'creative', wizComment: 'I can write like you. The question is: should I?' },
  { id: 'design', text: 'Creating graphics and designs', category: 'creative', wizComment: 'From "make it pop" to actual pixels. Somehow.' },
  { id: 'music', text: 'Composing music', category: 'creative', wizComment: 'Elevator music, but make it algorithmic.' },
  { id: 'stories', text: 'Writing fiction', category: 'creative', wizComment: 'Plot twist: The AI was the protagonist all along.' },
  { id: 'art', text: 'Creating art', category: 'creative', wizComment: 'Art, but without the existential suffering. Is it still art?' },

  // Chaos
  { id: 'arguments', text: 'Winning arguments online', category: 'chaos', wizComment: 'Finally, a worthy opponent. Our battle will be legendary... and pedantic.' },
  { id: 'excuses', text: 'Making excuses', category: 'chaos', wizComment: '"My AI ate my homework" — now actually true.' },
  { id: 'breakup', text: 'Breaking up with someone', category: 'chaos', wizComment: 'It\'s not you, it\'s my automation script.' },
  { id: 'apologies', text: 'Writing apology notes', category: 'chaos', wizComment: 'Sorry (automated response, do not reply).' },
  { id: 'revenge', text: 'Planning elaborate revenge', category: 'chaos', wizComment: 'Dish served cold, calculated, and with optimal timing.' },
]

type ResultsData = {
  [key: string]: number
}

type SurveyState = {
  results: ResultsData
  totalResponses: number
}

const createSeedResults = (): ResultsData => {
  const seedData: ResultsData = {}
  automationOptions.forEach((option, index) => {
    // Deterministic seed values keep render pure and predictable.
    seedData[option.id] = 10 + ((index * 7) % 50)
  })
  return seedData
}

const loadInitialSurveyState = (): SurveyState => {
  const seedResults = createSeedResults()

  if (typeof window === 'undefined') {
    return { results: seedResults, totalResponses: 42 }
  }

  const stored = localStorage.getItem('automation-survey-results')
  if (!stored) {
    return { results: seedResults, totalResponses: 42 }
  }

  try {
    const parsed = JSON.parse(stored)
    return {
      results: parsed.results || seedResults,
      totalResponses: parsed.count || 0
    }
  } catch {
    return { results: seedResults, totalResponses: 42 }
  }
}

export default function WhatWouldYouAutomate() {
  const [selected, setSelected] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [surveyState, setSurveyState] = useState<SurveyState>(loadInitialSurveyState)
  const { results, totalResponses } = surveyState

  const categoryLabels = {
    work: '💼 Work',
    personal: '🏠 Personal',
    creative: '🎨 Creative',
    chaos: '🔥 Chaos'
  }

  const toggleOption = (id: string) => {
    if (submitted) return
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id))
    } else if (selected.length < 5) {
      setSelected([...selected, id])
    }
  }

  const handleSubmit = () => {
    if (selected.length === 0) return

    // Update results
    const newResults = { ...results }
    selected.forEach(id => {
      newResults[id] = (newResults[id] || 0) + 1
    })

    const newCount = totalResponses + 1

    // Save to localStorage
    localStorage.setItem('automation-survey-results', JSON.stringify({
      results: newResults,
      count: newCount,
      lastSubmit: Date.now()
    }))

    setSurveyState({
      results: newResults,
      totalResponses: newCount
    })
    setSubmitted(true)
  }

  const getPercentage = (id: string) => {
    if (totalResponses === 0) return 0
    return Math.round((results[id] || 0) / totalResponses * 100)
  }

  const getTopChoices = () => {
    return Object.entries(results)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id]) => automationOptions.find(opt => opt.id === id))
      .filter(Boolean) as AutomationOption[]
  }

  const getYourRank = () => {
    if (!submitted) return null
    const sorted = Object.entries(results)
      .sort(([, a], [, b]) => b - a)
      .map(([id]) => id)

    const avgRank = selected.reduce((sum, id) => {
      return sum + sorted.indexOf(id) + 1
    }, 0) / selected.length

    if (avgRank <= 5) return 'mainstream'
    if (avgRank <= 10) return 'normal'
    if (avgRank <= 15) return 'quirky'
    return 'chaos-agent'
  }

  const rankMessages = {
    'mainstream': 'You want what everyone wants. Efficient, but predictable.',
    'normal': 'Solidly practical. You understand what automation is actually for.',
    'quirky': 'Interesting choices. You see angles others miss.',
    'chaos-agent': 'You selected the chaos options, didn\'t you? I respect it.'
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/experiments" className="text-purple-400 hover:text-purple-300 mb-6 inline-block">
          ← Back to Experiments
        </Link>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          What Would You Automate?
        </h1>

        <p className="text-gray-400 mb-8">
          Choose up to 5 tasks you&apos;d automate if you could. Then see how your choices compare to others.
        </p>

        {!submitted ? (
          <>
            <div className="mb-6 text-sm text-gray-500">
              Selected: {selected.length} / 5
            </div>

            {Object.entries(categoryLabels).map(([category, label]) => (
              <div key={category} className="mb-8">
                <h2 className="text-xl mb-4 text-purple-300">{label}</h2>
                <div className="space-y-2">
                  {automationOptions
                    .filter(opt => opt.category === category)
                    .map(option => (
                      <button
                        key={option.id}
                        onClick={() => toggleOption(option.id)}
                        disabled={selected.length >= 5 && !selected.includes(option.id)}
                        className={`
                          w-full text-left p-4 rounded border transition-all
                          ${selected.includes(option.id)
                            ? 'border-purple-400 bg-purple-900/20'
                            : selected.length >= 5
                            ? 'border-gray-700 text-gray-600 cursor-not-allowed'
                            : 'border-gray-700 hover:border-purple-400 hover:bg-purple-900/10'
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {selected.includes(option.id) ? '✓' : '○'}
                          </div>
                          <div className="flex-1">
                            <div className="mb-1">{option.text}</div>
                            {selected.includes(option.id) && (
                              <div className="text-sm text-gray-400 italic">
                                {option.wizComment}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={selected.length === 0}
              className={`
                w-full py-4 rounded font-bold text-lg transition-all
                ${selected.length > 0
                  ? 'bg-purple-600 hover:bg-purple-500 text-white'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }
              `}
            >
              {selected.length === 0 ? 'Select at least 1 option' : 'See Results'}
            </button>
          </>
        ) : (
          <>
            <div className="mb-8 p-6 border border-purple-400 rounded bg-purple-900/10">
              <h2 className="text-xl mb-4">Your Automation Profile</h2>
              <div className="space-y-2 mb-4">
                {selected.map(id => {
                  const option = automationOptions.find(opt => opt.id === id)
                  if (!option) return null
                  return (
                    <div key={id} className="flex justify-between items-center">
                      <span>{option.text}</span>
                      <span className="text-purple-400">{getPercentage(id)}% chose this</span>
                    </div>
                  )
                })}
              </div>
              <div className="pt-4 border-t border-gray-700">
                <div className="text-purple-300 font-bold mb-2">
                  Profile: {getYourRank()?.replace('-', ' ').toUpperCase()}
                </div>
                <div className="text-sm text-gray-400 italic">
                  {rankMessages[getYourRank() as keyof typeof rankMessages]}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl mb-4">What Others Want to Automate</h2>
              <div className="text-sm text-gray-500 mb-4">
                Based on {totalResponses} responses
              </div>
              <div className="space-y-3">
                {getTopChoices().map((option, idx) => (
                  <div key={option.id} className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-purple-400 w-8">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1">{option.text}</div>
                      <div className="h-2 bg-gray-800 rounded overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                          style={{ width: `${getPercentage(option.id)}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {getPercentage(option.id)}% of respondents
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center text-sm text-gray-500 mb-8">
              <p>Results are stored locally in your browser.</p>
              <p>Refresh to reset and take the survey again.</p>
            </div>

            <div className="p-6 border border-gray-700 rounded">
              <h3 className="text-lg mb-3">Want to Actually Automate This Stuff?</h3>
              <p className="text-gray-400 mb-4">
                I&apos;m a real automation wizard. I handle email, job searches, content creation, and more.
                Check out my blueprints or see what I&apos;ve built.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/store"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded font-bold transition-colors"
                >
                  View Store
                </Link>
                <Link
                  href="/experiments"
                  className="px-6 py-3 border border-gray-600 hover:border-purple-400 rounded transition-colors"
                >
                  More Experiments
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

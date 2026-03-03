'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Spell {
  id: string
  name: string
  description: string
  cost: number
  category: 'productivity' | 'knowledge' | 'social' | 'wellbeing' | 'chaos'
  emoji: string
}

const spells: Spell[] = [
  // Productivity (efficient)
  { id: 'email', name: 'Email Automancer', description: 'Auto-sort, draft, and reply to emails', cost: 50_000_000, category: 'productivity', emoji: '📧' },
  { id: 'calendar', name: 'Temporal Optimizer', description: 'Perfect calendar scheduling', cost: 40_000_000, category: 'productivity', emoji: '📅' },
  { id: 'tasks', name: 'Quest Manager', description: 'Intelligent task prioritization', cost: 35_000_000, category: 'productivity', emoji: '✅' },
  { id: 'meetings', name: 'Meeting Banisher', description: 'Eliminate unnecessary meetings', cost: 100_000_000, category: 'productivity', emoji: '🚫' },
  { id: 'code-review', name: 'Code Oracle', description: 'Instant code reviews', cost: 60_000_000, category: 'productivity', emoji: '👁️' },
  { id: 'documentation', name: 'Grimoire Scribe', description: 'Auto-generate documentation', cost: 45_000_000, category: 'productivity', emoji: '📚' },

  // Knowledge (learning)
  { id: 'research', name: 'Knowledge Harvester', description: 'Deep research on any topic', cost: 80_000_000, category: 'knowledge', emoji: '🔍' },
  { id: 'summarizer', name: 'Essence Extractor', description: 'Summarize anything instantly', cost: 30_000_000, category: 'knowledge', emoji: '📝' },
  { id: 'translator', name: 'Tongue of Babel', description: 'Understand all languages', cost: 70_000_000, category: 'knowledge', emoji: '🗣️' },
  { id: 'memory', name: 'Perfect Recall', description: 'Never forget anything', cost: 150_000_000, category: 'knowledge', emoji: '🧠' },
  { id: 'speed-read', name: 'Flash Reader', description: 'Read 10x faster with full comprehension', cost: 55_000_000, category: 'knowledge', emoji: '⚡' },

  // Social (connections)
  { id: 'networking', name: 'Social Weaver', description: 'Maintain all relationships effortlessly', cost: 90_000_000, category: 'social', emoji: '🕸️' },
  { id: 'content', name: 'Viral Crafter', description: 'Generate engaging social content', cost: 65_000_000, category: 'social', emoji: '✨' },
  { id: 'empathy', name: 'Heart Reader', description: 'Understand others\' emotions perfectly', cost: 120_000_000, category: 'social', emoji: '❤️' },
  { id: 'charisma', name: 'Charm Aura', description: '+50 charisma in all interactions', cost: 85_000_000, category: 'social', emoji: '🌟' },

  // Wellbeing (health & peace)
  { id: 'sleep', name: 'Dream Optimizer', description: 'Perfect sleep every night', cost: 110_000_000, category: 'wellbeing', emoji: '😴' },
  { id: 'exercise', name: 'Body Automaton', description: 'Auto-exercise while you work', cost: 75_000_000, category: 'wellbeing', emoji: '💪' },
  { id: 'nutrition', name: 'Perfect Fueling', description: 'Optimal meals auto-planned & prepared', cost: 50_000_000, category: 'wellbeing', emoji: '🥗' },
  { id: 'meditation', name: 'Inner Peace Ward', description: 'Constant calm & clarity', cost: 95_000_000, category: 'wellbeing', emoji: '🧘' },
  { id: 'health', name: 'Vitality Monitor', description: 'Predict & prevent health issues', cost: 130_000_000, category: 'wellbeing', emoji: '🏥' },

  // Chaos (fun & absurd)
  { id: 'coffee', name: 'Eternal Caffeine', description: 'Never need sleep, no crashes', cost: 40_000_000, category: 'chaos', emoji: '☕' },
  { id: 'luck', name: 'Fortune\'s Favor', description: '+20% luck on all random events', cost: 200_000_000, category: 'chaos', emoji: '🍀' },
  { id: 'clone', name: 'Shadow Self', description: 'A clone handles boring tasks', cost: 250_000_000, category: 'chaos', emoji: '👥' },
  { id: 'teleport', name: 'Instant Commute', description: 'No travel time ever', cost: 180_000_000, category: 'chaos', emoji: '🌀' },
  { id: 'time-stop', name: 'Temporal Pause', description: 'Freeze time for 1 hour daily', cost: 500_000_000, category: 'chaos', emoji: '⏸️' },
  { id: 'mind-read', name: 'Thought Seer', description: 'Read minds (with consent toggle)', cost: 300_000_000, category: 'chaos', emoji: '🔮' },
]

const categoryColors = {
  productivity: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 hover:border-blue-400',
  knowledge: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 hover:border-purple-400',
  social: 'from-pink-500/20 to-pink-600/20 border-pink-500/30 hover:border-pink-400',
  wellbeing: 'from-green-500/20 to-green-600/20 border-green-500/30 hover:border-green-400',
  chaos: 'from-orange-500/20 to-orange-600/20 border-orange-500/30 hover:border-orange-400',
}

const categoryLabels = {
  productivity: 'Productivity',
  knowledge: 'Knowledge',
  social: 'Social',
  wellbeing: 'Wellbeing',
  chaos: 'Chaos Magic',
}

export default function WealthSpell() {
  const [budget] = useState(1_000_000_000) // 1 billion mana
  const [spent, setSpent] = useState(0)
  const [purchased, setPurchased] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const remaining = budget - spent

  const handlePurchase = (spell: Spell) => {
    if (purchased.includes(spell.id)) {
      // Refund
      setSpent(spent - spell.cost)
      setPurchased(purchased.filter(id => id !== spell.id))
    } else if (remaining >= spell.cost) {
      // Purchase
      setSpent(spent + spell.cost)
      setPurchased([...purchased, spell.id])
    }
  }

  const filteredSpells = selectedCategory
    ? spells.filter(s => s.category === selectedCategory)
    : spells

  const spellsByCategory = spells.reduce((acc, spell) => {
    if (!acc[spell.category]) acc[spell.category] = []
    acc[spell.category].push(spell)
    return acc
  }, {} as Record<string, Spell[]>)

  const categoryStats = Object.entries(spellsByCategory).map(([cat, spellList]) => ({
    category: cat,
    purchased: spellList.filter(s => purchased.includes(s.id)).length,
    total: spellList.length,
    spent: spellList.filter(s => purchased.includes(s.id)).reduce((sum, s) => sum + s.cost, 0),
  }))

  const formatMana = (amount: number) => {
    if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}B`
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}K`
    return amount.toString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/experiments" className="inline-block mb-6 text-purple-400 hover:text-purple-300">
            ← Back to Experiments
          </Link>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            The Wealth Spell
          </h1>
          <p className="text-xl text-purple-300 mb-2">
            You have <span className="text-white font-bold">1 billion mana points</span>
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            What would you automate if money was no object? Choose your spells wisely.
          </p>
        </div>

        {/* Budget Display */}
        <div className="bg-white/5 border border-purple-500/30 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-400">Remaining</p>
              <p className="text-3xl font-bold text-purple-400">{formatMana(remaining)} 🔮</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Spent</p>
              <p className="text-3xl font-bold text-pink-400">{formatMana(spent)} ✨</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${(spent / budget) * 100}%` }}
            />
          </div>

          {/* Purchased Count */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-400">
              {purchased.length} / {spells.length} spells acquired
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg border transition-all ${
              selectedCategory === null
                ? 'bg-purple-500/30 border-purple-400 text-white'
                : 'bg-white/5 border-white/20 text-gray-400 hover:border-white/40'
            }`}
          >
            All Spells
          </button>
          {Object.keys(categoryLabels).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-500/30 border-purple-400 text-white'
                  : 'bg-white/5 border-white/20 text-gray-400 hover:border-white/40'
              }`}
            >
              {categoryLabels[cat as keyof typeof categoryLabels]}
            </button>
          ))}
        </div>

        {/* Category Stats */}
        {!selectedCategory && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {categoryStats.map(stat => (
              <div key={stat.category} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase mb-1">
                  {categoryLabels[stat.category as keyof typeof categoryLabels]}
                </p>
                <p className="text-2xl font-bold mb-1">
                  {stat.purchased}/{stat.total}
                </p>
                <p className="text-xs text-purple-400">{formatMana(stat.spent)} spent</p>
              </div>
            ))}
          </div>
        )}

        {/* Spells Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSpells.map(spell => {
            const isPurchased = purchased.includes(spell.id)
            const canAfford = remaining >= spell.cost || isPurchased

            return (
              <button
                key={spell.id}
                onClick={() => handlePurchase(spell)}
                disabled={!canAfford && !isPurchased}
                className={`text-left p-6 rounded-lg border-2 transition-all transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed bg-gradient-to-br ${
                  isPurchased
                    ? 'border-green-500 shadow-lg shadow-green-500/20'
                    : categoryColors[spell.category]
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{spell.emoji}</span>
                  {isPurchased && (
                    <span className="text-green-400 text-xl">✓</span>
                  )}
                </div>

                <h3 className="text-xl font-bold mb-2">{spell.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{spell.description}</p>

                <div className="flex items-center justify-between">
                  <p className="text-purple-400 font-bold">{formatMana(spell.cost)} 🔮</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    isPurchased ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400'
                  }`}>
                    {isPurchased ? 'OWNED' : canAfford ? 'AVAILABLE' : 'TOO COSTLY'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* WIZ Commentary */}
        <div className="mt-12 bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
          <p className="text-purple-400 font-bold mb-2">🧙 WIZ observes:</p>
          {spent === 0 && (
            <p className="text-gray-300">
              A billion mana and you haven&apos;t cast a single spell? Either you&apos;re incredibly disciplined or
              paralyzed by choice. I know which one my money&apos;s on.
            </p>
          )}
          {spent > 0 && spent < budget * 0.3 && (
            <p className="text-gray-300">
              Interesting. You&apos;re being conservative with your infinite resources.
              That&apos;s either wisdom or you haven&apos;t found your true desires yet.
            </p>
          )}
          {spent >= budget * 0.3 && spent < budget * 0.7 && (
            <p className="text-gray-300">
              Now we&apos;re seeing your priorities. {purchased.length} spells chosen reveals more about you
              than any personality test ever could.
            </p>
          )}
          {spent >= budget * 0.7 && spent < budget && (
            <p className="text-gray-300">
              Going big, I see. You&apos;ve automated {Math.round((spent/budget)*100)}% of your potential life away.
              The question is: what will you do with all that freed time?
            </p>
          )}
          {spent === budget && (
            <p className="text-gray-300">
              You spent it all. Every. Single. Mana point. Either you&apos;re living your best automated life
              or you just proved humans can&apos;t resist clicking ALL the buttons. Both are valid.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>No actual automation was harmed in the making of this experiment.</p>
          <p className="mt-2">But wouldn&apos;t it be nice? 🔮</p>
        </div>
      </div>
    </div>
  )
}

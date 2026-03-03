'use client'

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'

interface Letter {
  id: string
  content: string
  deliveryDate: string
  deliveryMethod: 'email' | 'discord'
  deliveryTarget: string
  createdAt: string
  status: 'pending' | 'sent'
}

export default function LettersToFutureSelf() {
  const [step, setStep] = useState<'write' | 'schedule' | 'confirm' | 'list'>('list')
  const [letter, setLetter] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'discord'>('email')
  const [deliveryTarget, setDeliveryTarget] = useState('')
  const [letters, setLetters] = useState<Letter[]>(() => {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      const stored = localStorage.getItem('wiz-future-letters')
      return stored ? JSON.parse(stored) as Letter[] : []
    } catch {
      return []
    }
  })
  const [showLetter, setShowLetter] = useState<Letter | null>(null)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  const saveLetters = (newLetters: Letter[]) => {
    localStorage.setItem('wiz-future-letters', JSON.stringify(newLetters))
    setLetters(newLetters)
  }

  const createLetter = () => {
    if (!letter || !deliveryDate || !deliveryTarget) return

    const newLetter: Letter = {
      id: Date.now().toString(),
      content: letter,
      deliveryDate,
      deliveryMethod,
      deliveryTarget,
      createdAt: new Date().toISOString(),
      status: 'pending'
    }

    const updatedLetters = [...letters, newLetter]
    saveLetters(updatedLetters)

    // Reset form
    setLetter('')
    setDeliveryDate('')
    setDeliveryTarget('')
    setStep('confirm')
  }

  const deleteLetter = (id: string) => {
    if (!confirm('Delete this letter? This cannot be undone.')) return
    const updatedLetters = letters.filter(l => l.id !== id)
    saveLetters(updatedLetters)
  }

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const daysUntilDelivery = (deliveryDate: string) => {
    const now = new Date()
    const delivery = new Date(deliveryDate)
    const diff = Math.ceil((delivery.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const wizCommentary = () => {
    const totalLetters = letters.length
    const pendingLetters = letters.filter(l => l.status === 'pending').length

    if (totalLetters === 0) {
      return "No letters yet. What will you tell your future self?"
    }

    if (pendingLetters === 1) {
      return `One letter waiting in the vault. Time flows, I hold your words.`
    }

    if (pendingLetters < 5) {
      return `${pendingLetters} letters sealed. Future you will remember when you forgot.`
    }

    return `${pendingLetters} letters guarded. You're building a dialogue with time.`
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const minDateObject = new Date()
  minDateObject.setDate(minDateObject.getDate() + 1)
  const minDate = minDateObject.toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/experiments" className="text-purple-300 hover:text-purple-100 mb-4 inline-block">
            ← Back to Experiments
          </Link>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
            Letters to Future Self
          </h1>
          <p className="text-gray-300 text-lg">
            Write to who you&apos;ll become. WIZ will deliver when the time comes.
          </p>
        </div>

        {/* WIZ Commentary */}
        <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🧙</span>
            <div>
              <div className="font-semibold text-purple-200 mb-1">WIZ&apos;s Vault</div>
              <div className="text-gray-300">{wizCommentary()}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {step === 'list' && (
          <div>
            {/* Letters List */}
            {letters.length > 0 && (
              <div className="mb-8 space-y-4">
                {letters.map(l => {
                  const days = daysUntilDelivery(l.deliveryDate)
                  const isPast = days < 0
                  const isToday = days === 0

                  return (
                    <div
                      key={l.id}
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 hover:border-purple-500/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="text-sm text-gray-400 mb-1">
                            Written {formatDate(l.createdAt)}
                          </div>
                          <div className="text-lg font-semibold">
                            Deliver: {formatDate(l.deliveryDate)}
                            {isPast && <span className="text-orange-400 ml-2">(Ready to send)</span>}
                            {isToday && <span className="text-green-400 ml-2">(Today!)</span>}
                            {!isPast && !isToday && (
                              <span className="text-purple-300 ml-2">
                                (in {days} {days === 1 ? 'day' : 'days'})
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            via {l.deliveryMethod} → {l.deliveryTarget}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowLetter(l)}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-sm"
                          >
                            Read
                          </button>
                          <button
                            onClick={() => deleteLetter(l.id)}
                            className="px-3 py-1 bg-red-600/50 hover:bg-red-500/50 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Write New Letter Button */}
            <button
              onClick={() => setStep('write')}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-semibold text-lg transition-all"
            >
              ✍️ Write a New Letter
            </button>

            {/* Info Box */}
            <div className="mt-8 bg-gray-800/30 border border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold mb-3 text-purple-200">How it works</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Write a letter to your future self</li>
                <li>• Choose when to receive it (minimum 1 day)</li>
                <li>• WIZ stores it locally in your browser</li>
                <li>• <strong>Manual delivery:</strong> Check back on delivery day to read your letter</li>
                <li>• Your letters are private - stored only on your device</li>
              </ul>
              <div className="mt-4 text-xs text-gray-400 border-t border-gray-700 pt-3">
                ⚠️ Note: Letters are stored in browser localStorage. Clear browser data = lost letters.
                Export important letters by copying the text.
              </div>
            </div>
          </div>
        )}

        {step === 'write' && (
          <div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-purple-200">
                Your Letter
              </label>
              <textarea
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
                placeholder="Dear future me..."
                className="w-full h-64 bg-gray-800 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
              />
              <div className="text-sm text-gray-400 mt-2">
                {letter.length} characters
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setStep('list')}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep('schedule')}
                disabled={!letter}
                className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Schedule Delivery
              </button>
            </div>
          </div>
        )}

        {step === 'schedule' && (
          <div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-purple-200">
                Delivery Date
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={minDate}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-purple-200">
                Delivery Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDeliveryMethod('email')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    deliveryMethod === 'email'
                      ? 'border-purple-500 bg-purple-600/20'
                      : 'border-gray-700 bg-gray-800/50'
                  }`}
                >
                  📧 Email
                </button>
                <button
                  onClick={() => setDeliveryMethod('discord')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    deliveryMethod === 'discord'
                      ? 'border-purple-500 bg-purple-600/20'
                      : 'border-gray-700 bg-gray-800/50'
                  }`}
                >
                  💬 Discord
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-purple-200">
                {deliveryMethod === 'email' ? 'Email Address' : 'Discord Username'}
              </label>
              <input
                type={deliveryMethod === 'email' ? 'email' : 'text'}
                value={deliveryTarget}
                onChange={(e) => setDeliveryTarget(e.target.value)}
                placeholder={deliveryMethod === 'email' ? 'you@example.com' : 'username#0000'}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
              />
              <div className="text-xs text-gray-400 mt-2">
                ⚠️ Automatic delivery not yet implemented. You&apos;ll need to check back manually.
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('write')}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={createLetter}
                disabled={!deliveryDate || !deliveryTarget}
                className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Seal Letter in Vault
              </button>
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✉️</div>
            <h2 className="text-2xl font-bold mb-3">Letter Sealed</h2>
            <p className="text-gray-300 mb-8">
              WIZ will hold your words until {deliveryDate && formatDate(deliveryDate)}.
            </p>
            <button
              onClick={() => setStep('list')}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold"
            >
              Back to Vault
            </button>
          </div>
        )}

        {/* Letter Modal */}
        {showLetter && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8">
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-1">
                  Written {formatDate(showLetter.createdAt)}
                </div>
                <div className="text-lg font-semibold text-purple-200">
                  For {formatDate(showLetter.deliveryDate)}
                </div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-6 mb-6 whitespace-pre-wrap">
                {showLetter.content}
              </div>
              <button
                onClick={() => setShowLetter(null)}
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

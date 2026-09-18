'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { copy } from './copy';
interface Letter { id: string; content: string; deliveryDate: string; createdAt: string }

export default function LettersToFutureSelf() {
  const { language } = useLanguage();
  const c = copy[language];
  const [mounted, setMounted] = useState(false);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setMounted(true);
    try {
      const stored = JSON.parse(localStorage.getItem('wiz-future-letters') ?? '[]');
      if (Array.isArray(stored)) setLetters(stored.filter(l => l && typeof l.content === 'string').map((l, i) => ({
        id: String(l.id ?? i), content: l.content, deliveryDate: String(l.deliveryDate ?? ''), createdAt: String(l.createdAt ?? ''),
      })));
    } catch { /* Leave saved browser data untouched, even if it cannot be read. */ }
  }, []);
  const date = (iso: string) => {
    const value = new Date(iso);
    return Number.isNaN(value.getTime()) ? iso : value.toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const copyLetter = async (letter: Letter) => {
    try { await navigator.clipboard.writeText(letter.content); setCopied(letter.id); setFailed(false); }
    catch { setFailed(true); }
  };
  return <div lang={language} className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
    <div className="max-w-2xl mx-auto px-5 py-6 sm:py-10">
      <Link href="/experiments/" prefetch={false} className="inline-flex min-h-11 items-center text-purple-300 text-xs mb-3 hover:underline">{c.back}</Link>
      <h1 className="text-3xl font-bold mb-5 text-purple-100">{c.title}</h1>
      <div className="border border-purple-500/30 bg-purple-900/30 rounded-lg p-4 mb-5 text-sm leading-relaxed text-gray-200 space-y-3">
        <p className="font-semibold text-purple-100">{c.status}</p><p>{c.recovery}</p><p>{c.alternative}</p>
      </div>
      {mounted && (letters.length ? <section className="mb-5">
        <h2 className="font-semibold text-purple-200 mb-3">{c.saved} ({letters.length})</h2>
        <div className="space-y-4">{letters.map(letter => <article key={letter.id} className="bg-gray-900/50 border border-purple-500/30 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-3">{c.written} {date(letter.createdAt)}{letter.deliveryDate && ` · ${c.intended} ${date(letter.deliveryDate)}`}</p>
          <p className="whitespace-pre-wrap break-words text-gray-200 text-sm leading-relaxed select-text">{letter.content}</p>
          <button className="min-h-11 mt-3 px-3 border border-purple-400/50 text-purple-200 text-sm rounded hover:bg-purple-800/30" onClick={() => copyLetter(letter)}>{copied === letter.id ? c.copied : c.copy}</button>
        </article>)}</div>
        <p role="status" className="text-xs text-purple-200 mt-2">{failed ? c.failed : copied ? c.copied : ''}</p>
      </section> : <p className="text-xs text-purple-200 mb-5">{c.empty}</p>)}
      <details className="border border-purple-500/30 rounded-lg px-4">
        <summary className="flex items-center min-h-11 text-sm text-purple-200 cursor-pointer">{c.why}</summary>
        <p className="pb-4 text-sm leading-relaxed text-gray-300">{c.explanation}</p>
      </details>
    </div>
  </div>;
}

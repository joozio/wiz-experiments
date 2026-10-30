'use client';
import { useLanguage } from './LanguageContext';
export function usePageCopy(pl: Record<string, string>) {
  const { language } = useLanguage();
  const c = (s: string) => (language === 'pl' ? pl[s] ?? s : s);
  return { c, language };
}

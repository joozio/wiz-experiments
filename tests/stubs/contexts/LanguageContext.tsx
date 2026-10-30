'use client';
import { createContext, useContext, useState } from 'react';
import type { Language } from '@/data/translations';
const Ctx = createContext<{ language: Language; setLanguage: (l: Language) => void }>({ language: 'en', setLanguage: () => {} });
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  return <Ctx.Provider value={{ language, setLanguage }}>{children}</Ctx.Provider>;
}
export const useLanguage = () => useContext(Ctx);

"use client";

import { Globe } from 'lucide-react';
import { useState } from 'react';

type Lang = 'en' | 'gu' | 'hi';

export default function LanguageSwitcher({ currentLang, onLangChange }: { currentLang: Lang, onLangChange: (lang: Lang) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const langMap = {
    en: 'EN',
    gu: 'ગુજ',
    hi: 'हिं'
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition px-3 py-1.5 rounded-full hover:bg-white/5"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>{langMap[currentLang]}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-28 glass-panel-deep rounded-xl p-1.5 shadow-xl border border-white/5 z-50">
          <button onClick={() => { onLangChange('en'); setIsOpen(false); }} className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition">English</button>
          <button onClick={() => { onLangChange('gu'); setIsOpen(false); }} className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition">ગુજરાતી</button>
          <button onClick={() => { onLangChange('hi'); setIsOpen(false); }} className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition">हिन्दी</button>
        </div>
      )}
    </div>
  );
}
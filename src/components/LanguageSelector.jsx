import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { languages } from '../utils/i18n';
import useUserSettings from '../store/useUserSettings';

export default function LanguageSelector({ compact = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useUserSettings();
  const dropdownRef = useRef(null);

  const currentLang = languages[language] || languages.en;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-lg transition-colors ${
          compact
            ? 'p-2 hover:bg-slate-800 text-slate-400 hover:text-white'
            : 'px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
        }`}
        aria-label="Select language"
      >
        <Globe className="w-4 h-4" />
        {!compact && (
          <>
            <span className="text-sm">{currentLang.flag} {currentLang.code.toUpperCase()}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
          <div className="p-2">
            <div className="text-xs text-slate-500 px-3 py-2 font-medium">Select Language</div>
            {Object.values(languages).map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  language === lang.code
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'hover:bg-slate-700 text-slate-300'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">{lang.nativeName}</div>
                  <div className="text-xs text-slate-500">{lang.name}</div>
                </div>
                {language === lang.code && (
                  <Check className="w-4 h-4 text-blue-400" />
                )}
              </button>
            ))}
          </div>
          <div className="border-t border-slate-700 p-3">
            <p className="text-xs text-slate-500">
              Help us translate! Some translations are still in progress.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

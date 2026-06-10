// src/context/LanguageContext.jsx
// Manages language state (EN/MY) across the entire app

import { createContext, useContext, useState } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  
  // ─── Load saved language from localStorage ─────────────
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('cfcms_language') || 'en';
  });

  // ─── Toggle between EN and MY ──────────────────────────
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'my' : 'en';
    setLanguage(newLang);
    localStorage.setItem('cfcms_language', newLang);
  };

  // ─── Translation function t('key.subkey', { name: 'Ali' })
  const t = (key, replacements = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value === undefined || value === null) return key;
      value = value[k];
    }

    if (!value) return key;

    // Handle replacements like {name}
    if (typeof value === 'string' && Object.keys(replacements).length > 0) {
      return value.replace(/\{(\w+)\}/g, (_, k) => replacements[k] || `{${k}}`);
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// ─── Custom hook ───────────────────────────────────────────
export const useLanguage = () => useContext(LanguageContext);
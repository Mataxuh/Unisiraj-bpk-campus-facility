// src/components/LanguageToggle.jsx
// Flag + Text language toggle button

import { useLanguage } from '../context/LanguageContext';

const LanguageToggle = ({ variant = 'navbar' }) => {
  const { language, toggleLanguage } = useLanguage();


  // ─── Login style (on LIGHT background) ────────────────
  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80 shadow-md"
      style={{
        backgroundColor: '#1B2D6B',
        color: '#E8A020',
        border: '1px solid #E8A020',
      }}
      title={language === 'en' ? 'Tukar ke Bahasa Malaysia' : 'Switch to English'}
    >
      {language === 'en' ? (
        <span>🇬🇧 ENGLISH</span>
      ) : (
        <span>🇲🇾 MALAY</span>
      )}
    </button>
  );


  // ─── Navbar style (on blue/gold background) ────────────
  if (variant === 'navbar') {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80"
        style={{
          backgroundColor: 'rgba(255,255,255,0.15)',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.4)',
        }}
        title={language === 'en' ? 'Tukar ke Bahasa Malaysia' : 'Switch to English'}
      >
        {language === 'en' ? (
          <span>🇬🇧 ENGLISH</span>
        ) : (
          <span>🇲🇾 MALAY</span>
        )}
      </button>
    );
  }

  // ─── Login style (on dark background) ──────────────────
  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80"
      style={{
        backgroundColor: 'rgba(255,255,255,0.15)',
        color: '#ffffff',
        border: '1px solid rgba(255,255,255,0.4)',
      }}
      title={language === 'en' ? 'Tukar ke Bahasa Malaysia' : 'Switch to English'}
    >
      {language === 'en' ? (
        <span>🇬🇧 ENGLISH</span>
      ) : (
        <span>🇲🇾 MALAY</span>
      )}
    </button>
  );
};

export default LanguageToggle;
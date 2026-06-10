// src/pages/NotFoundPage.jsx
// 404 error page — shown when user visits an unknown URL
// Branded with UniSiraj colors, with fade-slide-up + floating 404 animation

import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useApp();

  const handleGoHome = () => {
    if (user) {
      navigate(`/${user.role}`, { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        backgroundColor:    '#dde3f0',
        backgroundImage:    'url(/background_login.jpg)',
        backgroundSize:     'auto',
        backgroundRepeat:   'repeat',
      }}
    >

      {/* ─── 404 Card — fades in and slides up on load ─────── */}
      <div
        className="bg-white shadow-2xl rounded-lg w-full max-w-md overflow-hidden text-center"
        style={{ animation: 'fadeSlideUp 0.6s ease-out forwards' }}
      >

        {/* ─── Header Banner ──────────────────────────────── */}
        <div
          className="px-10 py-8 flex flex-col items-center gap-3"
          style={{ backgroundColor: '#1B2D6B' }}
        >
          <img
            src="/logo.png"
            alt="UniSiraj"
            className="h-30 w-30 object-contain rounded-full bg-white p-0.5 shadow-lg"
          />
          <p className="text-white text-sm font-bold">
            BPK -
            <span style={{ color: '#eab141' }}> UNI</span>
            <span style={{ color: '#ede7dc' }}>SIRAJ</span>
          </p>
        </div>

        {/* ─── 404 Content ────────────────────────────────── */}
        <div className="px-10 py-10 flex flex-col items-center gap-4">

          {/* 404 number — floats up and down forever */}
          <h1
            className="text-8xl font-extrabold leading-none"
            style={{
              color:     '#1B2D6B',
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            404
          </h1>

          {/* Gold divider */}
          <div
            className="w-16 h-1 rounded-full"
            style={{ backgroundColor: '#dca648' }}
          />

          {/* Error title */}
          <h2
            className="text-xl font-bold"
            style={{ color: '#1B2D6B' }}
          >
            {t('notFound.title')}
          </h2>

          {/* Error subtitle */}
          <p className="text-sm text-gray-500 max-w-xs">
            {t('notFound.subtitle')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">

            {/* Go Back */}
            <button
              onClick={() => navigate(-1)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold border transition hover:opacity-80"
              style={{ borderColor: '#1B2D6B', color: '#1B2D6B' }}
            >
              <ArrowLeft className="w-4 h-4" />
              {t('notFound.goBack')}
            </button>

            {/* Go Home */}
            <button
              onClick={handleGoHome}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-white transition hover:opacity-90"
              style={{ backgroundColor: '#1B2D6B' }}
            >
              <Home className="w-4 h-4" />
              {t('notFound.goHome')}
            </button>

          </div>
        </div>
      </div>

      {/* ─── Footer ─────────────────────────────────────── */}
      <p className="text-xs text-gray-400 mt-4 text-center">
        {t('login.footer')}
      </p>

    </div>
  );
};

export default NotFoundPage;
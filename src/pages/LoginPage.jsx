// src/pages/LoginPage.jsx
// Login page with dual language support
// Header shows BPK only (UniSiraj shown on splash screen)

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Eye, EyeOff, LogIn, AlertCircle, ChevronDown, ChevronUp, KeyRound } from 'lucide-react';
import LanguageToggle from '../components/LanguageToggle';

const LoginPage = () => {
  const { user, login } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [error,           setError]           = useState('');
  const [isLoading,       setIsLoading]       = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  useEffect(() => {
    if (user) navigate(`/${user.role}`, { replace: true });
  }, [user, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      setError(t('login.errorEmpty'));
      setIsLoading(false);
      return;
    }

    try {
      const result = login(email.trim(), password);
      if (result.success) {
        navigate(`/${result.user.role}`, { replace: true });
      } else {
        setError(result.error || t('login.errorInvalid'));
        setIsLoading(false);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-6"
      style={{
        backgroundImage:  'url(/background_login.jpg)',
        backgroundSize:   'auto',
        backgroundRepeat: 'repeat',
        backgroundColor:  '#dde3f0',
      }}
    >

      {/* ─── Language Toggle Top Right ─────────────────────── */}
      <div className="absolute top-4 right-4">
        <LanguageToggle variant="login" />
      </div>

      {/* ─── Main Login Card (rounded lg)──────────────────────────────── */}
      <div className="bg-white shadow-2xl w-full max-w-lg overflow-hidden">

        {/* ─── Header Banner — BPK Only ────────────────────── */}
        <div
          className="px-6 py-8 flex flex-col items-center gap-4"
          style={{ backgroundColor: '#1B2D6B' }}
        >

          {/* ─── BPK Logo — Centered & Bigger ───────────────── */}
          <div className="flex flex-col items-center gap-2">
            <img
              src="/bpk-logo.png"
              alt="BPK"
              className="h-24 sm:h-28 object-contain rounded-full bg-white p-2 shadow-lg"
            />
            <p
              className="text-sm font-extrabold tracking-widest"
              style={{ color: '#f0b145' }}
            >
              BPK
            </p>
          </div>

          {/* ─── Department & System Info ────────────────────── */}
          <div className="text-center flex flex-col gap-2">

            {/* Department Name */}
            <p
              className="text-sm font-semibold"
              style={{ color: '#edb149' }}
            >
              {t('login.department')}
            </p>

            {/* University Name */}
            <p className="text-white text-xs opacity-70">
              Universiti Islam Antarabangsa Tuanku Syed Sirajuddin (UniSIRAJ)
            </p>

            {/* System Title Badge */}
            <div
              className="mt-3 px-5 py-1.5 rounded-full text-xs font-semibold border inline-block"
              style={{ borderColor: '#b77b14', color: '#e6a83d' }}
            >
              🏢 {t('login.systemTitle')}
            </div>
          </div>
        </div>

        {/* ─── Login Form ──────────────────────────────────── */}
        <div className="px-6 sm:px-15 py-8">

          <h2
            className="text-xl font-extrabold mb-1"
            style={{ color: '#1B2D6B' }}
          >
            {t('login.welcome')}
          </h2>
          <p className="text-xs text-gray-400 mb-6">
            {t('login.subtitle')}
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {/* ─── Email Field ─────────────────────────────── */}
            <div>
              <label
                className="block text-sm font-semibold mb-1"
                style={{ color: '#1B2D6B' }}
              >
                {t('login.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('login.emailPlaceholder')}
                disabled={isLoading}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 transition disabled:opacity-50"
              />
            </div>

            {/* ─── Password Field ──────────────────────────── */}
            <div>
              <label
                className="block text-sm font-semibold mb-1"
                style={{ color: '#1B2D6B' }}
              >
                {t('login.password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('login.passwordPlaceholder')}
                  disabled={isLoading}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 transition pr-10 disabled:opacity-50"
                />
                {/* Show/Hide Password Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            {/* ─── Error Message ───────────────────────────── */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* ─── Sign In Button ──────────────────────────── */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm text-white transition-opacity mt-2 disabled:opacity-70"
              style={{ backgroundColor: isLoading ? '#999' : '#1B2D6B' }}
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4" />
                  <span>{t('login.signingIn')}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{t('login.signIn')}</span>
                </>
              )}
            </button>

          </form>

          {/* ─── Collapsible Demo Credentials ─────────────── */}
          <div className="mt-6">
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: showCredentials ? '#1B2D6B' : '#EEF0F8',
                color:           showCredentials ? '#E8A020' : '#1B2D6B',
              }}
            >
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                <span>{t('login.demoCredentials')}</span>
              </div>
              {showCredentials
                ? <ChevronUp className="w-4 h-4" />
                : <ChevronDown className="w-4 h-4" />
              }
            </button>

            {/* ─── Credentials List ────────────────────────── */}
            {showCredentials && (
              <div
                className="mt-2 rounded-xl p-4 text-xs flex flex-col gap-1"
                style={{ backgroundColor: '#EEF0F8' }}
              >
                {[
                  { role: t('login.roles.student'), email: 'student@unisiraj.edu.my',  pass: 'student123', icon: '👨‍🎓' },
                  { role: t('login.roles.student'), email: 'student2@unisiraj.edu.my', pass: 'student456', icon: '👨‍🎓' },
                  { role: t('login.roles.staff'),   email: 'staff@unisiraj.edu.my',    pass: 'staff123',   icon: '👔' },
                  { role: t('login.roles.staff2'),  email: 'staff2@unisiraj.edu.my',   pass: 'staff456',   icon: '👔' },
                  { role: t('login.roles.tech1'),   email: 'tech@unisiraj.edu.my',     pass: 'tech123',    icon: '🔧' },
                  { role: t('login.roles.tech2'),   email: 'tech2@unisiraj.edu.my',    pass: 'tech456',    icon: '🔧' },
                  { role: t('login.roles.admin'),   email: 'admin@unisiraj.edu.my',    pass: 'admin123',   icon: '⚙️' },
                ].map((item) => (
                  <div
                    key={item.email}
                    className="px-4 py-2 rounded-lg"
                  >
                    <p className="font-semibold" style={{ color: '#1B2D6B' }}>
                      {item.icon} {item.role}
                    </p>
                    <p className="text-gray-500">
                      {item.email} / {item.pass}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ─── Footer ───────────────────────────────────────── */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        {t('login.footer')}
      </p>

    </div>
  );
};

export default LoginPage;
// src/components/Navbar.jsx
// Professional navbar - fully responsive for mobile and desktop

import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const roleBadgeStyles = {
    student:    'bg-blue-100 text-blue-800',
    admin:      'bg-purple-100 text-purple-700',
    technician: 'bg-green-100 text-green-700',
    staff:      'bg-orange-100 text-orange-700',
  };

  return (
    <nav>
      <div
        className="px-3 py-2 sm:px-6 sm:py-4 flex items-center justify-between gap-2 sm:gap-6"
        style={{ background: 'linear-gradient(to right, #ab710d 0%, #0e2782 100%)' }}
      >

        {/* ─── Left: Logo ───────────────────────────────────── */}
        <div className="flex-shrink-0">
          <img
            src="/logo.png"
            alt="UniSiraj Logo"
            className="h-12 sm:h-20 object-contain"
          />
        </div>

        {/* ─── Center: BPK Title ────────────────────────────── */}
        <div className="flex-1 text-center">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            BPK
          </h1>
          {/* Hidden on very small screens, visible on sm+ */}
          <p
            className="text-xs sm:text-sm mt-0.5 hidden sm:block"
            style={{ color: '#edbf18d7' }}
          >
            {t('navbar.systemTitle')}
          </p>
          {/* Short version for mobile only */}
          <p
            className="text-xs mt-0.5 block sm:hidden"
            style={{ color: '#edbf18d7' }}
          >
            Campus Facility
          </p>
        </div>

        {/* ─── Right: User Info & Logout ───────────────────── */}
        <div className="flex-shrink-0 flex items-center gap-2 sm:gap-4">

          {/* User Details — hidden on mobile */}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">
              {user?.name || 'User'}
            </p>
            {user?.role === 'student' ? (
              <p className="text-xs font-medium" style={{ color: '#E8A020' }}>
                {user?.matricNo || 'Student'}
              </p>
            ) : (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize inline-block ${roleBadgeStyles[user?.role]}`}>
                {user?.role || 'User'}
              </span>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm font-bold transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#E8A020', color: '#1B2D6B' }}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{t('common.logout')}</span>
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
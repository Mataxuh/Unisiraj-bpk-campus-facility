// src/components/SplashScreen.jsx
// Splash screen shown when app first loads
// Displays both logos with fade + pulse animation

const SplashScreen = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
      style={{
        backgroundColor: '#1B2D6B',
        animation: 'fadeOut 0.5s ease-in-out 2.5s forwards',
      }}
    >

      {/* ─── Logos Row ──────────────────────────────────── */}
      <div
        className="flex items-center justify-center gap-8"
        style={{ animation: 'fadeInUp 0.8s ease-out forwards' }}
      >

        {/* UniSiraj Logo */}
        <div className="flex flex-col items-center gap-2">
          <img
            src="/logo.png"
            alt="UniSiraj"
            className="h-24 w-24 object-contain"
            style={{ animation: 'pulse 2s ease-in-out infinite' }}
          />
          <p className="text-white text-xs font-bold tracking-widest">
            UNI<span style={{ color: '#E8A020' }}>SIRAJ</span>
          </p>
        </div>

        {/* Divider */}
        <div
          className="h-16 w-px opacity-40"
          style={{ backgroundColor: '#E8A020' }}
        />

        {/* BPK Logo */}
        <div className="flex flex-col items-center gap-2">
          <img
            src="/bpk-logo.png"
            alt="BPK"
            className="h-24 w-24 object-contain"
            style={{
              animation: 'pulse 2s ease-in-out infinite',
              mixBlendMode: 'screen',
            }}
          />
          <p
            className="text-xs font-bold tracking-widest"
            style={{ color: '#E8A020' }}
          >
            BPK
          </p>
        </div>
      </div>

      {/* ─── System Title ───────────────────────────────── */}
      <div
        className="text-center"
        style={{ animation: 'fadeInUp 0.8s ease-out 0.3s both' }}
      >
        <p
          className="text-sm font-semibold tracking-wide"
          style={{ color: '#E8A020' }}
        >
          Campus Facility Management System
        </p>
        <p className="text-white text-xs mt-1 opacity-60">
          Universiti Islam Antarabangsa Tuanku Syed Sirajuddin
        </p>
      </div>

      {/* ─── Loading Dots ───────────────────────────────── */}
      <div
        className="flex items-center gap-2 mt-4"
        style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: '#E8A020',
              animation: `bounceDot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

    </div>
  );
};

export default SplashScreen;
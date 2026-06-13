// src/components/SplashScreen.jsx
// Splash screen — shows UniSiraj branding on app load
// Clean single logo with system info and loading dots

const SplashScreen = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 px-6"
      style={{
        backgroundColor: '#1B2D6B',
        animation: 'fadeOut 0.5s ease-in-out 2.5s forwards',
      }}
    >

      {/* ─── UniSiraj Logo — Big and Centered ──────────── */}
      <div
        className="flex flex-col items-center gap-3"
        style={{ animation: 'fadeInUp 0.8s ease-out forwards' }}
      >
        <img
          src="/logo.png"
          alt="UniSiraj"
          className="h-36 w-36 object-contain"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}
        />
        <p className="text-white text-lg font-extrabold tracking-widest">
          UNI<span style={{ color: '#E8A020' }}>SIRAJ</span>
        </p>
      </div>

      {/* ─── Gold Divider ───────────────────────────────── */}
      <div
        className="w-16 h-px opacity-60"
        style={{
          backgroundColor: '#E8A020',
          animation: 'fadeInUp 0.8s ease-out 0.2s both',
        }}
      />

      {/* ─── System Info ────────────────────────────────── */}
      <div
        className="text-center flex flex-col gap-2"
        style={{ animation: 'fadeInUp 0.8s ease-out 0.3s both' }}
      >
        {/* System Name */}
        <p
          className="text-base font-bold tracking-wide"
          style={{ color: '#E8A020' }}
        >
          Campus Facility Management System
        </p>

        {/* Full University Name */}
        <p className="text-white text-xs opacity-70 max-w-xs text-center leading-relaxed">
          Universiti Islam Antarabangsa Tuanku Syed Sirajuddin
        </p>
      </div>

      {/* ─── Loading Dots ───────────────────────────────── */}
      <div
        className="flex items-center gap-2 mt-2"
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
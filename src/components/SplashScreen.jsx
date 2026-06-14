// src/components/SplashScreen.jsx
// Splash screen — UniSiraj logo with Islamic pattern background

const SplashScreen = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 px-20"
      style={{
        backgroundColor:  '#dde3f0',
        backgroundImage:  'url(/background_login.jpg)',
        backgroundSize:   'auto',
        backgroundRepeat: 'repeat',
        animation:        'fadeOut 0.5s ease-in-out 2.5s forwards',
      }}
    >

      {/* ─── UniSiraj Logo — Big and Centered ──────────── */}
      <div
        className="flex flex-col items-center"
        style={{ animation: 'fadeInUp 0.8s ease-out forwards' }}
      >
        <img
          src="/logo.png"
          alt="UniSiraj"
          className="h-52 w-52 object-contain"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}
        />
      </div>

      {/* ─── Gold Divider ───────────────────────────────── */}
      <div
        className="w-20 h-0.5 opacity-60 rounded-full"
        style={{
          backgroundColor: '#E8A020',
          animation:        'fadeInUp 0.8s ease-out 0.5s both',
        }}
      />

      {/* ─── System Info ────────────────────────────────── */}
      <div
        className="text-center flex flex-col gap-1"
        style={{ animation: 'fadeInUp 0.8s ease-out 0.3s both' }}
      >
        {/* System Name */}
        <p
          className="text-base font-bold tracking-wide"
          style={{ color: '#1B2D6B' }}
        >
          Campus Facility Management System
        </p>

        {/* Full University Name */}
        <p
          className="text-xs max-w-xs text-center leading-relaxed"
          style={{ color: '#1B2D6B', opacity: 0.7 }}
        >
          Universiti Islam Antarabangsa Tuanku Syed Sirajuddin (UniSIRAJ)
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
              backgroundColor: '#1B2D6B',
              animation:        `bounceDot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

    </div>
  );
};

export default SplashScreen;
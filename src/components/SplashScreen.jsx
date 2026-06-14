// src/components/SplashScreen.jsx
// Splash screen — reordered layout with longer display time

const SplashScreen = () => {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 px-10"
      style={{
        backgroundColor:  '#dde3f0',
        backgroundImage:  'url(/background_login.jpg)',
        backgroundSize:   'auto',
        backgroundRepeat: 'repeat',
        animation:        'fadeOut 0.5s ease-in-out 2.5s forwards',
      }}
    >

      {/* ─── UniSiraj Logo ──────────────────────────────── */}
      <div
        style={{ animation: 'fadeInUp 0.8s ease-out forwards' }}
      >
        <img
          src="/logo.png"
          alt="UniSiraj"
          className="h-45 w-60 object-contain"
          style={{ animation: 'pulse 2s ease-in-out infinite' }}
        />
      </div>

      {/* ─── System Name ────────────────────────────────── */}
      <p
        className="text-lg font-bold tracking-wide text-center"
        style={{
          color:     '#1B2D6B',
          animation: 'fadeInUp 0.8s ease-out 0.4s both',
        }}
      >
        Campus Facility Management System
      </p>


      {/* ─── Gold Divider ───────────────────────────────── */}
      <div
        className="w-16 h-0.5 rounded-full"
        style={{
          backgroundColor: '#E8A020',
          opacity:          0.7,
          animation:        'fadeInUp 0.8s ease-out 0.3s both',
        }}
      />

            {/* ─── University Full Name ───────────────────────── */}
      <p
        className="text-xs text-center leading-relaxed"
        style={{
          color:     '#1B2D6B',
          opacity:   0.7,
          animation: 'fadeInUp 0.8s ease-out 0.2s both',
        }}
      >
        Universiti Islam Antarabangsa Tuanku Syed Sirajuddin 
        <p>(UniSIRAJ)</p>
      </p>


      {/* ─── Loading Dots ───────────────────────────────── */}
      <div
        className="flex items-center gap-2 mt-1"
        style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}
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
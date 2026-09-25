/**
 * WavyBackground — Animated watery/jiggly wave layers behind the landing page.
 *
 * Uses layered SVG wave paths with brand-colored gradients, CSS translateX
 * animation for horizontal drift, and an SVG feTurbulence displacement filter
 * for the organic, jiggly quality.
 */
function WavyBackground() {
  return (
    <div
      className="pointer-events-none select-none"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient fills using brand colors */}
          <linearGradient id="wg1" x1="0" y1="0" x2="1" y2="0.5">
            <stop offset="0%" stopColor="#7C5CFC" stopOpacity="0.18" />
            <stop offset="50%" stopColor="#4F8CFF" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#33D8D0" stopOpacity="0.10" />
          </linearGradient>

          <linearGradient id="wg2" x1="1" y1="0" x2="0" y2="0.6">
            <stop offset="0%" stopColor="#33D8D0" stopOpacity="0.14" />
            <stop offset="50%" stopColor="#7C5CFC" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#FF7AC6" stopOpacity="0.08" />
          </linearGradient>

          <linearGradient id="wg3" x1="0" y1="0.2" x2="1" y2="0.8">
            <stop offset="0%" stopColor="#4F8CFF" stopOpacity="0.12" />
            <stop offset="60%" stopColor="#7C5CFC" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#33D8D0" stopOpacity="0.06" />
          </linearGradient>

          <linearGradient id="wg4" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#FF7AC6" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#7C5CFC" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#4F8CFF" stopOpacity="0.14" />
          </linearGradient>

          {/* Subtle turbulence displacement for jiggly organic feel */}
          <filter id="jiggle" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.018"
              numOctaves="3"
              seed="2"
              result="turb"
            >
              <animate
                attributeName="seed"
                from="2"
                to="50"
                dur="20s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="turb"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* Wave layers — each path is 2x wide and animates horizontally */}
        <g filter="url(#jiggle)">
          {/* Layer 1 — top rolling hill, slow drift right */}
          <path fill="url(#wg1)">
            <animate
              attributeName="d"
              dur="14s"
              repeatCount="indefinite"
              values="
                M0 340 C180 260 360 380 540 310 C720 240 900 360 1080 300 C1260 240 1380 310 1440 280 L1440 0 L0 0 Z;
                M0 310 C180 380 360 260 540 340 C720 280 900 240 1080 330 C1260 280 1380 240 1440 310 L1440 0 L0 0 Z;
                M0 340 C180 260 360 380 540 310 C720 240 900 360 1080 300 C1260 240 1380 310 1440 280 L1440 0 L0 0 Z
              "
            />
          </path>

          {/* Layer 2 — mid wave, drifts opposite */}
          <path fill="url(#wg2)">
            <animate
              attributeName="d"
              dur="18s"
              repeatCount="indefinite"
              values="
                M0 480 C200 400 400 520 600 450 C800 380 1000 500 1200 440 C1350 400 1420 460 1440 430 L1440 0 L0 0 Z;
                M0 450 C200 520 400 400 600 480 C800 430 1000 380 1200 470 C1350 430 1420 400 1440 460 L1440 0 L0 0 Z;
                M0 480 C200 400 400 520 600 450 C800 380 1000 500 1200 440 C1350 400 1420 460 1440 430 L1440 0 L0 0 Z
              "
            />
          </path>

          {/* Layer 3 — lower wave, gentle sway */}
          <path fill="url(#wg3)">
            <animate
              attributeName="d"
              dur="22s"
              repeatCount="indefinite"
              values="
                M0 620 C240 560 480 660 720 600 C960 540 1200 640 1440 580 L1440 0 L0 0 Z;
                M0 590 C240 660 480 560 720 630 C960 580 1200 540 1440 610 L1440 0 L0 0 Z;
                M0 620 C240 560 480 660 720 600 C960 540 1200 640 1440 580 L1440 0 L0 0 Z
              "
            />
          </path>

          {/* Layer 4 — bottom horizon line, very slow */}
          <path fill="url(#wg4)">
            <animate
              attributeName="d"
              dur="26s"
              repeatCount="indefinite"
              values="
                M0 750 C360 700 720 780 1080 730 C1260 710 1380 740 1440 720 L1440 900 L0 900 Z;
                M0 730 C360 780 720 700 1080 750 C1260 730 1380 710 1440 740 L1440 900 L0 900 Z;
                M0 750 C360 700 720 780 1080 730 C1260 710 1380 740 1440 720 L1440 900 L0 900 Z
              "
            />
          </path>
        </g>
      </svg>

      {/* Soft radial glow accents */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,92,252,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "floatBlob1 16s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          right: "10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(51,216,208,0.10) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "floatBlob2 20s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "40%",
          width: "450px",
          height: "450px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,140,255,0.10) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "floatBlob3 18s ease-in-out infinite",
        }}
      />
    </div>
  );
}

export default WavyBackground;

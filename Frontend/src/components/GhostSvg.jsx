/**
 * GhostSvg — A cute ghost character as an inline SVG.
 *
 * Props:
 *   size      – overall height in px (default 90)
 *   eyeOffsetX, eyeOffsetY – pupil shift from center (clamped ±4px)
 */
function GhostSvg({ size = 90, eyeOffsetX = 0, eyeOffsetY = 0 }) {
  // Viewbox is designed at 120×140
  const aspectRatio = 120 / 140;
  const width = size * aspectRatio;

  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* Ghost body — white blob with 3 bumpy feet */}
      <path
        d="
          M60 8
          C28 8  10 32  10 62
          L10 105
          Q10 120  22 120
          Q32 120  32 108
          Q32 120  44 120
          Q56 120  56 108
          Q56 120  68 120
          Q80 120  80 108
          Q80 120  92 120
          Q104 120  104 108
          L104 105
          L104 62
          C104 32  86 8  60 8
          Z
        "
        fill="white"
      />

      {/* Left eye socket */}
      <ellipse cx="46" cy="58" rx="9" ry="12" fill="white" />
      {/* Left pupil */}
      <ellipse
        cx={46 + eyeOffsetX}
        cy={58 + eyeOffsetY}
        rx="5.5"
        ry="7.5"
        fill="#161B33"
      />

      {/* Right eye socket */}
      <ellipse cx="72" cy="58" rx="9" ry="12" fill="white" />
      {/* Right pupil */}
      <ellipse
        cx={72 + eyeOffsetX}
        cy={58 + eyeOffsetY}
        rx="5.5"
        ry="7.5"
        fill="#161B33"
      />
    </svg>
  );
}

export default GhostSvg;

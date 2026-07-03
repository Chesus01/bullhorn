// Original Black Bull artwork drawn as SVG — logo mark, hero art, and page backdrops.
// Inspired by the brand kit: black bull, neon green horns, red glowing eyes.

let uid = 0

export function BullHead({ size = 200, className = '', style, opacity = 1 }) {
  // Unique gradient/filter ids so multiple instances don't clash
  const id = `bull${++uid}`
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      style={{ opacity, ...style }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-horn`} x1="0" y1="1" x2="0.6" y2="0">
          <stop offset="0%" stopColor="#00b140" />
          <stop offset="55%" stopColor="#39ff14" />
          <stop offset="100%" stopColor="#14f195" />
        </linearGradient>
        <linearGradient id={`${id}-head`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#232323" />
          <stop offset="45%" stopColor="#121212" />
          <stop offset="100%" stopColor="#050505" />
        </linearGradient>
        <filter id={`${id}-glowG`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`${id}-glowR`} x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="3.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Horns */}
      <g filter={`url(#${id}-glowG)`}>
        <path
          d="M74 90 C50 86 32 68 24 32 C23 25 27 22 31 28 C42 54 55 72 82 79 C87 81 85 88 79 90 Z"
          fill={`url(#${id}-horn)`}
        />
        <path
          d="M126 90 C150 86 168 68 176 32 C177 25 173 22 169 28 C158 54 145 72 118 79 C113 81 115 88 121 90 Z"
          fill={`url(#${id}-horn)`}
        />
      </g>

      {/* Ears */}
      <path d="M62 92 L42 84 L64 106 Z" fill="#0c0c0c" />
      <path d="M138 92 L158 84 L136 106 Z" fill="#0c0c0c" />

      {/* Head */}
      <path
        d="M68 74 L100 66 L132 74 L148 98 L138 124 L120 162 L108 174 L92 174 L80 162 L62 124 L52 98 Z"
        fill={`url(#${id}-head)`}
        stroke="rgba(57,255,20,0.22)"
        strokeWidth="1.4"
      />
      {/* Brow ridge */}
      <path d="M70 96 L92 90 M130 96 L108 90" stroke="rgba(255,255,255,0.10)" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Forelock */}
      <path d="M88 68 L100 80 L112 68 L100 62 Z" fill="#0a0a0a" />

      {/* Eyes */}
      <g filter={`url(#${id}-glowR)`}>
        <path d="M72 104 L90 100 L88 110 L74 111 Z" fill="#ff1e1e" />
        <path d="M128 104 L110 100 L112 110 L126 111 Z" fill="#ff1e1e" />
      </g>
      <circle cx="81" cy="105" r="1.8" fill="#ffd0d0" />
      <circle cx="119" cy="105" r="1.8" fill="#ffd0d0" />

      {/* Muzzle */}
      <path d="M84 148 L100 142 L116 148 L110 166 L100 170 L90 166 Z" fill="#0a0a0a" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <ellipse cx="92" cy="156" rx="3.4" ry="4.6" fill="#030303" />
      <ellipse cx="108" cy="156" rx="3.4" ry="4.6" fill="#030303" />
      {/* Nose ring glint */}
      <path d="M94 168 A7 7 0 0 0 106 168" stroke="rgba(57,255,20,0.35)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

// The real brand bull artwork (background removed from the original render).
// Picks the smallest asset that stays sharp at the rendered height; the full
// 1129px bull-logo.png is kept for social/print use, not loaded in the UI.
export function BullImage({ height = 40, className = '', style }) {
  const src = height <= 100 ? '/bull-logo-256.png' : '/bull-logo-512.png'
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={className}
      style={{ height, width: 'auto', display: 'block', ...style }}
    />
  )
}

// Large, low-opacity backdrop bull for page edges. Pure decoration.
export function BullBackdrop({ side = 'right', opacity = 0.12, size = 460 }) {
  // Opacity lives on the wrapper: the horn-pulse animation animates the element's own
  // opacity, which would override an inline opacity set on the image itself.
  return (
    <div
      className={`bull-backdrop ${side}`}
      style={{ opacity, ...(side === 'left' ? { transform: 'scaleX(-1)' } : null) }}
    >
      <BullImage height={size * 0.8} className="horn-pulse" />
    </div>
  )
}

// Faint candlestick chart lines for background texture.
export function ChartLines({ opacity = 0.1, width = 420, height = 160, style }) {
  const candles = [
    [10, 60, 40, 100], [45, 40, 20, 70], [80, 70, 50, 115], [115, 30, 26, 60],
    [150, 55, 44, 96], [185, 22, 30, 52], [220, 48, 36, 86], [255, 30, 54, 66],
    [290, 62, 40, 104], [325, 18, 44, 46], [360, 40, 40, 78], [395, 12, 60, 36],
  ]
  return (
    <svg
      viewBox="0 0 420 160"
      width={width}
      height={height}
      style={{ opacity, position: 'absolute', pointerEvents: 'none', ...style }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {candles.map(([x, y, h, wickBottom], i) => (
        <g key={i} stroke={i % 3 === 2 ? '#ff1e1e' : '#39ff14'} fill={i % 3 === 2 ? '#ff1e1e' : '#39ff14'}>
          <line x1={x + 6} y1={y - 14} x2={x + 6} y2={wickBottom + 14} strokeWidth="1.5" opacity="0.7" />
          <rect x={x} y={y} width="12" height={h} rx="2" />
        </g>
      ))}
    </svg>
  )
}

import { smoothstep } from './useScrollProgress'

interface CorePlanetProps {
  progress: number
  stageProgress: {
    surface: number
    orbit: number
    labyrinth: number
    engineering: number
    launch: number
  }
}

/**
 * Persistent central core. Evolves through the scroll:
 *  - Surface: small distant gravity well
 *  - Orbit: emits orbital tracks
 *  - Labyrinth: gains nested spiral rings
 *  - Engineering: opens into a layered reactor
 *  - Launch: blooms / dissolves outward
 */
export default function CorePlanet({ progress, stageProgress }: CorePlanetProps) {
  const baseScale = 0.55 + 0.55 * smoothstep(progress)
  const launchBloom = 1 + 0.7 * smoothstep(stageProgress.launch)
  const scale = baseScale * (1 + 0.05 * Math.sin(progress * Math.PI * 4)) * launchBloom

  const innerR = 32 + 14 * stageProgress.engineering
  const ringOpacity = (s: number) => Math.min(1, 0.25 + s * 0.9)
  const baseRot = progress * 360

  return (
    <div
      className="absolute inset-0 grid place-items-center pointer-events-none z-[3]"
      aria-hidden="true"
    >
      <div
        className="relative"
        style={{
          width: 'min(90vmin, 720px)',
          height: 'min(90vmin, 720px)',
          transform: `scale(${scale})`,
          transition: 'transform 60ms linear',
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="-200 -200 400 400"
          className="absolute inset-0 w-full h-full"
          style={{
            filter: `drop-shadow(0 0 ${24 + 40 * stageProgress.engineering}px rgba(0,240,255,${0.18 + 0.3 * stageProgress.engineering})) drop-shadow(0 0 ${30 + 60 * stageProgress.launch}px rgba(112,0,255,${0.1 + 0.4 * stageProgress.launch}))`,
          }}
        >
          <defs>
            <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#7000FF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#05050A" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="core-hot" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#00F0FF" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ring-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#7000FF" stopOpacity="0.6" />
            </linearGradient>
            <filter id="soft-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          <circle cx="0" cy="0" r="180" fill="url(#core-glow)" opacity={0.55} />

          <g
            transform={`rotate(${baseRot * 0.2})`}
            opacity={ringOpacity(stageProgress.orbit)}
          >
            <ellipse cx="0" cy="0" rx="170" ry="58" fill="none" stroke="url(#ring-stroke)" strokeWidth="0.7" opacity="0.7" />
            <ellipse cx="0" cy="0" rx="170" ry="58" fill="none" stroke="#00F0FF" strokeWidth="0.4" strokeDasharray="2 6" opacity="0.4" transform="rotate(35)" />
          </g>

          <g transform={`rotate(${-baseRot * 0.3})`} opacity={ringOpacity(stageProgress.orbit)}>
            <ellipse cx="0" cy="0" rx="150" ry="44" fill="none" stroke="#7000FF" strokeWidth="0.6" opacity="0.5" transform="rotate(-25)" />
          </g>

          <g transform={`rotate(${baseRot * 0.5})`} opacity={stageProgress.labyrinth * 0.9}>
            {[120, 96, 76, 60].map((r, i) => (
              <circle
                key={r}
                cx="0"
                cy="0"
                r={r}
                fill="none"
                stroke="#00F0FF"
                strokeWidth="0.5"
                strokeDasharray={`${20 + i * 6} ${10 + i * 3}`}
                opacity={0.35 + i * 0.1}
              />
            ))}
          </g>

          <g opacity={stageProgress.engineering}>
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2 + baseRot * 0.01
              const r1 = 44
              const r2 = 56
              return (
                <line
                  key={i}
                  x1={Math.cos(a) * r1}
                  y1={Math.sin(a) * r1}
                  x2={Math.cos(a) * r2}
                  y2={Math.sin(a) * r2}
                  stroke="#00F0FF"
                  strokeWidth="1.6"
                  opacity="0.85"
                  strokeLinecap="round"
                />
              )
            })}
          </g>

          <circle cx="0" cy="0" r={innerR} fill="url(#core-hot)" opacity={0.95} />
          <circle cx="0" cy="0" r={innerR * 0.55} fill="#ffffff" opacity={0.5 + 0.4 * stageProgress.launch} filter="url(#soft-blur)" />

          <g opacity={stageProgress.launch}>
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2
              const r1 = innerR + 4
              const r2 = innerR + 4 + 90 * stageProgress.launch
              return (
                <line
                  key={i}
                  x1={Math.cos(a) * r1}
                  y1={Math.sin(a) * r1}
                  x2={Math.cos(a) * r2}
                  y2={Math.sin(a) * r2}
                  stroke="#ffffff"
                  strokeWidth="0.6"
                  opacity={0.7}
                  strokeLinecap="round"
                />
              )
            })}
          </g>
        </svg>
      </div>
    </div>
  )
}

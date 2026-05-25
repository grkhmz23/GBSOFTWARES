import { smoothstep } from './useScrollProgress'

const steps = [
  'Strategy',
  'Architecture',
  'UI / UX',
  'Backend',
  'Smart Contracts',
  'Testing',
  'Deployment',
  'Iteration',
]

interface Props {
  local: number
}

export default function LabyrinthStage({ local }: Props) {
  const entry = smoothstep(Math.min(1, local * 1.4))
  const exit = smoothstep(Math.max(0, local * 1.4 - 0.6))
  const visibility = entry * (1 - exit)

  // Active step index — moves around the ring as we scroll
  const active = Math.min(steps.length - 1, Math.floor(local * steps.length))

  const angleOffset = local * 30 // gentle precession

  return (
    <div
      className="absolute inset-0 pointer-events-none z-[5]"
      style={{ opacity: visibility }}
      aria-hidden={visibility < 0.05}
    >
      {/* Labyrinth nodes — placed evenly around a circle */}
      {steps.map((step, i) => {
        const a =
          (i / steps.length) * Math.PI * 2 + (angleOffset * Math.PI) / 180 - Math.PI / 2
        const r = 38 + (1 - entry) * 18 // vmin
        const x = Math.cos(a) * r
        const y = Math.sin(a) * r * 0.62
        const isActive = i === active
        return (
          <div
            key={step}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(calc(-50% + ${x}vmin), calc(-50% + ${y}vmin))`,
              transition: 'transform 90ms linear',
            }}
          >
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-full border backdrop-blur-md transition-all duration-300 ${
                isActive
                  ? 'border-cyan/60 bg-cyan/10 text-cyan shadow-[0_0_24px_rgba(0,240,255,0.35)]'
                  : 'border-white/10 bg-black/40 text-text-muted'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  isActive ? 'bg-cyan' : 'bg-white/30'
                }`}
              />
              <span className="text-[11px] font-mono uppercase tracking-wider whitespace-nowrap">
                {step}
              </span>
            </div>
          </div>
        )
      })}

      {/* Connecting beam from active node into the core */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="-100 -100 200 200"
        preserveAspectRatio="xMidYMid meet"
      >
        {(() => {
          const a =
            (active / steps.length) * Math.PI * 2 +
            (angleOffset * Math.PI) / 180 -
            Math.PI / 2
          const rs = 35
          const x = Math.cos(a) * rs
          const y = Math.sin(a) * rs * 0.62
          return (
            <line
              x1={x}
              y1={y}
              x2={0}
              y2={0}
              stroke="#00F0FF"
              strokeWidth="0.4"
              strokeDasharray="1 2"
              opacity={0.8}
            />
          )
        })()}
      </svg>
    </div>
  )
}

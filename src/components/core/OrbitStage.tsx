import { Globe, Boxes, Smartphone, Monitor, Brain, Rocket } from 'lucide-react'
import { smoothstep } from './useScrollProgress'

const services = [
  { icon: Globe, label: 'Web Apps', sub: 'Production-grade React, Next.js, real-time' },
  { icon: Boxes, label: 'Blockchain', sub: 'Solana, EVM, smart contracts, indexers' },
  { icon: Smartphone, label: 'Mobile Apps', sub: 'iOS, Android, cross-platform' },
  { icon: Monitor, label: 'Desktop Apps', sub: 'Native-feel macOS / Windows tools' },
  { icon: Brain, label: 'AI Products', sub: 'Agents, copilots, automation pipes' },
  { icon: Rocket, label: 'MVP → Prod', sub: 'From sketch to launched system' },
]

interface Props {
  /** Local progress 0-1 within the orbit window. */
  local: number
}

export default function OrbitStage({ local }: Props) {
  // Cards fly in from outside, then dissolve outward at the end
  const entry = smoothstep(Math.min(1, local * 1.6))
  const exit = smoothstep(Math.max(0, local * 1.6 - 0.6))
  const visibility = entry * (1 - exit)

  // Radius and rotation animate
  const radiusVmin = 30 + 4 * Math.sin(local * Math.PI)
  const baseAngle = local * 60 // degrees

  return (
    <div
      className="absolute inset-0 pointer-events-none z-[5]"
      aria-hidden={visibility < 0.05}
      style={{ opacity: visibility }}
    >
      {services.map((s, i) => {
        const a = (i / services.length) * Math.PI * 2 + (baseAngle * Math.PI) / 180
        // Cards start far out and pull inward
        const r = (radiusVmin + (1 - entry) * 35) // vmin
        const x = Math.cos(a) * r
        const y = Math.sin(a) * r * 0.55 // slightly flattened orbit
        const scale = 0.7 + 0.3 * entry

        const Icon = s.icon
        return (
          <div
            key={s.label}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              transform: `translate(calc(-50% + ${x}vmin), calc(-50% + ${y}vmin)) scale(${scale})`,
              transition: 'transform 80ms linear, opacity 80ms linear',
              willChange: 'transform',
            }}
          >
            <div
              className="group relative w-[170px] sm:w-[200px] rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-4 shadow-[0_8px_40px_rgba(0,240,255,0.06)] pointer-events-auto"
              style={{
                background: 'linear-gradient(160deg, rgba(0,240,255,0.06), rgba(112,0,255,0.06) 60%, rgba(5,5,10,0.6))',
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="w-9 h-9 rounded-xl bg-cyan/10 border border-cyan/30 grid place-items-center text-cyan">
                  <Icon className="w-4 h-4" />
                </span>
                <span className="font-heading font-semibold text-white text-sm tracking-wide">
                  {s.label}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-text-muted">{s.sub}</p>
              <span
                aria-hidden="true"
                className="absolute -inset-px rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(0,240,255,0.5), rgba(112,0,255,0.5))',
                  WebkitMask:
                    'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                  WebkitMaskComposite: 'xor',
                  padding: '1px',
                  borderRadius: 'inherit',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

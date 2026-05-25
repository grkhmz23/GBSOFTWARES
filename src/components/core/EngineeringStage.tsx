import { Code2, Server, Hexagon, Smartphone, Sparkles } from 'lucide-react'
import { smoothstep } from './useScrollProgress'

const clusters = [
  {
    icon: Code2,
    title: 'Frontend',
    items: ['React 19', 'Next.js', 'TypeScript', 'Tailwind', 'GSAP'],
    angle: -90,
  },
  {
    icon: Server,
    title: 'Backend',
    items: ['Node.js', 'APIs', 'Postgres', 'Auth', 'Payments'],
    angle: -18,
  },
  {
    icon: Hexagon,
    title: 'Blockchain',
    items: ['Solana / Rust', 'EVM / Solidity', 'Anchor', 'Wallets', 'Indexers'],
    angle: 54,
  },
  {
    icon: Smartphone,
    title: 'Mobile · Desktop',
    items: ['iOS', 'Android', 'macOS tools', 'Cross-platform'],
    angle: 126,
  },
  {
    icon: Sparkles,
    title: 'AI Layer',
    items: ['Agent workflows', 'Copilots', 'Automation', 'LLM tooling'],
    angle: 198,
  },
]

interface Props {
  local: number
}

export default function EngineeringStage({ local }: Props) {
  const entry = smoothstep(Math.min(1, local * 1.3))
  const exit = smoothstep(Math.max(0, local * 1.6 - 0.7))
  const visibility = entry * (1 - exit)

  return (
    <div
      className="absolute inset-0 pointer-events-none z-[6]"
      style={{ opacity: visibility }}
      aria-hidden={visibility < 0.05}
    >
      {clusters.map((c, i) => {
        const a = ((c.angle + local * 8) * Math.PI) / 180
        const r = 36 + (1 - entry) * 20 // vmin
        const x = Math.cos(a) * r
        const y = Math.sin(a) * r * 0.6
        const Icon = c.icon
        return (
          <div
            key={c.title}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(calc(-50% + ${x}vmin), calc(-50% + ${y}vmin))`,
              transition: 'transform 90ms linear',
              transitionDelay: `${i * 20}ms`,
            }}
          >
            <div
              className="w-[210px] sm:w-[230px] rounded-2xl border border-cyan/15 bg-black/55 backdrop-blur-xl p-4 pointer-events-auto shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
              style={{
                background:
                  'linear-gradient(165deg, rgba(0,240,255,0.07), rgba(112,0,255,0.04) 65%, rgba(5,5,10,0.65))',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/30 grid place-items-center text-cyan">
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <h3 className="font-heading font-semibold text-white text-sm">
                  {c.title}
                </h3>
              </div>
              <ul className="space-y-1.5">
                {c.items.map((it) => (
                  <li
                    key={it}
                    className="flex items-center gap-2 text-[11px] text-text-muted font-mono"
                  >
                    <span className="w-1 h-1 rounded-full bg-cyan/60" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      })}
    </div>
  )
}

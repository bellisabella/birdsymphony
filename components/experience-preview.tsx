import { ArrowUpRight } from 'lucide-react'

import { ParticleField } from '@/components/particle-field'

const waveBars = Array.from({ length: 48 }, (_, i) => {
  const t = i / 47
  const envelope = Math.sin(t * Math.PI)
  const ripple = 0.55 + 0.45 * Math.abs(Math.sin(i * 1.7))
  return Math.round((0.15 + envelope * ripple * 0.85) * 100)
})

const orbitDots = [
  { angle: 20, ring: 0 },
  { angle: 140, ring: 0 },
  { angle: 260, ring: 0 },
  { angle: 75, ring: 1 },
  { angle: 210, ring: 1 },
  { angle: 330, ring: 1 },
  { angle: 0, ring: 2 },
  { angle: 120, ring: 2 },
  { angle: 240, ring: 2 },
]

const rings = ['inset-[30%]', 'inset-[18%]', 'inset-[6%]']

const species = [
  { name: '画眉', latin: 'Garrulax canorus', freq: '2.1 – 4.8 kHz' },
  { name: '白头鹎', latin: 'Pycnonotus sinensis', freq: '1.8 – 3.6 kHz' },
  { name: '大山雀', latin: 'Parus minor', freq: '3.2 – 7.5 kHz' },
]

export function ExperiencePreview() {
  return (
    <section id="explore" className="relative overflow-hidden px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="mb-4 text-xs tracking-[0.4em] text-primary/80 uppercase">02 — Immerse</p>
            <h2 className="font-serif text-4xl leading-tight font-light text-balance md:text-6xl">
              A Universe Woven from Birdsong
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-base">
            每一声鸣叫都会化作光点。频率决定高度，音色决定颜色，节奏决定它们如何在林间漂浮。
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-[radial-gradient(ellipse_at_center,oklch(0.24_0.05_158),var(--background)_75%)]">
          <ParticleField count={70} seed={23} />

          <div className="relative grid items-center gap-10 p-6 md:grid-cols-5 md:p-12">
            <div className="relative mx-auto aspect-square w-full max-w-md md:col-span-3" aria-hidden="true">
              <div className="absolute inset-[38%] animate-breathe rounded-full bg-primary/25 blur-2xl" />
              <div className="absolute inset-[44%] rounded-full bg-glow shadow-[0_0_60px_10px_oklch(0.86_0.16_150/0.45)]" />

              {rings.map((inset, ringIndex) => (
                <div
                  key={inset}
                  className={`absolute ${inset} animate-orbit rounded-full border border-primary/15`}
                  style={{
                    animationDuration: `${40 + ringIndex * 25}s`,
                    animationDirection: ringIndex % 2 ? 'reverse' : 'normal',
                  }}
                >
                  {orbitDots
                    .filter((d) => d.ring === ringIndex)
                    .map((d) => (
                      <span
                        key={d.angle}
                        className="absolute inset-0"
                        style={{ transform: `rotate(${d.angle}deg)` }}
                      >
                        <span className="absolute top-0 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow shadow-[0_0_14px_3px_oklch(0.86_0.16_150/0.5)]" />
                      </span>
                    ))}
                </div>
              ))}

              <div className="absolute inset-x-0 bottom-0 flex h-20 items-end justify-center gap-[3px]">
                {waveBars.map((h, i) => (
                  <span
                    key={i}
                    className="w-[3px] origin-bottom animate-wave rounded-full bg-gradient-to-t from-primary/10 to-primary/80"
                    style={{ height: `${h}%`, animationDelay: `-${(i % 12) * 0.2}s` }}
                  />
                ))}
              </div>
            </div>

            <div className="relative md:col-span-2">
              <ul className="flex flex-col gap-3">
                {species.map((s) => (
                  <li
                    key={s.latin}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/50 px-5 py-4 backdrop-blur-md"
                  >
                    <div>
                      <p className="font-serif text-xl">{s.name}</p>
                      <p className="text-xs text-muted-foreground italic">{s.latin}</p>
                    </div>
                    <span className="font-mono text-xs text-primary">{s.freq}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#upload"
                className="group mt-8 inline-flex w-full items-center justify-between gap-3 rounded-full bg-primary py-2 pr-2 pl-7 text-sm font-medium text-primary-foreground shadow-[0_0_40px_-10px_var(--glow)] transition-shadow hover:shadow-[0_0_56px_-6px_var(--glow)]"
              >
                Explore the Sound Universe
                <span className="flex size-10 items-center justify-center rounded-full bg-primary-foreground text-primary transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </span>
              </a>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                3D 粒子体验即将上线 · Visual preview
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

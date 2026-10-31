import { cn } from '@/lib/utils'

type Particle = {
  top: number
  left: number
  size: number
  delay: number
  duration: number
}

// Seeded pseudo-random so server and client render identical particles.
function createParticles(count: number, seed: number): Particle[] {
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  return Array.from({ length: count }, () => ({
    top: rand() * 100,
    left: rand() * 100,
    size: 1 + rand() * 3,
    delay: rand() * 8,
    duration: 3 + rand() * 5,
  }))
}

export function ParticleField({
  count = 40,
  seed = 7,
  className,
}: {
  count?: number
  seed?: number
  className?: string
}) {
  const particles = createParticles(count, seed)

  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute animate-drift"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            animationDelay: `-${p.delay}s`,
            animationDuration: `${p.duration * 3}s`,
          }}
        >
          <span
            className="block animate-twinkle rounded-full bg-glow"
            style={{
              width: p.size,
              height: p.size,
              boxShadow: `0 0 ${p.size * 4}px ${p.size}px oklch(0.86 0.16 150 / 0.35)`,
              animationDelay: `-${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        </span>
      ))}
    </div>
  )
}

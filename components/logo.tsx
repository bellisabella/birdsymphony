import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn('size-8 text-primary', className)}
    >
      <path
        d="M5 18c3.5-6 8-8 12-6.5 2.4.9 3.6 2.7 5.6 2.7 1.6 0 3-.8 4.4-2.2-.6 4.6-3.6 7.6-8 7.6-2.7 0-4.4-1.3-6.6-1.3-2.6 0-4.8 1-7.4-.3Z"
        fill="currentColor"
        fillOpacity="0.9"
      />
      <path
        d="M4 24h2M8.5 24v0M10 22.5v3M13 21v6M16 22v4M19 20.5v7M22 22.5v3M25 23.5v1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
      <circle cx="21.5" cy="12.4" r="0.9" fill="var(--background)" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="font-serif text-lg font-medium tracking-[0.28em] text-foreground">
        BIRD SYMPHONY
      </span>
    </span>
  )
}

'use client'

import type { KeyboardEvent, PointerEvent } from 'react'

import { cn } from '@/lib/utils'

interface WaveformProps {
  peaks?: number[]
  color: string
  duration: number
  scaleDuration: number
  position: number
  hoverTime: number | null
  onHoverTime?: (time: number | null) => void
  onSeek?: (time: number) => void
  label: string
  height?: number
  active?: boolean
}

function Bars({ peaks, fill }: { peaks: number[]; fill: string }) {
  const gap = 0.35
  return (
    <svg viewBox={`0 0 ${peaks.length} 100`} preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
      {peaks.map((p, i) => {
        const h = p * 92
        return <rect key={i} x={i + gap / 2} y={50 - h / 2} width={1 - gap} height={h} rx={0.3} fill={fill} />
      })}
    </svg>
  )
}

export function Waveform({
  peaks,
  color,
  duration,
  scaleDuration,
  position,
  hoverTime,
  onHoverTime,
  onSeek,
  label,
  height = 72,
  active,
}: WaveformProps) {
  const widthPct = (duration / scaleDuration) * 100
  const progressPct = Math.min(100, (position / duration) * 100)
  const guideVisible = hoverTime !== null && hoverTime <= duration
  const guidePct = hoverTime !== null ? (hoverTime / scaleDuration) * 100 : 0

  const timeFromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    return ratio * duration
  }

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') onSeek?.(Math.min(duration, position + 1))
    else if (e.key === 'ArrowLeft') onSeek?.(Math.max(0, position - 1))
    else return
    e.preventDefault()
  }

  return (
    <div className="relative w-full" style={{ height }}>
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-border/60" aria-hidden="true" />
      <div
        role="slider"
        tabIndex={0}
        aria-label={`${label} 播放进度`}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)} 秒，共 ${Math.round(duration)} 秒`}
        onKeyDown={handleKey}
        onPointerMove={(e) => onHoverTime?.(timeFromPointer(e))}
        onPointerLeave={() => onHoverTime?.(null)}
        onPointerDown={(e) => onSeek?.(timeFromPointer(e))}
        className="absolute inset-y-0 left-0 cursor-pointer rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        style={{ width: `${widthPct}%` }}
      >
        {peaks ? (
          <>
            <Bars peaks={peaks} fill="color-mix(in oklch, var(--foreground) 18%, transparent)" />
            <div
              className="absolute inset-0 transition-[clip-path] duration-75"
              style={{
                clipPath: `inset(0 ${100 - progressPct}% 0 0)`,
                filter: active ? `drop-shadow(0 0 6px ${color})` : undefined,
              }}
            >
              <Bars peaks={peaks} fill={color} />
            </div>
            {position > 0 && (
              <span
                className="pointer-events-none absolute inset-y-1 w-px"
                style={{ left: `${progressPct}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                aria-hidden="true"
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center gap-[3px]" aria-hidden="true">
            {Array.from({ length: 48 }).map((_, i) => (
              <span
                key={i}
                className="flex-1 animate-pulse rounded-full bg-muted"
                style={{ height: `${20 + ((i * 37) % 50)}%`, animationDelay: `${(i % 8) * 90}ms` }}
              />
            ))}
          </div>
        )}
      </div>

      <span
        className={cn(
          'pointer-events-none absolute -inset-y-2 w-px bg-foreground/50 transition-opacity',
          guideVisible ? 'opacity-100' : 'opacity-0',
        )}
        style={{ left: `${guidePct}%` }}
        aria-hidden="true"
      />
    </div>
  )
}

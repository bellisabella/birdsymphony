'use client'

import { useState } from 'react'

import { RecordingRow } from '@/components/atlas/recording-row'
import { formatDuration, RECORDING_COLORS, type Recording, type VoiceProfile } from '@/lib/atlas-data'
import { cn } from '@/lib/utils'

interface ComparisonBoardProps {
  recordings: Recording[]
  profile: VoiceProfile
  highlightedId: string | null
  onFocusRecording: (id: string | null) => void
}

export function ComparisonBoard({ recordings, profile, highlightedId, onFocusRecording }: ComparisonBoardProps) {
  const [aligned, setAligned] = useState(true)
  const [hoverTime, setHoverTime] = useState<number | null>(null)
  const maxDuration = Math.max(...recordings.map((r) => r.duration))
  const ticks = Array.from({ length: Math.floor(maxDuration / 5) + 1 }, (_, i) => i * 5)

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {`${recordings.length} 段录音 · 悬停波形可在所有录音上同步定位同一时刻`}
        </p>
        <div role="group" aria-label="时间轴模式" className="inline-flex rounded-full border border-border p-1 text-xs">
          {[
            { value: true, label: '统一时间轴' },
            { value: false, label: '各自铺满' },
          ].map((opt) => (
            <button
              key={opt.label}
              type="button"
              aria-pressed={aligned === opt.value}
              onClick={() => setAligned(opt.value)}
              className={cn(
                'rounded-full px-4 py-1.5 transition-colors',
                aligned === opt.value ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {aligned && (
        <div className="mb-3 hidden md:grid md:grid-cols-[17rem_1fr] md:gap-8 md:px-6" aria-hidden="true">
          <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">Timeline</span>
          <div className="relative h-4">
            {ticks.map((t) => (
              <span
                key={t}
                className="absolute top-0 -translate-x-1/2 font-mono text-[10px] text-muted-foreground"
                style={{ left: `${(t / maxDuration) * 100}%` }}
              >
                {formatDuration(t)}
              </span>
            ))}
            {hoverTime !== null && (
              <span
                className="absolute -top-0.5 -translate-x-1/2 rounded bg-foreground px-1.5 font-mono text-[10px] text-background"
                style={{ left: `${(hoverTime / maxDuration) * 100}%` }}
              >
                {formatDuration(hoverTime)}
              </span>
            )}
          </div>
        </div>
      )}

      <ol className="flex flex-col gap-3">
        {recordings.map((rec, i) => (
          <RecordingRow
            key={rec.id}
            recording={rec}
            profile={profile}
            color={RECORDING_COLORS[i % RECORDING_COLORS.length]}
            index={i}
            scaleDuration={aligned ? maxDuration : rec.duration}
            hoverTime={hoverTime}
            onHoverTime={setHoverTime}
            highlighted={highlightedId === rec.id}
            onFocusRecording={onFocusRecording}
          />
        ))}
      </ol>
    </div>
  )
}

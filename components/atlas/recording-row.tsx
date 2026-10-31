'use client'

import { Film, MapPin, Mic, Pause, Play } from 'lucide-react'

import { Waveform } from '@/components/atlas/waveform'
import { formatCoords, formatDate, formatDuration, type Recording, type VoiceProfile } from '@/lib/atlas-data'
import { pause, play, seek, usePlaybackPosition, useRenderedRecording } from '@/lib/audio-engine'
import { cn } from '@/lib/utils'

interface RecordingRowProps {
  recording: Recording
  profile: VoiceProfile
  color: string
  index: number
  scaleDuration: number
  hoverTime: number | null
  onHoverTime: (time: number | null) => void
  highlighted: boolean
  onFocusRecording: (id: string | null) => void
}

export function RecordingRow({
  recording,
  profile,
  color,
  index,
  scaleDuration,
  hoverTime,
  onHoverTime,
  highlighted,
  onFocusRecording,
}: RecordingRowProps) {
  const { data } = useRenderedRecording(recording, profile)
  const { position, isPlaying } = usePlaybackPosition(recording.id)
  const SourceIcon = recording.source.kind === 'video' ? Film : Mic

  const toggle = () => {
    if (!data) return
    if (isPlaying) pause()
    else play(recording.id, data.buffer)
  }

  return (
    <li
      id={`recording-${recording.id}`}
      onMouseEnter={() => onFocusRecording(recording.id)}
      onMouseLeave={() => onFocusRecording(null)}
      className={cn(
        'group relative grid gap-5 rounded-3xl border bg-card/40 p-5 transition-all md:grid-cols-[17rem_1fr] md:items-center md:gap-8 md:p-6',
        isPlaying || highlighted ? 'border-transparent bg-card/70' : 'border-border/60',
      )}
      style={
        isPlaying || highlighted
          ? { boxShadow: `inset 0 0 0 1px ${color}55, 0 0 40px -18px ${color}` }
          : undefined
      }
    >
      <span
        className="absolute inset-y-6 left-0 w-[3px] rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }}
        aria-hidden="true"
      />

      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={toggle}
          disabled={!data}
          aria-label={isPlaying ? `暂停 ${recording.title}` : `播放 ${recording.title}`}
          className="flex size-12 shrink-0 items-center justify-center rounded-full border transition-all disabled:opacity-40"
          style={{
            borderColor: `${color}80`,
            color,
            backgroundColor: isPlaying ? `${color}22` : 'transparent',
            boxShadow: isPlaying ? `0 0 24px -4px ${color}` : undefined,
          }}
        >
          {isPlaying ? <Pause className="size-5" /> : <Play className="size-5 translate-x-px" />}
        </button>

        <div className="min-w-0">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color }}>
            {`Voice ${String(index + 1).padStart(2, '0')}`}
          </p>
          <h3 className="mt-1 truncate font-serif text-xl leading-tight">{recording.title}</h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{`${recording.country} · ${recording.region}`}</span>
          </p>
        </div>
      </div>

      <div className="min-w-0">
        <Waveform
          peaks={data?.peaks}
          color={color}
          duration={recording.duration}
          scaleDuration={scaleDuration}
          position={position}
          hoverTime={hoverTime}
          onHoverTime={onHoverTime}
          onSeek={(t) => data && seek(recording.id, data.buffer, t)}
          label={recording.title}
          active={isPlaying}
        />
        <dl className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
          <div className="flex gap-1.5">
            <dt className="sr-only">时长</dt>
            <dd className="font-mono text-foreground">
              {`${formatDuration(position)} / ${formatDuration(recording.duration)}`}
            </dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="sr-only">日期</dt>
            <dd>{`${formatDate(recording.date)} ${recording.time}`}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="sr-only">环境</dt>
            <dd>{recording.environment}</dd>
          </div>
          <div className="hidden gap-1.5 lg:flex">
            <dt className="sr-only">坐标</dt>
            <dd className="font-mono">{formatCoords(recording.lat, recording.lng)}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="sr-only">来源</dt>
            <dd className="flex items-center gap-1.5">
              <SourceIcon className="size-3.5" aria-hidden="true" />
              {`${recording.source.kind === 'video' ? '视频音轨' : '现场录音'} · ${recording.source.recordist}`}
            </dd>
          </div>
        </dl>
      </div>
    </li>
  )
}

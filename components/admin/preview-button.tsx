'use client'

import { Loader2, Pause, Play } from 'lucide-react'
import { useRef, useState } from 'react'

import type { Recording, VoiceProfile } from '@/lib/atlas-data'
import { pause, play, usePlaybackState, useRenderedRecording } from '@/lib/audio-engine'

function SynthPreview({ recording, profile }: { recording: Recording; profile: VoiceProfile }) {
  const { data } = useRenderedRecording(recording, profile)
  const { playingId } = usePlaybackState()
  const isPlaying = playingId === recording.id

  return (
    <button
      type="button"
      disabled={!data}
      onClick={() => (isPlaying ? pause() : data && play(recording.id, data.buffer))}
      aria-label={isPlaying ? `暂停预览 ${recording.title}` : `预览 ${recording.title}`}
      className="inline-flex size-8 items-center justify-center rounded-full border border-primary/40 text-primary transition-all hover:bg-primary/10 disabled:opacity-40 data-[playing=true]:bg-primary/15 data-[playing=true]:shadow-[0_0_14px_-2px_var(--glow)]"
      data-playing={isPlaying}
    >
      {!data ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : isPlaying ? (
        <Pause className="size-3.5" />
      ) : (
        <Play className="size-3.5 translate-x-px" />
      )}
    </button>
  )
}

function FilePreview({ recording }: { recording: Recording }) {
  const ref = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    const el = ref.current
    if (!el) return
    if (playing) el.pause()
    else {
      pause()
      void el.play()
    }
  }

  return (
    <>
      <audio
        ref={ref}
        src={recording.mediaUrl}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `暂停 ${recording.title}` : `播放上传的音频 ${recording.title}`}
        className="inline-flex size-8 items-center justify-center rounded-full border border-primary/40 text-primary hover:bg-primary/10"
      >
        {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5 translate-x-px" />}
      </button>
    </>
  )
}

export function PreviewButton({ recording, profile }: { recording: Recording; profile: VoiceProfile }) {
  return recording.mediaUrl ? <FilePreview recording={recording} /> : <SynthPreview recording={recording} profile={profile} />
}

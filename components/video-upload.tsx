'use client'

import { AudioLines, CheckCircle2, Film, Sparkles, Upload, X, Volume2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

const ACCEPTED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm']
const ACCEPTED_EXTENSIONS = ['.mp4', '.mov', '.webm']
const MAX_FILE_SIZE = 100 * 1024 * 1024

type AudioLevels = { bass: number; mid: number; treble: number }
const ZERO_LEVELS: AudioLevels = { bass: 0, mid: 0, treble: 0 }

function isAcceptedVideo(file: File) {
  const name = file.name.toLowerCase()
  return ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext))
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${String(secs).padStart(2, '0')}`
}

export function VideoUpload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const animationRef = useRef<number | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [levels, setLevels] = useState<AudioLevels>(ZERO_LEVELS)
  const [audioReady, setAudioReady] = useState(false)

  const stopAnalysis = useCallback(() => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current)
    animationRef.current = null
    setLevels(ZERO_LEVELS)
  }, [])

  const startAnalysis = useCallback(() => {
    const analyser = analyserRef.current
    if (!analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    const sampleBand = (from: number, to: number) => {
      let total = 0
      let count = 0
      for (let i = from; i < Math.min(to, data.length); i++) {
        total += data[i]
        count++
      }
      return count ? Math.min(100, (total / count / 255) * 150) : 0
    }
    const tick = () => {
      analyser.getByteFrequencyData(data)
      setLevels({
        bass: sampleBand(1, 8),
        mid: sampleBand(8,  fortyEight),
        treble: sampleBand(48, 180),
      })
      animationRef.current = requestAnimationFrame(tick)
    }
    const fortyEight = 48
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current)
    tick()
  }, [])

  const connectAudio = useCallback(async () => {
    const video = videoRef.current
    if (!video) return
    try {
      let context = audioContextRef.current
      if (!context) {
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        if (!AudioContextClass) throw new Error('当前浏览器不支持 Web Audio API。')
        context = new AudioContextClass()
        audioContextRef.current = context
        const source = context.createMediaElementSource(video)
        const analyser = context.createAnalyser()
        analyser.fftSize = 512
        analyser.smoothingTimeConstant = 0.82
        source.connect(analyser)
        analyser.connect(context.destination)
        sourceRef.current = source
        analyserRef.current = analyser
      }
      if (context.state === 'suspended') await context.resume()
      setAudioReady(true)
      startAnalysis()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '无法启动音频分析，请尝试其他视频。')
    }
  }, [startAnalysis])

  useEffect(() => {
    return () => {
      stopAnalysis()
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        void audioContextRef.current.close()
      }
      audioContextRef.current = null
      analyserRef.current = null
      sourceRef.current = null
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl, stopAnalysis])

  function handleFile(next: File | undefined) {
    if (!next) return
    if (!isAcceptedVideo(next)) {
      setError('暂不支持该格式，请上传 MP4、MOV 或 WEBM 视频。')
      return
    }
    if (next.size > MAX_FILE_SIZE) {
      setError('视频不能超过 100 MB，请选择较小的文件。')
      return
    }
    setError(null)
    setFile(next)
    setDuration(0)
    setCurrentTime(0)
    setIsPlaying(false)
    setAudioReady(false)
    setPreviewUrl(URL.createObjectURL(next))
  }

  function clearFile() {
    stopAnalysis()
    setFile(null)
    setPreviewUrl(null)
    setError(null)
    setDuration(0)
    setCurrentTime(0)
    setIsPlaying(false)
    setAudioReady(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  function seekTo(value: number) {
    const video = videoRef.current
    if (!video || !Number.isFinite(duration)) return
    video.currentTime = value
    setCurrentTime(value)
  }

  function changeVolume(value: number) {
    setVolume(value)
    if (videoRef.current) videoRef.current.volume = value
  }

  return (
    <section id="upload" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-4 text-xs tracking-[0.4em] text-primary/80 uppercase">01 — Record</p>
          <h2 className="font-serif text-4xl leading-tight font-light text-balance md:text-6xl">
            Bring Your Bird Moments to Life
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            Upload a video and discover the hidden symphony within.
            <span className="mt-1 block text-sm">上传一段视频，发现其中隐藏的自然交响。</span>
          </p>
        </div>

        {!file ? (
          <div
            role="button"
            tabIndex={0}
            aria-label="上传视频：点击选择或拖拽视频文件到此处"
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                inputRef.current?.click()
              }
            }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]) }}
            className={cn(
              'group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-dashed px-6 py-20 text-center transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-ring md:py-28',
              isDragging
                ? 'scale-[1.01] border-primary bg-primary/10 shadow-[0_0_80px_-20px_var(--glow)]'
                : 'border-primary/25 bg-card/40 hover:border-primary/50 hover:bg-card/60',
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,oklch(0.84_0.11_152/0.12),transparent_60%)]" />
            <div className="relative mb-8 flex size-24 items-center justify-center">
              <span className="absolute inset-0 animate-breathe rounded-full bg-primary/10" />
              <span className="absolute inset-3 rounded-full border border-primary/30" />
              <Upload className={cn('relative size-8 text-primary transition-transform duration-500', isDragging ? '-translate-y-1.5' : 'group-hover:-translate-y-1')} aria-hidden="true" />
            </div>
            <p className="relative font-serif text-2xl md:text-3xl">{isDragging ? '松开以上传视频' : '拖拽视频到这里'}</p>
            <p className="relative mt-2 text-sm text-muted-foreground">或点击从设备中选择 · Drag & drop or browse</p>
            <span className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground shadow-[0_0_40px_-10px_var(--glow)] transition-shadow group-hover:shadow-[0_0_50px_-6px_var(--glow)]">
              <Upload className="size-4" aria-hidden="true" /> Choose Video
            </span>
            <ul className="relative mt-8 flex gap-2" aria-label="支持的格式">
              {['MP4', 'MOV', 'WEBM'].map((fmt) => <li key={fmt} className="rounded-full border border-border px-3 py-1 text-[11px] tracking-[0.2em] text-muted-foreground">{fmt}</li>)}
            </ul>
            <p className="relative mt-4 text-xs text-muted-foreground">最大 100 MB · 在浏览器本地处理，不会上传视频</p>
            {error && <p role="alert" className="relative mt-6 text-sm text-destructive">{error}</p>}
          </div>
        ) : (
          <div className="grid gap-6 rounded-[2rem] border border-border bg-card/50 p-4 md:grid-cols-5 md:p-6">
            <div className="overflow-hidden rounded-2xl bg-black md:col-span-3">
              {previewUrl && (
                <video
                  key={previewUrl}
                  ref={videoRef}
                  src={previewUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-video w-full object-contain"
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onPlay={() => { setIsPlaying(true); void connectAudio() }}
                  onPause={() => { setIsPlaying(false); stopAnalysis() }}
                  onEnded={() => { setIsPlaying(false); stopAnalysis() }}
                  onError={() => setError('视频无法读取。请确认文件完整，并尝试 MP4 或 WebM 格式。')}
                >
                  <track kind="captions" />
                </video>
              )}
              <div className="space-y-3 bg-card/80 p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span>
                </div>
                <input aria-label="播放进度" type="range" min={0} max={duration || 0} step={0.1} value={Math.min(currentTime, duration || 0)} onChange={(e) => seekTo(Number(e.target.value))} className="w-full accent-primary" />
                <div className="flex items-center gap-3">
                  <Volume2 className="size-4 shrink-0 text-muted-foreground" />
                  <input aria-label="音量" type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => changeVolume(Number(e.target.value))} className="w-28 accent-primary" />
                  <span className="text-xs text-muted-foreground">{Math.round(volume * 100)}%</span>
                  <span className="ml-auto text-xs text-muted-foreground">{isPlaying ? '正在播放' : '已暂停'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:col-span-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-xs tracking-[0.3em] text-primary uppercase"><CheckCircle2 className="size-4" aria-hidden="true" /> Ready</p>
                  <p className="mt-3 truncate font-serif text-2xl" title={file.name}>{file.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{formatSize(file.size)}</p>
                </div>
                <button type="button" onClick={clearFile} className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground">
                  <X className="size-4" aria-hidden="true" /><span className="sr-only">移除视频</span>
                </button>
              </div>

              <div className="mt-8 flex-1">
                <p className="mb-4 text-xs tracking-[0.3em] text-muted-foreground uppercase">Live Audio Analysis · 实时音频分析</p>
                <div className="space-y-4 rounded-2xl border border-border/70 bg-background/40 p-4">
                  {([
                    { key: 'bass', label: '低频 · Bass', color: 'bg-emerald-500' },
                    { key: 'mid', label: '中频 · Mid', color: 'bg-amber-400' },
                    { key: 'treble', label: '高频 · Treble', color: 'bg-sky-400' },
                  ] as const).map((band) => (
                    <div key={band.key}>
                      <div className="mb-2 flex justify-between text-xs"><span>{band.label}</span><span className="text-muted-foreground">{Math.round(levels[band.key])}%</span></div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted"><div className={cn('h-full rounded-full transition-[width] duration-100', band.color)} style={{ width: `${levels[band.key]}%` }} /></div>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground">{audioReady ? '音频分析已连接 · 播放视频以查看实时变化' : '点击视频播放，启动浏览器本地音频分析'}</p>
                </div>
                <ol className="mt-4 flex flex-col gap-3">
                  {[{ icon: Film, label: '读取视频', hint: 'Reading video', done: true }, { icon: AudioLines, label: '分析音频', hint: 'Analyzing audio', done: audioReady }, { icon: Sparkles, label: '生成声音宇宙', hint: '3D visualization · 下一步', done: false }].map((step) => (
                    <li key={step.label} className="flex items-center gap-4 rounded-2xl border border-border/70 bg-background/40 px-4 py-3">
                      <span className={cn('flex size-9 items-center justify-center rounded-full', step.done ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground')}><step.icon className="size-4" aria-hidden="true" /></span>
                      <div className="flex-1"><p className="text-sm">{step.label}</p><p className="text-xs text-muted-foreground">{step.hint}</p></div>
                      <span className="text-xs text-muted-foreground">{step.done ? '完成' : '等待中'}</span>
                    </li>
                  ))}
                </ol>
              </div>
              {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
              <p className="mt-5 text-xs text-muted-foreground">隐私提示：视频只在当前浏览器中读取，不会上传到服务器。</p>
            </div>
          </div>
        )}

        <input ref={inputRef} type="file" accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>
    </section>
  )
}

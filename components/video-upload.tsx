'use client'

import { AudioLines, CheckCircle2, Film, Sparkles, Upload, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

const ACCEPTED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm']
const ACCEPTED_EXTENSIONS = ['.mp4', '.mov', '.webm']

function isAcceptedVideo(file: File) {
  const name = file.name.toLowerCase()
  return ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext))
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const pipelineSteps = [
  { icon: Film, label: '读取视频', hint: 'Reading video' },
  { icon: AudioLines, label: '提取鸟鸣', hint: 'Extracting birdsong' },
  { icon: Sparkles, label: '生成声音宇宙', hint: 'Building sound universe' },
]

export function VideoUpload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handleFile(next: File | undefined) {
    if (!next) return
    if (!isAcceptedVideo(next)) {
      setError('暂不支持该格式，请上传 MP4、MOV 或 WEBM 视频。')
      return
    }
    setError(null)
    setFile(next)
    setPreviewUrl(URL.createObjectURL(next))
  }

  function clearFile() {
    setFile(null)
    setPreviewUrl(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
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
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              handleFile(e.dataTransfer.files[0])
            }}
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
              <Upload
                className={cn(
                  'relative size-8 text-primary transition-transform duration-500',
                  isDragging ? '-translate-y-1.5' : 'group-hover:-translate-y-1',
                )}
                aria-hidden="true"
              />
            </div>

            <p className="relative font-serif text-2xl md:text-3xl">
              {isDragging ? '松开以上传视频' : '拖拽视频到这里'}
            </p>
            <p className="relative mt-2 text-sm text-muted-foreground">或点击从设备中选择 · Drag & drop or browse</p>

            <span className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground shadow-[0_0_40px_-10px_var(--glow)] transition-shadow group-hover:shadow-[0_0_50px_-6px_var(--glow)]">
              <Upload className="size-4" aria-hidden="true" />
              Choose Video
            </span>

            <ul className="relative mt-8 flex gap-2" aria-label="支持的格式">
              {['MP4', 'MOV', 'WEBM'].map((fmt) => (
                <li
                  key={fmt}
                  className="rounded-full border border-border px-3 py-1 text-[11px] tracking-[0.2em] text-muted-foreground"
                >
                  {fmt}
                </li>
              ))}
            </ul>

            {error && (
              <p role="alert" className="relative mt-6 text-sm text-destructive">
                {error}
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-6 rounded-[2rem] border border-border bg-card/50 p-4 md:grid-cols-5 md:p-6">
            <div className="overflow-hidden rounded-2xl bg-black md:col-span-3">
              {previewUrl && (
                <video src={previewUrl} controls playsInline className="aspect-video w-full object-contain">
                  <track kind="captions" />
                </video>
              )}
            </div>

            <div className="flex flex-col md:col-span-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-xs tracking-[0.3em] text-primary uppercase">
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                    Ready
                  </p>
                  <p className="mt-3 truncate font-serif text-2xl" title={file.name}>
                    {file.name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{formatSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-4" aria-hidden="true" />
                  <span className="sr-only">移除视频</span>
                </button>
              </div>

              <div className="mt-8 flex-1">
                <p className="mb-4 text-xs tracking-[0.3em] text-muted-foreground uppercase">
                  Audio Extraction · 即将推出
                </p>
                <ol className="flex flex-col gap-3">
                  {pipelineSteps.map((step, index) => (
                    <li
                      key={step.label}
                      className="flex items-center gap-4 rounded-2xl border border-border/70 bg-background/40 px-4 py-3"
                    >
                      <span
                        className={cn(
                          'flex size-9 items-center justify-center rounded-full',
                          index === 0 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
                        )}
                      >
                        <step.icon className="size-4" aria-hidden="true" />
                      </span>
                      <div className="flex-1">
                        <p className="text-sm">{step.label}</p>
                        <p className="text-xs text-muted-foreground">{step.hint}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{index === 0 ? '完成' : '等待中'}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-5 h-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                  <div className="h-full w-1/3 rounded-full bg-primary shadow-[0_0_12px_var(--glow)]" />
                </div>
              </div>

              <button
                type="button"
                disabled
                className="mt-6 rounded-full border border-primary/30 px-6 py-3 text-sm text-primary/70 disabled:cursor-not-allowed"
              >
                声音提取功能即将上线
              </button>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </section>
  )
}

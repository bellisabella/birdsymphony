'use client'

import { Film, Mic } from 'lucide-react'
import { useState } from 'react'

import { AtlasMapLazy } from '@/components/atlas/atlas-map-lazy'
import { ComparisonBoard } from '@/components/atlas/comparison-board'
import {
  formatCoords,
  formatDate,
  RECORDING_COLORS,
  type Recording,
  type VoiceProfile,
} from '@/lib/atlas-data'
import { cn } from '@/lib/utils'

interface SpeciesAtlasViewProps {
  recordings: Recording[]
  profile: VoiceProfile
}

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="font-mono text-xs tracking-[0.3em] text-primary uppercase">{eyebrow}</p>
      <h2 id={id} className="mt-4 font-serif text-4xl font-light text-balance md:text-5xl">{title}</h2>
      <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">{description}</p>
    </div>
  )
}

export function SpeciesAtlasView({ recordings, profile }: SpeciesAtlasViewProps) {
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const activeId = highlightedId ?? selectedId

  const points = recordings
    .map((r, i) => ({ r, color: RECORDING_COLORS[i % RECORDING_COLORS.length] }))
    .filter(({ r }) => r.lat !== undefined && r.lng !== undefined)
    .map(({ r, color }) => ({
      id: r.id,
      lat: r.lat as number,
      lng: r.lng as number,
      label: r.title,
      sublabel: `${r.country} · ${r.season}`,
      color,
    }))

  const selectFromMap = (id: string) => {
    setSelectedId(id)
    document.getElementById(`recording-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  if (recordings.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-24 text-center text-muted-foreground">
        该物种暂无已发布的录音。
      </section>
    )
  }

  return (
    <>
      <section aria-labelledby="compare-heading" className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          id="compare-heading"
          eyebrow="Voice Comparison"
          title="同一物种，不同的声音"
          description="每一条波形都来自不同的地点、季节与环境。在统一的时间轴上并排聆听，留意节奏、音高与回声的细微差异。"
        />
        <ComparisonBoard
          recordings={recordings}
          profile={profile}
          highlightedId={activeId}
          onFocusRecording={setHighlightedId}
        />
        <p className="mt-6 text-xs text-muted-foreground">
          注：当前版本的音频为根据录音参数生成的示意声音，用于演示对比体验，并非真实野外录音。
        </p>
      </section>

      <section aria-labelledby="map-heading" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 max-w-2xl">
          <p className="font-mono text-xs tracking-[0.3em] text-primary uppercase">Geography</p>
          <h2 id="map-heading" className="mt-4 font-serif text-4xl font-light text-balance md:text-5xl">
            每一个地方，都有自己的交响
          </h2>
          <p className="mt-4 leading-relaxed text-pretty text-muted-foreground">
            点击地图上的光点，定位到对应的录音。颜色与上方波形一一对应。
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="relative h-[420px] overflow-hidden rounded-3xl border border-border/60 md:h-[520px]">
            <AtlasMapLazy
              points={points}
              activeId={activeId}
              onSelect={selectFromMap}
              onHover={setHighlightedId}
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_80px_20px_var(--background)]" />
          </div>

          <ul className="flex flex-col gap-3" aria-label="录音地理与时间信息">
            {recordings.map((r, i) => {
              const color = RECORDING_COLORS[i % RECORDING_COLORS.length]
              const Icon = r.source.kind === 'video' ? Film : Mic
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(r.id)}
                    onMouseEnter={() => setHighlightedId(r.id)}
                    onMouseLeave={() => setHighlightedId(null)}
                    aria-pressed={selectedId === r.id}
                    className={cn(
                      'w-full rounded-2xl border p-4 text-left transition-colors',
                      activeId === r.id ? 'border-primary/40 bg-card/80' : 'border-border/60 bg-card/30 hover:bg-card/60',
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                          aria-hidden="true"
                        />
                        {r.country}
                      </span>
                      <Icon className="size-3.5 text-muted-foreground" aria-label={r.source.kind === 'video' ? '视频' : '音频'} />
                    </div>
                    <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                      <div className="col-span-2">
                        <dt className="text-muted-foreground">地区</dt>
                        <dd>{r.region}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-muted-foreground">坐标</dt>
                        <dd className="font-mono">{formatCoords(r.lat, r.lng)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">日期</dt>
                        <dd>{formatDate(r.date)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">季节</dt>
                        <dd>{r.season}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-muted-foreground">栖息地</dt>
                        <dd>{r.habitat}</dd>
                      </div>
                    </dl>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="notes-heading" className="mx-auto max-w-6xl px-6 py-20">
        <SectionHeading
          id="notes-heading"
          eyebrow="Field Notes"
          title="录音笔记"
          description="每一段声音背后，都有一个具体的清晨、一片具体的林地，和一位耐心等待的录音者。"
        />
        <div className="grid gap-4 md:grid-cols-2">
          {recordings.map((r, i) => {
            const color = RECORDING_COLORS[i % RECORDING_COLORS.length]
            return (
              <article key={r.id} className="rounded-3xl border border-border/60 bg-card/30 p-6">
                <p className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color }}>
                  {`Voice ${String(i + 1).padStart(2, '0')} · ${r.source.reference}`}
                </p>
                <h3 className="mt-2 font-serif text-2xl">{r.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.description}</p>
                <p className="mt-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                  {`${r.source.kind === 'video' ? '视频来源' : '音频来源'}：${r.source.recordist} · ${r.source.equipment}`}
                </p>
              </article>
            )
          })}
        </div>
      </section>
    </>
  )
}

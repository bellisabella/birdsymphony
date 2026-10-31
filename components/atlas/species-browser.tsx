'use client'

import { ArrowUpRight, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { HABITATS, type Habitat, type Recording, type Species } from '@/lib/atlas-data'
import { cn } from '@/lib/utils'

interface SpeciesBrowserProps {
  species: Species[]
  recordings: Recording[]
}

export function SpeciesBrowser({ species, recordings }: SpeciesBrowserProps) {
  const [query, setQuery] = useState('')
  const [habitat, setHabitat] = useState<Habitat | 'all'>('all')
  const [country, setCountry] = useState('all')

  const published = useMemo(() => recordings.filter((r) => r.published), [recordings])
  const countries = useMemo(() => Array.from(new Set(published.map((r) => r.country))), [published])
  const availableHabitats = HABITATS.filter((h) => published.some((r) => r.habitat === h))

  const results = species
    .map((s) => {
      const recs = published.filter((r) => r.speciesId === s.id)
      return { species: s, recs, countries: Array.from(new Set(recs.map((r) => r.country))) }
    })
    .filter(({ species: s, recs }) => {
      const q = query.trim().toLowerCase()
      const matchQuery =
        !q || [s.nameZh, s.nameEn, s.scientificName, s.family].some((v) => v.toLowerCase().includes(q))
      const matchHabitat = habitat === 'all' || recs.some((r) => r.habitat === habitat)
      const matchCountry = country === 'all' || recs.some((r) => r.country === country)
      return matchQuery && matchHabitat && matchCountry
    })

  const chip = (active: boolean) =>
    cn(
      'rounded-full border px-4 py-1.5 text-xs transition-colors',
      active
        ? 'border-primary/50 bg-primary/10 text-primary'
        : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground',
    )

  return (
    <div>
      <div className="flex flex-col gap-6 rounded-3xl border border-border/60 bg-card/30 p-5 backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <label className="relative flex-1">
            <span className="sr-only">搜索鸟种</span>
            <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索中文名、英文名或学名…"
              className="h-11 w-full rounded-full border border-border bg-background/60 pr-4 pl-11 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </label>
          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="shrink-0">录音国家</span>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="h-11 rounded-full border border-border bg-background/60 px-4 text-sm text-foreground outline-none focus-visible:border-primary/50"
            >
              <option value="all">全部国家</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div role="group" aria-label="按栖息地筛选" className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={habitat === 'all'} onClick={() => setHabitat('all')} className={chip(habitat === 'all')}>
            全部栖息地
          </button>
          {availableHabitats.map((h) => (
            <button key={h} type="button" aria-pressed={habitat === h} onClick={() => setHabitat(h)} className={chip(habitat === h)}>
              {h}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-8 text-sm text-muted-foreground" aria-live="polite">
        {`共 ${results.length} 个物种`}
      </p>

      {results.length === 0 ? (
        <p className="py-24 text-center text-muted-foreground">没有找到匹配的鸟种，换个关键词试试。</p>
      ) : (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(({ species: s, recs, countries: cs }) => (
            <li key={s.id}>
              <Link
                href={`/atlas/${s.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/40 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_60px_-30px_var(--glow)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={s.image || '/placeholder.svg'}
                    alt={`${s.nameZh}（${s.nameEn}）`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
                  <span className="absolute top-4 right-4 rounded-full border border-primary/30 bg-background/60 px-3 py-1 font-mono text-[11px] text-primary backdrop-blur">
                    {`${recs.length} 段录音`}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 pt-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-3xl leading-tight">{s.nameZh}</h3>
                      <p className="mt-1 text-sm text-foreground/80">{s.nameEn}</p>
                      <p className="font-serif text-sm text-primary/80 italic">{s.scientificName}</p>
                    </div>
                    <ArrowUpRight
                      className="mt-2 size-5 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                  <p className="mt-auto border-t border-border/60 pt-4 text-xs text-muted-foreground">
                    {cs.length ? `录音地：${cs.join(' · ')}` : '暂无已发布录音'}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

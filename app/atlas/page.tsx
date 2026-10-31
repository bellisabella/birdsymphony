import type { Metadata } from 'next'

import { SpeciesBrowser } from '@/components/atlas/species-browser'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { recordings, species } from '@/lib/atlas-data'

export const metadata: Metadata = {
  title: 'Sound Atlas · 鸟声图谱 | Bird Symphony',
  description: '同一种鸟，可以有许多种声音。比较来自不同地点、环境与季节的鸟鸣录音。',
}

export default function AtlasPage() {
  const published = recordings.filter((r) => r.published)
  const countryCount = new Set(published.map((r) => r.country)).size

  return (
    <>
      <SiteHeader />
      <main className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]"
          aria-hidden="true"
        />
        <section className="relative mx-auto max-w-6xl px-6 pt-40 pb-16 md:pt-48">
          <p className="font-mono text-xs tracking-[0.3em] text-primary uppercase">Bird Sound Atlas</p>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.05] font-light text-balance md:text-7xl">
            同一种鸟，<span className="text-primary italic">有许多种声音</span>
          </h1>
          <p className="mt-6 max-w-2xl font-serif text-xl text-muted-foreground italic md:text-2xl">
            The same bird can have many voices. Every place has its own symphony.
          </p>
          <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-6 border-t border-border/60 pt-8">
            {[
              { label: '物种', value: species.length },
              { label: '已发布录音', value: published.length },
              { label: '录音国家', value: countryCount },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs tracking-widest text-muted-foreground">{stat.label}</dt>
                <dd className="mt-1 font-serif text-4xl text-foreground">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-label="鸟种收藏" className="relative mx-auto max-w-6xl px-6 pb-24">
          <SpeciesBrowser species={species} recordings={recordings} />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}

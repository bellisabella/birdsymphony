import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { SpeciesAtlasView } from '@/components/atlas/species-atlas-view'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getPublishedRecordings, getSpeciesBySlug, species } from '@/lib/atlas-data'

export function generateStaticParams() {
  return species.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const s = getSpeciesBySlug(slug)
  if (!s) return { title: 'Sound Atlas | Bird Symphony' }
  return {
    title: `${s.nameZh} ${s.nameEn} · Sound Atlas | Bird Symphony`,
    description: s.description,
  }
}

export default async function SpeciesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = getSpeciesBySlug(slug)
  if (!s) notFound()

  const recs = getPublishedRecordings(s.id)
  const countries = new Set(recs.map((r) => r.country)).size
  const seasons = new Set(recs.map((r) => r.season)).size

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image src={s.image || '/placeholder.svg'} alt="" fill priority sizes="100vw" className="object-cover opacity-45" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
          </div>

          <div className="relative mx-auto max-w-6xl px-6 pt-36 pb-20 md:pt-44 md:pb-28">
            <Link
              href="/atlas"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              返回 Sound Atlas
            </Link>
            <p className="mt-10 font-mono text-xs tracking-[0.3em] text-primary uppercase">{s.family}</p>
            <h1 className="mt-4 font-serif text-6xl leading-none font-light md:text-8xl">{s.nameZh}</h1>
            <p className="mt-4 text-lg text-foreground/90">{s.nameEn}</p>
            <p className="font-serif text-xl text-primary italic">{s.scientificName}</p>
            <p className="mt-8 max-w-xl leading-relaxed text-pretty text-muted-foreground">{s.description}</p>

            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {[
                { label: '录音', value: recs.length },
                { label: '国家', value: countries },
                { label: '季节', value: seasons },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs tracking-widest text-muted-foreground">{stat.label}</dt>
                  <dd className="font-serif text-4xl">{stat.value}</dd>
                </div>
              ))}
            </dl>

            <blockquote className="mt-10 max-w-xl border-l-2 border-primary/50 pl-5 font-serif text-lg text-foreground/85 italic">
              {s.voiceNote}
            </blockquote>
          </div>
        </section>

        <SpeciesAtlasView recordings={recs} profile={s.voiceProfile} />
      </main>
      <SiteFooter />
    </>
  )
}

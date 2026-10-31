import { ArrowDown } from 'lucide-react'
import Image from 'next/image'

import { ParticleField } from '@/components/particle-field'

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-20"
    >
      <Image
        src="/images/forest-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_85%)]" />
      <ParticleField count={55} seed={11} />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <p className="mb-8 flex items-center gap-3 text-xs tracking-[0.4em] text-primary/80 uppercase">
          <span className="h-px w-8 bg-primary/50" />
          An Acoustic Sanctuary
          <span className="h-px w-8 bg-primary/50" />
        </p>

        <h1 className="font-serif text-6xl leading-none font-light tracking-[0.12em] text-balance text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
          BIRD
          <br />
          SYMPHONY
        </h1>

        <p className="mt-8 font-serif text-2xl text-primary italic md:text-3xl">
          Listen to Nature. Feel Life.
        </p>

        <blockquote className="mt-10 max-w-2xl border-y border-border/70 py-6">
          <p className="font-serif text-lg leading-relaxed tracking-wider text-pretty text-foreground/90 md:text-2xl md:leading-relaxed">
            观鸟不一定要看鸟，通过聆听鸟类的声音，去触碰它们最本真、最自然的生命状态。
          </p>
        </blockquote>

        <p className="mt-8 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
          Every bird carries a unique natural symphony — a voice shaped by forest, wind and season.
          每一只鸟，都有属于它自己的交响。
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#upload"
            className="rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_0_40px_-8px_var(--glow)] transition-all hover:shadow-[0_0_56px_-6px_var(--glow)]"
          >
            Upload Your Recording
          </a>
          <a
            href="#explore"
            className="rounded-full border border-border px-8 py-3.5 text-sm text-foreground/90 transition-colors hover:border-primary/40 hover:text-primary"
          >
            Explore the Sound Universe
          </a>
        </div>
      </div>

      <a
        href="#upload"
        className="absolute bottom-8 z-10 flex flex-col items-center gap-2 text-xs tracking-[0.3em] text-muted-foreground uppercase transition-colors hover:text-primary"
      >
        Scroll
        <ArrowDown className="size-4 animate-bounce" aria-hidden="true" />
      </a>
    </section>
  )
}

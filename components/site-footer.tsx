import { LogoMark } from '@/components/logo'

export function SiteFooter() {
  return (
    <footer className="relative mt-16 border-t border-border px-6 pt-20 pb-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <LogoMark className="size-10" />
        <p className="mt-6 font-serif text-4xl font-light tracking-[0.15em] md:text-5xl">Bird Symphony</p>
        <p className="mt-3 font-serif text-lg text-primary italic">Every Bird Has a Symphony.</p>

        <div className="mt-16 flex w-full flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <p>{'© 2026 Bird Symphony. All rights reserved.'}</p>
          <p>用耳朵观鸟 · Listen to Nature</p>
        </div>
      </div>
    </footer>
  )
}

'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'

import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#explore', label: 'Explore' },
  { href: '#about', label: 'About' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-4 mt-4 flex max-w-6xl items-center justify-between rounded-full border border-border/60 bg-background/40 px-4 py-2.5 backdrop-blur-xl md:mx-8 md:px-6 xl:mx-auto">
        <a href="#home" aria-label="Bird Symphony 首页">
          <Logo />
        </a>

        <nav aria-label="主导航" className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#explore"
          className="hidden rounded-full border border-primary/30 px-5 py-2 text-sm text-primary transition-all hover:border-primary/60 hover:bg-primary/10 hover:shadow-[0_0_24px_-4px_var(--glow)] md:inline-flex"
        >
          Enter Experience
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="inline-flex size-9 items-center justify-center rounded-full text-foreground md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
          <span className="sr-only">{open ? '关闭菜单' : '打开菜单'}</span>
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="移动端导航"
        className={cn(
          'mx-4 mt-2 flex-col gap-1 rounded-3xl border border-border/60 bg-background/90 p-3 backdrop-blur-xl md:hidden',
          open ? 'flex' : 'hidden',
        )}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="rounded-2xl px-4 py-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#explore"
          onClick={() => setOpen(false)}
          className="mt-1 rounded-2xl bg-primary/10 px-4 py-3 text-sm text-primary"
        >
          Enter Experience
        </a>
      </nav>
    </header>
  )
}

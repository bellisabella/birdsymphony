'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/#home', label: 'Home' },
  { href: '/#explore', label: 'Explore' },
  { href: '/atlas', label: 'Sound Atlas' },
  { href: '/#about', label: 'About' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isActive = (href: string) => href === '/atlas' && pathname.startsWith('/atlas')

  return (
    <header className="fixed inset-x-0 top-0 z-[1000]">
      <div className="mx-4 mt-4 flex max-w-6xl items-center justify-between rounded-full border border-border/60 bg-background/40 px-4 py-2.5 backdrop-blur-xl md:mx-8 md:px-6 xl:mx-auto">
        <Link href="/" aria-label="Bird Symphony 首页">
          <Logo />
        </Link>

        <nav aria-label="主导航" className="hidden items-center gap-8 md:flex lg:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={cn(
                'text-sm tracking-wide transition-colors hover:text-foreground',
                isActive(link.href) ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#explore"
          className="hidden rounded-full border border-primary/30 px-5 py-2 text-sm text-primary transition-all hover:border-primary/60 hover:bg-primary/10 hover:shadow-[0_0_24px_-4px_var(--glow)] md:inline-flex"
        >
          Enter Experience
        </Link>

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
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            aria-current={isActive(link.href) ? 'page' : undefined}
            className={cn(
              'rounded-2xl px-4 py-3 text-sm hover:bg-muted hover:text-foreground',
              isActive(link.href) ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/#explore"
          onClick={() => setOpen(false)}
          className="mt-1 rounded-2xl bg-primary/10 px-4 py-3 text-sm text-primary"
        >
          Enter Experience
        </Link>
      </nav>
    </header>
  )
}

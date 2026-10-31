'use client'

import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

export const inputClass =
  'h-10 w-full rounded-xl border border-border bg-background/60 px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20'

export const textareaClass = cn(inputClass, 'h-auto min-h-24 py-2.5 leading-relaxed')

export function Field({
  label,
  htmlFor,
  hint,
  className,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground/80">{hint}</p>}
    </div>
  )
}

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="grid gap-4 rounded-2xl border border-border/60 p-4 sm:grid-cols-2 md:p-5">
      <legend className="px-2 font-mono text-[11px] tracking-[0.2em] text-primary uppercase">{title}</legend>
      {children}
    </fieldset>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors',
        checked ? 'border-primary/60 bg-primary/30' : 'border-border bg-muted',
      )}
    >
      <span
        className={cn(
          'inline-block size-4 rounded-full transition-transform',
          checked ? 'translate-x-6 bg-primary shadow-[0_0_10px_var(--glow)]' : 'translate-x-1 bg-muted-foreground',
        )}
      />
    </button>
  )
}

export function AdminDialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'lg',
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'lg'
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      aria-labelledby="admin-dialog-title"
      className={cn(
        'admin-dialog m-auto max-h-[90vh] w-[calc(100%-2rem)] overflow-hidden rounded-3xl border border-border bg-card p-0 text-foreground shadow-2xl',
        size === 'lg' ? 'max-w-3xl' : 'max-w-md',
      )}
    >
      {open && (
        <div className="flex max-h-[90vh] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-border/60 px-6 py-5">
            <div>
              <h2 id="admin-dialog-title" className="font-serif text-2xl">
                {title}
              </h2>
              {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="关闭"
              className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
          {footer && <div className="flex justify-end gap-3 border-t border-border/60 px-6 py-4">{footer}</div>}
        </div>
      )}
    </dialog>
  )
}

export function PrimaryButton({ className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-all hover:shadow-[0_0_24px_-4px_var(--glow)] disabled:opacity-50',
        className,
      )}
    />
  )
}

export function GhostButton({ className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50',
        className,
      )}
    />
  )
}

export function IconButton({
  label,
  className,
  tone = 'default',
  ...props
}: React.ComponentProps<'button'> & { label: string; tone?: 'default' | 'danger' }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors',
        tone === 'danger' ? 'hover:bg-destructive/15 hover:text-destructive' : 'hover:bg-muted hover:text-foreground',
        className,
      )}
    />
  )
}

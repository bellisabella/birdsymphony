'use client'

import { ImageUp } from 'lucide-react'
import Image from 'next/image'
import { useState, type FormEvent } from 'react'

import { AdminDialog, Field, FormSection, GhostButton, inputClass, PrimaryButton, textareaClass } from '@/components/admin/admin-ui'
import { VOICE_PROFILES, type Species, type VoiceProfile } from '@/lib/atlas-data'

interface SpeciesFormProps {
  open: boolean
  initial: Species | null
  existingSlugs: string[]
  onClose: () => void
  onSave: (species: Species) => void
}

const empty: Species = {
  id: '',
  slug: '',
  nameZh: '',
  nameEn: '',
  scientificName: '',
  family: '',
  image: '',
  description: '',
  voiceNote: '',
  voiceProfile: 'nightingale',
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function SpeciesFormBody({ initial, existingSlugs, onClose, onSave }: Omit<SpeciesFormProps, 'open'>) {
  const [form, setForm] = useState<Species>(initial ?? empty)
  const [error, setError] = useState<string | null>(null)
  const set = <K extends keyof Species>(key: K, value: Species[K]) => setForm((f) => ({ ...f, [key]: value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const slug = slugify(form.slug || form.nameEn)
    if (!form.nameZh.trim() || !form.nameEn.trim() || !form.scientificName.trim()) {
      setError('请填写中文名、英文名与学名。')
      return
    }
    if (!slug) {
      setError('请填写有效的英文名或 URL 标识。')
      return
    }
    if (existingSlugs.includes(slug) && slug !== initial?.slug) {
      setError('该 URL 标识已被其他物种使用。')
      return
    }
    onSave({ ...form, slug, id: form.id || `sp-${slug}-${Date.now().toString(36)}` })
  }

  return (
    <form id="species-form" onSubmit={submit} className="flex flex-col gap-5">
      <FormSection title="基本信息">
        <Field label="中文名 *" htmlFor="sp-zh">
          <input id="sp-zh" className={inputClass} value={form.nameZh} onChange={(e) => set('nameZh', e.target.value)} />
        </Field>
        <Field label="英文名 *" htmlFor="sp-en">
          <input id="sp-en" className={inputClass} value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} />
        </Field>
        <Field label="学名 *" htmlFor="sp-sci">
          <input
            id="sp-sci"
            className={`${inputClass} font-serif italic`}
            value={form.scientificName}
            onChange={(e) => set('scientificName', e.target.value)}
          />
        </Field>
        <Field label="科" htmlFor="sp-family">
          <input id="sp-family" className={inputClass} value={form.family} onChange={(e) => set('family', e.target.value)} placeholder="例如：鹟科 Muscicapidae" />
        </Field>
        <Field label="URL 标识" htmlFor="sp-slug" hint="留空则根据英文名自动生成">
          <input id="sp-slug" className={`${inputClass} font-mono`} value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="common-nightingale" />
        </Field>
        <Field label="鸣声类型" htmlFor="sp-profile" hint="用于生成示意预览声音">
          <select id="sp-profile" className={inputClass} value={form.voiceProfile} onChange={(e) => set('voiceProfile', e.target.value as VoiceProfile)}>
            {VOICE_PROFILES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>
      </FormSection>

      <FormSection title="图片与介绍">
        <div className="flex items-center gap-4 sm:col-span-2">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted">
            {form.image ? (
              <Image src={form.image || '/placeholder.svg'} alt="物种图片预览" fill sizes="80px" className="object-cover" unoptimized={form.image.startsWith('blob:')} />
            ) : (
              <ImageUp className="absolute inset-0 m-auto size-6 text-muted-foreground" aria-hidden="true" />
            )}
          </div>
          <Field label="物种图片" htmlFor="sp-image" hint="支持 JPG / PNG，当前为本地预览" className="flex-1">
            <input
              id="sp-image"
              type="file"
              accept="image/*"
              className="text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-primary/15 file:px-4 file:py-2 file:text-primary"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) set('image', URL.createObjectURL(file))
              }}
            />
          </Field>
        </div>
        <Field label="物种介绍" htmlFor="sp-desc" className="sm:col-span-2">
          <textarea id="sp-desc" className={textareaClass} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </Field>
        <Field label="声音差异笔记" htmlFor="sp-note" className="sm:col-span-2">
          <textarea id="sp-note" className={textareaClass} value={form.voiceNote} onChange={(e) => set('voiceNote', e.target.value)} />
        </Field>
      </FormSection>

      {error && (
        <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <GhostButton type="button" onClick={onClose}>
          取消
        </GhostButton>
        <PrimaryButton type="submit">{initial ? '保存修改' : '添加物种'}</PrimaryButton>
      </div>
    </form>
  )
}

export function SpeciesForm(props: SpeciesFormProps) {
  return (
    <AdminDialog
      open={props.open}
      onClose={props.onClose}
      title={props.initial ? '编辑物种' : '添加物种'}
      description="物种信息将显示在 Sound Atlas 的物种卡片与详情页中。"
    >
      <SpeciesFormBody key={props.initial?.id ?? 'new'} {...props} />
    </AdminDialog>
  )
}

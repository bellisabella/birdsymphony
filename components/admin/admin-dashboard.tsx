'use client'

import { AudioLines, Bird, ExternalLink, Film, Info, Mic, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { AdminDialog, GhostButton, IconButton, inputClass, PrimaryButton, Toggle } from '@/components/admin/admin-ui'
import { PreviewButton } from '@/components/admin/preview-button'
import { RecordingForm } from '@/components/admin/recording-form'
import { SpeciesForm } from '@/components/admin/species-form'
import { Logo } from '@/components/logo'
import {
  formatDuration,
  VOICE_PROFILES,
  recordings as seedRecordings,
  species as seedSpecies,
  type Recording,
  type Species,
} from '@/lib/atlas-data'
import { pause } from '@/lib/audio-engine'
import { cn } from '@/lib/utils'

type Tab = 'recordings' | 'species'
type StatusFilter = 'all' | 'published' | 'draft'
type PendingDelete = { kind: 'recording'; item: Recording } | { kind: 'species'; item: Species } | null

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('recordings')
  const [speciesList, setSpeciesList] = useState<Species[]>(seedSpecies)
  const [recordingList, setRecordingList] = useState<Recording[]>(seedRecordings)
  const [query, setQuery] = useState('')
  const [speciesFilter, setSpeciesFilter] = useState('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [editingRecording, setEditingRecording] = useState<Recording | null | undefined>(undefined)
  const [editingSpecies, setEditingSpecies] = useState<Species | null | undefined>(undefined)
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null)

  const speciesById = new Map(speciesList.map((s) => [s.id, s]))
  const publishedCount = recordingList.filter((r) => r.published).length

  const filteredRecordings = recordingList.filter((r) => {
    const q = query.trim().toLowerCase()
    const sp = speciesById.get(r.speciesId)
    const matchQ =
      !q ||
      [r.title, r.country, r.region, r.source.recordist, r.source.reference, sp?.nameZh ?? '', sp?.nameEn ?? '']
        .some((v) => v.toLowerCase().includes(q))
    const matchSp = speciesFilter === 'all' || r.speciesId === speciesFilter
    const matchStatus = status === 'all' || (status === 'published' ? r.published : !r.published)
    return matchQ && matchSp && matchStatus
  })

  const saveRecording = (rec: Recording) => {
    setRecordingList((list) => (list.some((r) => r.id === rec.id) ? list.map((r) => (r.id === rec.id ? rec : r)) : [rec, ...list]))
    setEditingRecording(undefined)
  }

  const saveSpecies = (sp: Species) => {
    setSpeciesList((list) => (list.some((s) => s.id === sp.id) ? list.map((s) => (s.id === sp.id ? sp : s)) : [...list, sp]))
    setEditingSpecies(undefined)
  }

  const togglePublished = (id: string, value: boolean) =>
    setRecordingList((list) => list.map((r) => (r.id === id ? { ...r, published: value } : r)))

  const confirmDelete = () => {
    if (!pendingDelete) return
    pause()
    if (pendingDelete.kind === 'recording') {
      setRecordingList((list) => list.filter((r) => r.id !== pendingDelete.item.id))
    } else {
      const id = pendingDelete.item.id
      setSpeciesList((list) => list.filter((s) => s.id !== id))
      setRecordingList((list) => list.filter((r) => r.speciesId !== id))
      if (speciesFilter === id) setSpeciesFilter('all')
    }
    setPendingDelete(null)
  }

  const stats = [
    { label: '物种', value: speciesList.length, icon: Bird },
    { label: '录音总数', value: recordingList.length, icon: AudioLines },
    { label: '已发布', value: publishedCount, icon: Mic },
    { label: '草稿', value: recordingList.length - publishedCount, icon: Pencil },
  ]

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="返回 Bird Symphony 首页">
              <Logo />
            </Link>
            <span className="hidden rounded-full border border-primary/30 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.2em] text-primary uppercase sm:inline">
              Admin
            </span>
          </div>
          <Link
            href="/atlas"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            查看 Sound Atlas
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs tracking-[0.3em] text-primary uppercase">Atlas Back Office</p>
            <h1 className="mt-3 font-serif text-4xl font-light md:text-5xl">声音图谱管理</h1>
            <p className="mt-2 text-sm text-muted-foreground">管理物种、录音元数据与发布状态。</p>
          </div>
          <PrimaryButton
            type="button"
            onClick={() => (tab === 'recordings' ? setEditingRecording(null) : setEditingSpecies(null))}
            disabled={tab === 'recordings' && speciesList.length === 0}
          >
            <Plus className="size-4" aria-hidden="true" />
            {tab === 'recordings' ? '添加录音' : '添加物种'}
          </PrimaryButton>
        </div>

        <div role="note" className="mt-6 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <p>演示模式：修改仅保存在当前浏览器会话中，刷新页面后会恢复为示例数据。上传的文件仅用于本地预览。</p>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/40 p-5">
              <div>
                <dt className="text-xs text-muted-foreground">{s.label}</dt>
                <dd className="mt-1 font-serif text-3xl">{s.value}</dd>
              </div>
              <s.icon className="size-5 text-primary/70" aria-hidden="true" />
            </div>
          ))}
        </dl>

        <div role="tablist" aria-label="管理内容" className="mt-10 flex gap-6 border-b border-border/60">
          {(
            [
              { value: 'recordings', label: '录音', count: recordingList.length },
              { value: 'species', label: '物种', count: speciesList.length },
            ] as const
          ).map((t) => (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={tab === t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                '-mb-px border-b-2 pb-3 text-sm transition-colors',
                tab === t.value ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {t.label}
              <span className="ml-2 font-mono text-xs text-muted-foreground">{t.count}</span>
            </button>
          ))}
        </div>

        {tab === 'recordings' ? (
          <section role="tabpanel" aria-label="录音列表" className="mt-6">
            <div className="flex flex-col gap-3 md:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">搜索录音</span>
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索标题、地点、录音者或编号…"
                  className={cn(inputClass, 'pl-9')}
                />
              </label>
              <label className="md:w-56">
                <span className="sr-only">按物种筛选</span>
                <select value={speciesFilter} onChange={(e) => setSpeciesFilter(e.target.value)} className={inputClass}>
                  <option value="all">全部物种</option>
                  {speciesList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nameZh}
                    </option>
                  ))}
                </select>
              </label>
              <label className="md:w-40">
                <span className="sr-only">按状态筛选</span>
                <select value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)} className={inputClass}>
                  <option value="all">全部状态</option>
                  <option value="published">已发布</option>
                  <option value="draft">草稿</option>
                </select>
              </label>
            </div>

            <div className="mt-4 overflow-x-auto rounded-2xl border border-border/60">
              <table className="w-full min-w-[880px] text-left text-sm">
                <thead className="bg-card/60 text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="w-14 px-4 py-3 font-medium">
                      <span className="sr-only">预览</span>
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">录音</th>
                    <th scope="col" className="px-4 py-3 font-medium">物种</th>
                    <th scope="col" className="px-4 py-3 font-medium">地点</th>
                    <th scope="col" className="px-4 py-3 font-medium">日期 / 季节</th>
                    <th scope="col" className="px-4 py-3 font-medium">来源</th>
                    <th scope="col" className="px-4 py-3 font-medium">发布</th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRecordings.map((r) => {
                    const sp = speciesById.get(r.speciesId)
                    const SourceIcon = r.source.kind === 'video' ? Film : Mic
                    return (
                      <tr key={r.id} className="bg-card/20 transition-colors hover:bg-card/50">
                        <td className="px-4 py-3">
                          {sp && <PreviewButton recording={r} profile={sp.voiceProfile} />}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{r.title}</p>
                          <p className="font-mono text-[11px] text-muted-foreground">
                            {`${r.source.reference || '—'} · ${formatDuration(r.duration)}`}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p>{sp?.nameZh ?? '未知'}</p>
                          <p className="text-xs text-muted-foreground">{sp?.nameEn}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p>{r.country}</p>
                          <p className="text-xs text-muted-foreground">{r.region}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-mono text-xs">{r.date}</p>
                          <p className="text-xs text-muted-foreground">{`${r.season} · ${r.habitat}`}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <SourceIcon className="size-3.5" aria-hidden="true" />
                            {r.source.kind === 'video' ? '视频' : '音频'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Toggle
                              checked={r.published}
                              onChange={(v) => togglePublished(r.id, v)}
                              label={`${r.published ? '取消发布' : '发布'} ${r.title}`}
                            />
                            <span className={cn('text-xs', r.published ? 'text-primary' : 'text-muted-foreground')}>
                              {r.published ? '已发布' : '草稿'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <IconButton label={`编辑 ${r.title}`} onClick={() => setEditingRecording(r)}>
                              <Pencil className="size-4" />
                            </IconButton>
                            <IconButton label={`删除 ${r.title}`} tone="danger" onClick={() => setPendingDelete({ kind: 'recording', item: r })}>
                              <Trash2 className="size-4" />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {filteredRecordings.length === 0 && (
                <p className="py-16 text-center text-sm text-muted-foreground">没有符合条件的录音。</p>
              )}
            </div>
          </section>
        ) : (
          <section role="tabpanel" aria-label="物种列表" className="mt-6">
            <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {speciesList.map((s) => {
                const recs = recordingList.filter((r) => r.speciesId === s.id)
                const pub = recs.filter((r) => r.published).length
                return (
                  <li key={s.id} className="flex gap-4 rounded-2xl border border-border/60 bg-card/30 p-4">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                      {s.image && (
                        <Image
                          src={s.image || '/placeholder.svg'}
                          alt={s.nameZh}
                          fill
                          sizes="80px"
                          className="object-cover"
                          unoptimized={s.image.startsWith('blob:')}
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate font-serif text-xl">{s.nameZh}</h3>
                          <p className="truncate text-xs text-muted-foreground">{s.nameEn}</p>
                          <p className="truncate font-serif text-xs text-primary/80 italic">{s.scientificName}</p>
                        </div>
                        <div className="flex shrink-0 gap-0.5">
                          <IconButton label={`编辑 ${s.nameZh}`} onClick={() => setEditingSpecies(s)}>
                            <Pencil className="size-4" />
                          </IconButton>
                          <IconButton label={`删除 ${s.nameZh}`} tone="danger" onClick={() => setPendingDelete({ kind: 'species', item: s })}>
                            <Trash2 className="size-4" />
                          </IconButton>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {`${recs.length} 段录音 · ${pub} 已发布 · ${VOICE_PROFILES.find((p) => p.value === s.voiceProfile)?.label.split(' · ')[0] ?? ''}`}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
            {speciesList.length === 0 && (
              <p className="py-16 text-center text-sm text-muted-foreground">还没有物种，点击右上角添加。</p>
            )}
          </section>
        )}
      </main>

      <RecordingForm
        open={editingRecording !== undefined}
        initial={editingRecording ?? null}
        species={speciesList}
        onClose={() => {
          pause()
          setEditingRecording(undefined)
        }}
        onSave={saveRecording}
      />
      <SpeciesForm
        open={editingSpecies !== undefined}
        initial={editingSpecies ?? null}
        existingSlugs={speciesList.map((s) => s.slug)}
        onClose={() => setEditingSpecies(undefined)}
        onSave={saveSpecies}
      />
      <AdminDialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="确认删除"
        size="sm"
        footer={
          <>
            <GhostButton type="button" onClick={() => setPendingDelete(null)}>
              取消
            </GhostButton>
            <PrimaryButton type="button" onClick={confirmDelete} className="bg-destructive text-white">
              删除
            </PrimaryButton>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          {pendingDelete?.kind === 'species'
            ? `将删除物种「${pendingDelete.item.nameZh}」及其全部 ${recordingList.filter((r) => r.speciesId === pendingDelete.item.id).length} 段录音，此操作无法撤销。`
            : pendingDelete
              ? `将删除录音「${pendingDelete.item.title}」，此操作无法撤销。`
              : ''}
        </p>
      </AdminDialog>
    </div>
  )
}

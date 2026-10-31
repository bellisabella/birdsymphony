'use client'

import { FileAudio, Film } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { AdminDialog, Field, FormSection, GhostButton, inputClass, PrimaryButton, textareaClass, Toggle } from '@/components/admin/admin-ui'
import { PreviewButton } from '@/components/admin/preview-button'
import {
  AMBIENCE_LABELS,
  HABITATS,
  SEASONS,
  type Ambience,
  type Habitat,
  type Recording,
  type Season,
  type Species,
} from '@/lib/atlas-data'

interface RecordingFormProps {
  open: boolean
  initial: Recording | null
  species: Species[]
  onClose: () => void
  onSave: (recording: Recording) => void
}

function createEmpty(speciesId: string): Recording {
  return {
    id: '',
    speciesId,
    title: '',
    country: '',
    region: '',
    date: new Date().toISOString().slice(0, 10),
    time: '06:00',
    season: '春季',
    habitat: '温带森林',
    environment: '',
    ambience: 'forest',
    duration: 15,
    source: { kind: 'audio', recordist: '', equipment: '', reference: '' },
    description: '',
    published: false,
    seed: Math.floor(Math.random() * 10000),
    pitch: 1,
    tempo: 1,
  }
}

function RecordingFormBody({ initial, species, onClose, onSave }: Omit<RecordingFormProps, 'open'>) {
  const [form, setForm] = useState<Recording>(initial ?? createEmpty(species[0]?.id ?? ''))
  const [lat, setLat] = useState(initial?.lat?.toString() ?? '')
  const [lng, setLng] = useState(initial?.lng?.toString() ?? '')
  const [error, setError] = useState<string | null>(null)
  const set = <K extends keyof Recording>(key: K, value: Recording[K]) => setForm((f) => ({ ...f, [key]: value }))
  const setSource = <K extends keyof Recording['source']>(key: K, value: Recording['source'][K]) =>
    setForm((f) => ({ ...f, source: { ...f.source, [key]: value } }))

  const profile = species.find((s) => s.id === form.speciesId)?.voiceProfile ?? 'nightingale'

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.speciesId || !form.title.trim() || !form.country.trim()) {
      setError('请选择物种，并填写录音标题与国家。')
      return
    }
    const parsedLat = lat.trim() === '' ? undefined : Number(lat)
    const parsedLng = lng.trim() === '' ? undefined : Number(lng)
    if ((parsedLat === undefined) !== (parsedLng === undefined)) {
      setError('纬度与经度需要同时填写或同时留空。')
      return
    }
    if (
      parsedLat !== undefined &&
      parsedLng !== undefined &&
      (Number.isNaN(parsedLat) || Number.isNaN(parsedLng) || Math.abs(parsedLat) > 90 || Math.abs(parsedLng) > 180)
    ) {
      setError('坐标格式不正确：纬度范围 -90 ~ 90，经度范围 -180 ~ 180。')
      return
    }
    if (!(form.duration > 0 && form.duration <= 600)) {
      setError('时长需在 1 ~ 600 秒之间。')
      return
    }
    onSave({
      ...form,
      lat: parsedLat,
      lng: parsedLng,
      id: form.id || `rec-${Date.now().toString(36)}`,
    })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <FormSection title="录音">
        <Field label="物种 *" htmlFor="rec-species">
          <select id="rec-species" className={inputClass} value={form.speciesId} onChange={(e) => set('speciesId', e.target.value)}>
            {species.map((s) => (
              <option key={s.id} value={s.id}>
                {`${s.nameZh} · ${s.nameEn}`}
              </option>
            ))}
          </select>
        </Field>
        <Field label="录音标题 *" htmlFor="rec-title">
          <input id="rec-title" className={inputClass} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="例如：萨福克林缘的黎明合唱" />
        </Field>
        <Field label="录音描述" htmlFor="rec-desc" className="sm:col-span-2">
          <textarea id="rec-desc" className={textareaClass} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </Field>
      </FormSection>

      <FormSection title="地点">
        <Field label="国家 *" htmlFor="rec-country">
          <input id="rec-country" className={inputClass} value={form.country} onChange={(e) => set('country', e.target.value)} />
        </Field>
        <Field label="地区" htmlFor="rec-region">
          <input id="rec-region" className={inputClass} value={form.region} onChange={(e) => set('region', e.target.value)} />
        </Field>
        <Field label="纬度" htmlFor="rec-lat" hint="可选，例如 52.19">
          <input id="rec-lat" inputMode="decimal" className={`${inputClass} font-mono`} value={lat} onChange={(e) => setLat(e.target.value)} />
        </Field>
        <Field label="经度" htmlFor="rec-lng" hint="可选，例如 1.52">
          <input id="rec-lng" inputMode="decimal" className={`${inputClass} font-mono`} value={lng} onChange={(e) => setLng(e.target.value)} />
        </Field>
      </FormSection>

      <FormSection title="时间与环境">
        <Field label="日期" htmlFor="rec-date">
          <input id="rec-date" type="date" className={inputClass} value={form.date} onChange={(e) => set('date', e.target.value)} />
        </Field>
        <Field label="时间" htmlFor="rec-time">
          <input id="rec-time" type="time" className={inputClass} value={form.time} onChange={(e) => set('time', e.target.value)} />
        </Field>
        <Field label="季节" htmlFor="rec-season">
          <select id="rec-season" className={inputClass} value={form.season} onChange={(e) => set('season', e.target.value as Season)}>
            {SEASONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="栖息地" htmlFor="rec-habitat">
          <select id="rec-habitat" className={inputClass} value={form.habitat} onChange={(e) => set('habitat', e.target.value as Habitat)}>
            {HABITATS.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </Field>
        <Field label="环境描述" htmlFor="rec-env" hint="例如：黎明前 · 微风 · 远处有溪流">
          <input id="rec-env" className={inputClass} value={form.environment} onChange={(e) => set('environment', e.target.value)} />
        </Field>
        <Field label="环境声" htmlFor="rec-amb">
          <select id="rec-amb" className={inputClass} value={form.ambience} onChange={(e) => set('ambience', e.target.value as Ambience)}>
            {Object.entries(AMBIENCE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      </FormSection>

      <FormSection title="来源与媒体">
        <Field label="来源类型" htmlFor="rec-kind">
          <select
            id="rec-kind"
            className={inputClass}
            value={form.source.kind}
            onChange={(e) => setSource('kind', e.target.value as 'audio' | 'video')}
          >
            <option value="audio">现场录音</option>
            <option value="video">视频音轨</option>
          </select>
        </Field>
        <Field label="时长（秒）" htmlFor="rec-dur">
          <input
            id="rec-dur"
            type="number"
            min={1}
            max={600}
            className={inputClass}
            value={form.duration}
            onChange={(e) => set('duration', Number(e.target.value))}
          />
        </Field>
        <Field label="录音者" htmlFor="rec-recordist">
          <input id="rec-recordist" className={inputClass} value={form.source.recordist} onChange={(e) => setSource('recordist', e.target.value)} />
        </Field>
        <Field label="设备" htmlFor="rec-eq">
          <input id="rec-eq" className={inputClass} value={form.source.equipment} onChange={(e) => setSource('equipment', e.target.value)} />
        </Field>
        <Field label="来源编号" htmlFor="rec-ref">
          <input id="rec-ref" className={`${inputClass} font-mono`} value={form.source.reference} onChange={(e) => setSource('reference', e.target.value)} placeholder="BS-ATL-0000" />
        </Field>
        <div />

        <Field label="上传音频" htmlFor="rec-audio" hint={form.mediaName ? `已选择：${form.mediaName}` : 'MP3 / WAV / M4A'}>
          <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border px-3 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground">
            <FileAudio className="size-4" aria-hidden="true" />
            选择音频文件
            <input
              id="rec-audio"
              type="file"
              accept="audio/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setForm((f) => ({ ...f, mediaUrl: URL.createObjectURL(file), mediaName: file.name }))
              }}
            />
          </label>
        </Field>
        <Field label="上传视频" htmlFor="rec-video" hint={form.videoName ? `已选择：${form.videoName}` : 'MP4 / MOV，可提取音轨'}>
          <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border px-3 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground">
            <Film className="size-4" aria-hidden="true" />
            选择视频文件
            <input
              id="rec-video"
              type="file"
              accept="video/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setForm((f) => ({
                  ...f,
                  videoUrl: URL.createObjectURL(file),
                  videoName: file.name,
                  source: { ...f.source, kind: 'video' },
                }))
              }}
            />
          </label>
        </Field>

        {form.videoUrl && (
          <video src={form.videoUrl} controls className="w-full rounded-xl border border-border sm:col-span-2" aria-label="视频预览" />
        )}

        <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/40 px-4 py-3 sm:col-span-2">
          <div className="flex items-center gap-3">
            <PreviewButton recording={form} profile={profile} />
            <p className="text-xs text-muted-foreground">
              {form.mediaUrl ? '预览已上传的音频' : '预览根据当前参数生成的示意声音'}
            </p>
          </div>
          <label className="flex items-center gap-3 text-sm">
            <span>{form.published ? '已发布' : '草稿'}</span>
            <Toggle checked={form.published} onChange={(v) => set('published', v)} label="发布到 Sound Atlas" />
          </label>
        </div>
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
        <PrimaryButton type="submit">{initial ? '保存修改' : '添加录音'}</PrimaryButton>
      </div>
    </form>
  )
}

export function RecordingForm(props: RecordingFormProps) {
  return (
    <AdminDialog
      open={props.open}
      onClose={props.onClose}
      title={props.initial ? '编辑录音' : '添加录音'}
      description="填写录音的地点、时间与来源信息。只有已发布的录音会出现在前台。"
    >
      <RecordingFormBody key={props.initial?.id ?? 'new'} {...props} />
    </AdminDialog>
  )
}

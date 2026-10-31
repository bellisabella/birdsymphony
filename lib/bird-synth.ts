import type { Ambience, VoiceProfile } from '@/lib/atlas-data'

interface Note {
  t: number
  d: number
  f0: number
  f1: number
  amp: number
  vib?: number
}

export interface SynthParams {
  profile: VoiceProfile
  duration: number
  seed: number
  pitch: number
  tempo: number
  ambience: Ambience
}

export interface RenderedRecording {
  buffer: AudioBuffer
  peaks: number[]
}

const SAMPLE_RATE = 22050
export const PEAK_COUNT = 180

function createRng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function composeNotes({ profile, duration, seed, pitch, tempo }: SynthParams): Note[] {
  const rand = createRng(seed)
  const range = (min: number, max: number) => min + rand() * (max - min)
  const notes: Note[] = []
  const end = duration - 0.4
  let t = range(0.3, 0.9)

  const push = (n: Note) => {
    if (n.t + n.d < end) notes.push({ ...n, f0: n.f0 * pitch, f1: n.f1 * pitch })
  }

  while (t < end) {
    switch (profile) {
      case 'cuckoo': {
        const calls = Math.round(range(3, 6))
        for (let i = 0; i < calls; i++) {
          push({ t, d: 0.2, f0: 730, f1: 700, amp: 0.55 })
          push({ t: t + 0.32, d: 0.32, f0: 600, f1: 575, amp: 0.5 })
          t += 0.95 / tempo
        }
        t += range(1.4, 2.4)
        break
      }
      case 'great-tit': {
        const reps = Math.round(range(4, 7))
        const hi = range(4000, 4500)
        const lo = range(2900, 3300)
        for (let i = 0; i < reps; i++) {
          push({ t, d: 0.11, f0: hi, f1: hi * 0.96, amp: 0.5 })
          push({ t: t + 0.15, d: 0.13, f0: lo, f1: lo * 0.92, amp: 0.45 })
          t += 0.34 / tempo
        }
        t += range(1.6, 2.6)
        break
      }
      case 'wren': {
        const phraseEnd = t + range(2.5, 4.5) / tempo
        while (t < phraseEnd) {
          const f = range(4200, 7000)
          push({ t, d: 0.035, f0: f, f1: f * range(0.8, 1.15), amp: range(0.3, 0.5) })
          t += range(0.045, 0.065) / tempo
        }
        t += range(1.4, 2.4)
        break
      }
      case 'skylark': {
        const f = range(2600, 6000)
        const d = range(0.04, 0.1)
        push({ t, d, f0: f, f1: f * range(0.75, 1.3), amp: range(0.22, 0.42), vib: rand() > 0.7 ? 40 : 0 })
        t += (d + range(0.01, 0.06)) / tempo
        if (rand() > 0.97) t += range(0.3, 0.7)
        break
      }
      case 'nightingale': {
        const base = range(1400, 2600)
        const reps = Math.round(range(4, 9))
        for (let i = 0; i < reps; i++) {
          push({ t, d: 0.06, f0: base, f1: base * 1.4, amp: 0.4 })
          t += 0.1 / tempo
        }
        if (rand() > 0.35) {
          const w = range(1600, 2400)
          push({ t: t + 0.05, d: 0.6, f0: w, f1: w * 1.02, amp: 0.45, vib: 18 })
          t += 0.75 / tempo
        }
        const trill = Math.round(range(6, 14))
        for (let i = 0; i < trill; i++) {
          const f = range(3000, 5200)
          push({ t, d: 0.03, f0: f, f1: f * 0.7, amp: 0.3 })
          t += 0.045 / tempo
        }
        t += range(1.1, 2)
        break
      }
      case 'hwamei': {
        const count = Math.round(range(5, 9))
        for (let i = 0; i < count; i++) {
          const f = range(1500, 3400)
          const d = range(0.14, 0.38)
          push({ t, d, f0: f, f1: f * range(0.7, 1.45), amp: range(0.35, 0.5), vib: rand() > 0.5 ? 12 : 0 })
          t += (d + range(0.04, 0.12)) / tempo
        }
        t += range(1, 1.8)
        break
      }
    }
  }
  return notes
}

function createNoiseBuffer(ctx: BaseAudioContext, duration: number, rand: () => number) {
  const buffer = ctx.createBuffer(1, Math.ceil(duration * ctx.sampleRate), ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = rand() * 2 - 1
  return buffer
}

const AMBIENCE_SETTINGS: Record<Ambience, { type: BiquadFilterType; freq: number; gain: number; echo: number }> = {
  forest: { type: 'bandpass', freq: 900, gain: 0.03, echo: 0.28 },
  wetland: { type: 'lowpass', freq: 500, gain: 0.05, echo: 0.12 },
  open: { type: 'highpass', freq: 2500, gain: 0.02, echo: 0.04 },
  urban: { type: 'lowpass', freq: 220, gain: 0.16, echo: 0.08 },
  mountain: { type: 'bandpass', freq: 400, gain: 0.05, echo: 0.4 },
}

export async function renderRecording(params: SynthParams): Promise<RenderedRecording> {
  const ctx = new OfflineAudioContext(1, Math.ceil(params.duration * SAMPLE_RATE), SAMPLE_RATE)
  const settings = AMBIENCE_SETTINGS[params.ambience]

  const master = ctx.createGain()
  master.gain.value = 0.9
  master.connect(ctx.destination)

  const dry = ctx.createGain()
  dry.connect(master)
  const delay = ctx.createDelay(1)
  delay.delayTime.value = 0.14
  const feedback = ctx.createGain()
  feedback.gain.value = settings.echo
  const wet = ctx.createGain()
  wet.gain.value = settings.echo
  dry.connect(delay)
  delay.connect(feedback)
  feedback.connect(delay)
  delay.connect(wet)
  wet.connect(master)

  for (const note of composeNotes(params)) {
    const osc = ctx.createOscillator()
    const harmonic = ctx.createOscillator()
    const env = ctx.createGain()
    const harmonicGain = ctx.createGain()
    harmonicGain.gain.value = 0.12

    osc.frequency.setValueAtTime(note.f0, note.t)
    osc.frequency.exponentialRampToValueAtTime(note.f1, note.t + note.d)
    harmonic.frequency.setValueAtTime(note.f0 * 2, note.t)
    harmonic.frequency.exponentialRampToValueAtTime(note.f1 * 2, note.t + note.d)

    if (note.vib) {
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.frequency.value = 28
      lfoGain.gain.value = note.vib * 4
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      lfo.start(note.t)
      lfo.stop(note.t + note.d)
    }

    const attack = Math.min(0.012, note.d * 0.25)
    env.gain.setValueAtTime(0, note.t)
    env.gain.linearRampToValueAtTime(note.amp, note.t + attack)
    env.gain.linearRampToValueAtTime(note.amp * 0.75, note.t + note.d * 0.7)
    env.gain.linearRampToValueAtTime(0, note.t + note.d)

    osc.connect(env)
    harmonic.connect(harmonicGain)
    harmonicGain.connect(env)
    env.connect(dry)
    osc.start(note.t)
    harmonic.start(note.t)
    osc.stop(note.t + note.d + 0.01)
    harmonic.stop(note.t + note.d + 0.01)
  }

  const noise = ctx.createBufferSource()
  noise.buffer = createNoiseBuffer(ctx, params.duration, createRng(params.seed * 7 + 3))
  const filter = ctx.createBiquadFilter()
  filter.type = settings.type
  filter.frequency.value = settings.freq
  const noiseGain = ctx.createGain()
  noiseGain.gain.value = settings.gain
  noise.connect(filter)
  filter.connect(noiseGain)
  noiseGain.connect(master)
  noise.start(0)

  const buffer = await ctx.startRendering()
  return { buffer, peaks: computePeaks(buffer) }
}

export function computePeaks(buffer: AudioBuffer, count = PEAK_COUNT) {
  const data = buffer.getChannelData(0)
  const size = Math.floor(data.length / count) || 1
  const peaks: number[] = []
  let globalMax = 0
  for (let i = 0; i < count; i++) {
    let max = 0
    const start = i * size
    for (let j = start; j < start + size && j < data.length; j++) {
      const v = Math.abs(data[j])
      if (v > max) max = v
    }
    peaks.push(max)
    if (max > globalMax) globalMax = max
  }
  return peaks.map((p) => (globalMax ? Math.max(0.04, p / globalMax) : 0.04))
}

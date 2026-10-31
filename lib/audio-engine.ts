'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import useSWR from 'swr'

import type { Recording, VoiceProfile } from '@/lib/atlas-data'
import { renderRecording, type RenderedRecording } from '@/lib/bird-synth'

interface PlaybackState {
  playingId: string | null
}

let audioContext: AudioContext | null = null
let currentSource: AudioBufferSourceNode | null = null
let startedAt = 0
let startOffset = 0
let state: PlaybackState = { playingId: null }
const pausedPositions = new Map<string, number>()
const listeners = new Set<() => void>()

function emit(next: PlaybackState) {
  state = next
  listeners.forEach((l) => l())
}

function getContext() {
  if (!audioContext) audioContext = new AudioContext()
  if (audioContext.state === 'suspended') void audioContext.resume()
  return audioContext
}

function stopSource() {
  if (currentSource) {
    currentSource.onended = null
    try {
      currentSource.stop()
    } catch {}
    currentSource.disconnect()
    currentSource = null
  }
}

export function getPosition(id: string) {
  if (state.playingId === id && audioContext) {
    return startOffset + (audioContext.currentTime - startedAt)
  }
  return pausedPositions.get(id) ?? 0
}

export function play(id: string, buffer: AudioBuffer, offset = getPosition(id)) {
  const ctx = getContext()
  if (state.playingId && state.playingId !== id) {
    pausedPositions.set(state.playingId, getPosition(state.playingId))
  }
  stopSource()
  const safeOffset = offset >= buffer.duration - 0.05 ? 0 : Math.max(0, offset)
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.connect(ctx.destination)
  source.onended = () => {
    if (currentSource !== source) return
    currentSource = null
    pausedPositions.set(id, 0)
    emit({ playingId: null })
  }
  source.start(0, safeOffset)
  currentSource = source
  startedAt = ctx.currentTime
  startOffset = safeOffset
  emit({ playingId: id })
}

export function pause() {
  if (!state.playingId) return
  pausedPositions.set(state.playingId, getPosition(state.playingId))
  stopSource()
  emit({ playingId: null })
}

export function seek(id: string, buffer: AudioBuffer, time: number) {
  if (state.playingId === id) play(id, buffer, time)
  else {
    pausedPositions.set(id, Math.max(0, Math.min(time, buffer.duration)))
    emit({ ...state })
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const serverState: PlaybackState = { playingId: null }

export function usePlaybackState() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => serverState,
  )
}

export function usePlaybackPosition(id: string) {
  const snapshot = usePlaybackState()
  const isPlaying = snapshot.playingId === id
  const [position, setPosition] = useState(0)

  useEffect(() => {
    setPosition(getPosition(id))
    if (!isPlaying) return
    let frame = 0
    const tick = () => {
      setPosition(getPosition(id))
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [id, isPlaying, snapshot])

  return { position, isPlaying }
}

export function useRenderedRecording(recording: Recording, profile: VoiceProfile) {
  const key = [
    'synth',
    recording.id,
    profile,
    recording.duration,
    recording.seed,
    recording.pitch,
    recording.tempo,
    recording.ambience,
  ] as const
  return useSWR<RenderedRecording>(
    key,
    () =>
      renderRecording({
        profile,
        duration: recording.duration,
        seed: recording.seed,
        pitch: recording.pitch,
        tempo: recording.tempo,
        ambience: recording.ambience,
      }),
    { revalidateOnFocus: false, revalidateOnReconnect: false, revalidateIfStale: false },
  )
}

'use client'

import { useEffect, useRef } from 'react'

type Props = {
  bass: number
  mid: number
  treble: number
  active: boolean
}

type Particle = { x: number; y: number; z: number; phase: number; size: number }

const PARTICLE_COUNT = 2500

function createParticles(): Particle[] {
  const points: Particle[] = []
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2
    const radius = Math.sqrt(1 - y * y)
    const theta = goldenAngle * i
    points.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
      phase: (i % 97) / 97 * Math.PI * 2,
      size: 0.65 + ((i * 17) % 10) / 10,
    })
  }
  return points
}

export function AudioParticleSphere({ bass, mid, treble, active }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const valuesRef = useRef({ bass, mid, treble, active })

  useEffect(() => {
    valuesRef.current = { bass, mid, treble, active }
  }, [bass, mid, treble, active])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const particles = createParticles()
    let frame = 0
    let raf = 0
    let width = 0
    let height = 0
    let rotationX = -0.18
    let rotationY = 0
    let dragX = 0
    let dragY = 0
    let pointerDown = false
    let lastX = 0
    let lastY = 0
    let smoothBass = 0
    let smoothMid = 0
    let smoothTreble = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    const onPointerDown = (event: PointerEvent) => {
      pointerDown = true
      lastX = event.clientX
      lastY = event.clientY
      dragX = rotationX
      dragY = rotationY
      canvas.setPointerCapture(event.pointerId)
    }
    const onPointerMove = (event: PointerEvent) => {
      if (!pointerDown) return
      dragY += (event.clientX - lastX) * 0.008
      dragX += (event.clientY - lastY) * 0.008
      lastX = event.clientX
      lastY = event.clientY
    }
    const onPointerUp = () => { pointerDown = false }
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)

    const draw = () => {
      frame += 1
      const values = valuesRef.current
      const ease = 0.09
      smoothBass += (values.bass / 100 - smoothBass) * ease
      smoothMid += (values.mid / 100 - smoothMid) * ease
      smoothTreble += (values.treble / 100 - smoothTreble) * ease

      if (!pointerDown) {
        rotationY += 0.0025 + smoothBass * 0.004
        dragY = rotationY
        rotationX += (dragX - rotationX) * 0.035
      } else {
        rotationX = dragX
        rotationY = dragY
      }
      const idlePulse = 1 + Math.sin(frame * 0.018) * 0.012
      const pulse = idlePulse + smoothBass * 0.16
      const radius = Math.min(width, height) * 0.34 * pulse
      context.clearRect(0, 0, width, height)

      const glow = context.createRadialGradient(width / 2, height / 2, 2, width / 2, height / 2, radius * 1.8)
      glow.addColorStop(0, `rgba(37, 190, 145, ${0.10 + smoothBass * 0.12})`)
      glow.addColorStop(0.55, 'rgba(34, 150, 120, 0.035)')
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)

      const cosY = Math.cos(rotationY)
      const sinY = Math.sin(rotationY)
      const cosX = Math.cos(rotationX)
      const sinX = Math.sin(rotationX)
      const projected: { x: number; y: number; z: number; alpha: number; size: number; color: string }[] = []

      for (const p of particles) {
        const wobble = 1 + Math.sin(frame * 0.025 + p.phase) * (0.008 + smoothTreble * 0.035)
        const px = p.x * wobble
        const py = p.y * wobble
        const pz = p.z * wobble
        const x1 = px * cosY - pz * sinY
        const z1 = px * sinY + pz * cosY
        const y1 = py * cosX - z1 * sinX
        const z2 = py * sinX + z1 * cosX
        const perspective = 2.8 / (2.8 - z2 * 0.55)
        const front = (z2 + 1) / 2
        const twinkle = 0.72 + Math.sin(frame * (0.035 + smoothTreble * 0.08) + p.phase) * (0.12 + smoothTreble * 0.32)
        const hue = 155 + front * 28 + smoothTreble * 22
        const lightness = 66 + front * 22 + smoothTreble * 8
        projected.push({
          x: width / 2 + x1 * radius * perspective,
          y: height / 2 + y1 * radius * perspective,
          z: z2,
          alpha: Math.max(0.12, (0.28 + front * 0.68) * twinkle),
          size: (0.65 + p.size * 0.85 + smoothMid * 1.4) * perspective,
          color: `hsl(${hue} 72% ${lightness}%)`,
        })
      }
      projected.sort((a, b) => a.z - b.z)
      for (const p of projected) {
        context.globalAlpha = p.alpha
        context.fillStyle = p.color
        context.beginPath()
        context.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        context.fill()
      }
      context.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
    }
  }, [])

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-primary/20 bg-[#071b19]">
      <div className="flex items-center justify-between px-4 pt-4">
        <div>
          <p className="text-xs tracking-[0.25em] text-primary uppercase">Sound Universe</p>
          <p className="mt-1 text-sm text-white/75">声音宇宙 · 实时粒子可视化</p>
        </div>
        <span className="rounded-full border border-white/15 px-2.5 py-1 text-[10px] text-white/60">{active ? 'LIVE' : 'STANDBY'}</span>
      </div>
      <canvas
        ref={canvasRef}
        aria-label="实时音频响应的 3D 粒子球体，可拖动旋转"
        className="h-[280px] w-full cursor-grab touch-none active:cursor-grabbing md:h-[320px]"
      />
      <p className="px-4 pb-4 text-center text-[11px] text-white/45">拖动球体可以旋转 · 粒子随声音变化</p>
    </div>
  )
}

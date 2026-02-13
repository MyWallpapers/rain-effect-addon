import { useRef, useEffect, useCallback } from 'react'
import { useSettings, useViewport } from '@mywallpaper/sdk-react'

interface RainSettings {
  rainColor: string
  rainIntensity: number
  rainSpeed: number
  dropLength: number
  dropWidth: number
  windAngle: number
  windVariation: number
  enableGlow: boolean
  glowIntensity: number
  depthLayers: number
}

const DEFAULTS: RainSettings = {
  rainColor: '#a8c8e8',
  rainIntensity: 200,
  rainSpeed: 1.7,
  dropLength: 42,
  dropWidth: 0.8,
  windAngle: -5,
  windVariation: 0,
  enableGlow: true,
  glowIntensity: 0.3,
  depthLayers: 3,
}

function hexToRgb(hex: string): string {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return r
    ? `rgb(${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)})`
    : 'rgb(168,200,232)'
}

function random(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

interface Drop {
  layer: number
  x: number
  y: number
  length: number
  width: number
  speedX: number
  speedY: number
  dirX: number
  dirY: number
  opacity: number
  glowWidth: number
}

function createDrop(
  layer: number,
  s: RainSettings,
  canvasW: number,
  canvasH: number,
  randomizeY: boolean,
): Drop {
  const layerFactor = 1 - (layer / s.depthLayers) * 0.6
  const length = s.dropLength * layerFactor * random(0.7, 1.3)
  const width = s.dropWidth * layerFactor * random(0.8, 1.2)
  const baseSpeed = s.rainSpeed * layerFactor * random(0.8, 1.2) * 15
  const windRad =
    ((s.windAngle + random(-s.windVariation, s.windVariation)) * Math.PI) / 180
  const speedX = Math.tan(windRad) * baseSpeed
  const speedY = baseSpeed
  const mag = Math.sqrt(speedX * speedX + speedY * speedY)

  const spawnPoint = random(0, canvasW + canvasH)
  let x: number
  let y: number
  if (spawnPoint < canvasW) {
    x = spawnPoint
    y = randomizeY ? random(0, canvasH) : random(-100, -20)
  } else {
    y = randomizeY ? random(0, canvasH) : spawnPoint - canvasW
    x = s.windAngle >= 0 ? random(-50, -10) : canvasW + random(10, 50)
  }

  return {
    layer,
    x,
    y,
    length,
    width,
    speedX,
    speedY,
    dirX: speedX / mag,
    dirY: speedY / mag,
    opacity: layerFactor * random(0.4, 0.9),
    glowWidth: s.enableGlow ? width * 3 : 0,
  }
}

function initDrops(
  s: RainSettings,
  canvasW: number,
  canvasH: number,
): Drop[] {
  const drops: Drop[] = []
  const dropsPerLayer = Math.floor(s.rainIntensity / s.depthLayers)
  for (let layer = 0; layer < s.depthLayers; layer++) {
    const count = Math.floor(dropsPerLayer * (1 + layer * 0.3))
    for (let i = 0; i < count; i++) {
      drops.push(createDrop(layer, s, canvasW, canvasH, true))
    }
  }
  drops.sort((a, b) => b.layer - a.layer)
  return drops
}

export default function RainEffect() {
  const raw = useSettings<Partial<RainSettings>>()
  const { width, height } = useViewport()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const s: RainSettings = {
    rainColor: raw.rainColor ?? DEFAULTS.rainColor,
    rainIntensity: raw.rainIntensity ?? DEFAULTS.rainIntensity,
    rainSpeed: raw.rainSpeed ?? DEFAULTS.rainSpeed,
    dropLength: raw.dropLength ?? DEFAULTS.dropLength,
    dropWidth: raw.dropWidth ?? DEFAULTS.dropWidth,
    windAngle: raw.windAngle ?? DEFAULTS.windAngle,
    windVariation: raw.windVariation ?? DEFAULTS.windVariation,
    enableGlow: raw.enableGlow ?? DEFAULTS.enableGlow,
    glowIntensity: raw.glowIntensity ?? DEFAULTS.glowIntensity,
    depthLayers: raw.depthLayers ?? DEFAULTS.depthLayers,
  }

  const settingsRef = useRef(s)
  settingsRef.current = s

  const resetDrop = useCallback(
    (drop: Drop, canvasW: number, canvasH: number) => {
      const fresh = createDrop(
        drop.layer,
        settingsRef.current,
        canvasW,
        canvasH,
        false,
      )
      Object.assign(drop, fresh)
    },
    [],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || width === 0 || height === 0) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = width * dpr
    canvas.height = height * dpr
    const ctx = canvas.getContext('2d', { alpha: true })!
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    let drops = initDrops(s, width, height)
    let rafId = 0
    let lastTime = performance.now()

    const animate = (currentTime: number) => {
      const deltaTime = Math.min(currentTime - lastTime, 50)
      lastTime = currentTime
      const dt = deltaTime * 0.06

      const cur = settingsRef.current
      const colorStr = hexToRgb(cur.rainColor)

      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = colorStr
      ctx.lineCap = 'round'

      for (let i = 0, len = drops.length; i < len; i++) {
        const drop = drops[i]
        drop.y += drop.speedY * dt
        drop.x += drop.speedX * dt

        if (drop.y > height || drop.x < -100 || drop.x > width + 100) {
          resetDrop(drop, width, height)
        }

        const halfLen = drop.length * 0.5
        const x1 = drop.x - drop.dirX * halfLen
        const y1 = drop.y - drop.dirY * halfLen
        const x2 = drop.x + drop.dirX * halfLen
        const y2 = drop.y + drop.dirY * halfLen

        if (cur.enableGlow) {
          ctx.globalAlpha = drop.opacity * cur.glowIntensity
          ctx.lineWidth = drop.glowWidth
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }

        ctx.globalAlpha = drop.opacity
        ctx.lineWidth = drop.width
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      ctx.globalAlpha = 1
      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      drops = []
    }
  }, [
    width,
    height,
    s.rainIntensity,
    s.depthLayers,
    s.rainSpeed,
    s.dropLength,
    s.dropWidth,
    s.windAngle,
    s.windVariation,
    s.enableGlow,
    s.glowIntensity,
    s.rainColor,
    resetDrop,
  ])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}

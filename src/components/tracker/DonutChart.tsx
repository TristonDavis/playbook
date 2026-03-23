'use client'

import { useEffect, useRef } from 'react'

interface Props {
  wins: number
  losses: number
  pushes: number
  winRate: number
}

export default function DonutChart({ wins, losses, pushes, winRate }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = canvas.offsetWidth
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const r = size / 2 - 16
    const inner = r * 0.6

    const segments = [
      { value: wins,   color: '#4ADE80' },
      { value: losses, color: '#F87171' },
      { value: pushes, color: '#94A3B8' },
    ].filter(s => s.value > 0)

    const total = wins + losses + pushes

    if (total === 0) {
      // Empty state ring
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, 2 * Math.PI)
      ctx.fillStyle = 'rgba(255,255,255,0.08)'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(cx, cy, inner, 0, 2 * Math.PI)
      ctx.fillStyle = '#111827'
      ctx.fill()
      ctx.fillStyle = '#475569'
      ctx.font = `bold ${size * 0.14}px "DM Mono", monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('—', cx, cy)
      return
    }

    let startAngle = -Math.PI / 2
    segments.forEach(seg => {
      const angle = (seg.value / total) * 2 * Math.PI
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, startAngle, startAngle + angle)
      ctx.closePath()
      ctx.fillStyle = seg.color
      ctx.fill()
      startAngle += angle
    })

    // Inner circle (donut hole)
    ctx.beginPath()
    ctx.arc(cx, cy, inner, 0, 2 * Math.PI)
    ctx.fillStyle = '#111827'
    ctx.fill()

    // Center text
    ctx.fillStyle = '#F1F5F9'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.font = `bold ${size * 0.18}px "DM Mono", monospace`
    ctx.fillText(winRate + '%', cx, cy + size * 0.07)
    ctx.font = `${size * 0.085}px "DM Sans", sans-serif`
    ctx.fillStyle = '#94A3B8'
    ctx.fillText('win rate', cx, cy + size * 0.2)
  }, [wins, losses, pushes, winRate])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '160px', height: '160px', display: 'block' }}
    />
  )
}

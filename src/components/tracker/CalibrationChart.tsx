'use client'

import { useEffect, useRef } from 'react'
import { CalibrationBucket } from '@/types'

export default function CalibrationChart({ buckets }: { buckets: CalibrationBucket[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    const pad = { top: 20, right: 16, bottom: 36, left: 42 }
    const cw = w - pad.left - pad.right
    const ch = h - pad.top - pad.bottom
    const gap = cw / buckets.length
    const barW = gap * 0.38

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 1
    ;[0, 25, 50, 75, 100].forEach(v => {
      const y = pad.top + ch - (v / 100) * ch
      ctx.beginPath()
      ctx.moveTo(pad.left, y)
      ctx.lineTo(pad.left + cw, y)
      ctx.stroke()
      ctx.fillStyle = '#475569'
      ctx.font = '10px "DM Sans", sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(v + '%', pad.left - 6, y + 4)
    })

    // Bars
    buckets.forEach((bucket, i) => {
      const cx = pad.left + i * gap + gap / 2

      // Expected bar (blue outline)
      const expH = (bucket.expected / 100) * ch
      ctx.fillStyle = 'rgba(37,99,235,0.15)'
      ctx.strokeStyle = '#60A5FA'
      ctx.lineWidth = 1
      ctx.beginPath()
      const eX = cx - barW - 3
      const eY = pad.top + ch - expH
      ctx.roundRect(eX, eY, barW, expH, [3, 3, 0, 0])
      ctx.fill()
      ctx.stroke()

      // Actual bar
      if (bucket.actual !== null) {
        const actH = (bucket.actual / 100) * ch
        const isGood = bucket.actual >= bucket.expected - 8
        ctx.fillStyle = isGood ? '#4ADE80' : '#F87171'
        ctx.beginPath()
        ctx.roundRect(cx + 3, pad.top + ch - actH, barW, actH, [3, 3, 0, 0])
        ctx.fill()

        // Value label above bar
        ctx.fillStyle = isGood ? '#4ADE80' : '#F87171'
        ctx.font = 'bold 10px "DM Mono", monospace'
        ctx.textAlign = 'center'
        ctx.fillText(bucket.actual + '%', cx + 3 + barW / 2, pad.top + ch - actH - 5)
      } else {
        // No data bar
        ctx.fillStyle = 'rgba(255,255,255,0.08)'
        ctx.beginPath()
        ctx.roundRect(cx + 3, pad.top + ch - 8, barW, 8, [3, 3, 0, 0])
        ctx.fill()
        ctx.fillStyle = '#475569'
        ctx.font = '9px "DM Sans", sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('n/a', cx + 3 + barW / 2, pad.top + ch - 11)
      }

      // X-axis label
      ctx.fillStyle = '#94A3B8'
      ctx.font = '11px "DM Sans", sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(bucket.label, cx, h - 8)
    })
  }, [buckets])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '180px', display: 'block' }} />
}

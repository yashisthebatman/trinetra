import React, { useEffect, useMemo, useRef, useState } from 'react'

type BarChartProps = {
  title?: string
  labels: string[]
  data: number[]
  max?: number
  barColor?: string
  gridColor?: string
  height?: number
  animate?: boolean
}

// Smooth ease for animation
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export default function BarChart({
  title,
  labels,
  data,
  max,
  barColor = '#60a5fa',
  gridColor = 'rgba(255,255,255,0.08)',
  height = 220,
  animate = true
}: BarChartProps) {
  const N = labels.length
  const baseW = 600 // viewBox width for responsive scaling
  const xPadding = 24
  const yPaddingTop = 10
  const xLabelBand = 26 // space for x-axis labels at the bottom
  const innerHeight = height - xLabelBand - yPaddingTop
  const gridLines = 4

  const safeMax = useMemo(() => {
    const m = Math.max(1, ...data)
    return max && max > m ? max : m
  }, [data, max])

  // Animate 0 -> 1
  const [prog, setProg] = useState(animate ? 0 : 1)
  const rafRef = useRef<number | null>(null)
  useEffect(() => {
    if (!animate) {
      setProg(1)
      return
    }
    let start: number | null = null
    const dur = 800
    const tick = (ts: number) => {
      if (start === null) start = ts
      const t = Math.min(1, (ts - start) / dur)
      setProg(easeOutCubic(t))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [data.join(','), animate])

  // Pre-calc geometry in viewBox space
  const vbW = baseW
  const vbH = innerHeight
  const plotLeft = xPadding
  const plotRight = vbW - xPadding
  const plotWidth = plotRight - plotLeft
  const gap = Math.max(6, plotWidth * 0.02)
  const barWidth = Math.max(8, (plotWidth - gap * (N - 1)) / Math.max(1, N))

  const bars = data.map((v, i) => {
    const frac = Math.max(0, Math.min(1, v / safeMax))
    const h = vbH * frac * prog
    const x = plotLeft + i * (barWidth + gap)
    const y = yPaddingTop + (vbH - h)
    return { x, y, w: barWidth, h }
  })

  return (
    <div style={{
      borderRadius: 12,
      border: '1px solid rgba(255,255,255,0.12)',
      background: 'rgba(2,6,23,0.6)',
      padding: 16
    }}>
      {title && <div style={{ fontWeight: 700, marginBottom: 12 }}>{title}</div>}

      <div style={{ position: 'relative', height }}>
        {/* SVG Plot area (bars + grid) */}
        <svg
          width="100%"
          height={height - xLabelBand}
          viewBox={`0 0 ${vbW} ${yPaddingTop + vbH}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={title || 'Bar chart'}
          style={{ display: 'block' }}
        >
          {/* Horizontal grid */}
          {Array.from({ length: gridLines }).map((_, i) => {
            const y = yPaddingTop + ((i + 1) / gridLines) * vbH
            return (
              <line
                key={i}
                x1={plotLeft}
                x2={plotRight}
                y1={y}
                y2={y}
                stroke={gridColor}
                strokeWidth={1}
              />
            )
          })}

          {/* Bars */}
          {bars.map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              rx={6}
              fill={barColor}
            />
          ))}
        </svg>

        {/* X-axis labels */}
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: xLabelBand,
          display: 'grid',
          gridTemplateColumns: `repeat(${labels.length}, 1fr)`,
          gap: 10
        }}>
          {labels.map((l, i) => (
            <div
              key={i}
              style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12 }}
              aria-hidden
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
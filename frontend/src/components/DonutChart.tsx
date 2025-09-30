import React, { useEffect, useMemo, useState } from 'react'

type Slice = { label: string; value: number; color: string }
type DonutChartProps = {
  title?: string
  slices: Slice[]
  size?: number
  thickness?: number
  animate?: boolean
  legend?: boolean
}

export default function DonutChart({
  title,
  slices,
  size = 220,
  thickness = 24,
  animate = true,
  legend = true
}: DonutChartProps) {
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  const total = Math.max(1, slices.reduce((a, b) => a + b.value, 0))
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!animate) return
    const id = window.setTimeout(() => setActive(true), 50)
    return () => window.clearTimeout(id)
  }, [animate, slices.map(s => s.value).join(',')])

  const metrics = useMemo(() => {
    let acc = 0
    return slices.map((s) => {
      const frac = s.value / total
      const len = frac * circumference
      const seg = {
        strokeDasharray: `${len} ${circumference - len}`,
        strokeDashoffset: -(acc * circumference),
        color: s.color,
        label: s.label,
        value: s.value
      }
      acc += frac
      return seg
    })
  }, [slices, total, circumference])

  return (
    <div style={{
      borderRadius: 12,
      border: '1px solid rgba(255,255,255,0.12)',
      background: 'rgba(2,6,23,0.6)',
      padding: 16,
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ fontWeight: 700, marginBottom: 12, position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
        {title}
      </div>

      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={title || 'Chart'}>
          <g transform={`translate(${size / 2}, ${size / 2})`}>
            {/* Track */}
            <circle
              r={radius}
              fill="transparent"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={thickness}
            />
            {/* Slices */}
            {metrics.map((m, i) => (
              <circle
                key={i}
                r={radius}
                fill="transparent"
                stroke={m.color}
                strokeWidth={thickness}
                strokeDasharray={m.strokeDasharray}
                strokeDashoffset={active ? m.strokeDashoffset : circumference}
                style={{
                  transition: 'stroke-dashoffset 900ms cubic-bezier(.2,.7,0,1)',
                  transitionDelay: `${i * 120}ms`
                }}
              />
            ))}
          </g>
        </svg>
        {/* Center label */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>Total</div>
          <div style={{ fontWeight: 800, fontSize: 22 }}>{total}</div>
        </div>
      </div>

      {legend && (
        <div style={{ display: 'grid', gap: 8, marginLeft: 8 }}>
          {slices.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 10, height: 10, borderRadius: 2, background: s.color,
                display: 'inline-block'
              }} />
              <span style={{ color: '#cbd5e1', fontSize: 13, minWidth: 90 }}>{s.label}</span>
              <span style={{ color: '#94a3b8', fontSize: 12 }}>{s.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
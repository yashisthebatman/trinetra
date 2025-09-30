import React from 'react'

export default function ProgressBar({
  percent,
  label
}: {
  percent: number
  label?: string
}) {
  const pct = Math.max(0, Math.min(100, Math.round(percent)))
  return (
    <div style={{
      width: '100%',
      background: 'rgba(255,255,255,0.08)',
      borderRadius: 8,
      border: '1px solid rgba(255,255,255,0.12)',
      overflow: 'hidden'
    }}>
      <div style={{
        width: `${pct}%`,
        height: 10,
        background: 'linear-gradient(90deg, #4f46e5, #22d3ee)',
        transition: 'width 200ms ease'
      }} />
      <div style={{ marginTop: 8, fontSize: 13, color: '#cbd5e1' }}>
        {label ?? `${pct}%`}
      </div>
    </div>
  )
}
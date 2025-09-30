import React from 'react'
import BarChart from '../components/BarChart'
import DonutChart from '../components/DonutChart'

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: 16,
      borderRadius: 12,
      border: '1px solid rgba(255,255,255,0.12)',
      background: 'rgba(2,6,23,0.6)'
    }}>
      {children}
    </div>
  )
}

function Pill({ text, color }: { text: string; color: string }) {
  return (
    <span style={{
      padding: '6px 10px',
      borderRadius: 9999,
      background: color,
      color: '#0b1020',
      fontWeight: 700,
      fontSize: 12
    }}>{text}</span>
  )
}

export default function HomePage() {
  // Mock data (no API calls)
  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weekCounts = [4, 3, 5, 2, 7, 1, 4] // matches S12 visual
  const categories = [
    { label: 'Finance', value: 14, color: '#3b82f6' },    // blue
    { label: 'HR Policy', value: 6, color: '#f97316' },   // orange
    { label: 'Safety', value: 9, color: '#22c55e' },      // green
    { label: 'Technical', value: 7, color: '#eab308' },   // amber
  ]
  const criticalItems = [
    {
      title: 'Safety Bulletin: Emergency Shutdown Procedure Update',
      summary: 'Immediate update to shutdown protocols for all Series‑7 machinery. Action required by all plant supervisors within 48 hours.',
      tag: 'Safety Bulletin',
      tagColor: '#fb7185', // rose
      age: '2 Days Ago',
    },
    {
      title: 'Vendor Contract Renewal – Critical Deadline Approaching',
      summary: 'The master services agreement with OmniCorp expires in 15 days. Finance team must review and approve renewal terms.',
      tag: 'Contract',
      tagColor: '#60a5fa', // blue
      age: '3 Days Ago',
    },
    {
      title: 'Q3 Financial Compliance Report – Final Draft',
      summary: 'Final draft of the quarterly compliance report for board review. Contains audited figures and risk assessments.',
      tag: 'Finance',
      tagColor: '#fde047', // yellow
      age: '5 Days Ago',
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Dashboard</h1>
      <div style={{ color: '#94a3b8', marginBottom: 16 }}>
        A high‑level overview of document activity.
      </div>

      {/* Top row: Bar + Donut */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        marginBottom: 16
      }}>
        <BarChart
  title="Documents Processed This Week"
  labels={weekLabels}
  data={weekCounts}
  barColor="#60a5fa"
  height={220}
  animate
  max={8}
/>
        <DonutChart
          title="Document Categories"
          slices={categories}
          size={240}
          thickness={26}
          animate
          legend
        />
      </div>

      {/* Critical items */}
      <div style={{
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(2,6,23,0.6)',
        padding: 16
      }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>Recent Critical Items</div>
        <div style={{ display: 'grid', gap: 0 }}>
          {criticalItems.map((it, idx) => (
            <div key={idx} style={{
              padding: '14px 8px',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'center',
              borderTop: idx === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)'
            }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{it.title}</div>
                <div style={{ color: '#94a3b8' }}>{it.summary}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Pill text={it.tag} color={it.tagColor} />
                <div style={{ color: '#94a3b8', fontSize: 12 }}>{it.age}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
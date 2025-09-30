import React from 'react'
import BarChart from '../components/BarChart'
import DonutChart from '../components/DonutChart'
import { countByCategory } from '../mock/mockDocuments';

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
  // Use real data from mock files
  const categoryCounts = countByCategory();
  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weekCounts = [4, 3, 5, 2, 7, 1, 4]
  const categories = [
    { label: 'Finance', value: categoryCounts['Finance'], color: '#3b82f6' },
    { label: 'Safety', value: categoryCounts['Safety'], color: '#ef4444' },
    { label: 'Legal', value: categoryCounts['Legal/Compliance'], color: '#f97316' },
    { label: 'Analytics', value: categoryCounts['Analytics'], color: '#8b5cf6' },
    { label: 'Contract', value: categoryCounts['Contract'], color: '#eab308' },
    { label: 'Other', value: categoryCounts['Technical'] + categoryCounts['HR'], color: '#64748b' },
  ].filter(c => c.value > 0);

  const criticalItems = [
    {
      title: 'Quarterly Performance Report (Q1 FY 2025-26)',
      summary: 'Daily average ridership reached 215,000 passengers, a 12% YoY increase. The debt servicing ratio is strong at 1.45.',
      tag: 'Finance',
      tagColor: '#3b82f6',
      age: '2 Days Ago',
    },
    {
      title: 'Safety Incident Report: Escalator Malfunction',
      summary: 'A minor incident occurred involving an escalator at Palarivattom. A system-wide check of all "Model-B" units is recommended.',
      tag: 'Safety',
      tagColor: '#ef4444',
      age: '3 Days Ago',
    },
    {
      title: 'MoHUA Directive on Green Energy Standards',
      summary: 'Mandates 60% renewable energy use by 2030 and rooftop solar panel installation by 2027. Non-compliance penalties up to ₹5 crore.',
      tag: 'Legal/Compliance',
      tagColor: '#f97316',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 24 }}>
                <Pill text={it.tag} color={it.tagColor} />
                <div style={{ color: '#94a3b8', fontSize: 12, whiteSpace: 'nowrap' }}>{it.age}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
import React from 'react'

function Tile({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div style={{
      padding: 16, borderRadius: 12,
      background: 'rgba(2,6,23,0.6)',
      border: '1px solid rgba(255,255,255,0.12)',
      textAlign: 'center'
    }}>
      <div style={{ color: '#94a3b8', fontSize: 12 }}>{title}</div>
      <div style={{ marginTop: 6, fontWeight: 800, color }}>{value}</div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Admin Panel</h1>
      <div style={{ color: '#94a3b8', marginBottom: 16 }}>System health and monitoring.</div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: 16
      }}>
        <Tile title="API Server" value="Online" color="#22c55e" />
        <Tile title="Analyst agent" value="Active" color="#22c55e" />
        <Tile title="Database" value="Connected" color="#22c55e" />
        <Tile title="In Queue" value="12 Pending files" color="#f59e0b" />
      </div>
    </div>
  )
}
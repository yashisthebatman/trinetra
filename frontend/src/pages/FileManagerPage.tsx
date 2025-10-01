import React from 'react'
import { Link } from 'react-router-dom'
import { countByCategory, categoriesOrder } from '../mock/mockDocuments'

export default function FileManagerPage() {
  const counts = countByCategory()

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>File Manager</h1>
      <div style={{ color: '#94a3b8', marginBottom: 16 }}>Browse documents by category.</div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16
      }}>
        {categoriesOrder.map((cat) => (
          <Link
            key={cat}
            to={`/file-manager/${encodeURIComponent(cat)}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: 18,
              borderRadius: 14,
              background: 'rgba(2,6,23,0.6)',
              border: '1px solid rgba(255,255,255,0.12)',
              textDecoration: 'none',
              color: 'white'
            }}
          >
            <div style={{
              width: 48, height: 36, borderRadius: 6,
              border: '2px solid #60a5fa'
            }} />
            <div>
              <div style={{ fontWeight: 700 }}>{cat}</div>
              <div style={{ color: '#94a3b8', fontSize: 12 }}>{counts[cat] || 0} documents</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
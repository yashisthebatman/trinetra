import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { docsForCategory } from '../mock/mockDocuments'

export default function FileManagerCategoryPage() {
  const { category = '' } = useParams()
  const docs = docsForCategory(category as any)

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{category} Documents</h1>
          <div style={{ color: '#94a3b8' }}>Select a document to view its details.</div>
        </div>
        <Link to="/file-manager" style={{
          padding: '8px 12px',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'white',
          textDecoration: 'none',
          fontSize: 13
        }}>Back</Link>
      </div>

      <div style={{
        display: 'grid', gap: 16,
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))'
      }}>
        {docs.map(d => {
          const clickable = d.status === 'COMPLETED'
          const badgeClass = d.status === 'COMPLETED' ? 'status-badge completed' : 'status-badge pending'
          return (
            <Link
              key={d.id}
              to={clickable ? `/file-manager/${encodeURIComponent(category!)}/${d.id}` : '#'}
              onClick={e => { if (!clickable) e.preventDefault() }}
              aria-disabled={!clickable}
              className="doc-card"
              style={{
                position: 'relative',
                display: 'block',
                padding: 18,
                paddingRight: 100, // ensure text never hides under the badge
                borderRadius: 14,
                background: 'rgba(2,6,23,0.6)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'white',
                textDecoration: 'none',
                opacity: clickable ? 1 : 0.7,
                cursor: clickable ? 'pointer' : 'default',
                minWidth: 0 // allow inner text to respect overflow rules
              }}
            >
              <div className={badgeClass}>{d.status}</div>

              <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                <div className="doc-title">{d.filename}</div>
                <div className="doc-subtitle">
                  {clickable ? `Uploaded: ${d.uploadDate}` : 'This file is under review.'}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
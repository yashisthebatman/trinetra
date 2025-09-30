import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDoc } from '../mock/mockDocuments'

export default function DocumentMockViewPage() {
  const { docId = '', category = '' } = useParams()
  const doc = getDoc(docId)

  const entities = useMemo(() => doc?.extractedEntities || [], [doc])

  if (!doc) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 12 }}>
          <Link to={`/file-manager/${encodeURIComponent(category)}`} style={{
            padding: '8px 12px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.12)', color: 'white', textDecoration: 'none'
          }}>Back</Link>
        </div>
        <div style={{ color: '#fecaca' }}>Document not found.</div>
      </div>
    )
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>{doc.filename}</h1>
          <div style={{ color: '#94a3b8' }}>Category: <span style={{ color: '#60a5fa', textDecoration: 'underline' }}>{doc.category}</span></div>
        </div>
        <Link to={`/file-manager/${encodeURIComponent(category)}`} style={{
          padding: '8px 12px', borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.12)', color: 'white', textDecoration: 'none', fontSize: 13
        }}>Back</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ display: 'grid', gap: 20 }}>
          <div style={{
            padding: 16, borderRadius: 12, background: 'rgba(2,6,23,0.6)',
            border: '1px solid rgba(255,255,255,0.12)'
          }}>
            <div style={{ fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#fbbf24' }}>✦</span> AI Summary
            </div>
            {Array.isArray(doc.summary) && doc.summary.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {doc.summary.map((s, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>{s}</li>
                ))}
              </ul>
            ) : <div style={{ color: '#64748b' }}>No summary available.</div>}
          </div>

          <div style={{
            padding: 16, borderRadius: 12, background: 'rgba(2,6,23,0.6)',
            border: '1px solid rgba(255,255,255,0.12)'
          }}>
            <div style={{ fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#60a5fa' }}>≡</span> Extracted Entities
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {entities.length === 0 && <div style={{ color: '#64748b' }}>No structured entities.</div>}
              {entities.map((e, idx) => (
                <div key={idx} style={{
                  display: 'grid', gridTemplateColumns: '220px 1fr', gap: 10,
                  padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <div style={{ color: '#94a3b8' }}>{e.key}</div>
                  <div style={{ fontWeight: 600 }}>{e.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          padding: 16, borderRadius: 12, background: 'rgba(2,6,23,0.6)',
          border: '1px solid rgba(255,255,255,0.12)'
        }}>
          <div style={{ fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🗎</span> Document Source
          </div>
          <div style={{
            height: 520, overflowY: 'auto',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8, padding: 12, color: '#cbd5e1'
          }}>
            {(doc.fullText || 'Source text not available.')}
          </div>
        </div>
      </div>
    </div>
  )
}
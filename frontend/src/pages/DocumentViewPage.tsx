import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDocument } from '../lib/apiClient'
import type { DocumentResponse } from '../types'

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      marginTop: 16,
      padding: 16,
      borderRadius: 12,
      background: 'rgba(2,6,23,0.6)',
      border: '1px solid rgba(255,255,255,0.12)'
    }}>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: 9999,
      border: '1px solid rgba(255,255,255,0.12)',
      background: 'rgba(255,255,255,0.06)',
      fontSize: 12,
      marginRight: 6,
      marginBottom: 6
    }}>{children}</span>
  )
}

function Skeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{
          height: 12,
          borderRadius: 6,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.12), rgba(255,255,255,0.06))',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.2s infinite',
          marginBottom: 10
        }} />
      ))}
      <style>
        {`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}
      </style>
    </div>
  )
}

function KeyValue({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '180px 1fr',
      gap: 12,
      padding: '8px 0',
      borderBottom: '1px dashed rgba(255,255,255,0.08)'
    }}>
      <div style={{ color: '#94a3b8' }}>{label}</div>
      <div>{value}</div>
    </div>
  )
}

function renderAny(value: any): React.ReactNode {
  if (value == null) return <span style={{ color: '#64748b' }}>—</span>
  if (Array.isArray(value)) {
    if (value.length === 0) return <span style={{ color: '#64748b' }}>—</span>
    if (typeof value[0] === 'string') {
      return <ul style={{ margin: 0, paddingLeft: 18 }}>{value.map((s, i) => <li key={i}>{s}</li>)}</ul>
    }
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        {value.map((row, idx) => (
          <div key={idx} style={{
            padding: 10,
            borderRadius: 8,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            {typeof row === 'object'
              ? Object.entries(row).map(([k, v]) => (
                <KeyValue key={k} label={k} value={renderAny(v)} />
                ))
              : String(row)}
          </div>
        ))}
      </div>
    )
  }
  if (typeof value === 'object') {
    return (
      <div>
        {Object.entries(value).map(([k, v]) => (
          <KeyValue key={k} label={k} value={renderAny(v)} />
        ))}
      </div>
    )
  }
  return <span>{String(value)}</span>
}

export default function DocumentViewPage() {
  const { docId } = useParams<{ docId: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [doc, setDoc] = useState<DocumentResponse | null>(null)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    let mounted = true
    const start = Date.now()
    const t = window.setInterval(() => setElapsed(Math.round((Date.now() - start) / 1000)), 1000)

    async function run() {
      try {
        if (!docId) throw new Error('Missing document id')
        const data = await getDocument(docId)
        if (mounted) setDoc(data)
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load document')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
      window.clearInterval(t)
    }
  }, [docId])

  const citations = useMemo(() => {
    const raw = (doc as any)?.summary?.citations || []
    return Array.isArray(raw) ? raw : []
  }, [doc])

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>
            {doc?.filename || 'Document'}
          </h1>
          <div style={{ color: '#94a3b8', marginTop: 6 }}>
            {doc ? <>Pages: {doc.page_count} • OCR: {doc.ocr_applied ? 'Yes' : 'No'} {doc.language_primary ? <>• Language: {doc.language_primary}</> : null}</> : 'Loading…'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/directory" style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'white',
            textDecoration: 'none',
            fontSize: 13
          }}>Back to Directory</Link>
          <Link to="/search" style={{
            padding: '8px 12px',
            borderRadius: 8,
            background: 'linear-gradient(90deg, #4f46e5, #22d3ee)',
            color: 'white',
            textDecoration: 'none',
            fontSize: 13
          }}>Semantic Search</Link>
        </div>
      </div>

      {loading && (
        <SectionCard title={`Fetching insights… (${elapsed}s)`}>
          <Skeleton rows={6} />
          <div style={{ marginTop: 8, color: '#64748b', fontSize: 12 }}>
            This can take a moment for large files.
          </div>
        </SectionCard>
      )}

      {error && !loading && (
        <SectionCard title="Error">
          <div style={{ color: '#fecaca' }}>{error}</div>
        </SectionCard>
      )}

      {!loading && !error && doc && (
        <>
          <SectionCard title="Summary">
            {Array.isArray((doc as any).summary?.summary_bullets) ? (
              <>
                <ul style={{ marginTop: 0 }}>
                  {(doc as any).summary.summary_bullets.map((b: string, i: number) => <li key={i}>{b}</li>)}
                </ul>
                {citations.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    {citations.map((c: any, i: number) => (
                      <Chip key={i}>
                        p.{c.page_start === c.page_end ? c.page_start : `${c.page_start}–${c.page_end}`}
                      </Chip>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ color: '#64748b' }}>No summary available.</div>
            )}
          </SectionCard>

          <SectionCard title="Classification">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Chip>{doc.classification?.label || 'Unknown'}</Chip>
              {typeof doc.classification?.confidence === 'number' && (
                <span style={{ color: '#94a3b8' }}>
                  Confidence: {(doc.classification.confidence * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Targeted Extraction">
            {doc.extraction && Object.keys(doc.extraction).length > 0 ? (
              renderAny(doc.extraction)
            ) : (
              <div style={{ color: '#64748b' }}>No structured fields extracted.</div>
            )}
          </SectionCard>

          <SectionCard title="Pages">
            <div style={{ display: 'grid', gap: 10 }}>
              {doc.pages.map(p => (
                <div key={p.page_number} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderRadius: 8,
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Page {p.page_number}</div>
                    <div style={{ color: '#94a3b8', fontSize: 12 }}>
                      Images: {p.has_images ? 'Yes' : 'No'}
                      {p.lang_detected ? <> • Lang: {p.lang_detected}</> : null}
                    </div>
                  </div>
                  <div style={{ color: '#64748b', fontSize: 12 }}>
                    {p.text_len} chars
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}
    </div>
  )
}
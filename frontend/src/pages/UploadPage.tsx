import React, { useCallback, useState } from 'react'
import Uploader from '../components/Uploader'
import ProgressBar from '../components/ProgressBar'
import { UploadManyResponse, UploadProgress, UploadResponse, DocumentResponse } from '../types'
import { mockUploadResults } from '../mock/mockUploadResults';

// --- (The Card, Chip, and Insight components remain unchanged) ---
function Card({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div style={{
      padding: 16,
      borderRadius: 12,
      background: 'rgba(2,6,23,0.6)',
      border: '1px solid rgba(255,255,255,0.12)'
    }}>
      {title && <h3 style={{ marginTop: 0, marginBottom: 8 }}>{title}</h3>}
      {children}
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: 9999,
      background: 'rgba(99,102,241,0.2)',
      border: '1px solid rgba(99,102,241,0.4)',
      color: '#e0e7ff',
      fontSize: 12
    }}>{children}</span>
  )
}

function Insight({ doc }: { doc: DocumentResponse }) {
  const summaryBullets = doc.summary?.summary_bullets || [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{doc.filename}</div>
        </div>

        <div style={{ color: '#94a3b8', marginBottom: 12 }}>
          Pages: {doc.page_count} • OCR: {doc.ocr_applied ? 'Yes' : 'No'} {doc.language_primary ? <>• Language: {doc.language_primary}</> : null}
        </div>

        <div style={{ fontWeight: 700, marginBottom: 8 }}>Summary</div>
        {summaryBullets.length > 0 ? (
          <ul style={{ marginTop: 0, paddingLeft: '20px' }}>
            {summaryBullets.map((b: string, i: number) => <li key={i} dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}/>)}
          </ul>
        ) : <div style={{ color: '#64748b' }}>No summary available.</div>}

        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontWeight: 700 }}>Classification</div>
          <Chip>{doc.classification?.label || 'Unknown'}</Chip>
          {typeof doc.classification?.confidence === 'number' && (
            <span style={{ color: '#94a3b8' }}>Confidence: {(doc.classification.confidence * 100).toFixed(1)}%</span>
          )}
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Extracted Entities</div>
          {doc.extraction && Object.keys(doc.extraction).length > 0
 ? (
            <div style={{ display: 'grid', gap: 6 }}>
              {Object.entries(doc.extraction).slice(0, 8).map(([k, v]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 8 }}>
                  <div style={{ color: '#94a3b8' }}>{k.replace(/_/g, ' ')}</div>
                  <div>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</div>
                </div>
              ))}
            </div>
          ) : <div style={{ color: '#64748b' }}>No structured fields extracted.</div>}
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Source Document Preview</div>
        <div style={{
          borderRadius: 8, padding: 12, minHeight: 200,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          color: '#94a3b8'
        }}>
          A text preview is not available in this build. Enable page text API to show source snippets.
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Pages</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {doc.pages.map((p) => (
              <div key={p.page_number} style={{
                display: 'flex', justifyContent: 'space-between',
                borderRadius: 8, padding: '8px 10px',
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Page {p.page_number}</div>
                  <div style={{ color: '#94a3b8', fontSize: 12 }}>
                    Images: {p.has_images ? 'Yes' : 'No'}
                    {p.lang_detected ? <> • Lang: {p.lang_detected}</> : null}
                  </div>
                </div>
                <div style={{ color: '#64748b', fontSize: 12 }}>{p.text_len} chars</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}


export default function UploadPage() {
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState<UploadProgress | null>(null)
  const [result, setResult] = useState<UploadManyResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [insights, setInsights] = useState<Record<string, DocumentResponse>>({})

  // ========== CHANGE 1: Add state to track the current index ==========
  const [mockResultIndex, setMockResultIndex] = useState(0);

  const handleUpload = useCallback(async (files: File[]) => {
    setBusy(true);
    setResult(null);
    setError(null);
    setInsights({});

    // Simulate upload process
    setProgress({ phase: 'preparing', percent: 1, message: 'Preparing upload…' });
    await new Promise(res => setTimeout(res, 300));
    setProgress({ phase: 'uploading', percent: 30, message: 'Uploading…' });
    await new Promise(res => setTimeout(res, 800));
    setProgress({ phase: 'processing', percent: 65, message: 'Parsing & AI Analysis…' });
    await new Promise(res => setTimeout(res, 1500));
    
    const mockResponses: UploadResponse[] = files.map((file, index) => {
      // ========== CHANGE 2: Use the state index for cycling ==========
      const currentMockIndex = (mockResultIndex + index) % mockUploadResults.length;
      const mockData = mockUploadResults[currentMockIndex];
      return {
        doc_id: mockData.doc_id + `-${Date.now()}-${index}`,
        filename: file.name,
        page_count: mockData.page_count,
        ocr_applied: mockData.ocr_applied,
        language_primary: mockData.language_primary,
        error: null,
      };
    });

    const finalResult: UploadManyResponse = { results: mockResponses };
    setResult(finalResult);
    
    const finalInsights: Record<string, DocumentResponse> = {};
    finalResult.results.forEach((res, index) => {
        if (res.doc_id) {
            const currentMockIndex = (mockResultIndex + index) % mockUploadResults.length;
            const mockData = mockUploadResults[currentMockIndex];
            finalInsights[res.doc_id] = {
              ...mockData,
              filename: res.filename,
              doc_id: res.doc_id,
            };
        }
    });
    setInsights(finalInsights);
    
    // ========== CHANGE 3: Update the index for the next upload ==========
    setMockResultIndex(prevIndex => (prevIndex + files.length) % mockUploadResults.length);

    setProgress({ phase: 'done', percent: 100, message: 'Completed' });
    setBusy(false);

  }, [mockResultIndex]); // Add mockResultIndex to the dependency array

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Upload New Document</h1>
      <p style={{ color: '#94a3b8', marginBottom: 16 }}>Select a PDF or DOCX file to process.</p>
      <div style={{
        padding: 16, borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(2,6,23,0.6)',
        display: 'flex', alignItems: 'center', gap: 12
      }}>
        <Uploader onUpload={handleUpload} loading={busy} />
      </div>

      {progress && (
        <div style={{
          marginTop: 16, padding: 16, borderRadius: 12,
          background: 'rgba(2,6,23,0.6)', border: '1px solid rgba(255,255,255,0.12)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: 9999,
              background: progress.phase === 'error' ? '#ef4444' : progress.phase === 'done' ? '#22c55e' : '#38bdf8'
            }} />
            <div style={{ fontWeight: 600 }}>{progress.message}</div>
          </div>
          <ProgressBar percent={progress.percent} label={`${progress.percent}%`} />
          <div style={{ marginTop: 10, fontSize: 12, color: '#64748b' }}>
            {progress.phase === 'uploading' && 'Transferring files to server…'}
            {progress.phase === 'processing' && 'Processing on server (this may take a minute for large files)…'}
            {progress.phase === 'done' && 'Completed. Rendering insights below.'}
            {progress.phase === 'error' && 'An error occurred. See message above.'}
          </div>
        </div>
      )}

      {result && (
        <div style={{ marginTop: 16 }}>
          <Card title="Upload Results">
            {result.results.length === 0 && <div>No results returned.</div>}
            {result.results.length > 0 && (
              <div style={{ display: 'grid', gap: 12 }}>
                {result.results.map((r: UploadResponse, idx: number) => (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: 12, borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.02)'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.filename}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>
                        {r.error ? <span style={{ color: '#ef4444' }}>Failed: {r.error}</span> : <>Pages: {r.page_count} • OCR: {r.ocr_applied ? 'Yes' : 'No'}</>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {result.results.filter(r => r.doc_id && !r.error).map((r) => {
            const d = insights[r.doc_id]
            return (
              <div key={r.doc_id} style={{ marginTop: 16 }}>
                {d ? <Insight doc={d} /> : (
                  <Card>
                    <div style={{ color: '#94a3b8' }}>Generating insights for {r.filename}…</div>
                  </Card>
                )}
              </div>
            )
          })}
        </div>
      )}

      {error && (
        <div style={{
          marginTop: 16, padding: 12, borderRadius: 8,
          background: 'rgba(127,29,29,0.25)',
          border: '1px solid rgba(239,68,68,0.5)', color: '#fecaca'
        }}>
          {error}
        </div>
      )}
    </div>
  )
}
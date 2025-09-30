// frontend/src/pages/SearchPage.tsx

import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Search from '../components/Search'; // This now correctly imports the input bar
import { RAGResponse } from '../types';

interface ChatMessage {
  type: 'query' | 'response';
  content: string | RAGResponse;
}

export default function SearchPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchParams] = useSearchParams();
  const docName = searchParams.get('docName');

  const handleSearch = async (query: string) => {
    setError(null);
    setLoading(true);
    setMessages((prev) => [...prev, { type: 'query', content: query }]);

    // Simulate network delay for a realistic feel
    setTimeout(() => {
      const mockResponse: RAGResponse = {
        answer:
          `Based on the provided documents, here is a technical analysis of your query:\n\n` +
          `**Primary Finding:**\n` +
          `The "Model-B" escalator series exhibits a critical vulnerability in the main gearbox bearing under high-load conditions, as documented in the Q3 Safety Report.\n\n` +
          `**Recommended Actions:**\n` +
          `1. **Immediate Audit:** Initiate a system-wide, Level-3 inspection of all "Model-B" escalator gearboxes.\n` +
          `2. **Protocol Update:** Revise the maintenance protocol to mandate the use of high-viscosity, synthetic lubricant and reduce the inspection interval to 90 days.`,
        sources: [
          {
            doc_id: 'doc-001',
            chunk_id: 'chunk-abc-123',
            score: 0.913,
            page_start: 2,
            page_end: 2,
            snippet:
              '...The root cause analysis points towards a faulty bearing in the main gearbox. Recommendations include an immediate, system-wide check of \'Model-B\' escalators...',
          },
          {
            doc_id: 'doc-003',
            chunk_id: 'chunk-def-456',
            score: 0.845,
            page_start: 18,
            page_end: 18,
            snippet:
              '...Maintenance Schedule (Section 4.2): Lubricant for the main gearbox assembly (Part #78B-4) should be checked every 180 days...',
          },
        ],
      };
      setMessages((prev) => [...prev, { type: 'response', content: mockResponse }]);
      setLoading(false);
    }, 1500); // 1.5 second delay
  };

  return (
    <div className="chat-layout">
      <header className="header">
        <h1>Semantic Search (Q&A)</h1>
        <p className="muted">Ask a question to get a direct answer from your documents.</p>
        {docName && (
          <div
            style={{
              marginTop: '12px',
              padding: '10px',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              color: '#bfdbfe',
            }}
          >
            Asking questions in the context of: <strong>{docName}</strong>
          </div>
        )}
      </header>

      <div className="chat-window">
        {messages.length === 0 && !loading && (
            <div className="chat-placeholder">
                Your conversation will appear here.
            </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.type}`}>
            {msg.type === 'query' ? (
              <p>{msg.content as string}</p>
            ) : (
              <div>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
                  {(msg.content as RAGResponse).answer}
                </pre>
                <details style={{ marginTop: '16px', cursor: 'pointer' }}>
                  <summary className="muted">Sources</summary>
                  <div style={{ marginTop: '8px', display: 'grid', gap: '8px' }}>
                    {(msg.content as RAGResponse).sources.map((hit) => (
                      <div key={hit.chunk_id} className="search-hit-card">
                        <pre className="snippet">{hit.snippet}</pre>
                        <div className="card-row muted" style={{ fontSize: '12px' }}>
                          <span>Relevance: {hit.score.toFixed(3)}</span>
                          <span>Page: {hit.page_start}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>
        ))}
        {loading && <div className="chat-bubble response"><p>Analyzing documents...</p></div>}
        {error && <div className="chat-bubble response error">{error}</div>}
      </div>

      <div className="chat-input-area">
        <Search onSearch={handleSearch} loading={loading} />
      </div>
    </div>
  );
}
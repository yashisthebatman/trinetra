// frontend/src/pages/SearchPage.tsx

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Search from '../components/Search';
import { RAGResponse, SearchHit } from '../types';

interface ChatMessage {
  type: 'query' | 'response';
  content: string | RAGResponse;
}

// --- Mock RAG Responses ---
const mockResponses: Record<string, RAGResponse> = {
  default: {
    answer: "I'm sorry, I couldn't find a direct answer to that in the documents. Could you try rephrasing your question?",
    sources: [],
  },
  greeting: {
    answer: "Hello! I am Trinetra, your document intelligence assistant. How can I help you today? You can ask me questions about ridership, safety reports, financial performance, or specific directives.",
    sources: [],
  },
  ridership: {
    answer:
      "The daily average ridership for Q1 FY 2025-26 was **215,000 passengers**, which is a **12% increase** year-over-year. Preparatory surveys for the Kakkanad corridor suggest a potential ridership increase of 30% after Phase II is completed.",
    sources: [
      {
        doc_id: 'doc-kpi-q1-2025',
        filename: 'Q1_FY2025-26_Performance_Report.pdf',
        chunk_id: 'chunk-abc-123',
        score: 0.95,
        page_start: 1,
        page_end: 1,
        snippet: '...Daily Average Ridership: 215,000 passengers (↑ 12% YoY)...',
      },
      {
        doc_id: 'doc-kpi-q1-2025',
        filename: 'Q1_FY2025-26_Performance_Report.pdf',
        chunk_id: 'chunk-def-456',
        score: 0.88,
        page_start: 2,
        page_end: 2,
        snippet: '...Kakkanad corridor preparatory surveys indicate potential ridership increase of 30% post-Phase II completion...',
      },
    ],
  },
  escalator: {
    answer:
      "A safety incident report from **August 5th, 2025**, identified a recurring mechanical fault in **'Model-B' escalators** at Palarivattom station. The root cause was determined to be a faulty bearing in the main gearbox. The key recommendation is to conduct an immediate, system-wide check of all 'Model-B' escalators.",
    sources: [
      {
        doc_id: 'doc-001',
        filename: 'Escalator_Incident_Report_Palarivattom.pdf',
        chunk_id: 'chunk-ghi-789',
        score: 0.98,
        page_start: 1,
        page_end: 1,
        snippet: "...Documents a minor incident involving an escalator (Model-B) malfunction at Palarivattom station on August 5th, 2025...",
      },
      {
        doc_id: 'doc-001',
        filename: 'Escalator_Incident_Report_Palarivattom.pdf',
        chunk_id: 'chunk-jkl-101',
        score: 0.92,
        page_start: 1,
        page_end: 1,
        snippet: "...The root cause analysis points towards a faulty bearing in the main gearbox. Recommendations include an immediate, system-wide check of 'Model-B' escalators...",
      },
    ],
  },
  revenue: {
      answer: "In Q1 FY 2025-26, the total revenue was **₹89.9 Cr**. This was composed of **₹68.5 Cr** from farebox revenue and **₹21.4 Cr** from non-fare sources like advertisements and retail leases. The Debt Servicing Ratio was a healthy **1.45**.",
      sources: [
          {
            doc_id: 'doc-kpi-q1-2025',
            filename: 'Q1_FY2025-26_Performance_Report.pdf',
            chunk_id: 'chunk-mno-222',
            score: 0.99,
            page_start: 1,
            page_end: 1,
            snippet: '...Farebox Revenue: ₹68.5 Cr (↑ 10% YoY). Non-Fare Revenue (advertisements, retail leases): ₹21.4 Cr († 18% YoY)...',
          },
      ]
  },
  green_energy: {
      answer: "The MoHUA directive mandates that at least **60% of power** must be from renewable sources (solar, wind, etc.) by **2030**. Additionally, all depots and stations must have rooftop solar panels by **2027**, and feeder services must be **100% electric by 2028**. Non-compliance can lead to penalties of up to **₹5 crore annually**.",
      sources: [
          {
            doc_id: 'doc-mohua-directive',
            filename: 'MoHUA_Green_Energy_Directive_2025-47.pdf',
            chunk_id: 'chunk-pqr-333',
            score: 0.97,
            page_start: 1,
            page_end: 1,
            snippet: "...At least 60% of traction and non-traction power must be sourced from solar, wind, or hybrid sources by 2030...",
          },
           {
            doc_id: 'doc-mohua-directive',
            filename: 'MoHUA_Green_Energy_Directive_2025-47.pdf',
            chunk_id: 'chunk-stu-444',
            score: 0.91,
            page_start: 1,
            page_end: 1,
            snippet: "...Non-compliance will result in reduced central assistance and penalties up to ₹5 crore annually...",
          },
      ]
  }
};

const getMockResponse = (query: string): RAGResponse => {
    const q = query.toLowerCase();
    if (q.includes('hello') || q.includes('hi') || q.includes('hey')) return mockResponses.greeting;
    if (q.includes('ridership') || q.includes('passengers')) return mockResponses.ridership;
    if (q.includes('escalator') || q.includes('safety') || q.includes('palarivattom')) return mockResponses.escalator;
    if (q.includes('revenue') || q.includes('financial') || q.includes('money')) return mockResponses.revenue;
    if (q.includes('green energy') || q.includes('mohua') || q.includes('solar') || q.includes('renewable')) return mockResponses.green_energy;
    return mockResponses.default;
}

export default function SearchPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchParams] = useSearchParams();
  const docName = searchParams.get('docName');

  useEffect(() => {
    // Greet the user on initial load
    if (messages.length === 0) {
      setMessages([{ type: 'response', content: mockResponses.greeting }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (query: string) => {
    setError(null);
    setLoading(true);
    setMessages((prev) => [...prev, { type: 'query', content: query }]);

    // Simulate network delay for a realistic feel
    setTimeout(() => {
      const response = getMockResponse(query);
      setMessages((prev) => [...prev, { type: 'response', content: response }]);
      setLoading(false);
    }, 1500); // 1.5 second delay
  };

  const Answer = ({ text }: { text: string }) => {
    const html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <p dangerouslySetInnerHTML={{ __html: html }} style={{ margin: 0 }} />;
  };

  return (
    <div className="chat-page-container">
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
        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.type}`}>
            {msg.type === 'query' ? (
              <p style={{ margin: 0 }}>{msg.content as string}</p>
            ) : (
              <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                <Answer text={(msg.content as RAGResponse).answer} />
                {(msg.content as RAGResponse).sources.length > 0 && (
                  <details style={{ marginTop: '16px', cursor: 'pointer' }}>
                    <summary className="muted">Sources</summary>
                    <div style={{ marginTop: '8px', display: 'grid', gap: '8px' }}>
                      {(msg.content as RAGResponse).sources.map((hit: SearchHit & { filename?: string }) => (
                        <div key={hit.chunk_id} className="search-hit-card">
                           <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                            Source: <strong>{hit.filename || hit.doc_id}</strong>
                          </div>
                          <pre className="snippet" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{hit.snippet}</pre>
                          <div className="card-row muted" style={{ fontSize: '12px', marginTop: '8px' }}>
                            <span>Relevance: {hit.score.toFixed(3)}</span>
                            <span>Page: {hit.page_start}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
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
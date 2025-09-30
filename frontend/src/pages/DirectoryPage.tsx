import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MockDoc } from '../mock/mockDocuments';
import { useDocuments } from '../context/DocumentContext';

export default function DirectoryPage() {
  const { documents } = useDocuments();
  const [openMenuDocId, setOpenMenuDocId] = useState<string | null>(null);
  const [openReportId, setOpenReportId] = useState<string | null>(null); // State for accordion
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Separate reports from other documents
  const reports = documents.filter(doc => doc.source === 'Complaint Report');
  const regularDocuments = documents.filter(doc => doc.source !== 'Complaint Report');

  // Group reports by importance
  const reportsByImportance = reports.reduce((acc, report) => {
    const importance = report.importance;
    if (!acc[importance]) {
      acc[importance] = [];
    }
    acc[importance].push(report);
    return acc;
  }, {} as Record<MockDoc['importance'], MockDoc[]>);

  const importanceOrder: MockDoc['importance'][] = ['Critical', 'High', 'Medium', 'Low'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuDocId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRemove = (docId: string) => {
    alert(`In a real app, this would permanently remove document ${docId}. For this demo, it is not removed from the list.`);
    setOpenMenuDocId(null);
  };

  const handleAskAboutDoc = (doc: MockDoc) => {
    setOpenMenuDocId(null);
    navigate(`/search?docId=${doc.id}&docName=${encodeURIComponent(doc.filename)}`);
  };

  const handleDownload = (doc: MockDoc) => {
    alert(`Simulating download for: ${doc.filename}`);
    setOpenMenuDocId(null);
  };

  const getSourceBadgeColor = (source: MockDoc['source']) => {
    switch (source) {
      case 'Direct Upload': return '#3b82f6';
      case 'WhatsApp Bot': return '#22c55e';
      case 'Email Import': return '#f97316';
      case 'Complaint Report': return '#a855f7';
      default: return '#6b7280';
    }
  };

  const getImportanceBadgeStyle = (importance: MockDoc['importance']): React.CSSProperties => {
    const styles: { [key: string]: React.CSSProperties } = {
      Critical: { background: '#991b1b', color: '#fecaca' },
      High: { background: '#b45309', color: '#fde68a' },
      Medium: { background: '#0e7490', color: '#a5f3fc' },
      Low: { background: '#1e3a8a', color: '#dbeafe' },
    };
    return styles[importance] || { background: '#4b5563', color: '#e5e7eb' };
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Document Directory</h1>
      <div style={{ color: '#94a3b8', marginBottom: 24 }}>
        Manage all uploaded documents and reports.
      </div>

      {/* --- NEW REPORTS SECTION --- */}
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: 8 }}>Actionable Reports</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        {importanceOrder.map(importance => (
          reportsByImportance[importance] && (
            <div key={importance}>
              <h3 style={{ marginTop: 0, marginBottom: 12, color: '#e2e8f0' }}>{importance}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {reportsByImportance[importance].map(report => (
                  <div key={report.id} style={{ background: 'rgba(2,6,23,0.6)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden' }}>
                    <button
                      onClick={() => setOpenReportId(openReportId === report.id ? null : report.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.04)',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{report.title || report.filename}</span>
                      <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 12, ...getImportanceBadgeStyle(report.importance) }}>
                        {report.importance}
                      </span>
                    </button>
                    {openReportId === report.id && (
                      <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1' }}>
                        <p><strong>Details:</strong> {report.details}</p>
                        {report.summary && report.summary.length > 0 && (
                          <>
                            <strong>Summary:</strong>
                            <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
                              {report.summary.map((item, index) => <li key={index}>{item}</li>)}
                            </ul>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
        {reports.length === 0 && <p style={{ color: '#94a3b8' }}>No complaint reports found.</p>}
      </div>


      {/* --- ALL DOCUMENTS SECTION (EXISTING TABLE) --- */}
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.12)', paddingBottom: 8 }}>All Documents</h2>
      <div style={{
        background: 'rgba(2,6,23,0.6)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 12,
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
              <th style={{ padding: 12, textAlign: 'left' }}>Filename</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Source</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Importance</th>
              <th style={{ padding: 12, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {regularDocuments.map((doc) => (
              <tr key={doc.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <td style={{ padding: 12, fontWeight: 600 }}>{doc.filename}</td>
                <td style={{ padding: 12 }}>
                  <span style={{ padding: '4px 8px', borderRadius: 999, fontSize: 12, background: getSourceBadgeColor(doc.source), color: 'white' }}>
                    {doc.source}
                  </span>
                </td>
                <td style={{ padding: 12 }}>
                   <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 12, ...getImportanceBadgeStyle(doc.importance) }}>
                    {doc.importance}
                   </span>
                </td>
                <td style={{ padding: 12, textAlign: 'center', position: 'relative' }}>
                  <button
                    onClick={() => setOpenMenuDocId(openMenuDocId === doc.id ? null : doc.id)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle>
                    </svg>
                  </button>
                  {openMenuDocId === doc.id && (
                    <div ref={menuRef} style={{
                      position: 'absolute',
                      right: 40,
                      top: 40,
                      background: '#1f2937',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 8,
                      zIndex: 10,
                      width: 160,
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.4)'
                    }}>
                      <Link to={`/file-manager/${doc.category}/${doc.id}`} target="_blank" rel="noopener noreferrer" style={menuItemStyle} onClick={() => setOpenMenuDocId(null)}>View Document</Link>
                      <button style={menuItemStyle} onClick={() => handleAskAboutDoc(doc)}>Ask about doc</button>
                      <button style={menuItemStyle} onClick={() => handleDownload(doc)}>Download</button>
                      <button style={{...menuItemStyle, color: '#fca5a5'}} onClick={() => handleRemove(doc.id)}>Remove</button>
                   </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper style for dropdown menu items
const menuItemStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '10px 12px',
  width: '100%',
  textAlign: 'left',
  color: 'white',
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'block'
};
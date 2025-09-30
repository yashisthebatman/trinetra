// frontend/src/pages/KnowledgeGraph.tsx

import React, { useState, useMemo } from 'react';
import { getAllStations } from '../mock/mockStationData';
import { getAllDocs, MockDoc } from '../mock/mockDocuments';

// --- Hardcoded Data & Configuration ---
const stationOrder = ['aluva', 'palarivattom', 'kaloor'];
const documentStationLinks: Record<string, string> = {
  'doc-001': 'palarivattom', 'doc-002': 'kaloor', 'doc-003': 'palarivattom', 'doc-004': 'kaloor', 'doc-005': 'aluva',
};
const colors: Record<MockDoc['importance'], string> = {
  Critical: '#ef4444', High: '#f97316', Medium: '#3b82f6', Low: '#22c55e',
};

// --- Detail Panel Component ---
const GraphDetailPanel = ({ selectedNodeId, documents, stationNodes }: { selectedNodeId: string | null; documents: any[]; stationNodes: any[] }) => {
  const selectedData = useMemo(() => {
    if (!selectedNodeId) return null;
    const station = stationNodes.find(s => s.id === selectedNodeId);
    if (station) return { type: 'station', data: station.data };
    const doc = documents.find(d => d.id === selectedNodeId);
    if (doc) return { type: 'document', data: doc };
    return null;
  }, [selectedNodeId, documents, stationNodes]);

  if (!selectedData) {
    return (
      <aside style={{ width: '320px', flexShrink: 0, background: 'rgba(2,6,23,0.6)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 16, color: '#94a3b8' }}>
        <h3 style={{ marginTop: 0, color: 'white' }}>Details</h3>
        <p>Click on a node in the graph to view its details here.</p>
      </aside>
    );
  }

  return (
    <aside style={{ width: '320px', flexShrink: 0, background: 'rgba(2,6,23,0.6)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 16 }}>
      {selectedData.type === 'station' && (
        <>
          <h3 style={{ marginTop: 0 }}>{selectedData.data.name}</h3>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>{selectedData.data.analysis.summary}</p>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
          <strong>Linked Documents:</strong>
          <ul>
            {documents.filter(d => documentStationLinks[d.id] === selectedData.data.id).map(doc => (
              <li key={doc.id}>{doc.filename}</li>
            ))}
          </ul>
        </>
      )}
      {selectedData.type === 'document' && (
          <>
          <h3 style={{ marginTop: 0, wordBreak: 'break-word' }}>{selectedData.data.filename}</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 12, background: colors[selectedData.data.importance], color: 'white' }}>
              {selectedData.data.importance}
            </span>
              <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 12, background: '#4b5563', color: 'white' }}>
              {selectedData.data.category}
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>{selectedData.data.details}</p>
        </>
      )}
    </aside>
  );
};

// --- Main Knowledge Graph Component ---
export default function KnowledgeGraph() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const stations = getAllStations().sort((a, b) => stationOrder.indexOf(a.id) - stationOrder.indexOf(b.id));
  const documents = getAllDocs();
  
  const stationNodes = useMemo(() => stations.map((station, i) => ({ id: station.id, data: station, x: 150 + i * 300, y: 300 })), [stations]);
  const documentNodes = useMemo(() => documents.filter(doc => documentStationLinks[doc.id]).map(doc => ({ id: doc.id, data: doc, stationId: documentStationLinks[doc.id] })), [documents]);
  
  const selectedDoc = documentNodes.find(d => d.id === selectedNodeId);

  return (
    <div style={{ display: 'flex', gap: 16, height: '100%', width: '100%' }}>
      <div style={{
        flexGrow: 1, position: 'relative', background: 'rgba(2,6,23,0.6)',
        border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12
      }}>
        <svg width="100%" height="100%" viewBox="0 0 1000 600" onClick={() => setSelectedNodeId(null)}>
          {/* Render lines first */}
          {stationNodes.slice(0, -1).map((s, i) => <line key={`c-${s.id}`} x1={s.x} y1={s.y} x2={stationNodes[i + 1].x} y2={stationNodes[i + 1].y} stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="5,5"/>)}
          {stationNodes.map(s => documentNodes.filter(d => d.stationId === s.id).map((d, i, arr) => {
              const angle = (Math.PI / (arr.length + 1)) * (i + 1) - (Math.PI / 2);
              const docX = s.x + 120 * Math.cos(angle);
              const docY = s.y + 120 * Math.sin(angle);
              const isSelected = selectedNodeId === d.id;
              const isConnected = selectedNodeId === s.id || (selectedDoc && selectedDoc.stationId === s.id);
              return <line key={`l-${d.id}`} x1={s.x} y1={s.y} x2={docX} y2={docY} stroke={isSelected || isConnected ? colors[d.data.importance] : 'rgba(255,255,255,0.15)'} strokeWidth={isSelected || isConnected ? 2 : 1} style={{transition: 'all 300ms ease', opacity: !selectedNodeId || isSelected || isConnected ? 1 : 0.2}}/>
          }))}
          
          {/* Render nodes on top */}
          {documentNodes.map((doc) => {
              const station = stationNodes.find(s => s.id === doc.stationId);
              if (!station) return null;
              const linkedDocs = documentNodes.filter(d => d.stationId === station.id);
              const docIndex = linkedDocs.findIndex(d => d.id === doc.id);
              const angle = (Math.PI / (linkedDocs.length + 1)) * (docIndex + 1) - (Math.PI / 2);
              const docX = station.x + 120 * Math.cos(angle);
              const docY = station.y + 120 * Math.sin(angle);
              const isSelected = selectedNodeId === doc.id;
              const isConnected = selectedNodeId === station.id || (selectedDoc && selectedDoc.stationId === station.id);
              return <circle key={doc.id} cx={docX} cy={docY} r="12" fill={colors[doc.data.importance]} stroke={isSelected ? 'white' : '#0b0f14'} strokeWidth="3" onClick={(e) => { e.stopPropagation(); setSelectedNodeId(doc.id); }} style={{cursor: 'pointer', transition: 'all 300ms ease', opacity: !selectedNodeId || isSelected || isConnected ? 1 : 0.3}}/>
          })}
          {stationNodes.map(s => {
              const isSelected = selectedNodeId === s.id;
              const isConnected = selectedDoc && selectedDoc.stationId === s.id;
              return <g key={s.id} onClick={(e) => { e.stopPropagation(); setSelectedNodeId(s.id); }} style={{cursor: 'pointer'}}>
                  <circle cx={s.x} cy={s.y} r="40" fill="#1e3a8a" stroke={isSelected ? 'white' : '#60a5fa'} strokeWidth={isSelected ? 4 : 3} style={{transition: 'all 300ms ease', opacity: !selectedNodeId || isSelected || isConnected ? 1 : 0.3}}/>
                  <text x={s.x} y={s.y + 5} textAnchor="middle" fill="white" fontWeight="bold" fontSize="12" style={{pointerEvents: 'none', transition: 'all 300ms ease', opacity: !selectedNodeId || isSelected || isConnected ? 1 : 0.3}}>{s.data.name.split(' ')[0]}</text>
              </g>
          })}
        </svg>
      </div>
      <GraphDetailPanel selectedNodeId={selectedNodeId} documents={documents} stationNodes={stationNodes} />
    </div>
  );
}
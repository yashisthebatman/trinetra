import React, { useState, useEffect } from 'react';
import { getAllStations, getStationById, Station, Comment, Reply } from '../mock/mockStationData';

// Helper component for an SVG icon
function SvgIcon({ path, size = 16 }: { path: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

// Reusable Comment Card component
const CommentCard = ({ comment, onVote, onToggleReply, onAddReply, isReplying, replyText, setReplyText }: any) => {
  const getImportanceBadgeStyle = (importance: Comment['importance']): React.CSSProperties => {
    const styles: { [key: string]: React.CSSProperties } = {
      Critical: { background: '#991b1b', color: '#fecaca', border: '1px solid #ef4444' },
      High: { background: '#b45309', color: '#fde68a', border: '1px solid #f59e0b' },
      Medium: { background: '#0e7490', color: '#a5f3fc', border: '1px solid #06b6d4' },
      Low: { background: '#1e3a8a', color: '#dbeafe', border: '1px solid #60a5fa' },
    };
    return styles[importance];
  };

  return (
    <div style={{ padding: 16, borderRadius: 12, background: 'rgba(2,6,23,0.6)', border: '1px solid rgba(255,255,255,0.12)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <p style={{ margin: 0, color: '#cbd5e1' }}>{comment.text}</p>
        <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 12, flexShrink: 0, marginLeft: 16, ...getImportanceBadgeStyle(comment.importance) }}>
          {comment.importance}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => onVote(comment.id, 'up')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><SvgIcon path="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></button>
          <span style={{ fontWeight: 'bold', color: 'white', minWidth: '20px', textAlign: 'center' }}>{comment.upvotes - comment.downvotes}</span>
          <button onClick={() => onVote(comment.id, 'down')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><SvgIcon path="M10 15v-5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></button>
        </div>
        <button onClick={() => onToggleReply(comment.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
          {isReplying ? 'Cancel' : 'Reply'}
        </button>
      </div>
      <div style={{ marginTop: 12, paddingLeft: 24, borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
        {comment.replies.map((reply: Reply) => (
          <div key={reply.id} style={{ marginBottom: 8 }}>
            <strong style={{ color: 'white' }}>{reply.author}</strong>
            <p style={{ margin: '4px 0 0 0', color: '#9ca3af' }}>{reply.text}</p>
          </div>
        ))}
        {isReplying && (
          <div style={{ marginTop: 8 }}>
            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a reply..." className="input" style={{ width: '100%', minHeight: '60px' }} />
            <button onClick={() => onAddReply(comment.id)} className="btn primary" style={{ marginTop: 8 }}>Submit Reply</button>
          </div>
        )}
      </div>
    </div>
  );
};


export default function StationAnalyticsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    setStations(getAllStations());
  }, []);

  const handleSelectStation = (stationId: string) => {
    const station = getStationById(stationId);
    // Sort comments by importance when a station is selected
    setSelectedStation(station ? { ...station, comments: [...station.comments].sort((a, b) => {
      const importanceOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return importanceOrder[b.importance] - importanceOrder[a.importance];
    }) } : null);
    setReplyingTo(null);
  };

  const handleVote = (commentId: string, voteType: 'up' | 'down') => {
    if (!selectedStation) return;
    const updatedComments = selectedStation.comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, [voteType === 'up' ? 'upvotes' : 'downvotes']: comment[voteType === 'up' ? 'upvotes' : 'downvotes'] + 1 };
      }
      return comment;
    });
    setSelectedStation({ ...selectedStation, comments: updatedComments });
  };

  const handleAddReply = (commentId: string) => {
    if (!selectedStation || !replyText.trim()) return;
    const newReply: Reply = {
      id: `reply-${Date.now()}`,
      author: 'S. Analyst',
      text: replyText.trim(),
    };
    const updatedComments = selectedStation.comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, replies: [...comment.replies, newReply] };
      }
      return comment;
    });
    setSelectedStation({ ...selectedStation, comments: updatedComments });
    setReplyText('');
    setReplyingTo(null);
  };

  // Filter comments by sentiment for categorization
  const negativeComments = selectedStation?.comments.filter(c => c.sentiment === 'Negative') || [];
  const positiveComments = selectedStation?.comments.filter(c => c.sentiment === 'Positive') || [];
  const neutralComments = selectedStation?.comments.filter(c => c.sentiment === 'Neutral') || [];

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', padding: 24, gap: 24 }}>
      {/* Side Panel */}
      <aside style={{
        width: '280px', flexShrink: 0, background: 'rgba(2,6,23,0.6)',
        border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 16
      }}>
        <h3 style={{ marginTop: 0 }}>Select Station</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {stations.map(station => (
            <button
              key={station.id}
              onClick={() => handleSelectStation(station.id)}
              className="btn"
              style={{ textAlign: 'left', background: selectedStation?.id === station.id ? '#2563eb' : undefined }}
            >
              {station.name}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingRight: '10px' }}>
        {!selectedStation ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
            <p>Select a station from the panel to view its comments and analysis.</p>
          </div>
        ) : (
          <div>
            <h1 style={{ margin: '0 0 16px 0' }}>{selectedStation.name}</h1>
            <div style={{ padding: 16, borderRadius: 12, background: 'rgba(2,6,23,0.8)', border: '1px solid rgba(255,255,255,0.12)', marginBottom: 24 }}>
              <h3 style={{ marginTop: 0 }}>Analysis Summary</h3>
              <p style={{ margin: 0, color: '#94a3b8' }}>
                Overall sentiment is <strong>{selectedStation.analysis.overallSentiment}</strong>. {selectedStation.analysis.summary}
              </p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Negative Comments Section */}
              {negativeComments.length > 0 && (
                <div>
                  <h3 style={{ margin: 0, marginBottom: 8, color: '#fca5a5' }}>Negative Feedback & Issues ({negativeComments.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {negativeComments.map(comment => (
                      <CommentCard key={comment.id} comment={comment} onVote={handleVote} onToggleReply={(id: string) => setReplyingTo(replyingTo === id ? null : id)} onAddReply={handleAddReply} isReplying={replyingTo === comment.id} replyText={replyText} setReplyText={setReplyText} />
                    ))}
                  </div>
                </div>
              )}

              {/* Positive Comments Section */}
              {positiveComments.length > 0 && (
                <div>
                  <h3 style={{ margin: 0, marginBottom: 8, color: '#86efac' }}>Positive Feedback ({positiveComments.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {positiveComments.map(comment => (
                      <CommentCard key={comment.id} comment={comment} onVote={handleVote} onToggleReply={(id: string) => setReplyingTo(replyingTo === id ? null : id)} onAddReply={handleAddReply} isReplying={replyingTo === comment.id} replyText={replyText} setReplyText={setReplyText} />
                    ))}
                  </div>
                </div>
              )}

              {/* Neutral Comments Section */}
              {neutralComments.length > 0 && (
                <div>
                  <h3 style={{ margin: 0, marginBottom: 8, color: '#9ca3af' }}>Neutral Observations ({neutralComments.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {neutralComments.map(comment => (
                      <CommentCard key={comment.id} comment={comment} onVote={handleVote} onToggleReply={(id: string) => setReplyingTo(replyingTo === id ? null : id)} onAddReply={handleAddReply} isReplying={replyingTo === comment.id} replyText={replyText} setReplyText={setReplyText} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
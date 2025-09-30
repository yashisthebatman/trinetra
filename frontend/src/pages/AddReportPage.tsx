import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocuments } from '../context/DocumentContext';
import { MockDoc } from '../mock/mockDocuments';

// Define the possible importance levels for clarity
type ImportanceLevel = 'Critical' | 'High' | 'Medium' | 'Low';

// Simulation function to determine importance based on keywords
const evaluateComplaint = (text: string): ImportanceLevel => {
    const lowerText = text.toLowerCase();
    
    // Keywords for different levels, from most to least severe
    const criticalKeywords = ['fire', 'smoke', 'derail', 'collapse', 'unsafe', 'sparks', 'emergency', 'danger'];
    const highKeywords = ['broken', 'malfunction', 'leak', 'stuck', 'security', 'hazard', 'power failure', 'exposed wire'];
    const mediumKeywords = ['dirty', 'unclean', 'crowded', 'delay', 'announcement', 'overflowing', 'toilet'];
    
    if (criticalKeywords.some(keyword => lowerText.includes(keyword))) {
        return 'Critical';
    }
    if (highKeywords.some(keyword => lowerText.includes(keyword))) {
        return 'High';
    }
    if (mediumKeywords.some(keyword => lowerText.includes(keyword))) {
        return 'Medium';
    }
    return 'Low'; // Default if no other keywords are found
};


export default function AddReportPage() {
  const { addDocument } = useDocuments();
  const navigate = useNavigate();

  const [reportTitle, setReportTitle] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  // State variables to manage the new evaluation flow
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [determinedImportance, setDeterminedImportance] = useState<ImportanceLevel | null>(null);

  // Effect to handle image preview cleanup
  useEffect(() => {
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);

    return () => {
      newPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);
  
  // This effect triggers the final submission logic after the AI's importance level is set
  useEffect(() => {
    if (determinedImportance) {
        const newReport: MockDoc = {
            id: `doc-${Date.now()}`,
            filename: `${reportTitle.trim()}.pdf`, // Mocking as a PDF report for consistency
            status: 'COMPLETED',
            uploadDate: new Date().toISOString().split('T')[0],
            source: 'Complaint Report',
            category: 'Safety', // Complaints are usually categorized under Safety
            importance: determinedImportance,
            isCritical: determinedImportance === 'Critical',
            title: reportTitle.trim(),
            summary: [reportDetails.trim()],
            details: `Report contains ${selectedFiles.length} attached image(s).`,
        };

        addDocument(newReport);

        // Notify the user and navigate after a brief delay
        setTimeout(() => {
            alert(`Complaint submitted successfully! AI has classified its importance as: ${determinedImportance}.`);
            navigate('/directory');
        }, 500);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [determinedImportance]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!reportTitle.trim() || isEvaluating || determinedImportance) {
      if (!reportTitle.trim()) {
        alert('Please enter a report title.');
      }
      return;
    }

    setIsEvaluating(true);

    // Simulate the AI evaluation with a delay
    setTimeout(() => {
        const combinedText = `${reportTitle} ${reportDetails}`;
        const importance = evaluateComplaint(combinedText);
        setDeterminedImportance(importance); // This triggers the useEffect for submission
        setIsEvaluating(false);
    }, 2500); // 2.5-second delay for a realistic "evaluation" feel
  };

  const getImportanceBadgeStyle = (importance: ImportanceLevel): React.CSSProperties => {
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
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Register a Complaint / Report</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: 'rgba(2,6,23,0.6)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 16 }}>
          <div>
            <label>Complaint / Report Title</label>
            <input type="text" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} className="input" style={{ marginTop: 8 }} placeholder="e.g., Sparks from escalator at Palarivattom" />
          </div>
          <div style={{ marginTop: 16 }}>
            <label>Full Details</label>
            <textarea value={reportDetails} onChange={(e) => setReportDetails(e.target.value)} className="input" style={{ marginTop: 8, minHeight: '120px' }} placeholder="Describe the issue in detail. The more information you provide, the better we can assess the situation." />
          </div>
        </div>

        <div style={{ background: 'rgba(2,6,23,0.6)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 16 }}>
          <label>Attach Images (Optional)</label>
          <input type="file" accept="image/*" multiple onChange={handleFileChange} className="input" style={{ marginTop: 8 }} />
          {imagePreviews.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
              {imagePreviews.map((previewUrl, index) => (
                <img key={index} src={previewUrl} alt={`Preview ${index + 1}`} style={{ width: 100, height: 100, borderRadius: 8, objectFit: 'cover' }} />
              ))}
            </div>
          )}
        </div>
        
        {/* Dynamic evaluation and submission section */}
        <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 8}}>
            <button type="submit" className="btn primary" disabled={isEvaluating || !!determinedImportance} style={{ padding: '10px 20px', fontSize: '16px', minWidth: '180px' }}>
                {isEvaluating ? 'Evaluating Issue...' : determinedImportance ? 'Submitted!' : 'Submit for Evaluation'}
            </button>
            {isEvaluating && (
                <div style={{color: '#fde68a'}}>
                    AI is analyzing the report to determine severity...
                </div>
            )}
            {determinedImportance && !isEvaluating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{color: '#86efac'}}>AI has determined the importance as:</span>
                    <span style={{ padding: '4px 10px', borderRadius: 999, fontSize: 12, ...getImportanceBadgeStyle(determinedImportance) }}>
                        {determinedImportance}
                    </span>
                </div>
            )}
        </div>
      </form>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocuments } from '../context/DocumentContext'; // Correct path
import { MockDoc } from '../mock/mockDocuments';

type ImportanceLevel = 'High' | 'Medium' | 'Low';

export default function AddReportPage() {
  const { addDocument } = useDocuments();
  const navigate = useNavigate();

  const [reportTitle, setReportTitle] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [importance, setImportance] = useState<ImportanceLevel>('Medium');

  useEffect(() => {
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);

    return () => {
      newPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!reportTitle.trim()) {
      alert('Please enter a report title.');
      return;
    }

    const newReport: MockDoc = {
      id: `doc-${Date.now()}`,
      filename: `${reportTitle.trim()}.pdf`,
      status: 'COMPLETED',
      uploadDate: new Date().toISOString().split('T')[0],
      source: 'Complaint Report',
      category: 'Safety',
      importance: importance,
      isCritical: importance === 'High',
      summary: [reportDetails.trim()],
      details: `Report contains ${selectedFiles.length} image(s).`,
    };

    addDocument(newReport);

    alert('Complaint report submitted successfully!');
    navigate('/directory');
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Register a Complaint / Report</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: 'rgba(2,6,23,0.6)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 16 }}>
          <div>
            <label>Complaint / Report Title</label>
            <input type="text" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} className="input" style={{ marginTop: 8 }} placeholder="e.g., Broken seat at Palarivattom Platform 1" />
          </div>
          <div style={{ marginTop: 16 }}>
            <label>Full Details</label>
            <textarea value={reportDetails} onChange={(e) => setReportDetails(e.target.value)} className="input" style={{ marginTop: 8, minHeight: '120px' }} placeholder="Describe the issue in detail..." />
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={{ marginBottom: 8, display: 'block' }}>Importance Level</label>
            <div style={{ display: 'flex', gap: 12 }}>
              {(['High', 'Medium', 'Low'] as ImportanceLevel[]).map(level => (
                <label key={level} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                  <input type="radio" name="importance" value={level} checked={importance === level} onChange={() => setImportance(level)} />
                  {level}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(2,6,23,0.6)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: 16 }}>
          <label>Attach Images (Multiple)</label>
          <input type="file" accept="image/*" multiple onChange={handleFileChange} className="input" style={{ marginTop: 8 }} />
          {imagePreviews.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
              {imagePreviews.map((previewUrl, index) => (
                <img key={index} src={previewUrl} alt={`Preview ${index + 1}`} style={{ width: 100, height: 100, borderRadius: 8, objectFit: 'cover' }} />
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="btn primary" style={{ alignSelf: 'flex-start', padding: '10px 20px', fontSize: '16px' }}>
          Submit Complaint
        </button>
      </form>
    </div>
  );
}
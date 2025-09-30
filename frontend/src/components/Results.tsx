import { DocumentResponse } from '../types'

//  Helper function to check if extraction object is meaningfully empty
function isExtractionEmpty(extraction: any): boolean {
  if (!extraction || typeof extraction !== 'object') {
    return true;
  }
  if (Object.keys(extraction).length === 0) {
    return true;
  }
  return Object.values(extraction).every(value =>
    value === null ||
    value === undefined ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'string' && value.trim() === '')
  );
}

export default function Results({ doc }: { doc: DocumentResponse }) {
  const bullets = doc.summary?.summary_bullets || []
  const citations = doc.summary?.citations || []
  const cls = doc.classification || {}
  const extraction = doc.extraction || {}

  // Debugging line: check what extraction actually contains
  console.log('Extraction Object:', JSON.stringify(extraction));

  return (
    <div className="results">
      {/* Document Info */}
      <div className="card">
        <div className="card-header">
          <h3>Document</h3>
        </div>
        <div className="card-row">
          <span className="label">Filename:</span> <span>{doc.filename}</span>
        </div>
        <div className="card-row">
          <span className="label">Pages:</span> <span>{doc.page_count}</span>
        </div>
        <div className="card-row">
          <span className="label">Primary language:</span> <span>{doc.language_primary || 'Unknown'}</span>
        </div>
      </div>

      {/* Summary & Classification */}
      <div className="grid">
        <div className="card">
          <div className="card-header"><h3>Summary</h3></div>
          {bullets.length === 0 && <p className="muted">No summary.</p>}
          <ul className="bullets">
            {bullets.map((b: string, idx: number) => <li key={idx}>{b}</li>)}
          </ul>
          {citations.length > 0 && (
            <>
              <div className="card-sep" />
              <div>
                <strong>Citations:</strong>
                <ul className="citations">
                  {citations.map((c: any, idx: number) => (
                    <li key={idx}>pages {c.page_start}{c.page_end !== c.page_start ? `–${c.page_end}` : ''}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="card">
          <div className="card-header"><h3>Classification</h3></div>
          {cls?.label ? (
            <>
              <div className="badge">{cls.label}</div>
              {'confidence' in cls && typeof cls.confidence === 'number' && (
                <div className="muted">Confidence: {(cls.confidence as number).toFixed(2)}</div>
              )}
            </>
          ) : <p className="muted">No classification.</p>}
        </div>
      </div>

      {/*Updated Entities / Extraction section */}
      {!isExtractionEmpty(extraction) && (
        <div className="card">
          <div className="card-header"><h3>Entities / Extraction</h3></div>
          <pre className="json">{JSON.stringify(extraction, null, 2)}</pre>
        </div>
      )}

    </div>
  )
}

import { UploadResponse, DocumentResponse, SearchResponse, DocumentInfo, RAGResponse, UploadManyResponse, UploadProgress } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

// NEW FUNCTION FOR RAG
export async function ragSearch(query: string): Promise<RAGResponse> {
  const res = await fetch(`${API_BASE}/search/rag`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }), // Send the query in the request body
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`RAG Search failed: ${res.status} ${text}`);
  }
  return res.json();
}

// Multi-file upload with progress callbacks (upload bytes + processing pulse)
export async function uploadDocumentsWithProgress(
  files: File[],
  onProgress?: (p: UploadProgress) => void
): Promise<UploadManyResponse> {
  if (!files || files.length === 0) return { results: [] };

  const fd = new FormData();
  for (const f of files) {
    if (f instanceof Blob) {
      fd.append('files', f, (f as any).name ?? (f as File).name ?? 'upload.bin');
    } else {
      throw new Error('One or more selected items are not real files. Re-select using the file picker.');
    }
  }

  const xhr = new XMLHttpRequest();
  const url = `${API_BASE}/documents/upload`;

  const pulseStages = ['Parsing & OCR', 'Chunking', 'Embedding', 'Vectorizing', 'AI Analysis', 'Finalizing'];
  let pulseTimer: number | undefined;
  let pulseIdx = 0;
  let pulsePercent = 65;

  const stopPulse = () => { if (pulseTimer) { window.clearInterval(pulseTimer); pulseTimer = undefined; } };
  const startPulse = () => {
    stopPulse();
    pulseIdx = 0;
    pulsePercent = 65;
    onProgress?.({ phase: 'processing', percent: pulsePercent, message: `${pulseStages[pulseIdx]}…` });
    pulseTimer = window.setInterval(() => {
      pulsePercent = Math.min(95, pulsePercent + 1 + Math.random() * 2);
      if (Math.random() < 0.2) pulseIdx = Math.min(pulseStages.length - 1, pulseIdx + 1);
      onProgress?.({ phase: 'processing', percent: pulsePercent, message: `${pulseStages[pulseIdx]}…` });
    }, 500);
  };

  const done = (ok: boolean, dataText: string) => {
    stopPulse();
    const parsed = dataText ? JSON.parse(dataText) : {};
    if (ok) {
      onProgress?.({ phase: 'done', percent: 100, message: 'Completed' });
      if (Array.isArray(parsed?.results)) return parsed as UploadManyResponse;
      if (Array.isArray(parsed)) return { results: parsed as UploadResponse[] };
      if (parsed && typeof parsed === 'object' && 'doc_id' in parsed) return { results: [parsed as UploadResponse] };
      return { results: [] };
    } else {
      const msg = typeof parsed?.detail === 'string' ? parsed.detail : dataText || 'Upload failed';
      onProgress?.({ phase: 'error', percent: 0, message: msg });
      throw new Error(msg);
    }
  };

  const promise = new Promise<UploadManyResponse>((resolve, reject) => {
    xhr.upload.onprogress = (ev: ProgressEvent) => {
      if (!ev.lengthComputable) {
        onProgress?.({ phase: 'uploading', percent: 10, message: 'Uploading…' });
        return;
      }
      const frac = ev.loaded / Math.max(1, ev.total);
      const percent = Math.max(1, Math.min(60, Math.round(frac * 60)));
      onProgress?.({ phase: 'uploading', percent, message: 'Uploading…', transferred: ev.loaded, total: ev.total });
    };
    xhr.onloadstart = () => onProgress?.({ phase: 'preparing', percent: 1, message: 'Preparing upload…' });
    xhr.onload = () => {
      try {
        const text = xhr.responseText || '';
        const ok = xhr.status >= 200 && xhr.status < 300;
        resolve(done(ok, text));
      } catch (e) { reject(e); }
    };
    xhr.onerror = () => {
      stopPulse();
      const msg = `Network error (${xhr.status || 0})`;
      onProgress?.({ phase: 'error', percent: 0, message: msg });
      reject(new Error(msg));
    };
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) { startPulse(); }
    };
    xhr.open('POST', url, true);
    xhr.send(fd);
  });

  return promise;
}

// Canonical document fetcher; uses new backend GET /documents/{doc_id}
export async function getDocument(docId: string): Promise<DocumentResponse> {
  const res = await fetch(`${API_BASE}/documents/${encodeURIComponent(docId)}`);
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Get document failed: ${res.status}${t ? ' ' + t : ''}`);
  }
  return res.json();
}

export async function searchQuery(query: string): Promise<SearchResponse> {
  const url = new URL(`${API_BASE}/search`);
  url.searchParams.set('query', query);
  url.searchParams.set('k', '10');
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return res.json();
}

export async function listDocuments(): Promise<DocumentInfo[]> {
  const res = await fetch(`${API_BASE}/documents`);
  if (!res.ok) throw new Error(`List documents failed: ${res.status}`);
  const data = await res.json();
  const rawItems: any[] =
    (Array.isArray(data) ? data :
    (Array.isArray(data?.items) ? data.items :
    (Array.isArray(data?.documents) ? data.documents :
    (Array.isArray(data?.data) ? data.data : []))));
  return rawItems.map((it: any) => {
    const doc_id: string = it.doc_id ?? it.id ?? '';
    const filename: string = it.filename ?? it.name ?? '';
    const page_count: number = it.page_count ?? it.pages ?? 0;
    const created_at: string = it.created_at ?? it.uploaded_at ?? it.createdAt ?? '';
    return { doc_id, filename, page_count, created_at };
  });
}

export async function deleteDocument(docId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/documents/${encodeURIComponent(docId)}`, { method: 'DELETE' });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Delete document failed: ${res.status} ${text || ''}`.trim());
  }
}
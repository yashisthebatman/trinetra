export interface UploadResponse {
  doc_id: string
  filename: string
  page_count: number
  ocr_applied: boolean
  language_primary?: string | null
  error?: string | null
}

export interface UploadManyResponse {
  results: UploadResponse[]
}

export type UploadPhase = 'idle' | 'preparing' | 'uploading' | 'processing' | 'done' | 'error'

export interface UploadProgress {
  phase: UploadPhase
  percent: number
  message: string
  transferred?: number
  total?: number
}

export interface PageInfo {
  page_number: number
  has_images: boolean
  lang_detected?: string | null
  text_len: number
}

export interface DocumentResponse {
  doc_id: string
  filename: string
  page_count: number
  ocr_applied: boolean
  language_primary?: string | null
  summary: any
  classification: { label?: string; confidence?: number }
  extraction: any
  pages: PageInfo[]
}

export interface SearchHit {
  doc_id: string
  chunk_id: string
  score: number
  page_start: number
  page_end: number
  snippet: string
}

export interface RAGResponse {
  answer: string
 sources: SearchHit[]
}


export interface SearchResponse {
  results: SearchHit[]
}

export interface DocumentInfo {
  doc_id: string
  filename: string
  page_count: number
  created_at: string
}
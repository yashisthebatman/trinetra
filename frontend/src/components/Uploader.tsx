import React, { useRef, useState } from 'react'

export default function Uploader({
  onUpload,
  loading
}: {
  onUpload: (files: File[]) => Promise<void>
  loading: boolean
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [selected, setSelected] = useState<File[]>([])

  const choose = () => inputRef.current?.click()

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles: File[] = e.target.files ? Array.from(e.target.files) : []
    setSelected(prevSelected => {
      const key = (f: File) => `${f.name}::${f.size}::${f.lastModified}`
      const seen = new Set(prevSelected.map((f: File) => key(f)))
      const uniqueNewFiles = newFiles.filter((f: File) => !seen.has(key(f)))
      return [...prevSelected, ...uniqueNewFiles]
    })
  }

  const clearSelection = () => {
    setSelected([])
    if (inputRef.current) inputRef.current.value = ''
  }

  const doUpload = async () => {
    if (selected.length === 0) return
    await onUpload(selected)
    setSelected([])
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="uploader">
      <input
        ref={inputRef}
        type="file"
        // UPDATE this line
        accept=".pdf,.docx,.png,.jpg,.jpeg"
        onChange={onChange}
        style={{ display: 'none' }}
        multiple
      />
      <button className="btn" onClick={choose} disabled={loading}>
        Choose files
      </button>
      <span className="file-name">
        {selected.length > 0
          ? `${selected.length} file(s) selected`
          : 'No files selected'}
      </span>
      {selected.length > 0 && (
        <button
          className="btn"
          onClick={clearSelection}
          disabled={loading}
          style={{ marginLeft: 'auto' }}
        >
          Clear
        </button>
      )}
      <button
        className="btn primary"
        onClick={doUpload}
        disabled={selected.length === 0 || loading}
      >
        {loading ? 'Uploading…' : 'Upload'}
      </button>
    </div>
  )
}
// frontend/src/components/Search.tsx

import React, { useState } from 'react';

export default function Search({
  onSearch,
  loading,
}: {
  onSearch: (query: string) => void;
  loading: boolean;
}) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    onSearch(query.trim());
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className="search">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask questions about your documents…"
        className="input"
        disabled={loading}
      />
      <button type="submit" className="btn primary" disabled={loading}>
        {loading ? 'Thinking…' : 'Ask'}
      </button>
    </form>
  );
}
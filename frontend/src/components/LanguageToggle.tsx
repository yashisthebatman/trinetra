// frontend/src/components/LanguageToggle.tsx

import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(lang => (lang === 'en' ? 'ml' : 'en'));
  };

  return (
    <button
      onClick={toggleLanguage}
      style={{
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        background: 'rgba(2, 6, 23, 0.7)',
        color: '#cbd5e1',
        cursor: 'pointer',
        fontWeight: 600,
        backdropFilter: 'blur(5px)',
      }}
    >
      {language === 'en' ? 'മലയാളം' : 'English'}
    </button>
  );
}
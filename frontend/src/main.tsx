// frontend/src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// 1. Import your context providers
import { AuthProvider } from './context/AuthContext';
import { DocumentProvider } from './context/DocumentContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. Wrap the App component with the providers */}
    <AuthProvider>
      <DocumentProvider>
        <App />
      </DocumentProvider>
    </AuthProvider>
  </React.StrictMode>
);
// frontend/src/layouts/MainLayout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import GoogleTranslateWidget from '../components/GoogleTranslateWidget'; // Import the new component

export default function MainLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div style={{ position: 'absolute', top: '24px', right: '32px', zIndex: 100 }}>
          <GoogleTranslateWidget />
        </div>
        <Outlet />
      </main>
    </div>
  );
}
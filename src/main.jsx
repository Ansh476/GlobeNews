import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js') // Fix: Corrected path
      .then((registration) => {
        console.log('[Service Worker] Registered with scope:', registration.scope);

        if (registration.active) console.log('[Service Worker] Active');
        if (registration.installing) console.log('[Service Worker] Installing');
        if (registration.waiting) console.log('[Service Worker] Waiting');

        registration.addEventListener('updatefound', () => {
          console.log('[Service Worker] Update found');
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('[Service Worker] New content available. Please refresh.');
                } else {
                  console.log('[Service Worker] Content cached for offline use.');
                }
              }
            });
          }
        });
      })
      .catch((error) => console.error('[Service Worker] Registration failed:', error));
  });
} else {
  console.warn('[Service Worker] Not supported in this browser.');
}

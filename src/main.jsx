import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </LanguageProvider>
  </StrictMode>,
);

// ─── Register Service Worker (Production only) ─────────────
// Service worker only works on HTTPS (live deployed URL)
// Will NOT run during local development
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('BPK CFMS: Service Worker registered!', registration.scope);
      })
      .catch((error) => {
        console.error('BPK CFMS: Service Worker registration failed:', error);
      });
  });
}
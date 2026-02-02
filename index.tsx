
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Registro do Service Worker Rodney Alpha com verificação de origem
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Evita o erro de cross-origin no sandbox do Google AI Studio
    const isSandbox = window.location.hostname.includes('usercontent.goog');
    if (!isSandbox) {
      navigator.serviceWorker.register('./sw.js').then(registration => {
        console.log('Rodney Protocol: Service Worker ativo em:', registration.scope);
      }).catch(err => {
        console.warn('Rodney Log: SW bypass no ambiente de desenvolvimento.');
      });
    }
  });
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HelmetProvider } from 'react-helmet-async';
import './styles/main.scss';
import { StoreProvider } from './store/store.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <HelmetProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </HelmetProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);

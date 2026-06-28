import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext'
import { store } from './store'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <Provider store={store}>
            <App />
            <Toaster 
              position="top-right" 
              expand={false} 
              richColors 
              closeButton
              toastOptions={{
                style: {
                  fontFamily: 'var(--font-heading)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-3)',
                }
              }}
            />
          </Provider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)

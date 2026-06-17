import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
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
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)

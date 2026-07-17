import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {registerSW} from 'virtual:pwa-register'
import { AuthProvider } from './context/AuthContext.jsx'

//auto update app cache in the background
registerSW({immediate:true});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
  </StrictMode>,
)

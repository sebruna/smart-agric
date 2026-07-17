import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType:'autoUpdate',
      includeAssets:['favicon.ico','apple-touch-icon.png', 'masked-icon.svg'],
      manifest:{
        name:'Sebruna Market Ledger',
        short_name:'OwinoLedger',
        description:'Offline-First Cashflow and Debt Traker for Market Vendors',
        theme_color:'#059669',//green
        background_color:'#ffffff',
        display:'standalone',
        orientation:'portrait',
        icons:[{
          src:'pwa-192x192.png',
          size:'192x192',
          type:'image/png'
        },
        {
          src:'pwa-512x512.png',
          size:'512x512',
          type:'image/png'
        }     
      ]
      }
    })
  ],
  define:{
    'process.env':{}
  }
});

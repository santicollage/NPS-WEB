import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    drop: ['console', 'debugger'],
    
    // rollupOptions removed for stability (using default Vite chunking)
    
    // Enable CSS code splitting
    cssCodeSplit: true,
    
    // Generate source maps for production debugging (optional)
    sourcemap: false,
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    drop: ['console', 'debugger'],
    
    rollupOptions: {
      output: {
        // Manual chunking strategy for optimal code splitting
        manualChunks: (id) => {
          // Vendor chunks - separate by library type for better caching
          if (id.includes('node_modules')) {
            // Consolidate core libraries to ensure correct loading order and prevent implicit dependency issues
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router') ||
              id.includes('redux') ||
              id.includes('@reduxjs') ||
              id.includes('framer-motion') ||
              id.includes('react-helmet')
            ) {
              return 'vendor-core';
            }

            // Google Maps (large independent dependency)
            if (id.includes('@vis.gl') || id.includes('google-maps')) {
              return 'vendor-maps';
            }

            // OAuth (independent dependency)
            if (id.includes('@react-oauth')) {
              return 'vendor-oauth';
            }

            // Other vendor code
            return 'vendor-other';
          }
          
          // Admin routes - separate chunk for admin-only code
          if (id.includes('/pages/Admin') || id.includes('/components/Admin')) {
            return 'admin';
          }
          
          // Keep other application code in default chunks
        },
      },
    },
    
    // Enable CSS code splitting
    cssCodeSplit: true,
    
    // Generate source maps for production debugging (optional)
    sourcemap: false,
  },
})

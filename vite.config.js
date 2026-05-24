import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Use root path for Vercel production deployments, or fallback if needed
  base: process.env.VERCEL ? '/' : '/', 
})
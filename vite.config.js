import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [react()],
  // Served from the domain root on Firebase Hosting (birkat-avraham.com).
  base: '/',
  server: {
    port: 5173,
    open: true,
  },
}))

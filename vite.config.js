import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // On GitHub Pages the site is served from /birkat-avraham/ (project page).
  // Local dev (`npm run dev`) stays at the root for convenience.
  base: command === 'build' ? '/birkat-avraham/' : '/',
  server: {
    port: 5173,
    open: true,
  },
}))

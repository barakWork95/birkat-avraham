import { defineConfig } from 'vitest/config'

// Vitest runs the critical-path unit tests. jsdom gives the localProvider its
// localStorage + window events; the pure payload builder runs fine there too.
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})

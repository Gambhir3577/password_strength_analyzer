import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5188,
    strictPort: true,
  },
  preview: {
    port: 5188,
    strictPort: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    include: ['src/tests/{unit,components}/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['src/tests/e2e/**', 'node_modules/**'],
  },
});

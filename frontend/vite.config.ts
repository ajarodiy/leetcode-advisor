import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        feedback: resolve(__dirname, 'src/feedback-inject.tsx'),
      },
      output: {
        entryFileNames: '[name].bundle.js',
      },
    },
    outDir: 'dist',
    emptyOutDir: false,
  },
});

import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';
import * as path from 'path';

export default defineConfig(({ command }) => ({
  server: {
    port: 3000,
  },
  build: {
    outDir: '.vercel',
  },
  plugins: [
    tanstackStart(),
    nitro({
      ...(command === 'build' ? { preset: 'vercel' } : {}),
    }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    tsconfigPaths: true,
    alias: {
      '~': path.resolve(import.meta.dirname, './src'),
    },
  },
}));

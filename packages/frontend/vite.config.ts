import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
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
    tsConfigPaths(),
    tanstackStart({
      router: {
        routeFileIgnorePattern:
          command === 'build' ? '.*playground.*' : undefined,
      },
    }),
    nitro({
      preset: 'vercel',
    }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
}));

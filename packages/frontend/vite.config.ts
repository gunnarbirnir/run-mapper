import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { nitro } from 'nitro/vite';
import * as path from 'path';

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    outDir: '.output',
  },
  plugins: [
    tsConfigPaths(),
    tanstackStart(/* {
      server: {
        preset: 'vercel',
      },
    } */),
    nitro(),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
});

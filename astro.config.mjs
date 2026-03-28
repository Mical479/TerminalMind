// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    css: {
      transformer: 'lightningcss'
    }
  },
  output: 'static',
  build: {
    assets: '_assets'
  },
  server: {
    port: 4321,
    host: true,
    allowedHosts: ['ai.suyang.site', 'localhost', '127.0.0.1']
  }
});

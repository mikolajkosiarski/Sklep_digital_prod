import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { markdownSafety, markdownHtmlSafety } from './tools/markdown-safety.mjs';
import tailwindcss from '@tailwindcss/vite';

const redirects = {
  '/hero-frames.html': '/',
  '/journal.html': '/journal/',
  '/journal-png-or-brushset.html': '/journal/png-or-brushset/',
  '/journal-working-with-digital-ornaments.html': '/journal/working-with-digital-ornaments/',
  '/journal-a-study-in-worn-textures.html': '/journal/a-study-in-worn-textures/',
};

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || '/',
  server: { host: '127.0.0.1', port: 4321 },
  vite: { plugins: [tailwindcss()] },
  markdown: {
    processor: satteri({
      mdastPlugins: [markdownSafety],
      hastPlugins: [markdownHtmlSafety],
    }),
  },
  redirects,
});

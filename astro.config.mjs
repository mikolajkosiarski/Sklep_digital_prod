import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { markdownSafety, markdownHtmlSafety } from './tools/markdown-safety.mjs';
import tailwindcss from '@tailwindcss/vite';
import catalog from './src/data/shop-content.json' with { type: 'json' };

const deploymentBase = (process.env.BASE_PATH || '/').replace(/\/+$/, '');

// Keep bookmarked prototype addresses working while the site uses clean routes.
const redirects = {
  '/hero-frames.html': '/',
  '/shop.html': '/digital/',
  '/physical.html': '/physical/',
  '/journal.html': '/journal/',
  '/about.html': '/about/',
  ...Object.fromEntries(
    catalog.digital.map(({ id }) => [`/digital-${id}.html`, `/digital/${id}/`]),
  ),
  ...Object.fromEntries(
    catalog.physical.map(({ slug }) => [`/physical-${slug}.html`, `/physical/${slug}/`]),
  ),
  ...Object.fromEntries(
    ['png-or-brushset', 'working-with-digital-ornaments', 'a-study-in-worn-textures'].map(
      (slug) => [`/journal-${slug}.html`, `/journal/${slug}/`],
    ),
  ),
};

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  site: process.env.SITE_URL || undefined,
  base: deploymentBase || '/',
  server: { host: '127.0.0.1', port: 4321 },
  vite: { plugins: [tailwindcss()] },
  markdown: {
    processor: satteri({
      mdastPlugins: [markdownSafety],
      hastPlugins: [markdownHtmlSafety],
    }),
  },
  // Static redirect destinations must stay inside the deployed repository path.
  redirects: Object.fromEntries(
    Object.entries(redirects).map(([source, destination]) => [
      source,
      `${deploymentBase}${destination}`,
    ]),
  ),
});

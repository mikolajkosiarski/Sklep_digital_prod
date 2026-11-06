import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { markdownSafety, markdownHtmlSafety } from './tools/markdown-safety.mjs';
import tailwindcss from '@tailwindcss/vite';
import catalog from './src/data/shop-content.json' with { type: 'json' };

const deploymentBase = (process.env.BASE_PATH || '/').replace(/\/+$/, '');

// Keep bookmarked addresses working while the site uses clean routes. The
// catalogue moved from /digital/ to /shop/, and the apparel concepts that
// used to live under /physical/ were retired in favour of the digital shop.
const retiredPhysical = ['bat-skeleton', 'crown-wings', 'angel-wings', 'open-mouth', 'mercy'];
const redirects = {
  '/hero-frames.html': '/',
  '/shop.html': '/shop/',
  '/digital/': '/shop/',
  '/physical.html': '/shop/',
  '/physical/': '/shop/',
  '/journal.html': '/journal/',
  '/about.html': '/about/',
  ...Object.fromEntries(
    catalog.digital.flatMap(({ id }) => [
      [`/digital-${id}.html`, `/shop/${id}/`],
      [`/digital/${id}/`, `/shop/${id}/`],
    ]),
  ),
  ...Object.fromEntries(
    retiredPhysical.flatMap((slug) => [
      [`/physical-${slug}.html`, '/shop/'],
      [`/physical/${slug}/`, '/shop/'],
    ]),
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

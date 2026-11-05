# Visamore Journal

The Journal uses one archive component and one article layout. Article copy is Markdown; no page markup needs to be duplicated when adding a post.

## Editing an article

Edit `src/content/journal/<slug>.md`. The filename becomes `/journal/<slug>/`. Required frontmatter:

```yaml
---
title: 'A short, specific title'
description: 'First teaser sentence. Second teaser sentence.'
category: 'Composition'
published: '2026-11-05'
author: 'mikolaj'
tags: ['Composition', 'Spacing']
readTime: '2 min read'
art: 'ornaments'
order: 9
figure:
  image: 'assets/digital/pack-121-3.png'
  alt: 'Describe the artwork that is visible'
  caption: 'Explain what the reader should notice in this example.'
---
```

Use a real publication date. Articles sort by newest date, then `order` for ties. The home page takes the first three. Keep descriptions to two sentences for the coursework teasers.

Start the Markdown body with a lead paragraph. Use `##` and `###` headings, a `>` blockquote and a list or table. The layout adds the leading illustration, the additional figure and its caption, article metadata, tags, author, sharing, previous/next navigation and the discussion preview.

Available `art` values are `formats`, `ornaments`, `textures`. Figure paths are intentionally restricted to local assets in `src/content.config.ts`. Add another reviewed local path there when introducing a new figure. Raw HTML and unsafe Markdown links are rejected during the build.

## Shared files

- `src/layouts/JournalPost.astro`: the article template.
- `src/components/journal/JournalArchive.astro`: archive, search and category filtering.
- `src/components/journal/JournalCard.astro`: the same teaser on home, archive and related articles.
- `src/components/journal/entries.ts`: publication order, date labels and page size (six).
- `src/data/journal-authors.ts`: Mikołaj Kosiarski's name, bio and avatar in one place.
- `src/styles/components/journal.css`: all Journal styling, imported by the shared global stylesheet.
- `src/pages/journal/page/[page].astro`: additional archive pages generated from the collection.

## Current behaviour

Search checks the title, teaser, category and tags of all posts, including those on another archive page. Categories and tags are linkable through URL parameters. Archive pagination uses real static routes and remains usable without JavaScript.

Comments are explicitly a layout preview with two sample comments. The form validates locally and previews text using `textContent`; it does not send, publish or save it. Do not remove the preview notice until a real moderated comment service exists. Social share links only open a provider after a reader clicks; no third-party widgets are loaded.

The home Journal section is `#blog`; the old `#journal` fragment is retained on its heading. It follows the product sections. The shared contact form now follows this section, completing the offer → blog → contact-form sequence from CW4. It currently provides a local preview only.

Run `npm run build`, `npm test` and `npm run format:check` before submission. For production, set `SITE_URL` so canonical and social URLs use the real domain. The build verifies Markdown safety, types and local page/asset references.

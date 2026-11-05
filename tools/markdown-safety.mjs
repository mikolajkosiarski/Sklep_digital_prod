/**
 * Build-time policy for locally authored Markdown, not a sanitizer for uploads.
 * Keep layout/interactive HTML in Astro components. Metadata is validated by
 * content collection schemas separately; this guard covers Markdown bodies.
 */

function reject(message, node, context) {
  const file = context.fileURL?.pathname ?? 'Markdown content';
  const line = node.position?.start?.line;
  throw new Error(`[Markdown safety] ${file}${line ? `:${line}` : ''}: ${message}`);
}

function checkUrl(value, node, context, image = false) {
  const url = typeof value === 'string' ? value : '';
  if (/[\u0000-\u0020\u007f-\u009f\\]/u.test(url) || url.startsWith('//')) {
    reject('Use a local path or an explicit safe URL without control characters.', node, context);
  }

  let parsed;
  try {
    parsed = new URL(url, 'https://markdown.invalid/');
  } catch {
    reject('Invalid Markdown URL.', node, context);
  }

  const protocols = image ? ['http:', 'https:'] : ['http:', 'https:', 'mailto:', 'tel:'];
  if (!protocols.includes(parsed.protocol) || parsed.username || parsed.password) {
    reject(`Unsupported ${image ? 'image' : 'link'} URL.`, node, context);
  }
  // Avoid ambiguous forms such as https:example.com and accidental credentials.
  if (/^https?:/i.test(url) && !/^https?:\/\//i.test(url)) {
    reject('Write HTTP(S) URLs with ://.', node, context);
  }
}

/** Runs before Astro collects local images, so unsafe image URLs fail early. */
export const markdownSafety = {
  name: 'visamore-markdown-safety',
  options: { position: true },
  html(node, context) {
    reject('Raw HTML is not allowed; use Markdown or an Astro component.', node, context);
  },
  link(node, context) {
    checkUrl(node.url, node, context);
  },
  image(node, context) {
    checkUrl(node.url, node, context, true);
  },
  definition(node, context) {
    checkUrl(node.url, node, context);
  },
};

/** Also check resolved reference links/images in the generated HTML tree. */
export const markdownHtmlSafety = {
  name: 'visamore-markdown-html-safety',
  options: { position: true },
  raw(node, context) {
    reject('Raw HTML is not allowed; use Markdown or an Astro component.', node, context);
  },
  element: {
    filter: ['a', 'img'],
    visit(node, context) {
      const image = node.tagName === 'img';
      const value = node.properties?.[image ? 'src' : 'href'];
      if (value !== undefined) checkUrl(value, node, context, image);
    },
  },
};

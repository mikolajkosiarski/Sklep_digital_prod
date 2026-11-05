#!/usr/bin/env node
/** Check the static Astro build without a server or third-party dependencies. */
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
const rootOption = args.indexOf('--root');
const baseOption = args.indexOf('--base');
const root = path.resolve(rootOption >= 0 ? args[rootOption + 1] : path.join(project, 'dist'));
const base = baseOption >= 0 ? `/${args[baseOption + 1].replace(/^\/+|\/+$/g, '')}` : '';
const problems = new Set();
const checkedAssets = new Set();
const documents = new Map();
let references = 0;
let redirects = 0;
const report = (file, message) => problems.add(`${path.relative(root, file)}: ${message}`);
const read = (file) => readFile(file, 'utf8');
const info = (file) => stat(file).catch(() => null);
const decode = (text) =>
  text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

function parse(source) {
  const tags = [];
  const raw = [];
  // Consume script/style bodies separately, so embedded markup is not mistaken
  // for document headings, links or IDs.
  const withoutRaw = source
    .replace(
      /<(script|style|title)\b([^>]*)>([\s\S]*?)<\/\1\s*>/gi,
      (_whole, name, attributes, body) => {
        raw.push({ name: name.toLowerCase(), body, attributes });
        return `<${name}${attributes}></${name}>`;
      },
    )
    .replace(/<!--[\s\S]*?-->/g, '');
  for (const match of withoutRaw.matchAll(/<([a-z][\w:-]*)\b((?:[^'">]|"[^"]*"|'[^']*')*)>/gi)) {
    const attrs = {};
    for (const item of match[2].matchAll(
      /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g,
    )) {
      attrs[item[1].toLowerCase()] = decode(item[2] ?? item[3] ?? item[4] ?? '');
    }
    tags.push({ name: match[1].toLowerCase(), attrs });
  }
  const ids = tags.filter((tag) => 'id' in tag.attrs).map((tag) => tag.attrs.id);
  return { tags, raw, ids };
}

async function document(file) {
  if (!documents.has(file)) documents.set(file, read(file).then(parse));
  return documents.get(file);
}

function unsafeUrl(value) {
  return (
    /(?:\$\{|\{\{|\[object Object\])/.test(value) ||
    /(?:^|[\/._=-])(?:undefined|null)(?=$|[\/.?#=&-])/.test(value) ||
    /^(?:javascript:|file:|[a-z]:[\\/])|^\/(?:Users|Volumes|private|home)\//i.test(value)
  );
}

async function reference(value, file, label, checkFragment = true) {
  references++;
  value = decode(value.trim());
  if (!value || unsafeUrl(value)) {
    report(file, `${label}: empty or unresolved URL ${value}`);
    return null;
  }
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) return null;
  let pathname;
  let fragment;
  try {
    const hash = value.indexOf('#');
    pathname = decodeURIComponent((hash >= 0 ? value.slice(0, hash) : value).split('?')[0]);
    fragment = hash >= 0 ? decodeURIComponent(value.slice(hash + 1)).split(':~:text=')[0] : '';
  } catch {
    report(file, `${label}: invalid URL encoding ${value}`);
    return null;
  }
  if (base && (pathname === base || pathname.startsWith(`${base}/`)))
    pathname = pathname.slice(base.length) || '/';
  let target = pathname
    ? path.resolve(
        pathname.startsWith('/') ? root : path.dirname(file),
        pathname.replace(/^\/+/, ''),
      )
    : file;
  const relative = path.relative(root, target);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    report(file, `${label}: URL escapes output directory ${value}`);
    return null;
  }
  if ((await info(target))?.isDirectory()) target = path.join(target, 'index.html');
  if (!(await info(target))?.isFile()) {
    report(file, `${label}: missing ${value}`);
    return null;
  }
  if (fragment && checkFragment && /\.(?:html|svg)$/.test(target)) {
    if (!(await document(target)).ids.includes(fragment))
      report(file, `${label}: missing #${fragment} in ${path.relative(root, target)}`);
  }
  return target;
}

async function cssResources(source, file) {
  for (const match of source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*))\s*\)|@import\s+['"]([^'"]+)['"]/g)) {
    const value = (match[1] ?? match[2] ?? match[3] ?? match[4]).trim();
    if (value.startsWith('#')) continue;
    const target = await reference(value, file, 'CSS resource', false);
    if (target) await asset(target);
  }
}

async function asset(file) {
  if (checkedAssets.has(file)) return;
  checkedAssets.add(file);
  if (file.endsWith('.css')) {
    const source = await read(file);
    if (/@(?:tailwind|apply|theme|source|utility)\b/.test(source))
      report(file, 'uncompiled Tailwind directive');
    await cssResources(source, file);
  } else if (file.endsWith('.svg')) {
    for (const tag of (await document(file)).tags) {
      for (const name of ['href', 'xlink:href']) {
        if (!tag.attrs[name]) continue;
        const target = await reference(tag.attrs[name], file, `SVG ${name}`);
        if (target) await asset(target);
      }
    }
  } else if (/\.(?:mjs|js)$/.test(file)) {
    for (const match of (await read(file)).matchAll(
      /\b(?:import|export)\s*(?:[^;'"\n]*?\s+from\s*)?['"]([^'"]+)['"]|\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    )) {
      const url = match[1] ?? match[2];
      if (!/^[./]/.test(url)) continue;
      const target = await reference(url, file, 'JavaScript import', false);
      if (target) await asset(target);
    }
  }
}

async function structuredResources(value, file) {
  if (Array.isArray(value)) {
    for (const entry of value) await structuredResources(entry, file);
  } else if (value && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) {
      if (
        typeof entry === 'string' &&
        /^(?:src|image|cover|logo|contentUrl|thumbnailUrl)$/.test(key)
      ) {
        const target = await reference(entry, file, `JSON ${key}`, false);
        if (target) await asset(target);
      } else await structuredResources(entry, file);
    }
  }
}

async function page(file) {
  const parsed = await document(file);
  const { tags, raw, ids } = parsed;
  const visibleSource = (await read(file))
    .replace(/<(?:script|style)\b[^>]*>[\s\S]*?<\/(?:script|style)\s*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
  if (/\$\{|\{\{|\[object Object\]/.test(visibleSource))
    report(file, 'unresolved template token in HTML');
  const refresh = tags.find(
    ({ name, attrs }) => name === 'meta' && attrs['http-equiv']?.toLowerCase() === 'refresh',
  );
  if (refresh) {
    redirects++;
    const url = refresh.attrs.content?.match(/url\s*=\s*(.+)$/i)?.[1];
    if (url) await reference(url.replace(/^['"]|['"]$/g, ''), file, 'redirect');
    else report(file, 'redirect has no destination');
  } else {
    const h1Count = tags.filter((tag) => tag.name === 'h1').length;
    if (h1Count !== 1) report(file, `expected one h1, found ${h1Count}`);
    if (raw.filter((tag) => tag.name === 'title' && tag.body.trim()).length !== 1)
      report(file, 'expected one nonempty title');
    if (
      !tags.some(
        ({ name, attrs }) =>
          name === 'meta' && attrs.name === 'description' && attrs.content?.trim(),
      )
    )
      report(file, 'missing meta description');
    if (
      !tags.some(
        ({ name, attrs }) =>
          name === 'meta' &&
          attrs.name === 'viewport' &&
          attrs.content?.includes('width=device-width'),
      )
    )
      report(file, 'missing responsive viewport');
  }
  if (tags.some(({ attrs }) => attrs['data-document-status'] === 'draft')) {
    if (
      !tags.some(
        ({ name, attrs }) =>
          name === 'meta' && attrs.name === 'robots' && attrs.content?.includes('noindex'),
      )
    )
      report(file, 'draft document must be marked noindex');
    if (!tags.some(({ attrs }) => attrs['aria-label'] === 'Draft document'))
      report(file, 'draft document has no visible status notice');
  }
  if (new Set(ids).size !== ids.length) report(file, 'duplicate element IDs');
  for (const tag of tags) {
    for (const attribute of ['href', 'xlink:href', 'src', 'poster']) {
      if (!(attribute in tag.attrs)) continue;
      const target = await reference(tag.attrs[attribute], file, `${tag.name}[${attribute}]`);
      if (target) await asset(target);
    }
    if (tag.attrs.srcset) {
      // This application uses local image paths, not data URLs, in srcset.
      for (const candidate of tag.attrs.srcset.split(',')) {
        await reference(candidate.trim().split(/\s+/)[0], file, 'srcset', false);
      }
    }
    if (tag.attrs.style) await cssResources(tag.attrs.style, file);
    if (
      tag.name === 'meta' &&
      ['og:image', 'twitter:image'].includes(tag.attrs.property ?? tag.attrs.name)
    ) {
      if (tag.attrs.content) await reference(tag.attrs.content, file, 'metadata image', false);
    }
  }
  for (const item of raw) {
    if (item.name === 'style') await cssResources(item.body, file);
    if (
      item.name === 'script' &&
      /type\s*=\s*['"]application\/(?:ld\+)?json['"]/.test(item.attributes)
    ) {
      try {
        await structuredResources(JSON.parse(item.body), file);
      } catch {
        report(file, 'invalid embedded JSON');
      }
    }
  }
}

async function htmlFiles(directory) {
  const found = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) found.push(...(await htmlFiles(file)));
    else if (item.isFile() && item.name.endsWith('.html')) found.push(file);
  }
  return found;
}

async function expectedRoutes() {
  return [
    '/',
    '/contact/',
    '/404.html',
    '/journal/',
    '/journal/page/2/',
    '/journal/a-study-in-worn-textures/',
    '/journal/check-the-final-size/',
    '/journal/give-the-frame-room/',
    '/journal/keep-a-pale-background-readable/',
    '/journal/keep-the-working-file-editable/',
    '/journal/one-focal-point/',
    '/journal/png-or-brushset/',
    '/journal/working-with-digital-ornaments/',
  ];
}

try {
  const expected = await expectedRoutes();
  for (const route of expected)
    await reference(route, path.join(root, 'index.html'), 'required page', false);
  const files = await htmlFiles(root);
  for (const file of files) await page(file);
  if (files.length - redirects < expected.length)
    report(root, `expected at least ${expected.length} content pages`);
  if (problems.size) {
    console.error(
      `Build validation failed (${problems.size} issues):\n${[...problems].map((value) => `- ${value}`).join('\n')}`,
    );
    process.exitCode = 1;
  } else {
    console.log(
      `Build validation passed: ${files.length - redirects} content pages, ${redirects} redirects, ${references} local/embedded references, ${checkedAssets.size} assets checked.`,
    );
  }
} catch (error) {
  console.error(`Build validation failed: ${error.message}`);
  process.exitCode = 1;
}

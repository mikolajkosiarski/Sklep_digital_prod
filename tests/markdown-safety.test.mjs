import assert from 'node:assert/strict';
import test from 'node:test';
import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';
import { markdownSafety, markdownHtmlSafety } from '../tools/markdown-safety.mjs';

const renderer = await createSatteriMarkdownProcessor({
  syntaxHighlight: false,
  mdastPlugins: [markdownSafety],
  hastPlugins: [markdownHtmlSafety],
});
const options = { fileURL: new URL('file:///content/products/fixture.md') };

for (const [name, markdown] of [
  ['script elements', '<script>alert(1)</script>'],
  ['inline HTML event handlers', 'Text <img src="x" onerror="alert(1)">'],
  ['HTML comments', '<!-- Keep HTML in Astro components. -->'],
  ['SVG markup', '<svg onload="alert(1)"></svg>'],
  ['javascript links', '[click](javascript:alert%281%29)'],
  ['mixed-case schemes', '[click](JaVaScRiPt:alert%281%29)'],
  ['HTML-entity schemes', '[click](java&#x73;cript&colon;alert%281%29)'],
  ['embedded tab schemes', '[click](java&#9;script:alert%281%29)'],
  ['reference-link schemes', '[click][bad]\n\n[bad]: javascript:alert%281%29'],
  ['data URLs', '[click](data:text/html,hello)'],
  ['file URLs', '[click](file:///etc/passwd)'],
  ['protocol-relative URLs', '[click](//example.com/path)'],
  ['URLs with credentials', '[click](https://user:password@example.com/)'],
  ['ambiguous HTTPS URLs', '[click](https:example.com)'],
  ['image data URLs', '![image](data:image/svg+xml,hello)'],
  ['non-image reference URLs', '![image][contact]\n\n[contact]: mailto:hello@example.com'],
]) {
  test(`Markdown safety rejects ${name}`, async () => {
    await assert.rejects(renderer.render(markdown, options), /\[Markdown safety\]/);
  });
}

test('Markdown safety keeps normal formatting, code examples and safe links', async () => {
  const { code } = await renderer.render(
    [
      '## Collection details',
      '',
      'A **bold** and *italic* paragraph.',
      '',
      '- Transparent PNG artwork',
      '- Procreate brushes',
      '',
      '> A useful note.',
      '',
      '[Internal](/digital/100/) [Relative](../help/) [Section](#details)',
      '[External](https://example.com/guide?a=1&b=2) [HTTP](http://example.com/)',
      '[Email](mailto:hello@example.com) [Telephone](tel:+48123456789)',
      '[Reference][guide]',
      '',
      '[guide]: https://example.com/guide',
      '',
      'Literal `javascript:alert(1)` and escaped &lt;script&gt; are text.',
      '',
      '```html',
      '<script>alert(1)</script>',
      '```',
    ].join('\n'),
    options,
  );
  assert.match(code, /<h2 id="collection-details">/);
  assert.match(code, /<strong>bold<\/strong>/);
  assert.match(code, /href="\/digital\/100\/"/);
  assert.match(code, /href="https:\/\/example.com\/guide"/);
  assert.match(code, /&lt;script&gt;/);
  assert.doesNotMatch(code, /<script>/);
});

test('Markdown safety keeps safe image references', async () => {
  const { code, metadata } = await renderer.render(
    '![Local](/assets/example.png)\n\n![Relative](./example.png)\n\n![Remote](https://example.com/image.png)',
    options,
  );
  assert.match(code, /src="\/assets\/example.png"/);
  assert.ok(metadata.localImagePaths.includes('./example.png'));
  assert.match(code, /src="https:\/\/example.com\/image.png"/);
});

test('Markdown safety identifies the source file in build errors', async () => {
  await assert.rejects(
    renderer.render('A paragraph.\n\n<script>alert(1)</script>', options),
    /fixture\.md:3: Raw HTML is not allowed/,
  );
});

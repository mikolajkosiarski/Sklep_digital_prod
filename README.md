# Visamore

Local implementation stage 1.

Responsive Astro and Tailwind site, shared header/footer, hero, brand and offer sections, contact page and local form preview.

## Run and check

Node.js 22.23.4 or newer.

```sh
npm ci
npm run dev -- --background
npm test
npm run build
```

The dev server uses http://127.0.0.1:4321/. Forms preview text locally; they do not send messages. Payments and fulfilment are not implemented. Generated files and dependencies are excluded from Git. This local history is being organised from the existing project; commits are not backdated.

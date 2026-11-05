# Contact

The contact page and the section after Journal on home use the same `ContactSection.astro` and `ContactForm.astro`. The form is a local demonstration: it validates and previews a message without sending or saving it.

## Files

- `src/pages/contact.astro`: the dedicated `/contact/` route, page metadata and ContactPage JSON-LD.
- `src/components/contact/ContactSection.astro`: heading, form and information box shared with home.
- `src/components/contact/ContactForm.astro`: field markup, native labels, constraints and preview output.
- `src/scripts/contact.ts`: inline errors, focus management, safe text preview and reset behaviour.
- `src/styles/components/contact.css`: the shared form and responsive page styles, imported in `global.css`.
- `src/content/information/contact.md`: editable introduction and information-box copy. Keep body headings at level three beneath the section heading.

The general `[information].astro` route deliberately excludes `contact`; the dedicated page owns this URL. Footer/help links continue to use the same information entry. `idPrefix` gives each form instance unique label, hint, error and preview IDs.

## Behaviour

All four fields are required. Email uses native email validation. Names containing only whitespace are rejected. Messages require 20–3,000 characters after trimming. Invalid submission focuses the first invalid field and associates each error with its input.

Valid data is displayed using `textContent`. Editing invalidates the old preview. Clearing removes entered values, errors and preview output and focuses the name field. The script makes no network requests and does not use browser storage. The submit control stays disabled until this local behaviour is installed.

Text and help links are intentionally separate: help URLs are resolved through the deployment-base helper in the component, so the same information box works on both home and `/contact/`.

## Later integration

The direct email and verified studio details are still unconfirmed. The contact page remains a draft with `noindex`. The action and output heading identify message previewing; the prominent development notices were removed at the user’s request. Keep the action wording accurate until real delivery is configured.

Real sending will need a server endpoint/Astro Action or a chosen external form service, confirmed recipient details and server-side validation. The present browser validation is an interface feature, not a server security boundary. Update the privacy text and success/error messages to match the actual integration when it is added.

The home sequence now includes offer → Journal → contact form. The information box fulfils CW3's map-or-information-box requirement without an embedded map.

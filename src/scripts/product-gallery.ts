class ProductGallery extends HTMLElement {
  private controller?: AbortController;

  connectedCallback() {
    if (this.controller) return;

    const panels = Array.from(this.querySelectorAll<HTMLElement>('[data-gallery-panel]'));
    const thumbnails = Array.from(
      this.querySelectorAll<HTMLButtonElement>('[data-gallery-thumbnail]'),
    );
    const controls = this.querySelector<HTMLElement>('[data-gallery-controls]');
    const status = this.querySelector<HTMLElement>('[data-gallery-status]');

    if (!controls || !status || panels.length < 2 || thumbnails.length !== panels.length) return;

    this.controller = new AbortController();
    const { signal } = this.controller;

    const select = (index: number, moveFocus = false) => {
      panels.forEach((panel, panelIndex) => {
        panel.hidden = panelIndex !== index;
      });
      thumbnails.forEach((thumbnail, thumbnailIndex) => {
        thumbnail.setAttribute('aria-pressed', String(thumbnailIndex === index));
      });
      status.textContent = `View ${index + 1} of ${panels.length}`;
      if (moveFocus) thumbnails[index]?.focus();
    };

    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => select(index), { signal });
      thumbnail.addEventListener(
        'keydown',
        (event) => {
          let nextIndex: number;
          switch (event.key) {
            case 'ArrowRight':
              nextIndex = (index + 1) % thumbnails.length;
              break;
            case 'ArrowLeft':
              nextIndex = (index - 1 + thumbnails.length) % thumbnails.length;
              break;
            case 'Home':
              nextIndex = 0;
              break;
            case 'End':
              nextIndex = thumbnails.length - 1;
              break;
            default:
              return;
          }
          event.preventDefault();
          select(nextIndex, true);
        },
        { signal },
      );
    });

    select(0);
    controls.hidden = false;
  }

  disconnectedCallback() {
    this.controller?.abort();
    this.controller = undefined;
  }
}

if (!customElements.get('product-gallery')) {
  customElements.define('product-gallery', ProductGallery);
}

export {};

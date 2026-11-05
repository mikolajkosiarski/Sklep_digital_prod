const menu = document.querySelector<HTMLElement>('#site-menu');
const toggle = document.querySelector<HTMLButtonElement>('.vm-menu-toggle');
if (menu && toggle) {
  const desktop = window.matchMedia('(min-width: 48rem)');
  let open = false;
  const update = () => {
    menu.hidden = !desktop.matches && !open;
    toggle.hidden = desktop.matches;
    toggle.setAttribute('aria-expanded', String(!desktop.matches && open));
    toggle.textContent = open ? 'Close' : 'Menu';
  };
  toggle.addEventListener('click', () => {
    open = !open;
    update();
  });
  menu.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) {
      open = false;
      update();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) {
      open = false;
      update();
      toggle.focus();
    }
  });
  desktop.addEventListener('change', () => {
    const hadMenuFocus = menu.contains(document.activeElement);
    const hadToggleFocus = document.activeElement === toggle;
    open = false;
    update();
    if (!desktop.matches && hadMenuFocus) toggle.focus();
    if (desktop.matches && hadToggleFocus) menu.querySelector<HTMLAnchorElement>('a')?.focus();
  });
  update();
}

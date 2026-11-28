export function initServicesList() {
  // Phones: one <details> open at a time.
  const list = document.querySelector<HTMLElement>('[data-svc-list]');
  if (list) {
    const items = [...list.querySelectorAll<HTMLDetailsElement>('[data-svc-item]')];
    items.forEach((d, i) => (d.open = i === 0));
    list.classList.add('is-live');
    for (const d of items) {
      d.querySelector('summary')!.addEventListener('click', (e) => {
        if (!d.open) { e.preventDefault(); items.forEach((x) => (x.open = x === d)); }
      });
    }
  }
  // Desktop: hover or focus a service name to preview it.
  const desk = document.querySelector<HTMLElement>('[data-svc-desk]');
  if (desk) {
    const previews = [...desk.querySelectorAll<HTMLElement>('[data-svc-preview]')];
    const links = [...desk.querySelectorAll<HTMLAnchorElement>('[data-svc-index]')];
    const activate = (i: number) => {
      previews.forEach((p, n) => p.classList.toggle('is-active', n === i));
      links.forEach((l, n) => l.classList.toggle('is-active', n === i));
    };
    for (const l of links) {
      const i = Number(l.dataset.svcIndex);
      l.addEventListener('mouseenter', () => activate(i));
      l.addEventListener('focus', () => activate(i));
    }
    activate(0);
  }
}

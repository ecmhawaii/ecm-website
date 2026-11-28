// Gallery lightbox: native <dialog>, Escape to close, arrow keys to move, focus trapped.
export function initLightbox() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox-dialog]');
  const links = [...document.querySelectorAll<HTMLAnchorElement>('a[data-lightbox]')];
  if (!dialog || !links.length || typeof dialog.showModal !== 'function') return;

  const img = dialog.querySelector<HTMLImageElement>('[data-lb-img]')!;
  const cap = dialog.querySelector<HTMLElement>('[data-lb-caption]')!;
  const count = dialog.querySelector<HTMLElement>('[data-lb-count]')!;
  const prev = dialog.querySelector<HTMLButtonElement>('[data-lb-prev]')!;
  const next = dialog.querySelector<HTMLButtonElement>('[data-lb-next]')!;
  const close = dialog.querySelector<HTMLButtonElement>('[data-lb-close]')!;
  let group: HTMLAnchorElement[] = [];
  let index = 0;
  let opener: HTMLElement | null = null;

  const show = (i: number) => {
    index = (i + group.length) % group.length;
    const a = group[index];
    img.hidden = false;
    img.src = a.href;
    img.alt = a.dataset.alt || '';
    cap.textContent = a.dataset.caption || '';
    count.textContent = `${index + 1} / ${group.length}`;
    const multi = group.length > 1;
    prev.hidden = next.hidden = count.hidden = !multi;
  };

  for (const a of links) {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const list = a.closest('[data-gallery]');
      group = list ? [...list.querySelectorAll<HTMLAnchorElement>('a[data-lightbox]')] : [a];
      opener = a;
      show(group.indexOf(a));
      dialog.showModal();
      close.focus();
    });
  }
  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  close.addEventListener('click', () => dialog.close());
  // Click on the dark backdrop closes.
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { img.removeAttribute('src'); img.hidden = true; opener?.focus(); });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && group.length > 1) { e.preventDefault(); show(index + 1); }
    if (e.key === 'ArrowLeft' && group.length > 1) { e.preventDefault(); show(index - 1); }
    if (e.key === 'Tab') {
      // Keep focus inside the dialog.
      const f = [...dialog.querySelectorAll<HTMLElement>('button:not([hidden])')];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

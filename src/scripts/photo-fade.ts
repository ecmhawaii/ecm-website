// Lazy photos fade in over 250ms once decoded (2026-11-27). Only lazy PhotoSlot photos that
// have not loaded yet are hidden, and only by this script: eager and LCP photos are never touched,
// and without JavaScript every photo shows normally. Under reduced motion nothing is hidden.
// Until the photo arrives, its figure shows the build time gradient placeholder.
export function initPhotoFade() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (const img of document.querySelectorAll<HTMLImageElement>('img[data-photo][loading="lazy"]')) {
    if (img.complete) continue;
    img.classList.add('is-pending');
    const show = () => img.classList.remove('is-pending');
    img.addEventListener('load', () => { (img.decode ? img.decode() : Promise.resolve()).catch(() => undefined).then(show); }, { once: true });
    img.addEventListener('error', show, { once: true });
    if (img.complete) show(); // finished between the check above and the listener
  }
}

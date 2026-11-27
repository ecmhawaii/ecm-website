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

// Deferred photos (PhotoSlot `deferred`, 2026-11-27): the HTML carries no src, so the photo never
// competes with the LCP photo. Load it once the page has loaded and at least 1 second has passed
// since navigation (nothing competes with the hero in the first second), or as soon as it comes
// within 600px of the screen, whichever is first. Same 250ms fade as lazy photos (none under
// reduced motion).
export function initDeferredPhotos() {
  const imgs = [...document.querySelectorAll<HTMLImageElement>('img[data-defer-src]')];
  if (!imgs.length) return;
  const fade = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const load = (img: HTMLImageElement) => {
    const src = img.dataset.deferSrc;
    if (!src) return;
    if (fade) {
      img.classList.add('is-pending');
      const show = () => img.classList.remove('is-pending');
      img.addEventListener('load', () => { (img.decode ? img.decode() : Promise.resolve()).catch(() => undefined).then(show); }, { once: true });
      img.addEventListener('error', show, { once: true });
    }
    if (img.dataset.deferSrcset) img.srcset = img.dataset.deferSrcset;
    img.src = src;
    delete img.dataset.deferSrc;
    delete img.dataset.deferSrcset;
  };
  const loadAll = () => setTimeout(() => imgs.forEach(load), Math.max(0, 1000 - performance.now()));
  if (document.readyState === 'complete') loadAll();
  else addEventListener('load', loadAll, { once: true });
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { io.unobserve(e.target); load(e.target as HTMLImageElement); }
  }, { rootMargin: '0px 0px 600px 0px' });
  imgs.forEach((img) => io.observe(img));
}

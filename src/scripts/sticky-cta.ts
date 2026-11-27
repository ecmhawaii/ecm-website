// Phones: the sticky Call / Estimate bar stays hidden while the page's own hero or page head
// Call and Estimate buttons ([data-cta-watch]) are on screen, and shows once they scroll away
// (2026-11-27). CSS hides it on those pages from first paint only when scripting is enabled
// (global.css), so without JavaScript the bar is always shown. Pages without [data-cta-watch]
// show the bar all the time.
export function initStickyCta() {
  const targets = [...document.querySelectorAll<HTMLElement>('[data-cta-watch]')];
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) { document.body.classList.add('cta-show'); return; }
  const header = document.querySelector<HTMLElement>('.site-header');
  const top = header ? Math.round(header.getBoundingClientRect().height) : 0;
  const onScreen = new Set<Element>();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) { if (e.isIntersecting) onScreen.add(e.target); else onScreen.delete(e.target); }
    document.body.classList.toggle('cta-show', onScreen.size === 0);
  }, { rootMargin: `-${top}px 0px 0px 0px` });
  targets.forEach((t) => io.observe(t));
}

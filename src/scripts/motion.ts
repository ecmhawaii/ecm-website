// Motion entry (tiny). Decides whether to animate, then loads gsap.
// - Reduced motion: nothing to do (CSS never hides anything).
// - Waits for the hero / page-head photo (the LCP element), the page load event and the web
//   fonts, so gsap does not compete with the LCP image and SplitText splits lines in the
//   final font.
// - If that takes too long (slow connection), skip motion. Nothing was ever hidden by CSS, so
//   the page simply stays as it painted.
const root = document.documentElement;
const LATE_MS = 2000;
const MIN_START_MS = 600;

function off() { root.classList.add('motion-off'); }

async function start() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero = document.querySelector<HTMLImageElement>('[data-hero-img], .page-head-media img');
  const heroReady = hero && !hero.complete
    ? new Promise<void>((r) => { hero.addEventListener('load', () => r(), { once: true }); hero.addEventListener('error', () => r(), { once: true }); })
    : Promise.resolve();
  const fontsReady = document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve();
  // Wait for the load event and an idle moment too, so the gsap download never shares
  // bandwidth with the LCP photo.
  const loaded = document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise<void>((r) => addEventListener('load', () => r(), { once: true }));
  const idle = () => new Promise<void>((r) => ('requestIdleCallback' in window ? requestIdleCallback(() => r(), { timeout: 200 }) : setTimeout(r, 1)));
  // Never before 600ms after navigation: the LCP photo has painted by then on fast connections.
  const minDelay = () => new Promise<void>((r) => setTimeout(r, Math.max(0, MIN_START_MS - performance.now())));
  const timeout = new Promise<'late'>((r) => setTimeout(() => r('late'), LATE_MS));
  const ready = await Promise.race([Promise.all([heroReady, fontsReady, loaded, minDelay()]).then(idle).then(() => 'ok' as const), timeout]);
  if (ready === 'late') { off(); return; }
  try {
    const mod = await import('./motion-gsap');
    if (performance.now() > LATE_MS + 400) { off(); return; }
    mod.init();
  } catch {
    off();
  }
}

start();

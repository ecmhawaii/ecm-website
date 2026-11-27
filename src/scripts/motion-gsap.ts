// All page motion. gsap is installed from npm and bundled (self-hosted, no CDN).
// Loaded by scripts/motion.ts only after the hero photo and fonts are ready, so it never
// competes with the LCP image and SplitText measures lines in the real font.
// CSS never hides anything (2026-11-27). This module hides an element only if it is still
// below the screen when the module starts, then animates it in as it scrolls up. Anything on
// screen or already scrolled past stays exactly as it painted. Opacity and transform only,
// never visibility, so elements waiting to animate stay in the Tab order (WCAG 2.1.1).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

const root = document.documentElement;

/** True when the element's top is below the bottom of the screen right now. */
const below = (el: Element) => el.getBoundingClientRect().top >= innerHeight;

export function init() {
  root.classList.add('motion-ready');
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const ease = 'power3.out';

  // Hero and photo page heads: no gsap intro. Their text fades up in CSS (data-hero-in) and
  // the photo is never scaled, hidden or faded (it is the LCP element).

  // ---- Big hook statement: words rise as it scrolls in ----
  for (const el of gsap.utils.toArray<HTMLElement>('[data-split-words]').filter(below)) {
    const split = SplitText.create(el, { type: 'words', mask: 'words', aria: 'auto' });
    gsap.set(split.words, { yPercent: 100 });
    gsap.to(split.words, {
      yPercent: 0, duration: 0.8, ease, stagger: 0.05,
      scrollTrigger: { trigger: el, start: 'top 82%', once: true },
    });
  }

  // ---- Section reveals: once each, 30px, 0.7s ----
  const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]').filter(below);
  if (reveals.length) {
    gsap.set(reveals, { opacity: 0, y: 30 });
    ScrollTrigger.batch(reveals, {
      start: 'top 88%',
      once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.7, ease, stagger: 0.08, overwrite: true }),
    });
  }
  // Cards stagger in (only the ones still below the screen).
  for (const group of gsap.utils.toArray<HTMLElement>('[data-stagger]')) {
    const items = ([...group.children] as HTMLElement[]).filter(below);
    if (!items.length) continue;
    gsap.set(items, { opacity: 0, y: 36 });
    ScrollTrigger.batch(items, {
      start: 'top 92%',
      once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease, stagger: 0.1, overwrite: true }),
    });
  }

  // ---- How it works: the line draws as you scroll ----
  const line = document.querySelector<HTMLElement>('[data-steps-line]');
  if (line) {
    gsap.fromTo(line, { scaleX: 0, scaleY: 0 }, {
      scaleX: 1, scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '[data-steps]', start: 'top 75%', end: 'bottom 60%', scrub: 0.6 },
    });
  }

  // ---- Slow parallax: hero photo and the full-width band. Desktop only. ----
  const mm = gsap.matchMedia();
  mm.add('(min-width: 960px)', () => {
    for (const wrap of gsap.utils.toArray<HTMLElement>('[data-parallax]')) {
      const img = wrap.querySelector('img');
      if (!img) continue;
      gsap.fromTo(img, { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }
  });

  ScrollTrigger.refresh();

  // Sections with content-visibility: auto change size when they first render: re-measure.
  let t = 0;
  const refresh = () => { clearTimeout(t); t = window.setTimeout(() => ScrollTrigger.refresh(), 120); };
  for (const el of document.querySelectorAll('.cv-auto')) el.addEventListener('contentvisibilityautostatechange', refresh);
}

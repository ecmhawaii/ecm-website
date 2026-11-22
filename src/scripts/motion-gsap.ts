// All page motion. gsap is installed from npm and bundled (self-hosted, no CDN).
// Loaded by scripts/motion.ts only after the hero photo and fonts are ready, so it never
// competes with the LCP image and SplitText measures lines in the real font.
// CSS hides animated elements only when scripting is on and reduced motion is off;
// this module animates them in.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

const root = document.documentElement;

export function init() {
  root.classList.add('motion-ready');
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const ease = 'power3.out';

  // ---- Hero / page head intro (no preloader) ----
  // The hero photo is never hidden or faded: it only scales from 1.08 to 1, so it stays the LCP.
  const heroImg = document.querySelector<HTMLElement>('[data-hero-img], .page-head-media img');
  if (heroImg) gsap.fromTo(heroImg, { scale: 1.08 }, { scale: 1, duration: 1.4, ease: 'power2.out' });

  const title = document.querySelector<HTMLElement>('[data-hero-title]');
  const fades = gsap.utils.toArray<HTMLElement>('[data-hero-fade]');
  const intro = gsap.timeline({ defaults: { ease } });
  if (title) {
    const split = SplitText.create(title, { type: 'lines', mask: 'lines', aria: 'auto' });
    gsap.set(title, { autoAlpha: 1 });
    // Under 700ms in total for the headline: 0.45s plus at most 0.2s of stagger.
    intro.from(split.lines, { yPercent: 105, duration: 0.45, stagger: Math.min(0.05, 0.2 / Math.max(1, split.lines.length - 1)) });
  }
  if (fades.length) {
    intro.fromTo(fades, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 }, title ? '-=0.25' : 0);
  }

  // ---- Big hook statement: words rise as it scrolls in ----
  for (const el of gsap.utils.toArray<HTMLElement>('[data-split-words]')) {
    const split = SplitText.create(el, { type: 'words', mask: 'words', aria: 'auto' });
    gsap.set(el, { autoAlpha: 1 });
    gsap.from(split.words, {
      yPercent: 100, duration: 0.8, ease, stagger: 0.05,
      scrollTrigger: { trigger: el, start: 'top 82%', once: true },
    });
  }

  // ---- Section reveals: once each, 30px, 0.7s ----
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.7, ease, stagger: 0.08, overwrite: true }),
  });
  // Cards and photos stagger in.
  for (const group of gsap.utils.toArray<HTMLElement>('[data-stagger]')) {
    const items = [...group.children] as HTMLElement[];
    gsap.fromTo(items, { autoAlpha: 0, y: 36 }, {
      autoAlpha: 1, y: 0, duration: 0.8, ease, stagger: 0.1,
      scrollTrigger: { trigger: group, start: 'top 85%', once: true },
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

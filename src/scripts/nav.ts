// Header Services dropdown: an accessible disclosure.
// - JS off: "Services" is a plain link to /services (the button and menu stay hidden).
// - JS on: the link is swapped for a real button with aria-expanded.
//   Opens on click (Enter/Space), closes on Escape (focus returns to the button), on a click
//   outside, and when focus leaves the menu. Hover opens it too, on fine pointers only, as an extra.
export function initNav() {
  for (const dd of document.querySelectorAll<HTMLElement>('[data-nav-dd]')) {
    const link = dd.querySelector<HTMLAnchorElement>('.nav-dd-link')!;
    const button = dd.querySelector<HTMLButtonElement>('[data-dd-toggle]')!;
    const menu = dd.querySelector<HTMLElement>('[data-dd-menu]')!;
    link.hidden = true;
    button.hidden = false;
    let byHover = false; // true while the menu is open only because the mouse is over it
    const isOpen = () => button.getAttribute('aria-expanded') === 'true';
    const set = (open: boolean) => {
      if (!open) byHover = false;
      button.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      dd.classList.toggle('is-open', open);
    };
    // Opened by hover: a click then pins it open instead of closing it (the mouse reaches the
    // button before the click lands). A pinned menu stays open until Escape or a click outside.
    button.addEventListener('click', () => {
      if (byHover && isOpen()) { byHover = false; return; }
      byHover = false;
      set(!isOpen());
    });
    dd.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) { e.preventDefault(); set(false); button.focus(); }
    });
    dd.addEventListener('focusout', (e) => {
      if (isOpen() && !dd.contains(e.relatedTarget as Node | null)) set(false);
    });
    document.addEventListener('click', (e) => {
      if (isOpen() && !dd.contains(e.target as Node)) set(false);
    });
    const hover = matchMedia('(hover: hover) and (pointer: fine)');
    let leaveTimer = 0;
    dd.addEventListener('mouseenter', () => {
      if (!hover.matches) return;
      clearTimeout(leaveTimer);
      if (!isOpen()) { byHover = true; set(true); }
    });
    dd.addEventListener('mouseleave', () => {
      if (hover.matches && byHover) leaveTimer = window.setTimeout(() => { if (byHover) { byHover = false; set(false); } }, 180);
    });
  }
}

// Before / after slider. The native range input handles mouse, touch and keyboard.
export function initCompare() {
  for (const root of document.querySelectorAll<HTMLElement>('[data-compare]')) {
    const range = root.querySelector<HTMLInputElement>('[data-compare-range]');
    const hint = root.querySelector<HTMLElement>('[data-compare-hint]');
    if (!range) continue;
    const afterLabel = root.querySelector('.compare-label-after')?.textContent ?? '';
    const set = () => {
      root.style.setProperty('--pos', `${range.value}%`);
      range.setAttribute('aria-valuetext', `${range.value}% ${afterLabel}`);
    };
    range.hidden = false;
    if (hint) hint.hidden = false;
    root.classList.add('is-live');
    range.addEventListener('input', set);
    set();
  }
}

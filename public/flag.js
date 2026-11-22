// Runs before first paint. Marks that JavaScript is on, and that motion is allowed.
// CSS hides elements for animation ONLY under html.motion, so with JS off or with
// prefers-reduced-motion everything shows at once. External file: the CSP allows 'self' only.
(function (d) {
  var c = d.documentElement.classList;
  c.add('js');
  if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) c.add('motion');
  // Safety net: if the motion module never runs (blocked, slow network), show everything.
  setTimeout(function () { if (!c.contains('motion-ready')) c.remove('motion'); }, 2500);
})(document);

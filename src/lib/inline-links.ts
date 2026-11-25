// Plain text with [label](/path) links to pages on this site -> safe HTML.
// Only same-site paths starting with "/" become links; everything else is escaped text.
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export function inlineLinks(text: string): string {
  let out = '';
  let last = 0;
  for (const m of text.matchAll(/\[([^\]]+)\]\((\/[a-z0-9\-\/#?=&]*)\)/gi)) {
    out += esc(text.slice(last, m.index));
    out += `<a href="${esc(m[2])}">${esc(m[1])}</a>`;
    last = m.index! + m[0].length;
  }
  return out + esc(text.slice(last));
}

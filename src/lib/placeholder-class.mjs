// Class name for a photo's build time placeholder (scripts/placeholders.mjs writes the CSS;
// PhotoSlot adds the class). Keyed by the source file's base name, e.g. "waianae-addition-roof-edit".
export function placeholderClass(baseName) {
  let h = 5381;
  for (let i = 0; i < baseName.length; i++) h = ((h << 5) + h + baseName.charCodeAt(i)) >>> 0;
  return `ph-${h.toString(36)}`;
}

/** Base name of an image URL or path: "/_astro/name.Hash.jpg" or "/@fs/.../name.jpg?x" -> "name". */
export function imageBaseName(src) {
  return String(src).split('?')[0].split('/').pop().split('.')[0];
}

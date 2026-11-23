// Final guides, loaded from the approved Markdown in src/content/guides/*.md.
//
// Loading: Astro renders each .md file with its default processor and exposes `frontmatter`
// and `compiledContent()` (the HTML) on the module (see `declare module '*.md'` in astro's
// client types). No Markdown plugins and no new dependencies.
//
// The Markdown is approved final copy: this file never changes wording. It only:
//   - splits the HTML into body, FAQ and Sources (FAQ renders once, through the Faq component)
//   - turns citation markers like [6] into superscript links to the matching source
//   - gives each source an id (source-N) and adds rel="noopener" to external links
//   - wraps tables in a horizontal scroll container (the table scrolls, not the page)
// It throws (failing the build) instead of guessing if the structure is not as expected.
import { guides as draftGuides, guidePath, guidesHub } from '../content/site';

type Frontmatter = { slug: string; status: string; title: string; description: string; h1: string; checked: string | Date };
type MdModule = { frontmatter: Frontmatter; compiledContent: () => string | Promise<string> };

export type FaqItem = { q: string; aHtml: string; aText: string };
export type FinalGuide = {
  slug: string;
  status: 'final';
  title: string;
  description: string;
  h1: string;
  checkedISO: string; // 2026-11-22
  checkedLabel: string; // November 22, 2026
  bodyHtml: string;
  faqHeading: string;
  faq: FaqItem[];
  sourcesHtml: string;
  sourcesHeading: string;
  toc: Array<{ id: string; text: string }>;
};

const decode = (s: string) =>
  s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const stripTags = (s: string) => decode(s.replace(/<[^>]+>/g, ''));

function fail(slug: string, msg: string): never {
  throw new Error(`[guides] ${slug}: ${msg}. The Markdown was not changed; fix the structure or report it.`);
}

/** Replace [N] markers in text (never inside tags) with superscript links to #source-N. */
function linkCitations(html: string, slug: string, sourceCount: number): string {
  return html.replace(/(<[^>]*>)|([^<]+)/g, (m, tag, text) => {
    if (tag) return tag;
    return text.replace(/\[(\d{1,2})\]/g, (_: string, n: string) => {
      const i = Number(n);
      if (i < 1 || i > sourceCount) fail(slug, `citation [${n}] has no matching source (there are ${sourceCount})`);
      return `<sup class="cite"><a href="#source-${i}" aria-label="Source ${i}">[${i}]</a></sup>`;
    });
  });
}

const externalRel = (html: string) =>
  html.replace(/<a href="(https?:\/\/[^"]+)"(?![^>]*\brel=)/g, '<a href="$1" rel="noopener"');

function wrapTables(html: string): string {
  let out = '';
  let last = 0;
  const re = /<table>[\s\S]*?<\/table>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const before = html.slice(0, m.index);
    const h2s = [...before.matchAll(/<h2 id="([^"]+)"/g)];
    const labelledby = h2s.length ? h2s[h2s.length - 1][1] : '';
    out += html.slice(last, m.index);
    out += `<div class="table-wrap" role="region" tabindex="0"${labelledby ? ` aria-labelledby="${labelledby}"` : ''}>${m[0]}</div>`;
    last = m.index + m[0].length;
  }
  return out + html.slice(last);
}

async function build(mod: MdModule): Promise<FinalGuide> {
  const fm = mod.frontmatter;
  const slug = fm.slug;
  if (fm.status !== 'final') fail(slug, `status is "${fm.status}", expected "final"`);
  for (const k of ['title', 'description', 'h1', 'checked'] as const) if (!fm[k]) fail(slug, `missing frontmatter "${k}"`);

  const html = await mod.compiledContent();
  const faqAt = html.search(/<h2 id="faq">/);
  const srcAt = html.search(/<h2 id="sources">/);
  if (faqAt < 0 || srcAt < 0 || srcAt < faqAt) fail(slug, 'expected "## FAQ" followed by "## Sources"');

  const body = html.slice(0, faqAt);
  const faqBlock = html.slice(faqAt, srcAt);
  const sources = html.slice(srcAt);

  // Sources: one <ol>, each <li> gets id="source-N".
  const olMatch = sources.match(/<ol>([\s\S]*?)<\/ol>/);
  if (!olMatch) fail(slug, 'no numbered list under Sources');
  let n = 0;
  const olWithIds = olMatch[0].replace(/<li>/g, () => `<li id="source-${++n}">`);
  const sourceCount = n;
  const sourcesHtml = externalRel(sources.replace(olMatch[0], olWithIds));
  const sourcesHeading = stripTags(sources.match(/<h2 id="sources">([\s\S]*?)<\/h2>/)![1]);

  // FAQ: "### question" then exactly one paragraph answer.
  const faqHeading = stripTags(faqBlock.match(/<h2 id="faq">([\s\S]*?)<\/h2>/)![1]);
  const rest = faqBlock.replace(/<h2 id="faq">[\s\S]*?<\/h2>/, '').trim();
  const pairs = [...rest.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)];
  const leftover = rest.replace(/<h3[^>]*>[\s\S]*?<\/h3>\s*<p>[\s\S]*?<\/p>/g, '').trim();
  if (!pairs.length || leftover) fail(slug, 'FAQ must be "### question" each followed by one paragraph');
  const faq = pairs.map(([, q, a]) => ({
    q: stripTags(q),
    aHtml: externalRel(linkCitations(a, slug, sourceCount)),
    // Plain text for FAQPage structured data: the answer exactly as written, with the
    // bracketed citation numbers left out (they are references, not part of the answer).
    aText: stripTags(a).replace(/\s*\[\d{1,2}\]/g, '').replace(/\s+/g, ' ').trim(),
  }));

  const bodyHtml = wrapTables(externalRel(linkCitations(body, slug, sourceCount)));
  const toc = [...body.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map(([, id, t]) => ({ id, text: stripTags(t) }));

  // YAML dates may arrive as a Date or as a timestamp string ("2026-11-22T00:00:00.000Z").
  const raw = fm.checked instanceof Date ? fm.checked.toISOString() : String(fm.checked);
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T00:00:00Z` : raw);
  if (Number.isNaN(d.getTime())) fail(slug, `checked "${fm.checked}" is not a date`);
  const checkedISO = d.toISOString().slice(0, 10);
  const checkedLabel = d.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' });

  return { slug, status: 'final', title: fm.title, description: fm.description, h1: fm.h1, checkedISO, checkedLabel, bodyHtml, faqHeading, faq, sourcesHtml, sourcesHeading, toc };
}

const modules = import.meta.glob<MdModule>('../content/guides/*.md', { eager: true });
export const finalGuides: FinalGuide[] = await Promise.all(Object.values(modules).map(build));

// Order on the hub and in the footer.
const ORDER = ['hiring-a-general-contractor-in-hawaii', 'cost-to-build-a-house-in-hawaii', 'bathroom-remodel-cost-honolulu'];
const rank = (slug: string) => { const i = ORDER.indexOf(slug); return i < 0 ? 99 : i; };
finalGuides.sort((a, b) => rank(a.slug) - rank(b.slug));

for (const g of finalGuides) {
  if (draftGuides.some((d) => d.slug === g.slug)) fail(g.slug, 'also listed as a placeholder in site.ts guides');
}

/** Every guide (final from Markdown, drafts from site.ts), for links and listings. */
export const allGuides = [
  ...finalGuides.map((g) => ({ slug: g.slug, status: 'final' as const, h1: g.h1, description: g.description, href: guidePath(g.slug) })),
  ...draftGuides.map((g) => ({ slug: g.slug, status: g.status, h1: g.h1, description: g.description, href: guidePath(g.slug) })),
];
export const publishedGuides = allGuides.filter((g) => g.status === 'final');
export const findGuide = (slug: string) => allGuides.find((g) => g.slug === slug);
export { guidesHub };

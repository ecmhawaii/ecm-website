import { faqs, business } from '../content/site';
import { SITE } from '../../site.config.mjs';

function faqPage(items: Array<{ q: string; a: string }>): object[] {
  if (!items.length) return [];
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];
}

/** FAQPage structured data for a page keyed in site.ts, or nothing if its list is empty. */
export function faqSchema(page: string): object[] {
  return faqPage(faqs[page] ?? []);
}

/** FAQPage structured data from a final guide's Markdown FAQ. */
export function faqSchemaFromItems(items: Array<{ q: string; aText: string }>): object[] {
  return faqPage(items.map((i) => ({ q: i.q, a: i.aText })));
}

/** Article structured data for a final guide. dateModified comes from the `checked` field. */
export function articleSchema(g: { h1: string; description: string; checkedISO: string; path: string }): object {
  const url = new URL(g.path, SITE).href;
  const org = { '@type': 'Organization', '@id': `${SITE}/#business`, name: business.name, url: `${SITE}/` };
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: g.h1,
    description: g.description,
    dateModified: g.checkedISO,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    author: org,
    publisher: org,
    inLanguage: 'en-US',
  };
}

import { faqs } from '../content/site';

/** FAQPage structured data for a page, or nothing if its FAQ list is empty. */
export function faqSchema(page: string): object[] {
  const items = faqs[page] ?? [];
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

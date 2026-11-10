import type { JsonLdData } from '@site/core/seo';

/** `FAQPage` for the questions that are visible on the page, in the same order and wording. */
export function buildFaqPageJsonLd(
  items: readonly { question: string; answer: string }[],
): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import type { CatalogTextBlock } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** One tag for the page texts, so a «refresh the site» call can drop them. */
export const SITE_PAGES_CACHE_TAG = 'site-pages';

export type SiteLocaleKey = 'uk' | 'ru';

/** A frequent question of a page with its answer, plain text. */
export type SiteFaqItem = { question: string; answer: string };

/**
 * Texts staff saved for one fixed page in «Контент → Сторінки сайту»: search title and description, the main text
 * and the frequent questions. Null or empty keeps the site's own.
 */
export type SitePageText = {
  title: string | null;
  description: string | null;
  text: readonly CatalogTextBlock[];
  faq: readonly SiteFaqItem[];
};

export type SitePageTexts = Record<string, Record<SiteLocaleKey, SitePageText>>;

const PAGES_LIFE = { stale: 300, revalidate: 300, expire: 86_400 };
const FAILURE_LIFE = { stale: 60, revalidate: 60, expire: 3_600 };

const line = (value: unknown, name: string): string | null => {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') throw new Error(`Unexpected ${name}.`);
  return value.trim() || null;
};

const items = (value: unknown, name: string): unknown[] => {
  if (value === null || value === undefined) return [];
  if (!Array.isArray(value)) throw new Error(`Unexpected ${name}.`);
  return value;
};

const fields = (value: unknown, name: string): Record<string, unknown> => {
  if (!value || typeof value !== 'object') throw new Error(`Unexpected ${name}.`);
  return value as Record<string, unknown>;
};

function mapBlock(value: unknown): CatalogTextBlock | null {
  const block = fields(value, 'text block');
  const kind = block['kind'];
  if (kind === 'List') {
    const lines = items(block['items'], 'list items')
      .map((item) => line(item, 'list item'))
      .filter((item): item is string => item !== null);
    return lines.length > 0 ? { type: 'list', items: lines } : null;
  }
  const body = line(block['text'], 'block text') ?? '';
  if (kind === 'Heading') return body ? { type: 'heading', text: body } : null;
  if (kind !== 'Paragraph') throw new Error('Unexpected block kind.');
  const lead = line(block['lead'], 'block lead');
  if (!body && !lead) return null;
  return lead ? { type: 'paragraph', text: body, lead } : { type: 'paragraph', text: body };
}

function mapFaq(value: unknown): SiteFaqItem | null {
  const item = fields(value, 'question');
  const question = line(item['question'], 'question');
  const answer = line(item['answer'], 'answer');
  return question && answer ? { question, answer } : null;
}

function mapText(value: unknown): SitePageText {
  const text = fields(value, 'page text');
  return {
    title: line(text['title'], 'title'),
    description: line(text['description'], 'description'),
    text: items(text['text'], 'page main text')
      .map(mapBlock)
      .filter((block): block is CatalogTextBlock => block !== null),
    faq: items(text['faq'], 'page questions')
      .map(mapFaq)
      .filter((item): item is SiteFaqItem => item !== null),
  };
}

/** Texts by page key of the API answer; throws on another shape. */
export function mapSitePageTexts(data: unknown): SitePageTexts {
  const items = (data as { items?: unknown } | null)?.items;
  if (!Array.isArray(items)) throw new Error('Unexpected page texts.');
  const result: SitePageTexts = {};
  for (const item of items) {
    const page = (item ?? {}) as Record<string, unknown>;
    if (typeof page['key'] !== 'string') throw new Error('Unexpected page key.');
    result[page['key']] = { uk: mapText(page['uk']), ru: mapText(page['ru']) };
  }
  return result;
}

/** Every saved page text; none when the API is unavailable (kept for a minute only). */
export async function loadSitePageTexts(): Promise<SitePageTexts> {
  'use cache';
  cacheTag(SITE_PAGES_CACHE_TAG);

  const result = await siteApiGet('/api/public/site-pages');
  if (result.kind === 'ok') {
    try {
      const texts = mapSitePageTexts(result.data);
      cacheLife(PAGES_LIFE);
      return texts;
    } catch {
      // Falls through to the short life below.
    }
  }
  cacheLife(FAILURE_LIFE);
  return {};
}

/** What staff wrote for one page in one language; undefined when nothing was saved. */
export async function loadSitePageText(
  key: string,
  locale: Locale,
): Promise<SitePageText | undefined> {
  return (await loadSitePageTexts())[key]?.[locale];
}

import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

/** One tag for the page texts, so a «refresh the site» call can drop them. */
export const SITE_PAGES_CACHE_TAG = 'site-pages';

export type SiteLocaleKey = 'uk' | 'ru';

/** Search texts staff saved for one fixed page in «Контент → Сторінки сайту»; null keeps the site's own. */
export type SitePageText = { title: string | null; description: string | null };

export type SitePageTexts = Record<string, Record<SiteLocaleKey, SitePageText>>;

const PAGES_LIFE = { stale: 300, revalidate: 300, expire: 86_400 };
const FAILURE_LIFE = { stale: 60, revalidate: 60, expire: 3_600 };

const line = (value: unknown, name: string): string | null => {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') throw new Error(`Unexpected ${name}.`);
  return value.trim() || null;
};

function mapText(value: unknown): SitePageText {
  if (!value || typeof value !== 'object') throw new Error('Unexpected page text.');
  const text = value as Record<string, unknown>;
  return {
    title: line(text['title'], 'title'),
    description: line(text['description'], 'description'),
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

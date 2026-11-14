import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

/** One tag for the settings, so a «refresh the site» call can drop them. */
export const SITE_SETTINGS_CACHE_TAG = 'site-settings';

/** «Контент → Налаштування SEO сайту» as the site uses it; empty fields are null. */
export type SiteSettings = {
  googleAnalyticsId: string | null;
  googleTagManagerId: string | null;
  googleSiteVerification: string | null;
  bingSiteVerification: string | null;
  sharePicture: { url: string; width: number | null; height: number | null } | null;
};

export const EMPTY_SITE_SETTINGS: SiteSettings = {
  googleAnalyticsId: null,
  googleTagManagerId: null,
  googleSiteVerification: null,
  bingSiteVerification: null,
  sharePicture: null,
};

/** Settings are kept for five minutes: a change in the Admin reaches the site within about that time. */
const SETTINGS_LIFE = { stale: 300, revalidate: 300, expire: 86_400 };
const FAILURE_LIFE = { stale: 60, revalidate: 60, expire: 3_600 };

const text = (value: unknown, name: string): string | null => {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') throw new Error(`Unexpected ${name}.`);
  return value.trim() || null;
};

const size = (value: unknown): number | null =>
  typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : null;

/** The settings of the API answer; throws on another shape. */
export function mapSiteSettings(data: unknown): SiteSettings {
  if (!data || typeof data !== 'object') throw new Error('Unexpected site settings.');
  const raw = data as Record<string, unknown>;
  const image = raw['defaultOgImage'] as Record<string, unknown> | null | undefined;
  let sharePicture: SiteSettings['sharePicture'] = null;
  if (image) {
    const url = text(image['url'], 'picture');
    if (url && /^https:\/\//.test(url))
      sharePicture = { url, width: size(image['width']), height: size(image['height']) };
  }
  return {
    googleAnalyticsId: text(raw['googleAnalyticsId'], 'analytics id'),
    googleTagManagerId: text(raw['googleTagManagerId'], 'tag manager id'),
    googleSiteVerification: text(raw['googleSiteVerification'], 'verification'),
    bingSiteVerification: text(raw['bingSiteVerification'], 'verification'),
    sharePicture,
  };
}

/** The settings; empty ones when the API is unavailable (kept for a minute only). */
export async function loadSiteSettings(): Promise<SiteSettings> {
  'use cache';
  cacheTag(SITE_SETTINGS_CACHE_TAG);

  const result = await siteApiGet('/api/public/site-settings');
  if (result.kind === 'ok') {
    try {
      const settings = mapSiteSettings(result.data);
      cacheLife(SETTINGS_LIFE);
      return settings;
    } catch {
      // Falls through to the short life below.
    }
  }
  cacheLife(FAILURE_LIFE);
  return EMPTY_SITE_SETTINGS;
}

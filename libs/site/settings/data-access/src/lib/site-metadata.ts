import { withSharePicture } from '@site/core/seo';

import { withPageText } from './page-text-metadata';
import { loadSitePageTexts } from './site-pages-loader';
import { loadSiteSettings } from './site-settings-loader';

import type { SiteLocaleKey } from './site-pages-loader';
import type { Metadata } from 'next';

/**
 * Page metadata with the sharing picture of «Налаштування SEO сайту» when the page has no picture of its own.
 * Product, category and article pages pass their metadata through here.
 */
export async function withSiteSharePicture(metadata: Metadata): Promise<Metadata> {
  const settings = await loadSiteSettings();
  return withSharePicture(metadata, settings.sharePicture);
}

/**
 * Metadata of a fixed page: the texts of «Контент → Сторінки сайту» for `key` over the page's own, and the
 * sharing picture.
 */
export async function sitePageMetadata(
  key: string,
  locale: SiteLocaleKey,
  metadata: Metadata,
): Promise<Metadata> {
  const [texts, settings] = await Promise.all([loadSitePageTexts(), loadSiteSettings()]);
  return withSharePicture(withPageText(metadata, texts[key]?.[locale]), settings.sharePicture);
}

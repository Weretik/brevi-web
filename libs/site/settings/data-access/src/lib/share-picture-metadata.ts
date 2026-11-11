import { withSharePicture } from '@site/core/seo';

import { loadSiteSettings } from './site-settings-loader';

import type { Metadata } from 'next';

/**
 * Page metadata with the sharing picture of «Налаштування SEO сайту» when the page has no picture of its own.
 * Every page's `generateMetadata` passes its metadata through here.
 */
export async function withSiteSharePicture(metadata: Metadata): Promise<Metadata> {
  const settings = await loadSiteSettings();
  return withSharePicture(metadata, settings.sharePicture);
}

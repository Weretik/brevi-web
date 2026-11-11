import type { Metadata } from 'next';

/** Codes of «Контент → Налаштування SEO сайту» that the site places on every page. */
export type SiteCodes = {
  googleAnalyticsId: string | null;
  googleTagManagerId: string | null;
  googleSiteVerification: string | null;
  bingSiteVerification: string | null;
};

/** A picture for link previews when a page has none of its own. */
export type SharePicture = { url: string; width: number | null; height: number | null };

const ANALYTICS_ID = /^G-[A-Z0-9]{4,15}$/;
const TAG_MANAGER_ID = /^GTM-[A-Z0-9]{4,12}$/;
const VERIFICATION = /^[A-Za-z0-9_-]{8,100}$/;

/** The id when it has the shape Google gives; anything else never reaches a script. */
export function analyticsId(value: string | null): string | null {
  return value && ANALYTICS_ID.test(value) ? value : null;
}

export function tagManagerId(value: string | null): string | null {
  return value && TAG_MANAGER_ID.test(value) ? value : null;
}

/** `google-site-verification` and Bing `msvalidate.01` meta tags for the root layout. */
export function buildVerificationMetadata(codes: SiteCodes): Metadata['verification'] {
  const google = codes.googleSiteVerification;
  const bing = codes.bingSiteVerification;
  const verification: NonNullable<Metadata['verification']> = {};
  if (google && VERIFICATION.test(google)) verification.google = google;
  if (bing && VERIFICATION.test(bing)) verification.other = { 'msvalidate.01': bing };
  return Object.keys(verification).length > 0 ? verification : undefined;
}

/**
 * Adds the default sharing picture to page metadata whose Open Graph has no picture of its own. A page's
 * `openGraph` replaces the layout's whole, so the picture is added to each page.
 */
export function withSharePicture(metadata: Metadata, picture: SharePicture | null): Metadata {
  const openGraph = metadata.openGraph;
  if (!picture || !openGraph || openGraph.images) return metadata;
  const image = {
    url: picture.url,
    ...(picture.width ? { width: picture.width } : {}),
    ...(picture.height ? { height: picture.height } : {}),
  };
  return { ...metadata, openGraph: { ...openGraph, images: [image] } };
}

import type { SiteConfig } from '@site/core/config';
import type { Metadata } from 'next';

/** Robots meta for a page: everything is `noindex, nofollow` until indexing is enabled for the site. */
export function buildRobotsMeta(
  config: Pick<SiteConfig, 'indexingEnabled'>,
  indexable: boolean,
): NonNullable<Metadata['robots']> {
  if (!config.indexingEnabled) return { index: false, follow: false };
  return indexable ? { index: true, follow: true } : { index: false, follow: true };
}

import { buildRobotsFile } from '@site/core/seo';

import type { MetadataRoute } from 'next';

/** Static: robots.txt never reads the API, so an API failure cannot block crawling of the whole site. */
export default function robots(): MetadataRoute.Robots {
  return buildRobotsFile();
}

import { notFound, permanentRedirect } from 'next/navigation';

import { findRedirect } from './redirect-path';
import { loadRedirects } from './redirects-loader';

/**
 * For a page the site does not have: a 308 permanent redirect to the new page when «Контент → Переадресації»
 * knows the address (an old-site link, a renamed product, category or article), otherwise the 404 page.
 */
export async function redirectOrNotFound(path: string): Promise<never> {
  const target = findRedirect(new Map(await loadRedirects()), path);
  if (target) permanentRedirect(target);
  notFound();
}

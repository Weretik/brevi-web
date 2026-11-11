import { redirectOrNotFound } from '@site/redirects/data-access';

import { MOVED_PREFIX } from '../../../proxy-paths';

/**
 * Unknown paths: an old address known to «Контент → Переадресації» gets a permanent redirect to its new page;
 * the rest get the 404 inside the site frame from `[locale]/not-found.tsx`, so the visitor keeps the menu and
 * the phone. Paths without a locale (`/specodyag-litnij`) arrive here from the proxy under `/uk/_moved/`.
 */
export default async function UnknownPage({ params }: PageProps<'/[locale]/[...rest]'>) {
  const { locale, rest } = await params;
  const moved = rest[0] === MOVED_PREFIX;
  return redirectOrNotFound(moved ? `/${rest.slice(1).join('/')}` : `/${locale}/${rest.join('/')}`);
}

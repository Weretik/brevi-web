import { DEFAULT_LOCALE } from '@site/core/i18n';
import { NextResponse } from 'next/server';

import { MOVED_PREFIX } from './proxy-paths';

import type { NextRequest } from 'next/server';

/**
 * Paths whose first segment is not a locale (old-site addresses such as `/specodyag-litnij`) still match
 * `[locale]`, and the root layout cannot render them. Rewriting them under the default locale to
 * `/uk/_moved/<path>` lets `[locale]/[...rest]` answer a permanent redirect from «Переадресації» or the
 * framed 404, while the address bar keeps the requested URL.
 */
export function proxy(request: NextRequest) {
  const url = new URL(`/${DEFAULT_LOCALE}/${MOVED_PREFIX}${request.nextUrl.pathname}`, request.url);
  return NextResponse.rewrite(url);
}

export const config = {
  // Static literal required by Next.js: keep the locale list in sync with LOCALES in @site/core/i18n.
  // Skips locale paths, the root (redirected in next.config.mjs), route handlers under /api/, Next.js internals,
  // and files with an extension.
  matcher: ['/((?!uk(?:/|$)|ru(?:/|$)|api/|_next/|.*\\..*).+)'],
};

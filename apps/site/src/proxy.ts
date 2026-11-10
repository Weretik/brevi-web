import { DEFAULT_LOCALE } from '@site/core/i18n';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

/**
 * Paths whose first segment is not a locale still match `[locale]`, and the root layout cannot render a framed
 * 404 for them. Rewriting them to an unmatched path under the default locale serves `global-not-found.tsx`
 * with status 404 while the address bar keeps the requested URL.
 */
export function proxy(request: NextRequest) {
  return NextResponse.rewrite(new URL(`/${DEFAULT_LOCALE}/_not-found`, request.url));
}

export const config = {
  // Static literal required by Next.js: keep the locale list in sync with LOCALES in @site/core/i18n.
  // Skips locale paths, the root (redirected in next.config.ts), route handlers under /api/, Next.js internals,
  // and files with an extension.
  matcher: ['/((?!uk(?:/|$)|ru(?:/|$)|api/|_next/|.*\\..*).+)'],
};

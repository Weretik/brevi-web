'use client';

import { ErrorView } from '@site/core/shell/error';

/** Data failures of a page render inside the site frame with status 500. */
export default function LocaleError({ retry }: { error: unknown; retry: () => void }) {
  return <ErrorView retry={retry} />;
}

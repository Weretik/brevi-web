import { DEFAULT_LOCALE, isLocale } from '@site/core/i18n';
import { NotFoundView } from '@site/core/shell';
import { locale as rootLocale } from 'next/root-params';

/**
 * 404 inside the site frame for `notFound()` calls from pages (missing product or category). Not-found files get
 * no params, so the locale comes from the root params. Unmatched URLs are answered by `global-not-found.tsx`.
 */
export default async function LocaleNotFound() {
  const locale = await rootLocale();
  return <NotFoundView locale={isLocale(locale) ? locale : DEFAULT_LOCALE} />;
}

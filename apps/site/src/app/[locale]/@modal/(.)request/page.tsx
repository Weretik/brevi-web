import { REQUEST_PRODUCT_PARAM, isLocale } from '@site/core/i18n';
import { RequestModal } from '@site/request/feature';

/**
 * «Залишити заявку» and «Купити» clicked inside the site: the request form opens as a window over the current
 * page. Opening `/uk/request` directly, or reloading, shows the full request page.
 */
export default async function RequestModalSlot({
  params,
  searchParams,
}: PageProps<'/[locale]/request'>) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) return null;
  const product = query[REQUEST_PRODUCT_PARAM];

  return (
    <RequestModal locale={locale} product={typeof product === 'string' ? product : undefined} />
  );
}

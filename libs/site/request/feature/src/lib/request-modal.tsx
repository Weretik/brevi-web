import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { RequestDialog, RequestForm, getRequestDictionary } from '@site/request/ui';
import { loadSiteCompany } from '@site/settings/data-access';

import { submitRequest } from './submit-request';

import type { Locale } from '@site/core/i18n';

/**
 * The «Заявка» form in a window over the current page: what every «Залишити заявку» and «Купити» opens
 * inside the site. The same form and Server Action as the request page; opening the address directly shows
 * the page instead.
 */
export async function RequestModal({ locale, product }: { locale: Locale; product?: string }) {
  const company = await loadSiteCompany();
  const dictionary = getRequestDictionary(locale);
  const path = (key: keyof typeof SITE_PATHS) => localizedPath(locale, SITE_PATHS[key]);

  return (
    <RequestDialog
      title={dictionary.breadcrumb}
      description={dictionary.lead}
      closeLabel={dictionary.close}
    >
      <RequestForm
        company={company}
        dictionary={{ form: dictionary.form, sent: dictionary.sent }}
        action={submitRequest.bind(null, locale)}
        agreementHref={path('agreement')}
        catalogHref={path('catalog')}
        product={product}
      />
    </RequestDialog>
  );
}

import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import { RequestFacts, RequestForm, RequestIntro, getRequestDictionary } from '@site/request/ui';
import { loadSiteCompany } from '@site/settings/data-access';
import { Breadcrumbs } from '@site/shared/ui';

import { submitRequest } from './submit-request';

import type { Locale } from '@site/core/i18n';

/**
 * «Заявка» page: the visitor leaves a phone (and, if they wish, what to sew) and a manager calls back.
 * The text is on the left, the form on the right.
 */
export async function RequestPage({ locale }: { locale: Locale }) {
  const company = await loadSiteCompany();
  const dictionary = getRequestDictionary(locale);
  const path = (key: keyof typeof SITE_PATHS) => localizedPath(locale, SITE_PATHS[key]);
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.breadcrumb, href: path('request') },
  ];

  return (
    <div className="grid gap-10 pt-6 pb-4 sm:gap-14 sm:pt-8">
      <Breadcrumbs items={breadcrumbs} label={dictionary.breadcrumbsLabel} />
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-14">
        <RequestIntro company={company} dictionary={dictionary} />
        <RequestForm
          company={company}
          dictionary={{ form: dictionary.form, sent: dictionary.sent }}
          action={submitRequest}
          agreementHref={path('agreement')}
          catalogHref={path('catalog')}
        />
      </div>
      <RequestFacts dictionary={dictionary} />
      <JsonLd
        data={buildBreadcrumbJsonLd(
          breadcrumbs.map((item) => ({ name: item.name, path: item.href })),
        )}
      />
    </div>
  );
}

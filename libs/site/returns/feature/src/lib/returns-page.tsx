import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import { ReturnsGeneral, ReturnsGroups, getReturnsDictionary } from '@site/returns/ui';
import { PageHeader, PageSection } from '@site/shared/ui';

import type { Locale } from '@site/core/i18n';

/**
 * «Повернення та обмін» page in the order of the live `brevi.com.ua` page: general rules, conditions, and the
 * step-by-step exchange instruction. Static: the text is in the returns dictionary.
 */
export function ReturnsPage({ locale }: { locale: Locale }) {
  const dictionary = getReturnsDictionary(locale);
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.breadcrumb, href: localizedPath(locale, SITE_PATHS.returnsExchanges) },
  ];

  return (
    <div className="grid gap-14 pb-4 sm:gap-16">
      <PageHeader
        breadcrumbs={breadcrumbs}
        breadcrumbsLabel={dictionary.breadcrumbsLabel}
        label={dictionary.label}
        title={dictionary.title}
        lead={dictionary.lead}
      />

      <PageSection
        id="returns-general"
        title={dictionary.general.title}
        label={{ index: '02', text: dictionary.general.label }}
      >
        <ReturnsGeneral dictionary={dictionary.general} />
      </PageSection>

      <PageSection
        id="returns-conditions"
        title={dictionary.conditions.title}
        label={{ index: '03', text: dictionary.conditions.label }}
      >
        <ReturnsGroups groups={dictionary.conditions.groups} />
      </PageSection>

      <PageSection
        id="returns-steps"
        title={dictionary.steps.title}
        label={{ index: '04', text: dictionary.steps.label }}
        action={{
          href: localizedPath(locale, SITE_PATHS.contacts),
          label: dictionary.steps.contacts,
        }}
      >
        <div className="grid gap-6">
          <p className="max-w-[52rem] leading-relaxed text-muted-foreground">
            {dictionary.steps.intro}
          </p>
          <ReturnsGroups groups={dictionary.steps.groups} numbered />
        </div>
      </PageSection>

      <JsonLd
        data={buildBreadcrumbJsonLd(
          breadcrumbs.map((item) => ({ name: item.name, path: item.href })),
        )}
      />
    </div>
  );
}

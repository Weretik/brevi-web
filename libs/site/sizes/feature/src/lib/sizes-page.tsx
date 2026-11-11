import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { JsonLd, buildBreadcrumbJsonLd } from '@site/core/seo';
import { PageHeader, PageSection } from '@site/shared/ui';
import { MeasureSteps, SizeFinder, SizeTables, getSizesDictionary } from '@site/sizes/ui';
import Link from 'next/link';

import type { Locale } from '@site/core/i18n';

/**
 * «Таблиця розмірів» page: a size finder, the charts as text tables, and the measuring rules. Static: the
 * data and text come from the sizes library.
 */
export function SizesPage({ locale }: { locale: Locale }) {
  const dictionary = getSizesDictionary(locale);
  const breadcrumbs = [
    { name: dictionary.home, href: localizedPath(locale) },
    { name: dictionary.breadcrumb, href: localizedPath(locale, SITE_PATHS.sizeChart) },
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
        id="size-finder"
        title={dictionary.finder.title}
        label={{ index: '02', text: dictionary.finder.label }}
      >
        <SizeFinder dictionary={dictionary.finder} />
      </PageSection>

      <PageSection
        id="size-tables"
        title={dictionary.tables.title}
        label={{ index: '03', text: dictionary.tables.label }}
      >
        <SizeTables dictionary={dictionary.tables} />
      </PageSection>

      <PageSection
        id="size-measure"
        title={dictionary.measure.title}
        label={{ index: '04', text: dictionary.measure.label }}
      >
        <MeasureSteps dictionary={dictionary.measure} />
      </PageSection>

      <section
        aria-labelledby="size-help-title"
        className="grid gap-2 rounded-2xl bg-muted p-6 sm:p-8"
      >
        <h2 id="size-help-title" className="text-xl font-extrabold">
          {dictionary.help.title}
        </h2>
        <p className="max-w-[40rem] leading-relaxed text-muted-foreground">
          {dictionary.help.text}
        </p>
        <Link
          href={localizedPath(locale, SITE_PATHS.contacts)}
          className="justify-self-start font-bold text-brand-text hover:underline"
        >
          {dictionary.help.action} <span aria-hidden>→</span>
        </Link>
      </section>

      <JsonLd
        data={buildBreadcrumbJsonLd(
          breadcrumbs.map((item) => ({ name: item.name, path: item.href })),
        )}
      />
    </div>
  );
}

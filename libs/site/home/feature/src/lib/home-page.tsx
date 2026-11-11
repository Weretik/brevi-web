import { SITE_PATHS, catalogCategoryPath, localizedPath } from '@site/core/i18n';
import {
  JsonLd,
  buildFaqPageJsonLd,
  buildLocalBusinessJsonLd,
  buildWebSiteJsonLd,
} from '@site/core/seo';
import {
  HomeCatalog,
  HomeContacts,
  HomeHero,
  HomeIndustries,
  HomeLogo,
  HomeProcess,
  HomeProduction,
  HomeSeoText,
  getHomeDictionary,
} from '@site/home/ui';
import { loadSiteCompany } from '@site/settings/data-access';
import { PageSection } from '@site/shared/ui';

import type { CatalogSection } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** Anchor of the contacts block; «Залишити заявку» scrolls to it until the request page exists. */
const CONTACTS_ID = 'zayavka';

/**
 * Home page body in the order of the «Строчка» mockup: first screen, catalog sections, logo, process, own
 * production, industries, contacts, SEO text with FAQ. The text is in the home dictionary; the catalog sections
 * come from the route, which reads them from the catalog API, and the block is left out while there are none. The price calculator, product cards with prices, and the request
 * form of the mockup come with the catalog and request steps (owner decision 2026-11-10).
 */
export async function HomePage({
  locale,
  catalogSections,
}: {
  locale: Locale;
  catalogSections: readonly CatalogSection[];
}) {
  const company = await loadSiteCompany();
  const dictionary = getHomeDictionary(locale);
  const path = (key: keyof typeof SITE_PATHS) => localizedPath(locale, SITE_PATHS[key]);
  const catalogHref = path('catalog');

  return (
    <div className="grid gap-14 pb-4 sm:gap-16">
      <HomeHero company={company} dictionary={dictionary.hero} requestHref={`#${CONTACTS_ID}`} />

      {catalogSections.length > 0 && (
        <PageSection
          id="home-catalog"
          title={dictionary.catalog.title}
          label={{ index: '02', text: dictionary.catalog.label }}
          action={{ href: catalogHref, label: dictionary.catalog.all }}
        >
          <HomeCatalog
            locale={locale}
            sections={catalogSections}
            categoryHref={(slug) => localizedPath(locale, catalogCategoryPath(slug))}
          />
        </PageSection>
      )}

      <HomeLogo dictionary={dictionary.logo} moreHref={path('logoPrinting')} />

      <PageSection
        id="home-process"
        title={dictionary.process.title}
        label={{ index: '04', text: dictionary.process.label }}
      >
        <HomeProcess steps={dictionary.process.steps} />
      </PageSection>

      <PageSection
        id="home-production"
        title={dictionary.production.title}
        label={{ index: '05', text: dictionary.production.label }}
        action={{ href: path('production'), label: dictionary.production.more }}
      >
        <HomeProduction points={dictionary.production.points} />
      </PageSection>

      <PageSection
        id="home-industries"
        title={dictionary.industries.title}
        action={{ href: path('industries'), label: dictionary.industries.all }}
      >
        <HomeIndustries items={dictionary.industries.items} href={path('industries')} />
      </PageSection>

      <HomeContacts
        company={company}
        id={CONTACTS_ID}
        locale={locale}
        dictionary={dictionary.contacts}
        contactsHref={path('contacts')}
      />

      <HomeSeoText dictionary={dictionary.seo} />

      <JsonLd
        data={[
          buildWebSiteJsonLd(locale),
          buildLocalBusinessJsonLd(locale, company),
          buildFaqPageJsonLd(
            dictionary.seo.faq.map((item) => ({ question: item.title, answer: item.text })),
          ),
        ]}
      />
    </div>
  );
}

import { CATALOG_SECTIONS } from '@site/catalog/model';
import { SITE_PATHS, localizedPath } from '@site/core/i18n';
import { JsonLd, buildLocalBusinessJsonLd, buildWebSiteJsonLd } from '@site/core/seo';
import { buildFaqPageJsonLd } from '@site/home/seo';
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
import { PageSection } from '@site/shared/ui';

import type { Locale } from '@site/core/i18n';

/** Anchor of the contacts block; «Залишити заявку» scrolls to it until the request page exists. */
const CONTACTS_ID = 'zayavka';

/**
 * Home page body in the order of the «Строчка» mockup: first screen, catalog sections, logo, process, own
 * production, industries, contacts, SEO text with FAQ. It reads no API: the text is in the home dictionary and
 * the catalog sections are the fixed list. The price calculator, product cards with prices, and the request
 * form of the mockup come with the catalog and request steps (owner decision 2026-11-10).
 */
export function HomePage({ locale }: { locale: Locale }) {
  const dictionary = getHomeDictionary(locale);
  const path = (key: keyof typeof SITE_PATHS) => localizedPath(locale, SITE_PATHS[key]);
  const catalogHref = path('catalog');

  return (
    <div className="grid gap-14 pb-4 sm:gap-16">
      <HomeHero dictionary={dictionary.hero} requestHref={`#${CONTACTS_ID}`} />

      <PageSection
        id="home-catalog"
        title={dictionary.catalog.title}
        label={{ index: '02', text: dictionary.catalog.label }}
        action={{ href: catalogHref, label: dictionary.catalog.all }}
      >
        <HomeCatalog locale={locale} sections={CATALOG_SECTIONS} catalogHref={catalogHref} />
      </PageSection>

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
        id={CONTACTS_ID}
        locale={locale}
        dictionary={dictionary.contacts}
        contactsHref={path('contacts')}
      />

      <HomeSeoText dictionary={dictionary.seo} />

      <JsonLd
        data={[
          buildWebSiteJsonLd(locale),
          buildLocalBusinessJsonLd(locale),
          buildFaqPageJsonLd(
            dictionary.seo.faq.map((item) => ({ question: item.title, answer: item.text })),
          ),
        ]}
      />
    </div>
  );
}

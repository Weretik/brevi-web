import { CatalogProductCarousel, getCatalogDictionary } from '@site/catalog/ui';
import {
  SITE_PATHS,
  catalogCategoryPath,
  catalogProductPath,
  localizedPath,
  requestHref,
} from '@site/core/i18n';
import {
  JsonLd,
  buildFaqPageJsonLd,
  buildLocalBusinessJsonLd,
  buildWebSiteJsonLd,
} from '@site/core/seo';
import { DeliveryAcrossUkraine, getDeliveryDictionary } from '@site/delivery/ui';
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
import { loadSiteCompany, loadSitePageText } from '@site/settings/data-access';
import { PageSection } from '@site/shared/ui';

import type { CatalogProductCard, CatalogSection } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** Anchor of the contacts block, kept for old links to `#zayavka`. */
const CONTACTS_ID = 'zayavka';

/**
 * Home page body: first screen, catalog sections, popular models, logo, process, own production, industries
 * (plain text), «Працюємо по всій Україні» with the map, contacts, SEO text with FAQ. The text is in the home
 * dictionary; the SEO text and FAQ saved in «Сторінки сайту» replace it. The catalog sections and the
 * popular models come from the route, which reads them from the catalog API; each block is left out while it
 * has nothing to show. «Залишити заявку» and «Купити» open the request window.
 */
export async function HomePage({
  locale,
  catalogSections,
  featured,
}: {
  locale: Locale;
  catalogSections: readonly CatalogSection[];
  /** Models for «Популярні моделі», already picked by the route. */
  featured: readonly CatalogProductCard[];
}) {
  const [company, saved] = await Promise.all([loadSiteCompany(), loadSitePageText('home', locale)]);
  const dictionary = getHomeDictionary(locale);
  // Text and questions of «Контент → Сторінки сайту» replace the dictionary ones (CNT-010).
  const faq = saved?.faq.length ? saved.faq : dictionary.seo.faq;
  const path = (key: keyof typeof SITE_PATHS) => localizedPath(locale, SITE_PATHS[key]);
  const catalogHref = path('catalog');
  const catalogText = getCatalogDictionary(locale);

  return (
    <div className="grid gap-14 pb-4 sm:gap-16">
      <HomeHero company={company} dictionary={dictionary.hero} requestHref={requestHref(locale)} />

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

      {featured.length > 0 && (
        <PageSection
          id="home-popular"
          title={dictionary.popular.title}
          action={{ href: catalogHref, label: dictionary.popular.all }}
        >
          <CatalogProductCarousel
            items={featured.map((product) => ({
              product,
              href: localizedPath(locale, catalogProductPath(product.slug)),
            }))}
            dictionary={catalogText.products}
            requestHref={requestHref(locale)}
            labels={catalogText.carousel}
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

      <PageSection id="home-industries" title={dictionary.industries.title}>
        <HomeIndustries items={dictionary.industries.items} />
      </PageSection>

      <DeliveryAcrossUkraine
        id="home-delivery"
        index="06"
        dictionary={getDeliveryDictionary(locale).acrossUkraine}
        moreHref={path('deliveryAndPayment')}
      />

      <HomeContacts
        company={company}
        id={CONTACTS_ID}
        locale={locale}
        dictionary={dictionary.contacts}
        contactsHref={path('contacts')}
      />

      <HomeSeoText dictionary={dictionary.seo} text={saved?.text ?? []} faq={faq} />

      <JsonLd
        data={[
          buildWebSiteJsonLd(locale),
          buildLocalBusinessJsonLd(locale, company),
          buildFaqPageJsonLd(faq),
        ]}
      />
    </div>
  );
}

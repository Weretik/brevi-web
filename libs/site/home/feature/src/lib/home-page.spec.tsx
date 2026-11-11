import { getHomeDictionary } from '@site/home/ui';
import { render, screen } from '@testing-library/react';

import { HomePage } from './home-page';

import type { CatalogSection } from '@site/catalog/model';

vi.mock('@site/settings/data-access', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  loadSiteCompany: async () => (await import('@site/core/config')).COMPANY,
}));

const CATALOG_SECTIONS: CatalogSection[] = [
  {
    key: 'spetsodyah',
    slug: 'spetsodyah',
    label: { uk: 'Спецодяг власного пошиття', ru: 'Спецодежда собственного пошива' },
    items: [{ key: 'kostyumy', slug: 'kostyumy', label: { uk: 'Костюми', ru: 'Костюми' } }],
  },
  {
    key: 'zasoby-zakhystu',
    slug: 'zasoby-zakhystu',
    label: { uk: 'Засоби індивідуального захисту', ru: 'Средства индивидуальной защиты' },
    items: [],
  },
];

const readJsonLd = (container: HTMLElement): Record<string, unknown>[] =>
  [...container.querySelectorAll('script[type="application/ld+json"]')].flatMap((script) =>
    JSON.parse(script.textContent ?? '[]'),
  );

describe('HomePage', () => {
  it('renders one h1 and the blocks in the mockup order', async () => {
    const dictionary = getHomeDictionary('uk');
    render(await HomePage({ locale: 'uk', catalogSections: CATALOG_SECTIONS }));

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const headings = screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent);
    expect(headings).toEqual([
      dictionary.catalog.title,
      dictionary.logo.title,
      dictionary.process.title,
      dictionary.production.title,
      dictionary.industries.title,
      dictionary.contacts.title,
      dictionary.seo.title,
      dictionary.seo.faqTitle,
    ]);
  });

  it('links to the localized pages and scrolls the request action to the contacts block', async () => {
    const { container } = render(
      await HomePage({ locale: 'ru', catalogSections: CATALOG_SECTIONS }),
    );

    expect(screen.getByRole('link', { name: /Весь каталог/ }).getAttribute('href')).toBe(
      '/ru/catalog',
    );
    expect(screen.getByRole('link', { name: /О производстве/ }).getAttribute('href')).toBe(
      '/ru/about-company',
    );
    expect(screen.getByRole('link', { name: /Все отрасли/ }).getAttribute('href')).toBe(
      '/ru/industries',
    );
    const request = screen.getByRole('link', { name: 'Оставить заявку' });
    expect(request.getAttribute('href')).toBe('#zayavka');
    expect(container.querySelector('#zayavka')).toBeTruthy();
  });

  it('describes the site, the business, and the visible FAQ in JSON-LD', async () => {
    const dictionary = getHomeDictionary('uk');
    const { container } = render(
      await HomePage({ locale: 'uk', catalogSections: CATALOG_SECTIONS }),
    );
    const data = readJsonLd(container);

    expect(data.map((item) => item['@type'])).toEqual(['WebSite', 'LocalBusiness', 'FAQPage']);
    const faq = data[2]['mainEntity'] as { name: string; acceptedAnswer: { text: string } }[];
    expect(faq.map((item) => item.name)).toEqual(dictionary.seo.faq.map((item) => item.title));
    expect(faq.map((item) => item.acceptedAnswer.text)).toEqual(
      dictionary.seo.faq.map((item) => item.text),
    );
  });
});

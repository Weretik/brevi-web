import { getCatalogDictionary } from '@site/catalog/ui';
import { getDeliveryDictionary } from '@site/delivery/ui';
import { getHomeDictionary } from '@site/home/ui';
import { render, screen } from '@testing-library/react';

import { HomePage } from './home-page';

import type { CatalogProductCard, CatalogSection } from '@site/catalog/model';
import type { SitePageText } from '@site/settings/data-access';

const page = vi.hoisted(() => ({ saved: undefined as SitePageText | undefined }));

vi.mock('@site/settings/data-access', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  loadSiteCompany: async () => (await import('@site/core/config')).COMPANY,
  loadSitePageText: async () => page.saved,
}));

afterEach(() => {
  page.saved = undefined;
});

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

const NAMES: Record<string, string> = {
  'kostyum-verde': 'Костюм ВЕРДЕ',
  'kurtka-lito': 'Куртка ЛІТО',
  'zhylet-signal': 'Жилет СИГНАЛ',
};

const FEATURED: CatalogProductCard[] = Object.keys(NAMES).map((slug) => ({
  slug,
  type: 'Sewing',
  code: null,
  name: NAMES[slug],
  image: `https://media.example/${slug}.webp`,
  priceFrom: 1250,
  fabrics: [],
}));

const readJsonLd = (container: HTMLElement): Record<string, unknown>[] =>
  [...container.querySelectorAll('script[type="application/ld+json"]')].flatMap((script) =>
    JSON.parse(script.textContent ?? '[]'),
  );

describe('HomePage', () => {
  it('renders one h1 and the blocks in the mockup order', async () => {
    const dictionary = getHomeDictionary('uk');
    render(await HomePage({ locale: 'uk', catalogSections: CATALOG_SECTIONS, featured: FEATURED }));

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const headings = screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent);
    expect(headings).toEqual([
      dictionary.catalog.title,
      dictionary.popular.title,
      dictionary.logo.title,
      dictionary.process.title,
      dictionary.production.title,
      dictionary.industries.title,
      getDeliveryDictionary('uk').acrossUkraine.title,
      dictionary.contacts.title,
      dictionary.seo.title,
      dictionary.seo.faqTitle,
    ]);
  });

  it('links to the localized pages and opens the request window from the first screen', async () => {
    render(await HomePage({ locale: 'ru', catalogSections: CATALOG_SECTIONS, featured: [] }));

    expect(screen.getByRole('link', { name: /Весь каталог/ }).getAttribute('href')).toBe(
      '/ru/catalog',
    );
    expect(screen.getByRole('link', { name: /О производстве/ }).getAttribute('href')).toBe(
      '/ru/about-company',
    );
    // Industries are plain text on the home page: no links to the industries page.
    expect(screen.queryByRole('link', { name: /Все отрасли/ })).toBeNull();
    expect(screen.queryByRole('link', { name: /Сельское хозяйство/ })).toBeNull();
    expect(screen.getByText('Сельское хозяйство')).toBeTruthy();
    const request = screen.getByRole('link', { name: 'Оставить заявку' });
    expect(request.getAttribute('href')).toBe('/ru/request');
    expect(request.getAttribute('rel')).toBe('nofollow');
    expect(
      screen.getByRole('link', { name: /Условия доставки и оплаты/ }).getAttribute('href'),
    ).toBe('/ru/delivery-and-payment');
  });

  it('shows the popular models with «Купити», and leaves the block out without them', async () => {
    const { unmount } = render(
      await HomePage({ locale: 'uk', catalogSections: CATALOG_SECTIONS, featured: FEATURED }),
    );

    const popular = screen.getByRole('region', { name: getHomeDictionary('uk').popular.title });
    expect(popular.querySelectorAll('li')).toHaveLength(3);
    expect(
      screen.getByRole('button', { name: getCatalogDictionary('uk').carousel.next }),
    ).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Купити: Костюм ВЕРДЕ' })).toBeTruthy();
    unmount();

    render(await HomePage({ locale: 'uk', catalogSections: CATALOG_SECTIONS, featured: [] }));
    expect(
      screen.queryByRole('region', { name: getHomeDictionary('uk').popular.title }),
    ).toBeNull();
  });

  it('describes the site, the business, and the visible FAQ in JSON-LD', async () => {
    const dictionary = getHomeDictionary('uk');
    const { container } = render(
      await HomePage({ locale: 'uk', catalogSections: CATALOG_SECTIONS, featured: [] }),
    );
    const data = readJsonLd(container);

    expect(data.map((item) => item['@type'])).toEqual(['WebSite', 'LocalBusiness', 'FAQPage']);
    const faq = data[2]['mainEntity'] as { name: string; acceptedAnswer: { text: string } }[];
    expect(faq.map((item) => item.name)).toEqual(dictionary.seo.faq.map((item) => item.question));
    expect(faq.map((item) => item.acceptedAnswer.text)).toEqual(
      dictionary.seo.faq.map((item) => item.answer),
    );
  });

  it('shows the text and questions saved in «Сторінки сайту» instead of the dictionary', async () => {
    page.saved = {
      title: null,
      description: null,
      text: [{ type: 'paragraph', text: 'Шиємо **оптом** у Полтаві.' }],
      faq: [{ question: 'Чи є доставка?', answer: 'Так, по всій Україні.' }],
    };
    const dictionary = getHomeDictionary('uk');
    const { container } = render(
      await HomePage({ locale: 'uk', catalogSections: CATALOG_SECTIONS, featured: [] }),
    );

    expect(screen.getByText('оптом').tagName).toBe('STRONG');
    expect(container.textContent).not.toContain(dictionary.seo.intro);
    expect(container.querySelectorAll('details')).toHaveLength(1);
    const faq = readJsonLd(container)[2]['mainEntity'] as { name: string }[];
    expect(faq.map((item) => item.name)).toEqual(['Чи є доставка?']);
  });
});

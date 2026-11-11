import { WORK_PHOTOS, getWorksDictionary } from '@site/works/ui';
import { render, screen } from '@testing-library/react';

import { WorksPage } from './works-page';

import type { SiteGalleries } from '@site/settings/data-access';

const galleries = vi.hoisted(() => ({ value: { works: [], certificates: [] } as SiteGalleries }));

vi.mock('@site/settings/data-access', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  loadSiteGalleries: async () => galleries.value,
}));

afterEach(() => {
  galleries.value = { works: [], certificates: [] };
});

describe('WorksPage', () => {
  it('renders one h1, the whole gallery, and the closing block', async () => {
    const dictionary = getWorksDictionary('uk');
    render(await WorksPage({ locale: 'uk' }));

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)).toEqual([
      dictionary.gallery.title,
      dictionary.order.title,
    ]);
    expect(screen.getAllByRole('img')).toHaveLength(WORK_PHOTOS.length);
  });

  it('links to the localized pages', async () => {
    render(await WorksPage({ locale: 'ru' }));

    expect(screen.getByRole('link', { name: 'Главная' }).getAttribute('href')).toBe('/ru');
    expect(
      screen.getByRole('link', { name: 'Обсудить пошив спецодежды' }).getAttribute('href'),
    ).toBe('/ru#zayavka');
    expect(screen.getByRole('link', { name: /О производстве/ }).getAttribute('href')).toBe(
      '/ru/about-company',
    );
  });

  it('describes the breadcrumb trail in JSON-LD', async () => {
    const { container } = render(await WorksPage({ locale: 'uk' }));
    const data = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    );

    expect(data['@type']).toBe('BreadcrumbList');
    expect(data.itemListElement[1].item).toBe('https://brevi.com.ua/uk/our-work');
  });

  it('shows the photos of «Контент → Наші роботи» with their Russian descriptions', async () => {
    galleries.value = {
      works: [
        {
          url: 'https://cdn.test/1.jpg',
          thumbnailUrl: 'https://cdn.test/1-small.webp',
          width: null,
          height: null,
          title: { uk: 'Халат', ru: 'Халат медицинский' },
          note: { uk: '', ru: '' },
          standards: [],
        },
      ],
      certificates: [],
    };
    render(await WorksPage({ locale: 'ru' }));

    expect(screen.getByRole('img').getAttribute('alt')).toBe('Халат медицинский');
    expect(screen.getByRole('link', { name: /Халат медицинский/ }).getAttribute('href')).toBe(
      'https://cdn.test/1.jpg',
    );
  });
});

import { CERTIFICATE_DOCUMENTS, getCertificatesDictionary } from '@site/certificates/ui';
import { render, screen } from '@testing-library/react';

import { CertificatesPage } from './certificates-page';

import type { SiteGalleries } from '@site/settings/data-access';

const galleries = vi.hoisted(() => ({ value: { works: [], certificates: [] } as SiteGalleries }));

vi.mock('@site/settings/data-access', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  loadSiteGalleries: async () => galleries.value,
}));

afterEach(() => {
  galleries.value = { works: [], certificates: [] };
});

describe('CertificatesPage', () => {
  it('renders one h1, every document, and the closing block', async () => {
    const dictionary = getCertificatesDictionary('uk');
    render(await CertificatesPage({ locale: 'uk' }));

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)).toEqual([
      dictionary.documents.title,
      dictionary.copies.title,
    ]);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(CERTIFICATE_DOCUMENTS.length);
  });

  it('links to the localized pages', async () => {
    render(await CertificatesPage({ locale: 'ru' }));

    expect(screen.getByRole('link', { name: 'Главная' }).getAttribute('href')).toBe('/ru');
    expect(screen.getByRole('link', { name: /Контакты менеджеров/ }).getAttribute('href')).toBe(
      '/ru/contacts',
    );
  });

  it('describes the breadcrumb trail in JSON-LD', async () => {
    const { container } = render(await CertificatesPage({ locale: 'uk' }));
    const data = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    );

    expect(data['@type']).toBe('BreadcrumbList');
    expect(data.itemListElement[1].item).toBe('https://brevi.com.ua/uk/certificates');
  });

  it('shows the documents of «Контент → Сертифікати» in the page language', async () => {
    galleries.value = {
      works: [],
      certificates: [
        {
          url: 'https://cdn.test/7.jpg',
          thumbnailUrl: 'https://cdn.test/7-small.webp',
          width: 400,
          height: 560,
          title: { uk: 'Декларація', ru: '' },
          note: { uk: 'Костюми', ru: 'Костюмы' },
          standards: ['ДСТУ EN ISO 13688'],
        },
      ],
    };
    render(await CertificatesPage({ locale: 'ru' }));

    expect(screen.getByRole('heading', { level: 3, name: 'Декларація' })).toBeTruthy();
    expect(screen.getByText('Костюмы')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Декларація. Костюмы' })).toBeTruthy();
  });
});

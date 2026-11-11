import { getLogoPrintingDictionary } from '@site/logo-printing/ui';
import { render, screen } from '@testing-library/react';

import { LogoPrintingPage } from './logo-printing-page';

vi.mock('@site/settings/data-access', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  loadSiteCompany: async () => (await import('@site/core/config')).COMPANY,
}));

describe('LogoPrintingPage', () => {
  it('renders one h1 and the blocks in the order of the live page', async () => {
    const dictionary = getLogoPrintingDictionary('uk');
    render(await LogoPrintingPage({ locale: 'uk' }));

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)).toEqual([
      dictionary.methods.title,
      dictionary.garments.title,
      dictionary.sewing.title,
      dictionary.order.title,
    ]);
  });

  it('links to the localized pages around the order', async () => {
    render(await LogoPrintingPage({ locale: 'ru' }));

    expect(screen.getByRole('link', { name: 'Главная' }).getAttribute('href')).toBe('/ru');
    expect(screen.getByRole('link', { name: /О производстве/ }).getAttribute('href')).toBe(
      '/ru/about-company',
    );
    expect(screen.getByRole('link', { name: /Сертификаты/ }).getAttribute('href')).toBe(
      '/ru/certificates',
    );
    for (const request of screen.getAllByRole('link', { name: 'Оставить заявку' })) {
      expect(request.getAttribute('href')).toBe('/ru/request');
      expect(request.getAttribute('rel')).toBe('nofollow');
    }
  });

  it('describes the breadcrumb trail and the service in JSON-LD', async () => {
    const { container } = render(await LogoPrintingPage({ locale: 'uk' }));
    const [breadcrumbs, service] = [
      ...container.querySelectorAll('script[type="application/ld+json"]'),
    ].map((node) => JSON.parse(node.textContent ?? '{}'));

    expect(breadcrumbs['@type']).toBe('BreadcrumbList');
    expect(breadcrumbs.itemListElement[1].item).toBe('https://brevi.com.ua/uk/logo-printing');
    expect(service['@type']).toBe('Service');
  });
});

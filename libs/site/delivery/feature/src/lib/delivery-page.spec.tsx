import { getDeliveryDictionary } from '@site/delivery/ui';
import { render, screen } from '@testing-library/react';

import { DeliveryPage } from './delivery-page';

vi.mock('@site/settings/data-access', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  loadSiteCompany: async () => (await import('@site/core/config')).COMPANY,
}));

describe('DeliveryPage', () => {
  it('renders one h1 and the blocks in the order of the live page', async () => {
    const dictionary = getDeliveryDictionary('uk');
    render(await DeliveryPage({ locale: 'uk' }));

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)).toEqual([
      dictionary.delivery.title,
      dictionary.payment.title,
      dictionary.contact.title,
    ]);
  });

  it('links to the localized home and contacts pages', async () => {
    render(await DeliveryPage({ locale: 'ru' }));

    expect(screen.getByRole('link', { name: 'Главная' }).getAttribute('href')).toBe('/ru');
    expect(screen.getByRole('link', { name: /Контакты/ }).getAttribute('href')).toBe(
      '/ru/contacts',
    );
  });

  it('describes the breadcrumb trail in JSON-LD', async () => {
    const { container } = render(await DeliveryPage({ locale: 'uk' }));
    const data = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    );

    expect(data['@type']).toBe('BreadcrumbList');
    expect(data.itemListElement.map((item: { item: string }) => item.item)).toEqual([
      'https://brevi.com.ua/uk',
      'https://brevi.com.ua/uk/delivery-and-payment',
    ]);
  });
});

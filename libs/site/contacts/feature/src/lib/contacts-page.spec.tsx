import { getContactsDictionary } from '@site/contacts/ui';
import { render, screen } from '@testing-library/react';

import { ContactsPage } from './contacts-page';

vi.mock('@site/settings/data-access', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  loadSiteCompany: async () => (await import('@site/core/config')).COMPANY,
}));

describe('ContactsPage', () => {
  it('renders one h1 and the blocks in the order of the live page', async () => {
    const dictionary = getContactsDictionary('uk');
    render(await ContactsPage({ locale: 'uk' }));

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)).toEqual([
      dictionary.info.title,
      dictionary.managers.title,
    ]);
  });

  it('shows the Russian names and the localized home link', async () => {
    render(await ContactsPage({ locale: 'ru' }));

    expect(screen.getByRole('link', { name: 'Главная' }).getAttribute('href')).toBe('/ru');
    expect(screen.getByRole('heading', { name: 'Анастасия Береговых' })).toBeTruthy();
  });

  it('describes the breadcrumb trail and the business in JSON-LD', async () => {
    const { container } = render(await ContactsPage({ locale: 'uk' }));
    const data = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '[]',
    );

    expect(data.map((item: { '@type': string }) => item['@type'])).toEqual([
      'BreadcrumbList',
      'LocalBusiness',
    ]);
    expect(data[0].itemListElement[1].item).toBe('https://brevi.com.ua/uk/contacts');
  });
});

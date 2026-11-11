import { getAgreementDictionary, getAgreementText } from '@site/agreement/ui';
import { render, screen } from '@testing-library/react';

import { AgreementPage } from './agreement-page';

vi.mock('@site/settings/data-access', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  loadSiteCompany: async () => (await import('@site/core/config')).COMPANY,
}));

describe('AgreementPage', () => {
  it('renders one h1, the eleven sections of the offer, and the seller details', async () => {
    const dictionary = getAgreementDictionary('uk');
    const text = getAgreementText('uk');
    render(await AgreementPage({ locale: 'uk' }));

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)).toEqual([
      ...text.sections.map((section) => `${section.number.padStart(2, '0')}${section.title}`),
      dictionary.requisites.title,
    ]);
  });

  it('links the table of contents to the sections', async () => {
    const { container } = render(await AgreementPage({ locale: 'ru' }));
    const contents = screen.getByRole('navigation', { name: 'Содержание договора' });

    for (const link of contents.querySelectorAll('a')) {
      expect(container.querySelector(link.getAttribute('href') ?? '')).not.toBeNull();
    }
    expect(contents.querySelectorAll('a')).toHaveLength(11);
  });

  it('links to delivery, returns, and contacts and describes the breadcrumb trail', async () => {
    const { container } = render(await AgreementPage({ locale: 'ru' }));
    const [breadcrumbs] = [...container.querySelectorAll('script[type="application/ld+json"]')].map(
      (node) => JSON.parse(node.textContent ?? '{}'),
    );

    expect(screen.getByRole('link', { name: /Доставка и оплата/ }).getAttribute('href')).toBe(
      '/ru/delivery-and-payment',
    );
    expect(screen.getByRole('link', { name: /Возврат и обмен/ }).getAttribute('href')).toBe(
      '/ru/returns-exchanges',
    );
    expect(breadcrumbs.itemListElement[1].item).toBe('https://brevi.com.ua/ru/agreement');
  });
});

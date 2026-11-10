import { getAgreementDictionary, getAgreementText } from '@site/agreement/ui';
import { render, screen } from '@testing-library/react';

import { AgreementPage } from './agreement-page';

describe('AgreementPage', () => {
  it('renders one h1, the eleven sections of the offer, and the seller details', () => {
    const dictionary = getAgreementDictionary('uk');
    const text = getAgreementText('uk');
    render(<AgreementPage locale="uk" />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)).toEqual([
      ...text.sections.map((section) => `${section.number.padStart(2, '0')}${section.title}`),
      dictionary.requisites.title,
    ]);
  });

  it('links the table of contents to the sections', () => {
    const { container } = render(<AgreementPage locale="ru" />);
    const contents = screen.getByRole('navigation', { name: 'Содержание договора' });

    for (const link of contents.querySelectorAll('a')) {
      expect(container.querySelector(link.getAttribute('href') ?? '')).not.toBeNull();
    }
    expect(contents.querySelectorAll('a')).toHaveLength(11);
  });

  it('links to delivery, returns, and contacts and describes the breadcrumb trail', () => {
    const { container } = render(<AgreementPage locale="ru" />);
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

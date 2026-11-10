import { CERTIFICATE_DOCUMENTS, getCertificatesDictionary } from '@site/certificates/ui';
import { render, screen } from '@testing-library/react';

import { CertificatesPage } from './certificates-page';

describe('CertificatesPage', () => {
  it('renders one h1, every document, and the closing block', () => {
    const dictionary = getCertificatesDictionary('uk');
    render(<CertificatesPage locale="uk" />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)).toEqual([
      dictionary.documents.title,
      dictionary.copies.title,
    ]);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(CERTIFICATE_DOCUMENTS.length);
  });

  it('links to the localized pages', () => {
    render(<CertificatesPage locale="ru" />);

    expect(screen.getByRole('link', { name: 'Главная' }).getAttribute('href')).toBe('/ru');
    expect(screen.getByRole('link', { name: /Контакты менеджеров/ }).getAttribute('href')).toBe(
      '/ru/contacts',
    );
  });

  it('describes the breadcrumb trail in JSON-LD', () => {
    const { container } = render(<CertificatesPage locale="uk" />);
    const data = JSON.parse(
      container.querySelector('script[type="application/ld+json"]')?.textContent ?? '{}',
    );

    expect(data['@type']).toBe('BreadcrumbList');
    expect(data.itemListElement[1].item).toBe('https://brevi.com.ua/uk/certificates');
  });
});

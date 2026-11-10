import { getHomeDictionary } from '@site/home/ui';
import { render, screen } from '@testing-library/react';

import { HomePage } from './home-page';

const readJsonLd = (container: HTMLElement): Record<string, unknown>[] =>
  [...container.querySelectorAll('script[type="application/ld+json"]')].flatMap((script) =>
    JSON.parse(script.textContent ?? '[]'),
  );

describe('HomePage', () => {
  it('renders one h1 and the blocks in the mockup order', () => {
    const dictionary = getHomeDictionary('uk');
    render(<HomePage locale="uk" />);

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

  it('links to the localized pages and scrolls the request action to the contacts block', () => {
    const { container } = render(<HomePage locale="ru" />);

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

  it('describes the site, the business, and the visible FAQ in JSON-LD', () => {
    const dictionary = getHomeDictionary('uk');
    const { container } = render(<HomePage locale="uk" />);
    const data = readJsonLd(container);

    expect(data.map((item) => item['@type'])).toEqual(['WebSite', 'LocalBusiness', 'FAQPage']);
    const faq = data[2]['mainEntity'] as { name: string; acceptedAnswer: { text: string } }[];
    expect(faq.map((item) => item.name)).toEqual(dictionary.seo.faq.map((item) => item.title));
    expect(faq.map((item) => item.acceptedAnswer.text)).toEqual(
      dictionary.seo.faq.map((item) => item.text),
    );
  });
});

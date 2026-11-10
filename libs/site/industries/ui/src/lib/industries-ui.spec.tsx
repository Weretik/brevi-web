import { render, screen } from '@testing-library/react';

import { getIndustriesDictionary } from './i18n/industries-dictionary';
import { IndustriesFaq } from './sections/industries-faq';
import { IndustriesHero } from './sections/industries-hero';
import { IndustriesList } from './sections/industries-list';
import { IndustriesOrder } from './sections/industries-order';
import { IndustriesSteps } from './sections/industries-steps';

const shape = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(shape)
    : value && typeof value === 'object'
      ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]))
      : typeof value;

describe('industries blocks', () => {
  it('has the same blocks and items in both languages', () => {
    expect(shape(getIndustriesDictionary('ru'))).toEqual(shape(getIndustriesDictionary('uk')));
  });

  it('shows the terms and a nofollow request link on the first screen', () => {
    const dictionary = getIndustriesDictionary('uk');
    render(
      <IndustriesHero
        dictionary={dictionary}
        breadcrumbs={[{ name: 'Головна', href: '/uk' }]}
        requestHref="/uk/request"
        catalogHref="/uk/catalog"
      />,
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(dictionary.title);
    expect(screen.getByText('від 5 виробів')).toBeTruthy();
    const request = screen.getByRole('link', { name: 'Залишити заявку' });
    expect(request.getAttribute('href')).toBe('/uk/request');
    expect(request.getAttribute('rel')).toBe('nofollow');
  });

  it('lists eight industries and links to the works and logo pages', () => {
    render(
      <IndustriesList
        dictionary={getIndustriesDictionary('uk').list}
        worksHref="/uk/our-work"
        logoHref="/uk/logo-printing"
      />,
    );

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(8);
    expect(screen.getByRole('link', { name: /Приклади наших робіт/ }).getAttribute('href')).toBe(
      '/uk/our-work',
    );
  });

  it('explains the quote in three steps and answers four questions', () => {
    const dictionary = getIndustriesDictionary('ru');
    render(<IndustriesSteps dictionary={dictionary.steps} />);
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);

    const { container } = render(<IndustriesFaq items={dictionary.faq.items} />);
    expect(container.querySelectorAll('details')).toHaveLength(4);
    expect(container.textContent).toContain('от 5 изделий');
  });

  it('ends with the request, the only phone, and links to wholesale prices and contacts', () => {
    const dictionary = getIndustriesDictionary('uk');
    const { container } = render(
      <IndustriesOrder
        id="order"
        index="05"
        dictionary={dictionary.order}
        requestLabel={dictionary.request}
        requestHref="/uk/request"
        wholesaleHref="/uk/order-in-bulk"
        contactsHref="/uk/contacts"
      />,
    );

    expect(screen.getByRole('link', { name: '050 469 86 75' }).getAttribute('href')).toBe(
      'tel:+380504698675',
    );
    expect(screen.getByRole('link', { name: /Ціни для опту/ }).getAttribute('href')).toBe(
      '/uk/order-in-bulk',
    );
    expect(container.textContent).not.toContain('307 55 54');
  });
});

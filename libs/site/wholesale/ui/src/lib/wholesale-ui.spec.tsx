import { COMPANY } from '@site/core/config';
import { render, screen, within } from '@testing-library/react';

import { getWholesaleDictionary } from './i18n/wholesale-dictionary';
import { WholesaleHero } from './sections/wholesale-hero';
import { WholesaleOrder } from './sections/wholesale-order';
import { WholesaleRange } from './sections/wholesale-range';
import { WholesaleTiers } from './sections/wholesale-tiers';

const shape = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(shape)
    : value && typeof value === 'object'
      ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]))
      : typeof value;

describe('wholesale blocks', () => {
  it('has the same blocks and items in both languages', () => {
    expect(shape(getWholesaleDictionary('ru'))).toEqual(shape(getWholesaleDictionary('uk')));
  });

  it('shows the wholesale terms and a nofollow request link on the first screen', () => {
    const dictionary = getWholesaleDictionary('uk');
    render(
      <WholesaleHero
        dictionary={dictionary}
        breadcrumbs={[{ name: 'Головна', href: '/uk' }]}
        requestHref="/uk/request"
        catalogHref="/uk/catalog"
      />,
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(dictionary.title);
    expect(dictionary.facts.map((fact) => fact.title)).toEqual([
      'від 5 штук',
      '3 рівні цін',
      'з ПДВ',
    ]);
    const request = screen.getByRole('link', { name: 'Залишити заявку' });
    expect(request.getAttribute('href')).toBe('/uk/request');
    expect(request.getAttribute('rel')).toBe('nofollow');
    expect(screen.getByRole('link', { name: /Перейти до каталогу/ }).getAttribute('href')).toBe(
      '/uk/catalog',
    );
  });

  it('lists the three quantity ranges of the brief without prices', () => {
    const { container } = render(
      <WholesaleTiers dictionary={getWholesaleDictionary('ru').tiers} />,
    );

    expect(
      screen.getAllByRole('listitem').map((item) => item.querySelector('p')?.textContent),
    ).toEqual(['1–9штук', '10–39штук', '40+штук']);
    expect(container.textContent).not.toMatch(/грн/);
  });

  it('groups what can be ordered and links to the catalog and logo branding', () => {
    const dictionary = getWholesaleDictionary('uk').range;
    render(
      <WholesaleRange
        dictionary={dictionary}
        catalogHref="/uk/catalog"
        logoHref="/uk/logo-printing"
      />,
    );

    const groups = screen.getAllByRole('heading', { level: 3 });
    expect(groups).toHaveLength(3);
    expect(within(groups[0].parentElement as HTMLElement).getAllByRole('listitem')).toHaveLength(7);
    expect(screen.getByRole('link', { name: /Пошиття з логотипом/ }).getAttribute('href')).toBe(
      '/uk/logo-printing',
    );
  });

  it('ends with four steps, the phone, and links to contacts and delivery', () => {
    const dictionary = getWholesaleDictionary('uk');
    render(
      <WholesaleOrder
        company={COMPANY}
        id="order"
        index="05"
        dictionary={dictionary.order}
        requestLabel={dictionary.request}
        requestHref="/uk/request"
        contactsHref="/uk/contacts"
        deliveryHref="/uk/delivery-and-payment"
      />,
    );

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
    expect(screen.getByRole('link', { name: '050 469 86 75' }).getAttribute('href')).toBe(
      'tel:+380504698675',
    );
    expect(screen.getByRole('link', { name: /Контакти/ }).getAttribute('href')).toBe(
      '/uk/contacts',
    );
    expect(screen.getByRole('link', { name: /Доставка та оплата/ }).getAttribute('href')).toBe(
      '/uk/delivery-and-payment',
    );
  });
});

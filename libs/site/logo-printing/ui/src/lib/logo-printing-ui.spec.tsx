import { render, screen, within } from '@testing-library/react';

import { getLogoPrintingDictionary } from './i18n/logo-printing-dictionary';
import { LogoPrintingHero } from './sections/logo-printing-hero';
import { LogoPrintingMethods } from './sections/logo-printing-methods';
import { LogoPrintingOrder } from './sections/logo-printing-order';

const shape = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(shape)
    : value && typeof value === 'object'
      ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]))
      : typeof value;

describe('logo printing blocks', () => {
  it('has the same blocks and items in both languages', () => {
    const uk = getLogoPrintingDictionary('uk');
    const ru = getLogoPrintingDictionary('ru');

    expect(shape(ru)).toEqual(shape(uk));
    expect(ru.methods.items.map((item) => item.key)).toEqual(
      uk.methods.items.map((item) => item.key),
    );
  });

  it('keeps the numbers of the live page', () => {
    const { facts, order } = getLogoPrintingDictionary('uk');

    expect(facts.map((fact) => fact.title)).toEqual(['від 5 штук', '2–4 тижні', 'Уся Україна']);
    expect(order.steps[1].text).toContain('від 2 до 4 тижнів');
    expect(order.steps[2].text).toContain('від 5 штук');
  });

  it('shows the order terms and a nofollow request link on the first screen', () => {
    const dictionary = getLogoPrintingDictionary('uk');
    render(
      <LogoPrintingHero
        dictionary={dictionary}
        breadcrumbs={[{ name: 'Головна', href: '/uk' }]}
        requestHref="/uk/request"
        worksHref="/uk/our-work"
      />,
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(dictionary.title);
    expect(screen.getByText('мінімальне замовлення')).toBeTruthy();
    const request = screen.getByRole('link', { name: 'Залишити заявку' });
    expect(request.getAttribute('href')).toBe('/uk/request');
    expect(request.getAttribute('rel')).toBe('nofollow');
  });

  it('lists three methods with three advantages each', () => {
    render(<LogoPrintingMethods dictionary={getLogoPrintingDictionary('ru').methods} />);

    expect(screen.getAllByRole('heading', { level: 3 }).map((node) => node.textContent)).toEqual([
      'Вышивка',
      'Термотрансфер',
      'Шелкография',
    ]);
    for (const list of screen.getAllByRole('list', { name: 'Преимущества' })) {
      expect(within(list).getAllByRole('listitem')).toHaveLength(3);
    }
  });

  it('ends with four steps, the phone, and links to contacts and delivery', () => {
    const dictionary = getLogoPrintingDictionary('uk');
    render(
      <LogoPrintingOrder
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

import { COMPANY } from '@site/core/config';
import { render, screen } from '@testing-library/react';

import { getRegionsDictionary } from './i18n/regions-dictionary';
import { RegionsCities } from './sections/regions-cities';
import { RegionsHero } from './sections/regions-hero';
import { RegionsLocal } from './sections/regions-local';
import { RegionsOrder } from './sections/regions-order';
import { RegionsSteps } from './sections/regions-steps';

const shape = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(shape)
    : value && typeof value === 'object'
      ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]))
      : typeof value;

describe('regions blocks', () => {
  it('has the same blocks and items in both languages', () => {
    expect(shape(getRegionsDictionary('ru'))).toEqual(shape(getRegionsDictionary('uk')));
  });

  it('says on the first screen that orders come from any city', () => {
    const dictionary = getRegionsDictionary('uk');
    render(
      <RegionsHero
        dictionary={dictionary}
        breadcrumbs={[{ name: 'Головна', href: '/uk' }]}
        requestHref="/uk/request"
        deliveryHref="/uk/delivery-and-payment"
      />,
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(dictionary.title);
    expect(screen.getByText('Уся Україна')).toBeTruthy();
    expect(screen.getByText('до 3 робочих днів')).toBeTruthy();
    const request = screen.getByRole('link', { name: 'Залишити заявку' });
    expect(request.getAttribute('rel')).toBe('nofollow');
  });

  it('explains the order from another city in four steps', () => {
    render(<RegionsSteps dictionary={getRegionsDictionary('ru').steps} />);

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
  });

  it('links every city of the city pages to both of its pages and says the list is not a limit', () => {
    const dictionary = getRegionsDictionary('uk').cities;
    render(<RegionsCities dictionary={dictionary} locale="uk" />);

    expect(screen.getAllByRole('listitem')).toHaveLength(14);
    expect(screen.getByRole('link', { name: 'Пошиття у Харкові' }).getAttribute('href')).toBe(
      '/uk/sewing/kharkiv',
    );
    expect(screen.getByRole('link', { name: 'Робочий одяг у Харкові' }).getAttribute('href')).toBe(
      '/uk/workwear/kharkiv',
    );
    expect(screen.getAllByRole('link')).toHaveLength(26);
    // Lviv has no city pages yet: its name stays plain text.
    expect(screen.getByText('Львів').closest('li')?.querySelector('a')).toBeNull();
    expect(screen.getByText(/Немає вашого міста/)).toBeTruthy();
  });

  it('keeps the Poltava terms of the delivery page and shows the address', () => {
    const { container } = render(
      <RegionsLocal
        company={COMPANY}
        dictionary={getRegionsDictionary('uk').local}
        locale="uk"
        contactsHref="/uk/contacts"
        productionHref="/uk/about-company"
      />,
    );

    expect(container.textContent).toContain('250 грн');
    expect(container.textContent).toContain('вул. Кагамлика, 3А');
    expect(screen.getByRole('link', { name: /Адреса і контакти/ }).getAttribute('href')).toBe(
      '/uk/contacts',
    );
  });

  it('ends with the request, the phone, and links to wholesale prices and industries', () => {
    const dictionary = getRegionsDictionary('uk');
    render(
      <RegionsOrder
        company={COMPANY}
        id="order"
        index="05"
        dictionary={dictionary.order}
        requestLabel={dictionary.request}
        requestHref="/uk/request"
        wholesaleHref="/uk/order-in-bulk"
        industriesHref="/uk/industries"
      />,
    );

    expect(screen.getByRole('link', { name: '050 469 86 75' }).getAttribute('href')).toBe(
      'tel:+380504698675',
    );
    expect(screen.getByRole('link', { name: /Галузі/ }).getAttribute('href')).toBe(
      '/uk/industries',
    );
  });
});

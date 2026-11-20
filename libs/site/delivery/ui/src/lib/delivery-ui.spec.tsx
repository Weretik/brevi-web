import { COMPANY } from '@site/core/config';
import { render, screen } from '@testing-library/react';

import { getDeliveryDictionary } from './i18n/delivery-dictionary';
import { DeliveryAcrossUkraine } from './map/delivery-across-ukraine';
import { DeliveryContact } from './sections/delivery-contact';
import { DeliveryOptions } from './sections/delivery-options';
import { DeliveryPayment } from './sections/delivery-payment';

const shape = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]));
  }
  return typeof value;
};

describe('delivery dictionary', () => {
  it('has the same blocks and list lengths in both languages', () => {
    expect(shape(getDeliveryDictionary('ru'))).toEqual(shape(getDeliveryDictionary('uk')));
  });
});

describe('DeliveryOptions', () => {
  it('lists the four delivery ways with their cost and the footnote', () => {
    const dictionary = getDeliveryDictionary('uk').delivery;
    render(<DeliveryOptions dictionary={dictionary} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByText('безкоштовно')).toBeTruthy();
    expect(screen.getByText('250 грн')).toBeTruthy();
    expect(screen.getByText(dictionary.note)).toBeTruthy();
  });
});

describe('DeliveryPayment', () => {
  it('shows the bank details of the company in the page language', () => {
    render(
      <DeliveryPayment
        company={COMPANY}
        locale="ru"
        dictionary={getDeliveryDictionary('ru').payment}
      />,
    );

    expect(screen.getByText('Частное предприятие «Бреви»')).toBeTruthy();
    expect(screen.getByText('35521636')).toBeTruthy();
    expect(screen.getByText('UA63 305299 00000 26004041206862')).toBeTruthy();
  });
});

describe('DeliveryContact', () => {
  it('offers the phone and the contacts page', () => {
    const dictionary = getDeliveryDictionary('uk').contact;
    render(
      <DeliveryContact
        company={COMPANY}
        id="delivery-contact"
        dictionary={dictionary}
        contactsHref="/uk/contacts"
      />,
    );

    expect(screen.getByRole('region', { name: dictionary.title })).toBeTruthy();
    expect(screen.getByRole('link', { name: '050 469 86 75' }).getAttribute('href')).toBe(
      'tel:+380504698675',
    );
    expect(screen.queryByRole('link', { name: '0532 67 11 09' })).toBeNull();
    expect(screen.getByRole('link', { name: /Контакти/ }).getAttribute('href')).toBe(
      '/uk/contacts',
    );
  });
});

describe('DeliveryAcrossUkraine', () => {
  it('says Brevi delivers across Ukraine from Poltava, with the map and a link to the terms', () => {
    const dictionary = getDeliveryDictionary('uk').acrossUkraine;
    render(
      <DeliveryAcrossUkraine
        id="across-ukraine"
        index="06"
        dictionary={dictionary}
        moreHref="/uk/delivery-and-payment"
      />,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Працюємо по всій Україні' }),
    ).toBeTruthy();
    expect(screen.getByText(/Новою Поштою або САТ/)).toBeTruthy();
    expect(screen.getByRole('img', { name: dictionary.mapLabel }).textContent).toContain('Полтава');
    expect(
      screen.getByRole('link', { name: /Умови доставки та оплати/ }).getAttribute('href'),
    ).toBe('/uk/delivery-and-payment');
    // No online order or order tracking: the site only takes calls and requests.
    expect(document.body.textContent).not.toMatch(/статус замовлення|оформити онлайн/i);
  });

  it('leaves out the link on the delivery page itself', () => {
    render(
      <DeliveryAcrossUkraine
        id="across-ukraine"
        index="04"
        dictionary={getDeliveryDictionary('ru').acrossUkraine}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Работаем по всей Украине' })).toBeTruthy();
    expect(screen.queryByRole('link')).toBeNull();
  });
});

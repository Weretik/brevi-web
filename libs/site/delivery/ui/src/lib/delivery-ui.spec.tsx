import { render, screen } from '@testing-library/react';

import { getDeliveryDictionary } from './i18n/delivery-dictionary';
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
    render(<DeliveryPayment locale="ru" dictionary={getDeliveryDictionary('ru').payment} />);

    expect(screen.getByText('Частное предприятие «Бреви»')).toBeTruthy();
    expect(screen.getByText('35521636')).toBeTruthy();
    expect(screen.getByText('UA63 305299 00000 26004041206862')).toBeTruthy();
  });
});

describe('DeliveryContact', () => {
  it('offers both phones and the contacts page', () => {
    const dictionary = getDeliveryDictionary('uk').contact;
    render(
      <DeliveryContact id="delivery-contact" dictionary={dictionary} contactsHref="/uk/contacts" />,
    );

    expect(screen.getByRole('region', { name: dictionary.title })).toBeTruthy();
    expect(screen.getByRole('link', { name: '050 469 86 75' }).getAttribute('href')).toBe(
      'tel:+380504698675',
    );
    expect(screen.getByRole('link', { name: '0532 67 11 09' }).getAttribute('href')).toBe(
      'tel:+380532671109',
    );
    expect(screen.getByRole('link', { name: /Контакти/ }).getAttribute('href')).toBe(
      '/uk/contacts',
    );
  });
});

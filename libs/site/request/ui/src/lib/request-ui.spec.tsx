import { fireEvent, render, screen } from '@testing-library/react';

import { getRequestDictionary } from './i18n/request-dictionary';
import { RequestForm } from './sections/request-form';
import { RequestIntro } from './sections/request-intro';

import type { RequestFormState } from '@site/request/model';

const shape = (value: unknown): unknown =>
  Array.isArray(value)
    ? value.map(shape)
    : value && typeof value === 'object'
      ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]))
      : typeof value;

const dictionary = getRequestDictionary('uk');
const values = { phone: '050 123 45 67', workwear: 'куртки', quantity: '', comment: '' };

const renderForm = (result: RequestFormState) => {
  render(
    <RequestForm
      dictionary={dictionary}
      action={async () => result}
      agreementHref="/uk/agreement"
      catalogHref="/uk/catalog"
    />,
  );
  fireEvent.submit(screen.getByRole('form'));
};

describe('request blocks', () => {
  it('has the same text items in both languages', () => {
    expect(shape(getRequestDictionary('ru'))).toEqual(shape(dictionary));
  });

  it('shows only the site phone next to the steps', () => {
    render(<RequestIntro dictionary={dictionary} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByRole('link', { name: '050 469 86 75' }).getAttribute('href')).toBe(
      'tel:+380504698675',
    );
  });

  it('writes the error next to the field and keeps what was typed', async () => {
    renderForm({
      status: 'invalid',
      values: { ...values, phone: '123' },
      errors: { phone: 'invalidPhone', attachment: 'fileTooLarge' },
    });

    const phone = await screen.findByDisplayValue('123');
    expect(phone.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText(dictionary.form.errors.invalidPhone)).toBeTruthy();
    expect(screen.getByText(dictionary.form.errors.fileTooLarge)).toBeTruthy();
    expect(screen.getByDisplayValue('куртки')).toBeTruthy();
  });

  it('asks to call when the request could not be passed on', async () => {
    renderForm({ status: 'unavailable', values });

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain(dictionary.form.unavailableTitle);
    expect(alert.textContent).toContain('050 469 86 75');
  });

  it('replaces the form with the confirmation and lets the visitor fix the number', async () => {
    renderForm({ status: 'sent', phone: '+380501234567' });

    const status = await screen.findByRole('status');
    expect(status.textContent).toContain(dictionary.sent.title);
    expect(status.textContent).toContain('+380 50 123 45 67');
    expect(screen.queryByRole('form')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: dictionary.sent.again }));
    expect(await screen.findByRole('form')).toBeTruthy();
  });
});

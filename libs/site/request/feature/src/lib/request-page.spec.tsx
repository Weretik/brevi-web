import { getRequestDictionary } from '@site/request/ui';
import { render, screen } from '@testing-library/react';

import { RequestPage } from './request-page';

vi.mock('@site/settings/data-access', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  loadSiteCompany: async () => (await import('@site/core/config')).COMPANY,
}));

describe('RequestPage', () => {
  it('renders one h1 and the form where only the phone is required', async () => {
    const dictionary = getRequestDictionary('uk');
    render(await RequestPage({ locale: 'uk' }));

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('form', { name: dictionary.form.title })).toBeTruthy();
    expect(screen.getByLabelText(/Ваш телефон/)).toHaveProperty('required', true);
    for (const field of ['workwear', 'quantity', 'comment', 'attachment'] as const) {
      expect(
        screen.getByLabelText(new RegExp(dictionary.form.fields[field].label.replace('?', '\\?'))),
      ).toHaveProperty('required', false);
    }
    expect(screen.getByRole('button', { name: dictionary.form.submit })).toBeTruthy();
  });

  it('links to the localized offer and home page', async () => {
    render(await RequestPage({ locale: 'ru' }));

    expect(screen.getByRole('link', { name: 'Главная' }).getAttribute('href')).toBe('/ru');
    expect(
      screen.getByRole('link', { name: 'пользовательским соглашением' }).getAttribute('href'),
    ).toBe('/ru/agreement');
  });
});

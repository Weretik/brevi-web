import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SiteCompanyForm } from './site-company-form';

import type { CompanyManagerFormValues, SiteCompanyFormValues } from '@admin/content/model';

const text = (uk: string) => ({ uk, ru: '' });
const manager = (name: string): CompanyManagerFormValues => ({
  name: text(name),
  photoUrl: null,
  phones: '050 000 00 00',
  email: '',
});
const values: SiteCompanyFormValues = {
  phone: '050 469 86 75',
  email: 'info@brevi.com.ua',
  city: text('Дніпро'),
  street: text('Робоча 1'),
  mapQuery: 'Дніпро, Робоча 1',
  days: [1, 2, 3, 4, 5],
  opens: '09:00',
  closes: '18:00',
  managers: [manager('Олена'), manager('Ірина')],
  recipient: text('ТОВ «Бреві»'),
  edrpou: '12345678',
  iban: 'UA00',
  bank: text('Банк'),
  instagram: '',
  youtube: '',
  facebook: '',
};

const renderForm = (patch: Partial<Parameters<typeof SiteCompanyForm>[0]> = {}) => {
  const props = {
    values,
    errors: {},
    disabled: false,
    onChange: vi.fn(),
    onPickPhoto: vi.fn(),
    onAddManager: vi.fn(),
    ...patch,
  };
  render(<SiteCompanyForm {...props} />);
  return props;
};

afterEach(cleanup);

describe('SiteCompanyForm', () => {
  it('changes one field and keeps the rest', () => {
    const { onChange } = renderForm();

    fireEvent.change(screen.getByLabelText('Телефон компанії'), {
      target: { value: '0501112233' },
    });

    expect(onChange).toHaveBeenCalledWith({ ...values, phone: '0501112233' });
  });

  it('changes one language of a two-language field', () => {
    const { onChange } = renderForm();

    fireEvent.change(screen.getByLabelText('Місто (рос.)'), { target: { value: 'Днепр' } });

    expect(onChange).toHaveBeenCalledWith({ ...values, city: { uk: 'Дніпро', ru: 'Днепр' } });
  });

  it('moves a manager down and removes one', async () => {
    const { onChange } = renderForm();

    await userEvent.click(screen.getAllByRole('button', { name: 'Нижче' })[0]);
    expect(onChange).toHaveBeenLastCalledWith({
      ...values,
      managers: [values.managers[1], values.managers[0]],
    });
    await userEvent.click(screen.getAllByRole('button', { name: 'Прибрати менеджера' })[1]);
    expect(onChange).toHaveBeenLastCalledWith({ ...values, managers: [values.managers[0]] });
  });

  it('adds a manager and shows the field errors', async () => {
    const { onAddManager } = renderForm({ errors: { iban: 'Перевірте IBAN.' } });

    await userEvent.click(screen.getByRole('button', { name: 'Додати менеджера' }));
    expect(onAddManager).toHaveBeenCalled();
    expect(
      within(screen.getByLabelText('IBAN').closest('div')!.parentElement!).getByText(
        'Перевірте IBAN.',
      ),
    ).toBeTruthy();
  });
});

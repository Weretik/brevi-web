import { cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FinanceAccountsPage } from './finance-accounts-page';
import { render } from '../../testing/render';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const account = (overrides: Record<string, unknown> = {}) => ({
  id: 'a1',
  name: 'ПриватБанк ФОП',
  type: 'Bank',
  currency: 'UAH',
  iban: 'UA213052990000026007000000001',
  openingMinor: 0,
  openingDate: '2024-01-01',
  cutoverBalanceMinor: null,
  cutoverConfirmed: false,
  cutoverConfirmedAt: null,
  cutoverConfirmedBy: null,
  note: '',
  active: true,
  sortOrder: 10,
  version: 3,
  createdAt: '2026-11-05T08:00:00+00:00',
  updatedAt: '2026-11-05T08:00:00+00:00',
  balance: { legacyMinor: 0, currentMinor: null, totalMinor: 0, hasHistory: false },
  ...overrides,
});

const accounts = [
  account(),
  account({
    id: 'a2',
    name: 'Каса',
    type: 'Cash',
    iban: '',
    cutoverBalanceMinor: 6_254_640,
    cutoverConfirmed: true,
    cutoverConfirmedBy: 'director@brevi.com.ua',
    cutoverConfirmedAt: '2026-11-05T08:00:00+00:00',
    sortOrder: 20,
    balance: {
      legacyMinor: 10_000,
      currentMinor: 6_254_640,
      totalMinor: 6_264_640,
      hasHistory: true,
    },
  }),
  account({ id: 'a3', name: 'Старий рахунок', active: false, sortOrder: 30 }),
];

function stubApi(writes: { method: string; path: string; body: unknown }[] = []) {
  const fetcher = vi.fn().mockImplementation(async (path: string, init?: RequestInit) => {
    const method = init?.method ?? 'GET';
    if (method !== 'GET') {
      const body = init?.body ? JSON.parse(String(init.body)) : null;
      writes.push({ method, path, body });
      return { ok: true, json: async () => account({ ...body, version: 4 }) };
    }
    if (path.startsWith('/api/accounting/settings'))
      return {
        ok: true,
        json: async () => ({
          cutoverDate: '2026-10-01',
          timeZone: 'Europe/Kyiv',
          today: '2026-11-05',
        }),
      };
    if (path.includes('/history')) return { ok: true, json: async () => [] };
    return { ok: true, json: async () => accounts };
  });
  vi.stubGlobal('fetch', fetcher);
  return writes;
}

function openPage() {
  render(
    <MemoryRouter initialEntries={['/accounting/accounts']}>
      <FinanceAccountsPage />
    </MemoryRouter>,
  );
}

describe('«Рахунки і каси» page', () => {
  it('lists active accounts and marks only the missing balance on 01.10', async () => {
    const user = userEvent.setup();
    stubApi();
    openPage();

    expect(screen.getByRole('heading', { name: 'Рахунки і каси' })).toBeVisible();
    const bank = await screen.findByRole('row', { name: /ПриватБанк ФОП/ });
    expect(within(bank).getByText('Не підтверджено')).toBeVisible();
    const cash = screen.getByRole('row', { name: /Каса/ });
    expect(within(cash).queryByText('Не підтверджено')).not.toBeInTheDocument();
    expect(within(cash).getByText(/62\s546,40/)).toBeVisible();
    expect(screen.queryByText('Старий рахунок')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Архів 1' }));
    expect(await screen.findByText('Старий рахунок')).toBeVisible();
  });

  it('offers only the archive for an account with movements', async () => {
    const writes = stubApi();
    openPage();
    const cash = await screen.findByRole('row', { name: /Каса/ });

    fireEvent.contextMenu(within(cash).getAllByRole('gridcell')[0] as HTMLElement);
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Видалити' }));

    expect(await screen.findByText(/можна лише перенести в архів/)).toBeVisible();
    expect(screen.queryByRole('dialog', { name: 'Видалити рахунок?' })).not.toBeInTheDocument();
    expect(writes).toHaveLength(0);
  });

  it('adds an account with the opening balance in kopecks', async () => {
    const user = userEvent.setup();
    const writes = stubApi();
    openPage();
    await screen.findByRole('row', { name: /ПриватБанк ФОП/ });

    await user.click(screen.getByRole('button', { name: 'Додати рахунок' }));
    const panel = screen.getByRole('dialog', { name: 'Новий рахунок' });
    await user.type(within(panel).getByRole('textbox', { name: 'Назва' }), 'Монобанк');
    const opening = within(panel).getByRole('textbox', { name: 'Сума, грн' });
    await user.clear(opening);
    await user.type(opening, '1 250,5');
    await user.click(within(panel).getByRole('button', { name: 'Зберегти' }));

    await waitFor(() => expect(writes).toHaveLength(1));
    expect(writes[0]).toMatchObject({
      method: 'POST',
      path: '/api/accounting/accounts',
      body: {
        name: 'Монобанк',
        type: 'Bank',
        currency: 'UAH',
        openingMinor: 125_050,
        sortOrder: 40,
      },
    });
  });

  it('confirms the balance on 01.10 with the version the panel opened', async () => {
    const user = userEvent.setup();
    const writes = stubApi();
    openPage();

    fireEvent.contextMenu(await screen.findByRole('row', { name: /ПриватБанк ФОП/ }), {
      clientX: 80,
      clientY: 120,
    });
    await user.click(screen.getByRole('menuitem', { name: 'Переглянути' }));
    const panel = await screen.findByRole('dialog', { name: 'Рахунок' });
    await user.click(within(panel).getByRole('button', { name: 'Підтвердити залишок' }));
    const balance = screen.getByRole('textbox', { name: 'Залишок, грн' });
    await user.click(screen.getByRole('button', { name: 'Підтвердити' }));
    expect(screen.getByText('Вкажіть залишок, наприклад 62 546,40.')).toBeVisible();

    await user.type(balance, '62 546,40');
    await user.click(screen.getByRole('button', { name: 'Підтвердити' }));

    await waitFor(() => expect(writes).toHaveLength(1));
    expect(writes[0]).toEqual({
      method: 'PUT',
      path: '/api/accounting/accounts/a1/cutover',
      body: { balanceMinor: 6_254_640, confirmed: true, version: 3 },
    });
  });
});

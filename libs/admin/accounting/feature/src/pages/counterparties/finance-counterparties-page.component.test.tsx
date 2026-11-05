import { cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FinanceCounterpartiesPage } from './finance-counterparties-page';
import {
  financeCounterparty,
  financeTransaction,
  requestsTo,
  stubFinanceApi,
} from '../../testing/finance-api-stub';
import { render } from '../../testing/render';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function openPage(entry = '/accounting/counterparties') {
  render(
    <MemoryRouter initialEntries={[entry]}>
      <FinanceCounterpartiesPage />
    </MemoryRouter>,
  );
}

describe('«Контрагенти» page', () => {
  it('marks an unconfirmed counterparty and confirms it from the side panel', async () => {
    const user = userEvent.setup();
    const calls = stubFinanceApi({
      counterparties: [
        financeCounterparty(),
        financeCounterparty({ id: 'f2', name: 'ТОВ Ок', verified: true }),
      ],
      written: () => financeCounterparty({ verified: true, version: 2 }),
    });
    openPage();

    const row = await screen.findByRole('row', { name: /ФОП Іваненко/ });
    expect(within(row).getByText('Не підтверджено')).toBeVisible();
    expect(
      within(screen.getByRole('row', { name: /ТОВ Ок/ })).queryByText('Не підтверджено'),
    ).toBeNull();
    expect(screen.getByRole('button', { name: 'Фінансові 2' })).toBeVisible();

    fireEvent.contextMenu(row, { clientX: 10, clientY: 10 });
    await user.click(screen.getByRole('menuitem', { name: 'Переглянути' }));
    const panel = await screen.findByRole('dialog', { name: 'Контрагент' });
    await user.click(within(panel).getByRole('button', { name: 'Підтвердити' }));

    await waitFor(() =>
      expect(calls.find((call) => call.method === 'POST')).toEqual({
        method: 'POST',
        path: '/api/accounting/counterparties/f1/verify',
        body: { version: 1 },
      }),
    );
    expect(await within(panel).findByText(/більше не потребують перевірки/)).toBeVisible();
  });

  it('creates an unconfirmed counterparty with its other names', async () => {
    const user = userEvent.setup();
    const calls = stubFinanceApi({ written: () => financeCounterparty() });
    openPage();
    await screen.findByText('Фінансових контрагентів поки немає');

    await user.click(screen.getByRole('button', { name: 'Додати контрагента' }));
    const panel = screen.getByRole('dialog', { name: 'Новий контрагент' });
    await user.type(within(panel).getByRole('textbox', { name: 'Назва' }), 'ФОП Іваненко');
    await user.type(
      within(panel).getByRole('textbox', { name: 'Інші назви' }),
      'Іваненко{Enter}IVANENKO',
    );
    await user.click(within(panel).getByRole('button', { name: 'Зберегти' }));

    await waitFor(() =>
      expect(calls.find((call) => call.method === 'POST')).toMatchObject({
        path: '/api/accounting/counterparties',
        body: { name: 'ФОП Іваненко', aliases: ['Іваненко', 'IVANENKO'], verified: false },
      }),
    );
  });

  it('makes a one-off name permanent with the operation version', async () => {
    const user = userEvent.setup();
    const calls = stubFinanceApi({
      oneoffs: [
        financeTransaction({ oneoffName: 'Ринок', categoryId: 'c1', subcategoryName: null }),
      ],
      written: () => financeTransaction(),
    });
    openPage('/accounting/counterparties?tab=oneoffs');

    const row = await screen.findByRole('row', { name: /Ринок/ });
    expect(requestsTo(calls, '/api/accounting/counterparties')[0]).toMatch(/tab=Oneoffs/);
    fireEvent.contextMenu(row, { clientX: 10, clientY: 10 });
    await user.click(screen.getByRole('menuitem', { name: 'Зробити постійним' }));
    const dialog = screen.getByRole('dialog', { name: 'Зробити постійним?' });
    await user.click(within(dialog).getByRole('button', { name: 'Зробити постійним' }));

    await waitFor(() =>
      expect(calls.find((call) => call.method === 'POST')).toEqual({
        method: 'POST',
        path: '/api/accounting/transactions/t1/promote-oneoff',
        body: { version: 2 },
      }),
    );
  });

  it('lists suppliers read-only with their operation count', async () => {
    stubFinanceApi({
      parties: [
        {
          kind: 'Supplier',
          id: '7',
          name: 'ТОВ Тканини',
          taxId: '',
          active: true,
          operationCount: 4,
        },
      ],
    });
    openPage('/accounting/counterparties?tab=suppliers');

    const row = await screen.findByRole('row', { name: /ТОВ Тканини/ });
    expect(row).toHaveTextContent('4');
    expect(screen.queryByRole('button', { name: 'Дії контрагента' })).toBeNull();
  });
});

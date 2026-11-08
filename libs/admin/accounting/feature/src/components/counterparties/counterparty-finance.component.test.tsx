import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CounterpartyFinance } from './counterparty-finance';
import { financeTransaction, requestsTo, stubFinanceApi } from '../../testing/finance-api-stub';
import { render } from '../../testing/render';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const clientId = '0193a8a0-0000-7000-8000-000000000001';

function open(kind: 'Client' | 'Supplier' = 'Client', id = clientId) {
  render(
    <MemoryRouter>
      <CounterpartyFinance kind={kind} id={id} />
    </MemoryRouter>,
  );
}

describe('«Фінанси» of a client or supplier card', () => {
  it('lists the operations with this counterparty and applies the period on «Показати»', async () => {
    const calls = stubFinanceApi({
      transactions: [
        financeTransaction({ type: 'Income', description: 'Оплата КП', amountMinor: 120_000 }),
      ],
      transactionTotals: [
        { currency: 'UAH', incomeMinor: 120_000, expenseMinor: 0, differenceMinor: 120_000 },
      ],
    });
    open();
    const user = userEvent.setup();

    expect(await screen.findByText('Оплата КП')).toBeVisible();
    expect(screen.getByLabelText('Підсумки вибірки')).toHaveTextContent('Надходження+1 200,00 ₴');
    expect(requestsTo(calls, '/api/accounting/transactions')).toEqual([
      `/api/accounting/transactions?scope=Current&counterpartyKind=Client&counterpartyId=${clientId}&sort=Date&direction=Desc&page=1`,
    ]);

    await user.type(screen.getByLabelText('З'), '2026-10-01');
    await user.type(screen.getByLabelText('По'), '2026-10-31');
    await user.click(screen.getByRole('button', { name: 'Показати' }));

    await waitFor(() =>
      expect(requestsTo(calls, '/api/accounting/transactions')).toContain(
        `/api/accounting/transactions?scope=Current&counterpartyKind=Client&counterpartyId=${clientId}&sort=Date&direction=Desc&page=1&from=2026-10-01&to=2026-10-31`,
      ),
    );
  });

  it('shows zero totals in hryvnias and the empty label for a supplier without operations', async () => {
    const calls = stubFinanceApi({});
    open('Supplier', '7');

    expect(await screen.findByText('Операцій із цим контрагентом немає')).toBeVisible();
    expect(screen.getByLabelText('Підсумки вибірки')).toHaveTextContent('Різниця0,00 ₴');
    expect(requestsTo(calls, '/api/accounting/transactions')[0]).toContain(
      'counterpartyKind=Supplier&counterpartyId=7',
    );
  });

  it('refuses a period that ends before it starts', async () => {
    stubFinanceApi({});
    open();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('З'), '2026-10-31');
    await user.type(screen.getByLabelText('По'), '2026-10-01');

    expect(screen.getByText('Кінець періоду раніший за початок.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Показати' })).toBeDisabled();
  });
});

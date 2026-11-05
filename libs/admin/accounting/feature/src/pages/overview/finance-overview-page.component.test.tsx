import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FinanceOverviewPage } from './finance-overview-page';
import { financeAccount, requestsTo, stubFinanceApi } from '../../testing/finance-api-stub';
import { render } from '../../testing/render';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const overview = {
  scope: 'Current',
  from: '2026-10-01',
  to: '2026-11-05',
  currencies: [
    {
      currency: 'UAH',
      balanceMinor: 250_000,
      unconfirmedCutoverCount: 1,
      incomeMinor: 80_000,
      expenseMinor: 30_000,
      differenceMinor: 50_000,
      accountCount: 2,
    },
  ],
};

function openPage() {
  render(
    <MemoryRouter initialEntries={['/accounting/overview']}>
      <FinanceOverviewPage />
    </MemoryRouter>,
  );
}

describe('«Огляд» page', () => {
  it('shows the period figures and marks only accounts without the balance on 01.10', async () => {
    stubFinanceApi({
      overview,
      accounts: [
        financeAccount(),
        financeAccount({
          id: 'a2',
          name: 'Каса',
          cutoverConfirmed: false,
          balance: { legacyMinor: 5_000, currentMinor: null, totalMinor: 5_000, hasHistory: false },
        }),
        financeAccount({ id: 'a3', name: 'Старий', active: false }),
      ],
    });
    openPage();

    expect(await screen.findByText(/Не підтверджено: 1 з 2/)).toBeVisible();
    expect(screen.getByLabelText('Огляд у UAH')).toHaveTextContent(/Різниця\s*500,00/);
    const table = screen.getByRole('table', { name: 'Залишки рахунків' });
    expect(table).toHaveTextContent(/Банк\s*1\s000,00/);
    expect(table).toHaveTextContent(/Каса\s*Не підтверджено/);
    expect(table).not.toHaveTextContent('Старий');
  });

  it('switches the area and shows its whole period', async () => {
    const user = userEvent.setup();
    const calls = stubFinanceApi({ overview });
    openPage();
    await waitFor(() =>
      expect(requestsTo(calls, '/api/accounting/overview')[0]).toMatch(
        /from=2026-10-01.*to=2026-11-05.*scope=Current/,
      ),
    );

    await user.click(screen.getByRole('button', { name: 'Усе разом' }));
    await waitFor(() =>
      expect(requestsTo(calls, '/api/accounting/overview').at(-1)).toMatch(
        /^\/api\/accounting\/overview\?from=2010-01-01&to=2026-11-05$/,
      ),
    );
  });
});

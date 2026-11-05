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
  needsReviewCount: 3,
  needsCategoryCount: 2,
  needsCounterpartyCount: 1,
  currencies: [
    {
      currency: 'UAH',
      balanceMinor: 250_000,
      unconfirmedCutoverCount: 1,
      incomeMinor: 80_000,
      expenseMinor: 30_000,
      differenceMinor: 50_000,
      accountCount: 2,
      incomeCount: 1,
      expenseCount: 4,
      topExpenses: [
        { categoryId: 'c1', name: 'Тканини', amountMinor: 20_000 },
        { categoryId: null, name: 'Без категорії', amountMinor: 4_000 },
      ],
      otherExpenseMinor: 6_000,
      otherExpenseCategoryCount: 3,
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
  it('shows what needs attention, the period figures and where the money went', async () => {
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
    const summary = screen.getByLabelText('Підсумки UAH');
    expect(summary).toHaveTextContent(/Надходження · ЛИСТОПАД\s*800,00/);
    expect(summary).toHaveTextContent(/4 операції/);
    expect(summary).toHaveTextContent(/Різниця\s*500,00/);
    const table = screen.getByRole('table', { name: 'Залишки рахунків' });
    expect(table).toHaveTextContent(/Банк/);
    expect(table).toHaveTextContent(/1\s000,00/);
    expect(table).toHaveTextContent(/Каса.*Не підтверджено/);
    expect(table).not.toHaveTextContent('Старий');
    expect(screen.getByRole('status')).toHaveTextContent(
      '3 операції чекають перевірки: 2 без категорії, 1 з новим контрагентом.',
    );
    expect(screen.getByRole('link', { name: /Перевірити/ })).toHaveAttribute(
      'href',
      '/accounting/review',
    );
    const bars = screen.getByRole('region', { name: /Куди пішли гроші · листопад/ });
    expect(bars).toHaveTextContent(/Тканини\s*200,00/);
    expect(bars).toHaveTextContent(/Інші: 3 категорії — 60,00/);
  });

  it('switches the period and the area', async () => {
    const user = userEvent.setup();
    const calls = stubFinanceApi({ overview });
    openPage();
    await waitFor(() =>
      expect(requestsTo(calls, '/api/accounting/overview')[0]).toMatch(
        /from=2026-11-01.*to=2026-11-05.*scope=Current/,
      ),
    );

    await user.click(screen.getByRole('button', { name: 'Жовтень' }));
    await waitFor(() =>
      expect(requestsTo(calls, '/api/accounting/overview').at(-1)).toMatch(
        /from=2026-10-01.*to=2026-10-31/,
      ),
    );

    await user.click(screen.getByRole('button', { name: 'Домашня бухгалтерія' }));
    await waitFor(() =>
      expect(requestsTo(calls, '/api/accounting/overview').at(-1)).toMatch(
        /from=2010-01-01.*to=2026-09-30.*scope=LegacyArchive/,
      ),
    );
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

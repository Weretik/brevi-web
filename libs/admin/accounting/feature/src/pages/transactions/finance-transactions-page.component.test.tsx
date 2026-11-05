import { cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FinanceTransactionsPage } from './finance-transactions-page';
import {
  financeAccount,
  financeCategory,
  financeTransaction,
  requestsTo,
  stubFinanceApi,
} from '../../testing/finance-api-stub';
import { render } from '../../testing/render';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const categories = [
  financeCategory(),
  financeCategory({ id: 'c2', name: 'Тканини', parentId: 'c1' }),
  financeCategory({ id: 'c3', name: 'Продажі', direction: 'Income' }),
  financeCategory({ id: 'c4', name: 'Побут', scope: 'LegacyArchive' }),
];

function openPage(entry = '/accounting/transactions') {
  render(
    <MemoryRouter initialEntries={[entry]}>
      <FinanceTransactionsPage />
    </MemoryRouter>,
  );
}

describe('«Операції» page', () => {
  it('lists the current books with signed amounts and totals of the whole selection', async () => {
    const calls = stubFinanceApi({
      categories,
      transactions: [
        financeTransaction(),
        financeTransaction({
          id: 't2',
          type: 'Income',
          amountMinor: 50_000,
          categoryRootName: 'Продажі',
          description: 'Замовлення',
          subcategoryName: null,
        }),
      ],
      transactionTotals: [
        { currency: 'UAH', incomeMinor: 50_000, expenseMinor: 30_000, differenceMinor: 20_000 },
      ],
    });
    openPage();

    const row = await screen.findByRole('row', { name: /Нитки/ });
    expect(within(row).getByText(/−300,00/)).toBeVisible();
    expect(within(row).getByText('Матеріали › Тканини')).toBeVisible();
    expect(screen.getByRole('row', { name: /Продажі/ })).toHaveTextContent(/\+500,00/);
    const totals = screen.getByLabelText('Підсумки вибірки');
    expect(totals).toHaveTextContent(/Надходження\s*\+500,00.*Витрати\s*−300,00.*Різниця\s*200,00/);
    expect(requestsTo(calls, '/api/accounting/transactions')[0]).toMatch(
      /scope=Current.*page=1.*from=2026-10-01.*to=2026-11-05/,
    );
  });

  it('adds an expense with the chosen subcategory in kopecks', async () => {
    const user = userEvent.setup();
    const calls = stubFinanceApi({
      categories,
      written: () => financeTransaction(),
    });
    openPage();
    await screen.findByText('Операцій поки немає');

    await user.click(screen.getByRole('button', { name: 'Витрата' }));
    const panel = screen.getByRole('dialog', { name: 'Нова операція' });
    await user.click(within(panel).getByRole('combobox', { name: 'Рахунок' }));
    await user.click(await screen.findByRole('option', { name: 'Банк' }));
    await user.type(within(panel).getByRole('textbox', { name: 'Сума, грн' }), '1 250,40');
    await user.click(within(panel).getByRole('combobox', { name: 'Категорія' }));
    expect(screen.queryByRole('option', { name: 'Продажі' })).not.toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Побут' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('option', { name: 'Матеріали' }));
    await user.click(within(panel).getByRole('combobox', { name: 'Підкатегорія' }));
    await user.click(await screen.findByRole('option', { name: 'Тканини' }));
    await user.click(within(panel).getByRole('button', { name: 'Зберегти' }));

    await waitFor(() => expect(calls.filter((call) => call.method === 'POST')).toHaveLength(1));
    expect(calls.find((call) => call.method === 'POST')).toMatchObject({
      path: '/api/accounting/transactions',
      body: {
        scope: 'Current',
        date: '2026-11-05',
        type: 'Expense',
        accountId: 'a1',
        amountMinor: 125_040,
        categoryId: 'c2',
      },
    });
    expect(await screen.findByText('Операцію додано.')).toBeVisible();
  });

  it('picks a counterparty that brings its default category', async () => {
    const user = userEvent.setup();
    const calls = stubFinanceApi({
      categories,
      choices: [
        {
          kind: 'Supplier',
          id: '7',
          name: 'ТОВ Тканини',
          hint: '12345678',
          verified: true,
          defaultCategoryId: null,
        },
        {
          kind: 'Financial',
          id: 'f1',
          name: 'ФОП Іваненко',
          hint: '',
          verified: true,
          defaultCategoryId: 'c2',
        },
      ],
      written: () => financeTransaction(),
    });
    openPage();
    await screen.findByText('Операцій поки немає');

    await user.click(screen.getByRole('button', { name: 'Витрата' }));
    const panel = screen.getByRole('dialog', { name: 'Нова операція' });
    await user.click(within(panel).getByRole('combobox', { name: 'Рахунок' }));
    await user.click(await screen.findByRole('option', { name: 'Банк' }));
    await user.type(within(panel).getByRole('textbox', { name: 'Сума, грн' }), '100');
    await user.click(within(panel).getByRole('combobox', { name: 'Контрагент' }));
    expect(await screen.findByText('Постачальники')).toBeVisible();
    await user.click(screen.getByRole('option', { name: /ФОП Іваненко/ }));
    expect(within(panel).getByRole('combobox', { name: 'Підкатегорія' })).toHaveTextContent(
      'Тканини',
    );
    await user.click(within(panel).getByRole('button', { name: 'Зберегти' }));

    await waitFor(() => expect(calls.filter((call) => call.method === 'POST')).toHaveLength(1));
    expect(calls.find((call) => call.method === 'POST')?.body).toMatchObject({
      categoryId: 'c2',
      counterparty: { kind: 'Financial', id: 'f1' },
      oneoffName: null,
    });
  });

  it('adds a typed name as a confirmed finance counterparty', async () => {
    const user = userEvent.setup();
    const calls = stubFinanceApi({
      categories,
      written: (call) =>
        call.path === '/api/accounting/counterparties'
          ? {
              ...(call.body as object),
              id: 'f9',
              edrpou: '',
              iban: '',
              bankName: '',
              note: '',
              defaultCategoryRootName: null,
              defaultSubcategoryName: null,
              active: true,
              mergedIntoId: null,
              operationCount: 0,
              currentTurnoverMinor: 0,
              version: 1,
              createdAt: '2026-11-05T08:00:00+00:00',
              updatedAt: '2026-11-05T08:00:00+00:00',
            }
          : financeTransaction(),
    });
    openPage();
    await screen.findByText('Операцій поки немає');

    await user.click(screen.getByRole('button', { name: 'Витрата' }));
    const panel = screen.getByRole('dialog', { name: 'Нова операція' });
    await user.type(within(panel).getByRole('combobox', { name: 'Контрагент' }), 'Ринок');
    await user.click(
      await screen.findByRole('option', { name: 'Додати «Ринок» як фінансового контрагента' }),
    );

    await waitFor(() =>
      expect(calls.find((call) => call.method === 'POST')).toMatchObject({
        path: '/api/accounting/counterparties',
        body: { name: 'Ринок', verified: true },
      }),
    );
    await waitFor(() =>
      expect(within(panel).getByRole('combobox', { name: 'Контрагент' })).toHaveValue('Ринок'),
    );
  });

  it('cancels an operation with the version it was shown with', async () => {
    const user = userEvent.setup();
    const calls = stubFinanceApi({ categories, transactions: [financeTransaction()] });
    openPage();

    fireEvent.contextMenu(await screen.findByRole('row', { name: /Нитки/ }), {
      clientX: 10,
      clientY: 10,
    });
    await user.click(screen.getByRole('menuitem', { name: 'Анулювати' }));
    const dialog = screen.getByRole('dialog', { name: 'Анулювати операцію?' });
    expect(dialog).toHaveTextContent(/не впливатиме на залишки/);
    await user.click(within(dialog).getByRole('button', { name: 'Анулювати' }));

    await waitFor(() =>
      expect(calls.find((call) => call.method === 'POST')).toEqual({
        method: 'POST',
        path: '/api/accounting/transactions/t1/void',
        body: { version: 2 },
      }),
    );
  });

  it('opens «Домашня бухгалтерія» on its own period and applies filters on demand', async () => {
    const user = userEvent.setup();
    const calls = stubFinanceApi({
      accounts: [financeAccount(), financeAccount({ id: 'a2', name: 'Старий', active: false })],
      categories,
    });
    openPage('/accounting/transactions?tab=archive');
    await screen.findByText('Операцій поки немає');
    expect(requestsTo(calls, '/api/accounting/transactions')[0]).toMatch(
      /scope=LegacyArchive.*from=2010-01-01.*to=2026-09-30/,
    );

    await user.click(screen.getByRole('button', { name: 'Витрати' }));
    await waitFor(() =>
      expect(requestsTo(calls, '/api/accounting/transactions').at(-1)).toMatch(/type=Expense/),
    );
    await user.click(screen.getByRole('button', { name: 'Ще фільтри' }));
    const filters = screen.getByRole('form', { name: 'Фільтри журналу' });
    expect(within(filters).queryByRole('combobox', { name: 'Тип' })).not.toBeInTheDocument();
    await user.click(within(filters).getByRole('switch', { name: 'Показати анульовані' }));
    expect(requestsTo(calls, '/api/accounting/transactions')).toHaveLength(2);
    await user.click(within(filters).getByRole('button', { name: 'Застосувати' }));

    await waitFor(() =>
      expect(requestsTo(calls, '/api/accounting/transactions').at(-1)).toMatch(
        /type=Expense.*includeVoided=true|includeVoided=true.*type=Expense/,
      ),
    );
    expect(screen.getByRole('button', { name: 'Ще фільтри · 1' })).toBeVisible();
  });

  it('applies a quick period and a typed search at once', async () => {
    const user = userEvent.setup();
    const calls = stubFinanceApi({ categories });
    openPage();
    await screen.findByText('Операцій поки немає');
    expect(screen.getByRole('button', { name: 'З 01.10' })).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: 'Жовтень' }));
    await waitFor(() =>
      expect(requestsTo(calls, '/api/accounting/transactions').at(-1)).toMatch(
        /from=2026-10-01.*to=2026-10-31/,
      ),
    );
    await user.type(screen.getByRole('searchbox', { name: 'Пошук' }), 'нитки');
    await waitFor(() =>
      expect(requestsTo(calls, '/api/accounting/transactions').at(-1)).toMatch(
        /from=2026-10-01.*to=2026-10-31.*search=%D0%BD/,
      ),
    );
  });
});

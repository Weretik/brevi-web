import { cleanup, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BankStatementPage } from './bank-statement-page';
import {
  bankStatement,
  bankStatementLine,
  financeCategory,
  statementDetails,
  stubFinanceApi,
} from '../../testing/finance-api-stub';
import { render } from '../../testing/render';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function openPage() {
  render(
    <MemoryRouter initialEntries={['/accounting/statements/s1']}>
      <Routes>
        <Route path="/accounting/statements/:id" element={<BankStatementPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

const duplicate = bankStatementLine({
  id: 'l2',
  rowNumber: 3,
  bankName: 'ФОП Петренко',
  duplicate: 'Probable',
  duplicateNote: 'Схожа операція 15.10.2026 на 1 250,40.',
  state: 'Duplicate',
  excluded: true,
  willBook: false,
});

describe('statement page', () => {
  it('shows lines with their problems and what will be booked', async () => {
    stubFinanceApi({ lines: [bankStatementLine(), duplicate] });
    openPage();

    expect(await screen.findByRole('heading', { name: 'Виписка жовтень.xlsx' })).toBeVisible();
    expect(await screen.findByText('ТОВ Тканини')).toBeVisible();
    expect(screen.getAllByText('Новий контрагент').length).toBeGreaterThan(0);
    expect(screen.getByText('Схоже на дублікат')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Усі 2' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Дублікати 1' })).toBeVisible();
    expect(screen.getByText(/Буде проведено:/)).toHaveTextContent('1 операція');
    expect(screen.getByRole('switch', { name: 'Проводити рядок 3' })).not.toBeChecked();
  });

  it('includes a probable duplicate right in the table', async () => {
    const calls = stubFinanceApi({
      lines: [duplicate],
      written: () => ({ ...duplicate, excluded: false, willBook: true }),
    });
    openPage();
    const user = userEvent.setup();

    await user.click(await screen.findByRole('switch', { name: 'Проводити рядок 3' }));

    await waitFor(() =>
      expect(calls.find((call) => call.method === 'PUT')).toEqual({
        method: 'PUT',
        path: '/api/accounting/statements/s1/lines/l2',
        body: {
          categoryId: null,
          counterparty: null,
          oneoffName: null,
          description: null,
          comment: null,
          excluded: false,
        },
      }),
    );
  });

  it('saves a category and a one-off name from the side panel', async () => {
    const calls = stubFinanceApi({
      lines: [bankStatementLine()],
      categories: [financeCategory()],
      written: () => bankStatementLine({ state: 'Ready', categoryId: 'c1' }),
    });
    openPage();
    const user = userEvent.setup();

    await user.click(await screen.findByRole('button', { name: 'Змінити рядок 2' }));
    const panel = await screen.findByRole('dialog');
    expect(within(panel).getByText('Оплата за тканину згідно рах. 15')).toBeVisible();
    await user.click(within(panel).getByRole('switch', { name: /Разовий контрагент/ }));
    await user.type(within(panel).getByLabelText('Назва разового контрагента'), 'ТОВ Тканини');
    await user.click(within(panel).getByRole('combobox', { name: 'Категорія' }));
    await user.click(await screen.findByRole('option', { name: 'Матеріали' }));
    await user.click(within(panel).getByRole('button', { name: 'Зберегти' }));

    await waitFor(() =>
      expect(calls.find((call) => call.method === 'PUT')?.body).toEqual({
        categoryId: 'c1',
        counterparty: null,
        oneoffName: 'ТОВ Тканини',
        description: null,
        comment: null,
        excluded: false,
      }),
    );
    expect(await screen.findByText('Рядок 2 збережено.')).toBeVisible();
  });

  it('books the statement with its version after the confirmation', async () => {
    const calls = stubFinanceApi({
      lines: [bankStatementLine()],
      written: () => bankStatement({ status: 'Booked', transactionCount: 1, version: 2 }),
    });
    openPage();
    const user = userEvent.setup();

    await user.click(await screen.findByRole('button', { name: 'Провести виписку' }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText(/Буде додано 1 операція і 0 переказів/)).toBeVisible();
    await user.click(within(dialog).getByRole('button', { name: 'Провести' }));

    await waitFor(() =>
      expect(calls.find((call) => call.method === 'POST')).toEqual({
        method: 'POST',
        path: '/api/accounting/statements/s1/book',
        body: { version: 1 },
      }),
    );
    expect(await screen.findByText(/Виписку проведено: 1 операцій/)).toBeVisible();
  });

  it('shows a booked statement read-only', async () => {
    stubFinanceApi({
      statementDetails: statementDetails(
        [bankStatementLine({ transactionId: 't1', state: 'Ready' })],
        bankStatement({ status: 'Booked', transactionCount: 1 }),
      ),
    });
    openPage();

    expect(await screen.findByText(/Проведено 1 операція/)).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Провести виписку' })).toBeNull();
    expect(screen.getByRole('switch', { name: 'Проводити рядок 2' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Переглянути рядок 2' })).toBeVisible();
  });

  it('rolls a booked statement back after the confirmation', async () => {
    const calls = stubFinanceApi({
      statementDetails: {
        ...statementDetails(
          [bankStatementLine({ transactionId: 't1', state: 'Ready' })],
          bankStatement({ status: 'Booked', transactionCount: 1, version: 2 }),
        ),
        rollback: { transactions: 1, transfers: 0, changed: 1, cancelled: 0 },
      },
      written: () => bankStatement({ version: 3 }),
    });
    openPage();
    const user = userEvent.setup();

    await user.click(await screen.findByRole('button', { name: 'Відкотити виписку' }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText(/Буде анульовано 1 операцій і 0 переказів/)).toBeVisible();
    expect(within(dialog).getByText(/1 з них змінювали вручну/)).toBeVisible();
    await user.click(within(dialog).getByRole('button', { name: 'Відкотити' }));

    await waitFor(() =>
      expect(calls.find((call) => call.method === 'POST')).toEqual({
        method: 'POST',
        path: '/api/accounting/statements/s1/rollback',
        body: { version: 2 },
      }),
    );
    expect(await screen.findByText(/Виписку відкочено/)).toBeVisible();
  });
});

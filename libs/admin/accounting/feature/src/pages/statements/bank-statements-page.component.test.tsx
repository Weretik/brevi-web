import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BankStatementsPage } from './bank-statements-page';
import { bankStatement, financeAccount, stubFinanceApi } from '../../testing/finance-api-stub';
import { render } from '../../testing/render';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function Opened() {
  const location = useLocation();
  return <p>Відкрито {location.pathname}</p>;
}

function openPage() {
  render(
    <MemoryRouter initialEntries={['/accounting/statements']}>
      <Routes>
        <Route path="/accounting/statements" element={<BankStatementsPage />} />
        <Route path="/accounting/statements/:id" element={<Opened />} />
      </Routes>
    </MemoryRouter>,
  );
}

const xlsx = (name = 'Виписка.xlsx', size = 10) =>
  new File(['x'.repeat(size)], name, {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

describe('«Виписки банку» page', () => {
  it('uploads a file of the chosen account and opens the statement', async () => {
    const calls = stubFinanceApi({
      accounts: [
        financeAccount(),
        financeAccount({ id: 'a2', name: 'Картка ФОП', type: 'Card' }),
        financeAccount({ id: 'a3', name: 'Каса', type: 'Cash' }),
      ],
      statements: [bankStatement({ status: 'Booked', transactionCount: 40, transferCount: 2 })],
      written: () => bankStatement({ id: 's2' }),
    });
    openPage();
    const user = userEvent.setup({ applyAccept: false });

    expect(await screen.findByText('Виписка жовтень.xlsx')).toBeVisible();
    expect(screen.getByText('40 опер. · 2 перек.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Завантажити виписку' })).toBeDisabled();

    await user.click(screen.getByRole('combobox', { name: 'Рахунок' }));
    expect(screen.queryByRole('option', { name: 'Каса' })).toBeNull();
    await user.click(screen.getByRole('option', { name: 'Картка ФОП' }));
    await user.upload(screen.getByLabelText('Файл виписки'), xlsx());

    expect(await screen.findByText('Відкрито /accounting/statements/s2')).toBeVisible();
    const upload = calls.find((call) => call.method === 'POST');
    expect(upload?.path).toBe('/api/accounting/statements');
    expect(upload?.body).toMatch(/name="accountId"\r\n\r\na2/);
    expect(upload?.body).toMatch(/name="file"/);
  });

  it('refuses a file of another type before sending it', async () => {
    const calls = stubFinanceApi({ statements: [] });
    openPage();
    const user = userEvent.setup({ applyAccept: false });

    expect(await screen.findByText('Виписок поки немає. Завантажте першу.')).toBeVisible();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Завантажити виписку' })).toBeEnabled(),
    );
    await user.upload(screen.getByLabelText('Файл виписки'), xlsx('виписка.pdf'));

    expect(screen.getByText('Оберіть виписку у форматі XLSX, XLS або CSV.')).toBeVisible();
    expect(calls.filter((call) => call.method !== 'GET')).toHaveLength(0);
  });
});

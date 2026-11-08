import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FinanceReportsPage } from './finance-reports-page';
import {
  financeReport,
  financeReportRow,
  requestsTo,
  stubFinanceApi,
} from '../../testing/finance-api-stub';
import { render } from '../../testing/render';

const files = vi.hoisted(() => ({
  csv: vi.fn(async () => new Blob(['x'], { type: 'text/csv' })),
  backup: vi.fn(async () => new Blob(['{}'], { type: 'application/json' })),
}));

vi.mock('@admin/accounting/data-access', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@admin/accounting/data-access')>()),
  fetchFinanceReportCsv: files.csv,
  fetchFinanceExport: files.backup,
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  files.csv.mockClear();
  files.backup.mockClear();
});

/** jsdom has no object URLs; a download only needs them to exist. */
function stubObjectUrls() {
  Object.assign(URL, { createObjectURL: vi.fn(() => 'blob:x'), revokeObjectURL: vi.fn() });
}

function openPage() {
  render(
    <MemoryRouter>
      <FinanceReportsPage />
    </MemoryRouter>,
  );
}

describe('«Звіти» page', () => {
  it('builds the report only on «Сформувати звіт» and downloads its CSV', async () => {
    const calls = stubFinanceApi({});
    stubObjectUrls();
    openPage();
    const user = userEvent.setup();

    expect(
      await screen.findByText('Оберіть звіт і період, потім «Сформувати звіт».'),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Завантажити CSV' })).toBeDisabled();
    expect(requestsTo(calls, '/api/accounting/reports')).toHaveLength(0);

    await user.click(screen.getByRole('button', { name: 'Сформувати звіт' }));

    expect(await screen.findByLabelText('Підсумки звіту')).toHaveTextContent('Різниця600,00 ₴');
    expect(requestsTo(calls, '/api/accounting/reports')).toEqual([
      '/api/accounting/reports?kind=Summary&from=2026-11-01&to=2026-11-05&scope=Current',
    ]);
    await user.click(screen.getByRole('button', { name: 'Завантажити CSV' }));
    await waitFor(() =>
      expect(files.csv).toHaveBeenCalledWith({
        kind: 'Summary',
        from: '2026-11-01',
        to: '2026-11-05',
        scope: 'Current',
      }),
    );
  });

  it('shows the expense structure with subcategories and warns when the journal is cut', async () => {
    stubFinanceApi({
      report: financeReport({
        kind: 'ExpenseStructure',
        totals: [
          {
            currency: 'UAH',
            operations: 2,
            incomeMinor: 0,
            expenseMinor: 40_000,
            resultMinor: -40_000,
          },
        ],
        rows: [
          financeReportRow({
            category: 'Матеріали',
            operations: 2,
            expenseMinor: 40_000,
            resultMinor: -40_000,
          }),
          financeReportRow({
            rowType: 'Subcategory',
            category: 'Матеріали',
            subcategory: 'Тканини',
            operations: 1,
            expenseMinor: 10_000,
            resultMinor: -10_000,
          }),
        ],
        totalRows: 2,
        limited: true,
      }),
    });
    openPage();
    const user = userEvent.setup();

    await user.click(await screen.findByRole('combobox', { name: 'Звіт' }));
    await user.click(screen.getByRole('option', { name: 'Структура витрат' }));
    expect(screen.queryByRole('combobox', { name: 'Тип' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Сформувати звіт' }));

    expect(await screen.findByText('Тканини')).toBeVisible();
    expect(screen.getByText('25,0 %')).toBeVisible();
    expect(screen.getByText(/Показано перші 2 з 2 операцій/)).toBeVisible();
  });

  it('refuses a period that ends before it starts and downloads the backup', async () => {
    const calls = stubFinanceApi({});
    stubObjectUrls();
    openPage();
    const user = userEvent.setup();

    const to = await screen.findByLabelText('До');
    await user.clear(to);
    await user.type(to, '2026-10-01');
    await user.click(screen.getByRole('button', { name: 'Сформувати звіт' }));

    expect(screen.getByText('Кінець періоду раніший за початок.')).toBeVisible();
    expect(requestsTo(calls, '/api/accounting/reports')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: 'Резервна копія' }));
    await waitFor(() => expect(files.backup).toHaveBeenCalledTimes(1));
  });
});

import { cleanup, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LegacyFinanceImportPage } from './legacy-finance-import-page';
import { stubFinanceApi } from '../../testing/finance-api-stub';
import { render } from '../../testing/render';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const report = (overrides: Record<string, unknown> = {}) => ({
  applied: false,
  canApply: true,
  exportedAt: '2026-11-05T07:52:48.933+00:00',
  counts: [
    { kind: 'Accounts', inFile: 16, toAdd: 16, alreadyMoved: 0, skipped: 0 },
    { kind: 'Transactions', inFile: 41046, toAdd: 41046, alreadyMoved: 0, skipped: 0 },
  ],
  parties: {
    clientsLinked: 45,
    clientsAsFinancial: 3,
    suppliersLinked: 23,
    suppliersAsFinancial: 0,
    unused: 847,
  },
  totals: [
    {
      scope: 'LegacyArchive',
      movement: 'Income',
      status: 'Active',
      currency: 'UAH',
      count: 7950,
      amountMinor: 9_243_620_381,
    },
  ],
  balances: [
    {
      accountId: 'a4',
      name: 'касса',
      currency: 'UAH',
      active: true,
      archiveMinor: 3_252_902,
      cutoverMinor: 3_250_000,
      currentMinor: 8_261_000,
      differenceMinor: -2_902,
    },
  ],
  errorCount: 0,
  errors: [],
  warnings: ['Рахунок «касса»: залишок архіву на 30.09 відрізняється від підтвердженого.'],
  ...overrides,
});

function openPage() {
  render(
    <MemoryRouter initialEntries={['/accounting/legacy-import']}>
      <LegacyFinanceImportPage />
    </MemoryRouter>,
  );
}

const file = () =>
  new File(['{"format":"brevi-finance-v5"}'], 'finance.json', { type: 'application/json' });

describe('«Перенесення архіву» page', () => {
  it('checks the file first and moves it only after the confirmation', async () => {
    const calls = stubFinanceApi({
      written: (call) => report({ applied: call.path.includes('dryRun=false') }),
    });
    openPage();
    const user = userEvent.setup({ applyAccept: false });

    await user.upload(screen.getByLabelText('Файл експорту «Фінансів»'), file());

    expect(await screen.findByText('Що переноситься')).toBeTruthy();
    expect(screen.getAllByText('41 046', { selector: 'td' })).toHaveLength(2);
    expect(screen.getByText(/45 знайдено в «Клієнтах», 3 стануть фінансовими/)).toBeTruthy();
    expect(screen.getByText(/Різниця/)).toBeTruthy();
    expect(screen.getByText(/залишок архіву на 30.09 відрізняється/)).toBeTruthy();
    expect(calls.map((call) => call.path)).toEqual(['/api/accounting/legacy-import?dryRun=true']);

    await user.click(screen.getByRole('button', { name: 'Перенести' }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText(/Буде додано 41\s062 записів/)).toBeTruthy();
    await user.click(within(dialog).getByRole('button', { name: 'Перенести' }));

    expect(await screen.findByText(/Архів перенесено/)).toBeTruthy();
    expect(calls.at(-1)?.path).toBe('/api/accounting/legacy-import?dryRun=false');
    expect(calls.at(-1)?.body).toMatch(/name="file"/);
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Перенести' })).toBeNull());
  });

  it('lists the errors and offers no move while the file has them', async () => {
    stubFinanceApi({
      written: () =>
        report({
          canApply: false,
          errorCount: 101,
          errors: ['Категорія «Офіс»: у Brevi вже є категорія з такою назвою на цьому рівні.'],
        }),
    });
    openPage();
    const user = userEvent.setup({ applyAccept: false });

    await user.upload(screen.getByLabelText('Файл експорту «Фінансів»'), file());

    expect(await screen.findByText(/Перенесення неможливе: 101 помилок/)).toBeTruthy();
    expect(screen.getByText(/Категорія «Офіс»/)).toBeTruthy();
    expect(screen.getByText('і ще 100')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Перенести' })).toBeNull();
  });
});

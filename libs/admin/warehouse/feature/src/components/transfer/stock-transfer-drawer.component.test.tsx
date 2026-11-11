import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { StockTransferDrawer } from './stock-transfer-drawer';

const api = vi.hoisted(() => ({ transfer: vi.fn() }));

vi.mock('@admin/warehouse/data-access', () => ({
  useTransferFabricStockMutation: () => [
    (args: unknown) => ({ unwrap: () => api.transfer(args) }),
    { isLoading: false },
  ],
}));

const tables = [
  'fabric_stock',
  'fabric_stock_movements',
  'fabric_movement_revisions',
  'fabric_issue_batches',
  'fabric_issue_lines',
  'fabric_issue_components',
  'fabric_reservations',
  'production_orders',
  'production_items',
];

const file = (table: string, text = '') => new File([text], `${table}.jsonl`);

const check = (overrides: object = {}) => ({
  applied: false,
  unchanged: false,
  hash: 'a'.repeat(64),
  source: {
    lines: 1,
    pairs: 1,
    movements: 1,
    openings: 1,
    receipts: 0,
    issues: 0,
    adjustments: 0,
    voided: 0,
    revisions: 0,
    packages: 0,
    issueLines: 0,
    reservations: 0,
    meters: 2.6,
    negativePairs: 0,
    zeroPairs: 0,
  },
  target: { lines: 1, movements: 1, revisions: 0, issues: 0, issueLines: 0, plans: 0, meters: 2.6 },
  current: {
    lines: 2,
    movements: 2,
    issues: 0,
    plans: 0,
    ownLines: 1,
    ownMovements: 1,
    ownIssues: 0,
  },
  needsConfirmation: true,
  errors: [],
  notes: [],
  lastTransferAt: null,
  ...overrides,
});

const pick = (files: File[]) =>
  fireEvent.change(screen.getByLabelText('Файли вигрузки'), { target: { files } });

describe('StockTransferDrawer', () => {
  it('names the files that are missing and sends nothing', async () => {
    render(<StockTransferDrawer onClose={vi.fn()} />);
    pick([file('fabric_stock')]);
    expect(
      await screen.findByText(/Серед вибраних файлів немає: fabric_stock_movements\.jsonl/),
    ).toBeTruthy();
    expect(api.transfer).not.toHaveBeenCalled();
  });

  it('checks the export, then replaces own records only once the confirmation is ticked', async () => {
    api.transfer.mockReset();
    api.transfer.mockResolvedValueOnce(check());
    api.transfer.mockResolvedValueOnce(check({ applied: true, needsConfirmation: true }));
    render(<StockTransferDrawer onClose={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Назва вигрузки'), { target: { value: 'v133' } });
    pick(
      tables.map((table) =>
        table === 'fabric_stock'
          ? file(table, '{"id":"s-1","fabric_id":"FAB-016","hundredths_of_meter":260}')
          : file(table),
      ),
    );
    await waitFor(() => expect(api.transfer).toHaveBeenCalledTimes(1));
    const first = api.transfer.mock.calls[0]?.[0];
    expect(first).toMatchObject({ dryRun: true, confirmReplace: false });
    expect(first.input.fabricStock[0]).toMatchObject({
      fabricId: 'FAB-016',
      hundredthsOfMeter: 260,
    });
    expect(await screen.findByText(/Перенесення їх видалить/)).toBeTruthy();

    const submit = screen.getByRole('button', { name: 'Перенести' }) as HTMLButtonElement;
    expect(submit.disabled).toBe(true);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(submit.disabled).toBe(false);
    fireEvent.click(submit);
    await waitFor(() => expect(api.transfer).toHaveBeenCalledTimes(2));
    expect(api.transfer.mock.calls[1]?.[0]).toMatchObject({
      dryRun: false,
      confirmReplace: true,
      input: { snapshot: 'v133' },
    });
    expect(await screen.findByText('Склад тканин замінено даними старого «Цеху».')).toBeTruthy();
  });

  it('keeps the transfer closed while the export has errors', async () => {
    api.transfer.mockReset();
    api.transfer.mockResolvedValueOnce(
      check({
        target: null,
        needsConfirmation: false,
        errors: [
          { table: 'production_orders', rowId: 'o-1', message: 'Завдання №5 немає в Brevi.' },
        ],
      }),
    );
    render(<StockTransferDrawer onClose={vi.fn()} />);
    pick(tables.map((table) => file(table)));
    expect(await screen.findByText('Завдання №5 немає в Brevi.')).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Перенести' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
  });
});

import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PurchaseInvoicesTable } from './purchase-invoices-table';

import type { PurchaseInvoice } from '@admin/purchasing/model';

afterEach(cleanup);

const empty = { items: [], total: 0, page: 1, pageSize: 50 };
const invoice = {
  messageId: 'm1',
  sourceUid: '42',
  messageAt: '03.11.2026 10:15',
  text: 'Рахунок',
  chatName: 'Бухгалтерія',
  fromUser: 'Олена',
  markedPaid: true,
  supplierId: null,
  supplierName: null,
  issues: [],
  links: [
    {
      id: 'f1',
      url: 'https://www.dropbox.com/s/a.pdf',
      safe: true,
      recognition: null,
      document: {
        documentType: 'Рахунок',
        documentNumber: '1542',
        documentDate: '2026-11-03',
        supplierName: 'ТОВ Захист-Про',
        vat: 'WithoutVat',
        pricesIncludeVat: false,
        vatAmount: null,
        totalPayable: '4044.19',
        items: [],
        source: 'Ai',
        model: 'gpt-6-luna',
        checkedBy: 'a@b.c',
        checkedAt: '2026-11-05T08:00:00Z',
      },
    },
  ],
} as unknown as PurchaseInvoice;

const props = {
  loading: false,
  narrowed: false,
  unavailable: false,
  onPageChange: vi.fn(),
  renderDetails: () => <p>Деталі рахунку</p>,
};

describe('PurchaseInvoicesTable', () => {
  it('asks to refresh an empty register', () => {
    render(<PurchaseInvoicesTable {...props} page={empty} />);
    expect(screen.getByText('Реєстр порожній. Натисніть «Оновити зараз».')).toBeVisible();
  });

  it('says nothing was found when search or a filter is on', () => {
    render(<PurchaseInvoicesTable {...props} page={empty} narrowed />);
    expect(screen.getByText('Рахунків за цими умовами не знайдено.')).toBeVisible();
  });

  it('shows the state, the invoice and «Без ПДВ», and opens the details with the arrow', async () => {
    render(
      <PurchaseInvoicesTable
        {...props}
        page={{ items: [invoice], total: 1, page: 1, pageSize: 50 }}
      />,
    );
    const table = screen.getByRole('table', { name: 'Рахунки на закупку' });
    expect(within(table).getByText('✓ Розпізнано')).toBeVisible();
    expect(within(table).getByText('ТОВ Захист-Про')).toBeVisible();
    expect(within(table).getByText('№ 1542 · 03.11.2026')).toBeVisible();
    expect(within(table).getByText('4 044,19 грн')).toBeVisible();
    expect(within(table).getByText('Без ПДВ')).toBeVisible();
    expect(screen.queryByText('Деталі рахунку')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Розгорнути рахунок UID 42' }));
    expect(screen.getByText('Деталі рахунку')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Згорнути рахунок UID 42' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });
});

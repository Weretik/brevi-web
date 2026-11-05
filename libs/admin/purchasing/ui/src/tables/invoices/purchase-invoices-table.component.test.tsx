import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PurchaseInvoicesTable } from './purchase-invoices-table';

afterEach(cleanup);

const empty = { items: [], total: 0, page: 1, pageSize: 50 };

describe('PurchaseInvoicesTable', () => {
  it('asks to refresh an empty register', () => {
    render(
      <PurchaseInvoicesTable
        page={empty}
        loading={false}
        narrowed={false}
        unavailable={false}
        onPageChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Реєстр порожній. Натисніть «Оновити зараз».')).toBeVisible();
  });

  it('says nothing was found when search or a filter is on', () => {
    render(
      <PurchaseInvoicesTable
        page={empty}
        loading={false}
        narrowed
        unavailable={false}
        onPageChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Рахунків за цими умовами не знайдено.')).toBeVisible();
  });
});

import { cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FinanceReviewPage } from './finance-review-page';
import {
  financeCategory,
  financeCounterparty,
  financeTransaction,
  requestsTo,
  stubFinanceApi,
} from '../../testing/finance-api-stub';
import { render } from '../../testing/render';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const waiting = financeTransaction({
  verification: 'NeedsCounterpartyReview',
  counterparty: {
    kind: 'Financial',
    id: 'f1',
    name: 'ФОП Іваненко',
    active: true,
    verified: false,
    missing: false,
  },
});

function openPage() {
  render(
    <MemoryRouter initialEntries={['/accounting/review']}>
      <FinanceReviewPage />
    </MemoryRouter>,
  );
}

describe('«Потребують перевірки» page', () => {
  it('lists the current operations that need a review', async () => {
    const calls = stubFinanceApi({ transactions: [waiting] });
    openPage();

    const row = await screen.findByRole('row', { name: /Нитки/ });
    expect(within(row).getByText('Перевірити контрагента')).toBeVisible();
    expect(within(row).getByText('ФОП Іваненко')).toBeVisible();
    expect(requestsTo(calls, '/api/accounting/transactions')[0]).toMatch(
      /scope=Current.*needsReview=true/,
    );
  });

  it('confirms the counterparty and saves the review with the operation version', async () => {
    const user = userEvent.setup();
    const calls = stubFinanceApi({
      transactions: [waiting],
      categories: [
        financeCategory(),
        financeCategory({ id: 'c2', name: 'Тканини', parentId: 'c1' }),
      ],
      counterparties: [financeCounterparty({ version: 3 })],
      written: (call) =>
        call.path.endsWith('/verify') ? financeCounterparty({ verified: true }) : waiting,
    });
    openPage();

    fireEvent.contextMenu(await screen.findByRole('row', { name: /Нитки/ }), {
      clientX: 10,
      clientY: 10,
    });
    await user.click(screen.getByRole('menuitem', { name: 'Переглянути' }));
    const panel = await screen.findByRole('dialog', { name: 'Перевірка операції' });
    await user.click(within(panel).getByRole('button', { name: 'Перевірено' }));
    expect(within(panel).getByText(/Спершу підтвердіть/)).toBeVisible();
    expect(calls.filter((call) => call.method !== 'GET')).toHaveLength(0);

    await user.click(await within(panel).findByRole('button', { name: 'Підтвердити' }));
    await waitFor(() =>
      expect(calls.find((call) => call.method === 'POST')).toEqual({
        method: 'POST',
        path: '/api/accounting/counterparties/f1/verify',
        body: { version: 3 },
      }),
    );
    await user.click(within(panel).getByRole('button', { name: 'Перевірено' }));

    await waitFor(() =>
      expect(calls.find((call) => call.method === 'PUT')).toEqual({
        method: 'PUT',
        path: '/api/accounting/transactions/t1/review',
        body: {
          categoryId: 'c2',
          counterparty: { kind: 'Financial', id: 'f1' },
          oneoffName: null,
          version: 2,
        },
      }),
    );
  });
});

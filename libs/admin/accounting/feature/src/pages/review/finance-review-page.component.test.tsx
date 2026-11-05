import { cleanup, screen, waitFor, within } from '@testing-library/react';
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
  it('shows each operation as a card with its problem', async () => {
    const calls = stubFinanceApi({
      transactions: [
        waiting,
        financeTransaction({
          id: 't2',
          description: 'Комісія банку',
          verification: 'NeedsCategory',
          categoryId: null,
          categoryRootName: null,
          subcategoryName: null,
        }),
      ],
    });
    openPage();

    const card = await screen.findByRole('article', { name: /Нитки/ });
    expect(within(card).getByText('Перевірити контрагента')).toBeVisible();
    expect(within(card).getByText('Вручну · ФОП Іваненко')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Без категорії 1' })).toBeVisible();
    expect(requestsTo(calls, '/api/accounting/transactions')[0]).toMatch(
      /scope=Current.*needsReview=true/,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Без категорії 1' }));
    expect(screen.queryByRole('article', { name: /Нитки/ })).not.toBeInTheDocument();
    expect(screen.getByRole('article', { name: /Комісія банку/ })).toBeVisible();
  });

  it('confirms the counterparty and saves the review with «Запамʼятати»', async () => {
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

    const card = await screen.findByRole('article', { name: /Нитки/ });
    expect(within(card).getByText(/ще не підтверджений/)).toBeVisible();
    await user.click(within(card).getByRole('button', { name: 'Підтвердити' }));
    expect(within(card).getByText(/Спершу підтвердіть/)).toBeVisible();
    expect(calls.filter((call) => call.method !== 'GET')).toHaveLength(0);

    await user.click(await within(card).findByRole('button', { name: 'Підтвердити контрагента' }));
    await waitFor(() =>
      expect(calls.find((call) => call.method === 'POST')).toEqual({
        method: 'POST',
        path: '/api/accounting/counterparties/f1/verify',
        body: { version: 3 },
      }),
    );
    expect(
      within(card).getByRole('checkbox', {
        name: 'Запамʼятати: наступні операції «ФОП Іваненко» одразу в «Матеріали»',
      }),
    ).toBeChecked();
    await user.click(within(card).getByRole('button', { name: 'Підтвердити' }));

    await waitFor(() =>
      expect(calls.find((call) => call.method === 'PUT')).toEqual({
        method: 'PUT',
        path: '/api/accounting/transactions/t1/review',
        body: {
          categoryId: 'c2',
          counterparty: { kind: 'Financial', id: 'f1' },
          oneoffName: null,
          version: 2,
          rememberCategory: true,
        },
      }),
    );
  });
});

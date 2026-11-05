import { cleanup, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FinanceTransfersPage } from './finance-transfers-page';
import { financeAccount, financeTransfer, stubFinanceApi } from '../../testing/finance-api-stub';
import { render } from '../../testing/render';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const accounts = [
  financeAccount(),
  financeAccount({ id: 'a2', name: 'Каса', type: 'Cash' }),
  financeAccount({ id: 'a3', name: 'Євро', currency: 'EUR' }),
];

function openPage() {
  render(
    <MemoryRouter initialEntries={['/accounting/transfers']}>
      <FinanceTransfersPage />
    </MemoryRouter>,
  );
}

async function choose(panel: HTMLElement, field: string, option: RegExp) {
  const user = userEvent.setup();
  await user.click(within(panel).getByRole('combobox', { name: field }));
  await user.click(await screen.findByRole('option', { name: option }));
}

describe('«Перекази» page', () => {
  it('lists transfers with the total of the selection', async () => {
    stubFinanceApi({ accounts, transfers: [financeTransfer()] });
    openPage();

    const row = await screen.findByRole('row', { name: /Зняття готівки/ });
    expect(within(row).getByText('Банк')).toBeVisible();
    expect(within(row).getByText('Каса')).toBeVisible();
    expect(screen.getByLabelText('Підсумки вибірки')).toHaveTextContent(/1\s000,00/);
  });

  it('refuses a transfer between currencies before saving and sends a good one', async () => {
    const user = userEvent.setup();
    const calls = stubFinanceApi({ accounts, written: () => financeTransfer() });
    openPage();
    await screen.findByText('Переказів поки немає');

    await user.click(screen.getByRole('button', { name: 'Додати переказ' }));
    const panel = screen.getByRole('dialog', { name: 'Новий переказ' });
    await choose(panel, 'З рахунку', /^Банк/);
    await choose(panel, 'На рахунок', /^Євро/);
    await user.type(within(panel).getByRole('textbox', { name: 'Сума, грн' }), '1000');
    await user.click(within(panel).getByRole('button', { name: 'Зберегти' }));
    expect(await within(panel).findByText(/однієї валюти/)).toBeVisible();
    expect(calls.some((call) => call.method === 'POST')).toBe(false);

    await choose(panel, 'На рахунок', /^Каса/);
    await user.click(within(panel).getByRole('button', { name: 'Зберегти' }));
    await waitFor(() =>
      expect(calls.find((call) => call.method === 'POST')).toMatchObject({
        path: '/api/accounting/transfers',
        body: {
          scope: 'Current',
          date: '2026-11-05',
          fromAccountId: 'a1',
          toAccountId: 'a2',
          amountMinor: 100_000,
        },
      }),
    );
  });
});

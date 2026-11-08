import { cleanup, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FinanceAuditPage } from './finance-audit-page';
import { financeAuditEntry, requestsTo, stubFinanceApi } from '../../testing/finance-api-stub';
import { render } from '../../testing/render';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('«Журнал змін» page', () => {
  it('lists changes, filters them and opens what changed', async () => {
    const calls = stubFinanceApi({ audit: [financeAuditEntry()] });
    render(
      <MemoryRouter>
        <FinanceAuditPage />
      </MemoryRouter>,
    );
    const user = userEvent.setup();

    await user.click(
      await screen.findByRole('button', { name: '15.10.2026 · 300,00 UAH · Нитки' }),
    );
    const panel = await screen.findByRole('dialog');
    expect(within(panel).getByText('Сума')).toBeVisible();
    expect(within(panel).getByText('200,00 ₴')).toBeVisible();
    expect(within(panel).getByText('300,00 ₴')).toBeVisible();
    expect(within(panel).queryByText('Опис')).toBeNull();
    await user.keyboard('{Escape}');

    await user.click(screen.getByRole('combobox', { name: 'Що' }));
    await user.click(screen.getByRole('option', { name: 'Переказ' }));
    expect(requestsTo(calls, '/api/accounting/audit').at(-1)).toBe(
      '/api/accounting/audit?page=1&entity=Transfer',
    );
  });
});

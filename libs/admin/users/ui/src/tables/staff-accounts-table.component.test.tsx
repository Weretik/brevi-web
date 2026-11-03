import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { StaffAccountsTable } from './staff-accounts-table';

import type { StaffAccount } from '@admin/users/model';

const accounts: StaffAccount[] = [
  { id: 1, email: 'admin@brevi.com.ua', fullName: 'Адмін', role: 'Admin', isBlocked: false },
  {
    id: 2,
    email: 'manager@brevi.com.ua',
    fullName: 'Олена',
    role: 'Manager',
    isBlocked: true,
  },
];

const renderTable = (onAction = vi.fn()) =>
  render(
    <StaffAccountsTable
      accounts={accounts}
      currentUserId={1}
      error={false}
      loading={false}
      onAction={onAction}
      onRetry={vi.fn()}
    />,
  );

describe('StaffAccountsTable', () => {
  it('shows role and status for each account', () => {
    renderTable();

    const managerRow = screen.getByText('manager@brevi.com.ua').closest('tr') as HTMLElement;
    expect(within(managerRow).getByText('Менеджер')).toBeTruthy();
    expect(within(managerRow).getByText('Заблокований')).toBeTruthy();
  });

  it('does not let the admin demote or block themselves', () => {
    renderTable();
    fireEvent.click(screen.getByRole('button', { name: 'Дії для admin@brevi.com.ua' }));

    expect(screen.getByRole('menuitem', { name: /менеджер/ }).getAttribute('aria-disabled')).toBe(
      'true',
    );
    expect(
      screen.getByRole('menuitem', { name: 'Заблокувати' }).getAttribute('aria-disabled'),
    ).toBe('true');
  });

  it('asks to unblock a blocked manager', () => {
    const onAction = vi.fn();
    renderTable(onAction);
    fireEvent.click(screen.getByRole('button', { name: 'Дії для manager@brevi.com.ua' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Розблокувати' }));

    expect(onAction).toHaveBeenCalledWith(accounts[1], { type: 'setBlocked', blocked: false });
  });
});

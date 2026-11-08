import { builtInStaffRoleOptions } from '@admin/users/model';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { StaffAccountsTable } from './staff-accounts-table';

import type { StaffAccount } from '@admin/users/model';

const accounts: StaffAccount[] = [
  {
    id: 1,
    email: 'admin@brevi.com.ua',
    fullName: 'Адмін',
    role: 'Admin',
    isBlocked: false,
    avatarUrl: null,
    phoneNumber: null,
  },
  {
    id: 3,
    email: 'director@brevi.com.ua',
    fullName: 'Директор',
    role: 'Director',
    isBlocked: false,
    avatarUrl: null,
    phoneNumber: null,
  },
  {
    id: 2,
    email: 'manager@brevi.com.ua',
    fullName: 'Олена',
    role: 'Manager',
    isBlocked: true,
    avatarUrl: null,
    phoneNumber: '+380 50 123 45 67',
  },
  {
    id: 4,
    email: 'store@brevi.com.ua',
    fullName: 'Петро',
    role: 'custom-0123456789ab',
    isBlocked: false,
    avatarUrl: null,
    phoneNumber: null,
  },
];

const roleOptions = [
  ...builtInStaffRoleOptions,
  { name: 'custom-0123456789ab', title: 'Склад', locked: false },
];

const renderTable = (onAction = vi.fn(), actor = { id: 1, isDirector: false }) =>
  render(
    <StaffAccountsTable
      accounts={accounts}
      actor={actor}
      error={false}
      loading={false}
      onAction={onAction}
      onRetry={vi.fn()}
      roleOptions={roleOptions}
    />,
  );

describe('StaffAccountsTable', () => {
  it('shows role and status for each account', () => {
    renderTable();

    const managerRow = screen.getByText('manager@brevi.com.ua').closest('tr') as HTMLElement;
    expect(within(managerRow).getByText('Менеджер')).toBeTruthy();
    expect(within(managerRow).getByText('Заблокований')).toBeTruthy();
    expect(within(managerRow).getByText('+380 50 123 45 67')).toBeTruthy();
    // No photo: the first letter of the name.
    expect(within(managerRow).getByText('О')).toBeTruthy();
  });

  it('does not let the admin change their role, block or delete themselves', () => {
    renderTable();
    fireEvent.click(screen.getByRole('button', { name: 'Дії для admin@brevi.com.ua' }));

    expect(screen.getByRole('menuitem', { name: 'Встановити новий пароль' })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Змінити дані' })).toBeTruthy();
    expect(screen.queryByRole('menuitem', { name: /Зробити/ })).toBeNull();
    expect(screen.queryByRole('menuitem', { name: 'Заблокувати' })).toBeNull();
    expect(screen.queryByRole('menuitem', { name: 'Видалити' })).toBeNull();
  });

  it('gives the admin no actions on the director', () => {
    renderTable();

    expect(screen.queryByRole('button', { name: 'Дії для director@brevi.com.ua' })).toBeNull();
  });

  it('lets the director delete a manager and offers no second director', () => {
    const onAction = vi.fn();
    renderTable(onAction, { id: 3, isDirector: true });
    fireEvent.click(screen.getByRole('button', { name: 'Дії для manager@brevi.com.ua' }));

    expect(screen.queryByRole('menuitem', { name: /директор/ })).toBeNull();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Видалити' }));
    expect(onAction).toHaveBeenCalledWith(accounts[2], { type: 'delete' });
  });

  it('asks to unblock a blocked manager', () => {
    const onAction = vi.fn();
    renderTable(onAction);
    fireEvent.click(screen.getByRole('button', { name: 'Дії для manager@brevi.com.ua' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Розблокувати' }));

    expect(onAction).toHaveBeenCalledWith(accounts[2], { type: 'setBlocked', blocked: false });
  });

  it('shows the server title of a custom role and offers it in the menu', () => {
    const onAction = vi.fn();
    renderTable(onAction);

    const storeRow = screen.getByText('store@brevi.com.ua').closest('tr') as HTMLElement;
    expect(within(storeRow).getByText('Склад')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Дії для manager@brevi.com.ua' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Зробити: склад' }));
    expect(onAction).toHaveBeenCalledWith(accounts[2], {
      type: 'changeRole',
      role: 'custom-0123456789ab',
      roleTitle: 'Склад',
    });
  });
});

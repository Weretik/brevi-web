import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ProfileDetailsCard } from './profile-details-card';

import type { StaffProfile } from '@admin/users/model';

const profile = (role: StaffProfile['role']): StaffProfile => ({
  id: 1,
  email: 'olena@brevi.com.ua',
  fullName: 'Олена',
  role,
  avatarUrl: null,
  phoneNumber: '+380 50 123 45 67',
});

describe('ProfileDetailsCard', () => {
  it('lets a manager change only the name', () => {
    render(<ProfileDetailsCard onEdit={vi.fn()} profile={profile('Manager')} />);

    expect(screen.getByRole('button', { name: 'Змінити: Імʼя' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Змінити: Телефон' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Змінити: Email (логін)' })).toBeNull();
    expect(screen.queryByText('Пароль')).toBeNull();
    expect(screen.getByText('+380 50 123 45 67')).toBeTruthy();
  });

  it('lets the director change the phone, email and password too', () => {
    render(<ProfileDetailsCard onEdit={vi.fn()} profile={profile('Director')} />);

    expect(screen.getByRole('button', { name: 'Змінити: Телефон' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Змінити: Email (логін)' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Змінити: Пароль' })).toBeTruthy();
  });
});

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CreateStaffPanel } from './create-staff-panel';

describe('CreateStaffPanel', () => {
  it('checks the fields before sending', () => {
    const onSubmit = vi.fn();
    render(
      <CreateStaffPanel
        directorExists={false}
        error={null}
        onClose={vi.fn()}
        onSubmit={onSubmit}
        open
        submitting={false}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Створити' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('Пароль має містити щонайменше 8 символів.')).toBeTruthy();
  });

  it('sends an admin account', async () => {
    const onSubmit = vi.fn().mockResolvedValue(true);
    const onClose = vi.fn();
    render(
      <CreateStaffPanel
        directorExists={false}
        error={null}
        onClose={onClose}
        onSubmit={onSubmit}
        open
        submitting={false}
      />,
    );

    fireEvent.change(screen.getByLabelText(/Імʼя/), { target: { value: 'Іван' } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'ivan@brevi.com.ua' } });
    fireEvent.change(screen.getByLabelText('Телефон'), { target: { value: '+380 50 123 45 67' } });
    fireEvent.change(screen.getByLabelText(/Пароль/), { target: { value: 'password-1' } });
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Роль' }));
    fireEvent.click(screen.getByRole('option', { name: 'Адміністратор' }));
    fireEvent.click(screen.getByRole('button', { name: 'Створити' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'ivan@brevi.com.ua',
        fullName: 'Іван',
        role: 'Admin',
        password: 'password-1',
        phoneNumber: '+380 50 123 45 67',
      }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('does not offer a second director', () => {
    render(
      <CreateStaffPanel
        directorExists
        error={null}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        open
        submitting={false}
      />,
    );

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Роль' }));

    expect(screen.getByRole('option', { name: 'Директор' }).getAttribute('aria-disabled')).toBe(
      'true',
    );
  });
});

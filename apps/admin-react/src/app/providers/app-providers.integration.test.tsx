import { logout } from '@admin/core/auth';
import { useAdminShellLogout } from '@admin/core/shell';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { AppProviders } from './app-providers';

vi.mock('@admin/core/auth', () => ({ logout: vi.fn().mockResolvedValue(undefined) }));

function LogoutConsumer() {
  const shellLogout = useAdminShellLogout();
  return (
    <button type="button" onClick={() => void shellLogout?.()}>
      Завершити сеанс
    </button>
  );
}

describe('AppProviders auth composition', () => {
  it('injects the auth logout action into the shell boundary', async () => {
    render(
      <AppProviders>
        <LogoutConsumer />
      </AppProviders>,
    );

    await userEvent.setup().click(screen.getByRole('button', { name: 'Завершити сеанс' }));

    expect(logout).toHaveBeenCalledOnce();
  });
});

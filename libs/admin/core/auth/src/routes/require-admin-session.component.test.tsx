import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { RequireAdminSession } from './require-admin-session';
import { setSessionState } from '../session/session-store';

import type { SessionUser } from '../session/session-user';

const staff = (roles: SessionUser['roles']): SessionUser => ({
  id: 'u-1',
  email: 'staff@brevi.com.ua',
  fullName: 'Олена',
  roles,
  avatarUrl: null,
  access: { allowAll: false, roles: [], grants: {} },
});

function LoginProbe() {
  const location = useLocation();
  return <p>Логін: {location.search}</p>;
}

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<LoginProbe />} path="/login" />
        <Route
          element={
            <RequireAdminSession>{(user) => <p>Кабінет {user.fullName}</p>}</RequireAdminSession>
          }
          path="*"
        />
      </Routes>
    </MemoryRouter>,
  );

describe('RequireAdminSession', () => {
  it('sends a guest to the login page with the return path', () => {
    setSessionState({ status: 'anonymous' });
    renderAt('/orders/7');

    expect(screen.getByText(`Логін: ?returnTo=${encodeURIComponent('/orders/7')}`)).toBeTruthy();
  });

  it('shows "no access" to a signed-in customer', () => {
    setSessionState({ status: 'authenticated', user: staff(['User']) });
    renderAt('/');

    expect(screen.getByRole('heading', { name: 'Немає доступу' })).toBeTruthy();
  });

  it('renders the admin for a manager', () => {
    setSessionState({ status: 'authenticated', user: staff(['Manager']) });
    renderAt('/');

    expect(screen.getByText('Кабінет Олена')).toBeTruthy();
  });
});

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AdminRouteLayout } from './admin-route-layout';

import type { SessionRole, SessionUser } from '@admin/core/auth';

const user = (roles: SessionRole[]): SessionUser => ({
  id: '1',
  email: 'staff@brevi.com.ua',
  fullName: 'Олена',
  roles,
  avatarUrl: null,
});
vi.mock('@admin/core/shell', () => ({
  AdminLayout: ({
    navigation,
  }: {
    navigation: readonly { items: readonly { id: string; label: string }[] }[];
  }) => (
    <nav aria-label="Основна навігація">
      {navigation
        .flatMap((group) => group.items)
        .map((item) => (
          <span key={item.id}>{item.label}</span>
        ))}
    </nav>
  ),
}));
vi.mock('../providers/color-mode-provider', () => ({
  useAdminColorMode: () => ({ colorMode: 'light', changeColorMode: vi.fn() }),
}));

afterEach(cleanup);

describe('Admin navigation session role', () => {
  it('hides Admin-only entries from a Manager and shows them to an Admin', () => {
    const view = render(<AdminRouteLayout user={user(['Manager'])} />);
    expect(screen.queryByText('Реквізити та шаблон КП')).not.toBeInTheDocument();
    expect(screen.queryByText('Користувачі')).not.toBeInTheDocument();
    expect(screen.getByText('Розрахунки та КП')).toBeInTheDocument();

    view.rerender(<AdminRouteLayout user={user(['Admin'])} />);
    expect(screen.getByText('Реквізити та шаблон КП')).toBeInTheDocument();
    expect(screen.getByText('Користувачі')).toBeInTheDocument();
  });
});

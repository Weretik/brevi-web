import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AdminRouteLayout } from './admin-route-layout';

const session = vi.hoisted(() => ({ roles: ['Manager'] as string[], available: true }));
vi.mock('@admin/core/auth', () => ({
  useGetAdminSessionRolesQuery: () => ({
    currentData: session.roles,
    isSuccess: session.available,
    isFetching: false,
  }),
}));
vi.mock('@admin/core/shell', () => ({
  AdminLayout: ({
    navigation,
  }: {
    navigation: readonly { items: readonly { id: string; label: string }[] }[];
  }) => (
    <nav aria-label="Основна навігація">
      {navigation[0].items.map((item) => (
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
  it('hides issuer settings for Manager and shows them after Admin role arrives', () => {
    session.roles = ['Manager'];
    const view = render(<AdminRouteLayout />);
    expect(screen.queryByText('Реквізити та шаблон КП')).not.toBeInTheDocument();
    expect(screen.getByText('Розрахунки та КП')).toBeInTheDocument();
    session.roles = ['Admin'];
    view.rerender(<AdminRouteLayout />);
    expect(screen.getByText('Реквізити та шаблон КП')).toBeInTheDocument();
    session.available = false;
    view.rerender(<AdminRouteLayout />);
    expect(screen.queryByText('Реквізити та шаблон КП')).not.toBeInTheDocument();
    session.available = true;
  });
});

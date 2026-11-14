import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AccessRightsPage from './access-rights-page';

import type { AccessRights } from '@admin/users/model';

const mocks = vi.hoisted(() => ({
  query: vi.fn(),
  save: vi.fn(),
}));

vi.mock('@admin/users/data-access', () => ({
  useGetAccessRightsQuery: mocks.query,
  useSaveRoleAccessMutation: () => [mocks.save, { isLoading: false }],
  useCreateRoleMutation: () => [vi.fn(), { isLoading: false }],
  useDeleteRoleMutation: () => [vi.fn(), { isLoading: false }],
}));

const rights: AccessRights = {
  areas: [{ key: 'quotes', group: 'Продажі', title: 'КП', actions: ['view', 'edit'] }],
  roles: [
    {
      name: 'Director',
      title: 'Директор',
      locked: true,
      builtIn: true,
      userCount: 1,
      version: 1,
      updatedByName: null,
      updatedAt: null,
      grants: {},
    },
    {
      name: 'Manager',
      title: 'Менеджер',
      locked: false,
      builtIn: true,
      userCount: 2,
      version: 4,
      updatedByName: null,
      updatedAt: null,
      grants: {},
    },
  ],
};

const renderPage = () =>
  render(
    <MemoryRouter>
      <AccessRightsPage onAccessChanged={() => Promise.resolve()} />
    </MemoryRouter>,
  );

describe('AccessRightsPage', () => {
  beforeEach(() => {
    mocks.save.mockReset();
    mocks.save.mockReturnValue({ unwrap: () => Promise.resolve() });
  });

  it('says why the page cannot load', () => {
    mocks.query.mockReturnValue({ isError: true, error: { status: 500 }, refetch: vi.fn() });

    renderPage();

    expect(screen.getByText('Не вдалося завантажити права доступу.')).toBeInTheDocument();
  });

  it('opens the first editable role and saves a changed switch', () => {
    mocks.query.mockReturnValue({ data: rights, currentData: rights, refetch: vi.fn() });

    renderPage();

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Користувачів з цією роллю: 2');
    const save = screen.getByRole('button', { name: 'Зберегти' });
    expect(save).toBeDisabled();

    fireEvent.click(screen.getByRole('switch', { name: /КП/ }));
    fireEvent.click(save);

    expect(mocks.save).toHaveBeenCalledWith({
      role: 'Manager',
      version: 4,
      grants: { quotes: ['view'] },
    });
  });
});

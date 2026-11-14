import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AccessRolePanel } from './access-role-panel';

import type { AccessAreaGroup, AccessRole } from '@admin/users/model';
import type { ComponentProps } from 'react';

const group: AccessAreaGroup = {
  title: 'Продажі',
  areas: [{ key: 'quotes', group: 'Продажі', title: 'КП', actions: ['view', 'edit'] }],
};

const role = (patch: Partial<AccessRole> = {}): AccessRole => ({
  name: 'Seller',
  title: 'Продавець',
  locked: false,
  builtIn: false,
  userCount: 0,
  version: 1,
  updatedByName: 'Олена',
  updatedAt: '2026-11-10T08:00:00Z',
  grants: {},
  ...patch,
});

function renderPanel(props: Partial<ComponentProps<typeof AccessRolePanel>> = {}) {
  const handlers = {
    onDelete: vi.fn(),
    onReload: vi.fn(),
    onClearSaveError: vi.fn(),
    onViewChange: vi.fn(),
    onActionChange: vi.fn(),
  };
  render(
    <AccessRolePanel
      editable
      grants={{}}
      groups={[group]}
      role={role()}
      saveError={null}
      {...handlers}
      {...props}
    />,
  );
  return handlers;
}

describe('AccessRolePanel', () => {
  it('shows how many users hold the role and who changed it last', () => {
    renderPanel({ role: role({ userCount: 3 }) });

    expect(screen.getByText(/Користувачів з цією роллю:/)).toHaveTextContent('3');
    expect(screen.getByText(/Останні зміни:/)).toHaveTextContent('Олена');
  });

  it('deletes a custom role without users', () => {
    const { onDelete } = renderPanel();

    fireEvent.click(screen.getByRole('button', { name: 'Видалити роль' }));

    expect(onDelete).toHaveBeenCalled();
  });

  it('blocks deleting a role that users still hold and says what to do', () => {
    renderPanel({ role: role({ userCount: 2 }) });

    expect(screen.getByRole('button', { name: 'Видалити роль' })).toBeDisabled();
    expect(screen.getByText(/Спершу змініть роль у/)).toHaveTextContent('2 користувачів');
  });

  it('never offers deleting a built-in role', () => {
    renderPanel({ role: role({ builtIn: true }) });

    expect(screen.queryByRole('button', { name: 'Видалити роль' })).not.toBeInTheDocument();
  });

  it('explains that the director has every right instead of showing switches', () => {
    renderPanel({ role: role({ locked: true, builtIn: true, title: 'Директор' }) });

    expect(screen.getByText(/Директор — усі права, не змінюється/)).toBeInTheDocument();
    expect(screen.queryByText('КП')).not.toBeInTheDocument();
  });

  it('offers a reload when someone else saved the role first', () => {
    const { onReload } = renderPanel({
      saveError: { message: 'Роль уже змінив інший користувач.', conflict: true },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Перезавантажити' }));

    expect(onReload).toHaveBeenCalled();
  });
});

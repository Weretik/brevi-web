import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AccessRolePanel } from './access-role-panel';

import type { AccessListView, AccessRoleEditing } from './access-role-panel';
import type { AccessAreaGroup, AccessRole } from '@admin/users/model';
import type { ComponentProps } from 'react';

const group: AccessAreaGroup = {
  title: 'Менеджер сервісу',
  areas: [
    {
      key: 'tasks',
      group: 'Менеджер сервісу',
      title: 'Мої завдання',
      actions: ['view', 'edit'],
      actionLabels: { view: 'Бачить свої завдання', edit: 'Змінювати статус і відмічати кроки' },
    },
    {
      key: 'forecast',
      group: 'Менеджер сервісу',
      title: 'Прогноз',
      actions: ['view'],
      actionLabels: {},
    },
  ],
};

const role = (patch: Partial<AccessRole> = {}): AccessRole => ({
  name: 'custom-1',
  title: 'Логіст',
  locked: false,
  builtIn: false,
  userCount: 0,
  userNames: [],
  version: 1,
  updatedByName: 'Олена',
  updatedAt: '2026-11-10T08:00:00Z',
  grants: {},
  ...patch,
});

const view = (patch: Partial<AccessListView> = {}): AccessListView => ({
  search: '',
  filter: 'all',
  counts: { all: 2, granted: 0, changed: 0 },
  collapsed: new Set(),
  allCollapsed: false,
  onSearchChange: vi.fn(),
  onFilterChange: vi.fn(),
  onToggleGroup: vi.fn(),
  onToggleAll: vi.fn(),
  ...patch,
});

function renderPanel(props: Partial<ComponentProps<typeof AccessRolePanel>> = {}) {
  const editing: AccessRoleEditing = {
    onLevelChange: vi.fn(),
    onGroupLevelChange: vi.fn(),
    onActionChange: vi.fn(),
  };
  const handlers = {
    onCopy: vi.fn(),
    onRename: vi.fn(),
    onDelete: vi.fn(),
    onReload: vi.fn(),
    onClearSaveError: vi.fn(),
  };
  render(
    <AccessRolePanel
      changed={new Set()}
      editable
      editing={editing}
      grants={{}}
      groups={[group]}
      role={role()}
      saveError={null}
      view={view()}
      {...handlers}
      {...props}
    />,
  );
  return { ...handlers, ...editing };
}

describe('AccessRolePanel (ACC-002)', () => {
  it('names the role holders and who changed it last', () => {
    renderPanel({ role: role({ userCount: 2, userNames: ['Ірина К.', 'Олег П.'] }) });

    expect(screen.getByRole('heading', { name: 'Логіст' })).toBeInTheDocument();
    expect(screen.getByText(/Ірина К., Олег П./)).toHaveTextContent('Олена');
    expect(screen.getByRole('button', { name: 'Видалити роль' })).toBeDisabled();
  });

  it('offers only the levels a page has and says what each action does', () => {
    const { onLevelChange, onActionChange } = renderPanel({ grants: { tasks: ['view'] } });

    const tasks = screen.getByRole('group', { name: 'Рівень: Мої завдання' });
    expect(within(tasks).queryByRole('button', { name: 'Усе' })).toBeNull();
    expect(screen.getByText('Бачить свої завдання')).toBeInTheDocument();
    const forecast = screen.getByRole('group', { name: 'Рівень: Прогноз' });
    expect(within(forecast).queryByRole('button', { name: 'Робота' })).toBeNull();

    fireEvent.click(within(tasks).getByRole('button', { name: 'Робота' }));
    expect(onLevelChange).toHaveBeenCalledWith(group.areas[0], 'work');
    fireEvent.click(screen.getByLabelText('Змінювати статус і відмічати кроки: Мої завдання'));
    expect(onActionChange).toHaveBeenCalledWith('tasks', 'edit', true);
  });

  it('sets a whole group and folds it', () => {
    const onToggleGroup = vi.fn();
    const { onGroupLevelChange } = renderPanel({ view: view({ onToggleGroup }) });

    fireEvent.click(
      within(screen.getByRole('group', { name: 'Уся група: Менеджер сервісу' })).getByRole(
        'button',
        {
          name: 'Перегляд',
        },
      ),
    );
    expect(onGroupLevelChange).toHaveBeenCalledWith(group, 'view');
    expect(screen.getByText('немає доступу')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Менеджер сервісу/, expanded: true }));
    expect(onToggleGroup).toHaveBeenCalledWith('Менеджер сервісу');
  });

  it('shows only the changed pages under «Змінені»', () => {
    renderPanel({ changed: new Set(['forecast']), view: view({ filter: 'changed' }) });

    expect(screen.getByText('Прогноз')).toBeInTheDocument();
    expect(screen.getByText('змінено')).toBeInTheDocument();
    expect(screen.queryByText('Мої завдання')).toBeNull();
  });

  it('shows the director as read only', () => {
    renderPanel({ role: role({ locked: true, builtIn: true, title: 'Директор' }) });

    expect(screen.getByText(/усі права, не змінюється/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Копіювати з ролі…' })).toBeNull();
  });
});

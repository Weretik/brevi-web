import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AccessRightsPage from './access-rights-page';

import type { AccessRights, AccessRole } from '@admin/users/model';

const mocks = vi.hoisted(() => ({
  query: vi.fn(),
  save: vi.fn(),
  rename: vi.fn(),
}));

vi.mock('@admin/users/data-access', () => ({
  useGetAccessRightsQuery: mocks.query,
  useSaveRoleAccessMutation: () => [mocks.save, { isLoading: false }],
  useCreateRoleMutation: () => [vi.fn(), { isLoading: false }],
  useDeleteRoleMutation: () => [vi.fn(), { isLoading: false }],
  useRenameRoleMutation: () => [mocks.rename, { isLoading: false }],
}));

const role = (patch: Partial<AccessRole>): AccessRole => ({
  name: 'Manager',
  title: 'Менеджер',
  locked: false,
  builtIn: true,
  userCount: 0,
  userNames: [],
  version: 1,
  updatedByName: null,
  updatedAt: null,
  grants: {},
  ...patch,
});

const rights: AccessRights = {
  areas: [
    {
      key: 'quotes',
      group: 'Менеджер сервісу',
      title: 'Комерційні пропозиції',
      actions: ['view', 'create', 'edit', 'delete'],
      actionLabels: { create: 'Створювати КП', delete: 'Видаляти КП і чистити архів' },
    },
    {
      key: 'background-tasks',
      group: 'Адміністрування',
      title: 'Фонові задачі',
      actions: ['view', 'create', 'edit'],
      actionLabels: { create: 'Запускати зараз' },
    },
  ],
  roles: [
    role({ name: 'Director', title: 'Директор', locked: true, userCount: 1 }),
    role({ userCount: 2, userNames: ['Ірина К.', 'Олег П.'], version: 4 }),
    role({
      name: 'custom-1',
      title: 'Логіст',
      builtIn: false,
      grants: { 'background-tasks': ['view'] },
    }),
  ],
  adminOnly: [{ group: 'Адміністрування', title: 'Користувачі', reason: 'Системна сторінка.' }],
};

const renderPage = () =>
  render(
    <MemoryRouter>
      <AccessRightsPage onAccessChanged={() => Promise.resolve()} />
    </MemoryRouter>,
  );

describe('AccessRightsPage (ACC-002)', () => {
  beforeEach(() => {
    mocks.save.mockReset();
    mocks.save.mockReturnValue({ unwrap: () => Promise.resolve() });
    mocks.query.mockReturnValue({ data: rights, currentData: rights, refetch: vi.fn() });
  });

  it('says why the page cannot load', () => {
    mocks.query.mockReturnValue({ isError: true, error: { status: 500 }, refetch: vi.fn() });

    renderPage();

    expect(screen.getByText('Не вдалося завантажити права доступу.')).toBeInTheDocument();
  });

  it('lists roles on the left and opens the first editable one with its people', () => {
    renderPage();

    const roles = screen.getByRole('navigation', { name: 'Ролі' });
    expect(within(roles).getByText('усе, не змінюється')).toBeInTheDocument();
    expect(within(roles).getByText('власна роль · 1 сторінка')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Менеджер' })).toBeInTheDocument();
    expect(screen.getByText(/Ірина К., Олег П./)).toBeInTheDocument();
    expect(screen.getByText('Тільки адміністратор')).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Незбережені зміни' })).not.toBeInTheDocument();
  });

  it('gives a level in one click, shows the real actions and saves from the bar', () => {
    renderPage();

    const quotes = screen.getByRole('group', { name: 'Рівень: Комерційні пропозиції' });
    fireEvent.click(within(quotes).getByRole('button', { name: 'Робота' }));

    expect(screen.getByLabelText('Створювати КП: Комерційні пропозиції')).toBeChecked();
    expect(
      screen.getByLabelText('Видаляти КП і чистити архів: Комерційні пропозиції'),
    ).not.toBeChecked();
    const bar = screen.getByRole('region', { name: 'Незбережені зміни' });
    expect(bar).toHaveTextContent('1 зміна у ролі «Менеджер»: Комерційні пропозиції');

    fireEvent.click(within(bar).getByRole('button', { name: 'Зберегти' }));
    expect(mocks.save).toHaveBeenCalledWith({
      role: 'Manager',
      version: 4,
      grants: { quotes: ['view', 'create', 'edit'] },
    });
  });

  it('finds a page by search and compares every role read only', () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('Пошук сторінки'), { target: { value: 'фонові' } });
    expect(screen.queryByText('Комерційні пропозиції')).not.toBeInTheDocument();
    expect(screen.getByText('Фонові задачі')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Порівняти ролі' }));
    const table = screen.getByRole('table', { name: 'Порівняння ролей' });
    expect(within(table).getByRole('row', { name: /Фонові задачі усе — П/ })).toBeInTheDocument();
  });

  it('copies another role into the draft without saving it', async () => {
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'Копіювати з ролі…' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Логіст' }));
    fireEvent.click(screen.getByRole('button', { name: 'Копіювати' }));

    expect(mocks.save).not.toHaveBeenCalled();
    // The side panel hides the page from assistive tech until it has closed.
    expect(await screen.findByRole('region', { name: 'Незбережені зміни' })).toHaveTextContent(
      '1 зміна у ролі «Менеджер»: Фонові задачі',
    );
  });
});

import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ActivityLogPage } from './activity-log-page';

import type { ActivityEntry, ActivityQuery } from '@admin/activity-log/model';

const fixture = vi.hoisted(() => ({
  items: [] as unknown[],
  error: undefined as unknown,
  refetch: vi.fn(),
  queries: [] as unknown[],
}));

vi.mock('@admin/activity-log/data-access', () => ({
  useGetActivityEntriesQuery: (query: unknown) => {
    fixture.queries.push(query);
    return {
      data: { items: fixture.items, page: 1, pageSize: 50, total: fixture.items.length },
      isFetching: false,
      error: fixture.error,
      refetch: fixture.refetch,
    };
  },
  useGetActivityFiltersQuery: () => ({
    data: {
      actors: [{ id: 7, name: 'Олена Коваль' }],
      subjectTypes: [{ key: 'quote', title: 'КП' }],
      actions: ['Created', 'Changed'],
    },
  }),
}));

const quoteChanged: ActivityEntry = {
  id: 'e1',
  occurredAt: '2026-11-16T12:30:00Z',
  actorId: 7,
  actorName: 'Олена Коваль',
  actorRoles: ['Manager'],
  action: 'Changed',
  subjectType: 'quote',
  subjectTypeTitle: 'КП',
  subjectId: '12',
  subjectTitle: 'КП-1048',
  summary: null,
  changes: [
    { field: 'Клієнт', from: null, to: 'ТОВ «Мрія»' },
    { field: 'Назва', from: 'Фартухи', to: 'Фартухи кухарські' },
    { field: 'Коментар', from: 'старий', to: null },
  ],
};

function lastQuery(): ActivityQuery {
  return fixture.queries.at(-1) as ActivityQuery;
}

function Location() {
  const location = useLocation();
  return <output aria-label="Адреса">{location.search}</output>;
}

function renderPage(url = '/admin/activity-log') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <ActivityLogPage />
      <Location />
    </MemoryRouter>,
  );
}

async function choose(chip: RegExp, option: string) {
  await userEvent.click(screen.getByRole('button', { name: chip }));
  await userEvent.click(await screen.findByRole('menuitem', { name: option }));
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  fixture.items = [];
  fixture.error = undefined;
  fixture.queries = [];
});

describe('ActivityLogPage', () => {
  it('asks for managers on the first page and lists who, what and when (SC-01)', async () => {
    fixture.items = [quoteChanged];
    renderPage();

    expect(lastQuery()).toEqual({ page: 1, pageSize: 50, role: 'Manager' });
    const grid = await screen.findByRole('grid', { name: 'Журнал дій' });
    expect(within(grid).getByText('16.11.2026, 14:30')).toBeInTheDocument();
    expect(within(grid).getByText('Олена Коваль')).toBeInTheDocument();
    expect(within(grid).getByText('Змінено')).toBeInTheDocument();
    expect(within(grid).getByText('КП-1048')).toBeInTheDocument();
    expect(within(grid).getByText('ще 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Роль: Менеджер' })).toBeInTheDocument();
  });

  it('drops the role for «Усі ролі» and keeps it in the URL (SC-02)', async () => {
    renderPage();

    await choose(/^Роль/, 'Усі ролі');

    expect(lastQuery().role).toBeUndefined();
    expect(screen.getByLabelText('Адреса')).toHaveTextContent('?role=all');
  });

  it('sends the person, object, action and search and returns to page 1 (SC-03)', async () => {
    renderPage('/admin/activity-log?page=3');

    await choose(/^Хто/, 'Олена Коваль');
    await choose(/^Об'єкт/, 'КП');
    await choose(/^Дія/, 'Змінено');
    await userEvent.type(screen.getByRole('textbox', { name: 'Пошук у журналі' }), 'Мрія');

    await waitFor(() => expect(lastQuery().search).toBe('Мрія'));
    expect(lastQuery()).toMatchObject({
      page: 1,
      actorId: 7,
      subjectType: 'quote',
      action: 'Changed',
      role: 'Manager',
    });
  });

  it('opens an entry with every change and a link to the КП (SC-04)', async () => {
    fixture.items = [quoteChanged];
    renderPage();

    await userEvent.click(await screen.findByText('КП-1048'));
    const panel = await screen.findByRole('dialog');

    expect(within(panel).getByText(/старий/)).toBeInTheDocument();
    expect(within(panel).getByRole('link', { name: 'КП КП-1048' })).toHaveAttribute(
      'href',
      '/crm/quotes/12',
    );
    expect(within(panel).queryByRole('button', { name: 'Редагувати' })).not.toBeInTheDocument();
  });

  it('says nothing was found under filters and retries after an error (SC-05)', async () => {
    renderPage('/admin/activity-log?action=Deleted');
    expect(await screen.findByText('Нічого не знайдено за цими фільтрами')).toBeInTheDocument();
    cleanup();

    fixture.error = { status: 500 };
    renderPage();
    await userEvent.click(await screen.findByRole('button', { name: 'Повторити' }));
    expect(fixture.refetch).toHaveBeenCalled();
  });
});

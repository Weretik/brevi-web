import { cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FinanceCategoriesPage } from './finance-categories-page';
import { render } from '../../testing/render';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const category = (overrides: Record<string, unknown>) => ({
  id: 'materials',
  name: 'Матеріали',
  direction: 'Expense',
  scope: 'Current',
  parentId: null,
  note: '',
  active: true,
  sortOrder: 10,
  version: 1,
  ...overrides,
});

const categories = [
  category({}),
  category({ id: 'fabric', name: 'Тканини', parentId: 'materials' }),
  category({ id: 'rent', name: 'Оренда', sortOrder: 20 }),
  category({ id: 'sales', name: 'Продажі', direction: 'Income' }),
  category({ id: 'old', name: 'Побутові витрати', scope: 'LegacyArchive' }),
];

function stubApi(writes: { method: string; path: string; body: unknown }[] = []) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation(async (path: string, init?: RequestInit) => {
      const method = init?.method ?? 'GET';
      if (method !== 'GET') {
        const body = init?.body ? JSON.parse(String(init.body)) : null;
        writes.push({ method, path, body });
        return method === 'DELETE'
          ? { ok: true, status: 204 }
          : { ok: true, json: async () => category(body) };
      }
      if (path.startsWith('/api/accounting/settings'))
        return {
          ok: true,
          json: async () => ({
            cutoverDate: '2026-10-01',
            timeZone: 'Europe/Kyiv',
            today: '2026-11-05',
          }),
        };
      if (path.includes('/history')) return { ok: true, json: async () => [] };
      return { ok: true, json: async () => categories };
    }),
  );
  return writes;
}

function openPage(entry = '/accounting/categories') {
  render(
    <MemoryRouter initialEntries={[entry]}>
      <FinanceCategoriesPage />
    </MemoryRouter>,
  );
}

async function openMenu(row: RegExp, item: string) {
  fireEvent.contextMenu(await screen.findByRole('row', { name: row }), {
    clientX: 80,
    clientY: 120,
  });
  await userEvent.click(screen.getByRole('menuitem', { name: item }));
}

describe('«Категорії» page', () => {
  it('shows each root with its subcategories and switches direction and area', async () => {
    const user = userEvent.setup();
    stubApi();
    openPage();

    await screen.findByRole('row', { name: /Матеріали/ });
    const names = screen
      .getAllByRole('row')
      .slice(1)
      .map((row) => within(row).getAllByRole('gridcell')[0]?.textContent);
    expect(names).toEqual(['Матеріали', 'Тканини', 'Оренда']);

    await user.click(screen.getByRole('button', { name: 'Надходження 1' }));
    expect(await screen.findByText('Продажі')).toBeVisible();

    await user.click(screen.getByRole('tab', { name: /Домашня бухгалтерія/ }));
    await user.click(screen.getByRole('button', { name: 'Витрати 1' }));
    expect(await screen.findByText('Побутові витрати')).toBeVisible();
  });

  it('adds a subcategory from the root panel', async () => {
    const user = userEvent.setup();
    const writes = stubApi();
    openPage();

    await openMenu(/Оренда/, 'Переглянути');
    await user.click(screen.getByRole('button', { name: 'Додати підкатегорію' }));
    const panel = screen.getByRole('dialog', { name: 'Нова категорія' });
    await user.type(within(panel).getByRole('textbox', { name: 'Назва' }), 'Склад');
    await user.click(within(panel).getByRole('button', { name: 'Зберегти' }));

    await waitFor(() => expect(writes).toHaveLength(1));
    expect(writes[0]).toEqual({
      method: 'POST',
      path: '/api/accounting/categories',
      body: {
        name: 'Склад',
        direction: 'Expense',
        scope: 'Current',
        parentId: 'rent',
        note: null,
        sortOrder: 10,
      },
    });
  });

  it('warns that a root is deleted with its subcategories', async () => {
    const user = userEvent.setup();
    const writes = stubApi();
    openPage();

    await openMenu(/Матеріали/, 'Видалити');
    expect(
      screen.getByText(/«Матеріали» буде видалено разом із підкатегоріями: 1\./),
    ).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Видалити' }));

    await waitFor(() => expect(writes).toHaveLength(1));
    expect(writes[0]).toMatchObject({
      method: 'DELETE',
      path: '/api/accounting/categories/materials?version=1',
    });
  });
});

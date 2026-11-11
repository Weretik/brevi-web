import { cleanup, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MaterialsPage } from './materials-page';
import { render } from '../../test-utils';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const colors = [
  { id: 1, name: 'Чорний', isActive: true, sortOrder: 1 },
  { id: 18, name: 'Темно-синій кол.1076', isActive: false, sortOrder: 18 },
];

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/references/materials?tab=colors']}>
      <MaterialsPage />
    </MemoryRouter>,
  );
}

function stubApi(write?: (path: string, init: RequestInit) => unknown) {
  const fetcher = vi.fn().mockImplementation(async (path: string, init?: RequestInit) => {
    if (init?.method && init.method !== 'GET' && write) return write(path, init);
    return { ok: true, json: async () => colors };
  });
  vi.stubGlobal('fetch', fetcher);
  return fetcher;
}

describe('materials page: colours tab', () => {
  it('lists colours in order with their status', async () => {
    stubApi();
    renderPage();
    const row = await screen.findByRole('row', { name: /Темно-синій кол\.1076/ });
    expect(within(row).getByText('Вимкнений')).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Кольори' })).toHaveAttribute('aria-selected', 'true');
  });

  it('creates a colour at the end of the list and blocks a duplicate', async () => {
    const user = userEvent.setup();
    const bodies: unknown[] = [];
    stubApi((_path, init) => {
      bodies.push(JSON.parse(String(init.body)));
      return { ok: true, json: async () => 62 };
    });
    renderPage();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Додати колір' })).toBeEnabled());
    await user.click(screen.getByRole('button', { name: 'Додати колір' }));
    await user.type(screen.getByRole('textbox', { name: 'Назва кольору' }), 'чорний');
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText('Такий колір уже є в довіднику.')).toBeVisible();
    expect(bodies).toEqual([]);

    await user.clear(screen.getByRole('textbox', { name: 'Назва кольору' }));
    await user.type(screen.getByRole('textbox', { name: 'Назва кольору' }), ' Вафля ');
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));
    await waitFor(() => expect(bodies).toEqual([{ name: 'Вафля', isActive: true, sortOrder: 19 }]));
  });
});

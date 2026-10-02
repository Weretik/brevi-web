import { cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils';
import { GarmentAccessoriesPage } from '../garment-accessories/garment-accessories-page';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function openFabrics() {
  render(
    <MemoryRouter initialEntries={['/references/garment-accessory']}>
      <GarmentAccessoriesPage />
    </MemoryRouter>,
  );
  await userEvent.setup().click(screen.getByRole('tab', { name: 'Тканини' }));
}

describe('fabrics tab', () => {
  it('waits for a verified list before offering an automatically assigned ID', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (path: string) => {
        if (path.endsWith('/fabrics')) return new Promise(() => undefined);
        return { ok: true, json: async () => [] };
      }),
    );
    await openFabrics();
    expect(screen.getByRole('button', { name: 'Створити' })).toBeDisabled();
  });

  it('shows fabrics on the existing page and retries a failed read', async () => {
    let fabricReads = 0;
    const fetcher = vi.fn().mockImplementation(async (path: string) => {
      if (path.endsWith('/fabrics') && fabricReads++ === 0) throw new TypeError('network');
      return {
        ok: true,
        json: async () => [{ id: 4, name: 'Льон', providerName: 'Атлас', price: 25 }],
      };
    });
    vi.stubGlobal('fetch', fetcher);
    await openFabrics();
    expect(await screen.findByText('Не вдалося виконати запит. Спробуйте ще раз.')).toBeVisible();
    await userEvent.setup().click(screen.getByRole('button', { name: 'Повторити' }));
    expect(await screen.findByText('Льон')).toBeVisible();
    expect(fetcher).toHaveBeenCalledWith('/api/reference/fabrics', expect.anything());
  });

  it('keeps form input after validation failure', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (path: string, init?: RequestInit) => {
        if (init?.method === 'POST')
          return {
            ok: false,
            status: 400,
            json: async () => [{ identifier: 'Request.Name', errorMessage: 'Назва вже існує.' }],
          };
        if (path.endsWith('/suppliers'))
          return {
            ok: true,
            json: async () => [
              {
                id: 2,
                name: 'Атлас',
                link: null,
                contactPerson: null,
                phoneNumber: null,
                notes: null,
              },
            ],
          };
        return { ok: true, json: async () => [] };
      }),
    );
    await openFabrics();
    await user.click(screen.getByRole('button', { name: 'Створити' }));
    await user.type(screen.getByRole('textbox', { name: 'Назва' }), 'Льон');
    await user.click(screen.getByRole('combobox', { name: 'Постачальник' }));
    await user.click(await screen.findByRole('option', { name: 'Атлас' }));
    await user.type(screen.getByRole('spinbutton', { name: 'Ціна' }), '25');
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText('Назва вже існує.')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Назва' })).toHaveValue('Льон');
  });

  it('opens a fabric for viewing, edits it, and refreshes the list', async () => {
    const user = userEvent.setup();
    let name = 'Льон';
    const fetcher = vi.fn().mockImplementation(async (path: string, init?: RequestInit) => {
      if (init?.method === 'PUT') {
        name = 'Новий льон';
        return { ok: true };
      }
      if (path.endsWith('/suppliers'))
        return {
          ok: true,
          json: async () => [
            {
              id: 2,
              name: 'Атлас',
              link: null,
              contactPerson: null,
              phoneNumber: null,
              notes: null,
            },
          ],
        };
      return { ok: true, json: async () => [{ id: 4, name, providerName: 'Атлас', price: 25 }] };
    });
    vi.stubGlobal('fetch', fetcher);
    await openFabrics();
    await screen.findByText('Льон');
    fireEvent.contextMenu(screen.getByRole('row', { name: /4.*Льон/ }), {
      clientX: 80,
      clientY: 120,
    });
    await user.click(screen.getByRole('menuitem', { name: 'Перегляд' }));
    const drawer = screen.getByRole('dialog', { name: 'Перегляд тканини' });
    expect(drawer).toBeVisible();
    expect(within(drawer).getByText('Льон', { selector: 'p' })).toBeVisible();
    await user.click(within(drawer).getByRole('button', { name: 'Редагувати' }));
    expect(screen.getByRole('dialog', { name: 'Редагування тканини' })).toBeVisible();
    await user.clear(screen.getByRole('textbox', { name: 'Назва' }));
    await user.type(screen.getByRole('textbox', { name: 'Назва' }), 'Новий льон');
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText('Новий льон')).toBeVisible();
    expect(fetcher).toHaveBeenCalledWith(
      '/api/reference/fabrics/4',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('deletes selected rows only after confirmation and retains failed selection', async () => {
    const user = userEvent.setup();
    const fetcher = vi.fn().mockImplementation(async (path: string, init?: RequestInit) => {
      if (init?.method === 'DELETE') return { ok: !path.endsWith('/5'), status: 409 };
      return {
        ok: true,
        json: async () => [
          { id: 4, name: 'Льон', providerName: 'Атлас', price: 25 },
          { id: 5, name: 'Бавовна', providerName: 'Атлас', price: 20 },
        ],
      };
    });
    vi.stubGlobal('fetch', fetcher);
    await openFabrics();
    await screen.findByText('Бавовна');
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]!);
    await user.click(checkboxes[2]!);
    await user.click(screen.getByRole('button', { name: 'Видалити вибрані (2)' }));
    expect(fetcher.mock.calls.filter(([, init]) => init?.method === 'DELETE')).toHaveLength(0);
    await user.click(
      screen.getByRole('dialog').querySelector('button:last-child') as HTMLButtonElement,
    );
    expect(await screen.findByText(/Не вдалося видалити ID: 5/)).toBeVisible();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Видалити вибрані (1)' })).toBeVisible(),
    );
  });

  it('opens the row menu from the keyboard and restores focus after Escape', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (path: string) => ({
        ok: true,
        json: async () =>
          path.endsWith('/fabrics')
            ? [{ id: 4, name: 'Льон', providerName: 'Атлас', price: 25 }]
            : [],
      })),
    );
    await openFabrics();
    const nameCell = await screen.findByRole('gridcell', { name: 'Льон' });
    nameCell.focus();

    fireEvent.keyDown(nameCell, { key: 'F10', shiftKey: true });
    expect(screen.getByRole('menuitem', { name: 'Перегляд' })).toBeVisible();
    await user.keyboard('{Escape}');

    await waitFor(() => expect(nameCell).toHaveFocus());
  });
});

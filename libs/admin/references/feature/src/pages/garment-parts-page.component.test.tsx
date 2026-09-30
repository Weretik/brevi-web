import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GarmentPartsPage } from './garment-parts-page';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('garment parts page', () => {
  async function openElements() {
    render(<GarmentPartsPage />);
    await userEvent.setup().click(screen.getByRole('tab', { name: 'Елементи' }));
  }

  it('shows verified rows in the Elements tab', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => [{ id: 1, name: 'Рукав' }] }),
    );
    await openElements();
    expect(await screen.findByText('Рукав')).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Елементи' })).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Роботи' })).toBeVisible();
  });

  it('keeps the form and entered name after a validation error', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (_path: string, init?: RequestInit) =>
        init?.method === 'POST'
          ? {
              ok: false,
              status: 400,
              json: async () => [{ identifier: 'Request.Name', errorMessage: 'Назва вже існує.' }],
            }
          : { ok: true, json: async () => [] },
      ),
    );
    await openElements();
    await user.click(screen.getByRole('button', { name: 'Створити' }));
    await user.type(screen.getByRole('textbox', { name: 'Назва' }), 'Рукав');
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText('Назва вже існує.')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Назва' })).toHaveValue('Рукав');
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('opens view mode, edits the row, and refreshes the list', async () => {
    const user = userEvent.setup();
    let name = 'Рукав';
    const fetcher = vi.fn().mockImplementation(async (_path: string, init?: RequestInit) => {
      if (init?.method === 'PUT') {
        name = 'Новий рукав';
        return { ok: true };
      }
      return { ok: true, json: async () => [{ id: 1, name }] };
    });
    vi.stubGlobal('fetch', fetcher);
    await openElements();
    await screen.findByText('Рукав');
    await user.click(screen.getByRole('button', { name: 'Перегляд' }));
    expect(screen.getByRole('dialog', { name: 'Перегляд елемента виробу' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Назва' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Редагувати' }));
    await user.clear(screen.getByRole('textbox', { name: 'Назва' }));
    await user.type(screen.getByRole('textbox', { name: 'Назва' }), 'Новий рукав');
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText('Новий рукав')).toBeVisible();
    expect(fetcher).toHaveBeenCalledWith(
      '/api/reference/garment-parts/1',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('offers retry after a failed read', async () => {
    const user = userEvent.setup();
    let allowRead = false;
    const fetcher = vi.fn().mockImplementation(async (path: string) => {
      if (path.endsWith('/garment-parts') && !allowRead) throw new TypeError('network');
      return { ok: true, json: async () => [] };
    });
    vi.stubGlobal('fetch', fetcher);
    await openElements();
    expect(await screen.findByText('Не вдалося виконати запит. Спробуйте ще раз.')).toBeVisible();
    allowRead = true;
    await user.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(await screen.findByText('Елементів виробу поки немає')).toBeVisible();
  });

  it('confirms selected rows and preserves failed selection', async () => {
    const user = userEvent.setup();
    const fetcher = vi.fn().mockImplementation(async (path: string, init?: RequestInit) =>
      init?.method === 'DELETE'
        ? { ok: !path.endsWith('/2'), status: 404 }
        : {
            ok: true,
            json: async () => [
              { id: 1, name: 'Рукав' },
              { id: 2, name: 'Комір' },
            ],
          },
    );
    vi.stubGlobal('fetch', fetcher);
    await openElements();
    await screen.findByText('Комір');
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]!);
    await user.click(checkboxes[2]!);
    await user.click(screen.getByRole('button', { name: 'Видалити вибрані (2)' }));
    expect(fetcher.mock.calls.filter(([, init]) => init?.method === 'DELETE')).toHaveLength(0);
    await user.click(
      screen.getByRole('dialog').querySelector('button:last-child') as HTMLButtonElement,
    );
    expect(await screen.findByText(/Не вдалося видалити ID: 2/)).toBeVisible();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Видалити вибрані (1)' })).toBeVisible(),
    );
  });
});

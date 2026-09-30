import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GarmentPartsPage } from './garment-parts-page';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('garment part operations tab', () => {
  it('shows verified rows and the shared tabs', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockImplementation(async (path: string) => ({
          ok: true,
          json: async () =>
            path.endsWith('/garment-parts')
              ? [{ id: 1, name: 'Рукав' }]
              : [{ id: 2, garmentPartName: 'Рукав', name: 'Шов', min: 1.5 }],
        })),
    );
    render(<GarmentPartsPage />);
    expect(await screen.findByText('Шов')).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Роботи' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Елементи' })).toBeVisible();
  });

  it('keeps entered values and shows field errors after failed creation', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockImplementation(async (path: string, init?: RequestInit) =>
          init?.method === 'POST'
            ? {
                ok: false,
                status: 400,
                json: async () => [
                  { identifier: 'Request.Name', errorMessage: 'Назва вже існує.' },
                ],
              }
            : {
                ok: true,
                json: async () =>
                  path.endsWith('/garment-parts') ? [{ id: 1, name: 'Рукав' }] : [],
              },
        ),
    );
    render(<GarmentPartsPage />);
    await user.click(await screen.findByRole('button', { name: 'Створити' }));
    await user.type(screen.getByRole('textbox', { name: 'Назва' }), 'Шов');
    await user.click(screen.getByRole('combobox', { name: 'Елемент' }));
    await user.click(screen.getByRole('option', { name: 'Рукав' }));
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText('Назва вже існує.')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Назва' })).toHaveValue('Шов');
    expect(screen.getByRole('dialog', { name: 'Нова робота' })).toBeVisible();
  });

  it('retries a failed list request', async () => {
    const user = userEvent.setup();
    let operationReads = 0;
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (path: string) => {
        if (path.endsWith('/garment-part-operations') && ++operationReads === 1)
          throw new TypeError('network');
        return {
          ok: true,
          json: async () =>
            path.endsWith('/garment-parts')
              ? []
              : [{ id: 4, garmentPartName: 'Рукав', name: 'Шов', min: 1 }],
        };
      }),
    );
    render(<GarmentPartsPage />);
    expect(await screen.findByText('Не вдалося виконати запит. Спробуйте ще раз.')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(await screen.findByText('Шов')).toBeVisible();
  });

  it('edits a viewed row and refreshes the list', async () => {
    const user = userEvent.setup();
    let operationName = 'Шов';
    const fetcher = vi.fn().mockImplementation(async (path: string, init?: RequestInit) => {
      if (init?.method === 'PUT') {
        operationName = 'Новий шов';
        return { ok: true };
      }
      return {
        ok: true,
        json: async () =>
          path.endsWith('/garment-parts')
            ? [{ id: 1, name: 'Рукав' }]
            : [{ id: 2, garmentPartName: 'Рукав', name: operationName, min: 1 }],
      };
    });
    vi.stubGlobal('fetch', fetcher);
    render(<GarmentPartsPage />);
    await screen.findByText('Шов');
    await user.click(screen.getByRole('button', { name: 'Перегляд' }));
    expect(screen.getByRole('dialog', { name: 'Перегляд роботи' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Редагувати' }));
    await user.clear(screen.getByRole('textbox', { name: 'Назва' }));
    await user.type(screen.getByRole('textbox', { name: 'Назва' }), 'Новий шов');
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText('Новий шов')).toBeVisible();
    expect(fetcher).toHaveBeenCalledWith(
      '/api/reference/garment-part-operations/2',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('confirms only selected deletion and retains failed IDs', async () => {
    const user = userEvent.setup();
    const fetcher = vi.fn().mockImplementation(async (path: string, init?: RequestInit) =>
      init?.method === 'DELETE'
        ? { ok: !path.endsWith('/3'), status: 404 }
        : {
            ok: true,
            json: async () =>
              path.endsWith('/garment-parts')
                ? [{ id: 1, name: 'Рукав' }]
                : [
                    { id: 2, garmentPartName: 'Рукав', name: 'Шов', min: 1 },
                    { id: 3, garmentPartName: 'Рукав', name: 'Край', min: 2 },
                  ],
          },
    );
    vi.stubGlobal('fetch', fetcher);
    render(<GarmentPartsPage />);
    await screen.findByText('Край');
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]!);
    await user.click(checkboxes[2]!);
    await user.click(screen.getByRole('button', { name: 'Видалити вибрані (2)' }));
    expect(fetcher.mock.calls.filter(([, init]) => init?.method === 'DELETE')).toHaveLength(0);
    await user.click(
      screen.getByRole('dialog').querySelector('button:last-child') as HTMLButtonElement,
    );
    expect(await screen.findByText(/Не вдалося видалити ID: 3/)).toBeVisible();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Видалити вибрані/ })).toHaveTextContent(
        'Видалити вибрані (1)',
      ),
    );
  });
});

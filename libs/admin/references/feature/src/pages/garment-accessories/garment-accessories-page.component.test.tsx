import { cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GarmentAccessoriesPage } from './garment-accessories-page';
import { render } from '../../test-utils';
import { accessoryRow, supplierRow } from '../../testing/reference-fixtures';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/references/garment-accessory']}>
      <GarmentAccessoriesPage />
    </MemoryRouter>,
  );
}

function stubApi(rows: () => unknown[], write?: (path: string, init: RequestInit) => unknown) {
  const fetcher = vi.fn().mockImplementation(async (path: string, init?: RequestInit) => {
    if (init?.method && init.method !== 'GET' && write) return write(path, init);
    if (path.endsWith('/suppliers')) return { ok: true, json: async () => [supplierRow()] };
    return { ok: true, json: async () => rows() };
  });
  vi.stubGlobal('fetch', fetcher);
  return fetcher;
}

describe('garment accessories page', () => {
  it('shows code, unit, price date and status of the verified rows', async () => {
    stubApi(() => [
      accessoryRow(),
      accessoryRow({ id: 9, code: 'FUR-026', name: 'Фліс', unit: 'м', comment: 'ціна за 1 кг' }),
    ]);
    renderPage();
    const row = await screen.findByRole('row', { name: /FUR-026/ });
    expect(within(row).getByText('Фліс')).toBeVisible();
    expect(within(row).getByText('м')).toBeVisible();
    expect(within(row).getByText('ціна за 1 кг')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Фурнітура' })).toBeVisible();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  });

  it('creates an accessory with unit and keeps a field error when creation fails', async () => {
    const user = userEvent.setup();
    const bodies: unknown[] = [];
    stubApi(
      () => [],
      (_path, init) => {
        bodies.push(JSON.parse(String(init.body)));
        return {
          ok: false,
          status: 400,
          json: async () => [{ identifier: 'Request.Name', errorMessage: 'Назва вже існує.' }],
        };
      },
    );
    renderPage();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Додати фурнітуру' })).toBeEnabled(),
    );
    await user.click(screen.getByRole('button', { name: 'Додати фурнітуру' }));
    await user.type(screen.getByRole('textbox', { name: 'Код' }), 'FUR-044');
    await user.type(screen.getByRole('textbox', { name: 'Назва' }), 'Стрічка');
    await user.click(screen.getByRole('combobox', { name: 'Постачальник' }));
    await user.click(await screen.findByRole('option', { name: 'Атлас' }));
    await user.type(screen.getByRole('spinbutton', { name: 'Ціна, грн' }), '4.5');
    await user.click(screen.getByRole('combobox', { name: 'Одиниця' }));
    await user.click(await screen.findByRole('option', { name: 'м' }));
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(await screen.findByText('Назва вже існує.')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Назва' })).toHaveValue('Стрічка');
    expect(bodies[0]).toMatchObject({
      id: 1,
      code: 'FUR-044',
      name: 'Стрічка',
      supplierName: 'Атлас',
      price: 4.5,
      unit: 'м',
      isActive: true,
      comment: null,
    });
  });

  it('opens view mode, edits the row, and refreshes after saving', async () => {
    const user = userEvent.setup();
    let name = 'Ґудзики';
    const fetcher = stubApi(
      () => [accessoryRow({ name })],
      () => {
        name = 'Ґудзики великі';
        return { ok: true };
      },
    );
    renderPage();
    fireEvent.contextMenu(await screen.findByRole('row', { name: /FUR-003/ }), {
      clientX: 80,
      clientY: 120,
    });
    await user.click(screen.getByRole('menuitem', { name: 'Переглянути' }));
    const drawer = screen.getByRole('dialog', { name: 'Перегляд фурнітури' });
    expect(within(drawer).getByText('шт.')).toBeVisible();
    await user.click(within(drawer).getByRole('button', { name: 'Редагувати' }));
    const field = screen.getByRole('textbox', { name: 'Назва' });
    await user.clear(field);
    await user.type(field, 'Ґудзики великі');
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText('Ґудзики великі')).toBeVisible();
    expect(fetcher).toHaveBeenCalledWith(
      '/api/reference/garment-accessories/3',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('offers a retry when loading the list fails', async () => {
    let reads = 0;
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async () => {
        if (reads++ === 0) throw new TypeError('network');
        return { ok: true, json: async () => [accessoryRow()] };
      }),
    );
    renderPage();
    await userEvent.setup().click(await screen.findByRole('button', { name: 'Повторити' }));
    expect(await screen.findByText('Ґудзики')).toBeVisible();
  });

  it('requires confirmation and preserves failed selection in a bulk delete', async () => {
    const user = userEvent.setup();
    stubApi(
      () => [accessoryRow(), accessoryRow({ id: 5, code: 'FUR-005', name: 'Кнопки' })],
      (path) => ({ ok: !path.endsWith('/5'), status: 409 }),
    );
    renderPage();
    await screen.findByText('Кнопки');
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]!);
    await user.click(checkboxes[2]!);
    await user.click(screen.getByRole('button', { name: 'Видалити вибрані (2)' }));
    await user.click(
      screen.getByRole('dialog').querySelector('button:last-child') as HTMLButtonElement,
    );
    expect(await screen.findByText(/Не вдалося видалити ID: 5/)).toBeVisible();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Видалити вибрані (1)' })).toBeVisible(),
    );
  });
});

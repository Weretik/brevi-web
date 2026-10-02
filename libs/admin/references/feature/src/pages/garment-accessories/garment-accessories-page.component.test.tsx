import { cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GarmentAccessoriesPage } from './garment-accessories-page';
import { render } from '../../test-utils';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function LocationProbe() {
  const location = useLocation();
  return <output aria-label="Поточна адреса">{`${location.pathname}${location.search}`}</output>;
}

function renderPage(initialEntry = '/references/garment-accessory') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <GarmentAccessoriesPage />
      <LocationProbe />
    </MemoryRouter>,
  );
}

describe('garment accessories page', () => {
  it('shows the verified rows and both tabs', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ id: 7, name: 'Блискавка', supplierName: 'Атлас', price: 12.5 }],
      }),
    );
    renderPage();
    expect(await screen.findByText('Блискавка')).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Фурнітура виробу' })).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Тканини' })).toBeVisible();
  });

  it('keeps entered values and a field error when creation fails', async () => {
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
    renderPage();
    await user.click(screen.getByRole('button', { name: 'Створити' }));
    expect(screen.getByRole('dialog', { name: 'Нова фурнітура' })).toBeVisible();
    expect(screen.getByLabelText('Поточна адреса')).toHaveTextContent(
      '/references/garment-accessory',
    );
    await user.type(screen.getByRole('textbox', { name: 'Назва' }), 'Блискавка');
    await user.click(screen.getByRole('combobox', { name: 'Постачальник' }));
    await user.click(await screen.findByRole('option', { name: 'Атлас' }));
    await user.type(screen.getByRole('spinbutton', { name: 'Ціна' }), '12');
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText('Назва вже існує.')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Назва' })).toHaveValue('Блискавка');
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('opens view mode, edits the row, and refreshes after saving', async () => {
    const user = userEvent.setup();
    let name = 'Блискавка';
    const fetchMock = vi.fn().mockImplementation(async (path: string, init?: RequestInit) => {
      if (init?.method === 'PUT') {
        name = 'Нова блискавка';
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
      return { ok: true, json: async () => [{ id: 1, name, supplierName: 'Атлас', price: 12 }] };
    });
    vi.stubGlobal('fetch', fetchMock);
    renderPage();
    await screen.findByText('Блискавка');
    fireEvent.contextMenu(screen.getByRole('row', { name: /1.*Блискавка/ }), {
      clientX: 80,
      clientY: 120,
    });
    await user.click(screen.getByRole('menuitem', { name: 'Перегляд' }));
    const drawer = screen.getByRole('dialog', { name: 'Перегляд фурнітури' });
    expect(drawer).toBeVisible();
    expect(within(drawer).getByText('Блискавка', { selector: 'p' })).toBeVisible();
    await user.click(within(drawer).getByRole('button', { name: 'Редагувати' }));
    expect(screen.getByRole('dialog', { name: 'Редагування фурнітури' })).toBeVisible();
    await user.clear(screen.getByRole('textbox', { name: 'Назва' }));
    await user.type(screen.getByRole('textbox', { name: 'Назва' }), 'Нова блискавка');
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText('Нова блискавка')).toBeVisible();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/reference/garment-accessories/1',
      expect.objectContaining({ method: 'PUT' }),
    );
  }, 15000);

  it('offers a retry when loading the list fails', async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('network'))
      .mockResolvedValue({ ok: true, json: async () => [] });
    vi.stubGlobal('fetch', fetchMock);
    renderPage();
    expect(await screen.findByText('Не вдалося виконати запит. Спробуйте ще раз.')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(await screen.findByText('Фурнітури поки немає')).toBeVisible();
  });

  it('requires confirmation and preserves failed selection in a bulk delete', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockImplementation(async (path: string, init?: RequestInit) => {
      if (init?.method === 'DELETE') return { ok: !path.endsWith('/2'), status: 404 };
      return {
        ok: true,
        json: async () => [
          { id: 1, name: 'Блискавка', supplierName: 'Атлас', price: 12 },
          { id: 2, name: 'Ґудзик', supplierName: 'Атлас', price: 2 },
        ],
      };
    });
    vi.stubGlobal('fetch', fetchMock);
    renderPage();
    await screen.findByText('Ґудзик');
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]!);
    await user.click(checkboxes[2]!);
    await user.click(screen.getByRole('button', { name: 'Видалити вибрані (2)' }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Видалити 2 вибраних записів?')).toBeVisible();
    await user.click(
      screen.getByRole('dialog').querySelector('button:last-child') as HTMLButtonElement,
    );
    expect(await screen.findByText(/Не вдалося видалити ID: 2/)).toBeVisible();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Видалити вибрані (1)' })).toBeVisible();
  });

  it('keeps the selected row while opening its MUI context menu', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ id: 7, name: 'Блискавка', supplierName: 'Атлас', price: 12.5 }],
      }),
    );
    renderPage();
    const row = await screen.findByRole('row', { name: /7.*Блискавка/ });
    const rowCheckbox = row.querySelector('input[type="checkbox"]') as HTMLInputElement;

    expect(screen.queryByRole('columnheader', { name: 'Дії' })).not.toBeInTheDocument();
    await user.click(rowCheckbox);
    fireEvent.contextMenu(row, { clientX: 80, clientY: 120 });

    expect(rowCheckbox).toBeChecked();
    expect(screen.getByRole('menuitem', { name: 'Перегляд' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Змінити' })).toBeVisible();
    await user.click(screen.getByRole('menuitem', { name: 'Видалити' }));
    expect(screen.getByRole('dialog', { name: 'Підтвердження видалення' })).toHaveTextContent(
      'Видалити 1 вибраних записів?',
    );
    expect(rowCheckbox).toBeChecked();
  });

  it('restores the active tab from the URL and writes tab changes back to it', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
    renderPage('/references/garment-accessory?tab=fabrics');

    expect(screen.getByRole('tab', { name: 'Тканини' })).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('tab', { name: 'Фурнітура виробу' }));

    expect(screen.getByLabelText('Поточна адреса')).toHaveTextContent(
      '/references/garment-accessory?tab=accessories',
    );
  });
});

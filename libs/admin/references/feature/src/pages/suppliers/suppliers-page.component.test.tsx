import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SuppliersPage } from './suppliers-page';
import { render } from '../../test-utils';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('suppliers page', () => {
  it('opens row actions with the mouse without an action column or selection change', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: 1,
            name: 'Атлас',
            link: null,
            contactPerson: null,
            phoneNumber: null,
            notes: null,
          },
        ],
      }),
    );
    render(<SuppliersPage />);
    const row = await screen.findByRole('row', { name: /1.*Атлас/ });
    const rowCheckbox = row.querySelector('input[type="checkbox"]') as HTMLInputElement;

    expect(screen.queryByRole('columnheader', { name: 'Дії' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Перегляд' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /створити/i })).toBeVisible();
    await user.click(rowCheckbox);
    fireEvent.contextMenu(row, { clientX: 80, clientY: 120 });

    expect(rowCheckbox).toBeChecked();
    expect(screen.getByRole('menu', { name: 'Дії: Атлас' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Перегляд' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Змінити' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Видалити' })).toBeVisible();
  });

  it('opens the same row menu from the keyboard and restores focus after Escape', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: 1,
            name: 'Атлас',
            link: null,
            contactPerson: null,
            phoneNumber: null,
            notes: null,
          },
        ],
      }),
    );
    render(<SuppliersPage />);
    await screen.findByRole('row', { name: /1.*Атлас/ });
    const nameCell = screen.getByRole('gridcell', { name: 'Атлас' });
    nameCell.focus();

    fireEvent.keyDown(nameCell, { key: 'F10', shiftKey: true });
    expect(screen.getByRole('menuitem', { name: 'Перегляд' })).toBeVisible();
    await user.keyboard('{Escape}');

    await waitFor(() => expect(nameCell).toHaveFocus());
  });

  it('keeps the supplier link available in view mode', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            id: 1,
            name: 'Атлас',
            link: 'supplier.example.com',
            contactPerson: null,
            phoneNumber: null,
            notes: null,
          },
        ],
      }),
    );
    render(<SuppliersPage />);
    const row = await screen.findByRole('row', { name: /1.*Атлас/ });
    fireEvent.contextMenu(row, { clientX: 80, clientY: 120 });
    await user.click(screen.getByRole('menuitem', { name: 'Перегляд' }));
    expect(screen.getByRole('link', { name: 'supplier.example.com' })).toHaveAttribute(
      'href',
      'https://supplier.example.com/',
    );
  });

  it('keeps entered values and field errors when creation fails', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockImplementation(async (_path: string, init?: RequestInit) =>
      init?.method === 'POST'
        ? {
            ok: false,
            status: 400,
            json: async () => [{ identifier: 'Request.Name', errorMessage: 'Назва вже існує.' }],
          }
        : { ok: true, json: async () => [] },
    );
    vi.stubGlobal('fetch', fetchMock);
    render(<SuppliersPage />);
    await user.click(screen.getByRole('button', { name: 'Створити' }));
    await user.type(screen.getByRole('textbox', { name: 'Назва' }), 'Атлас');
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText('Назва вже існує.')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Назва' })).toHaveValue('Атлас');
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('submits the supplier form with Enter', async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockImplementation(async (_path: string, init?: RequestInit) =>
        init?.method === 'POST' ? { ok: true } : { ok: true, json: async () => [] },
      );
    vi.stubGlobal('fetch', fetchMock);
    render(<SuppliersPage />);
    await user.click(screen.getByRole('button', { name: 'Створити' }));
    const name = screen.getByRole('textbox', { name: 'Назва' });
    await user.type(name, 'Атлас{Enter}');
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/reference/suppliers',
        expect.objectContaining({ method: 'POST' }),
      ),
    );
  });

  it('requires confirmation before deleting a row', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockImplementation(async (_path: string, init?: RequestInit) =>
      init?.method === 'DELETE'
        ? { ok: true }
        : {
            ok: true,
            json: async () => [
              {
                id: 1,
                name: 'Атлас',
                link: null,
                contactPerson: null,
                phoneNumber: null,
                notes: null,
              },
            ],
          },
    );
    vi.stubGlobal('fetch', fetchMock);
    render(<SuppliersPage />);
    const row = await screen.findByRole('row', { name: /1.*Атлас/ });
    fireEvent.contextMenu(row, { clientX: 80, clientY: 120 });
    await user.click(screen.getByRole('menuitem', { name: 'Видалити' }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Видалити 1 вибраних записів?')).toBeVisible();
    await user.click(
      screen.getByRole('dialog').querySelector('button:last-child') as HTMLButtonElement,
    );
    expect(await screen.findByText('Вибрані записи видалено.')).toBeVisible();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/reference/suppliers/1',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('keeps failed IDs selected after a partial bulk delete', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockImplementation(async (path: string, init?: RequestInit) => {
      if (init?.method === 'DELETE') return { ok: !path.endsWith('/2'), status: 404 };
      return {
        ok: true,
        json: async () => [
          { id: 1, name: 'Атлас', link: null, contactPerson: null, phoneNumber: null, notes: null },
          {
            id: 2,
            name: 'Текстиль',
            link: null,
            contactPerson: null,
            phoneNumber: null,
            notes: null,
          },
        ],
      };
    });
    vi.stubGlobal('fetch', fetchMock);
    render(<SuppliersPage />);
    await screen.findByText('Текстиль');
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]!);
    await user.click(checkboxes[2]!);
    await user.click(screen.getByRole('button', { name: 'Видалити вибрані (2)' }));
    expect(screen.getByText('Видалити 2 вибраних записів?')).toBeVisible();
    await user.click(
      screen.getByRole('dialog').querySelector('button:last-child') as HTMLButtonElement,
    );
    expect(await screen.findByText(/Не вдалося видалити ID: 2/)).toBeVisible();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Видалити вибрані (1)' })).toBeVisible();
  });

  it('preserves another selected row when a single deletion fails', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (_path: string, init?: RequestInit) =>
        init?.method === 'DELETE'
          ? { ok: false, status: 404 }
          : {
              ok: true,
              json: async () => [
                {
                  id: 1,
                  name: 'Атлас',
                  link: null,
                  contactPerson: null,
                  phoneNumber: null,
                  notes: null,
                },
                {
                  id: 2,
                  name: 'Текстиль',
                  link: null,
                  contactPerson: null,
                  phoneNumber: null,
                  notes: null,
                },
              ],
            },
      ),
    );
    render(<SuppliersPage />);
    const firstRow = await screen.findByRole('row', { name: /1.*Атлас/ });
    const secondRow = screen.getByRole('row', { name: /2.*Текстиль/ });
    await user.click(secondRow.querySelector('input[type="checkbox"]')!);
    fireEvent.contextMenu(firstRow, { clientX: 80, clientY: 120 });
    await user.click(screen.getByRole('menuitem', { name: 'Видалити' }));
    await user.click(
      screen.getByRole('dialog').querySelector('button:last-child') as HTMLButtonElement,
    );
    await screen.findByText(/Не вдалося видалити ID: 1/);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Видалити вибрані (2)' })).toBeVisible();
  });
});

import { cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SuppliersPage } from './suppliers-page';
import { render } from '../../test-utils';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('suppliers page', () => {
  it('keeps context actions available without changing row selection', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          {
            email: null,
            purchaseCategories: null,
            tags: null,
            isActive: true,
            keepinCrmId: null,
            keepinSyncedAt: null,
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

    expect(screen.getByRole('columnheader', { name: 'Дії' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Дії: Атлас' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Додати постачальника' })).toBeVisible();
    await user.click(rowCheckbox);
    fireEvent.contextMenu(row, { clientX: 80, clientY: 120 });

    expect(rowCheckbox).toBeChecked();
    expect(screen.getByRole('menu', { name: 'Дії: Атлас' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Переглянути' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Редагувати' })).toBeVisible();
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
            email: null,
            purchaseCategories: null,
            tags: null,
            isActive: true,
            keepinCrmId: null,
            keepinSyncedAt: null,
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
    expect(screen.getByRole('menuitem', { name: 'Переглянути' })).toBeVisible();
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
            email: null,
            purchaseCategories: null,
            tags: null,
            isActive: true,
            keepinCrmId: null,
            keepinSyncedAt: null,
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
    await user.click(screen.getByRole('menuitem', { name: 'Переглянути' }));
    expect(
      within(screen.getByRole('dialog')).getByRole('link', { name: 'supplier.example.com' }),
    ).toHaveAttribute('href', 'https://supplier.example.com/');
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
    await user.click(screen.getByRole('button', { name: 'Додати постачальника' }));
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
    await user.click(screen.getByRole('button', { name: 'Додати постачальника' }));
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
                email: null,
                purchaseCategories: null,
                tags: null,
                isActive: true,
                keepinCrmId: null,
                keepinSyncedAt: null,
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
          {
            email: null,
            purchaseCategories: null,
            tags: null,
            isActive: true,
            keepinCrmId: null,
            keepinSyncedAt: null,
            id: 1,
            name: 'Атлас',
            link: null,
            contactPerson: null,
            phoneNumber: null,
            notes: null,
          },
          {
            email: null,
            purchaseCategories: null,
            tags: null,
            isActive: true,
            keepinCrmId: null,
            keepinSyncedAt: null,
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
                  email: null,
                  purchaseCategories: null,
                  tags: null,
                  isActive: true,
                  keepinCrmId: null,
                  keepinSyncedAt: null,
                  id: 1,
                  name: 'Атлас',
                  link: null,
                  contactPerson: null,
                  phoneNumber: null,
                  notes: null,
                },
                {
                  email: null,
                  purchaseCategories: null,
                  tags: null,
                  isActive: true,
                  keepinCrmId: null,
                  keepinSyncedAt: null,
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

const searchableSuppliers = [
  {
    email: null,
    purchaseCategories: null,
    tags: null,
    isActive: true,
    keepinCrmId: null,
    keepinSyncedAt: null,
    id: 1,
    name: 'Атлас',
    contactPerson: 'Олена Коваль',
    phoneNumber: '+380 50 111 22 33',
    link: null,
    notes: 'Нотатка лише для перевірки',
  },
  {
    email: null,
    purchaseCategories: null,
    tags: null,
    isActive: true,
    keepinCrmId: null,
    keepinSyncedAt: null,
    id: 2,
    name: 'Текстиль',
    contactPerson: 'Андрій Бондар',
    phoneNumber: '+380 67 444 55 66',
    link: null,
    notes: null,
  },
];

function stubSupplierList() {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => searchableSuppliers });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('suppliers workshop page', () => {
  it('edits a viewed supplier through the feature editor and closes after saving', async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockImplementation(async (_path: string, init?: RequestInit) =>
        init?.method === 'PUT' ? { ok: true } : { ok: true, json: async () => searchableSuppliers },
      );
    vi.stubGlobal('fetch', fetchMock);
    render(<SuppliersPage />);
    await user.click(await screen.findByRole('button', { name: 'Дії: Атлас' }));
    await user.click(screen.getByRole('menuitem', { name: 'Переглянути' }));
    expect(screen.getByRole('textbox', { name: 'Назва' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Редагувати' }));
    const name = screen.getByRole('textbox', { name: 'Назва' });
    expect(name).toBeEnabled();
    await user.clear(name);
    await user.type(name, 'Атлас оновлений');
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText('Постачальника збережено.')).toBeVisible();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/reference/suppliers/1',
      expect.objectContaining({ method: 'PUT' }),
    );
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it.each(['  аТлАс  ', 'КОВАЛЬ', '111 22'])(
    'finds a supplier by name, contact or phone: %s',
    async (query) => {
      const user = userEvent.setup();
      stubSupplierList();
      render(<SuppliersPage />);
      await screen.findByRole('row', { name: /2.*Текстиль/ });
      await user.type(screen.getByRole('textbox', { name: 'Пошук постачальників' }), query);
      expect(screen.getByRole('row', { name: /1.*Атлас/ })).toBeVisible();
      expect(screen.queryByRole('row', { name: /2.*Текстиль/ })).not.toBeInTheDocument();
      expect(screen.getByRole('status', { name: 'Кількість постачальників' })).toHaveTextContent(
        'Знайдено: 1 із 2',
      );
    },
  );

  it('distinguishes an empty search and restores rows when cleared', async () => {
    const user = userEvent.setup();
    stubSupplierList();
    render(<SuppliersPage />);
    await screen.findByText('Атлас');
    await user.type(screen.getByRole('textbox', { name: 'Пошук постачальників' }), 'відсутній');
    expect(await screen.findByText('Постачальників не знайдено')).toBeVisible();
    expect(screen.queryByText('Постачальників поки немає')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Очистити пошук' }));
    expect(await screen.findByText('Текстиль')).toBeVisible();
  });

  it('retains hidden selection and confirms only that supplier for deletion', async () => {
    const user = userEvent.setup();
    const fetchMock = stubSupplierList();
    render(<SuppliersPage />);
    const row = await screen.findByRole('row', { name: /1.*Атлас/ });
    await user.click(within(row).getByRole('checkbox'));
    await user.type(screen.getByRole('textbox', { name: 'Пошук постачальників' }), 'Текстиль');
    expect(screen.getByText('Вибрано: 1')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Видалити вибрані (1)' }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Видалити 1 вибраних записів?')).toBeVisible();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await user.click(within(dialog).getByRole('button', { name: 'Видалити' }));
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/reference/suppliers/1',
        expect.objectContaining({ method: 'DELETE' }),
      ),
    );
    expect(fetchMock).not.toHaveBeenCalledWith(
      '/api/reference/suppliers/2',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('opens the visible action button with the keyboard and restores focus on Escape', async () => {
    const user = userEvent.setup();
    stubSupplierList();
    render(<SuppliersPage />);
    const button = await screen.findByRole('button', { name: 'Дії: Атлас' });
    button.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('menuitem', { name: 'Редагувати' })).toBeVisible();
    expect(screen.getByText('Вибрано: 0')).toBeVisible();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(button).toHaveFocus());
  });

  it('shows an empty directory separately from an empty search', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
    render(<SuppliersPage />);
    expect(await screen.findByText('Постачальників поки немає')).toBeVisible();
    expect(screen.queryByRole('button', { name: /Видалити вибрані/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Оновити' })).not.toBeInTheDocument();
  });

  it('recovers from a list error through the retry action', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 500 })
        .mockResolvedValueOnce({ ok: true, json: async () => searchableSuppliers }),
    );
    render(<SuppliersPage />);
    expect(await screen.findByRole('alert')).toBeVisible();
    expect(screen.queryByText('Постачальників поки немає')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(await screen.findByText('Атлас')).toBeVisible();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

const keepinSuppliers = [
  {
    id: 1,
    name: 'Атлас',
    contactPerson: 'Олена',
    phoneNumber: '+380 50 111 22 33',
    link: null,
    notes: null,
    email: 'atlas@example.com',
    purchaseCategories: 'Тканини',
    tags: null,
    isActive: true,
    keepinCrmId: '323',
    keepinSyncedAt: '2026-11-02T07:00:00Z',
  },
  {
    id: 2,
    name: 'Старий постачальник',
    contactPerson: null,
    phoneNumber: null,
    link: null,
    notes: null,
    email: null,
    purchaseCategories: null,
    tags: null,
    isActive: false,
    keepinCrmId: null,
    keepinSyncedAt: null,
  },
];

describe('suppliers from KeepinCRM', () => {
  it('shows active suppliers by default and switches the activity filter', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => keepinSuppliers }),
    );
    render(<SuppliersPage />);
    expect(await screen.findByText('Атлас')).toBeVisible();
    expect(screen.queryByText('Старий постачальник')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Не використовуються 1' }));
    expect(await screen.findByText('Старий постачальник')).toBeVisible();
    expect(screen.queryByText('Атлас')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Усі 2' }));
    await user.type(screen.getByRole('textbox', { name: 'Пошук постачальників' }), 'atlas@');
    expect(screen.getByText('Атлас')).toBeVisible();
    expect(screen.queryByText('Старий постачальник')).not.toBeInTheDocument();
  });

  it('locks KeepinCRM card fields and saves only Brevi fields', async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockImplementation(async (_path: string, init?: RequestInit) =>
        init?.method === 'PUT' ? { ok: true } : { ok: true, json: async () => keepinSuppliers },
      );
    vi.stubGlobal('fetch', fetchMock);
    render(<SuppliersPage />);
    await user.click(await screen.findByRole('button', { name: 'Дії: Атлас' }));
    await user.click(screen.getByRole('menuitem', { name: 'Редагувати' }));
    expect(screen.getByRole('textbox', { name: 'Назва' })).toBeDisabled();
    await user.click(screen.getByRole('switch', { name: 'Використовувати в проєкті' }));
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText('Постачальника збережено.')).toBeVisible();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/reference/suppliers/1/brevi-fields',
      expect.objectContaining({ method: 'PUT' }),
    );
    expect(fetchMock).not.toHaveBeenCalledWith(
      '/api/reference/suppliers/1',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('runs the KeepinCRM refresh and reports the summary or the error', async () => {
    const user = userEvent.setup();
    let syncCalls = 0;
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (_path: string, init?: RequestInit) => {
        if (init?.method !== 'POST') return { ok: true, json: async () => keepinSuppliers };
        syncCalls += 1;
        return syncCalls === 1
          ? {
              ok: true,
              json: async () => ({
                received: 43,
                created: 2,
                linked: 1,
                updated: 40,
                missingInKeepinCrm: [],
                syncedAt: '2026-11-02T08:00:00Z',
              }),
            }
          : { ok: false, status: 503, json: async () => ({ errors: ['KeepinCRM недоступний.'] }) };
      }),
    );
    render(<SuppliersPage />);
    await screen.findByText('Атлас');
    await user.click(screen.getByRole('button', { name: 'Оновити з KeepinCRM' }));
    expect(await screen.findByText(/отримано 43, нових 2/)).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Оновити з KeepinCRM' }));
    await waitFor(() => expect(screen.queryByText(/отримано 43/)).not.toBeInTheDocument());
    expect(screen.getByRole('alert')).toHaveTextContent(/KeepinCRM/);
  });
});

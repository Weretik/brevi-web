import { cleanup, fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MaterialsPage } from './materials-page';
import { render } from '../../test-utils';
import { fabricRow, supplierRow } from '../../testing/reference-fixtures';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function openFabrics() {
  render(
    <MemoryRouter initialEntries={['/references/materials']}>
      <MaterialsPage />
    </MemoryRouter>,
  );
}

function stubApi(fabrics: () => unknown[], write?: (path: string, init: RequestInit) => unknown) {
  const fetcher = vi.fn().mockImplementation(async (path: string, init?: RequestInit) => {
    if (init?.method && init.method !== 'GET' && write) return write(path, init);
    if (path.endsWith('/suppliers'))
      return {
        ok: true,
        json: async () => [supplierRow(), supplierRow({ id: 3, name: 'Старий', isActive: false })],
      };
    return { ok: true, json: async () => fabrics() };
  });
  vi.stubGlobal('fetch', fetcher);
  return fetcher;
}

describe('materials page: fabrics tab', () => {
  it('waits for a verified list before offering an automatically assigned ID', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (path: string) => {
        if (path.endsWith('/fabrics')) return new Promise(() => undefined);
        return { ok: true, json: async () => [] };
      }),
    );
    openFabrics();
    expect(screen.getByRole('heading', { name: 'Тканини та фурнітура' })).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Тканини' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: 'Додати тканину' })).toBeDisabled();
  });

  it('shows sheet fields, filters by activity and search, and retries a failed read', async () => {
    const user = userEvent.setup();
    let reads = 0;
    const fetcher = vi.fn().mockImplementation(async (path: string) => {
      if (path.endsWith('/fabrics') && reads++ === 0) throw new TypeError('network');
      return {
        ok: true,
        json: async () => [
          fabricRow(),
          fabricRow({ id: 5, code: 'FAB-005', name: 'Фліс', nameRu: null, isActive: false }),
        ],
      };
    });
    vi.stubGlobal('fetch', fetcher);
    openFabrics();
    expect(await screen.findByText('Не вдалося виконати запит. Спробуйте ще раз.')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Повторити' }));

    const row = await screen.findByRole('row', { name: /FAB-004/ });
    expect(within(row).getByText('Льон')).toBeVisible();
    expect(within(row).getByText('RU: Лён')).toBeVisible();
    expect(within(row).getByText('30.08.2026')).toBeVisible();
    expect(within(row).getByText('Активна')).toBeVisible();
    expect(screen.queryByText('Фліс')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Не використовуються 1' }));
    expect(await screen.findByText('Фліс')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Усі 2' }));
    await user.type(screen.getByRole('textbox', { name: 'Пошук тканин' }), 'fab-005');
    expect(screen.getByRole('status', { name: 'Кількість тканин' })).toHaveTextContent(
      'Знайдено: 1 із 2',
    );
  });

  it('creates a fabric with sheet fields and keeps input after a validation failure', async () => {
    const user = userEvent.setup();
    const bodies: unknown[] = [];
    stubApi(
      () => [],
      (_path, init) => {
        bodies.push(JSON.parse(String(init.body)));
        return {
          ok: false,
          status: 400,
          json: async () => [{ identifier: 'Request.Code', errorMessage: 'Код уже є.' }],
        };
      },
    );
    openFabrics();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Додати тканину' })).toBeEnabled(),
    );
    await user.click(screen.getByRole('button', { name: 'Додати тканину' }));
    await user.type(screen.getByRole('textbox', { name: 'Код' }), 'FAB-087');
    await user.type(screen.getByRole('textbox', { name: 'Назва (UA)' }), 'Льон');
    await user.click(screen.getByRole('combobox', { name: 'Постачальник' }));
    expect(screen.queryByRole('option', { name: 'Старий' })).not.toBeInTheDocument();
    await user.click(await screen.findByRole('option', { name: 'Атлас' }));
    await user.type(screen.getByRole('spinbutton', { name: 'Ціна за 1 м, грн' }), '25');
    await user.type(screen.getByRole('textbox', { name: 'Склад (UA)' }), '100% льон');
    await user.type(screen.getByRole('textbox', { name: 'Щільність, г/м²' }), '180');
    await user.click(screen.getByRole('button', { name: 'Заповнити зі складу та щільності' }));
    expect(screen.getByRole('textbox', { name: 'Короткий опис для КП' })).toHaveValue(
      'Склад: 100% льон. Щільність: 180 г/м².',
    );
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(await screen.findByText('Код уже є.')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Назва (UA)' })).toHaveValue('Льон');
    expect(bodies[0]).toMatchObject({
      id: 1,
      code: 'FAB-087',
      name: 'Льон',
      providerName: 'Атлас',
      price: 25,
      composition: '100% льон',
      density: '180',
      isActive: true,
      nameRu: null,
      proposalDescription: 'Склад: 100% льон. Щільність: 180 г/м².',
    });
  });

  it('opens a fabric for viewing, edits it, and refreshes the list', async () => {
    const user = userEvent.setup();
    let name = 'Льон';
    const fetcher = stubApi(
      () => [fabricRow({ name })],
      () => {
        name = 'Новий льон';
        return { ok: true };
      },
    );
    openFabrics();
    fireEvent.contextMenu(await screen.findByRole('row', { name: /FAB-004/ }), {
      clientX: 80,
      clientY: 120,
    });
    await user.click(screen.getByRole('menuitem', { name: 'Переглянути' }));
    const drawer = screen.getByRole('dialog', { name: 'Перегляд тканини' });
    expect(within(drawer).getByText('Лён')).toBeVisible();
    expect(within(drawer).getByText('30.08.2026')).toBeVisible();
    await user.click(within(drawer).getByRole('button', { name: 'Редагувати' }));
    const name_ = screen.getByRole('textbox', { name: 'Назва (UA)' });
    await user.clear(name_);
    await user.type(name_, 'Новий льон');
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(await screen.findByText('Новий льон')).toBeVisible();
    expect(fetcher).toHaveBeenCalledWith(
      '/api/reference/fabrics/4',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  it('deletes selected rows only after confirmation and retains failed selection', async () => {
    const user = userEvent.setup();
    const fetcher = stubApi(
      () => [fabricRow(), fabricRow({ id: 5, code: 'FAB-005', name: 'Бавовна' })],
      (path) => ({ ok: !path.endsWith('/5'), status: 409 }),
    );
    openFabrics();
    await screen.findByText('Бавовна');
    expect(screen.queryByRole('button', { name: /Видалити вибрані/ })).not.toBeInTheDocument();
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]!);
    await user.click(checkboxes[2]!);
    await user.click(screen.getByRole('button', { name: 'Видалити вибрані (2)' }));
    expect(fetcher.mock.calls.filter(([, init]) => init?.method === 'DELETE')).toHaveLength(0);
    await user.click(
      screen.getByRole('dialog').querySelector('button:last-child') as HTMLButtonElement,
    );
    expect(await screen.findByText(/Не вдалося видалити ID: 5/)).toBeVisible();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Видалити вибрані (1)' })).toBeVisible(),
    );
  });

  it('opens the row menu from the keyboard and restores focus after Escape', async () => {
    const user = userEvent.setup();
    stubApi(() => [fabricRow()]);
    openFabrics();
    const codeCell = await screen.findByRole('gridcell', { name: 'FAB-004' });
    codeCell.focus();

    fireEvent.keyDown(codeCell, { key: 'F10', shiftKey: true });
    expect(screen.getByRole('menuitem', { name: 'Переглянути' })).toBeVisible();
    await user.keyboard('{Escape}');

    await waitFor(() => expect(codeCell).toHaveFocus());
  });

  it('filters by supplier, clears the selection, and switches to accessories', async () => {
    const user = userEvent.setup();
    stubApi(() => [
      fabricRow(),
      fabricRow({ id: 5, code: 'FAB-005', name: 'Бавовна', providerName: 'Тексика' }),
    ]);
    openFabrics();
    await screen.findByText('Бавовна');
    await user.click(screen.getByRole('button', { name: 'Постачальник' }));
    await user.click(screen.getByRole('menuitem', { name: /Тексика/ }));
    expect(screen.queryByText('Льон')).not.toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Кількість тканин' })).toHaveTextContent(
      'Знайдено: 1 із 2',
    );

    await user.click(within(screen.getByRole('row', { name: /FAB-005/ })).getByRole('checkbox'));
    expect(screen.getByRole('button', { name: 'Видалити вибрані (1)' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Зняти вибір' }));
    expect(screen.queryByRole('button', { name: /Видалити вибрані/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Фурнітура' }));
    expect(await screen.findByRole('button', { name: 'Додати фурнітуру' })).toBeVisible();
  });
});

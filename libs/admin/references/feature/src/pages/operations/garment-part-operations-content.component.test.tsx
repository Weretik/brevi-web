import { cleanup, fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { OperationsPage } from './operations-page';
import { render } from '../../test-utils';
import { operationRow, sewingSettingsResponse } from '../../testing/reference-fixtures';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function LocationProbe() {
  const location = useLocation();
  return <output aria-label="Поточна адреса">{`${location.pathname}${location.search}`}</output>;
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/references/garment-part-operation']}>
      <OperationsPage />
      <LocationProbe />
    </MemoryRouter>,
  );
}

function stubApi(
  rows: () => unknown[],
  write?: (path: string, init: RequestInit) => unknown,
  settings: () => unknown = () => ({ ok: true, json: async () => sewingSettingsResponse() }),
) {
  const fetcher = vi
    .fn()
    .mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const path = String(input);
      if (init?.method && init.method !== 'GET' && write) return write(path, init);
      if (path.includes('/pricing/sewing/settings')) return settings();
      if (path.endsWith('/garment-parts'))
        return { ok: true, json: async () => [{ id: 1, name: 'Рукав' }] };
      return { ok: true, json: async () => rows() };
    });
  vi.stubGlobal('fetch', fetcher);
  return fetcher;
}

describe('operations page', () => {
  it('shows sheet fields and labour cost from the sewing settings', async () => {
    stubApi(() => [
      operationRow(),
      operationRow({
        id: 3,
        code: 'OP-155',
        garmentPartName: 'Інше',
        name: 'Нестандартна операція',
        min: 0,
        minutesPerProduct: true,
        normCheckedAt: null,
      }),
    ]);
    renderPage();

    const row = await screen.findByRole('row', { name: /OP-001/ });
    expect(within(row).getByText('Рукав куртки: прямий')).toBeVisible();
    expect(within(row).getByText('6 хв')).toBeVisible();
    expect(await within(row).findByText(/10,67\s*грн/)).toBeVisible();
    expect(within(row).getByText(/13,34\s*грн/)).toBeVisible();
    expect(within(row).getByText('30.08.2026')).toBeVisible();
    const custom = screen.getByRole('row', { name: /OP-155/ });
    expect(within(custom).getByText('на виріб')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Операції' })).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Операції' })).toHaveAttribute('aria-selected', 'true');
  });

  it('filters by group and search', async () => {
    const user = userEvent.setup();
    stubApi(() => [
      operationRow(),
      operationRow({
        id: 3,
        code: 'OP-040',
        garmentPartName: 'Кишені',
        element: 'Кишеня',
        variant: 'Накладна',
        name: 'Кишеня накладна',
      }),
    ]);
    renderPage();
    await screen.findByRole('row', { name: /OP-040/ });

    await user.click(screen.getByRole('button', { name: 'Група' }));
    await user.click(screen.getByRole('menuitem', { name: /Кишені/ }));
    expect(screen.queryByRole('row', { name: /OP-001/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Група: Кишені' }));
    await user.click(screen.getByRole('menuitem', { name: 'Усі групи' }));
    await user.type(screen.getByRole('textbox', { name: 'Пошук операцій' }), 'прямий');
    expect(screen.getByRole('row', { name: /OP-001/ })).toBeVisible();
    expect(screen.queryByRole('row', { name: /OP-040/ })).not.toBeInTheDocument();
  });

  it('still lists operations when the sewing settings cannot be read', async () => {
    stubApi(
      () => [operationRow()],
      undefined,
      () => ({ ok: false, status: 403, json: async () => null }),
    );
    renderPage();
    const row = await screen.findByRole('row', { name: /OP-001/ });
    expect(within(row).getAllByText('—').length).toBeGreaterThanOrEqual(2);
    expect(await screen.findByText(/Вартість недоступна/)).toBeVisible();
  });

  it('opens the row card and edits it with time per product', async () => {
    const user = userEvent.setup();
    const bodies: unknown[] = [];
    stubApi(
      () => [operationRow()],
      (_path, init) => {
        bodies.push(JSON.parse(String(init.body)));
        return { ok: true, status: 200, json: async () => null };
      },
    );
    renderPage();
    const row = await screen.findByRole('row', { name: /OP-001/ });

    fireEvent.contextMenu(row, { clientX: 80, clientY: 120 });
    await user.click(screen.getByRole('menuitem', { name: 'Переглянути' }));
    const drawer = screen.getByRole('dialog', { name: 'Перегляд операції' });
    expect(within(drawer).getByText('Прямий')).toBeVisible();

    await user.click(within(drawer).getByRole('button', { name: 'Редагувати' }));
    expect(screen.getByRole('dialog', { name: 'Редагування операції' })).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'Група деталей' })).toHaveTextContent('Рукав');
    await user.click(screen.getByRole('switch', { name: 'Час вказується для кожного виробу' }));
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(await screen.findByText('Операцію збережено.')).toBeVisible();
    expect(bodies[0]).toMatchObject({
      garmentPartName: 'Рукав',
      code: 'OP-001',
      min: 0,
      minutesPerProduct: true,
      normCheckedAt: '2026-08-30',
    });
    expect(screen.getByLabelText('Поточна адреса')).toHaveTextContent(
      '/references/garment-part-operation',
    );
  });
});

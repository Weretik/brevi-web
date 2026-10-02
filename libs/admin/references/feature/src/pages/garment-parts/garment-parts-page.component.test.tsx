import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GarmentPartsPage } from './garment-parts-page';
import { render } from '../../test-utils';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function LocationProbe() {
  const location = useLocation();
  return <output aria-label="Поточна адреса">{`${location.pathname}${location.search}`}</output>;
}

function renderPage(initialEntry = '/references/garment-part-operation?tab=parts') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <GarmentPartsPage />
      <LocationProbe />
    </MemoryRouter>,
  );
}

describe('garment parts page', () => {
  it('restores the active tab from the URL and writes tab changes back to it', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
    renderPage();

    expect(screen.getByRole('tab', { name: 'Елементи' })).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('tab', { name: 'Роботи' }));

    expect(screen.getByLabelText('Поточна адреса')).toHaveTextContent(
      '/references/garment-part-operation?tab=operations',
    );
  });

  it('opens the create drawer without leaving the Elements list', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
    renderPage();

    await user.click(await screen.findByRole('button', { name: 'Створити' }));

    expect(screen.getByRole('dialog', { name: 'Новий елемент виробу' })).toBeVisible();
    expect(screen.getByRole('spinbutton', { name: 'ID' })).toHaveValue(1);
    expect(screen.getByRole('textbox', { name: 'Назва' })).toHaveValue('');
    expect(screen.getByLabelText('Поточна адреса')).toHaveTextContent(
      '/references/garment-part-operation?tab=parts',
    );
  });

  it('opens the selected row in a read-only drawer without an action column', async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => [{ id: 7, name: 'Рукав' }] });
    vi.stubGlobal('fetch', fetchMock);
    renderPage();
    const row = await screen.findByRole('row', { name: /7.*Рукав/ });
    const rowCheckbox = row.querySelector('input[type="checkbox"]') as HTMLInputElement;

    expect(screen.queryByRole('columnheader', { name: 'Дії' })).not.toBeInTheDocument();
    await user.click(rowCheckbox);
    fireEvent.contextMenu(row, { clientX: 80, clientY: 120 });

    expect(rowCheckbox).toBeChecked();
    await user.click(screen.getByRole('menuitem', { name: 'Перегляд' }));

    expect(screen.getByRole('dialog', { name: 'Перегляд елемента виробу' })).toBeVisible();
    expect(screen.getByText('Рукав', { selector: 'p' })).toBeVisible();
    expect(screen.getByLabelText('Поточна адреса')).toHaveTextContent(
      '/references/garment-part-operation?tab=parts',
    );

    await user.click(screen.getByRole('button', { name: 'Редагувати' }));

    expect(screen.getByRole('dialog', { name: 'Редагування елемента виробу' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Назва' })).toHaveValue('Рукав');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('keeps the create drawer and entered value after a write error', async () => {
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
    renderPage();

    await user.click(await screen.findByRole('button', { name: 'Створити' }));
    await user.type(screen.getByRole('textbox', { name: 'Назва' }), 'Рукав');
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(await screen.findByText('Назва вже існує.')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Назва' })).toHaveValue('Рукав');
    expect(screen.getByRole('dialog', { name: 'Новий елемент виробу' })).toBeVisible();
  });

  it('opens the focused row menu from the keyboard and restores focus when it closes', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => [{ id: 7, name: 'Рукав' }] }),
    );
    renderPage();
    await screen.findByRole('row', { name: /7.*Рукав/ });
    const nameCell = screen.getByRole('gridcell', { name: 'Рукав' });
    nameCell.focus();

    fireEvent.keyDown(nameCell, { key: 'ContextMenu' });
    expect(screen.getByRole('menuitem', { name: 'Змінити' })).toBeVisible();
    await user.keyboard('{Escape}');

    await waitFor(() => expect(nameCell).toHaveFocus());
  });

  it('confirms a row deletion and preserves its selection when the delete fails', async () => {
    const user = userEvent.setup();
    const fetcher = vi
      .fn()
      .mockImplementation(async (_path: string, init?: RequestInit) =>
        init?.method === 'DELETE'
          ? { ok: false, status: 409, json: async () => [] }
          : { ok: true, json: async () => [{ id: 2, name: 'Комір' }] },
      );
    vi.stubGlobal('fetch', fetcher);
    renderPage();
    const row = await screen.findByRole('row', { name: /2.*Комір/ });
    const rowCheckbox = row.querySelector('input[type="checkbox"]') as HTMLInputElement;
    await user.click(rowCheckbox);
    fireEvent.contextMenu(row, { clientX: 80, clientY: 120 });
    await user.click(screen.getByRole('menuitem', { name: 'Видалити' }));

    expect(fetcher.mock.calls.filter(([, init]) => init?.method === 'DELETE')).toHaveLength(0);
    await user.click(screen.getByRole('dialog').querySelector('button:last-child')!);

    expect(await screen.findByText(/Не вдалося видалити ID: 2/)).toBeVisible();
    expect(rowCheckbox).toBeChecked();
  });
});

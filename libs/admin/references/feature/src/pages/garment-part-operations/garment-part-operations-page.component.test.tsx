import { cleanup, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { render } from '../../test-utils';
import { GarmentPartsPage } from '../garment-parts/garment-parts-page';

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
    <MemoryRouter initialEntries={['/references/garment-part-operation?tab=operations']}>
      <GarmentPartsPage />
      <LocationProbe />
    </MemoryRouter>,
  );
}

describe('garment part operations tab', () => {
  it('shows rows without an action column', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ id: 2, garmentPartName: 'Рукав', name: 'Шов', min: 1.5 }],
      }),
    );
    renderPage();

    expect(await screen.findByText('Шов')).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Роботи' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByRole('columnheader', { name: 'Дії' })).not.toBeInTheDocument();
  });

  it('opens the correct row menu with Shift+F10 and shows the edit drawer', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ id: 2, garmentPartName: 'Рукав', name: 'Шов', min: 1.5 }],
      }),
    );
    renderPage();
    const row = await screen.findByRole('row', { name: /2.*Рукав.*Шов/ });

    fireEvent.keyDown(row, { key: 'F10', shiftKey: true });
    expect(screen.getByRole('menuitem', { name: 'Перегляд' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Видалити' })).toBeVisible();
    await user.click(screen.getByRole('menuitem', { name: 'Змінити' }));

    expect(screen.getByRole('dialog', { name: 'Редагування роботи' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Назва' })).toHaveValue('Шов');
    expect(screen.getByRole('combobox', { name: 'Елемент' })).toHaveTextContent('Рукав');
    expect(screen.getByLabelText('Поточна адреса')).toHaveTextContent(
      '/references/garment-part-operation?tab=operations',
    );
  });

  it('keeps selection unchanged when the mouse context menu opens', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ id: 2, garmentPartName: 'Рукав', name: 'Шов', min: 1.5 }],
      }),
    );
    renderPage();
    const row = await screen.findByRole('row', { name: /2.*Рукав.*Шов/ });
    const rowCheckbox = row.querySelector('input[type="checkbox"]') as HTMLInputElement;
    await user.click(rowCheckbox);

    fireEvent.contextMenu(row, { clientX: 80, clientY: 120 });

    expect(rowCheckbox).toBeChecked();
    expect(screen.getByRole('menu', { name: 'Дії: Шов' })).toBeVisible();
  });

  it('keeps the create draft open while the garment-parts lookup retries', async () => {
    const user = userEvent.setup();
    let garmentPartsRequests = 0;
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes('/api/reference/garment-part-operations')) {
          return { ok: true, json: async () => [] };
        }
        garmentPartsRequests += 1;
        if (garmentPartsRequests === 1) {
          return { ok: false, status: 500, json: async () => null };
        }
        return { ok: true, json: async () => [{ id: 1, name: 'Рукав' }] };
      }),
    );
    renderPage();

    await user.click(await screen.findByRole('button', { name: 'Створити' }));
    const drawer = screen.getByRole('dialog', { name: 'Нова робота' });
    await user.type(screen.getByRole('textbox', { name: 'Назва' }), 'Новий шов');
    expect(await screen.findByText('Не вдалося виконати запит. Спробуйте ще раз.')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Повторити' }));

    expect(await screen.findByRole('combobox', { name: 'Елемент' })).toBeVisible();
    expect(drawer).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Назва' })).toHaveValue('Новий шов');
    expect(screen.queryByText('Оберіть елемент виробу.')).not.toBeInTheDocument();
  });
});

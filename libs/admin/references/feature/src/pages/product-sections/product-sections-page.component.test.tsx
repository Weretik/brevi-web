import { cleanup, fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProductSectionsPage } from './product-sections-page';
import { render } from '../../test-utils';
import { productSectionRow } from '../../testing/reference-fixtures';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function stubApi(write?: (path: string, init: RequestInit) => unknown) {
  const fetcher = vi.fn().mockImplementation(async (path: string, init?: RequestInit) => {
    if (init?.method && init.method !== 'GET' && write) return write(path, init);
    return {
      ok: true,
      json: async () => [
        productSectionRow(),
        productSectionRow({ id: 2, name: 'Одяг ЗИМА', comment: 'Зимовий одяг', sortOrder: 5 }),
        productSectionRow({
          id: 3,
          type: 'Ppe',
          name: 'Захист рук',
          isActive: false,
          comment: null,
          sortOrder: 14,
        }),
      ],
    };
  });
  vi.stubGlobal('fetch', fetcher);
  return fetcher;
}

function openPage() {
  render(
    <MemoryRouter initialEntries={['/references/product-sections']}>
      <ProductSectionsPage />
    </MemoryRouter>,
  );
}

describe('product sections page', () => {
  it('lists sections with type and status and filters them by product type', async () => {
    const user = userEvent.setup();
    stubApi();
    openPage();

    expect(screen.getByRole('heading', { name: 'Типи і розділи' })).toBeVisible();
    const row = await screen.findByRole('row', { name: /Захист рук/ });
    expect(within(row).getByText('ЗІЗ')).toBeVisible();
    expect(within(row).getByText('Вимкнений')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Швейна продукція 2' }));
    expect(screen.queryByText('Захист рук')).not.toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Кількість розділів' })).toHaveTextContent(
      'Знайдено: 2 із 3',
    );
  });

  it('edits a section and sends its fields', async () => {
    const user = userEvent.setup();
    const writes: { path: string; body: unknown }[] = [];
    stubApi((path, init) => {
      writes.push({ path, body: JSON.parse(String(init.body)) });
      return { ok: true };
    });
    openPage();

    fireEvent.contextMenu(await screen.findByRole('row', { name: /Одяг ЛІТО/ }), {
      clientX: 80,
      clientY: 120,
    });
    await user.click(screen.getByRole('menuitem', { name: 'Редагувати' }));
    const comment = screen.getByRole('textbox', { name: 'Коментар' });
    await user.clear(comment);
    await user.type(comment, 'Літо');
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(await screen.findByText('Розділ збережено.')).toBeVisible();
    expect(writes[0]?.path).toMatch(/\/api\/reference\/product-sections\/1$/);
    expect(writes[0]?.body).toEqual({
      type: 'Sewing',
      name: 'Одяг ЛІТО',
      isActive: true,
      comment: 'Літо',
      sortOrder: 2,
    });
  });
});

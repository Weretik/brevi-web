import { resetAdminApiState } from '@admin/shared/api-client';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { App } from '../app';

afterEach(() => {
  resetAdminApiState();
  window.history.replaceState({}, '', '/');
  window.localStorage.clear();
  vi.unstubAllGlobals();
});

describe('React Admin routing', () => {
  it('shows all legacy sections without linking to pages that have not migrated', async () => {
    const user = userEvent.setup();
    render(<App />);
    const navigation = screen.getByRole('navigation', { name: 'Основна навігація' });
    expect(within(navigation).queryByText('Початок')).not.toBeInTheDocument();
    const sections = [
      [
        'Менеджер сервісу',
        [
          'Клієнти',
          'Ліди',
          'Постачальники',
          'Розрахунки та КП',
          'Прайс',
          'Архів КП',
          'Завдання в роботу',
          'Угоди',
        ],
      ],
      [
        'Швейний цех',
        [
          'Графік роботи',
          'Зарплата',
          'Тканина в цеху',
          'Фурнітура в цеху',
          'Робочий час',
          'Вишивка',
          'Каса цеху',
        ],
      ],
      ['Бухгалтерія', ['Рахунки', 'Надходження', 'Витрати', 'Звіти', 'Довідники']],
      [
        'Загальні довідники',
        [
          'Товари',
          'Тканина та фурнітура',
          'Операції',
          'Постачальники',
          'Розрахунки',
          'Додаткові довідники',
          'Медіа/Фото',
        ],
      ],
      ['Загальні звіти', ['Загальні звіти']],
    ] as const;

    for (const [section, entries] of sections) {
      const sectionButton = within(navigation).getByRole('button', { name: section });
      await user.click(sectionButton);
      const list = within(navigation).getByRole('list', { name: section });
      expect(
        within(list)
          .getAllByRole('listitem')
          .map((item) => item.textContent?.replace('Ще не доступно', '')),
      ).toEqual(entries);
      expect(within(list).queryAllByRole('link')).toHaveLength(
        section === 'Загальні довідники' ? 6 : 0,
      );
    }
  });

  it('shows the start page without a home entry in the legacy menu', () => {
    window.history.replaceState({}, '', '/');
    render(<App />);

    expect(screen.getByRole('main')).toHaveTextContent('Робочий простір адміністратора');
    expect(
      within(screen.getByRole('navigation', { name: 'Основна навігація' })).queryByRole('link', {
        name: 'Початок',
      }),
    ).not.toBeInTheDocument();
  });

  it('keeps the shell on an unknown URL and provides a way back', async () => {
    const user = userEvent.setup();
    window.history.replaceState({}, '', '/unknown');
    render(<App />);

    expect(screen.getByRole('main')).toHaveTextContent('Сторінку не знайдено');
    await user.click(screen.getByRole('link', { name: 'На початок' }));
    expect(screen.getByRole('main')).toHaveTextContent('Робочий простір адміністратора');
  });

  it('opens suppliers directly inside the Brevi shell', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
    window.history.replaceState({}, '', '/references/supplier');
    render(<App />);
    await vi.dynamicImportSettled();
    expect(await screen.findByRole('heading', { name: 'Постачальники' })).toBeVisible();
    expect(
      within(screen.getByRole('navigation', { name: 'Основна навігація' })).getByRole('link', {
        name: 'Постачальники',
      }),
    ).toHaveAttribute('href', '/references/supplier');
    expect(await screen.findByText('Постачальників поки немає')).toBeVisible();
  });

  it('opens additional references directly inside the Brevi shell', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
    window.history.replaceState({}, '', '/references/additional-reference');
    render(<App />);
    await vi.dynamicImportSettled();
    expect(await screen.findByRole('heading', { name: 'Додаткові довідники' })).toBeVisible();
    expect(
      within(screen.getByRole('navigation', { name: 'Основна навігація' })).getByRole('link', {
        name: 'Додаткові довідники',
      }),
    ).toHaveAttribute('href', '/references/additional-reference');
    expect(await screen.findByText('Додаткових довідників поки немає')).toBeVisible();
  });

  it('opens garment accessories directly inside the Brevi shell', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
    window.history.replaceState({}, '', '/references/garment-accessory?tab=fabrics');
    render(<App />);
    await vi.dynamicImportSettled();
    expect(await screen.findByRole('heading', { name: 'Фурнітура' })).toBeVisible();
    expect(screen.getByRole('main')).toHaveTextContent('Тканини');
    expect(
      within(screen.getByRole('navigation', { name: 'Основна навігація' })).getByRole('link', {
        name: 'Тканина та фурнітура',
      }),
    ).toHaveAttribute('href', '/references/garment-accessory');
    expect(screen.getByRole('tab', { name: 'Тканини' })).toHaveAttribute('aria-selected', 'true');
    expect(await screen.findByText('Тканин поки немає')).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'Рядків на сторінці:' })).toBeVisible();
    expect(screen.queryByRole('columnheader', { name: 'Дії' })).not.toBeInTheDocument();

    await userEvent.setup().click(screen.getByRole('tab', { name: 'Фурнітура виробу' }));

    expect(window.location.search).toBe('?tab=accessories');
    expect(await screen.findByText('Фурнітури поки немає')).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'Рядків на сторінці:' })).toBeVisible();
    expect(screen.queryByRole('columnheader', { name: 'Дії' })).not.toBeInTheDocument();
  });

  it('opens operations directly and activates the shared legacy menu entry', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }));
    window.history.replaceState({}, '', '/references/garment-part-operation');
    render(<App />);
    await vi.dynamicImportSettled();
    expect(
      await screen.findByRole('heading', { name: 'Елементи виробу та роботи' }),
    ).toBeVisible();
    expect(
      within(screen.getByRole('navigation', { name: 'Основна навігація' })).getByRole('link', {
        name: 'Операції',
      }),
    ).toHaveAttribute('href', '/references/garment-part-operation');
    expect(screen.getByRole('tab', { name: 'Роботи' })).toHaveAttribute('aria-selected', 'true');
    expect(await screen.findByText('Робіт поки немає')).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'Рядків на сторінці:' })).toBeVisible();
    expect(screen.queryByRole('columnheader', { name: 'Дії' })).not.toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole('tab', { name: 'Елементи' }));
    expect(await screen.findByText('Елементів виробу поки немає')).toBeVisible();
    expect(window.location.search).toBe('?tab=parts');
  });

  it('opens the product list directly with server total and an active menu link', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) => {
        const url = input instanceof Request ? input.url : String(input);
        return Promise.resolve(
          new Response(
            JSON.stringify(
              url.includes('/api/v1/products')
                ? {
                    value: [],
                    pagedInfo: { pageNumber: 1, pageSize: 20, totalPages: 0, totalRecords: 0 },
                  }
                : [],
            ),
            { status: 200 },
          ),
        );
      }),
    );
    window.history.replaceState({}, '', '/references/products');
    render(<App />);
    await vi.dynamicImportSettled();
    expect(await screen.findByRole('heading', { name: 'Товари' })).toBeVisible();
    expect(
      within(screen.getByRole('navigation', { name: 'Основна навігація' })).getByRole('link', {
        name: 'Товари',
      }),
    ).toHaveAttribute('href', '/references/products');
    expect(await screen.findByText('Товарів не знайдено')).toBeVisible();
    expect(screen.getByRole('combobox', { name: 'Рядків на сторінці:' })).toBeVisible();
    const idHeader = screen.getByRole('columnheader', { name: 'ID' });
    await user.hover(idHeader);
    const columnMenuButton = idHeader.querySelector<HTMLButtonElement>(
      'button[aria-haspopup="menu"]',
    );
    expect(columnMenuButton).toHaveAttribute('aria-label', 'Меню стовпця ID');
    await user.click(columnMenuButton!);
    expect(screen.getByRole('menuitem', { name: 'Сортувати за зростанням' })).toBeVisible();
  }, 15_000);

  it('opens media directly inside the Brevi shell', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify([]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
    window.history.replaceState({}, '', '/references/media');
    render(<App />);

    expect(await screen.findByRole('heading', { name: 'Медіа/Фото' })).toBeVisible();
    expect(
      within(screen.getByRole('navigation', { name: 'Основна навігація' })).getByRole('link', {
        name: 'Медіа/Фото',
      }),
    ).toHaveAttribute('href', '/references/media');
    expect(await screen.findByText('Медіатека поки порожня.')).toBeVisible();
  });

  it('persists the selected color mode', async () => {
    const user = userEvent.setup();
    window.history.replaceState({}, '', '/');
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Вибрати тему оформлення' }));
    await user.click(screen.getByRole('menuitem', { name: 'Темна' }));

    expect(window.localStorage.getItem('theme')).toBe('dark');
    expect(screen.getByRole('img', { name: 'Brevi' })).toHaveAttribute(
      'src',
      '/assets/logo/brevi-logo-light.png',
    );
  });
});

import { resetAdminApiState } from '@admin/shared/api-client';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { App } from '../app';
import { createAdminRouter } from './create-admin-router';

import type { SessionUser } from '@admin/core/auth';
import type { ReactNode } from 'react';

vi.mock('@admin/core/auth', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@admin/core/auth')>()),
  // A signed-in manager; the session guard itself is tested in the auth library.
  RequireAdminSession: ({ children }: { children: (user: SessionUser) => ReactNode }) =>
    children({
      id: '2',
      email: 'manager@brevi.com.ua',
      fullName: 'Олена',
      roles: ['Manager'],
      avatarUrl: null,
    }),
  useGetAdminSessionRolesQuery: () => ({
    currentData: ['Manager'],
    isSuccess: true,
    isFetching: false,
  }),
}));

const routers: ReturnType<typeof createAdminRouter>[] = [];
function renderApp() {
  const router = createAdminRouter();
  routers.push(router);
  return render(<App router={router} />);
}

function expectEmptyGridPagination(pageSize: number) {
  const main = within(screen.getByRole('main'));
  // MUI hides this selector below sm; jsdom does not apply the desktop media query.
  // Verify its labelled DOM contract separately from the always-visible actions.
  const sizeSelector = main.getByLabelText('Рядків на сторінці:', {
    selector: '[role="combobox"]',
  });
  expect(sizeSelector).toHaveTextContent(String(pageSize));
  expect(main.getByText('0–0 з 0')).toBeVisible();
  for (const name of ['Перейти на попередню сторінку', 'Перейти на наступну сторінку']) {
    const button = main.getByRole('button', { name });
    expect(button).toBeVisible();
    expect(button).toBeDisabled();
  }
}

afterEach(() => {
  cleanup();
  for (const router of routers.splice(0)) router.dispose();
  resetAdminApiState();
  window.history.replaceState({}, '', '/');
  window.localStorage.clear();
  vi.unstubAllGlobals();
});

describe('React Admin routing', () => {
  it('shows all legacy sections without linking to pages that have not migrated', async () => {
    const user = userEvent.setup();
    renderApp();
    const navigation = screen.getByRole('navigation', { name: 'Основна навігація' });
    expect(within(navigation).queryByText('Початок')).not.toBeInTheDocument();
    const sections = [
      [
        'Менеджер сервісу',
        ['Ліди', 'Розрахунки та КП', 'Прайс', 'Архів КП', 'Завдання в роботу', 'Угоди'],
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
          'Типи і розділи',
          'Тканини та фурнітура',
          'Операції',
          'Контрагенти',
          'Розрахунки',
          'Параметри ціноутворення',
          'Імпорт цін',
        ],
      ],
      ['Фото', ['Бібліотека фото']],
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
        section === 'Загальні довідники'
          ? 7
          : section === 'Менеджер сервісу'
            ? 2
            : section === 'Фото'
              ? 1
              : 0,
      );
    }
  });

  it('shows the demo overview and the signed-in person in the profile menu', async () => {
    const user = userEvent.setup();
    window.history.replaceState({}, '', '/');
    renderApp();

    expect(
      await screen.findByRole('heading', { name: 'Огляд виробництва' }, { timeout: 5000 }),
    ).toBeVisible();
    expect(screen.getByText('Демо-дані')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Профіль' }));
    const menu = await screen.findByRole('menu');
    expect(within(menu).getByText('manager@brevi.com.ua')).toBeVisible();
    expect(within(menu).getByText('Менеджер')).toBeVisible();
    expect(within(menu).getByRole('menuitem', { name: 'Мій кабінет' })).toBeVisible();
    await user.keyboard('{Escape}');
    expect(
      within(screen.getByRole('navigation', { name: 'Основна навігація' })).queryByRole('link', {
        name: 'Початок',
      }),
    ).not.toBeInTheDocument();
  });

  it('keeps the shell on an unknown URL and provides a way back', async () => {
    const user = userEvent.setup();
    window.history.replaceState({}, '', '/unknown');
    renderApp();

    expect(screen.getByRole('main')).toHaveTextContent('Сторінку не знайдено');
    await user.click(screen.getByRole('link', { name: 'На початок' }));
    expect(
      await screen.findByRole('heading', { name: 'Огляд виробництва' }, { timeout: 5000 }),
    ).toBeVisible();
  });

  // Includes the first lazy-loaded reference module and grid on a cold worker.
  it('sends the old suppliers URL to «Контрагенти» inside the Brevi shell', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify([]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
    window.history.replaceState({}, '', '/references/supplier');
    renderApp();
    await vi.dynamicImportSettled();
    expect(await screen.findByRole('heading', { name: 'Постачальники' })).toBeVisible();
    expect(window.location.pathname).toBe('/references/counterparties');
    expect(screen.getByRole('tab', { name: 'Клієнти' })).toBeVisible();
    const navigation = screen.getByRole('navigation', { name: 'Основна навігація' });
    expect(within(navigation).getByRole('link', { name: 'Контрагенти' })).toHaveAttribute(
      'href',
      '/references/counterparties',
    );
    expect(within(navigation).queryByRole('link', { name: 'Клієнти' })).not.toBeInTheDocument();
    expect(await screen.findByText('Постачальників поки немає')).toBeVisible();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  }, 15_000);

  it('sends the old additional references URL to pricing parameters inside the Brevi shell', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockImplementation(
          async () =>
            new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } }),
        ),
    );
    window.history.replaceState({}, '', '/references/additional-reference');
    renderApp();
    await vi.dynamicImportSettled();
    expect(await screen.findByRole('heading', { name: 'Параметри ціноутворення' })).toBeVisible();
    expect(window.location.pathname).toBe('/references/pricing-parameters');
    expect(
      within(screen.getByRole('navigation', { name: 'Основна навігація' })).getByRole('link', {
        name: 'Параметри ціноутворення',
      }),
    ).toHaveAttribute('href', '/references/pricing-parameters');
    expect(await screen.findByText('Параметрів поки немає')).toBeVisible();
  });

  it('sends the old fabrics and accessories URLs to the one materials page', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockImplementation(
          async () =>
            new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } }),
        ),
    );
    window.history.replaceState({}, '', '/references/garment-accessory?tab=fabrics');
    renderApp();
    await vi.dynamicImportSettled();
    expect(await screen.findByRole('heading', { name: 'Тканини та фурнітура' })).toBeVisible();
    expect(window.location.pathname).toBe('/references/materials');
    const navigation = screen.getByRole('navigation', { name: 'Основна навігація' });
    expect(within(navigation).getByRole('link', { name: 'Тканини та фурнітура' })).toHaveAttribute(
      'href',
      '/references/materials',
    );
    expect(await screen.findByText(/Тканин поки немає/)).toBeVisible();
    expectEmptyGridPagination(10);

    await userEvent.setup().click(screen.getByRole('tab', { name: 'Фурнітура' }));

    expect(window.location.search).toBe('?tab=accessories');
    expect(await screen.findByText(/Фурнітури поки немає/)).toBeVisible();
  });

  it('opens operations directly and activates the shared legacy menu entry', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockImplementation(
          async () =>
            new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } }),
        ),
    );
    window.history.replaceState({}, '', '/references/garment-part-operation');
    renderApp();
    await vi.dynamicImportSettled();
    expect(await screen.findByRole('heading', { name: 'Операції' })).toBeVisible();
    expect(
      within(screen.getByRole('navigation', { name: 'Основна навігація' })).getByRole('link', {
        name: 'Операції',
      }),
    ).toHaveAttribute('href', '/references/garment-part-operation');
    expect(screen.getByRole('tab', { name: 'Операції' })).toHaveAttribute('aria-selected', 'true');
    expect(await screen.findByText(/Операцій поки немає/)).toBeVisible();
    expectEmptyGridPagination(10);
    await userEvent.setup().click(screen.getByRole('tab', { name: 'Групи деталей' }));
    expect(await screen.findByText('Груп поки немає')).toBeVisible();
    expect(window.location.search).toBe('?tab=groups');
  });

  it('opens the «Товари» page directly with tabs and an active menu link', async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      'fetch',
      vi.fn((request: Request) =>
        Promise.resolve(
          new Response(
            JSON.stringify(
              request.url.includes('/products/overview')
                ? {
                    items: [],
                    page: 1,
                    pageSize: 25,
                    total: 0,
                    all: 0,
                    withoutPrice: 0,
                    sections: [],
                  }
                : [],
            ),
            { status: 200 },
          ),
        ),
      ),
    );
    window.history.replaceState({}, '', '/references/products');
    renderApp();
    await vi.dynamicImportSettled();
    expect(await screen.findByRole('heading', { name: 'Товари' })).toBeVisible();
    expect(
      within(screen.getByRole('navigation', { name: 'Основна навігація' })).getByRole('link', {
        name: 'Товари',
      }),
    ).toHaveAttribute('href', '/references/products');
    expect(await screen.findByText('Товарів поки немає')).toBeVisible();
    await user.click(screen.getByRole('tab', { name: 'ЗІЗ' }));
    expect(window.location.search).toBe('?tab=ppe');
    expect(await screen.findByRole('grid', { name: 'ЗІЗ' })).toBeVisible();
  }, 15_000);

  it('moves the old media link to the photo library inside the Brevi shell', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockImplementation((request: Request) =>
          Promise.resolve(
            new Response(
              JSON.stringify(
                request.url.includes('/api/media/files')
                  ? { items: [], total: 0, page: 1, pageSize: 48 }
                  : [],
              ),
              { status: 200, headers: { 'Content-Type': 'application/json' } },
            ),
          ),
        ),
    );
    window.history.replaceState({}, '', '/references/media');
    renderApp();

    expect(await screen.findByRole('heading', { name: 'Фото' })).toBeVisible();
    expect(window.location.pathname).toBe('/media');
    expect(
      within(screen.getByRole('navigation', { name: 'Основна навігація' })).getByRole('link', {
        name: 'Бібліотека фото',
      }),
    ).toHaveAttribute('href', '/media');
    expect(await screen.findByText(/^Бібліотека поки порожня\./)).toBeVisible();
  });

  it('persists the selected color mode', async () => {
    const user = userEvent.setup();
    window.history.replaceState({}, '', '/');
    renderApp();

    await user.click(screen.getByRole('button', { name: 'Вибрати тему оформлення' }));
    await user.click(screen.getByRole('menuitem', { name: 'Темна' }));

    expect(window.localStorage.getItem('theme')).toBe('dark');
    expect(screen.getByRole('img', { name: 'Brevi' })).toHaveAttribute(
      'src',
      '/assets/logo/brevi-logo-light.png',
    );
  });
});

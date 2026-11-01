import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { AdminLayout } from './admin-layout';
import { AdminShellSessionProvider } from '../providers/admin-shell-session-provider';

function renderShell(initialPath = '/', onLogout?: () => Promise<void>) {
  const onColorModeChange = vi.fn();

  const ui = (
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          element={
            <AdminLayout
              colorMode="system"
              navigation={[
                {
                  id: 'example',
                  label: 'Приклади',
                  items: [
                    { id: 'example-page', label: 'Приклад', to: '/example' },
                    { id: 'unavailable-page', label: 'Майбутній розділ' },
                  ],
                },
              ]}
              onColorModeChange={onColorModeChange}
            />
          }
        >
          <Route index element={<h1>Початкова сторінка</h1>} />
          <Route path="example" element={<h1>Приклад сторінки</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  render(
    onLogout ? <AdminShellSessionProvider onLogout={onLogout}>{ui}</AdminShellSessionProvider> : ui,
  );

  return { onColorModeChange };
}

afterEach(() => window.localStorage.clear());

describe('AdminLayout', () => {
  it('opens a section from the keyboard without offering an unavailable link', async () => {
    const user = userEvent.setup();
    renderShell();
    const navigation = screen.getByRole('navigation', { name: 'Основна навігація' });
    const sectionButton = within(navigation).getByRole('button', { name: 'Приклади' });

    sectionButton.focus();
    await user.keyboard('{Enter}');

    expect(sectionButton).toHaveAttribute('aria-expanded', 'true');
    expect(within(navigation).getByText('Майбутній розділ')).toBeVisible();
    expect(within(navigation).getByText('Ще не доступно')).toBeVisible();
    expect(
      within(navigation).queryByRole('link', { name: 'Майбутній розділ' }),
    ).not.toBeInTheDocument();
  });

  it('shows the Brevi shell around routed content and marks the current section', async () => {
    const user = userEvent.setup();
    renderShell('/example');

    expect(screen.getByRole('banner')).toBeVisible();
    expect(screen.getByRole('img', { name: 'Brevi' })).toBeVisible();
    expect(screen.getByRole('main')).toHaveTextContent('Приклад сторінки');
    expect(
      within(screen.getByRole('navigation', { name: 'Основна навігація' })).getByRole('link', {
        name: 'Приклад',
      }),
    ).toHaveAttribute('aria-current', 'page');
    const currentGroup = within(
      screen.getByRole('navigation', { name: 'Основна навігація' }),
    ).getByRole('button', { name: 'Приклади' });
    expect(currentGroup).toHaveAttribute('aria-expanded', 'true');
    await user.click(currentGroup);
    expect(currentGroup).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes mobile navigation after choosing a route and restores visible focus', async () => {
    const user = userEvent.setup();
    renderShell();

    const menuButton = screen.getByRole('button', { name: 'Відкрити меню навігації' });
    await user.click(menuButton);
    const mobileNavigation = screen.getByRole('navigation', { name: 'Мобільна навігація' });
    await user.click(within(mobileNavigation).getByRole('button', { name: 'Приклади' }));
    await user.click(within(mobileNavigation).getByRole('link', { name: 'Приклад' }));

    await waitFor(() => expect(screen.getByRole('main')).toHaveTextContent('Приклад сторінки'));
    await waitFor(() => expect(menuButton).toHaveFocus());

    await user.click(menuButton);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(menuButton).toHaveFocus());
  });

  it('offers all three color modes', async () => {
    const user = userEvent.setup();
    const { onColorModeChange } = renderShell();

    await user.click(screen.getByRole('button', { name: 'Вибрати тему оформлення' }));
    await user.click(screen.getByRole('menuitem', { name: 'Темна' }));

    expect(onColorModeChange).toHaveBeenCalledWith('dark');
  });

  it('shows where the user is in the top bar and links home', () => {
    renderShell('/example');

    const breadcrumbs = screen.getByRole('navigation', { name: 'Розташування' });
    expect(breadcrumbs).toHaveTextContent('Приклади');
    expect(within(breadcrumbs).getByText('Приклад')).toHaveAttribute('aria-current', 'location');
    expect(
      within(screen.getByRole('navigation', { name: 'Основна навігація' })).getByRole('link', {
        name: 'Головна',
      }),
    ).toHaveAttribute('href', '/');
  });

  it('collapses the desktop menu to icons, remembers it, and opens a group as a flyout', async () => {
    const user = userEvent.setup();
    renderShell();
    const navigation = screen.getByRole('navigation', { name: 'Основна навігація' });

    await user.click(screen.getByRole('button', { name: 'Згорнути меню' }));

    expect(screen.getByRole('button', { name: 'Розгорнути меню' })).toBeVisible();
    expect(window.localStorage.getItem('brevi-admin:navigation-collapsed')).toBe('true');

    const groupButton = within(navigation).getByRole('button', { name: 'Приклади' });
    expect(groupButton).toHaveAttribute('aria-haspopup', 'true');
    await user.click(groupButton);

    const flyout = await screen.findByRole('list', { name: 'Приклади' });
    expect(groupButton).toHaveAttribute('aria-expanded', 'true');
    expect(within(flyout).getByRole('link', { name: 'Приклад' })).toHaveAttribute(
      'href',
      '/example',
    );
    expect(
      within(flyout).queryByRole('link', { name: 'Майбутній розділ' }),
    ).not.toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(groupButton).toHaveAttribute('aria-expanded', 'false'));
  });

  it('starts collapsed when the choice was saved earlier', () => {
    window.localStorage.setItem('brevi-admin:navigation-collapsed', 'true');
    renderShell();

    expect(screen.getByRole('button', { name: 'Розгорнути меню' })).toBeVisible();
  });

  it('shows search, notifications, and profile with honest placeholders and a working logout', async () => {
    const user = userEvent.setup();
    const onLogout = vi.fn().mockResolvedValue(undefined);
    renderShell('/', onLogout);

    await user.click(screen.getAllByRole('button', { name: 'Пошук' })[0]);
    expect(await screen.findByText("Пошук скоро з'явиться")).toBeVisible();
    await user.keyboard('{Escape}');

    await user.click(screen.getByRole('button', { name: 'Сповіщення' }));
    expect(await screen.findByText('Нових сповіщень немає')).toBeVisible();
    await user.keyboard('{Escape}');

    await user.click(screen.getByRole('button', { name: 'Профіль' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Вийти' }));
    expect(onLogout).toHaveBeenCalledOnce();
  });
});

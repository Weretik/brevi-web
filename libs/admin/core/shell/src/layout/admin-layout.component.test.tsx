import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { AdminLayout } from './admin-layout';

function renderShell(initialPath = '/') {
  const onColorModeChange = vi.fn();

  render(
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
    </MemoryRouter>,
  );

  return { onColorModeChange };
}

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
    expect(
      screen.queryByRole('button', { name: /сповіщення|профіль|пошук/i }),
    ).not.toBeInTheDocument();
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
});

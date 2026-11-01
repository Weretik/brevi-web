import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import DashboardPage from './dashboard-page';

describe('DashboardPage', () => {
  it('shows the workshop overview on clearly labelled demo data', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Огляд виробництва' })).toBeVisible();
    expect(screen.getByText('Демо-дані')).toBeVisible();
    expect(
      within(screen.getByRole('region', { name: 'Показники' })).getByText('Каса цеху'),
    ).toBeVisible();

    const board = screen.getByRole('region', { name: 'Дошка цеху' });
    for (const stage of ['Розкрій', 'Пошиття', 'Вишивка', 'ОТК і пакування', 'Готово']) {
      expect(within(board).getByRole('region', { name: stage })).toBeVisible();
    }
    expect(within(board).getAllByText(/прострочено/)).toHaveLength(2);

    expect(screen.getByRole('link', { name: 'Новий розрахунок' })).toHaveAttribute(
      'href',
      '/crm/quotes/new',
    );
    expect(screen.getByRole('link', { name: 'Усі КП' })).toHaveAttribute('href', '/crm/quotes');
    expect(screen.getByRole('cell', { name: /^186\s000$/u })).toBeVisible();
  });
});

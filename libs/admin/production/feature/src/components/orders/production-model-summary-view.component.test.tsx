import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProductionModelSummaryView } from './production-model-summary-view';

import type { ComponentProps } from 'react';

type Summary = ComponentProps<typeof ProductionModelSummaryView>['summary'];

const row = {
  modelCode: 'MOD-052',
  modelName: 'Куртка «Віол»',
  season: 'Зима',
  category: 'Куртка',
  quantity: 12,
  ordersCount: 2,
};

const summary = (patch: Partial<Summary> = {}): Summary => ({
  rows: [row],
  totalQuantity: 12,
  loading: false,
  error: null,
  sort: [],
  setSort: vi.fn(),
  reload: vi.fn(),
  ...patch,
});

afterEach(cleanup);

describe('ProductionModelSummaryView', () => {
  it('lists the models and opens the list of one model', async () => {
    const onView = vi.fn();
    render(<ProductionModelSummaryView summary={summary()} onView={onView} />);

    expect(screen.getByText('Куртка «Віол»')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: /Переглянути/ }));
    expect(onView).toHaveBeenCalledWith(row);
  });

  it('offers a retry when the summary failed', async () => {
    const reload = vi.fn();
    render(
      <ProductionModelSummaryView
        summary={summary({ error: 'Не вдалося', reload })}
        onView={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(reload).toHaveBeenCalled();
    expect(screen.queryByText('Куртка «Віол»')).toBeNull();
  });

  it('shows the priority sort editor only when expanded', async () => {
    render(<ProductionModelSummaryView summary={summary()} onView={vi.fn()} />);

    const toggle = screen.getByRole('button', { name: /Сортування за пріоритетом/ });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    await userEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });
});

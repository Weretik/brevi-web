import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { QuoteProductionOrders } from './quote-production-orders';

const fixture = vi.hoisted(() => ({
  queries: [] as unknown[],
  items: [] as Record<string, unknown>[],
}));

vi.mock('@admin/production/data-access', () => ({
  useGetProductionOrdersQuery: (query: unknown) => {
    fixture.queries.push(query);
    return {
      isFetching: false,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      data: { items: fixture.items, page: 1, pageSize: 20, total: fixture.items.length },
    };
  },
}));

afterEach(() => {
  cleanup();
  fixture.queries = [];
  fixture.items = [];
});

const order = { id: 5, number: 31, status: 'New', totalQuantity: 40 };

describe('QuoteProductionOrders', () => {
  it('lists the orders of the КП and passes it to the workshop', async () => {
    fixture.items = [order];
    const onPass = vi.fn();
    render(
      <MemoryRouter>
        <QuoteProductionOrders quoteId={10} canCreate onPass={onPass} />
      </MemoryRouter>,
    );

    expect(fixture.queries[0]).toEqual(expect.objectContaining({ quoteId: 10 }));
    expect(screen.getByRole('link', { name: '№31' })).toHaveAttribute(
      'href',
      '/production/orders/5',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Передати в цех' }));
    expect(onPass).toHaveBeenCalledOnce();
  });

  it('says nothing went to the workshop yet', () => {
    render(
      <MemoryRouter>
        <QuoteProductionOrders quoteId={10} canCreate onPass={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Ще не передано в цех.')).toBeVisible();
  });

  it('is hidden from who may not create orders when the КП has none', () => {
    const { container } = render(
      <MemoryRouter>
        <QuoteProductionOrders quoteId={10} canCreate={false} onPass={vi.fn()} />
      </MemoryRouter>,
    );

    expect(container).toBeEmptyDOMElement();
  });
});

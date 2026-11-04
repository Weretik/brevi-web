import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ProductionOrderCreatePage from './production-order-create-page';

const api = vi.hoisted(() => ({
  create: vi.fn(),
  draft: {
    quoteId: 7,
    number: 'КП-7',
    clientName: 'School 5',
    managerName: 'Олена',
    items: [
      {
        quoteItemId: 11,
        name: 'Куртка',
        modelCode: 'MOD-025',
        norm: {
          oneColor: 1.5,
          twoColorsMain: null,
          twoColorsAdditional: null,
          threeColorsMain: null,
          threeColorsAdditional1: null,
          threeColorsAdditional2: null,
        },
        options: [
          {
            optionId: 21,
            title: 'Основна',
            fabricCode: 'FAB-1',
            fabricName: 'Оксфорд',
            retail: null,
            wholesale: null,
            large: null,
            sewingRate: null,
          },
        ],
      },
    ],
  },
}));

vi.mock('@admin/production/data-access', () => ({
  useGetProductionQuoteSourcesQuery: () => ({
    data: [
      {
        id: 7,
        number: 'КП-7',
        clientName: 'School 5',
        responsibleName: 'Олена',
        lastSentAt: null,
        ordersCount: 0,
      },
    ],
    isLoading: false,
    isFetching: false,
  }),
  useGetProductionQuoteDraftQuery: (_id: number, options: { skip: boolean }) => ({
    data: options.skip ? undefined : api.draft,
    isLoading: false,
    isFetching: false,
  }),
  useCreateProductionOrderMutation: () => [
    (body: unknown) => ({
      unwrap: () => {
        api.create(body);
        return Promise.resolve({ id: 99, number: 30 });
      },
    }),
    { isLoading: false },
  ],
}));

afterEach(cleanup);

const renderPage = (canCreate = true) =>
  render(
    <MemoryRouter initialEntries={['/production/orders/new']}>
      <Routes>
        <Route
          path="/production/orders/new"
          element={
            <ProductionOrderCreatePage useOrderActor={() => ({ canCreate, canImport: false })} />
          }
        />
        <Route path="/production/orders/:id" element={<p>Картка завдання</p>} />
        <Route path="/production/orders" element={<p>Список завдань</p>} />
      </Routes>
    </MemoryRouter>,
  );

describe('ProductionOrderCreatePage', () => {
  it('passes a sent КП to the workshop with what the workshop needs', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /КП-7 · School 5/ }));
    fireEvent.click(await screen.findByRole('button', { name: 'Передати в цех' }));
    expect(await screen.findByText('Кількість — ціле число від 1.')).toBeTruthy();
    expect(api.create).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText(/Кількість, шт\./), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Готово до/), { target: { value: '2026-11-20' } });
    fireEvent.change(screen.getByLabelText(/Основний колір/), { target: { value: 'чорний' } });
    fireEvent.click(screen.getByRole('button', { name: 'Передати в цех' }));

    expect(await screen.findByText('Картка завдання')).toBeTruthy();
    expect(api.create).toHaveBeenCalledTimes(1);
    expect(api.create.mock.calls[0][0]).toMatchObject({
      quoteId: 7,
      requestId: expect.any(String),
      items: [{ quoteItemId: 11, quoteOptionId: 21, details: { quantity: 10 } }],
    });
  });

  it('sends the head of the workshop back to the list', () => {
    renderPage(false);
    expect(screen.getByText('Список завдань')).toBeTruthy();
  });
});

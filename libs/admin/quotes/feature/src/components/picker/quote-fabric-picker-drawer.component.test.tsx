import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { QuoteFabricPickerDrawer } from './quote-fabric-picker-drawer';

import type { QuoteItemDraft, QuoteOptionDraft } from '@admin/quotes/model';

const api = vi.hoisted(() => ({ calculate: vi.fn() }));

vi.mock('@admin/quotes/data-access', () => ({
  useSearchQuoteCatalogQuery: () => ({ data: { items: [], total: 0 }, isFetching: false }),
  useCalculateQuoteCustomSewingMutation: () => [
    (arg: unknown) => ({ unwrap: () => api.calculate(arg) }),
    { isLoading: false },
  ],
  useGetQuoteModelCompositionQuery: () => ({
    data: {
      productId: 10,
      fabrics: [{ articleId: 100, fabricId: 3, name: 'Саржа', meters: 1.4, isActive: true }],
      lines: [
        {
          kind: 'Operation',
          referenceId: 5,
          costCode: null,
          name: 'Пошив',
          unit: 'хв',
          quantity: 1,
          manualMinutes: null,
        },
      ],
    },
    isLoading: false,
    isError: false,
  }),
}));
vi.mock('@admin/references/data-access', () => ({
  useListFabricsQuery: () => ({
    data: [{ id: 8, name: 'Габардин', price: 150, providerName: 'Текстиль', isActive: true }],
    isLoading: false,
    isError: false,
  }),
}));

afterEach(cleanup);

const model = {
  key: 'item-1',
  id: 7,
  kind: 'Sewing',
  productId: 10,
  code: 'MOD-166',
  name: 'Костюм «Імпульс»',
  options: [],
  lines: [],
} as unknown as QuoteItemDraft;

describe('«Додати тканину» of a model', () => {
  it('prices another fabric from the Reference with the model lines and adds it as a row', async () => {
    api.calculate.mockResolvedValue({
      lines: [],
      variants: [
        {
          title: 'Габардин',
          fabrics: [
            { fabricId: 8, meters: 1.4, name: 'Габардин', details: null, pricePerMeter: 150 },
          ],
          minutes: 10,
          laborCost: 50,
          fullCost: 260,
          prices: { retail: 520, wholesale: 470, large: 430 },
          problems: [],
        },
      ],
    });
    const user = userEvent.setup();
    const onAdd = vi.fn<(options: QuoteOptionDraft[]) => void>();
    render(<QuoteFabricPickerDrawer item={model} onClose={vi.fn()} onAdd={onAdd} />);

    expect(screen.getByLabelText('Метрів на виріб')).toHaveValue('1,4');
    await user.click(screen.getByLabelText('Тканина'));
    await user.click(await screen.findByRole('option', { name: /Габардин/ }));

    expect(await screen.findByText(/^520(,00)?$/, {}, { timeout: 2000 })).toBeVisible();
    expect(api.calculate).toHaveBeenLastCalledWith({
      variants: [{ fabrics: [{ fabricId: 8, meters: 1.4 }] }],
      lines: [
        { kind: 'Operation', referenceId: 5, quantity: 1, manualMinutes: null, costCode: null },
      ],
    });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Додати (1)' })).toBeEnabled());
    await user.click(screen.getByRole('button', { name: 'Додати (1)' }));
    expect(onAdd.mock.calls[0][0]).toEqual([
      expect.objectContaining({
        articleId: null,
        title: 'Габардин',
        fabrics: [{ fabricId: 8, name: 'Габардин', meters: 1.4 }],
      }),
    ]);
  });
});

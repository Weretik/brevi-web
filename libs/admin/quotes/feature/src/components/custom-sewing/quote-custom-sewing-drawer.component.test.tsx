import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { QuoteCustomSewingDrawer } from './quote-custom-sewing-drawer';

import type { QuoteCustomSewingPrice, QuoteItemDraft } from '@admin/quotes/model';

const price: QuoteCustomSewingPrice = {
  lines: [
    { kind: 'Operation', referenceId: 5, name: 'Пошив', unit: 'хв', unitValue: 12, isActive: true },
  ],
  fabrics: [
    {
      fabricId: 3,
      meters: 1.5,
      name: 'Саржа',
      details: 'Саржа 240 г/м²',
      pricePerMeter: 100,
      minutes: 12,
      laborCost: 60,
      fullCost: 210,
      prices: { retail: 420, wholesale: 380, large: 350 },
      problems: [],
    },
  ],
};

const api = vi.hoisted(() => ({ calculate: vi.fn() }));

vi.mock('@admin/quotes/data-access', () => ({
  useCalculateQuoteCustomSewingMutation: () => [
    (arg: unknown) => ({ unwrap: () => api.calculate(arg) }),
    { isLoading: false },
  ],
}));
vi.mock('@admin/references/data-access', () => ({
  useListFabricsQuery: () => ({
    data: [{ id: 3, name: 'Саржа', price: 100, providerName: 'Текстиль', isActive: true }],
    isLoading: false,
    isError: false,
  }),
  useListGarmentAccessoriesQuery: () => ({ data: [], isLoading: false, isError: false }),
  useListGarmentPartOperationsQuery: () => ({
    data: [
      {
        id: 5,
        name: 'Пошив',
        garmentPartName: 'Куртка',
        variant: null,
        min: 12,
        minutesPerProduct: false,
        isActive: true,
      },
    ],
    isLoading: false,
    isError: false,
  }),
}));

const choose = async (user: ReturnType<typeof userEvent.setup>, label: string, option: RegExp) => {
  await user.click(screen.getByLabelText(label));
  await user.click(await screen.findByRole('option', { name: option }));
};

beforeEach(() => {
  api.calculate.mockReset();
  api.calculate.mockResolvedValue(price);
});
afterEach(cleanup);

describe('«Виріб з нуля» panel', () => {
  it('prices the composition by the Catalog formula and adds the item to the КП', async () => {
    const user = userEvent.setup();
    const onDone = vi.fn<(item: QuoteItemDraft) => void>();
    render(<QuoteCustomSewingDrawer onClose={vi.fn()} onDone={onDone} />);

    expect(screen.getByText('Вкажіть назву виробу.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Додати в КП' })).toBeDisabled();

    await user.type(screen.getByLabelText(/Назва виробу/), 'Куртка охоронця');
    await choose(user, 'Додати тканину', /Саржа/);
    await user.type(screen.getByLabelText('Метрів: Саржа'), '1,5');
    await choose(user, 'Додати операцію', /Пошив/);

    expect(await screen.findByText(/^420(,00)? ₴$/, {}, { timeout: 2000 })).toBeVisible();
    expect(api.calculate).toHaveBeenLastCalledWith({
      fabrics: [{ fabricId: 3, meters: 1.5 }],
      lines: [{ kind: 'Operation', referenceId: 5, quantity: 1, manualMinutes: null }],
    });

    await waitFor(() => expect(screen.getByRole('button', { name: 'Додати в КП' })).toBeEnabled());
    await user.click(screen.getByRole('button', { name: 'Додати в КП' }));
    const item = onDone.mock.calls[0][0];
    expect(item).toMatchObject({ kind: 'CustomSewing', name: 'Куртка охоронця', productId: null });
    expect(item.options).toHaveLength(1);
    expect(item.options[0]).toMatchObject({ fabricId: 3, fabricMeters: 1.5, title: 'Саржа' });
    expect(item.lines).toEqual([
      {
        kind: 'Operation',
        referenceId: 5,
        name: 'Пошив',
        unit: 'хв',
        quantity: 1,
        manualMinutes: null,
      },
    ]);
  });
});

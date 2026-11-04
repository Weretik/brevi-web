import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SewingPricingFeature } from './sewing-pricing-feature';

import type { SewingPriceCalculation } from '@admin/products/model';

const mocks = vi.hoisted(() => ({
  getPublished: vi.fn(),
  getCalculation: vi.fn(),
}));
vi.mock('@admin/products/data-access', () => ({
  useGetPublishedSewingPriceQuery: mocks.getPublished,
  useGetSewingCalculationQuery: mocks.getCalculation,
}));

const calculation: SewingPriceCalculation = {
  id: '11111111-1111-4111-8111-111111111111',
  productId: 42,
  articleId: 501,
  saleSku: '246',
  createdAt: '2026-10-25T10:00:00Z',
  compositionVersion: 5,
  settingsVersionId: 1,
  settingsRevision: 1,
  referenceVersionIds: [11],
  calculated: true,
  costs: [{ kind: 'materials', amount: 100 }],
  minutes: 10,
  minuteCost: 2,
  fullCost: 200,
  prices: { retail: 310, wholesale: 264, largeWholesale: 250 },
  blockers: [],
};
const props = { productId: 42, articleId: 501 };
const published = {
  id: 'p',
  productId: 42,
  articleId: 501,
  calculationId: calculation.id,
  publishedAt: '2026-10-25T09:00:00Z',
  prices: { retail: 310, wholesale: 264, largeWholesale: 250 },
};
const apiError = (status: number) => ({
  code: status === 404 ? 'NotFound' : 'Conflict',
  status,
  message: 'Перевірте дані.',
  fieldErrors: {},
});

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getPublished.mockReturnValue({
    currentData: undefined,
    isFetching: false,
    error: apiError(404),
    refetch: vi.fn(),
  });
  mocks.getCalculation.mockImplementation(({ calculationId }: { calculationId: string }) => ({
    currentData: calculationId ? calculation : undefined,
    isFetching: false,
    refetch: vi.fn(),
  }));
});
afterEach(cleanup);

describe('Article price (published automatically)', () => {
  it('shows the published tiers and the breakdown of their calculation, without write buttons', () => {
    mocks.getPublished.mockReturnValue({
      currentData: published,
      isFetching: false,
      refetch: vi.fn(),
    });
    render(
      <SewingPricingFeature
        {...props}
        fabric={{ name: 'Габардин', pricePerMetre: 200, metres: 2.5 }}
      />,
    );
    expect(screen.getByText('Повна собівартість')).toBeTruthy();
    // The fabric of the price and the labour tiles (client items 12, 13).
    expect(screen.getByRole('heading', { name: 'Ціна: Габардин' })).toBeTruthy();
    expect(screen.getByText(/2,5 м =/)).toBeTruthy();
    expect(screen.getByText('Час операцій')).toBeTruthy();
    expect(screen.getByText('Вартість хвилини')).toBeTruthy();
    expect(screen.getByText('Трудовитрати, грн')).toBeTruthy();
    expect(screen.getByText('10 хв')).toBeTruthy();
    expect(screen.getByText('Роздріб · 1–9 шт.')).toBeTruthy();
    expect(screen.getByText('Опт · 10–40 шт.')).toBeTruthy();
    expect(screen.getByText('Великий опт · 41+ шт.')).toBeTruthy();
    expect(mocks.getCalculation).toHaveBeenCalledWith(
      { productId: 42, articleId: 501, calculationId: calculation.id },
      { skip: false },
    );
    expect(screen.queryByRole('button', { name: 'Розрахувати ціну' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Опублікувати ціну' })).toBeNull();
  });

  it('explains a missing price and does not load a calculation', () => {
    render(<SewingPricingFeature {...props} />);
    expect(
      screen.getByText('Ціни ще немає: перевірте тканину, комплектацію і трудовитрати.'),
    ).toBeTruthy();
    expect(mocks.getCalculation).toHaveBeenCalledWith(expect.anything(), { skip: true });
  });
});

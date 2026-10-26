import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SewingPricingFeature } from './sewing-pricing-feature';

import type { SewingPriceCalculation } from '@admin/products/model';

const mocks = vi.hoisted(() => ({
  getPublished: vi.fn(),
  getCalculation: vi.fn(),
  save: vi.fn(),
  publish: vi.fn(),
}));
vi.mock('@admin/products/data-access', () => ({
  useGetPublishedSewingPriceQuery: mocks.getPublished,
  useGetSewingCalculationQuery: mocks.getCalculation,
  useSaveSewingCalculationMutation: () => [mocks.save, { isLoading: false }],
  usePublishSewingCalculationMutation: () => [mocks.publish, { isLoading: false }],
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
const props = {
  productId: 42,
  articleId: 501,
  compositionVersion: 5,
  canManage: true,
  dirty: false,
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
  mocks.save.mockReturnValue({ unwrap: async () => calculation });
  mocks.publish.mockReturnValue({ unwrap: async () => ({}) });
});
afterEach(cleanup);

describe('Article pricing workflow', () => {
  it('retains the published tiers when a new calculation is blocked', async () => {
    const oldId = '44444444-4444-4444-8444-444444444444';
    const blocked = {
      ...calculation,
      calculated: false,
      prices: null,
      costs: [],
      fullCost: null,
      blockers: [{ code: 'UnreviewedOperation', inputKey: 'OperationLine:2' }],
    };
    mocks.getPublished.mockReturnValue({
      currentData: {
        id: 'p',
        productId: 42,
        articleId: 501,
        calculationId: oldId,
        publishedAt: '2026-10-25T09:00:00Z',
        prices: { retail: 471, wholesale: 400, largeWholesale: 350 },
      },
      isFetching: false,
      refetch: vi.fn(),
    });
    mocks.getCalculation.mockImplementation(({ calculationId }: { calculationId: string }) => ({
      currentData: calculationId === oldId ? { ...calculation, id: oldId } : blocked,
      isFetching: false,
      refetch: vi.fn(),
    }));
    mocks.save.mockReturnValue({ unwrap: async () => blocked });
    render(<SewingPricingFeature {...props} />);
    fireEvent.click(screen.getByRole('button', { name: 'Розрахувати ціну' }));
    await screen.findByText('Перевірте та підтвердьте операції у складі виробу.');
    expect(screen.getByText(/471/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Опублікувати ціну' })).toBeDisabled();
  });

  it('calculates and displays three tiers, then publishes only on explicit action', async () => {
    render(<SewingPricingFeature {...props} />);
    expect(screen.getByRole('button', { name: 'Опублікувати ціну' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Розрахувати ціну' }));
    await screen.findByText('Повна собівартість');
    expect(screen.getByText('Роздріб · 1–9 шт.')).toBeTruthy();
    expect(screen.getByText('Опт · 10–40 шт.')).toBeTruthy();
    expect(screen.getByText('Великий опт · 41+ шт.')).toBeTruthy();
    expect(mocks.publish).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Опублікувати ціну' }));
    await waitFor(() =>
      expect(mocks.publish).toHaveBeenCalledWith({
        productId: 42,
        articleId: 501,
        calculationId: calculation.id,
      }),
    );
  });

  it('blocks writes for dirty composition and hides writes for readers', () => {
    const view = render(<SewingPricingFeature {...props} dirty />);
    expect(screen.getByRole('button', { name: 'Розрахувати ціну' })).toBeDisabled();
    expect(screen.getByText('Спочатку збережіть або відкиньте зміни складу.')).toBeTruthy();
    view.rerender(<SewingPricingFeature {...props} canManage={false} />);
    expect(screen.queryByRole('button', { name: 'Розрахувати ціну' })).toBeNull();
  });

  it('shows actionable blockers and prevents publication', async () => {
    const blocked = {
      ...calculation,
      calculated: false,
      prices: null,
      costs: [],
      fullCost: null,
      blockers: [{ code: 'UnreviewedOperation', inputKey: 'OperationLine:2' }],
    };
    mocks.getCalculation.mockReturnValue({
      currentData: blocked,
      isFetching: false,
      refetch: vi.fn(),
    });
    render(<SewingPricingFeature {...props} />);
    expect(screen.getByText('Перевірте та підтвердьте операції у складі виробу.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Опублікувати ціну' })).toBeDisabled();
  });

  it('retains the calculation UUID after network failure and isolates Article switches', async () => {
    mocks.save.mockReturnValueOnce({
      unwrap: async () => {
        throw new Error('network');
      },
    });
    const view = render(<SewingPricingFeature key="501" {...props} />);
    fireEvent.click(screen.getByRole('button', { name: 'Розрахувати ціну' }));
    await screen.findByText('Не вдалося зберегти ціну. Спробуйте ще раз.');
    fireEvent.click(screen.getByRole('button', { name: 'Розрахувати ціну' }));
    await screen.findByText('Повна собівартість');
    expect(mocks.save.mock.calls[0]?.[0].requestId).toBe(mocks.save.mock.calls[1]?.[0].requestId);
    view.rerender(<SewingPricingFeature key="502" {...props} articleId={502} />);
    expect(screen.queryByText('Повна собівартість')).toBeNull();
  });

  it('requires recalculation after conflict or a composition version change', async () => {
    mocks.publish.mockReturnValue({
      unwrap: async () => {
        throw apiError(409);
      },
    });
    const view = render(<SewingPricingFeature {...props} />);
    fireEvent.click(screen.getByRole('button', { name: 'Розрахувати ціну' }));
    await screen.findByText('Повна собівартість');
    fireEvent.click(screen.getByRole('button', { name: 'Опублікувати ціну' }));
    await screen.findByText('Дані змінилися. Розрахуйте ціну повторно перед публікацією.');
    expect(screen.getByRole('button', { name: 'Опублікувати ціну' })).toBeDisabled();
    view.rerender(<SewingPricingFeature {...props} compositionVersion={6} />);
    expect(screen.getByRole('button', { name: 'Опублікувати ціну' })).toBeDisabled();
  });
});

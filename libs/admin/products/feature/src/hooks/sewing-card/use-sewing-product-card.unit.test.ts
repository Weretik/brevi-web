import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useSewingProductCard } from './use-sewing-product-card';

import type { ProductDetail } from '@admin/products/model';

const card = vi.hoisted(() => ({
  row: { isActive: true, sectionId: 7 },
  summaryLoaded: true,
  articles: [] as unknown[],
  sectionNames: new Map([[7, 'Костюми']]),
}));
const ready = vi.hoisted(() => vi.fn(() => false));

vi.mock('@admin/products/model', () => ({ isSewingCreateReady: ready }));
vi.mock('../sewing-model/use-sewing-model-card', () => ({
  useSewingModelCard: () => ({ card, model: {}, writes: {}, modelCode: '992' }),
}));
vi.mock('./use-sewing-card-tab', () => ({
  useSewingCardTab: () => ({ tab: 'main', setTab: vi.fn() }),
}));
vi.mock('../product-access/use-can-see-cost', () => ({ useCanSeeCost: () => true }));
vi.mock('../product-overview/use-product-active-switch', () => ({
  useProductActiveSwitch: () => ({}),
}));

const product = { id: 5 } as ProductDetail;

describe('useSewingProductCard', () => {
  it('names the section and is not launched while the model is not ready to sell', () => {
    const { result } = renderHook(() => useSewingProductCard({ product }));

    expect(result.current.sectionName).toBe('Костюми');
    expect(result.current.launched).toBe(false);

    ready.mockReturnValue(true);
    const again = renderHook(() => useSewingProductCard({ product }));
    expect(again.result.current.launched).toBe(true);
  });

  it('opens editing and the prices of one article', () => {
    const { result } = renderHook(() => useSewingProductCard({ product }));

    act(() => {
      result.current.setEditing(true);
      result.current.setPricingArticleId(12);
    });

    expect(result.current.editing).toBe(true);
    expect(result.current.pricingArticleId).toBe(12);
  });
});

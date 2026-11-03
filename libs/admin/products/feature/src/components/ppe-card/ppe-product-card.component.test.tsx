import { cleanup, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PpeProductCard } from './ppe-product-card';
import { render } from '../../test-utils';

import type { ProductDetail, PpeSupplierOffer } from '@admin/products/model';

const mocks = vi.hoisted(() => ({ card: vi.fn(), save: vi.fn() }));

vi.mock('../../hooks/ppe-card/use-ppe-card', () => ({ usePpeCard: mocks.card }));
vi.mock('@admin/products/data-access', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@admin/products/data-access')>()),
  useUpdatePpeSupplierOfferMutation: () => [
    mocks.save,
    { isLoading: false, error: undefined, reset: vi.fn() },
  ],
}));

const product = { id: 3, name: 'Костюм ВОЛОГОЗАХИСНИЙ', type: 'Ppe' } as ProductDetail;
const offer: PpeSupplierOffer = {
  productId: 3,
  unit: 'шт.',
  supplierId: 5,
  supplierName: 'АВ-Центр',
  supplierSku: 'CARINA',
  supplierUrl: 'https://avcentr.com.ua/ua/kostyum-carina',
  supplierPrice: 518.64,
  allowManualPrice: false,
  ruleCode: 'Одяг ЗІЗ — АВ-Центр',
  insightWholesale: null,
  insightRetail: null,
  offerVersionId: '8b0a4f43-7f0e-4c6a-9f1e-2a2f0c9d1e11',
  priceUpdatedAt: '2026-11-03T15:00:00Z',
  prices: { retail: 777.96, wholesale: 674.23, largeWholesale: 622.37 },
  blockers: [],
};

function cardData(update: Partial<PpeSupplierOffer> = {}, canManage = true) {
  const data = { ...offer, ...update };
  return {
    row: {
      id: 3,
      type: 'Ppe',
      code: '3',
      name: 'Костюм ВОЛОГОЗАХИСНИЙ',
      sectionId: 9,
      season: null,
      isActive: true,
      isVerified: true,
      verifiedOn: '09.09.2026',
      currentSiteUrl: 'https://brevi.com.ua/odyag-vologozahysnyj/kostyum-vologozahysnyj',
      quoteDescription: null,
      updatedAtUtc: '2026-11-03T10:00:00Z',
    },
    sections: [],
    sectionNames: new Map([[9, 'Одяг вологозахисний']]),
    reloadOverview: vi.fn(),
    offer: data,
    offerLoading: false,
    offerError: null,
    reloadOffer: vi.fn(),
    canManage,
    suppliers: [{ id: 5, name: 'АВ-Центр', isActive: true }],
    ruleNames: ['Одяг ЗІЗ — АВ-Центр'],
    rule: {
      retailMarkup: 0.5,
      wholesaleMarkup: 0.3,
      largeWholesaleMarkup: 0.2,
      priceNote: 'Оптова ціна діє від 10 од.',
    },
    reasons: data.prices ? [] : ['Не вибрано правило ціноутворення'],
    status: data.prices ? null : { label: 'Не вибрано правило ціноутворення', tone: 'warning' },
  };
}

function renderCard() {
  render(
    <MemoryRouter>
      <PpeProductCard product={product} onDeleted={vi.fn()} />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  mocks.card.mockReturnValue(cardData());
  mocks.save.mockReset();
  mocks.save.mockResolvedValue({ data: offer });
});

afterEach(cleanup);

describe('PpeProductCard', () => {
  it('shows the sheet row, the three prices and the rule note', () => {
    renderCard();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Костюм ВОЛОГОЗАХИСНИЙ' }),
    ).toBeInTheDocument();
    expect(screen.getByText('3 · Одяг вологозахисний')).toBeInTheDocument();
    const prices = screen.getByRole('region', { name: 'Ціни' });
    expect(within(prices).queryByText('Готово до розрахунку')).not.toBeInTheDocument();
    expect(within(prices).getByText('Роздріб, від 1 шт.')).toBeInTheDocument();
    expect(within(prices).getByText('50 %')).toBeInTheDocument();
    expect(
      within(prices).getByText('Примітка в прайсі: Оптова ціна діє від 10 од.'),
    ).toBeInTheDocument();
  });

  it('saves a new supplier price with the current offer version', async () => {
    const user = userEvent.setup();
    renderCard();

    const price = screen.getByRole('textbox', { name: 'Ціна постачальника, грн' });
    await user.clear(price);
    await user.type(price, '520,50');
    await user.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(mocks.save).toHaveBeenCalledWith({
      productId: 3,
      body: expect.objectContaining({
        supplierId: 5,
        supplierPrice: 520.5,
        expectedOfferVersionId: offer.offerVersionId,
      }),
    });
  });

  it('shows the reasons without prices and has no save for a reader', () => {
    mocks.card.mockReturnValue(cardData({ prices: null, blockers: ['MissingRule'] }, false));
    renderCard();

    expect(screen.getAllByText('Не вибрано правило ціноутворення').length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: 'Зберегти' })).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Ціна постачальника, грн' })).toBeDisabled();
  });
});

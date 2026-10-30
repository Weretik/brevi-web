import { QuotePriceComparison, QuoteVersionComparison } from '@admin/clients/ui';
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { quoteDetailFixture } from '../../../testing/quotes/quote-detail.fixture';

import type { QuotePriceBasis, QuoteVersion } from '@admin/clients/model';

const saved: QuotePriceBasis = {
  token: 'saved',
  expiresAt: 1,
  selection: { kind: 'ppe', productId: 42 },
  retail: 100,
  wholesale: 90,
  largeWholesale: 80,
  blockers: [],
  currency: 'UAH',
  taxBasis: 'catalog_no_extra_vat',
  source: null,
};

describe('quote reprice comparison presentation (SC-Q02)', () => {
  afterEach(cleanup);
  it('treats a legitimate product change between saved versions as history rather than a mismatched preview', () => {
    const detail = quoteDetailFixture();
    const before: QuoteVersion = {
      publicId: detail.versionId,
      versionNumber: 1,
      action: 'created',
      actorId: 17,
      createdAt: detail.updatedAt,
      draft: detail.draft,
    };
    const selection = { kind: 'ppe' as const, productId: 43 };
    const after: QuoteVersion = {
      ...before,
      versionNumber: 2,
      action: 'edited',
      draft: {
        ...before.draft,
        items: before.draft.items.map((item) => ({
          ...item,
          variants: item.variants.map((variant) => ({
            ...variant,
            selection,
            basis: {
              origin: 'saved' as const,
              value: { ...variant.basis!.value, selection, retail: 150 },
            },
          })),
        })),
      },
    };
    render(<QuoteVersionComparison before={before} after={after} />);
    expect(screen.getByRole('columnheader', { name: 'Обрана версія' })).toBeInTheDocument();
    expect(
      screen.queryByRole('columnheader', { name: 'Після перерахунку' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Вибір товару або умови ціни змінено.')).toBeInTheDocument();
    expect(
      screen.queryByText('Розрахунок не відповідає збереженому вибору.'),
    ).not.toBeInTheDocument();
  });
  it('shows every old/new tier and a missing price without a zero fallback', () => {
    render(
      <QuotePriceComparison
        title="Варіант"
        previous={saved}
        next={{ ...saved, wholesale: null, blockers: ['Unavailable'] }}
      />,
    );
    const table = screen.getByRole('table', { name: 'Порівняння цін: Варіант' });
    expect(within(table).getAllByRole('row')).toHaveLength(4);
    expect(within(table).getByText('Ціна недоступна')).toBeInTheDocument();
    expect(screen.getByText(/Перерахунок заблоковано/)).toBeInTheDocument();
    expect(saved.wholesale).toBe(90);
  });
  it('reports mismatched selection and unknown source provenance explicitly', () => {
    render(
      <QuotePriceComparison
        title="Варіант"
        previous={{ ...saved, source: undefined }}
        next={{ ...saved, selection: { kind: 'ppe', productId: 43 } }}
      />,
    );
    expect(screen.getByText(/не відповідає збереженому вибору/)).toBeInTheDocument();
    expect(screen.getByText('Відомості для порівняння джерел відсутні.')).toBeInTheDocument();
  });
});

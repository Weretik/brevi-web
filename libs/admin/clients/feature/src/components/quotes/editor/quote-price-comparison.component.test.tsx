import { QuotePriceComparison } from '@admin/clients/ui';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { QuotePriceBasis } from '@admin/clients/model';

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

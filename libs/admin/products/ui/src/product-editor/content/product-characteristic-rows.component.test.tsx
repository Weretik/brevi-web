import { emptyProductDraft } from '@admin/products/model';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import { ProductCharacteristicRows } from './product-characteristic-rows';

import type { ProductDraft } from '@admin/products/model';

function RowsHarness() {
  const [draft, setDraft] = useState<ProductDraft>({
    ...emptyProductDraft('Sewing'),
    characteristicTables: [
      {
        titleUk: 'Розмір',
        titleRu: 'Размер',
        sortOrder: 0,
        rows: [
          { labelUk: 'Перший', labelRu: 'Первый', valueUk: 'А', valueRu: 'А', sortOrder: 0 },
          { labelUk: 'Другий', labelRu: 'Второй', valueUk: 'Б', valueRu: 'Б', sortOrder: 1 },
        ],
      },
    ],
  });
  return (
    <>
      <ProductCharacteristicRows
        tableIndex={0}
        rows={draft.characteristicTables?.[0].rows ?? []}
        setDraft={setDraft}
      />
      <output data-testid="rows-payload">
        {JSON.stringify(draft.characteristicTables?.[0].rows)}
      </output>
    </>
  );
}

describe('characteristic row editor', () => {
  it('moves rows and edits Russian content in the selected row', () => {
    render(<RowsHarness />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Вгору' })[1]);
    expect(screen.getAllByRole('textbox', { name: 'Ознака українською' })[0]).toHaveValue('Другий');
    fireEvent.change(screen.getAllByRole('textbox', { name: 'Значення російською' })[0], {
      target: { value: 'Нове' },
    });
    const rows = JSON.parse(screen.getByTestId('rows-payload').textContent ?? '[]') as Array<{
      labelUk: string;
      valueRu: string;
      sortOrder: number;
    }>;
    expect(rows).toMatchObject([
      { labelUk: 'Другий', valueRu: 'Нове', sortOrder: 0 },
      { labelUk: 'Перший', sortOrder: 1 },
    ]);
  });
});

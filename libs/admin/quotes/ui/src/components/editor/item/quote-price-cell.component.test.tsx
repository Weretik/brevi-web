import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { QuotePriceCell } from './quote-price-cell';

afterEach(cleanup);

const price = { source: 19.9, manual: '', shown: true };

describe('QuotePriceCell', () => {
  it('shows a sewing price read-only', () => {
    render(
      <QuotePriceCell
        tier="large"
        price={price}
        editable={false}
        label="Імпульс, Саржа"
        onManualChange={vi.fn()}
      />,
    );
    expect(screen.getByText(/19,90/)).toBeVisible();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('lets a PPE price be typed and marks it «вручну» next to the Catalog one', () => {
    const onManualChange = vi.fn();
    const { rerender } = render(
      <QuotePriceCell
        tier="retail"
        price={price}
        editable
        label="Рукавиці, Ціна"
        onManualChange={onManualChange}
      />,
    );
    fireEvent.change(screen.getByLabelText('Ціна: Рукавиці, Ціна, до 9 шт.'), {
      target: { value: '18,5' },
    });
    expect(onManualChange).toHaveBeenCalledWith('18,5');
    expect(screen.queryByText('вручну')).not.toBeInTheDocument();

    rerender(
      <QuotePriceCell
        tier="retail"
        price={{ ...price, manual: '18,5' }}
        editable
        label="Рукавиці, Ціна"
        onManualChange={onManualChange}
      />,
    );
    expect(screen.getByText('вручну')).toBeVisible();
    expect(screen.getByLabelText(/Ціна каталогу: 19,90/)).toBeVisible();
  });
});

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { QuotePriceBox } from './quote-price-box';

afterEach(cleanup);

const price = { source: 1364.17, manual: '', shown: true };

describe('QuotePriceBox', () => {
  it('shows a sewing price read-only and toggles «показати в КП»', () => {
    const onShownChange = vi.fn();
    render(
      <QuotePriceBox
        tier="large"
        price={price}
        editable={false}
        label="Імпульс, Саржа"
        onShownChange={onShownChange}
        onManualChange={vi.fn()}
      />,
    );
    expect(screen.getByText('від 41 шт.')).toBeVisible();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Показати в КП: Імпульс, Саржа, від 41 шт.'));
    expect(onShownChange).toHaveBeenCalledWith(false);
  });

  it('lets a PPE price be typed over the Catalog one', () => {
    const onManualChange = vi.fn();
    render(
      <QuotePriceBox
        tier="retail"
        price={price}
        editable
        label="Рукавиці, Ціна"
        onShownChange={vi.fn()}
        onManualChange={onManualChange}
      />,
    );
    fireEvent.change(screen.getByLabelText('Ціна: Рукавиці, Ціна, до 9 шт.'), {
      target: { value: '1200' },
    });
    expect(onManualChange).toHaveBeenCalledWith('1200');
  });
});

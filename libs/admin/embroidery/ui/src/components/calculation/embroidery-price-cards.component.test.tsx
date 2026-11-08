import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { EmbroideryPriceCards } from './embroidery-price-cards';

afterEach(cleanup);

const prices = [
  { name: 'Категорія 1', markupPercent: 90, unit: 96.83, total: 4841.5, repeatUnit: 82.7 },
];

describe('EmbroideryPriceCards', () => {
  it('shows a server reason instead of prices', () => {
    render(
      <EmbroideryPriceCards
        prices={[]}
        quantity={5}
        error="Заготовка ширша за рулон."
        missing={[]}
        missingAction={null}
        waiting={false}
        fetching={false}
        onCopy={vi.fn()}
      />,
    );
    expect(screen.getByText('Заготовка ширша за рулон.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Копіювати ціни' })).not.toBeInTheDocument();
  });

  it('copies the unit price of one category', () => {
    const onCopy = vi.fn();
    render(
      <EmbroideryPriceCards
        prices={prices}
        quantity={50}
        error={null}
        missing={[]}
        missingAction={null}
        waiting={false}
        fetching={false}
        onCopy={onCopy}
      />,
    );
    expect(screen.getByText('+90%')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Копіювати ціну за 1 шт: Категорія 1' }));
    expect(onCopy).toHaveBeenCalledWith(prices[0]);
  });
});

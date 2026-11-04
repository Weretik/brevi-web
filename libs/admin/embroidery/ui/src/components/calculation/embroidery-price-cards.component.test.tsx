import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { EmbroideryPriceCards } from './embroidery-price-cards';

afterEach(cleanup);

const prices = [{ name: 'Опт', markupPercent: 60, unit: 81.54, total: 4077, repeatUnit: 69.64 }];

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

  it('copies one price level', () => {
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
    expect(screen.getByText('+60%')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Копіювати ціну Опт' }));
    expect(onCopy).toHaveBeenCalledWith(prices[0]);
  });
});

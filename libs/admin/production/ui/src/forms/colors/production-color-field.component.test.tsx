import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProductionColorField } from './production-color-field';

afterEach(cleanup);

describe('ProductionColorField', () => {
  it('offers only the colours of «Кольори»', async () => {
    const onChange = vi.fn();
    render(
      <ProductionColorField
        label="Колір"
        value=""
        colors={['Чорний', 'Синій']}
        onChange={onChange}
      />,
    );
    fireEvent.change(screen.getByLabelText('Колір'), { target: { value: 'син' } });
    fireEvent.click(await screen.findByRole('option', { name: 'Синій' }));
    expect(screen.queryByRole('option', { name: 'Чорний' })).toBeNull();
    expect(onChange).toHaveBeenCalledWith('Синій');
  });

  it('keeps a colour the record already had outside the list', () => {
    render(
      <ProductionColorField
        label="Колір"
        value="Темно-синій 1076"
        colors={['Чорний']}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('Колір')).toHaveProperty('value', 'Темно-синій 1076');
  });
});

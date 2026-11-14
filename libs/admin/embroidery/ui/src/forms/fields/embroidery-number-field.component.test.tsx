import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { EmbroideryNumberField, parseEmbroideryNumber } from './embroidery-number-field';

afterEach(cleanup);

describe('EmbroideryNumberField', () => {
  it('reads a comma or a dot and gives null for empty text', () => {
    expect(parseEmbroideryNumber('0,30')).toBe(0.3);
    expect(parseEmbroideryNumber('1 000')).toBe(1000);
    expect(parseEmbroideryNumber('')).toBeNull();
    expect(parseEmbroideryNumber('abc')).toBeNull();
  });

  it('keeps what the person types while reporting the number', () => {
    const onChange = vi.fn();
    render(<EmbroideryNumberField label="Ставка" value={null} onChange={onChange} />);
    const input = screen.getByLabelText('Ставка');
    fireEvent.change(input, { target: { value: '0,' } });
    expect(input).toHaveValue('0,');
    expect(onChange).toHaveBeenLastCalledWith(0);
  });
});

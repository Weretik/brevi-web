import { render, screen } from '@testing-library/react';

import { StitchLabel } from './stitch-label';

describe('StitchLabel', () => {
  it('shows the number and caption and hides the decorative seam from assistive technology', () => {
    const { container } = render(<StitchLabel index="01">Шиємо самі</StitchLabel>);

    expect(screen.getByText('01')).toBeTruthy();
    expect(screen.getByText('Шиємо самі')).toBeTruthy();
    expect(container.querySelector('[aria-hidden]')?.className).toContain('border-dashed');
  });
});

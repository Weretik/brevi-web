import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RouteErrorBoundary } from './route-error-boundary';

let shouldThrow = true;

function Broken() {
  if (shouldThrow) {
    throw new Error('boom');
  }
  return <p>Працює</p>;
}

describe('RouteErrorBoundary', () => {
  it('shows the 500 page instead of a white screen and recovers on retry', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    shouldThrow = true;
    render(
      <RouteErrorBoundary>
        <Broken />
      </RouteErrorBoundary>,
    );

    expect(screen.getByRole('heading', { name: 'Щось пішло не так' })).toBeTruthy();
    expect(screen.getByText('500')).toBeTruthy();

    shouldThrow = false;
    fireEvent.click(screen.getByRole('button', { name: 'Спробувати ще раз' }));
    expect(screen.getByText('Працює')).toBeTruthy();
  });
});

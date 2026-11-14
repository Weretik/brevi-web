import { act, renderHook } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { useOrderQuickParam } from './use-order-quick-param';

import type { ReactNode } from 'react';

function render(initialUrl: string) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[initialUrl]}>{children}</MemoryRouter>
  );
  return renderHook(() => ({ quick: useOrderQuickParam(), location: useLocation() }), {
    wrapper,
  });
}

describe('useOrderQuickParam', () => {
  it('reads the open order from ?order=', () => {
    const { result } = render('/production/orders?order=17&q=x');

    expect(result.current.quick.orderId).toBe(17);
  });

  it('treats a missing or broken value as no open order', () => {
    expect(render('/production/orders').result.current.quick.orderId).toBeNull();
    expect(render('/production/orders?order=abc').result.current.quick.orderId).toBeNull();
  });

  it('opens and closes an order without losing the other params', () => {
    const { result } = render('/production/orders?q=x');

    act(() => result.current.quick.open(5));
    expect(result.current.quick.orderId).toBe(5);
    expect(result.current.location.search).toBe('?q=x&order=5');

    act(() => result.current.quick.close());
    expect(result.current.quick.orderId).toBeNull();
    expect(result.current.location.search).toBe('?q=x');
  });
});

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SupplierCardProvider } from './supplier-card-context';
import { SupplierName } from './supplier-name';

afterEach(cleanup);

describe('SupplierName (CARD-001)', () => {
  it('opens the app supplier panel without reaching the row under it', () => {
    const open = vi.fn();
    const row = vi.fn();
    render(
      <SupplierCardProvider open={open}>
        <div onClick={row}>
          <SupplierName name=" Атлас " id={7} />
        </div>
      </SupplierCardProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Постачальник: Атлас' }));
    expect(open).toHaveBeenCalledWith({ id: 7, name: 'Атлас' });
    expect(row).not.toHaveBeenCalled();
  });

  it('shows plain text without the panel and a dash for no name', () => {
    render(
      <>
        <span>
          <SupplierName name="Атлас" />
        </span>
        <span>
          <SupplierName name="" />
        </span>
      </>,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Атлас')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});

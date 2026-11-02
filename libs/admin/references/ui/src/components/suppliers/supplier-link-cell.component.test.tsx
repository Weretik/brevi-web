import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { SupplierLinkCell } from './supplier-link-cell';

afterEach(cleanup);

describe('SupplierLinkCell', () => {
  it('opens a domain safely in a new tab with the grid keyboard tab stop', () => {
    render(<SupplierLinkCell value="supplier.example" tabIndex={0} />);
    const link = screen.getByRole('link', { name: 'supplier.example' });
    expect(link).toHaveAttribute('href', 'https://supplier.example/');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('tabindex', '0');
  });

  it('keeps unsupported schemes as plain text', () => {
    render(<SupplierLinkCell value="javascript:alert(1)" tabIndex={-1} />);
    expect(screen.getByText('javascript:alert(1)')).toBeVisible();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('marks a missing link with a dash', () => {
    render(<SupplierLinkCell value={null} tabIndex={-1} />);
    expect(screen.getByText('—')).toBeVisible();
  });
});

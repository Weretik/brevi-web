import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AccessRightsHeader } from './access-rights-header';

describe('AccessRightsHeader', () => {
  it('offers «Нова роль» only after the rights load', () => {
    const onNewRole = vi.fn();
    const { rerender } = render(<AccessRightsHeader loaded={false} onNewRole={onNewRole} />);
    expect(screen.queryByRole('button', { name: 'Нова роль' })).not.toBeInTheDocument();

    rerender(<AccessRightsHeader loaded onNewRole={onNewRole} />);
    fireEvent.click(screen.getByRole('button', { name: 'Нова роль' }));

    expect(onNewRole).toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Зберегти' })).not.toBeInTheDocument();
  });
});

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AccessRightsHeader } from './access-rights-header';

describe('AccessRightsHeader', () => {
  it('saves only a changed role', () => {
    const onSave = vi.fn();
    const { rerender } = render(
      <AccessRightsHeader
        canSave
        dirty={false}
        loaded
        onNewRole={vi.fn()}
        onSave={onSave}
        saving={false}
      />,
    );
    expect(screen.getByRole('button', { name: 'Зберегти' })).toBeDisabled();

    rerender(
      <AccessRightsHeader
        canSave
        dirty
        loaded
        onNewRole={vi.fn()}
        onSave={onSave}
        saving={false}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(onSave).toHaveBeenCalled();
  });

  it('shows no actions before the rights load and no save for the director', () => {
    const { rerender } = render(
      <AccessRightsHeader
        canSave
        dirty={false}
        loaded={false}
        onNewRole={vi.fn()}
        onSave={vi.fn()}
        saving={false}
      />,
    );
    expect(screen.queryByRole('button', { name: 'Нова роль' })).not.toBeInTheDocument();

    rerender(
      <AccessRightsHeader
        canSave={false}
        dirty={false}
        loaded
        onNewRole={vi.fn()}
        onSave={vi.fn()}
        saving={false}
      />,
    );
    expect(screen.getByRole('button', { name: 'Нова роль' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Зберегти' })).not.toBeInTheDocument();
  });
});

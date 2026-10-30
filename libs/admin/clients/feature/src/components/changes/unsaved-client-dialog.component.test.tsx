import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { UnsavedClientDialog } from './unsaved-client-dialog';

import type { Blocker } from 'react-router-dom';

const blocked = () =>
  ({
    state: 'blocked' as const,
    location: { pathname: '/elsewhere', search: '', hash: '', state: null, key: 'test' },
    proceed: vi.fn(),
    reset: vi.fn(),
  }) satisfies Blocker;
describe('unsaved and pending action navigation', () => {
  afterEach(cleanup);
  it('does not discard an unresolved quote write through the ordinary dirty prompt', () => {
    const blocker = blocked();
    render(<UnsavedClientDialog blocker={blocker} locked />);
    expect(screen.getByRole('dialog', { name: 'Незавершена дія' })).toBeInTheDocument();
    const discard = screen.getByRole('button', { name: 'Відхилити й вийти' });
    expect(discard).toBeDisabled();
    fireEvent.click(discard);
    expect(blocker.proceed).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Продовжити редагування' }));
    expect(blocker.reset).toHaveBeenCalledOnce();
  });
  it('retains explicit discard for ordinary unsaved input', () => {
    const blocker = blocked();
    render(<UnsavedClientDialog blocker={blocker} />);
    fireEvent.click(screen.getByRole('button', { name: 'Відхилити й вийти' }));
    expect(blocker.proceed).toHaveBeenCalledOnce();
  });
});

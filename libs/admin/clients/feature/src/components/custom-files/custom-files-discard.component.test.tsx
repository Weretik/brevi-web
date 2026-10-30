import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CustomFilesDiscard } from './custom-files-discard';

afterEach(cleanup);
describe('discard file link changes', () => {
  it('retains flags on cancel and discards only after explicit confirmation', async () => {
    const discard = vi.fn();
    render(<CustomFilesDiscard disabled={false} onDiscard={discard} />);
    fireEvent.click(screen.getByRole('button', { name: 'Скасувати зміни прив’язок' }));
    expect(discard).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Залишити зміни' }));
    expect(discard).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Скасувати зміни прив’язок' }));
    fireEvent.click(screen.getByRole('button', { name: 'Підтвердити скасування' }));
    expect(discard).toHaveBeenCalledOnce();
  });
});

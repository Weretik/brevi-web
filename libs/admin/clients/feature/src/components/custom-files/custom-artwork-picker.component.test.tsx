import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CustomArtworkPicker } from './custom-artwork-picker';

const api = vi.hoisted(() => ({ error: false }));
vi.mock('@admin/clients/data-access', () => ({
  useGetCustomFilesQuery: () => ({
    currentData: [{ id: 'real-server-file', contentType: 'image/png' }],
    error: api.error ? { status: 403 } : undefined,
  }),
}));
const rows = [
  {
    kind: 'print' as const,
    location: 'front',
    artworkFileId: null,
    cost: 1,
    saleAmount: 2,
    saleApproved: true,
  },
];
afterEach(() => {
  cleanup();
  api.error = false;
});
describe('application artwork from finalized files', () => {
  it('selects actual server file identity without changing application amounts', () => {
    const onChange = vi.fn();
    render(<CustomArtworkPicker id="draft" rows={rows} disabled={false} onChange={onChange} />);
    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByRole('option', { name: 'image/png · real-server-file' }));
    expect(onChange).toHaveBeenCalledWith([{ ...rows[0], artworkFileId: 'real-server-file' }]);
  });
  it('keeps a missing saved selection visible without inventing availability', () => {
    render(
      <CustomArtworkPicker
        id="draft"
        rows={[{ ...rows[0]!, artworkFileId: 'missing' }]}
        disabled={false}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole('combobox')).toHaveTextContent('Збережений макет недоступний');
  });
  it('hides cached artwork choices after denied read', () => {
    api.error = true;
    render(<CustomArtworkPicker id="draft" rows={rows} disabled={false} onChange={vi.fn()} />);
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('недоступні');
  });
});

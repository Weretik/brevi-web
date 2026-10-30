import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CustomVersionPicker } from './custom-version-picker';

const api = vi.hoisted(() => ({ listError: false, versionError: false }));
vi.mock('@admin/clients/data-access', () => ({
  useGetCustomSewingVersionsQuery: () => ({
    currentData: {
      rows: [{ id: 'v1', number: 1, name: 'Private version name' }],
      page: 1,
      totalPages: 2,
    },
    error: api.listError ? { status: 403 } : undefined,
    refetch: vi.fn(),
  }),
  useGetCustomSewingVersionQuery: () => ({
    currentData: {
      configuration: { name: 'Private cached configuration' },
      basis: { largeWholesale: 12345 },
    },
    error: api.versionError ? { status: 403 } : undefined,
    refetch: vi.fn(),
  }),
}));
afterEach(cleanup);
describe('custom version read access loss', () => {
  it.each(['list', 'version'])(
    'hides cached snapshot and selection controls on denied %s query',
    (source) => {
      api.listError = source === 'list';
      api.versionError = source === 'version';
      render(<CustomVersionPicker id="private-root" disabled={false} onPin={vi.fn()} />);
      expect(screen.queryByText(/Private cached configuration/)).not.toBeInTheDocument();
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Наступні версії' })).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Використати версію в КП' }),
      ).not.toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    },
  );
});

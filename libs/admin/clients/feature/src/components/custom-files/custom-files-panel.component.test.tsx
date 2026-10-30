import { emptyCustomConfiguration } from '@admin/clients/model';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CustomFilesPanel } from './custom-files-panel';

import type { CustomDetail } from '@admin/clients/model';

const api = vi.hoisted(() => ({ query: vi.fn(), upload: vi.fn(), save: vi.fn() }));
vi.mock('@admin/clients/data-access', () => ({
  useGetCustomFilesQuery: () => api.query(),
  useUploadCustomFileMutation: () => [api.upload],
  useSetCustomFilesMutation: () => [api.save],
  getCustomFileContent: vi.fn(),
}));
const detail: CustomDetail = {
  id: 'root',
  revision: 1,
  ownerId: 1,
  customerId: null,
  quoteId: null,
  configuration: emptyCustomConfiguration(),
  currentVersion: null,
  preview: null,
  updatedAt: '2026-10-28T10:00:00Z',
  canEdit: true,
};
beforeEach(() => {
  Object.values(api).forEach((mock) => mock.mockReset());
});
afterEach(cleanup);
describe('private files panel', () => {
  it('hides cached metadata and file controls when the list becomes inaccessible', () => {
    api.query.mockReturnValue({
      currentData: [{ id: 'private-cached-file', contentType: 'image/png' }],
      error: { status: 403, code: 'Forbidden', message: 'Denied', fieldErrors: {} },
      refetch: vi.fn(),
    });
    render(<CustomFilesPanel detail={detail} disabled={false} onAccepted={vi.fn()} />);
    expect(screen.queryByText(/private-cached-file/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Додати приватний файл' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Завантажити файл' })).not.toBeInTheDocument();
    expect(screen.getByText('Файли недоступні або доступ обмежено.')).toBeInTheDocument();
  });
  it('read-only history shows saved flags but no upload or unlink action', () => {
    api.query.mockReturnValue({
      currentData: [
        {
          id: 'historical-file',
          draftId: 'root',
          contentType: 'application/pdf',
          length: 50,
          sha256: 'A'.repeat(64),
          state: 'Uploaded',
          expiresAt: '2026-10-28T10:00:00Z',
          showInQuote: false,
          production: true,
          isFinalized: true,
        },
      ],
      refetch: vi.fn(),
    });
    render(
      <CustomFilesPanel detail={detail} versionId="v1" disabled={false} onAccepted={vi.fn()} />,
    );
    expect(screen.getByRole('checkbox', { name: 'Для виробництва' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Для виробництва' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Прибрати прив’язку' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Додати приватний файл' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Завантажити файл' })).toBeEnabled();
  });
});

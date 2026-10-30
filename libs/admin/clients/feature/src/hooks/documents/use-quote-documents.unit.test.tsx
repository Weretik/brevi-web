import { act, cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useQuoteDocuments } from './use-quote-documents';

import type { QuoteDetail } from '@admin/clients/model';

const api = vi.hoisted(() => ({
  render: vi.fn(),
  download: vi.fn(),
  status: vi.fn(),
  prepare: vi.fn(),
}));
vi.mock('@admin/clients/data-access', () => ({
  useGetIssuerSettingsQuery: () => ({
    isLoading: false,
    isFetching: false,
    error: null,
    data: { active: {} },
  }),
  usePrepareQuoteMutation: () => [api.prepare],
  useRenderQuotePdfMutation: () => [api.render],
  useLazyGetQuotePdfArtifactQuery: () => [api.status],
  downloadQuotePdfArtifact: api.download,
}));

const detail = {
  publicId: 'quote',
  versionId: 'version',
  revision: 1,
  number: '10/10/2026',
  state: 'ready',
  archived: false,
  canEdit: true,
} as QuoteDetail;
const artifact = {
  artifactId: 'artifact',
  status: 'succeeded',
  sha256: 'a'.repeat(64),
  length: 100,
  errorCode: null,
} as const;

let current: ReturnType<typeof useQuoteDocuments>;
function setup() {
  function Probe() {
    current = useQuoteDocuments(detail, false, vi.fn(), vi.fn());
    return null;
  }
  render(<Probe />);
}

describe('quote document access loss', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.render.mockReturnValue({ unwrap: () => Promise.resolve(artifact) });
  });
  afterEach(cleanup);

  it('explains an oversized seasonal layout before ready', async () => {
    api.prepare.mockReturnValue({
      unwrap: () =>
        Promise.reject({
          status: 400,
          code: 'BadRequest',
          message: 'Invalid document',
          fieldErrors: { document: 'introduction_public_layout_too_large' },
        }),
    });
    setup();
    act(() => current.prepareReady());
    await waitFor(() => expect(current.error).toContain('Скоротіть вступ'));
    expect(api.render).not.toHaveBeenCalled();
  });

  it.each([
    { status: 403, clears: true },
    { status: 500, clears: false },
  ])(
    'handles PDF download HTTP $status without exposing stale state',
    async ({ status, clears }) => {
      setup();
      act(() => current.renderPdf());
      await waitFor(() => expect(current.artifact?.artifactId).toBe('artifact'));
      api.download.mockRejectedValue({
        code: status === 403 ? 'Forbidden' : 'Server',
        status,
        message: 'Request failed',
        fieldErrors: {},
      });
      act(() => current.download());
      await waitFor(() => expect(current.error).toBe('Request failed'));
      expect(current.artifact === null).toBe(clears);
    },
  );
});

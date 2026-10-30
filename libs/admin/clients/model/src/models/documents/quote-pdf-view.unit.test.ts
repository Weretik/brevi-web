import { describe, expect, it } from 'vitest';

import { quotePdfActions } from './quote-pdf-view';

import type { QuotePdfView, QuotePdfStatus } from './quote-pdf-view';

const artifact = (status: QuotePdfStatus): QuotePdfView => ({
  artifactId: 'artifact',
  status,
  sha256: null,
  length: null,
  errorCode: null,
});

describe('saved PDF action state', () => {
  it('never offers download before server success', () => {
    for (const status of ['queued', 'processing', 'failed'] as const) {
      expect(quotePdfActions(artifact(status)).canDownload).toBe(false);
    }
    expect(quotePdfActions(artifact('succeeded')).canDownload).toBe(true);
  });

  it('offers retry for a failed artifact and status refresh while unfinished', () => {
    expect(quotePdfActions(null)).toEqual({
      canRender: true,
      canRefresh: false,
      canDownload: false,
    });
    expect(quotePdfActions(artifact('failed'))).toEqual({
      canRender: true,
      canRefresh: true,
      canDownload: false,
    });
    expect(quotePdfActions(artifact('processing')).canRender).toBe(false);
    expect(quotePdfActions(artifact('succeeded')).canRefresh).toBe(false);
  });
});

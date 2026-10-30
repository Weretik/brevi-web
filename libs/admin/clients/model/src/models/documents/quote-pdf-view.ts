export type QuotePdfStatus = 'queued' | 'processing' | 'succeeded' | 'failed';

/** View state only. API response mapping stays in data-access after contract sync. */
export interface QuotePdfView {
  readonly artifactId: string;
  readonly status: QuotePdfStatus;
  readonly sha256: string | null;
  readonly length: number | null;
  readonly errorCode: string | null;
}

export function quotePdfActions(artifact: QuotePdfView | null) {
  return {
    canRender: artifact === null || artifact.status === 'failed',
    canRefresh: artifact !== null && artifact.status !== 'succeeded',
    canDownload: artifact?.status === 'succeeded',
  };
}

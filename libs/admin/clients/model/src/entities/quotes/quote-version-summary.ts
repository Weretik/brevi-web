import type { QuoteVersion } from './quote-version';

export interface QuoteVersionSummary {
  readonly publicId: string;
  readonly versionNumber: number;
  readonly action: QuoteVersion['action'];
  readonly actorId: number;
  readonly createdAt: string;
  readonly parentVersionId: string | null;
}

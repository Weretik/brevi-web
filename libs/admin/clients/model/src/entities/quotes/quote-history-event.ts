import type { QuoteVersion } from './quote-version';

export interface QuoteHistoryEvent {
  readonly publicId: string;
  readonly revision: number;
  readonly versionNumber: number;
  readonly action: QuoteVersion['action'] | 'transferred' | 'archived' | 'restored';
  readonly actorId: number;
  readonly ownerId: number;
  readonly previousOwnerId: number | null;
  readonly reason: string | null;
  readonly createdAt: string;
}

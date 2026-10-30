import type { CustomConfiguration } from './custom-configuration';
import type { CustomPriceBasis } from './custom-price-basis';
import type { CustomVersion } from './custom-version';

export interface CustomDetail {
  readonly id: string;
  readonly revision: number;
  readonly ownerId: number;
  readonly customerId: string | null;
  readonly quoteId: string | null;
  readonly configuration: CustomConfiguration;
  readonly currentVersion: CustomVersion | null;
  readonly preview: CustomPriceBasis | null;
  readonly updatedAt: string;
  readonly canEdit: boolean;
}

import type { CustomConfiguration } from './custom-configuration';
import type { CustomPriceBasis } from './custom-price-basis';

export interface CustomVersion {
  readonly id: string;
  readonly number: number;
  readonly parentId: string | null;
  readonly configuration: CustomConfiguration;
  readonly basis: CustomPriceBasis;
  readonly createdAt: string;
}

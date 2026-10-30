import type { CustomApplication } from './custom-application';
import type { CustomMaterial } from './custom-material';
import type { CustomOperation } from './custom-operation';

export interface CustomConfiguration {
  readonly name: string;
  readonly productType: string;
  readonly season: 'summer' | 'winter';
  readonly description: string;
  readonly clientComment: string;
  readonly internalNote: string;
  readonly fabrics: readonly CustomMaterial[];
  readonly accessories: readonly CustomMaterial[];
  readonly operations: readonly CustomOperation[];
  readonly applications: readonly CustomApplication[];
  readonly delivery: number;
  readonly packaging: number;
}

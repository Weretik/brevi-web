import type { CustomMaterial } from '../custom-sewing/custom-material';
import type { CustomOperation } from '../custom-sewing/custom-operation';

export interface CustomTemplateSelections {
  readonly name: string;
  readonly productType: string;
  readonly season: 'summer' | 'winter';
  readonly description: string;
  readonly clientComment: string;
  readonly fabrics: readonly CustomMaterial[];
  readonly accessories: readonly CustomMaterial[];
  readonly operations: readonly CustomOperation[];
  readonly applications: readonly {
    readonly kind: 'embroidery' | 'print';
    readonly location: string;
  }[];
}

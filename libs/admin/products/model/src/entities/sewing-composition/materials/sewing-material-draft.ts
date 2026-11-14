import type { SewingMaterialKind } from './sewing-material-kind';
import type { SewingMaterialUnit } from './sewing-material-unit';

export interface SewingMaterialDraft {
  clientId: string;
  kind: SewingMaterialKind;
  referenceId: number | null;
  costCode: string | null;
  quantity: number;
  unit: SewingMaterialUnit;
  sortOrder: number;
  /** Free note, as the sheet's «Коментар»; empty when none. */
  comment: string;
}

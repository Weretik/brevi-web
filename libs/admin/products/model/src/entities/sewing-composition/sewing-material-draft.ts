import type { SewingMaterialKind } from './sewing-material-kind';
import type { SewingMaterialUnit } from './sewing-material-unit';

export interface SewingMaterialDraft {
  clientId: string;
  kind: SewingMaterialKind;
  referenceId: number | null;
  costCode: string | null;
  quantity: number;
  unit: SewingMaterialUnit;
  required: boolean;
  sortOrder: number;
  reviewed: boolean;
}

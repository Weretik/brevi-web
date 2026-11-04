import type { FabricNormValues } from './fabric-norm';
import type { WorkshopEmployeeDraft } from './workshop-employee';

export type ProductionImportAction = 'created' | 'updated' | 'unchanged' | 'error';

export interface ProductionImportLine {
  /** Worker name or model code. */
  key: string;
  /** Position of the worker or model name. */
  detail: string | null;
  action: ProductionImportAction;
  error: string | null;
}

export interface ProductionImportResult {
  dryRun: boolean;
  created: number;
  updated: number;
  unchanged: number;
  errors: number;
  lines: ProductionImportLine[];
}

export interface FabricNormImportRow {
  modelCode: string;
  norm: FabricNormValues;
}

export type WorkshopStaffImportRow = WorkshopEmployeeDraft;

import type {
  EmbroideryCostKind,
  EmbroideryExpenseBasis,
  EmbroideryMaterialMode,
  EmbroideryMode,
  EmbroideryProgram,
} from './embroidery-codes';

/** One calculation as the server takes it. */
export interface EmbroideryCalculationRequest {
  mode: EmbroideryMode;
  quantity: number;
  stitchesPerUnit: number;
  hoopId: string;
  unitsPerHoop: number;
  stabilizerLayers: number;
  fabricLayers: number;
  program: EmbroideryProgram;
  programMinutes: number;
  machineMinutes: number | null;
  materialMode: EmbroideryMaterialMode;
  /** Extra costs ticked or unticked for this calculation only, by id. */
  expenseOverrides: Readonly<Record<string, boolean>>;
}

export interface EmbroideryPrice {
  name: string;
  /** Null for a Manager. */
  markupPercent: number | null;
  unit: number;
  total: number;
  /** Unit price for a repeat with the ready program. */
  repeatUnit: number;
}

export interface EmbroideryCostRow {
  kind: EmbroideryCostKind;
  name: string;
  basis: EmbroideryExpenseBasis | null;
  quantity: number;
  rate: number | null;
  amount: number;
  perUnit: number;
}

export interface EmbroideryCost {
  total: number;
  perUnit: number;
  rows: readonly EmbroideryCostRow[];
}

/** How blanks of one material lie on the roll; money is null for a Manager. */
export interface EmbroideryCut {
  blankWidthCm: number;
  blankLengthCm: number;
  rollWidthCm: number;
  blanks: number;
  across: number;
  rows: number;
  produced: number;
  spare: number;
  sideWasteCm: number;
  cutMetres: number;
  blankCost: number | null;
  wholeCost: number | null;
  charged: number | null;
}

export interface EmbroideryCalculation {
  /** A Ukrainian reason; there are no prices when it is set. */
  error: string | null;
  /** Ticked costs without a rate; the prices are «Орієнтовна». */
  missing: readonly string[];
  hoopings: number;
  fullHoopings: number;
  lastHoopUnits: number;
  freeInLastHoop: number;
  prices: readonly EmbroideryPrice[];
  /** Director and Admin only. */
  cost: EmbroideryCost | null;
  stabilizer: EmbroideryCut | null;
  fabric: EmbroideryCut | null;
}

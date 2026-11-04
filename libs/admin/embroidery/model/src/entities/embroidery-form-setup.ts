import type { EmbroideryExpenseBasis, EmbroideryExpenseMode } from './embroidery-codes';

export interface EmbroideryFormHoop {
  id: string;
  label: string;
  blankWidthCm: number;
  blankLengthCm: number;
}

export interface EmbroideryFormExpense {
  id: string;
  name: string;
  basis: EmbroideryExpenseBasis;
  mode: EmbroideryExpenseMode;
  /** Ticked when a calculation starts. */
  enabled: boolean;
  /** False makes the prices «Орієнтовна» while the cost is ticked. */
  hasRate: boolean;
}

/** What «Розрахунок» needs before the first calculation; no rates, so a Manager can have it. */
export interface EmbroideryFormSetup {
  /** Director and Admin see the cost and «Налаштування». */
  seesCost: boolean;
  hoops: readonly EmbroideryFormHoop[];
  expenses: readonly EmbroideryFormExpense[];
  markupNames: readonly string[];
  settingsUpdatedAt: string | null;
}

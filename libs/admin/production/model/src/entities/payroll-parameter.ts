/** A payroll coefficient read from «Параметри ціноутворення»; edited there, not in the workshop. */
export interface PayrollParameter {
  code: string;
  /** What the workshop uses it for. */
  purpose: string;
  name: string | null;
  value: number | null;
  unit: string | null;
  updatedOn: string | null;
  /** Shown only when the parameter is missing or has no value. */
  problem: string | null;
}

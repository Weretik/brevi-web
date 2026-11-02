/** Sewing pricing settings needed to price an operation, as the Calculator sheet does. */
export interface OperationLabourRates {
  /** UAH per minute of a seamstress: monthly salary / (work days × shift minutes). */
  minuteCost: number;
  /** Assembly share, for example 0.25 for 25 %. */
  assemblyRate: number;
}

export interface OperationLabourCost {
  /** «Вартість роботи швачки». */
  seamstress: number;
  /** «Вартість з урахуванням збирання». */
  withAssembly: number;
}

/** Cost of one operation; `null` when it has no fixed norm or the rates are unknown. */
export function operationLabourCost(
  operation: { min: number; minutesPerProduct: boolean },
  rates: OperationLabourRates | null,
): OperationLabourCost | null {
  if (!rates || operation.minutesPerProduct) return null;
  const seamstress = operation.min * rates.minuteCost;
  return { seamstress, withAssembly: seamstress * (1 + rates.assemblyRate) };
}

const minutesFormat = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });

/** 6.5 → «6,5 хв»; time per product → «на виріб». */
export function formatOperationMinutes(operation: { min: number; minutesPerProduct: boolean }) {
  return operation.minutesPerProduct ? 'на виріб' : `${minutesFormat.format(operation.min)} хв`;
}

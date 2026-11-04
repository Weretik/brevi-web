/**
 * Short reasons of the sheet's «Статус розрахунку» («Немає трудовитрат», «Немає тканини» …)
 * for the pricing blocker codes of the backend engine.
 */
const reasons: Record<string, string> = {
  MissingOperations: 'Немає трудовитрат',
  MissingOperationTime: 'Немає часу операції',
  MissingFabric: 'Немає тканини',
  MissingCost: 'Неповна комплектація',
  MissingMaterialCost: 'Неповна комплектація',
  InactiveReference: 'Неповна комплектація',
  UnapprovedReference: 'Неповна комплектація',
  UnitMismatch: 'Неповна комплектація',
  AmbiguousReferenceVersion: 'Неповна комплектація',
  InactiveArticle: 'Тканину вимкнено',
  MissingSettings: 'Немає параметрів ціноутворення',
  AmbiguousSettings: 'Немає параметрів ціноутворення',
  UnsupportedFormula: 'Немає параметрів ціноутворення',
  InvalidSchedule: 'Немає параметрів ціноутворення',
  InvalidRate: 'Немає параметрів ціноутворення',
  InvalidMultiplier: 'Немає параметрів ціноутворення',
  InvalidSettingPrecision: 'Немає параметрів ціноутворення',
};

export const sewingNoVariantReason = 'Немає тканини';

/** Distinct short reasons in the order of the blockers. */
export function sewingBlockerReasons(blockers: ReadonlyArray<{ code: string }>): string[] {
  return [...new Set(blockers.map(({ code }) => reasons[code] ?? 'Не розраховано'))];
}

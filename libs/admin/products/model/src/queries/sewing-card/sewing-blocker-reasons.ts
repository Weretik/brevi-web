/**
 * Short reasons of the sheet's «Статус розрахунку» («Немає трудовитрат», «Операції не підтверджено» …)
 * for the pricing blocker codes of the backend engine.
 */
const reasons: Record<string, string> = {
  MissingOperations: 'Немає трудовитрат',
  UnreviewedOperation: 'Операції не підтверджено',
  MissingOperationTime: 'Немає часу операції',
  MissingFabric: 'Немає тканини',
  UnreviewedMaterial: 'Комплектацію не перевірено',
  MissingCost: 'Неповна комплектація',
  MissingMaterialCost: 'Неповна комплектація',
  InactiveReference: 'Неповна комплектація',
  UnapprovedReference: 'Неповна комплектація',
  UnitMismatch: 'Неповна комплектація',
  AmbiguousReferenceVersion: 'Неповна комплектація',
  InactiveArticle: 'Артикул неактивний',
  MissingSettings: 'Немає параметрів ціноутворення',
  AmbiguousSettings: 'Немає параметрів ціноутворення',
  UnsupportedFormula: 'Немає параметрів ціноутворення',
  InvalidSchedule: 'Немає параметрів ціноутворення',
  InvalidRate: 'Немає параметрів ціноутворення',
  InvalidMultiplier: 'Немає параметрів ціноутворення',
  InvalidSettingPrecision: 'Немає параметрів ціноутворення',
};

export const sewingNoArticleReason = 'Немає артикулу';

/** Distinct short reasons in the order of the blockers. */
export function sewingBlockerReasons(blockers: ReadonlyArray<{ code: string }>): string[] {
  return [...new Set(blockers.map(({ code }) => reasons[code] ?? 'Не розраховано'))];
}

const compositionPatterns: Array<[RegExp, string]> = [
  [/^Article is inactive\.$/, 'Артикул неактивний.'],
  [
    /^Required material line \d+ has not been reviewed\.$/,
    'Не всі обов’язкові матеріали перевірені.',
  ],
  [/^Required operation line \d+ has not been reviewed\.$/, 'Операції не підтверджено.'],
  [
    /^Other cost line \d+ requires the versioned Article pricing check\.$/,
    'Додаткові витрати перевіряються під час розрахунку артикула.',
  ],
  [/^No effective fabric line is configured\.$/, 'Немає тканини.'],
  [/^No operation lines are configured\.$/, 'Немає трудовитрат.'],
];

/** Ukrainian text for the composition readiness messages, without repeats. */
export function translateCompositionBlockers(blockers: readonly string[]): string[] {
  return [
    ...new Set(
      blockers.map(
        (text) => compositionPatterns.find(([pattern]) => pattern.test(text))?.[1] ?? text,
      ),
    ),
  ];
}

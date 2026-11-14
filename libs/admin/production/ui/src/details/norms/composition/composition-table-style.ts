import { compositionUnitLabels, formatCompositionQuantity } from '@admin/production/model';

import type { CompositionUnit } from '@admin/production/model';

/** Monospaced tabular figures for quantities in the composition tables. */
export const compositionMono = {
  fontFamily: 'var(--admin-font-mono)',
  fontVariantNumeric: 'tabular-nums',
} as const;

/** Header cell look of the composition tables. */
export const compositionHead = { bgcolor: 'action.hover', fontWeight: 600 } as const;

/** A quantity with its unit, as the composition tables show it. */
export const compositionQuantity = (value: number, unit: CompositionUnit) =>
  formatCompositionQuantity(value, compositionUnitLabels[unit]);

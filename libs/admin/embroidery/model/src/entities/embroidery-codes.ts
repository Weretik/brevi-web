/** «Вишивка на виробі» or «Шеврони». */
export type EmbroideryMode = 'Garment' | 'Chevron';
export type EmbroideryProgram = 'New' | 'Adjustment' | 'Ready';
/** Only the blanks used, or the whole cut length of the roll. */
export type EmbroideryMaterialMode = 'UsedBlanks' | 'FullCut';
export type EmbroideryExpenseBasis = 'Stitches' | 'Hoop' | 'Unit' | 'MachineHour' | 'Order';
export type EmbroideryExpenseMode = 'All' | 'ChevronOnly';
export type EmbroideryCostKind =
  'Stitches' | 'Threads' | 'Hooping' | 'Stabilizer' | 'Fabric' | 'Program' | 'Extra';

export const embroideryModeLabels: Record<EmbroideryMode, string> = {
  Garment: 'Вишивка на виробі',
  Chevron: 'Шеврони',
};

export const embroideryProgramLabels: Record<EmbroideryProgram, string> = {
  New: 'Нова',
  Adjustment: 'Доопрацювання',
  Ready: 'Готова',
};

export const embroideryMaterialModeLabels: Record<EmbroideryMaterialMode, string> = {
  UsedBlanks: 'Лише використані заготовки',
  FullCut: 'Весь відріз на замовлення',
};

/** How an extra cost is multiplied, as the person reads it next to the rate. */
export const embroideryBasisLabels: Record<EmbroideryExpenseBasis, string> = {
  Stitches: 'за 1000 стежків',
  Hoop: 'за зап’ялювання',
  Unit: 'за виріб',
  MachineHour: 'за годину машини',
  Order: 'раз на замовлення',
};

export const embroideryExpenseModeLabels: Record<EmbroideryExpenseMode, string> = {
  All: 'Усі розрахунки',
  ChevronOnly: 'Лише шеврони',
};

export const embroideryExpenseBases = Object.keys(
  embroideryBasisLabels,
) as EmbroideryExpenseBasis[];
export const embroideryExpenseModes = Object.keys(
  embroideryExpenseModeLabels,
) as EmbroideryExpenseMode[];

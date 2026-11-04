import type { EmbroideryCalculationRequest } from '../entities/embroidery-calculation';
import type {
  EmbroideryMaterialMode,
  EmbroideryMode,
  EmbroideryProgram,
} from '../entities/embroidery-codes';
import type { EmbroideryFormSetup } from '../entities/embroidery-form-setup';

/** «Розрахунок» as typed; an empty number field is null. */
export interface EmbroideryCalculationValues {
  mode: EmbroideryMode;
  quantity: number | null;
  stitchesPerUnit: number | null;
  hoopId: string;
  unitsPerHoop: number | null;
  stabilizerLayers: number | null;
  fabricLayers: number | null;
  program: EmbroideryProgram;
  programMinutes: number | null;
  /** Asked only while a ticked cost is counted per machine hour. */
  machineMinutes: number | null;
  materialMode: EmbroideryMaterialMode;
  /** Only the costs the person ticked or unticked differently from «Налаштування». */
  expenseOverrides: Readonly<Record<string, boolean>>;
}

/** Quick choices next to the development time, in minutes. */
export const embroideryProgramMinuteChips = [15, 30, 60, 120] as const;

/** A fresh form: the middle hoop, one layer each, a new program of one hour. */
export function emptyEmbroideryCalculation(
  setup: EmbroideryFormSetup,
): EmbroideryCalculationValues {
  const middle = setup.hoops[Math.floor((setup.hoops.length - 1) / 2)];
  return {
    mode: 'Garment',
    quantity: null,
    stitchesPerUnit: null,
    hoopId: middle?.id ?? '',
    unitsPerHoop: 1,
    stabilizerLayers: 1,
    fabricLayers: 1,
    program: 'New',
    programMinutes: 60,
    machineMinutes: null,
    materialMode: 'UsedBlanks',
    expenseOverrides: {},
  };
}

/** Whether a cost takes part in this calculation: its own tick, else the default from «Налаштування». */
export function isEmbroideryExpenseTicked(
  values: EmbroideryCalculationValues,
  expense: { id: string; enabled: boolean },
): boolean {
  return values.expenseOverrides[expense.id] ?? expense.enabled;
}

/** Ticks or unticks a cost; ticking it back to the default drops the override. */
export function tickEmbroideryExpense(
  values: EmbroideryCalculationValues,
  expense: { id: string; enabled: boolean },
  ticked: boolean,
): EmbroideryCalculationValues {
  const rest = Object.fromEntries(
    Object.entries(values.expenseOverrides).filter(([id]) => id !== expense.id),
  );
  return {
    ...values,
    expenseOverrides: ticked === expense.enabled ? rest : { ...rest, [expense.id]: ticked },
  };
}

/** Costs that apply to the chosen mode; «Лише шеврони» hides on garments. */
export function visibleEmbroideryExpenses(
  setup: EmbroideryFormSetup,
  mode: EmbroideryMode,
): EmbroideryFormSetup['expenses'] {
  return setup.expenses.filter((expense) => mode === 'Chevron' || expense.mode === 'All');
}

/** The machine time field shows while a ticked, visible cost is counted per machine hour. */
export function needsEmbroideryMachineTime(
  setup: EmbroideryFormSetup,
  values: EmbroideryCalculationValues,
): boolean {
  return visibleEmbroideryExpenses(setup, values.mode).some(
    (expense) => expense.basis === 'MachineHour' && isEmbroideryExpenseTicked(values, expense),
  );
}

/** The request, or null while a required number is still empty. Call after the validator passed. */
export function toEmbroideryCalculationRequest(
  values: EmbroideryCalculationValues,
): EmbroideryCalculationRequest | null {
  const { quantity, stitchesPerUnit, stabilizerLayers } = values;
  if (quantity === null || stitchesPerUnit === null || stabilizerLayers === null) return null;
  const chevron = values.mode === 'Chevron';
  return {
    mode: values.mode,
    quantity,
    stitchesPerUnit,
    hoopId: values.hoopId,
    unitsPerHoop: chevron ? (values.unitsPerHoop ?? 1) : 1,
    stabilizerLayers,
    fabricLayers: chevron ? (values.fabricLayers ?? 1) : 1,
    program: values.program,
    programMinutes: values.program === 'Ready' ? 0 : (values.programMinutes ?? 0),
    machineMinutes: values.machineMinutes,
    materialMode: values.materialMode,
    expenseOverrides: values.expenseOverrides,
  };
}

/** «Повторити розрахунок»: a saved form back into «Розрахунок»; it is then priced with the current rates. */
export function embroideryValuesFromRequest(
  request: EmbroideryCalculationRequest,
  setup: EmbroideryFormSetup,
): EmbroideryCalculationValues {
  const known = setup.hoops.some((hoop) => hoop.id === request.hoopId);
  return {
    ...request,
    hoopId: known ? request.hoopId : emptyEmbroideryCalculation(setup).hoopId,
    programMinutes: request.program === 'Ready' ? 60 : request.programMinutes,
    expenseOverrides: Object.fromEntries(
      Object.entries(request.expenseOverrides).filter(([id]) =>
        setup.expenses.some((expense) => expense.id === id),
      ),
    ),
  };
}

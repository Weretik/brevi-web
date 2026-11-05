import {
  PRODUCTION_WORK_COMMENT_MAX_LENGTH,
  PRODUCTION_WORK_MAX_QUANTITY,
} from '../entities/production-work';

import type {
  CreateProductionWorkBody,
  ProductionWorkKind,
  WorkItemChoice,
} from '../entities/production-work';

export interface ProductionWorkFormValues {
  /** «orderId:itemId»; fixed when the form opens from an item. */
  target: string;
  employeeId: number | null;
  kind: ProductionWorkKind;
  quantity: string;
  workDate: string;
  overPlan: boolean;
  reason: string;
  comment: string;
}

export type ProductionWorkErrors = Partial<Record<keyof ProductionWorkFormValues, string>>;

export const workTarget = (orderId: number, itemId: number) => `${orderId}:${itemId}`;

export function parseWorkTarget(target: string): { orderId: number; itemId: number } | null {
  const [order, item] = target.split(':').map(Number);
  return order && item ? { orderId: order, itemId: item } : null;
}

export const createProductionWorkValues = (
  today: string,
  target = '',
): ProductionWorkFormValues => ({
  target,
  employeeId: null,
  kind: 'Sewing',
  quantity: '',
  workDate: today,
  overPlan: false,
  reason: '',
  comment: '',
});

/** Pieces of the plan still to sew or cut for the chosen kind. */
export const workLeft = (
  item: Pick<WorkItemChoice, 'quantity' | 'sewn' | 'cut'>,
  kind: ProductionWorkKind,
) => Math.max(0, item.quantity - (kind === 'Sewing' ? item.sewn : item.cut));

export function validateProductionWork(
  values: ProductionWorkFormValues,
  today: string,
  left: number | null,
): ProductionWorkErrors {
  const errors: ProductionWorkErrors = {};
  if (!parseWorkTarget(values.target)) errors.target = 'Оберіть позицію завдання.';
  if (values.employeeId === null) errors.employeeId = 'Оберіть працівника.';
  const quantity = Number(values.quantity.trim());
  if (
    !/^\d+$/.test(values.quantity.trim()) ||
    quantity < 1 ||
    quantity > PRODUCTION_WORK_MAX_QUANTITY
  )
    errors.quantity = 'Кількість — ціле число від 1.';
  else if (!values.overPlan && left !== null && quantity > left)
    errors.quantity = `За планом залишилось ${left} шт. Більше — як роботу понад план.`;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.workDate)) errors.workDate = 'Вкажіть дату роботи.';
  else if (values.workDate > today) errors.workDate = 'Дата роботи не може бути пізніше сьогодні.';
  if (values.overPlan && !values.reason) errors.reason = 'Оберіть причину роботи понад план.';
  if (values.comment.trim().length > PRODUCTION_WORK_COMMENT_MAX_LENGTH)
    errors.comment = `Не довше ${PRODUCTION_WORK_COMMENT_MAX_LENGTH} символів.`;
  return errors;
}

export const productionWorkBody = (values: ProductionWorkFormValues): CreateProductionWorkBody => ({
  employeeId: values.employeeId ?? 0,
  kind: values.kind,
  quantity: Number(values.quantity.trim()),
  workDate: values.workDate,
  overPlan: values.overPlan,
  reason: values.overPlan ? values.reason : null,
  comment: values.comment.trim() || null,
});

/** «2026-11» of a day. */
export const workMonth = (day: string) => day.slice(0, 7);

/** The month before or after «2026-11». */
export function shiftWorkMonth(month: string, by: number) {
  const [year, monthNumber] = month.split('-').map(Number);
  const date = new Date(Date.UTC(year ?? 2000, (monthNumber ?? 1) - 1 + by, 1));
  return date.toISOString().slice(0, 7);
}

const monthNames = [
  'Січень',
  'Лютий',
  'Березень',
  'Квітень',
  'Травень',
  'Червень',
  'Липень',
  'Серпень',
  'Вересень',
  'Жовтень',
  'Листопад',
  'Грудень',
];

/** «Листопад 2026». */
export function formatWorkMonth(month: string) {
  const [year, monthNumber] = month.split('-').map(Number);
  return `${monthNames[(monthNumber ?? 1) - 1] ?? month} ${year}`;
}

import { toAdminApiError } from '@admin/shared/api-client';

import type { AdminApiErrorMessages } from '@admin/shared/api-client';

const common = {
  unauthorized: 'Немає доступу до «Швейного цеху».',
  fallback: 'Не вдалося виконати запит. Спробуйте ще раз.',
} satisfies AdminApiErrorMessages;

export const workshopStaffErrors = {
  ...common,
  notFound: 'Працівника не знайдено. Оновіть список.',
  conflict: 'Працівник з таким ПІБ уже є в списку.',
} satisfies AdminApiErrorMessages;

export const fabricNormErrors = {
  ...common,
  notFound: 'Моделі немає в «Товари» або норму вже видалено. Оновіть список.',
  conflict: 'Норма конфліктує з поточними даними. Оновіть список.',
} satisfies AdminApiErrorMessages;

export const payrollParameterErrors = {
  ...common,
  notFound: 'Параметри не знайдено.',
  conflict: 'Параметри змінилися. Оновіть сторінку.',
} satisfies AdminApiErrorMessages;

/** A 400 shows the backend's first field message, because the norm and name rules live on the server. */
export function toProductionApiError(response: unknown, messages: AdminApiErrorMessages) {
  const error = toAdminApiError(response, messages);
  if (error.status !== 400) return error;
  const first = Object.values(error.fieldErrors)[0];
  return first ? { ...error, message: first } : error;
}

export const productionOrderErrors = {
  ...common,
  unauthorized: 'Ця дія вам недоступна.',
  notFound: 'Завдання або КП не знайдено. Оновіть сторінку.',
  conflict: 'Завдання вже змінили або КП ще не відправлене. Оновіть сторінку.',
} satisfies AdminApiErrorMessages;

export const fabricStockErrors = {
  ...common,
  unauthorized: 'Рух складу записує начальник цеху або адміністратор.',
  notFound: 'Рядок складу, тканину чи постачальника не знайдено. Оновіть сторінку.',
  conflict: 'Склад або завдання вже змінили. Оновіть сторінку.',
} satisfies AdminApiErrorMessages;

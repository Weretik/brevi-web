import {
  WORKSHOP_EMPLOYEE_NAME_MAX_LENGTH,
  WORKSHOP_EMPLOYEE_POSITION_MAX_LENGTH,
} from '../../entities/people/workshop-employee';

import type { WorkshopEmployee, WorkshopEmployeeDraft } from '../../entities/people/workshop-employee';

export type WorkshopEmployeeField = keyof WorkshopEmployeeDraft;
export type WorkshopEmployeeErrors = Partial<Record<WorkshopEmployeeField, string>>;

const clean = (value: string) => value.trim().replace(/\s+/g, ' ');

export function createWorkshopEmployeeDraft(
  employee: WorkshopEmployee | null,
): WorkshopEmployeeDraft {
  return { fullName: employee?.fullName ?? '', position: employee?.position ?? 'Швачка' };
}

export function validateWorkshopEmployee(draft: WorkshopEmployeeDraft): WorkshopEmployeeErrors {
  const errors: WorkshopEmployeeErrors = {};
  const fullName = clean(draft.fullName);
  const position = clean(draft.position);
  if (!fullName) errors.fullName = 'Вкажіть ПІБ працівника.';
  else if (fullName.length > WORKSHOP_EMPLOYEE_NAME_MAX_LENGTH)
    errors.fullName = `ПІБ не довше ${WORKSHOP_EMPLOYEE_NAME_MAX_LENGTH} символів.`;
  if (!position) errors.position = 'Вкажіть посаду.';
  else if (position.length > WORKSHOP_EMPLOYEE_POSITION_MAX_LENGTH)
    errors.position = `Посада не довше ${WORKSHOP_EMPLOYEE_POSITION_MAX_LENGTH} символів.`;
  return errors;
}

export function workshopEmployeeBody(draft: WorkshopEmployeeDraft): WorkshopEmployeeDraft {
  return { fullName: clean(draft.fullName), position: clean(draft.position) };
}

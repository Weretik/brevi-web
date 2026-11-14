import type { PayrollMonth, PayrollPermissions } from '../../entities/people/payroll';

/** The roles a month still needs before its master and chief shares can be counted. */
export function payrollMissingRoles(month: PayrollMonth): string[] {
  return [
    month.master ? null : 'не вибрано майстра',
    month.chief ? null : 'не вибрано начальника',
  ].filter((text): text is string => text !== null);
}

/** Working people of the month, for the payment and adjustment pickers. */
export function payrollMonthPeople(month: PayrollMonth) {
  return month.lines
    .filter((line) => line.isActive)
    .map((line) => ({ employeeId: line.employeeId, name: line.name, position: line.position }));
}

/** Who closed the month and when, as «Олена, 01.11.2026». */
export function payrollClosedBy(month: PayrollMonth): string {
  return [
    month.closedByName,
    month.closedAt ? new Date(month.closedAt).toLocaleDateString('uk-UA') : null,
  ]
    .filter(Boolean)
    .join(', ');
}

/**
 * The server's role rules narrowed by «Права доступу» → «Персонал цеху: зарплата»: new payments need
 * «Створення»; closing, reopening, «Видано» and cancelling a record change what is there, «Редагування».
 */
export function payrollMonthPermissions(
  server: PayrollPermissions,
  rights: { canCreate: boolean; canEdit: boolean },
) {
  return {
    ...server,
    canPay: server.canPay && rights.canCreate,
    canClose: server.canClose && rights.canEdit,
    canReopen: server.canReopen && rights.canEdit,
    canChange: server.canPay && rights.canEdit,
  };
}

export type PayrollMonthRights = ReturnType<typeof payrollMonthPermissions>;

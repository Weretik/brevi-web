import {
  list,
  nonEmptyText,
  nullableNumber,
  nullableText,
  record,
} from '../validators/production-response';

import type { PayrollParameter } from '@admin/production/model';

export function mapPayrollParameter(value: unknown): PayrollParameter {
  const row = record(value, 'параметр зарплати');
  return {
    code: nonEmptyText(row['code'], 'код параметра'),
    purpose: nonEmptyText(row['purpose'], 'призначення'),
    name: nullableText(row['name'], 'назва параметра'),
    value: nullableNumber(row['value'], 'значення'),
    unit: nullableText(row['unit'], 'одиниця'),
    updatedOn: nullableText(row['updatedOn'], 'дата зміни'),
    problem: nullableText(row['problem'], 'проблема'),
  };
}

export const mapPayrollParameters = (value: unknown): PayrollParameter[] =>
  list(value, 'параметри зарплати').map(mapPayrollParameter);

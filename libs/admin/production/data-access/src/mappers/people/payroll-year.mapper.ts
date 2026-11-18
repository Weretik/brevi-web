import { adjustment, line, payment } from './payroll.mapper';
import {
  boolean,
  day,
  decimal,
  integer,
  list,
  nonEmptyText,
  nullableNumber,
  oneOf,
  record,
  text,
} from '../../validators/production-response';

import type { PayrollEmployee, PayrollWorkRow, PayrollYear } from '@admin/production/model';

function workRow(value: unknown): PayrollWorkRow {
  const row = record(value, 'робота');
  return {
    workId: integer(row['workId'], 'id роботи', 1),
    employeeId: integer(row['employeeId'], 'id працівника', 1),
    workDate: day(row['workDate'], 'дата роботи'),
    orderId: integer(row['orderId'], 'id завдання', 1),
    orderNumber: integer(row['orderNumber'], 'номер завдання'),
    modelName: text(row['modelName'], 'модель'),
    kind: oneOf(row['kind'], ['Sewing', 'Cutting'] as const, 'вид роботи'),
    quantity: integer(row['quantity'], 'кількість', 1),
    rate: decimal(row['rate'], 'розцінка'),
    amount: decimal(row['amount'], 'сума'),
    overPlan: boolean(row['overPlan'], 'понад план'),
  };
}

export function mapPayrollEmployee(value: unknown): PayrollEmployee {
  const source = record(value, 'працівник');
  return {
    month: text(source['month'], 'місяць'),
    isClosed: boolean(source['isClosed'], 'закрито'),
    line: line(source['line']),
    work: list(source['work'], 'робота').map(workRow),
    payments: list(source['payments'], 'виплати').map(payment),
    adjustments: list(source['adjustments'], 'інше').map(adjustment),
  };
}

export function mapPayrollYear(value: unknown): PayrollYear {
  const source = record(value, 'рік');
  return {
    year: integer(source['year'], 'рік', 2000),
    months: list(source['months'], 'місяці').map((item) => {
      const row = record(item, 'місяць');
      return {
        month: text(row['month'], 'місяць'),
        isClosed: boolean(row['isClosed'], 'закрито'),
        accrued: decimal(row['accrued'], 'нараховано'),
      };
    }),
    rows: list(source['rows'], 'працівники').map((item) => {
      const row = record(item, 'працівник');
      return {
        employeeId: integer(row['employeeId'], 'id працівника', 1),
        name: nonEmptyText(row['name'], 'працівник'),
        position: text(row['position'], 'посада'),
        accrued: list(row['accrued'], 'по місяцях').map((x) => nullableNumber(x, 'нараховано')),
        total: decimal(row['total'], 'разом'),
      };
    }),
  };
}

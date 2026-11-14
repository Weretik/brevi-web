import { payrollPaymentKinds } from '@admin/production/model';

import {
  boolean,
  dateTime,
  day,
  decimal,
  integer,
  list,
  nonEmptyText,
  nullableDateTime,
  nullableInteger,
  nullableNumber,
  nullableText,
  oneOf,
  record,
  text,
} from '../../validators/production-response';

import type {
  PayrollAdjustment,
  PayrollEmployee,
  PayrollLine,
  PayrollMonth,
  PayrollPayment,
  PayrollPerson,
  PayrollTotals,
  PayrollWorkRow,
  PayrollYear,
  TimesheetDay,
} from '@admin/production/model';

export function mapTimesheetDay(value: unknown): TimesheetDay {
  const source = record(value, 'табель');
  const month = record(source['month'], 'місяць табеля');
  return {
    date: day(source['date'], 'дата'),
    canEdit: boolean(source['canEdit'], 'можна змінювати'),
    isMonthClosed: boolean(source['isMonthClosed'], 'місяць закрито'),
    rows: list(source['rows'], 'працівники').map((item) => {
      const row = record(item, 'рядок табеля');
      return {
        employeeId: integer(row['employeeId'], 'id працівника', 1),
        name: nonEmptyText(row['name'], 'працівник'),
        position: text(row['position'], 'посада'),
        isActive: boolean(row['isActive'], 'працює'),
        minutes: nullableInteger(row['minutes'], 'хвилини'),
        version: nullableInteger(row['version'], 'версія', 1),
      };
    }),
    changes: list(source['changes'], 'історія змін').map((item) => {
      const change = record(item, 'зміна табеля');
      return {
        id: integer(change['id'], 'id зміни', 1),
        employeeId: integer(change['employeeId'], 'id працівника', 1),
        employeeName: nonEmptyText(change['employeeName'], 'працівник'),
        beforeMinutes: nullableInteger(change['beforeMinutes'], 'було'),
        afterMinutes: integer(change['afterMinutes'], 'стало'),
        changedAt: dateTime(change['changedAt'], 'час зміни'),
        changedByName: nonEmptyText(change['changedByName'], 'хто змінив'),
      };
    }),
    month: {
      month: text(month['month'], 'місяць'),
      days: list(month['days'], 'дні').map((item) => {
        const row = record(item, 'день');
        return {
          date: day(row['date'], 'дата'),
          people: integer(row['people'], 'людей'),
          minutes: integer(row['minutes'], 'хвилини'),
        };
      }),
      employees: list(month['employees'], 'працівники місяця').map((item) => {
        const row = record(item, 'працівник місяця');
        return {
          employeeId: integer(row['employeeId'], 'id працівника', 1),
          name: nonEmptyText(row['name'], 'працівник'),
          position: text(row['position'], 'посада'),
          days: integer(row['days'], 'днів'),
          minutes: integer(row['minutes'], 'хвилини'),
        };
      }),
    },
  };
}

function person(value: unknown): PayrollPerson | null {
  if (value === null || value === undefined) return null;
  const row = record(value, 'людина');
  return {
    employeeId: integer(row['employeeId'], 'id працівника', 1),
    name: nonEmptyText(row['name'], 'працівник'),
    isAssigned: boolean(row['isAssigned'], 'обрано'),
  };
}

function line(value: unknown): PayrollLine {
  const row = record(value, 'рядок зарплати');
  return {
    employeeId: integer(row['employeeId'], 'id працівника', 1),
    name: nonEmptyText(row['name'], 'працівник'),
    position: text(row['position'], 'посада'),
    isActive: boolean(row['isActive'], 'працює'),
    minutes: integer(row['minutes'], 'хвилини'),
    sewn: integer(row['sewn'], 'пошито'),
    sewing: decimal(row['sewing'], 'пошив'),
    cut: integer(row['cut'], 'покроєно'),
    cutting: decimal(row['cutting'], 'крій'),
    bonus: decimal(row['bonus'], 'премія'),
    master: decimal(row['master'], 'майстер'),
    chief: decimal(row['chief'], 'начальник'),
    embroidery: decimal(row['embroidery'], 'вишивка'),
    other: decimal(row['other'], 'інше'),
    accrued: decimal(row['accrued'], 'нараховано'),
    paid: decimal(row['paid'], 'виплачено'),
    due: decimal(row['due'], 'до видачі'),
    issued: nullableNumber(row['issued'], 'видано'),
  };
}

function totals(value: unknown): PayrollTotals {
  const row = record(value, 'разом');
  const money = (key: string) => decimal(row[key], key);
  return {
    minutes: integer(row['minutes'], 'хвилини'),
    sewing: money('sewing'),
    cutting: money('cutting'),
    bonus: money('bonus'),
    master: money('master'),
    chief: money('chief'),
    embroidery: money('embroidery'),
    other: money('other'),
    accrued: money('accrued'),
    paid: money('paid'),
    due: money('due'),
    issued: money('issued'),
  };
}

function payment(value: unknown): PayrollPayment {
  const row = record(value, 'виплата');
  return {
    id: integer(row['id'], 'id виплати', 1),
    employeeId: integer(row['employeeId'], 'id працівника', 1),
    employeeName: nonEmptyText(row['employeeName'], 'працівник'),
    paidOn: day(row['paidOn'], 'дата виплати'),
    kind: oneOf(row['kind'], payrollPaymentKinds, 'вид виплати'),
    amount: decimal(row['amount'], 'сума'),
    comment: nullableText(row['comment'], 'коментар'),
    createdAt: dateTime(row['createdAt'], 'час'),
    createdByName: nonEmptyText(row['createdByName'], 'хто вніс'),
    voidedAt: nullableDateTime(row['voidedAt'], 'час скасування'),
    voidedByName: nullableText(row['voidedByName'], 'хто скасував'),
    voidReason: nullableText(row['voidReason'], 'причина скасування'),
  };
}

function adjustment(value: unknown): PayrollAdjustment {
  const row = record(value, 'нарахування чи утримання');
  return {
    id: integer(row['id'], 'id запису', 1),
    employeeId: integer(row['employeeId'], 'id працівника', 1),
    employeeName: nonEmptyText(row['employeeName'], 'працівник'),
    amount: decimal(row['amount'], 'сума'),
    reason: nonEmptyText(row['reason'], 'причина'),
    createdAt: dateTime(row['createdAt'], 'час'),
    createdByName: nonEmptyText(row['createdByName'], 'хто вніс'),
    voidedAt: nullableDateTime(row['voidedAt'], 'час скасування'),
    voidedByName: nullableText(row['voidedByName'], 'хто скасував'),
    voidReason: nullableText(row['voidReason'], 'причина скасування'),
  };
}

export function mapPayrollMonth(value: unknown): PayrollMonth {
  const source = record(value, 'зарплата');
  const rates = record(source['rates'], 'частки');
  const permissions = record(source['permissions'], 'дозволи');
  const share = (key: string) => nullableNumber(rates[key], key);
  return {
    month: text(source['month'], 'місяць'),
    isClosed: boolean(source['isClosed'], 'закрито'),
    closedAt: nullableDateTime(source['closedAt'], 'час закриття'),
    closedByName: nullableText(source['closedByName'], 'хто закрив'),
    rates: {
      bonus: share('bonus'),
      bonusThreshold: share('bonusThreshold'),
      cutting: share('cutting'),
      master: share('master'),
      chief: share('chief'),
      embroidery: share('embroidery'),
    },
    master: person(source['master']),
    chief: person(source['chief']),
    stitches: integer(source['stitches'], 'стібки'),
    embroideryEmployee: person(source['embroideryEmployee']),
    totalSewing: decimal(source['totalSewing'], 'пошив усіх'),
    warnings: list(source['warnings'], 'попередження').map((x) => nonEmptyText(x, 'попередження')),
    lines: list(source['lines'], 'нарахування').map(line),
    totals: totals(source['totals']),
    payments: list(source['payments'], 'виплати').map(payment),
    adjustments: list(source['adjustments'], 'інше').map(adjustment),
    permissions: {
      canSetUp: boolean(permissions['canSetUp'], 'налаштування'),
      canPay: boolean(permissions['canPay'], 'виплати'),
      canClose: boolean(permissions['canClose'], 'закриття'),
      canReopen: boolean(permissions['canReopen'], 'відкриття'),
    },
  };
}

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

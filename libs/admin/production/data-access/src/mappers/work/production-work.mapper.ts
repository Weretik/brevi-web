import { forecastReasons, forecastStatuses, productionWorkKinds } from '@admin/production/model';

import {
  boolean,
  dateTime,
  day,
  decimal,
  integer,
  list,
  nonEmptyText,
  nullableDateTime,
  nullableNumber,
  nullableText,
  record,
  text,
  oneOf,
} from '../../validators/production-response';

import type {
  ForecastRow,
  ProductionImportResult,
  ProductionItemWorkCard,
  ProductionWork,
  SewingForecast,
  WorkChoices,
  WorkLog,
} from '@admin/production/model';

export function mapProductionWork(value: unknown): ProductionWork {
  const row = record(value, 'запис роботи');
  return {
    id: integer(row['id'], 'id запису', 1),
    orderId: integer(row['orderId'], 'id завдання', 1),
    orderNumber: integer(row['orderNumber'], 'номер завдання', 1),
    clientName: text(row['clientName'], 'клієнт'),
    itemId: integer(row['itemId'], 'id позиції', 1),
    modelName: text(row['modelName'], 'модель'),
    employeeId: integer(row['employeeId'], 'id працівника', 1),
    employeeName: nonEmptyText(row['employeeName'], 'працівник'),
    kind: oneOf(row['kind'], productionWorkKinds, 'вид роботи'),
    quantity: integer(row['quantity'], 'кількість', 1),
    workDate: day(row['workDate'], 'дата роботи'),
    overPlan: boolean(row['overPlan'], 'понад план'),
    reason: nullableText(row['reason'], 'причина'),
    comment: nullableText(row['comment'], 'коментар'),
    rate: decimal(row['rate'], 'розцінка'),
    isVoided: boolean(row['isVoided'], 'сторно'),
    voidedAt: nullableDateTime(row['voidedAt'], 'час сторно'),
    voidedByName: nullableText(row['voidedByName'], 'хто сторнував'),
    voidReason: nullableText(row['voidReason'], 'причина сторно'),
    createdByName: text(row['createdByName'], 'хто записав'),
    createdAt: dateTime(row['createdAt'], 'записано'),
  };
}

export function mapWorkLog(value: unknown): WorkLog {
  const row = record(value, 'журнал робіт');
  const totals = record(row['totals'], 'разом');
  return {
    month: text(row['month'], 'місяць'),
    rows: list(row['rows'], 'записи').map(mapProductionWork),
    totals: {
      sewn: integer(totals['sewn'], 'пошито'),
      cut: integer(totals['cut'], 'покроєно'),
      records: integer(totals['records'], 'записів'),
    },
  };
}

export function mapWorkChoices(value: unknown): WorkChoices {
  const row = record(value, 'вибір роботи');
  return {
    employees: list(row['employees'], 'працівники').map((item) => {
      const employee = record(item, 'працівник');
      return {
        id: integer(employee['id'], 'id працівника', 1),
        fullName: nonEmptyText(employee['fullName'], 'ПІБ'),
        position: text(employee['position'], 'посада'),
      };
    }),
    items: list(row['items'], 'позиції').map((item) => {
      const choice = record(item, 'позиція');
      return {
        orderId: integer(choice['orderId'], 'id завдання', 1),
        orderNumber: integer(choice['orderNumber'], 'номер завдання', 1),
        clientName: text(choice['clientName'], 'клієнт'),
        itemId: integer(choice['itemId'], 'id позиції', 1),
        modelName: text(choice['modelName'], 'модель'),
        quantity: integer(choice['quantity'], 'кількість'),
        sewn: integer(choice['sewn'], 'пошито'),
        cut: integer(choice['cut'], 'покроєно'),
        sewingRate: nullableNumber(choice['sewingRate'], 'розцінка'),
      };
    }),
    overPlanReasons: list(row['overPlanReasons'], 'причини').map((x) => nonEmptyText(x, 'причина')),
  };
}

export function mapProductionItemWork(value: unknown): ProductionItemWorkCard {
  const row = record(value, 'робота позиції');
  return {
    orderId: integer(row['orderId'], 'id завдання', 1),
    itemId: integer(row['itemId'], 'id позиції', 1),
    orderNumber: integer(row['orderNumber'], 'номер завдання', 1),
    modelName: text(row['modelName'], 'модель'),
    quantity: integer(row['quantity'], 'кількість'),
    sewingRate: nullableNumber(row['sewingRate'], 'розцінка'),
    sewn: integer(row['sewn'], 'пошито'),
    cut: integer(row['cut'], 'покроєно'),
    rows: list(row['rows'], 'записи').map(mapProductionWork),
    canRecord: boolean(row['canRecord'], 'можна записати'),
    cannotRecord: nullableText(row['cannotRecord'], 'чому не можна'),
  };
}

export function mapWorkImportResult(value: unknown): ProductionImportResult {
  const row = record(value, 'результат імпорту');
  return {
    dryRun: boolean(row['dryRun'], 'перегляд'),
    created: integer(row['created'], 'додано'),
    updated: 0,
    unchanged: integer(row['unchanged'], 'без змін'),
    errors: integer(row['errors'], 'помилки'),
    lines: list(row['lines'], 'рядки імпорту').map((item) => {
      const line = record(item, 'рядок імпорту');
      const number = line['orderNumber'];
      return {
        key: nonEmptyText(line['employeeName'], 'працівник'),
        detail: `${typeof number === 'number' ? `№ ${number}` : 'Завдання не знайдено'} · позиція ${integer(line['position'], 'позиція')} · ${text(line['kind'], 'вид') === 'Cutting' ? 'крій' : 'пошив'} ${integer(line['quantity'], 'кількість')} шт.`,
        action: oneOf(line['action'], ['created', 'unchanged', 'error'] as const, 'дія імпорту'),
        error: nullableText(line['error'], 'помилка'),
      };
    }),
  };
}

function mapForecastRow(value: unknown): ForecastRow {
  const row = record(value, 'рядок прогнозу');
  const reason = row['reason'];
  return {
    orderId: integer(row['orderId'], 'id завдання', 1),
    orderNumber: integer(row['orderNumber'], 'номер завдання', 1),
    clientName: text(row['clientName'], 'клієнт'),
    managerName: text(row['managerName'], 'менеджер'),
    remaining: integer(row['remaining'], 'залишилось'),
    minutes: nullableNumber(row['minutes'], 'хвилини'),
    finishOn: row['finishOn'] === null ? null : day(row['finishOn'], 'завершення'),
    status: oneOf(row['status'], forecastStatuses, 'стан прогнозу'),
    reason: reason === null ? null : oneOf(reason, forecastReasons, 'причина'),
    dueDate: day(row['dueDate'], 'готово до'),
    isLate: boolean(row['isLate'], 'запізнення'),
  };
}

export function mapSewingForecast(value: unknown): SewingForecast {
  const row = record(value, 'прогноз пошиття');
  const settings = row['settings'];
  const parameters = settings === null ? null : record(settings, 'параметри прогнозу');
  return {
    startDate: day(row['startDate'], 'початок'),
    settings: parameters && {
      seamstressCount: integer(parameters['seamstressCount'], 'швачок'),
      shiftMinutes: decimal(parameters['shiftMinutes'], 'хвилин у зміні'),
      minuteCost: nullableNumber(parameters['minuteCost'], 'вартість хвилини'),
    },
    problem: nullableText(row['problem'], 'проблема'),
    rows: list(row['rows'], 'рядки прогнозу').map(mapForecastRow),
    canReorder: boolean(row['canReorder'], 'черговість'),
    version: integer(row['version'], 'версія'),
  };
}

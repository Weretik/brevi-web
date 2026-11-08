import {
  auditActions,
  auditEntities,
  categoryDirections,
  financeReportKinds,
  financeReportRowTypes,
  movementSources,
} from '@admin/accounting/model';

import {
  date,
  dateTime,
  flag,
  integer,
  list,
  nullableInteger,
  nullableText,
  oneOf,
  record,
  text,
} from '../validators/accounting-response';

import type {
  FinanceAuditPage,
  FinanceReport,
  FinanceReportRow,
  FinanceReportTotal,
} from '@admin/accounting/model';

const nullableOneOf = <T extends string>(value: unknown, allowed: readonly T[], what: string) =>
  value === null || value === undefined ? null : oneOf(value, allowed, what);

function mapTotal(value: unknown): FinanceReportTotal {
  const row = record(value, 'підсумок звіту');
  return {
    currency: text(row['currency'], 'валюта'),
    operations: integer(row['operations'], 'операцій'),
    incomeMinor: integer(row['incomeMinor'], 'доходи'),
    expenseMinor: integer(row['expenseMinor'], 'витрати'),
    resultMinor: integer(row['resultMinor'], 'різниця'),
  };
}

function mapRow(value: unknown): FinanceReportRow {
  const row = record(value, 'рядок звіту');
  return {
    ...mapTotal(value),
    rowType: oneOf(row['rowType'], financeReportRowTypes, 'вид рядка'),
    account: nullableText(row['account'], 'рахунок'),
    type: nullableOneOf(row['type'], categoryDirections, 'тип'),
    category: nullableText(row['category'], 'категорія'),
    subcategory: nullableText(row['subcategory'], 'підкатегорія'),
    counterparty: nullableText(row['counterparty'], 'контрагент'),
    incomingTransfersMinor: nullableInteger(row['incomingTransfersMinor'], 'вхідні перекази'),
    outgoingTransfersMinor: nullableInteger(row['outgoingTransfersMinor'], 'вихідні перекази'),
    date: row['date'] === null || row['date'] === undefined ? null : date(row['date'], 'дата'),
    amountMinor: nullableInteger(row['amountMinor'], 'сума'),
    note: nullableText(row['note'], 'примітка'),
    source: nullableOneOf(row['source'], movementSources, 'джерело'),
    id: nullableText(row['id'], 'id операції'),
  };
}

export function mapFinanceReport(value: unknown): FinanceReport {
  const row = record(value, 'звіт');
  return {
    kind: oneOf(row['kind'], financeReportKinds, 'вид звіту'),
    from: date(row['from'], 'початок періоду'),
    to: date(row['to'], 'кінець періоду'),
    totals: list(row['totals'], 'підсумки').map(mapTotal),
    rows: list(row['rows'], 'рядки').map(mapRow),
    totalRows: integer(row['totalRows'], 'усього рядків'),
    limited: flag(row['limited'], 'не всі рядки'),
  };
}

export function mapFinanceAuditPage(value: unknown): FinanceAuditPage {
  const page = record(value, 'журнал змін');
  return {
    items: list(page['items'], 'зміни').map((item) => {
      const row = record(item, 'зміна');
      return {
        id: integer(row['id'], 'id запису'),
        entity: oneOf(row['entity'], auditEntities, 'обʼєкт'),
        entityId: text(row['entityId'], 'id обʼєкта'),
        action: oneOf(row['action'], auditActions, 'дія'),
        by: text(row['by'], 'хто змінив'),
        at: dateTime(row['at'], 'коли змінено'),
        title: text(row['title'], 'назва запису'),
        beforeJson: nullableText(row['beforeJson'], 'було'),
        afterJson: nullableText(row['afterJson'], 'стало'),
      };
    }),
    total: integer(page['total'], 'кількість'),
    page: integer(page['page'], 'сторінка'),
    pageSize: integer(page['pageSize'], 'розмір сторінки'),
  };
}

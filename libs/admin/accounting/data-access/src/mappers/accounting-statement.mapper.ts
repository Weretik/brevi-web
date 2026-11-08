import {
  bankDuplicates,
  bankLineStates,
  bankStatementStatuses,
  categoryDirections,
} from '@admin/accounting/model';

import { mapFinanceCounterpartyRef } from './accounting-movement.mapper';
import {
  date,
  dateTime,
  flag,
  integer,
  list,
  nullableDateTime,
  nullableInteger,
  nullableText,
  oneOf,
  record,
  text,
} from '../validators/accounting-response';

import type {
  BankStatement,
  BankStatementDetails,
  BankStatementLine,
} from '@admin/accounting/model';

const nullableDate = (value: unknown, what: string) =>
  value === null || value === undefined ? null : date(value, what);

export function mapBankStatement(value: unknown): BankStatement {
  const row = record(value, 'виписка');
  return {
    id: text(row['id'], 'id виписки'),
    accountId: text(row['accountId'], 'рахунок'),
    accountName: text(row['accountName'], 'назва рахунку'),
    fileName: text(row['fileName'], 'назва файлу'),
    status: oneOf(row['status'], bankStatementStatuses, 'стан виписки'),
    lineCount: integer(row['lineCount'], 'кількість рядків'),
    firstDate: nullableDate(row['firstDate'], 'перша дата'),
    lastDate: nullableDate(row['lastDate'], 'остання дата'),
    transactionCount: integer(row['transactionCount'], 'проведено операцій'),
    transferCount: integer(row['transferCount'], 'проведено переказів'),
    createdBy: text(row['createdBy'], 'хто завантажив'),
    createdAt: dateTime(row['createdAt'], 'завантажено'),
    bookedBy: nullableText(row['bookedBy'], 'хто провів'),
    bookedAt: nullableDateTime(row['bookedAt'], 'проведено'),
    version: integer(row['version'], 'версія'),
    existing: flag(row['existing'], 'завантажено раніше'),
  };
}

export function mapBankStatements(value: unknown): BankStatement[] {
  return list(value, 'виписки').map(mapBankStatement);
}

export function mapBankStatementLine(value: unknown): BankStatementLine {
  const row = record(value, 'рядок виписки');
  const type = row['type'];
  return {
    id: text(row['id'], 'id рядка'),
    rowNumber: integer(row['rowNumber'], 'номер рядка'),
    date: nullableDate(row['date'], 'дата рядка'),
    time: nullableText(row['time'], 'час рядка'),
    type: type === null || type === undefined ? null : oneOf(type, categoryDirections, 'тип'),
    amountMinor: nullableInteger(row['amountMinor'], 'сума'),
    currency: nullableText(row['currency'], 'валюта'),
    bankName: text(row['bankName'], 'назва в банку'),
    edrpou: text(row['edrpou'], 'ЄДРПОУ'),
    iban: text(row['iban'], 'рахунок контрагента'),
    purpose: text(row['purpose'], 'призначення'),
    document: text(row['document'], 'документ'),
    bankId: nullableText(row['bankId'], 'референс'),
    error: text(row['error'], 'помилка'),
    duplicate: oneOf(row['duplicate'], bankDuplicates, 'дублікат'),
    duplicateNote: text(row['duplicateNote'], 'пояснення дубліката'),
    transferAccountId: nullableText(row['transferAccountId'], 'рахунок переказу'),
    transferAccountName: nullableText(row['transferAccountName'], 'назва рахунку переказу'),
    counterparty: mapFinanceCounterpartyRef(row['counterparty']),
    categoryId: nullableText(row['categoryId'], 'категорія'),
    categoryRootId: nullableText(row['categoryRootId'], 'коренева категорія'),
    categoryRootName: nullableText(row['categoryRootName'], 'назва категорії'),
    subcategoryName: nullableText(row['subcategoryName'], 'підкатегорія'),
    oneoffName: text(row['oneoffName'], 'разовий контрагент'),
    description: text(row['description'], 'опис'),
    comment: text(row['comment'], 'примітка'),
    excluded: flag(row['excluded'], 'виключено'),
    state: oneOf(row['state'], bankLineStates, 'стан рядка'),
    willBook: flag(row['willBook'], 'буде проведено'),
    transactionId: nullableText(row['transactionId'], 'операція'),
    transferId: nullableText(row['transferId'], 'переказ'),
  };
}

export function mapBankStatementDetails(value: unknown): BankStatementDetails {
  const row = record(value, 'виписка з рядками');
  const totals = record(row['totals'], 'підсумок виписки');
  return {
    statement: mapBankStatement(row['statement']),
    states: list(row['states'], 'стани').map((item) => {
      const count = record(item, 'стан');
      return {
        state: oneOf(count['state'], bankLineStates, 'стан рядка'),
        count: integer(count['count'], 'кількість'),
      };
    }),
    totals: {
      operations: integer(totals['operations'], 'операцій'),
      incomeMinor: integer(totals['incomeMinor'], 'доходи'),
      expenseMinor: integer(totals['expenseMinor'], 'витрати'),
      transfers: integer(totals['transfers'], 'переказів'),
    },
    lines: list(row['lines'], 'рядки').map(mapBankStatementLine),
    total: integer(row['total'], 'кількість рядків'),
    page: integer(row['page'], 'сторінка'),
    pageSize: integer(row['pageSize'], 'розмір сторінки'),
  };
}

import {
  auditActions,
  auditEntities,
  categoryDirections,
  financeAccountTypes,
  ledgerScopes,
} from '@admin/accounting/model';

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
  AccountingSettings,
  FinanceAccount,
  FinanceAccountBalance,
  FinanceCategory,
  FinanceHistoryEntry,
} from '@admin/accounting/model';

export function mapFinanceAccount(value: unknown): FinanceAccount {
  const row = record(value, 'рахунок');
  return {
    id: text(row['id'], 'id рахунку'),
    name: text(row['name'], 'назва рахунку'),
    type: oneOf(row['type'], financeAccountTypes, 'тип рахунку'),
    currency: text(row['currency'], 'валюта'),
    iban: text(row['iban'], 'IBAN'),
    openingMinor: integer(row['openingMinor'], 'початковий залишок'),
    openingDate: date(row['openingDate'], 'дата початкового залишку'),
    cutoverBalanceMinor: nullableInteger(row['cutoverBalanceMinor'], 'залишок на 01.10'),
    cutoverConfirmed: flag(row['cutoverConfirmed'], 'підтвердження залишку'),
    cutoverConfirmedAt: nullableDateTime(row['cutoverConfirmedAt'], 'коли підтверджено'),
    cutoverConfirmedBy: nullableText(row['cutoverConfirmedBy'], 'хто підтвердив'),
    note: text(row['note'], 'примітка'),
    active: flag(row['active'], 'активний'),
    sortOrder: integer(row['sortOrder'], 'порядок'),
    version: integer(row['version'], 'версія'),
    createdAt: dateTime(row['createdAt'], 'створено'),
    updatedAt: dateTime(row['updatedAt'], 'змінено'),
    balance: mapFinanceAccountBalance(row['balance']),
  };
}

function mapFinanceAccountBalance(value: unknown): FinanceAccountBalance | null {
  if (value === null || value === undefined) return null;
  const row = record(value, 'залишки рахунку');
  return {
    legacyMinor: integer(row['legacyMinor'], 'залишок домашньої бухгалтерії'),
    currentMinor: nullableInteger(row['currentMinor'], 'поточний залишок'),
    totalMinor: integer(row['totalMinor'], 'загальний залишок'),
    hasHistory: flag(row['hasHistory'], 'рух коштів'),
  };
}

export const mapFinanceAccounts = (value: unknown): FinanceAccount[] =>
  list(value, 'рахунки').map(mapFinanceAccount);

export function mapFinanceCategory(value: unknown): FinanceCategory {
  const row = record(value, 'категорія');
  return {
    id: text(row['id'], 'id категорії'),
    name: text(row['name'], 'назва категорії'),
    direction: oneOf(row['direction'], categoryDirections, 'тип категорії'),
    scope: oneOf(row['scope'], ledgerScopes, 'область обліку'),
    parentId: nullableText(row['parentId'], 'коренева категорія'),
    note: text(row['note'], 'примітка'),
    active: flag(row['active'], 'активна'),
    sortOrder: integer(row['sortOrder'], 'порядок'),
    version: integer(row['version'], 'версія'),
  };
}

export const mapFinanceCategories = (value: unknown): FinanceCategory[] =>
  list(value, 'категорії').map(mapFinanceCategory);

export const mapFinanceHistory = (value: unknown): FinanceHistoryEntry[] =>
  list(value, 'історія').map((item) => {
    const row = record(item, 'запис історії');
    return {
      id: integer(row['id'], 'id запису'),
      entity: oneOf(row['entity'], auditEntities, 'обʼєкт'),
      entityId: text(row['entityId'], 'id обʼєкта'),
      action: oneOf(row['action'], auditActions, 'дія'),
      by: text(row['by'], 'хто змінив'),
      at: dateTime(row['at'], 'коли змінено'),
      beforeJson: nullableText(row['beforeJson'], 'було'),
      afterJson: nullableText(row['afterJson'], 'стало'),
    };
  });

export function mapAccountingSettings(value: unknown): AccountingSettings {
  const row = record(value, 'налаштування');
  return {
    cutoverDate: date(row['cutoverDate'], 'дата переходу'),
    timeZone: text(row['timeZone'], 'часовий пояс'),
    today: date(row['today'], 'сьогодні'),
  };
}

import {
  ledgerScopes,
  legacyImportKinds,
  legacyImportMovements,
  movementStatuses,
} from '@admin/accounting/model';

import {
  flag,
  integer,
  list,
  nullableDateTime,
  nullableInteger,
  oneOf,
  record,
  text,
} from '../validators/accounting-response';

import type {
  LegacyFinanceImportReport,
  LegacyImportBalance,
  LegacyImportCount,
  LegacyImportTotal,
} from '@admin/accounting/model';

const texts = (value: unknown, what: string) => list(value, what).map((item) => text(item, what));

function mapCount(value: unknown): LegacyImportCount {
  const row = record(value, 'кількість');
  return {
    kind: oneOf(row['kind'], legacyImportKinds, 'вид записів'),
    inFile: integer(row['inFile'], 'у файлі'),
    toAdd: integer(row['toAdd'], 'додати'),
    alreadyMoved: integer(row['alreadyMoved'], 'уже перенесено'),
    skipped: integer(row['skipped'], 'пропущено'),
  };
}

function mapTotal(value: unknown): LegacyImportTotal {
  const row = record(value, 'підсумок');
  return {
    scope: oneOf(row['scope'], ledgerScopes, 'область'),
    movement: oneOf(row['movement'], legacyImportMovements, 'вид руху'),
    status: oneOf(row['status'], movementStatuses, 'стан'),
    currency: text(row['currency'], 'валюта'),
    count: integer(row['count'], 'кількість'),
    amountMinor: integer(row['amountMinor'], 'сума'),
  };
}

function mapBalance(value: unknown): LegacyImportBalance {
  const row = record(value, 'залишок');
  return {
    accountId: text(row['accountId'], 'id рахунку'),
    name: text(row['name'], 'назва рахунку'),
    currency: text(row['currency'], 'валюта'),
    active: flag(row['active'], 'активний'),
    archiveMinor: integer(row['archiveMinor'], 'залишок архіву'),
    cutoverMinor: nullableInteger(row['cutoverMinor'], 'залишок на 01.10'),
    currentMinor: nullableInteger(row['currentMinor'], 'поточний залишок'),
    differenceMinor: nullableInteger(row['differenceMinor'], 'різниця'),
  };
}

export function mapLegacyFinanceImportReport(value: unknown): LegacyFinanceImportReport {
  const row = record(value, 'звіт імпорту');
  const parties = record(row['parties'], 'контрагенти');
  return {
    applied: flag(row['applied'], 'перенесено'),
    canApply: flag(row['canApply'], 'можна переносити'),
    exportedAt: nullableDateTime(row['exportedAt'], 'дата експорту'),
    counts: list(row['counts'], 'кількості').map(mapCount),
    parties: {
      clientsLinked: integer(parties['clientsLinked'], 'клієнти'),
      clientsAsFinancial: integer(parties['clientsAsFinancial'], 'клієнти'),
      suppliersLinked: integer(parties['suppliersLinked'], 'постачальники'),
      suppliersAsFinancial: integer(parties['suppliersAsFinancial'], 'постачальники'),
      unused: integer(parties['unused'], 'без операцій'),
    },
    totals: list(row['totals'], 'підсумки').map(mapTotal),
    balances: list(row['balances'], 'залишки').map(mapBalance),
    errorCount: integer(row['errorCount'], 'кількість помилок'),
    errors: texts(row['errors'], 'помилки'),
    warnings: texts(row['warnings'], 'попередження'),
  };
}

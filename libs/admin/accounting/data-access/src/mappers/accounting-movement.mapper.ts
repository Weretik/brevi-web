import {
  categoryDirections,
  counterpartyKinds,
  ledgerScopes,
  movementSources,
  movementStatuses,
  verificationStatuses,
} from '@admin/accounting/model';

import {
  date,
  dateTime,
  flag,
  integer,
  list,
  nullableText,
  oneOf,
  record,
  text,
} from '../validators/accounting-response';

import type {
  FinanceCounterpartyRef,
  FinanceOverview,
  FinanceTransaction,
  FinanceTransactionPage,
  FinanceTransfer,
  FinanceTransferPage,
} from '@admin/accounting/model';

export function mapFinanceCounterpartyRef(value: unknown): FinanceCounterpartyRef | null {
  if (value === null || value === undefined) return null;
  const row = record(value, 'контрагент операції');
  return {
    kind: oneOf(row['kind'], counterpartyKinds, 'вид контрагента'),
    id: text(row['id'], 'id контрагента'),
    name: text(row['name'], 'назва контрагента'),
    active: flag(row['active'], 'контрагент активний'),
    verified: flag(row['verified'], 'контрагент підтверджений'),
    missing: flag(row['missing'], 'контрагента немає'),
  };
}

export function mapFinanceTransaction(value: unknown): FinanceTransaction {
  const row = record(value, 'операція');
  return {
    id: text(row['id'], 'id операції'),
    date: date(row['date'], 'дата операції'),
    type: oneOf(row['type'], categoryDirections, 'тип операції'),
    accountId: text(row['accountId'], 'рахунок'),
    accountName: text(row['accountName'], 'назва рахунку'),
    amountMinor: integer(row['amountMinor'], 'сума'),
    currency: text(row['currency'], 'валюта'),
    categoryId: nullableText(row['categoryId'], 'категорія'),
    categoryRootId: nullableText(row['categoryRootId'], 'коренева категорія'),
    categoryRootName: nullableText(row['categoryRootName'], 'назва категорії'),
    subcategoryName: nullableText(row['subcategoryName'], 'підкатегорія'),
    counterparty: mapFinanceCounterpartyRef(row['counterparty']),
    oneoffName: text(row['oneoffName'], 'разовий контрагент'),
    description: text(row['description'], 'опис'),
    comment: text(row['comment'], 'примітка'),
    source: oneOf(row['source'], movementSources, 'джерело'),
    verification: oneOf(row['verification'], verificationStatuses, 'перевірка'),
    scope: oneOf(row['scope'], ledgerScopes, 'область обліку'),
    status: oneOf(row['status'], movementStatuses, 'стан'),
    version: integer(row['version'], 'версія'),
    createdBy: text(row['createdBy'], 'хто додав'),
    createdAt: dateTime(row['createdAt'], 'додано'),
    updatedAt: dateTime(row['updatedAt'], 'змінено'),
  };
}

export function mapFinanceTransactionPage(value: unknown): FinanceTransactionPage {
  const row = record(value, 'журнал операцій');
  return {
    items: list(row['items'], 'операції').map(mapFinanceTransaction),
    total: integer(row['total'], 'кількість'),
    page: integer(row['page'], 'сторінка'),
    pageSize: integer(row['pageSize'], 'розмір сторінки'),
    totals: list(row['totals'], 'підсумки').map((item) => {
      const total = record(item, 'підсумок');
      return {
        currency: text(total['currency'], 'валюта'),
        incomeMinor: integer(total['incomeMinor'], 'доходи'),
        expenseMinor: integer(total['expenseMinor'], 'витрати'),
        differenceMinor: integer(total['differenceMinor'], 'різниця'),
      };
    }),
  };
}

export function mapFinanceTransfer(value: unknown): FinanceTransfer {
  const row = record(value, 'переказ');
  return {
    id: text(row['id'], 'id переказу'),
    date: date(row['date'], 'дата переказу'),
    fromAccountId: text(row['fromAccountId'], 'рахунок списання'),
    fromAccountName: text(row['fromAccountName'], 'назва рахунку списання'),
    toAccountId: text(row['toAccountId'], 'рахунок зарахування'),
    toAccountName: text(row['toAccountName'], 'назва рахунку зарахування'),
    amountMinor: integer(row['amountMinor'], 'сума'),
    currency: text(row['currency'], 'валюта'),
    note: text(row['note'], 'примітка'),
    source: oneOf(row['source'], movementSources, 'джерело'),
    scope: oneOf(row['scope'], ledgerScopes, 'область обліку'),
    status: oneOf(row['status'], movementStatuses, 'стан'),
    version: integer(row['version'], 'версія'),
    createdBy: text(row['createdBy'], 'хто додав'),
    createdAt: dateTime(row['createdAt'], 'додано'),
    updatedAt: dateTime(row['updatedAt'], 'змінено'),
  };
}

export function mapFinanceTransferPage(value: unknown): FinanceTransferPage {
  const row = record(value, 'журнал переказів');
  return {
    items: list(row['items'], 'перекази').map(mapFinanceTransfer),
    total: integer(row['total'], 'кількість'),
    page: integer(row['page'], 'сторінка'),
    pageSize: integer(row['pageSize'], 'розмір сторінки'),
    totals: list(row['totals'], 'підсумки').map((item) => {
      const total = record(item, 'підсумок');
      return {
        currency: text(total['currency'], 'валюта'),
        amountMinor: integer(total['amountMinor'], 'сума переказів'),
      };
    }),
  };
}

export function mapFinanceOverview(value: unknown): FinanceOverview {
  const row = record(value, 'огляд');
  return {
    scope: row['scope'] === null ? null : oneOf(row['scope'], ledgerScopes, 'область обліку'),
    from: date(row['from'], 'початок періоду'),
    to: date(row['to'], 'кінець періоду'),
    needsReviewCount: integer(row['needsReviewCount'], 'потребують перевірки'),
    currencies: list(row['currencies'], 'валюти').map((item) => {
      const currency = record(item, 'валюта огляду');
      return {
        currency: text(currency['currency'], 'валюта'),
        balanceMinor: integer(currency['balanceMinor'], 'залишок'),
        unconfirmedCutoverCount: integer(currency['unconfirmedCutoverCount'], 'не підтверджено'),
        incomeMinor: integer(currency['incomeMinor'], 'доходи'),
        expenseMinor: integer(currency['expenseMinor'], 'витрати'),
        differenceMinor: integer(currency['differenceMinor'], 'різниця'),
        accountCount: integer(currency['accountCount'], 'рахунків'),
      };
    }),
  };
}

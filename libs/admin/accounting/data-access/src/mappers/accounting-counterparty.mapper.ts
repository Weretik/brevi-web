import { counterpartyKinds, financeCounterpartyTabs } from '@admin/accounting/model';

import { mapFinanceTransaction } from './accounting-movement.mapper';
import {
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
  FinanceCounterparty,
  FinanceCounterpartyChoice,
  FinanceCounterpartyPage,
  FinanceParty,
} from '@admin/accounting/model';

export function mapFinanceCounterparty(value: unknown): FinanceCounterparty {
  const row = record(value, 'контрагент');
  return {
    id: text(row['id'], 'id контрагента'),
    name: text(row['name'], 'назва контрагента'),
    edrpou: text(row['edrpou'], 'ЄДРПОУ'),
    iban: text(row['iban'], 'IBAN'),
    bankName: text(row['bankName'], 'банк'),
    aliases: list(row['aliases'], 'інші назви').map((alias) => text(alias, 'інша назва')),
    defaultCategoryId: nullableText(row['defaultCategoryId'], 'категорія за замовчуванням'),
    defaultCategoryRootName: nullableText(row['defaultCategoryRootName'], 'назва категорії'),
    defaultSubcategoryName: nullableText(row['defaultSubcategoryName'], 'підкатегорія'),
    autoApplyCategory: flag(row['autoApplyCategory'], 'автокатегорія'),
    note: text(row['note'], 'примітка'),
    verified: flag(row['verified'], 'підтверджений'),
    active: flag(row['active'], 'активний'),
    mergedIntoId: nullableText(row['mergedIntoId'], 'обʼєднано в'),
    operationCount: integer(row['operationCount'], 'операцій'),
    currentTurnoverMinor: integer(row['currentTurnoverMinor'], 'оборот'),
    version: integer(row['version'], 'версія'),
    createdAt: dateTime(row['createdAt'], 'створено'),
    updatedAt: dateTime(row['updatedAt'], 'змінено'),
  };
}

function mapFinanceParty(value: unknown): FinanceParty {
  const row = record(value, 'клієнт або постачальник');
  return {
    kind: oneOf(row['kind'], counterpartyKinds, 'вид контрагента'),
    id: text(row['id'], 'id контрагента'),
    name: text(row['name'], 'назва контрагента'),
    taxId: text(row['taxId'], 'ЄДРПОУ/ІПН'),
    active: flag(row['active'], 'активний'),
    operationCount: integer(row['operationCount'], 'операцій'),
    currentTurnoverMinor: integer(row['currentTurnoverMinor'], 'оборот'),
  };
}

export function mapFinanceCounterpartyPage(value: unknown): FinanceCounterpartyPage {
  const row = record(value, 'контрагенти');
  const counts = record(row['counts'], 'кількість за вкладками');
  return {
    tab: oneOf(row['tab'], financeCounterpartyTabs, 'вкладка'),
    financial: list(row['financial'], 'фінансові').map(mapFinanceCounterparty),
    parties: list(row['parties'], 'клієнти і постачальники').map(mapFinanceParty),
    oneoffs: list(row['oneoffs'], 'разові').map(mapFinanceTransaction),
    total: integer(row['total'], 'кількість'),
    page: integer(row['page'], 'сторінка'),
    pageSize: integer(row['pageSize'], 'розмір сторінки'),
    counts: {
      financial: integer(counts['financial'], 'фінансових'),
      clients: integer(counts['clients'], 'клієнтів'),
      suppliers: integer(counts['suppliers'], 'постачальників'),
      oneoffs: integer(counts['oneoffs'], 'разових'),
    },
  };
}

export const mapFinanceCounterpartyChoices = (value: unknown): FinanceCounterpartyChoice[] =>
  list(value, 'вибір контрагента').map((item) => {
    const row = record(item, 'контрагент');
    return {
      kind: oneOf(row['kind'], counterpartyKinds, 'вид контрагента'),
      id: text(row['id'], 'id контрагента'),
      name: text(row['name'], 'назва контрагента'),
      hint: text(row['hint'], 'підказка'),
      verified: flag(row['verified'], 'підтверджений'),
      defaultCategoryId: nullableText(row['defaultCategoryId'], 'категорія за замовчуванням'),
    };
  });

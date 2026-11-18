import { fabricMovementKinds, fabricMovementRevisionActions } from '@admin/warehouse/model';

import { permissions } from './fabric-stock.mapper';
import {
  boolean,
  dateTime,
  day,
  decimal,
  integer,
  list,
  nonEmptyText,
  nullableInteger,
  nullableNumber,
  nullableText,
  oneOf,
  record,
} from '../validators/warehouse-response';

import type {
  FabricMovementCounts,
  FabricMovementHistory,
  FabricMovementPage,
  FabricMovementRow,
  FabricMovementState,
} from '@admin/warehouse/model';

export function mapFabricMovementRow(value: unknown): FabricMovementRow {
  const row = record(value, 'рух');
  return {
    id: integer(row['id'], 'id руху', 1),
    stockId: integer(row['stockId'], 'рядок складу', 1),
    kind: oneOf(row['kind'], fabricMovementKinds, 'вид руху'),
    operationDate: day(row['operationDate'], 'дата операції'),
    createdAt: dateTime(row['createdAt'], 'час запису'),
    fabricCode: nonEmptyText(row['fabricCode'], 'код тканини'),
    groupCode: nonEmptyText(row['groupCode'], 'код групи'),
    fabricName: nonEmptyText(row['fabricName'], 'тканина'),
    color: nonEmptyText(row['color'], 'колір'),
    supplierName: nullableText(row['supplierName'], 'постачальник'),
    document: nullableText(row['document'], 'документ'),
    orderId: nullableInteger(row['orderId'], 'завдання', 1),
    itemId: nullableInteger(row['itemId'], 'позиція', 1),
    orderNumber: nullableInteger(row['orderNumber'], 'номер завдання', 1),
    modelName: nullableText(row['modelName'], 'модель'),
    destination: nullableText(row['destination'], 'куди використано'),
    delta: decimal(row['delta'], 'зміна'),
    metersAfter: decimal(row['metersAfter'], 'залишок рядка'),
    pairMetersAfter:
      row['pairMetersAfter'] === undefined
        ? null
        : nullableNumber(row['pairMetersAfter'], 'залишок пари'),
    perProduct: nullableNumber(row['perProduct'], 'на 1 виріб'),
    note: nullableText(row['note'], 'примітка'),
    createdByName: nonEmptyText(row['createdByName'], 'хто записав'),
    isReversed: boolean(row['isReversed'], 'сторновано'),
    reversesMovementId: nullableInteger(row['reversesMovementId'], 'сторно', 1),
    canReverse: boolean(row['canReverse'], 'можна сторнувати'),
    isVoided: boolean(row['isVoided'], 'скасовано'),
    revision: integer(row['revision'], 'ревізія руху'),
    canEdit: boolean(row['canEdit'], 'можна редагувати'),
  };
}

const movementState = (value: unknown, label: string): FabricMovementState => {
  const row = record(value, label);
  return {
    fabricCode: nonEmptyText(row['fabricCode'], 'код тканини'),
    color: nonEmptyText(row['color'], 'колір'),
    operationDate: day(row['operationDate'], 'дата операції'),
    delta: decimal(row['delta'], 'зміна'),
    supplierName: nullableText(row['supplierName'], 'постачальник'),
    document: nullableText(row['document'], 'документ'),
    destination: nullableText(row['destination'], 'куди використано'),
    isVoided: boolean(row['isVoided'], 'скасовано'),
  };
};

export function mapFabricMovementHistory(value: unknown): FabricMovementHistory {
  const row = record(value, 'історія правок');
  return {
    movementId: integer(row['movementId'], 'id руху', 1),
    revision: integer(row['revision'], 'ревізія руху'),
    canRestore: boolean(row['canRestore'], 'можна скасувати правку'),
    revisions: list(row['revisions'], 'правки').map((item) => {
      const x = record(item, 'правка');
      return {
        id: integer(x['id'], 'id правки', 1),
        number: integer(x['number'], 'номер правки', 1),
        action: oneOf(x['action'], fabricMovementRevisionActions, 'дія правки'),
        before: movementState(x['before'], 'до правки'),
        after: movementState(x['after'], 'після правки'),
        reason: nullableText(x['reason'], 'причина'),
        createdByName: nonEmptyText(x['createdByName'], 'хто змінив'),
        createdAt: dateTime(x['createdAt'], 'час правки'),
        isUndone: boolean(x['isUndone'], 'скасована'),
      };
    }),
  };
}

export function mapFabricMovementPage(value: unknown): FabricMovementPage {
  const row = record(value, 'сторінка руху');
  return {
    rows: list(row['rows'], 'рухи').map(mapFabricMovementRow),
    page: integer(row['page'], 'сторінка', 1),
    hasMore: boolean(row['hasMore'], 'є ще'),
    permissions: permissions(row['permissions']),
    total: row['total'] === undefined ? 0 : integer(row['total'], 'усього рухів'),
    counts: movementCounts(row['counts']),
  };
}

const movementCounts = (value: unknown): FabricMovementCounts | null => {
  if (value === undefined || value === null) return null;
  const row = record(value, 'кількість рухів');
  const count = (key: keyof FabricMovementCounts) =>
    integer(row[key.charAt(0).toLowerCase() + key.slice(1)], 'кількість рухів');
  return {
    All: count('All'),
    Receipt: count('Receipt'),
    ItemIssue: count('ItemIssue'),
    OneOffIssue: count('OneOffIssue'),
    Adjustment: count('Adjustment'),
    Opening: count('Opening'),
    Cancelled: count('Cancelled'),
  };
};

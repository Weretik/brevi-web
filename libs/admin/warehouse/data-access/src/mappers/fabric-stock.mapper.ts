import { fabricMovementKinds } from '@admin/warehouse/model';

import {
  boolean,
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
  text,
} from '../validators/warehouse-response';

import type {
  FabricConsumption,
  FabricStockChoices,
  FabricStockColor,
  FabricStockFabric,
  FabricStockLastMovement,
  FabricStockList,
  FabricStockOperationResult,
  FabricStockPermissions,
} from '@admin/warehouse/model';

export const permissions = (value: unknown): FabricStockPermissions => {
  const row = record(value, 'права складу');
  return {
    canMove: boolean(row['canMove'], 'рух складу'),
    seesValue: boolean(row['seesValue'], 'ціни'),
    canTransfer: boolean(row['canTransfer'], 'перенесення'),
  };
};

export const color = (value: unknown): FabricStockColor => {
  const row = record(value, 'колір складу');
  return {
    color: nonEmptyText(row['color'], 'колір'),
    colorKey: nonEmptyText(row['colorKey'], 'ключ кольору'),
    meters: decimal(row['meters'], 'метри кольору'),
    version: nonEmptyText(row['version'], 'версія пари'),
    sources: list(row['sources'], 'рядки пари').map((item) => {
      const x = record(item, 'рядок пари');
      return {
        id: integer(x['id'], 'id рядка', 1),
        fabricCode: nonEmptyText(x['fabricCode'], 'код рядка'),
        meters: decimal(x['meters'], 'метри рядка'),
      };
    }),
    booked: optionalDecimal(row['booked'], 'у броні'),
    free:
      row['free'] === undefined
        ? decimal(row['meters'], 'метри кольору')
        : decimal(row['free'], 'вільно'),
    toOrder: optionalDecimal(row['toOrder'], 'замовити'),
    lastMovement: lastMovement(row['lastMovement']),
    bookings: (row['bookings'] === undefined || row['bookings'] === null
      ? []
      : list(row['bookings'], 'бронь пари')
    ).map((item) => {
      const x = record(item, 'бронь');
      return {
        orderId: integer(x['orderId'], 'завдання', 1),
        orderNumber: integer(x['orderNumber'], 'номер завдання', 1),
        clientName: text(x['clientName'], 'замовник'),
        modelName: text(x['modelName'], 'модель'),
        dueDate:
          x['dueDate'] === null || x['dueDate'] === undefined ? null : day(x['dueDate'], 'термін'),
        need: decimal(x['need'], 'потреба'),
        toOrder: decimal(x['toOrder'], 'замовити'),
      };
    }),
  };
};

const optionalDecimal = (value: unknown, what: string) =>
  value === undefined ? 0 : decimal(value, what);

const lastMovement = (value: unknown): FabricStockLastMovement | null => {
  if (value === undefined || value === null) return null;
  const x = record(value, 'остання операція');
  return {
    id: integer(x['id'], 'id руху', 1),
    kind: oneOf(x['kind'], fabricMovementKinds, 'вид руху'),
    operationDate: day(x['operationDate'], 'дата операції'),
    delta: decimal(x['delta'], 'зміна'),
    orderNumber: nullableInteger(x['orderNumber'], 'номер завдання', 1),
    document: nullableText(x['document'], 'документ'),
    supplierName: nullableText(x['supplierName'], 'постачальник'),
    destination: nullableText(x['destination'], 'куди використано'),
  };
};

const fabric = (value: unknown): FabricStockFabric => {
  const row = record(value, 'тканина складу');
  return {
    fabricCode: nonEmptyText(row['fabricCode'], 'код тканини'),
    codes: list(row['codes'], 'коди тканини').map((x) => nonEmptyText(x, 'код тканини')),
    fabricName: nonEmptyText(row['fabricName'], 'тканина'),
    composition: nullableText(row['composition'], 'склад'),
    density: nullableText(row['density'], 'щільність'),
    meters: decimal(row['meters'], 'разом метрів'),
    colors: list(row['colors'], 'кольори тканини').map(color),
    supplier: row['supplier'] === undefined ? null : nullableText(row['supplier'], 'постачальник'),
    booked: optionalDecimal(row['booked'], 'у броні'),
    free:
      row['free'] === undefined
        ? decimal(row['meters'], 'разом метрів')
        : decimal(row['free'], 'вільно'),
  };
};

export function mapFabricStockList(value: unknown): FabricStockList {
  const row = record(value, 'залишки');
  return {
    fabrics: list(row['fabrics'], 'тканини').map(fabric),
    meters: decimal(row['meters'], 'разом метрів'),
    pairs: integer(row['pairs'], 'пар'),
    negative: integer(row['negative'], 'відʼємних'),
    permissions: permissions(row['permissions']),
    short: row['short'] === undefined ? 0 : integer(row['short'], 'не вистачає'),
  };
}

export function mapFabricStockChoices(value: unknown): FabricStockChoices {
  const row = record(value, 'вибір складу');
  return {
    fabrics: list(row['fabrics'], 'тканини').map((item) => {
      const x = record(item, 'тканина');
      return {
        id: integer(x['id'], 'id тканини', 1),
        code: nonEmptyText(x['code'], 'код тканини'),
        groupCode: nonEmptyText(x['groupCode'], 'код групи'),
        name: nonEmptyText(x['name'], 'тканина'),
        composition: nullableText(x['composition'], 'склад'),
        density: nullableText(x['density'], 'щільність'),
        supplier: nullableText(x['supplier'], 'постачальник'),
        price: nullableNumber(x['price'], 'ціна'),
      };
    }),
    suppliers: list(row['suppliers'], 'постачальники').map((x) => nonEmptyText(x, 'постачальник')),
    colors: list(row['colors'], 'кольори').map((x) => nonEmptyText(x, 'колір')),
  };
}

export function mapFabricStockOperation(value: unknown): FabricStockOperationResult {
  const row = record(value, 'операція складу');
  return {
    operationId: nullableText(row['operationId'], 'номер операції'),
    fabricCode: nonEmptyText(row['fabricCode'], 'код тканини'),
    color: text(row['color'], 'колір'),
    meters: decimal(row['meters'], 'залишок пари'),
    replayed: boolean(row['replayed'], 'повтор'),
  };
}

export function mapFabricConsumption(value: unknown): FabricConsumption {
  const row = record(value, 'зведення');
  return {
    from: day(row['from'], 'з'),
    to: day(row['to'], 'по'),
    rows: list(row['rows'], 'рядки зведення').map((item) => {
      const x = record(item, 'рядок зведення');
      return {
        stockId: integer(x['stockId'], 'рядок складу', 1),
        fabricCode: nonEmptyText(x['fabricCode'], 'код тканини'),
        fabricName: nonEmptyText(x['fabricName'], 'тканина'),
        color: nonEmptyText(x['color'], 'колір'),
        received: decimal(x['received'], 'прихід'),
        issued: decimal(x['issued'], 'видано'),
        corrected: decimal(x['corrected'], 'коригування'),
        issuedValue: nullableNumber(x['issuedValue'], 'вартість видачі'),
        issuedToTasks: decimal(x['issuedToTasks'], 'видано на завдання'),
        oneOff: decimal(x['oneOff'], 'разова витрата'),
      };
    }),
    received: decimal(row['received'], 'разом прихід'),
    issued: decimal(row['issued'], 'разом видано'),
    issuedValue: nullableNumber(row['issuedValue'], 'разом вартість'),
    issuedToTasks: decimal(row['issuedToTasks'], 'разом на завдання'),
    oneOff: decimal(row['oneOff'], 'разом разова витрата'),
    corrected: decimal(row['corrected'], 'разом коригування'),
  };
}

import { fabricIssuePurposes, fabricMovementKinds } from '@admin/production/model';

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
  record,
  text,
  oneOf,
} from '../validators/production-response';

import type {
  FabricConsumption,
  FabricIssue,
  FabricMovement,
  FabricPlanPart,
  FabricStockChoices,
  FabricStockLine,
  FabricStockList,
  FabricStockPermissions,
  FabricStockRow,
  ProductionImportResult,
  ProductionItemFabric,
} from '@admin/production/model';

const permissions = (value: unknown): FabricStockPermissions => {
  const row = record(value, 'права складу');
  return {
    canMove: boolean(row['canMove'], 'рух складу'),
    seesValue: boolean(row['seesValue'], 'вартість'),
  };
};

export function mapFabricStockRow(value: unknown): FabricStockRow {
  const row = record(value, 'рядок складу');
  return {
    id: nullableInteger(row['id'], 'id рядка складу', 1),
    fabricId: nullableInteger(row['fabricId'], 'id тканини', 1),
    fabricCode: nonEmptyText(row['fabricCode'], 'код тканини'),
    fabricName: nonEmptyText(row['fabricName'], 'тканина'),
    color: nonEmptyText(row['color'], 'колір'),
    meters: decimal(row['meters'], 'залишок'),
    reserved: decimal(row['reserved'], 'бронь'),
    available: decimal(row['available'], 'доступно'),
    price: nullableNumber(row['price'], 'ціна'),
    value: nullableNumber(row['value'], 'вартість'),
    version: integer(row['version'], 'версія'),
    updatedAt: nullableDateTime(row['updatedAt'], 'змінено'),
  };
}

export function mapFabricStockList(value: unknown): FabricStockList {
  const row = record(value, 'склад');
  const totals = record(row['totals'], 'разом');
  return {
    rows: list(row['rows'], 'рядки складу').map(mapFabricStockRow),
    totals: {
      meters: decimal(totals['meters'], 'разом метрів'),
      reserved: decimal(totals['reserved'], 'разом бронь'),
      lines: integer(totals['lines'], 'рядків'),
      short: integer(totals['short'], 'не вистачає'),
      value: nullableNumber(totals['value'], 'разом вартість'),
    },
    permissions: permissions(row['permissions']),
  };
}

export function mapFabricMovement(value: unknown): FabricMovement {
  const row = record(value, 'рух');
  return {
    id: integer(row['id'], 'id руху', 1),
    kind: oneOf(row['kind'], fabricMovementKinds, 'вид руху'),
    metersBefore: decimal(row['metersBefore'], 'було'),
    delta: decimal(row['delta'], 'зміна'),
    metersAfter: decimal(row['metersAfter'], 'стало'),
    operationDate: day(row['operationDate'], 'дата руху'),
    note: nullableText(row['note'], 'примітка'),
    supplierId: nullableInteger(row['supplierId'], 'постачальник', 1),
    supplierName: nullableText(row['supplierName'], 'постачальник'),
    document: nullableText(row['document'], 'документ'),
    orderId: nullableInteger(row['orderId'], 'завдання', 1),
    orderNumber: nullableInteger(row['orderNumber'], 'номер завдання', 1),
    modelName: nullableText(row['modelName'], 'модель'),
    reversesMovementId: nullableInteger(row['reversesMovementId'], 'сторно', 1),
    isReversed: boolean(row['isReversed'], 'сторновано'),
    canReverse: boolean(row['canReverse'], 'можна сторнувати'),
    createdByName: nonEmptyText(row['createdByName'], 'хто записав'),
    createdAt: dateTime(row['createdAt'], 'час руху'),
  };
}

export function mapFabricStockLine(value: unknown): FabricStockLine {
  const row = record(value, 'картка складу');
  return {
    line: mapFabricStockRow(row['line']),
    movements: list(row['movements'], 'рухи').map(mapFabricMovement),
    reservations: list(row['reservations'], 'бронь').map((item) => {
      const x = record(item, 'бронь позиції');
      return {
        orderId: integer(x['orderId'], 'завдання', 1),
        orderNumber: integer(x['orderNumber'], 'номер завдання', 1),
        itemId: integer(x['itemId'], 'позиція', 1),
        modelName: nonEmptyText(x['modelName'], 'модель'),
        planned: decimal(x['planned'], 'план'),
        covered: decimal(x['covered'], 'покрито'),
        reserved: decimal(x['reserved'], 'бронь'),
      };
    }),
    permissions: permissions(row['permissions']),
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
        name: nonEmptyText(x['name'], 'тканина'),
      };
    }),
    suppliers: list(row['suppliers'], 'постачальники').map((item) => {
      const x = record(item, 'постачальник');
      return {
        id: integer(x['id'], 'id постачальника', 1),
        name: nonEmptyText(x['name'], 'постачальник'),
      };
    }),
  };
}

const planPart = (value: unknown): FabricPlanPart => {
  const row = record(value, 'план позиції');
  return {
    fabricCode: nonEmptyText(row['fabricCode'], 'код тканини'),
    color: nonEmptyText(row['color'], 'колір'),
    colorKey: nonEmptyText(row['colorKey'], 'ключ кольору'),
    planned: decimal(row['planned'], 'план'),
    covered: decimal(row['covered'], 'покрито'),
    issued: decimal(row['issued'], 'видано'),
    reserved: decimal(row['reserved'], 'бронь'),
    stockId: nullableInteger(row['stockId'], 'рядок складу', 1),
    stockMeters: decimal(row['stockMeters'], 'на складі'),
    stockAvailable: decimal(row['stockAvailable'], 'доступно'),
  };
};

const issue = (value: unknown): FabricIssue => {
  const row = record(value, 'видача');
  return {
    id: integer(row['id'], 'id видачі', 1),
    issuedOn: day(row['issuedOn'], 'дата видачі'),
    note: nullableText(row['note'], 'примітка'),
    createdByName: nonEmptyText(row['createdByName'], 'хто видав'),
    createdAt: dateTime(row['createdAt'], 'час видачі'),
    isReversed: boolean(row['isReversed'], 'сторновано'),
    reversedAt: nullableDateTime(row['reversedAt'], 'час сторно'),
    reversedByName: nullableText(row['reversedByName'], 'хто сторнував'),
    reverseReason: nullableText(row['reverseReason'], 'причина сторно'),
    lines: list(row['lines'], 'рядки видачі').map((item) => {
      const x = record(item, 'рядок видачі');
      return {
        id: integer(x['id'], 'id рядка', 1),
        purpose: oneOf(x['purpose'], fabricIssuePurposes, 'призначення'),
        planColorKey: nullableText(x['planColorKey'], 'плановий колір'),
        plannedMeters: nullableNumber(x['plannedMeters'], 'план'),
        stockId: integer(x['stockId'], 'рядок складу', 1),
        fabricCode: nonEmptyText(x['fabricCode'], 'код тканини'),
        fabricName: nonEmptyText(x['fabricName'], 'тканина'),
        color: nonEmptyText(x['color'], 'колір'),
        meters: decimal(x['meters'], 'метри'),
        coveredMeters: decimal(x['coveredMeters'], 'покрито'),
      };
    }),
  };
};

export function mapProductionItemFabric(value: unknown): ProductionItemFabric {
  const row = record(value, 'тканина позиції');
  return {
    orderId: integer(row['orderId'], 'завдання', 1),
    itemId: integer(row['itemId'], 'позиція', 1),
    orderVersion: integer(row['orderVersion'], 'версія завдання', 1),
    fabricCode: nullableText(row['fabricCode'], 'код тканини'),
    fabricName: nullableText(row['fabricName'], 'тканина'),
    quantity: integer(row['quantity'], 'кількість', 1),
    hasNorm: boolean(row['hasNorm'], 'є норма'),
    plan: list(row['plan'], 'план').map(planPart),
    issued: decimal(row['issued'], 'видано'),
    issues: list(row['issues'], 'видачі').map(issue),
    canIssue: boolean(row['canIssue'], 'можна видати'),
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
      };
    }),
    received: decimal(row['received'], 'разом прихід'),
    issued: decimal(row['issued'], 'разом видано'),
    issuedValue: nullableNumber(row['issuedValue'], 'разом вартість'),
  };
}

const plain = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });

/** The stock transfer shown in the shared import preview: code, colour and movements. */
export function mapFabricStockImportResult(value: unknown): ProductionImportResult {
  const row = record(value, 'результат імпорту');
  const issueErrors = list(row['issueErrors'], 'помилки видач').map((x) => text(x, 'помилка'));
  const differences = integer(row['reservationDifferences'], 'різниця броні');
  const lines = list(row['lines'], 'рядки імпорту').map((item) => {
    const line = record(item, 'рядок імпорту');
    return {
      key: nonEmptyText(line['fabricCode'], 'код тканини'),
      detail: `${nonEmptyText(line['color'], 'колір')} · рухів: ${integer(line['movements'], 'рухів')}`,
      action: oneOf(line['action'], ['created', 'unchanged', 'error'] as const, 'дія імпорту'),
      error: nullableText(line['error'], 'помилка'),
    };
  });
  return {
    dryRun: boolean(row['dryRun'], 'перегляд'),
    created: integer(row['created'], 'додано'),
    updated: 0,
    unchanged: integer(row['unchanged'], 'без змін'),
    errors: integer(row['errors'], 'помилки'),
    lines: [
      ...issueErrors.map((error) => ({
        key: 'Видача',
        detail: null,
        action: 'error' as const,
        error,
      })),
      ...lines,
    ],
    notes: [
      `Рухів: ${plain.format(integer(row['movements'], 'рухів'))}, видач: ${integer(row['issues'], 'видач')}.`,
      ...(differences > 0
        ? [
            `Бронь рахується заново з норм «Нових» завдань і відрізняється від старого «Цеху» у ${differences} парах тканина + колір: старий «Цех» тримав бронь закритих завдань і позицій без норми.`,
          ]
        : []),
    ],
  };
}

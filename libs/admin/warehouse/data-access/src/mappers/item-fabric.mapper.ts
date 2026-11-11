import { fabricIssuePurposes, fabricLayers } from '@admin/warehouse/model';

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
  oneOf,
  record,
  text,
} from '../validators/warehouse-response';

import type {
  FabricIssue,
  FabricIssueItems,
  FabricLayer,
  FabricPlanPart,
  ItemFabric,
} from '@admin/warehouse/model';

const nullableLayer = (value: unknown): FabricLayer | null =>
  value === null || value === undefined ? null : oneOf(value, fabricLayers, 'шар');

const planPart = (value: unknown): FabricPlanPart => {
  const row = record(value, 'план позиції');
  return {
    fabricCode: nonEmptyText(row['fabricCode'], 'код тканини'),
    color: nonEmptyText(row['color'], 'колір'),
    colorKey: nonEmptyText(row['colorKey'], 'ключ кольору'),
    layer: oneOf(row['layer'], fabricLayers, 'шар'),
    planned: decimal(row['planned'], 'план'),
    covered: decimal(row['covered'], 'покрито'),
    issued: decimal(row['issued'], 'видано'),
    reserved: decimal(row['reserved'], 'бронь'),
    stockId: nullableInteger(row['stockId'], 'рядок складу', 1),
    stockMeters: decimal(row['stockMeters'], 'на складі'),
    stockAvailable: decimal(row['stockAvailable'], 'доступно'),
    missing: decimal(row['missing'], 'ще не розкроєно'),
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
    issuedQuantity: nullableInteger(row['issuedQuantity'], 'виробів розкроєно', 1),
    comparison: list(row['comparison'], 'план і факт').map((item) => {
      const x = record(item, 'план і факт');
      return {
        planFabricCode: nonEmptyText(x['planFabricCode'], 'код тканини плану'),
        planColorKey: nonEmptyText(x['planColorKey'], 'колір плану'),
        color: nonEmptyText(x['color'], 'колір'),
        plan: decimal(x['plan'], 'план'),
        actual: decimal(x['actual'], 'факт'),
        difference: decimal(x['difference'], 'різниця'),
        perProduct: decimal(x['perProduct'], 'на виріб'),
      };
    }),
    lines: list(row['lines'], 'рядки видачі').map((item) => {
      const x = record(item, 'рядок видачі');
      return {
        id: integer(x['id'], 'id рядка', 1),
        purpose: oneOf(x['purpose'], fabricIssuePurposes, 'призначення'),
        planFabricCode: nullableText(x['planFabricCode'], 'код тканини плану'),
        planColorKey: nullableText(x['planColorKey'], 'плановий колір'),
        plannedMeters: nullableNumber(x['plannedMeters'], 'план'),
        stockId: integer(x['stockId'], 'рядок складу', 1),
        fabricCode: nonEmptyText(x['fabricCode'], 'код тканини'),
        fabricName: text(x['fabricName'], 'тканина'),
        color: nonEmptyText(x['color'], 'колір'),
        meters: decimal(x['meters'], 'метри'),
        coveredMeters: decimal(x['coveredMeters'], 'покрито'),
        layer: nullableLayer(x['layer']),
        note: nullableText(x['note'], 'примітка рядка'),
        isVoided: boolean(x['isVoided'], 'скасовано'),
      };
    }),
  };
};

export function mapItemFabric(value: unknown): ItemFabric {
  const row = record(value, 'тканина позиції');
  return {
    orderId: integer(row['orderId'], 'завдання', 1),
    itemId: integer(row['itemId'], 'позиція', 1),
    orderNumber: integer(row['orderNumber'], 'номер завдання'),
    clientName: text(row['clientName'], 'клієнт'),
    modelName: text(row['modelName'], 'модель'),
    orderVersion: integer(row['orderVersion'], 'версія завдання', 1),
    isOpen: boolean(row['isOpen'], 'завдання відкрите'),
    fabricCode: nullableText(row['fabricCode'], 'код тканини'),
    fabricName: nullableText(row['fabricName'], 'тканина'),
    quantity: integer(row['quantity'], 'кількість'),
    hasNorm: boolean(row['hasNorm'], 'є норма'),
    planVersion: integer(row['planVersion'], 'версія плану'),
    planMissing: nullableText(row['planMissing'], 'чому немає плану'),
    plan: list(row['plan'], 'план').map(planPart),
    issued: decimal(row['issued'], 'видано'),
    issues: list(row['issues'], 'видачі').map(issue),
    canIssue: boolean(row['canIssue'], 'можна видати'),
  };
}

export function mapFabricIssueItems(value: unknown): FabricIssueItems {
  const row = record(value, 'позиції для видачі');
  return {
    items: list(row['items'], 'позиції').map((item) => {
      const x = record(item, 'позиція');
      return {
        orderId: integer(x['orderId'], 'завдання', 1),
        orderNumber: integer(x['orderNumber'], 'номер завдання'),
        clientName: text(x['clientName'], 'клієнт'),
        itemId: integer(x['itemId'], 'позиція', 1),
        modelName: text(x['modelName'], 'модель'),
        fabricCode: nullableText(x['fabricCode'], 'код тканини'),
        fabricName: nullableText(x['fabricName'], 'тканина'),
        quantity: integer(x['quantity'], 'кількість'),
      };
    }),
    hasMore: boolean(row['hasMore'], 'є ще'),
  };
}

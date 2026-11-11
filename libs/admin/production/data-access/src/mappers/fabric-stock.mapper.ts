import { fabricIssuePurposes } from '@admin/production/model';

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
  oneOf,
} from '../validators/production-response';

import type {
  FabricIssue,
  FabricPlanPart,
  FabricStockChoices,
  ProductionItemFabric,
} from '@admin/production/model';

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
    colors: productionColors(row['colors']),
  };
}

/** Colour names of «Кольори» as the workshop endpoints give them. */
export const productionColors = (value: unknown): string[] =>
  list(value, 'кольори').map((item) => nonEmptyText(item, 'колір'));

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

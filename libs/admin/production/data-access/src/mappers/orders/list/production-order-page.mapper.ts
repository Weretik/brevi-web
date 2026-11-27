import {
  boolean,
  dateTime,
  day,
  integer,
  list,
  nonEmptyText,
  nullableInteger,
  nullableText,
  oneOf,
  record,
} from '../../../validators/production-response';
import { nullableDay, statuses, texts } from '../card/production-order.mapper';
import { stage } from '../card/production-tracking.mapper';

import type {
  ProductionOrderPage,
  ProductionOrderSummary,
  ProductionOrderSummaryItem,
  ProductionStageCount,
} from '@admin/production/model';

export function mapProductionOrderSummary(value: unknown): ProductionOrderSummary {
  const row = record(value, 'завдання');
  return {
    id: integer(row['id'], 'id завдання', 1),
    number: integer(row['number'], 'номер завдання', 1),
    status: oneOf(row['status'], statuses, 'статус'),
    clientName: nonEmptyText(row['clientName'], 'клієнт'),
    quoteId: nullableInteger(row['quoteId'], 'КП'),
    quoteNumber: nullableText(row['quoteNumber'], 'номер КП'),
    managerName: nonEmptyText(row['managerName'], 'менеджер'),
    orderDate: day(row['orderDate'], 'дата створення'),
    itemsCount: integer(row['itemsCount'], 'позицій'),
    totalQuantity: integer(row['totalQuantity'], 'кількість'),
    nearestDueDate: nullableDay(row['nearestDueDate'], 'готово до'),
    isTransferred: boolean(row['isTransferred'], 'перенесено'),
    updatedAt: dateTime(row['updatedAt'], 'час зміни'),
    stage: stage(row['stage'], 'етап завдання'),
    // An API older than PRD-011 sends neither; the row then shows no models and no shipments.
    shippedQuantity:
      row['shippedQuantity'] === undefined ? 0 : integer(row['shippedQuantity'], 'відвантажено'),
    items:
      row['items'] === undefined ? [] : list(row['items'], 'позиції завдання').map(mapSummaryItem),
  };
}

function mapSummaryItem(value: unknown): ProductionOrderSummaryItem {
  const row = record(value, 'позиція завдання');
  return {
    modelCode: nullableText(row['modelCode'], 'код моделі'),
    modelName: nonEmptyText(row['modelName'], 'модель'),
    quantity: integer(row['quantity'], 'кількість'),
    stage: stage(row['stage'], 'етап позиції'),
    // An API older than this change sends none of them; the row then shows nothing there.
    fabricName: nullableText(row['fabricName'], 'тканина'),
    mainColor: row['mainColor'] === undefined ? '' : nonEmptyText(row['mainColor'], 'колір'),
    additionalColors:
      row['additionalColors'] === undefined
        ? []
        : texts(row['additionalColors'], 'додаткові кольори'),
    applications:
      row['applications'] === undefined
        ? []
        : list(row['applications'], 'нанесення').map((kind) =>
            oneOf(kind, ['Embroidery', 'Print'] as const, 'вид нанесення'),
          ),
  };
}

function mapStageCount(value: unknown): ProductionStageCount {
  const row = record(value, 'етап конвеєра');
  return {
    stage: stage(row['stage'], 'етап конвеєра'),
    count: integer(row['count'], 'завдань на етапі'),
    overdue: integer(row['overdue'], 'прострочених на етапі'),
  };
}

function mapAttention(value: unknown) {
  if (value === undefined) return { overdue: 0, dueSoon: 0 };
  const row = record(value, 'термін завдань');
  return {
    overdue: integer(row['overdue'], 'прострочені'),
    dueSoon: integer(row['dueSoon'], 'скоро термін'),
  };
}

export function mapProductionOrderPage(value: unknown): ProductionOrderPage {
  const page = record(value, 'сторінка завдань');
  const counts = record(page['counts'], 'кількість за статусом');
  return {
    items: list(page['items'], 'завдання').map(mapProductionOrderSummary),
    page: integer(page['page'], 'сторінка', 1),
    pageSize: integer(page['pageSize'], 'розмір сторінки', 1),
    total: integer(page['total'], 'усього'),
    totalQuantity:
      page['totalQuantity'] === undefined ? 0 : integer(page['totalQuantity'], 'кількість виробів'),
    counts: {
      all: integer(counts['all'], 'усього'),
      new: integer(counts['new'], 'нові'),
      closed: integer(counts['closed'], 'закриті'),
      cancelled: integer(counts['cancelled'], 'скасовані'),
    },
    managers: texts(page['managers'], 'менеджери'),
    stages: page['stages'] === undefined ? [] : list(page['stages'], 'конвеєр').map(mapStageCount),
    attention: mapAttention(page['attention']),
  };
}

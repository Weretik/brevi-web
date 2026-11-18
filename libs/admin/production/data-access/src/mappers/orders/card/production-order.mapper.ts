import { mapApplication } from './production-application.mapper';
import {
  mapOrderFile,
  mapShipment,
  mapTelegram,
  stage,
  stages,
} from './production-tracking.mapper';
import {
  boolean,
  dateTime,
  day,
  integer,
  list,
  nonEmptyText,
  nullableInteger,
  nullableNumber,
  nullableText,
  oneOf,
  record,
  text,
} from '../../../validators/production-response';

import type {
  ProductionItem,
  ProductionOrder,
  ProductionOrderChange,
  ProductionOrderStatus,
  ReportPriceTier,
} from '@admin/production/model';

export const statuses = [
  'New',
  'Closed',
  'Cancelled',
] as const satisfies readonly ProductionOrderStatus[];
const tiers = ['Retail', 'Wholesale', 'Large'] as const satisfies readonly ReportPriceTier[];

export const nullableDay = (value: unknown, what: string) =>
  value === null || value === undefined ? null : day(value, what);

export const texts = (value: unknown, what: string) => list(value, what).map((x) => text(x, what));

function mapItem(value: unknown): ProductionItem {
  const row = record(value, 'позиція');
  return {
    id: integer(row['id'], 'id позиції', 1),
    position: integer(row['position'], 'номер позиції', 1),
    modelCode: nullableText(row['modelCode'], 'код моделі'),
    modelName: nonEmptyText(row['modelName'], 'модель'),
    fabricCode: nullableText(row['fabricCode'], 'код тканини'),
    fabricName: nullableText(row['fabricName'], 'тканина'),
    quantity: integer(row['quantity'], 'кількість', 1),
    dueDate: day(row['dueDate'], 'готово до'),
    mainColor: nonEmptyText(row['mainColor'], 'основний колір'),
    additionalColors: texts(row['additionalColors'], 'додаткові кольори'),
    sizesText: nullableText(row['sizesText'], 'розміри'),
    technicalChanges: nullableText(row['technicalChanges'], 'технічні зміни'),
    comment: nullableText(row['comment'], 'коментар'),
    applications: list(row['applications'], 'нанесення').map(mapApplication),
    plannedFabricMeters: nullableNumber(row['plannedFabricMeters'], 'плановий розхід'),
    sewingRate: nullableNumber(row['sewingRate'], 'розцінка'),
    reportUnitPrice: nullableNumber(row['reportUnitPrice'], 'ціна для звіту'),
    stages: stages(row['stages']),
    currentStage: stage(row['currentStage'], 'поточний етап'),
    shippedQuantity: integer(row['shippedQuantity'], 'відвантажено'),
    shipments: list(row['shipments'], 'відвантаження').map(mapShipment),
  };
}

export function mapProductionOrder(value: unknown): ProductionOrder {
  const row = record(value, 'завдання');
  const permissions = record(row['permissions'], 'права');
  const tier = row['priceTier'];
  return {
    id: integer(row['id'], 'id завдання', 1),
    number: integer(row['number'], 'номер завдання', 1),
    status: oneOf(row['status'], statuses, 'статус'),
    clientName: nonEmptyText(row['clientName'], 'клієнт'),
    quoteId: nullableInteger(row['quoteId'], 'КП'),
    quoteNumber: nullableText(row['quoteNumber'], 'номер КП'),
    managerName: nonEmptyText(row['managerName'], 'менеджер'),
    orderDate: day(row['orderDate'], 'дата створення'),
    comment: nullableText(row['comment'], 'коментар'),
    priceTier: tier === null || tier === undefined ? null : oneOf(tier, tiers, 'ціна для звіту'),
    isTransferred: boolean(row['isTransferred'], 'перенесено'),
    copiedFromOrderId: nullableInteger(row['copiedFromOrderId'], 'копія завдання'),
    createdAt: dateTime(row['createdAt'], 'створено'),
    createdByName: nonEmptyText(row['createdByName'], 'створив'),
    updatedAt: dateTime(row['updatedAt'], 'змінено'),
    version: integer(row['version'], 'версія', 1),
    permissions: {
      canEdit: boolean(permissions['canEdit'], 'право змінювати'),
      canCopy: boolean(permissions['canCopy'], 'право копіювати'),
      canDelete: boolean(permissions['canDelete'], 'право видаляти'),
      seesSewingRate: boolean(permissions['seesSewingRate'], 'право бачити розцінку'),
      seesReportPrice: boolean(permissions['seesReportPrice'], 'право бачити ціну'),
      canTrack: boolean(permissions['canTrack'], 'право відмічати етапи'),
      canClose: boolean(permissions['canClose'], 'право закрити'),
      canCancel: boolean(permissions['canCancel'], 'право скасувати'),
      canReopen: boolean(permissions['canReopen'], 'право повернути в роботу'),
      canManageFiles: boolean(permissions['canManageFiles'], 'право змінювати файли'),
      canSendTelegram: boolean(permissions['canSendTelegram'], 'право надіслати в цех'),
    },
    items: list(row['items'], 'позиції').map(mapItem),
    cancelReason: nullableText(row['cancelReason'], 'причина скасування'),
    files: list(row['files'], 'файли').map(mapOrderFile),
    telegram: mapTelegram(row['telegram']),
  };
}

export const mapProductionOrderHistory = (value: unknown): ProductionOrderChange[] =>
  list(value, 'історія').map((item) => {
    const row = record(item, 'зміна');
    return {
      id: integer(row['id'], 'id зміни', 1),
      itemId: nullableInteger(row['itemId'], 'позиція'),
      itemName: nullableText(row['itemName'], 'позиція'),
      field: nonEmptyText(row['field'], 'поле'),
      before: nullableText(row['before'], 'було'),
      after: nullableText(row['after'], 'стало'),
      actorName: nonEmptyText(row['actorName'], 'хто змінив'),
      at: dateTime(row['at'], 'час зміни'),
    };
  });

/** Colour names of «Кольори» as the workshop endpoints give them. */
export const productionColors = (value: unknown): string[] =>
  list(value, 'кольори').map((item) => nonEmptyText(item, 'колір'));

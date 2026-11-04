import { mapFabricNormValues } from './fabric-norm.mapper';
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
  nullableDateTime,
  nullableInteger,
  nullableNumber,
  nullableText,
  oneOf,
  record,
  text,
} from '../validators/production-response';

import type {
  ItemApplication,
  ProductionItem,
  ProductionOrder,
  ProductionOrderChange,
  ProductionOrderPage,
  ProductionOrderStatus,
  ProductionOrderSummary,
  ProductionQuoteDraft,
  ProductionQuoteSource,
  ReportPriceTier,
} from '@admin/production/model';

const statuses = ['New', 'Closed', 'Cancelled'] as const satisfies readonly ProductionOrderStatus[];
const tiers = ['Retail', 'Wholesale', 'Large'] as const satisfies readonly ReportPriceTier[];

const nullableDay = (value: unknown, what: string) =>
  value === null || value === undefined ? null : day(value, what);

const texts = (value: unknown, what: string) => list(value, what).map((x) => text(x, what));

function mapApplication(value: unknown): ItemApplication {
  const row = record(value, 'нанесення');
  return {
    kind: oneOf(row['kind'], ['Embroidery', 'Print'] as const, 'вид нанесення'),
    place: nullableText(row['place'], 'місце нанесення'),
    description: nullableText(row['description'], 'опис нанесення'),
    color: nullableText(row['color'], 'колір нанесення'),
  };
}

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
    counts: {
      all: integer(counts['all'], 'усього'),
      new: integer(counts['new'], 'нові'),
      closed: integer(counts['closed'], 'закриті'),
      cancelled: integer(counts['cancelled'], 'скасовані'),
    },
    managers: texts(page['managers'], 'менеджери'),
  };
}

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

export const mapProductionQuoteSources = (value: unknown): ProductionQuoteSource[] =>
  list(value, 'КП').map((item) => {
    const row = record(item, 'КП');
    return {
      id: integer(row['id'], 'id КП', 1),
      number: nonEmptyText(row['number'], 'номер КП'),
      clientName: nonEmptyText(row['clientName'], 'клієнт'),
      responsibleName: nonEmptyText(row['responsibleName'], 'відповідальний'),
      lastSentAt: nullableDateTime(row['lastSentAt'], 'відправлено'),
      ordersCount: integer(row['ordersCount'], 'завдань'),
    };
  });

export function mapProductionQuoteDraft(value: unknown): ProductionQuoteDraft {
  const row = record(value, 'КП');
  return {
    quoteId: integer(row['quoteId'], 'id КП', 1),
    number: nonEmptyText(row['number'], 'номер КП'),
    clientName: nonEmptyText(row['clientName'], 'клієнт'),
    managerName: nonEmptyText(row['managerName'], 'менеджер'),
    items: list(row['items'], 'позиції КП').map((entry) => {
      const item = record(entry, 'позиція КП');
      return {
        quoteItemId: integer(item['quoteItemId'], 'позиція КП', 1),
        name: nonEmptyText(item['name'], 'назва'),
        modelCode: nullableText(item['modelCode'], 'код моделі'),
        norm: mapFabricNormValues(item['norm']),
        options: list(item['options'], 'варіанти').map((option) => {
          const x = record(option, 'варіант');
          return {
            optionId: integer(x['optionId'], 'варіант', 1),
            title: nonEmptyText(x['title'], 'назва варіанта'),
            fabricCode: nullableText(x['fabricCode'], 'код тканини'),
            fabricName: nullableText(x['fabricName'], 'тканина'),
            retail: nullableNumber(x['retail'], 'роздріб'),
            wholesale: nullableNumber(x['wholesale'], 'опт'),
            large: nullableNumber(x['large'], 'великий опт'),
            sewingRate: nullableNumber(x['sewingRate'], 'розцінка'),
          };
        }),
      };
    }),
  };
}

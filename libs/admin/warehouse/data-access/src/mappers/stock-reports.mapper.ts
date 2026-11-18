import { fabricLayers, planFactResults } from '@admin/warehouse/model';

import {
  boolean,
  dateTime,
  day,
  decimal,
  integer,
  list,
  nonEmptyText,
  nullableNumber,
  nullableText,
  oneOf,
  record,
  text,
} from '../validators/warehouse-response';

import type {
  BookingItem,
  BookingPair,
  BookingReport,
  BookingUnknown,
  FabricLayer,
  PlanFactItem,
  PlanFactMaterial,
  PlanFactModel,
  PlanFactReport,
  PlanFactSummary,
} from '@admin/warehouse/model';

const layer = (value: unknown): FabricLayer => oneOf(value, fabricLayers, 'шар');
const nullableLayer = (value: unknown): FabricLayer | null =>
  value === null || value === undefined ? null : layer(value);
export const nullableDay = (value: unknown, what: string): string | null =>
  value === null || value === undefined ? null : day(value, what);

/** The order an item belongs to, as every report row carries it. */
export const orderRef = (row: Record<string, unknown>) => ({
  orderId: integer(row['orderId'], 'завдання', 1),
  orderNumber: integer(row['orderNumber'], 'номер завдання', 1),
  clientName: text(row['clientName'], 'замовник'),
  itemId: integer(row['itemId'], 'позиція', 1),
});

// «План і факт»

const summary = (value: unknown): PlanFactSummary => {
  const row = record(value, 'підсумок плану і факту');
  return {
    orders: integer(row['orders'], 'замовлень'),
    products: integer(row['products'], 'виробів'),
    planPerProduct: nullableNumber(row['planPerProduct'], 'план на виріб'),
    factPerProduct: decimal(row['factPerProduct'], 'факт на виріб'),
    differencePerProduct: nullableNumber(row['differencePerProduct'], 'різниця на виріб'),
    difference: nullableNumber(row['difference'], 'різниця'),
    result: oneOf(row['result'], planFactResults, 'результат'),
    uncomparableItems: integer(row['uncomparableItems'], 'без оцінки'),
  };
};

const material = (value: unknown): PlanFactMaterial => {
  const row = record(value, 'матеріал');
  return {
    layer: nullableLayer(row['layer']),
    planFabricCode: nullableText(row['planFabricCode'], 'код плану'),
    planFabricName: nullableText(row['planFabricName'], 'тканина плану'),
    planColor: nullableText(row['planColor'], 'колір плану'),
    plan: nullableNumber(row['plan'], 'план'),
    fact: nullableNumber(row['fact'], 'факт'),
    difference: nullableNumber(row['difference'], 'різниця'),
    used: list(row['used'], 'використані тканини').map((x) => text(x, 'тканина')),
  };
};

const planFactItem = (value: unknown): PlanFactItem => {
  const row = record(value, 'позиція плану і факту');
  return {
    ...orderRef(row),
    products: integer(row['products'], 'виробів'),
    plan: nullableNumber(row['plan'], 'план'),
    fact: decimal(row['fact'], 'факт'),
    difference: nullableNumber(row['difference'], 'різниця'),
    result: oneOf(row['result'], planFactResults, 'результат'),
    reason: nullableText(row['reason'], 'причина'),
    materials: list(row['materials'], 'матеріали').map(material),
    issuedOn: nullableDay(row['issuedOn'], 'день видачі'),
  };
};

const planFactModel = (value: unknown): PlanFactModel => {
  const row = record(value, 'модель');
  return {
    modelName: text(row['modelName'], 'модель'),
    modelCode: nullableText(row['modelCode'], 'код моделі'),
    summary: summary(row['summary']),
    items: list(row['items'], 'позиції').map(planFactItem),
  };
};

export function mapPlanFact(value: unknown): PlanFactReport {
  const row = record(value, 'план і факт');
  return {
    models: list(row['models'], 'моделі').map(planFactModel),
    total: summary(row['total']),
    inProgressItems: integer(row['inProgressItems'], 'ще видаються'),
  };
}

// «Бронь і що замовити»

const bookingItem = (value: unknown): BookingItem => {
  const row = record(value, 'бронь позиції');
  return {
    ...orderRef(row),
    modelName: text(row['modelName'], 'модель'),
    dueDate: nullableDay(row['dueDate'], 'термін'),
    layer: layer(row['layer']),
    plan: decimal(row['plan'], 'план'),
    covered: decimal(row['covered'], 'покрито'),
    remaining: decimal(row['remaining'], 'ще потрібно'),
    reserved: decimal(row['reserved'], 'бронь'),
    toOrder: decimal(row['toOrder'], 'замовити'),
  };
};

const bookingPair = (value: unknown): BookingPair => {
  const row = record(value, 'пара броні');
  return {
    fabricCode: nonEmptyText(row['fabricCode'], 'код тканини'),
    fabricName: text(row['fabricName'], 'тканина'),
    color: text(row['color'], 'колір'),
    stock: decimal(row['stock'], 'на складі'),
    need: decimal(row['need'], 'потреба'),
    reserved: decimal(row['reserved'], 'бронь'),
    free: decimal(row['free'], 'вільно'),
    toOrder: decimal(row['toOrder'], 'замовити'),
    shortage: decimal(row['shortage'], 'нестача'),
    supplier: nullableText(row['supplier'], 'постачальник'),
    needBy: nullableDay(row['needBy'], 'потрібно до'),
    items: list(row['items'], 'позиції').map(bookingItem),
  };
};

const bookingUnknown = (value: unknown): BookingUnknown => {
  const row = record(value, 'невідомий план');
  return {
    ...orderRef(row),
    modelName: text(row['modelName'], 'модель'),
    reason: nonEmptyText(row['reason'], 'причина'),
  };
};

export function mapBooking(value: unknown): BookingReport {
  const row = record(value, 'бронь');
  return {
    reserved: decimal(row['reserved'], 'бронь'),
    free: decimal(row['free'], 'вільно'),
    toOrder: decimal(row['toOrder'], 'замовити'),
    pairs: list(row['pairs'], 'пари').map(bookingPair),
    unknown: list(row['unknown'], 'невідомі плани').map(bookingUnknown),
    calculatedAt: dateTime(row['calculatedAt'], 'час розрахунку'),
    canReceive: boolean(row['canReceive'], 'право на прихід'),
  };
}

// «Вартість складу»

// «Фурнітура до замовлення»

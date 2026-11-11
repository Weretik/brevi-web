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
  HardwareIncomplete,
  HardwareNeed,
  HardwareNeedOrder,
  HardwareReport,
  PlanFactItem,
  PlanFactMaterial,
  PlanFactModel,
  PlanFactReport,
  PlanFactSummary,
  ValuationColor,
  ValuationFabric,
  ValuationReport,
  ValuationShortage,
} from '@admin/warehouse/model';

const layer = (value: unknown): FabricLayer => oneOf(value, fabricLayers, 'шар');
const nullableLayer = (value: unknown): FabricLayer | null =>
  value === null || value === undefined ? null : layer(value);
const nullableDay = (value: unknown, what: string): string | null =>
  value === null || value === undefined ? null : day(value, what);

/** The order an item belongs to, as every report row carries it. */
const orderRef = (row: Record<string, unknown>) => ({
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
  };
}

// «Вартість складу»

const valuationColor = (value: unknown): ValuationColor => {
  const row = record(value, 'колір вартості');
  return {
    color: text(row['color'], 'колір'),
    meters: decimal(row['meters'], 'метри'),
    price: nullableNumber(row['price'], 'ціна'),
    value: nullableNumber(row['value'], 'вартість'),
  };
};

const valuationFabric = (value: unknown): ValuationFabric => {
  const row = record(value, 'тканина вартості');
  return {
    fabricCode: nonEmptyText(row['fabricCode'], 'код тканини'),
    fabricName: text(row['fabricName'], 'тканина'),
    price: nullableNumber(row['price'], 'ціна'),
    priceFabricCode: nullableText(row['priceFabricCode'], 'ціна з пропозиції'),
    meters: decimal(row['meters'], 'метри'),
    unpricedMeters: decimal(row['unpricedMeters'], 'без ціни'),
    value: decimal(row['value'], 'вартість'),
    colors: list(row['colors'], 'кольори').map(valuationColor),
  };
};

const valuationShortage = (value: unknown): ValuationShortage => {
  const row = record(value, 'нестача');
  return {
    fabricCode: nonEmptyText(row['fabricCode'], 'код тканини'),
    fabricName: text(row['fabricName'], 'тканина'),
    color: text(row['color'], 'колір'),
    meters: decimal(row['meters'], 'нестача'),
    price: nullableNumber(row['price'], 'ціна'),
    value: nullableNumber(row['value'], 'вартість'),
  };
};

export function mapValuation(value: unknown): ValuationReport {
  const row = record(value, 'вартість складу');
  return {
    value: decimal(row['value'], 'вартість'),
    positiveMeters: decimal(row['positiveMeters'], 'метри'),
    unpricedPairs: integer(row['unpricedPairs'], 'пар без ціни'),
    unpricedMeters: decimal(row['unpricedMeters'], 'метрів без ціни'),
    isPartial: boolean(row['isPartial'], 'часткова'),
    shortageMeters: decimal(row['shortageMeters'], 'нестача'),
    shortageValue: decimal(row['shortageValue'], 'вартість нестачі'),
    fabrics: list(row['fabrics'], 'тканини').map(valuationFabric),
    shortages: list(row['shortages'], 'нестачі').map(valuationShortage),
    calculatedAt: dateTime(row['calculatedAt'], 'час розрахунку'),
    priceSource: text(row['priceSource'], 'джерело цін'),
  };
}

// «Фурнітура до замовлення»

const needOrder = (value: unknown): HardwareNeedOrder => {
  const row = record(value, 'частка замовлення');
  return {
    ...orderRef(row),
    modelName: text(row['modelName'], 'модель'),
    norm: decimal(row['norm'], 'норма'),
    products: integer(row['products'], 'виробів'),
    quantity: decimal(row['quantity'], 'потреба'),
  };
};

const need = (value: unknown): HardwareNeed => {
  const row = record(value, 'фурнітура');
  return {
    code: nonEmptyText(row['code'], 'код'),
    name: nonEmptyText(row['name'], 'назва'),
    nameChecked: boolean(row['nameChecked'], 'назва перевірена'),
    note: nullableText(row['note'], 'примітка'),
    unit: nonEmptyText(row['unit'], 'одиниця'),
    quantity: decimal(row['quantity'], 'потреба'),
    orders: list(row['orders'], 'замовлення').map(needOrder),
  };
};

const incomplete = (value: unknown): HardwareIncomplete => {
  const row = record(value, 'неповна потреба');
  return {
    ...orderRef(row),
    modelName: text(row['modelName'], 'модель'),
    code: nullableText(row['code'], 'код'),
    name: nullableText(row['name'], 'назва'),
    reason: nonEmptyText(row['reason'], 'причина'),
  };
};

export function mapHardware(value: unknown): HardwareReport {
  const row = record(value, 'фурнітура до замовлення');
  return {
    orders: integer(row['orders'], 'замовлень'),
    items: integer(row['items'], 'позицій'),
    needs: list(row['needs'], 'потреба').map(need),
    incomplete: list(row['incomplete'], 'неповна потреба').map(incomplete),
    calculatedAt: dateTime(row['calculatedAt'], 'час розрахунку'),
  };
}

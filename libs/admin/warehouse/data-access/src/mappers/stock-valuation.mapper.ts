import { nullableDay, orderRef } from './stock-reports.mapper';
import {
  boolean,
  dateTime,
  decimal,
  integer,
  list,
  nonEmptyText,
  nullableNumber,
  nullableText,
  record,
  text,
} from '../validators/warehouse-response';

import type {
  HardwareIncomplete,
  HardwareNeed,
  HardwareNeedOrder,
  HardwareReport,
  ValuationColor,
  ValuationFabric,
  ValuationReport,
  ValuationShortage,
} from '@admin/warehouse/model';

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

const needOrder = (value: unknown): HardwareNeedOrder => {
  const row = record(value, 'частка замовлення');
  return {
    ...orderRef(row),
    modelName: text(row['modelName'], 'модель'),
    norm: decimal(row['norm'], 'норма'),
    products: integer(row['products'], 'виробів'),
    quantity: decimal(row['quantity'], 'потреба'),
    dueDate: nullableDay(row['dueDate'], 'термін'),
  };
};

export const need = (value: unknown): HardwareNeed => {
  const row = record(value, 'фурнітура');
  return {
    code: nonEmptyText(row['code'], 'код'),
    name: nonEmptyText(row['name'], 'назва'),
    nameChecked: boolean(row['nameChecked'], 'назва перевірена'),
    note: nullableText(row['note'], 'примітка'),
    unit: nonEmptyText(row['unit'], 'одиниця'),
    quantity: decimal(row['quantity'], 'потреба'),
    orders: list(row['orders'], 'замовлення').map(needOrder),
    dueDate: nullableDay(row['dueDate'], 'найближчий термін'),
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

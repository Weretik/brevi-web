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
  record,
  text,
} from '../validators/production-response';

import type {
  ReportIssueRow,
  ReportOutputRow,
  ReportStaffRow,
  ReportStockRow,
  WorkshopDashboard,
  WorkshopReport,
  WorkshopReportPair,
  WorkshopReportTotals,
} from '@admin/production/model';

const months = (value: unknown, what: string) => list(value, what).map((x) => text(x, what));

function mapTotals(value: unknown): WorkshopReportTotals {
  const source = record(value, 'підсумки звіту');
  const number = (key: keyof WorkshopReportTotals) => decimal(source[key], key);
  return {
    sewnPieces: integer(source['sewnPieces'], 'пошито'),
    outputValue: number('outputValue'),
    unpricedPieces: integer(source['unpricedPieces'], 'без ціни'),
    accrued: number('accrued'),
    minutes: integer(source['minutes'], 'хвилини'),
    issuedMeters: number('issuedMeters'),
    issuedValue: number('issuedValue'),
    unpricedIssuedMeters: number('unpricedIssuedMeters'),
    stockMeters: number('stockMeters'),
    stockValue: number('stockValue'),
    unpricedStockMeters: number('unpricedStockMeters'),
  };
}

function mapOutput(value: unknown): ReportOutputRow {
  const row = record(value, 'випуск');
  return {
    orderId: integer(row['orderId'], 'id завдання', 1),
    orderNumber: integer(row['orderNumber'], 'номер завдання', 1),
    clientName: text(row['clientName'], 'замовник'),
    itemId: integer(row['itemId'], 'id позиції', 1),
    modelName: text(row['modelName'], 'модель'),
    quantity: integer(row['quantity'], 'пошито'),
    unitPrice: nullableNumber(row['unitPrice'], 'ціна'),
    value: nullableNumber(row['value'], 'вартість'),
  };
}

function mapStaff(value: unknown): ReportStaffRow {
  const row = record(value, 'працівник звіту');
  return {
    employeeId: integer(row['employeeId'], 'id працівника', 1),
    name: nonEmptyText(row['name'], 'працівник'),
    position: text(row['position'], 'посада'),
    minutes: integer(row['minutes'], 'хвилини'),
    sewn: integer(row['sewn'], 'пошито'),
    cut: integer(row['cut'], 'розкроєно'),
    accrued: decimal(row['accrued'], 'нараховано'),
    dayAverage: nullableNumber(row['dayAverage'], 'за 8 годин'),
  };
}

function mapIssue(value: unknown): ReportIssueRow {
  const row = record(value, 'видача');
  return {
    movementId: integer(row['movementId'], 'id руху', 1),
    issuedOn: day(row['issuedOn'], 'дата видачі'),
    fabricCode: text(row['fabricCode'], 'код тканини'),
    fabricName: text(row['fabricName'], 'тканина'),
    color: text(row['color'], 'колір'),
    orderId: nullableInteger(row['orderId'], 'id завдання', 1),
    orderNumber: nullableInteger(row['orderNumber'], 'номер завдання', 1),
    modelName: nullableText(row['modelName'], 'модель'),
    meters: decimal(row['meters'], 'метри'),
    pricePerMeter: nullableNumber(row['pricePerMeter'], 'ціна'),
    value: nullableNumber(row['value'], 'вартість'),
  };
}

function mapStock(value: unknown): ReportStockRow {
  const row = record(value, 'залишок');
  return {
    stockId: integer(row['stockId'], 'id залишку', 1),
    fabricCode: text(row['fabricCode'], 'код тканини'),
    fabricName: text(row['fabricName'], 'тканина'),
    color: text(row['color'], 'колір'),
    meters: decimal(row['meters'], 'метри'),
    pricePerMeter: nullableNumber(row['pricePerMeter'], 'ціна'),
    value: nullableNumber(row['value'], 'вартість'),
  };
}

export function mapWorkshopReport(value: unknown): WorkshopReport {
  const source = record(value, 'звіт цеху');
  return {
    from: text(source['from'], 'початок'),
    to: text(source['to'], 'кінець'),
    closedMonths: months(source['closedMonths'], 'закриті місяці'),
    openMonths: months(source['openMonths'], 'відкриті місяці'),
    totals: mapTotals(source['totals']),
    output: list(source['output'], 'випуск').map(mapOutput),
    staff: list(source['staff'], 'працівники').map(mapStaff),
    materials: list(source['materials'], 'видані матеріали').map(mapIssue),
    stock: list(source['stock'], 'залишки').map(mapStock),
    warnings: months(source['warnings'], 'попередження'),
  };
}

export function mapWorkshopReportPair(value: unknown): WorkshopReportPair {
  const source = record(value, 'звіти цеху');
  return {
    current: mapWorkshopReport(source['current']),
    comparison:
      source['comparison'] === null || source['comparison'] === undefined
        ? null
        : mapWorkshopReport(source['comparison']),
  };
}

export function mapWorkshopDashboard(value: unknown): WorkshopDashboard {
  const source = record(value, 'огляд виробництва');
  return {
    today: day(source['today'], 'сьогодні'),
    openOrders: integer(source['openOrders'], 'у цеху'),
    openPieces: integer(source['openPieces'], 'виробів у цеху'),
    lateOrders: integer(source['lateOrders'], 'прострочено'),
    readyOrders: integer(source['readyOrders'], 'до відвантаження'),
    readyPieces: integer(source['readyPieces'], 'виробів до відвантаження'),
    stages: list(source['stages'], 'етапи').map((item) => {
      const stage = record(item, 'етап');
      return {
        stage: integer(stage['stage'], 'етап', 1),
        label: nonEmptyText(stage['label'], 'назва етапу'),
        orders: list(stage['orders'], 'завдання етапу').map((entry) => {
          const order = record(entry, 'завдання');
          return {
            id: integer(order['id'], 'id завдання', 1),
            number: integer(order['number'], 'номер завдання', 1),
            clientName: text(order['clientName'], 'замовник'),
            product: text(order['product'], 'виріб'),
            items: integer(order['items'], 'позицій'),
            quantity: integer(order['quantity'], 'кількість'),
            progress: integer(order['progress'], 'прогрес'),
            dueDate: day(order['dueDate'], 'готово до'),
            isLate: boolean(order['isLate'], 'прострочено'),
          };
        }),
      };
    }),
    hours:
      source['hours'] === null || source['hours'] === undefined
        ? null
        : list(source['hours'], 'години').map((item) => {
            const row = record(item, 'години працівника');
            return {
              employeeId: integer(row['employeeId'], 'id працівника', 1),
              name: nonEmptyText(row['name'], 'працівник'),
              minutes: integer(row['minutes'], 'хвилини'),
            };
          }),
  };
}

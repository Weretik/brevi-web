import { describe, expect, it } from 'vitest';

import { createProductionItemFormValues, plannedFabricMeters } from './production-item-form';
import {
  createOrderBody,
  createOrderFormValues,
  hasCreateOrderErrors,
  updateOrderBody,
  validateCreateOrder,
} from './production-order-form';
import {
  createShipmentFormValues,
  shipmentBody,
  validateShipment,
} from './production-shipment-form';
import { validateWorkshopSettings, workshopSettingsBody } from './workshop-settings-form';
import { toggleStage } from '../entities/production-tracking';
import { productionOrdersCsv } from '../queries/production-orders-csv';
import { parseProductionOrderImportFile } from '../validators/production-order-import-file';

import type {
  ProductionItem,
  ProductionOrder,
  ProductionOrderSummary,
  ProductionQuoteDraft,
} from '../entities/production-order';

const norm = {
  oneColor: 1.5,
  twoColorsMain: 1.2,
  twoColorsAdditional: 0.5,
  threeColorsMain: 1,
  threeColorsAdditional1: 0.4,
  threeColorsAdditional2: 0.3,
};

const draft: ProductionQuoteDraft = {
  quoteId: 7,
  number: 'КП-7',
  clientName: 'Школа 5',
  managerName: 'Олена',
  items: [
    {
      quoteItemId: 11,
      name: 'Куртка',
      modelCode: 'MOD-025',
      norm,
      options: [
        {
          optionId: 21,
          title: 'Основна',
          fabricCode: 'FAB-1',
          fabricName: 'Оксфорд',
          retail: 900,
          wholesale: 800,
          large: 700,
          sewingRate: null,
        },
      ],
    },
    { quoteItemId: 12, name: 'Жилет', modelCode: null, norm: null, options: [] },
  ],
  embroideries: [],
};

describe('production order forms', () => {
  it('counts planned fabric for one, two and three colours like the server', () => {
    expect(plannedFabricMeters(norm, { quantity: '10', additionalColors: [] })).toBe(15);
    expect(plannedFabricMeters(norm, { quantity: '3', additionalColors: ['синій'] })).toBe(5.1);
    expect(plannedFabricMeters(norm, { quantity: '3', additionalColors: ['a', 'b'] })).toBe(5.1);
    expect(plannedFabricMeters(null, { quantity: '3', additionalColors: [] })).toBeNull();
    expect(plannedFabricMeters(norm, { quantity: '0', additionalColors: [] })).toBeNull();
  });

  it('presets the fabric only when a КП item has one option and needs the rest filled in', () => {
    const values = createOrderFormValues(draft, '2026-11-04');
    expect(values.priceTier).toBe('Wholesale');
    expect(values.lines.map((x) => x.optionId)).toEqual([21, null]);

    const errors = validateCreateOrder(values);
    expect(errors.lines[11]).toMatchObject({
      quantity: expect.any(String),
      mainColor: expect.any(String),
    });
    expect(errors.lines[12]?.optionId).toBe('Оберіть тканину.');
    expect(hasCreateOrderErrors(errors)).toBe(true);
  });

  it('sends only the chosen items with the request id', () => {
    const values = createOrderFormValues(draft, '2026-11-04');
    values.lines[0].values = {
      ...values.lines[0].values,
      quantity: '12',
      dueDate: '2026-11-20',
      mainColor: ' чорний ',
      additionalColors: ['', 'червоний'],
    };
    values.lines[1].include = false;
    expect(hasCreateOrderErrors(validateCreateOrder(values))).toBe(false);

    const body = createOrderBody(draft, values, 'req-1');
    expect(body).toMatchObject({ requestId: 'req-1', quoteId: 7, priceTier: 'Wholesale' });
    expect(body.items).toHaveLength(1);
    expect(body.items[0]).toMatchObject({
      quoteItemId: 11,
      quoteOptionId: 21,
      details: { quantity: 12, mainColor: 'чорний', additionalColors: ['червоний'] },
    });
  });

  it('puts the КП embroidery into every item and sends the calculation only for an embroidery', () => {
    const calculation = {
      id: 42,
      number: 'ВШ-0042',
      name: 'Логотип',
      customerName: null,
      quantity: 12,
      stitchesPerUnit: 8000,
      hoopLabel: '18 см',
      mockupThumbnailUrl: null,
    };
    const values = createOrderFormValues(
      { ...draft, embroideries: [{ quoteItemId: 13, calculation }] },
      '2026-11-04',
    );
    expect(values.lines.map((x) => x.values.applications[0]?.embroidery?.number)).toEqual([
      'ВШ-0042',
      'ВШ-0042',
    ]);

    const line = values.lines[0].values;
    const details = createOrderBody(
      draft,
      {
        ...values,
        lines: [
          {
            ...values.lines[0],
            values: {
              ...line,
              applications: [line.applications[0], { ...line.applications[0], kind: 'Print' }],
            },
          },
        ],
      },
      'req-2',
    ).items[0].details;
    expect(details.applications.map((x) => x.embroideryCalculationId)).toEqual([42, null]);
    expect(details.applications[0].description).toBe('Логотип');
  });

  it('asks for at least one item', () => {
    const values = createOrderFormValues(draft, '2026-11-04');
    values.lines.forEach((line) => (line.include = false));
    expect(validateCreateOrder(values).form).toBe('Оберіть хоча б одну позицію.');
  });

  it('does not send a sewing rate for someone who does not see it', () => {
    const item = {
      id: 3,
      position: 1,
      modelCode: 'MOD-025',
      modelName: 'Куртка',
      fabricCode: null,
      fabricName: null,
      quantity: 5,
      dueDate: '2026-11-20',
      mainColor: 'чорний',
      additionalColors: [],
      sizesText: null,
      technicalChanges: null,
      comment: null,
      applications: [],
      plannedFabricMeters: 7.5,
      sewingRate: null,
      reportUnitPrice: null,
      stages: ['New'],
      currentStage: 'New',
      shippedQuantity: 0,
      shipments: [],
    } satisfies ProductionItem;
    const order = {
      version: 4,
      items: [item],
      permissions: {
        canEdit: true,
        canCopy: true,
        canDelete: false,
        seesSewingRate: false,
        seesReportPrice: false,
      },
    } as unknown as ProductionOrder;
    const edited = { ...createProductionItemFormValues(item), quantity: '6', sewingRate: '99' };

    const body = updateOrderBody(
      order,
      { clientName: ' Школа ', orderDate: '2026-11-04', comment: '' },
      { itemId: 3, values: edited },
    );
    expect(body).toMatchObject({ version: 4, clientName: 'Школа', comment: null });
    expect(body.items[0]).toMatchObject({ id: 3, sewingRate: null, details: { quantity: 6 } });
  });

  it('exports a CSV that Excel opens', () => {
    const row: ProductionOrderSummary = {
      id: 1,
      number: 5,
      status: 'New',
      clientName: 'ТОВ "Ромашка"; філія',
      quoteId: 7,
      quoteNumber: 'КП-7',
      managerName: 'Олена',
      orderDate: '2026-11-04',
      itemsCount: 2,
      totalQuantity: 30,
      nearestDueDate: null,
      isTransferred: false,
      updatedAt: '2026-11-04T10:00:00Z',
      stage: 'Cutting',
      shippedQuantity: 10,
      items: [
        { modelName: 'Куртка', quantity: 20, stage: 'Cutting' },
        { modelName: 'Штани', quantity: 10, stage: 'Sewing' },
      ],
    };
    const csv = productionOrdersCsv([row]);
    expect(csv.startsWith('﻿Номер;Статус;')).toBe(true);
    expect(csv).toContain('5;Нове;Крій;"ТОВ ""Ромашка""; філія";Куртка ×20 · Штани ×10;КП-7;');
    expect(csv).toContain(';2;30;10;');
    expect(csv.endsWith('\r\n')).toBe(true);
  });

  it('checks the shape of the old «Цех» file', () => {
    expect(parseProductionOrderImportFile('{').error).toBe('Файл не схожий на JSON.');
    expect(parseProductionOrderImportFile('[]').error).toBe('У файлі немає завдань.');
    expect(parseProductionOrderImportFile('[{"legacyId":"a"}]').error).toContain('Завдання 1');
    const ok = parseProductionOrderImportFile(
      JSON.stringify([
        { legacyId: 'a', number: 1, clientName: 'X', status: 'Closed', items: [{}] },
      ]),
    );
    expect(ok.error).toBeNull();
    expect(ok.rows).toHaveLength(1);
  });
});

describe('production tracking forms', () => {
  it('keeps ticked stages in workshop order and falls back to «Нове»', () => {
    expect(toggleStage(['Sewing'], 'FabricAvailable')).toEqual(['FabricAvailable', 'Sewing']);
    expect(toggleStage(['Sewing'], 'Sewing')).toEqual(['New']);
  });

  it('never ships more than is left', () => {
    const values = createShipmentFormValues(6, '2026-11-05');
    expect(validateShipment(values, 6)).toEqual({});
    expect(validateShipment({ ...values, quantity: '7' }, 6).quantity).toBe(
      'Залишилось відвантажити 6 шт.',
    );
    expect(shipmentBody({ ...values, comment: ' ' }, 3)).toEqual({
      version: 3,
      quantity: 6,
      shippedOn: '2026-11-05',
      comment: null,
    });
  });

  it('needs a group to turn sending on and a whole topic number', () => {
    expect(
      validateWorkshopSettings({ telegramEnabled: true, chatId: '', threadId: '' }).chatId,
    ).toBeTruthy();
    expect(
      validateWorkshopSettings({ telegramEnabled: false, chatId: '-100', threadId: '1.5' })
        .threadId,
    ).toBeTruthy();
    expect(
      workshopSettingsBody({ telegramEnabled: true, chatId: '-100', threadId: '434' }),
    ).toEqual({ telegramEnabled: true, telegramChatId: -100, telegramThreadId: 434 });
  });
});

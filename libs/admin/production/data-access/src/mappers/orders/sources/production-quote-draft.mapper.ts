import {
  integer,
  list,
  nonEmptyText,
  nullableDateTime,
  nullableNumber,
  nullableText,
  record,
} from '../../../validators/production-response';
import { mapFabricNormValues } from '../../norms/fabric-norm.mapper';
import { mapProductionEmbroideryChoice } from '../card/production-application.mapper';

import type { ProductionQuoteDraft, ProductionQuoteSource } from '@admin/production/model';

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
    // Optional for a backend that does not send it yet.
    embroideries: list(row['embroideries'] ?? [], 'вишивка КП').map((entry) => {
      const x = record(entry, 'вишивка КП');
      return {
        quoteItemId: integer(x['quoteItemId'], 'позиція КП', 1),
        calculation: mapProductionEmbroideryChoice(x['calculation']),
      };
    }),
  };
}

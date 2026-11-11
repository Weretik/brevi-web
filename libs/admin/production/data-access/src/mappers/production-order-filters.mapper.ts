import {
  integer,
  list,
  nonEmptyText,
  nullableText,
  record,
  text,
} from '../validators/production-response';

import type {
  ProductionFilterOption,
  ProductionModelSummary,
  ProductionModelSummaryRow,
  ProductionOrderFilterOptions,
} from '@admin/production/model';

const texts = (value: unknown, what: string) => list(value, what).map((x) => text(x, what));

const option = (value: unknown): ProductionFilterOption => {
  const row = record(value, 'варіант фільтра');
  return {
    code: nonEmptyText(row['code'], 'код'),
    name: nonEmptyText(row['name'], 'назва'),
  };
};

export function mapProductionOrderFilterOptions(value: unknown): ProductionOrderFilterOptions {
  const row = record(value, 'варіанти фільтрів');
  return {
    clients: texts(row['clients'], 'замовники'),
    models: list(row['models'], 'моделі').map(option),
    fabrics: list(row['fabrics'], 'тканини').map(option),
    colors: texts(row['colors'], 'кольори'),
    seasons: texts(row['seasons'], 'сезони'),
  };
}

const summaryRow = (value: unknown): ProductionModelSummaryRow => {
  const row = record(value, 'рядок зведення');
  return {
    modelCode: nullableText(row['modelCode'], 'код моделі'),
    modelName: nonEmptyText(row['modelName'], 'модель'),
    season: nullableText(row['season'], 'сезон'),
    category: nonEmptyText(row['category'], 'категорія'),
    quantity: integer(row['quantity'], 'кількість'),
    ordersCount: integer(row['ordersCount'], 'завдань'),
  };
};

export function mapProductionModelSummary(value: unknown): ProductionModelSummary {
  const row = record(value, 'зведення за моделями');
  return {
    rows: list(row['rows'], 'рядки зведення').map(summaryRow),
    totalQuantity: integer(row['totalQuantity'], 'усього виробів'),
  };
}

import type {
  ProductionFilterOption,
  ProductionOrderFilterField,
  ProductionOrderFilterOptions,
  ProductionOrderFilterValues,
} from '../../entities/orders/production-order';

/** Labels of the «Фільтри» fields on «Виробничі завдання». */
export const productionOrderFilterLabels: Record<ProductionOrderFilterField, string> = {
  client: 'Замовник',
  from: 'Період від',
  to: 'Період до',
  model: 'Модель',
  fabric: 'Тканина',
  color: 'Колір',
  season: 'Сезон',
};

const filterFields = Object.keys(productionOrderFilterLabels) as ProductionOrderFilterField[];

/** The panel's fields that hold a value, in panel order. */
export const setProductionOrderFilters = (values: ProductionOrderFilterValues) =>
  filterFields.filter((field) => values[field]);

/** How many of the panel's filters are set: the seven fields and the manager. */
export const countProductionOrderFilters = (
  values: ProductionOrderFilterValues,
  manager: string | null,
) => setProductionOrderFilters(values).length + (manager ? 1 : 0);

const formatDate = (value: string) => value.split('-').reverse().join('.');

function optionLabel(list: ProductionFilterOption[] | undefined, code: string) {
  const option = list?.find((x) => x.code === code);
  return option && option.name !== option.code ? `${option.code} · ${option.name}` : code;
}

/** Text of the chip for one set filter, for example «Модель: MOD-052 · Куртка». */
export function productionOrderFilterChipText(
  field: ProductionOrderFilterField,
  value: string,
  options: ProductionOrderFilterOptions | null,
) {
  const label = productionOrderFilterLabels[field];
  if (field === 'from' || field === 'to') return `${label}: ${formatDate(value)}`;
  if (field === 'model') return `${label}: ${optionLabel(options?.models, value)}`;
  if (field === 'fabric') return `${label}: ${optionLabel(options?.fabrics, value)}`;
  return `${label}: ${value}`;
}

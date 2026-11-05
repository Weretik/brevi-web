import type {
  CategoryDirection,
  FinanceCategory,
  FinanceCategoryCreateBody,
  FinanceCategoryUpdateBody,
  LedgerScope,
} from '../../entities/categories/finance-category';
import type { FinanceCategoryFormValues } from '../../validators/categories/finance-category-validation';

export function createFinanceCategoryFormValues(
  category: FinanceCategory | null,
  direction: CategoryDirection,
  parentId: string | null = null,
): FinanceCategoryFormValues {
  return {
    name: category?.name ?? '',
    direction: category?.direction ?? direction,
    parentId: category?.parentId ?? parentId ?? '',
    note: category?.note ?? '',
  };
}

export function financeCategoryCreateBody(
  values: FinanceCategoryFormValues,
  scope: LedgerScope,
  sortOrder: number,
): FinanceCategoryCreateBody {
  return {
    name: values.name.trim(),
    direction: values.direction,
    scope,
    parentId: values.parentId || null,
    note: values.note.trim() || null,
    sortOrder,
  };
}

export function financeCategoryUpdateBody(
  values: FinanceCategoryFormValues,
  category: FinanceCategory,
): FinanceCategoryUpdateBody {
  return {
    name: values.name.trim(),
    note: values.note.trim() || null,
    sortOrder: category.sortOrder,
    version: category.version,
  };
}

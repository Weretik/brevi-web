import { transactionTypeLabels } from '../../entities/transactions/finance-transaction';
import { counterpartyAliasLines } from '../../validators/counterparties/finance-counterparty-validation';

import type { FinanceCategory } from '../../entities/categories/finance-category';
import type {
  FinanceCounterparty,
  FinanceCounterpartyBody,
} from '../../entities/counterparties/finance-counterparty';
import type { FinanceCounterpartyFormValues } from '../../validators/counterparties/finance-counterparty-validation';

/** Root and subcategory of a category id, as the two pickers of a form show them. */
export function categoryPickerValues(
  categories: readonly FinanceCategory[],
  categoryId: string | null,
): { rootId: string; subcategoryId: string } {
  const category = categories.find((row) => row.id === categoryId);
  if (!category) return { rootId: '', subcategoryId: '' };
  return category.parentId
    ? { rootId: category.parentId, subcategoryId: category.id }
    : { rootId: category.id, subcategoryId: '' };
}

export function createFinanceCounterpartyFormValues(
  counterparty: FinanceCounterparty | null,
  categories: readonly FinanceCategory[],
  name = '',
): FinanceCounterpartyFormValues {
  return {
    name: counterparty?.name ?? name,
    edrpou: counterparty?.edrpou ?? '',
    iban: counterparty?.iban ?? '',
    bankName: counterparty?.bankName ?? '',
    aliases: counterparty?.aliases.join('\n') ?? '',
    ...categoryPickerValues(categories, counterparty?.defaultCategoryId ?? null),
    autoApplyCategory: counterparty?.autoApplyCategory ?? false,
    note: counterparty?.note ?? '',
  };
}

/** Request fields; call only after validation passed. */
export function financeCounterpartyBody(
  values: FinanceCounterpartyFormValues,
): FinanceCounterpartyBody {
  return {
    name: values.name.trim(),
    edrpou: values.edrpou.replace(/\s/g, '') || null,
    iban: values.iban.trim() || null,
    bankName: values.bankName.trim() || null,
    aliases: counterpartyAliasLines(values.aliases),
    defaultCategoryId: values.subcategoryId || values.rootId || null,
    autoApplyCategory: values.autoApplyCategory,
    note: values.note.trim() || null,
  };
}

/** The body of «Зберегти як фінансового контрагента»: only the name typed in the operation. */
export const quickFinanceCounterpartyBody = (name: string): FinanceCounterpartyBody => ({
  name: name.trim(),
  edrpou: null,
  iban: null,
  bankName: null,
  aliases: [],
  defaultCategoryId: null,
  autoApplyCategory: false,
  note: null,
});

/**
 * Default categories a counterparty may take: active ones of the current books, both directions
 * (a root says which), plus the one it already has.
 */
export function financeCounterpartyCategoryChoices(
  categories: readonly FinanceCategory[],
  parentId: string | null,
  keepId: string,
): { id: string; name: string }[] {
  return categories
    .filter(
      (row) =>
        row.scope === 'Current' && row.parentId === parentId && (row.active || row.id === keepId),
    )
    .sort(
      (a, b) =>
        a.direction.localeCompare(b.direction) ||
        a.sortOrder - b.sortOrder ||
        a.name.localeCompare(b.name, 'uk'),
    )
    .map((row) => ({
      id: row.id,
      name: parentId
        ? row.name
        : `${row.name} · ${transactionTypeLabels[row.direction].toLowerCase()}`,
    }));
}

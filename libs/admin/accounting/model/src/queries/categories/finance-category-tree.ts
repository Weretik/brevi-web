import type {
  CategoryDirection,
  FinanceCategory,
  LedgerScope,
} from '../../entities/categories/finance-category';

/** A row of the categories table: a root, or a subcategory right under its root. */
export interface FinanceCategoryRow extends FinanceCategory {
  level: 0 | 1;
  parentName: string | null;
  childCount: number;
}

const byOrder = (a: FinanceCategory, b: FinanceCategory) =>
  a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, 'uk');

export function countFinanceCategories(
  rows: readonly FinanceCategory[],
  scope: LedgerScope,
): Record<CategoryDirection, number> {
  const inScope = rows.filter((row) => row.scope === scope);
  return {
    Expense: inScope.filter((row) => row.direction === 'Expense').length,
    Income: inScope.filter((row) => row.direction === 'Income').length,
  };
}

/**
 * Roots of one area and direction, each followed by its subcategories. Search keeps a root when it
 * or any subcategory matches, and a subcategory when it or its root matches.
 */
export function financeCategoryRows(
  rows: readonly FinanceCategory[],
  scope: LedgerScope,
  direction: CategoryDirection,
  search: string,
): FinanceCategoryRow[] {
  const text = search.trim().toLocaleLowerCase('uk');
  const matches = (row: FinanceCategory) =>
    !text ||
    row.name.toLocaleLowerCase('uk').includes(text) ||
    row.note.toLocaleLowerCase('uk').includes(text);
  const own = rows.filter((row) => row.scope === scope && row.direction === direction);
  const roots = own.filter((row) => row.parentId === null).sort(byOrder);
  return roots.flatMap((root) => {
    const children = own.filter((row) => row.parentId === root.id).sort(byOrder);
    const rootMatches = matches(root);
    const shownChildren = rootMatches ? children : children.filter(matches);
    if (!rootMatches && shownChildren.length === 0) return [];
    return [
      { ...root, level: 0 as const, parentName: null, childCount: children.length },
      ...shownChildren.map((child) => ({
        ...child,
        level: 1 as const,
        parentName: root.name,
        childCount: 0,
      })),
    ];
  });
}

/** Active roots a new subcategory can go under. */
export function financeCategoryParents(
  rows: readonly FinanceCategory[],
  scope: LedgerScope,
  direction: CategoryDirection,
): FinanceCategory[] {
  return rows
    .filter(
      (row) =>
        row.scope === scope && row.direction === direction && row.parentId === null && row.active,
    )
    .sort(byOrder);
}

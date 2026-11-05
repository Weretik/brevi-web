import type { FinanceAccount } from '../../entities/accounts/finance-account';

/** «Активні» (default), «Без залишку на 01.10» and «Архів». */
export type FinanceAccountFilter = 'active' | 'unconfirmed' | 'archived';

export function countFinanceAccounts(rows: readonly FinanceAccount[]) {
  return {
    active: rows.filter((row) => row.active).length,
    unconfirmed: rows.filter((row) => row.active && !row.cutoverConfirmed).length,
    archived: rows.filter((row) => !row.active).length,
  };
}

/** Search matches the name, IBAN (ignoring spaces) or note. */
export function filterFinanceAccounts(
  rows: readonly FinanceAccount[],
  search: string,
  filter: FinanceAccountFilter,
): FinanceAccount[] {
  const text = search.trim().toLocaleLowerCase('uk');
  const compact = text.replace(/\s/g, '');
  return rows.filter((row) => {
    if (filter === 'archived' ? row.active : !row.active) return false;
    if (filter === 'unconfirmed' && row.cutoverConfirmed) return false;
    if (!text) return true;
    return (
      row.name.toLocaleLowerCase('uk').includes(text) ||
      (compact.length > 0 && row.iban.toLocaleLowerCase('uk').includes(compact)) ||
      row.note.toLocaleLowerCase('uk').includes(text)
    );
  });
}

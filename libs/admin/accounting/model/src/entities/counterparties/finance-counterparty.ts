import type { FinanceTransaction } from '../transactions/finance-transaction';

export const counterpartyKinds = ['Financial', 'Client', 'Supplier'] as const;
/** Finance counterparty of «Бухгалтерія», client of «Клієнти» or supplier of «Постачальники». */
export type CounterpartyKind = (typeof counterpartyKinds)[number];

export const counterpartyKindLabels: Record<CounterpartyKind, string> = {
  Financial: 'Фінансовий',
  Client: 'Клієнт',
  Supplier: 'Постачальник',
};

export const counterpartyGroupLabels: Record<CounterpartyKind, string> = {
  Financial: 'Фінансові',
  Client: 'Клієнти',
  Supplier: 'Постачальники',
};

export const financeCounterpartyTabs = ['Financial', 'Clients', 'Suppliers', 'Oneoffs'] as const;
export type FinanceCounterpartyTab = (typeof financeCounterpartyTabs)[number];

export const financeCounterpartyTabLabels: Record<FinanceCounterpartyTab, string> = {
  Financial: 'Фінансові',
  Clients: 'Клієнти',
  Suppliers: 'Постачальники',
  Oneoffs: 'Разові',
};

/** A counterparty picked in a form: its kind and id (UUID, or a number for a supplier). */
export interface FinanceCounterpartyLink {
  kind: CounterpartyKind;
  id: string;
}

/** Who an operation is with; `missing` — the record is gone from its list. */
export interface FinanceCounterpartyRef extends FinanceCounterpartyLink {
  name: string;
  active: boolean;
  /** False only for a finance counterparty waiting for «Підтвердити». */
  verified: boolean;
  missing: boolean;
}

/** A finance counterparty of «Контрагенти → Фінансові». */
export interface FinanceCounterparty {
  id: string;
  name: string;
  edrpou: string;
  iban: string;
  bankName: string;
  aliases: string[];
  /** The chosen default category: a subcategory or a root. */
  defaultCategoryId: string | null;
  defaultCategoryRootName: string | null;
  defaultSubcategoryName: string | null;
  autoApplyCategory: boolean;
  note: string;
  verified: boolean;
  active: boolean;
  mergedIntoId: string | null;
  /** Active operations of both areas. */
  operationCount: number;
  version: number;
  createdAt: string;
  updatedAt: string;
}

/** A client or supplier in «Контрагенти»; read-only here. */
export interface FinanceParty extends FinanceCounterpartyLink {
  name: string;
  taxId: string;
  active: boolean;
  operationCount: number;
}

export interface FinanceCounterpartyCounts {
  financial: number;
  clients: number;
  suppliers: number;
  oneoffs: number;
}

/** One page of one tab; counts of every tab with the same search. */
export interface FinanceCounterpartyPage {
  tab: FinanceCounterpartyTab;
  financial: FinanceCounterparty[];
  parties: FinanceParty[];
  /** «Разові»: operations with a one-off name. */
  oneoffs: FinanceTransaction[];
  total: number;
  page: number;
  pageSize: number;
  counts: FinanceCounterpartyCounts;
}

/** A choice of the counterparty field of an operation; `hint` is ЄДРПОУ/ІПН or empty. */
export interface FinanceCounterpartyChoice extends FinanceCounterpartyLink {
  name: string;
  hint: string;
  verified: boolean;
  defaultCategoryId: string | null;
}

/** Body of a create (adds `verified`) or update (adds `version`). */
export interface FinanceCounterpartyBody {
  name: string;
  edrpou: string | null;
  iban: string | null;
  bankName: string | null;
  aliases: string[];
  defaultCategoryId: string | null;
  autoApplyCategory: boolean;
  note: string | null;
}

export const financeCounterpartyTabCount = (
  counts: FinanceCounterpartyCounts,
  tab: FinanceCounterpartyTab,
): number =>
  ({
    Financial: counts.financial,
    Clients: counts.clients,
    Suppliers: counts.suppliers,
    Oneoffs: counts.oneoffs,
  })[tab];

/** «Контрагент» of a journal row: the name and what it is, e.g. «Клієнт · архів» or «Разовий». */
export function transactionCounterpartyLabel(
  transaction: Pick<FinanceTransaction, 'counterparty' | 'oneoffName'>,
): { name: string; caption: string | null; missing: boolean } {
  const ref = transaction.counterparty;
  if (ref)
    return {
      name: ref.name,
      caption: [counterpartyKindLabels[ref.kind], ref.active ? null : 'архів']
        .filter(Boolean)
        .join(' · '),
      missing: ref.missing,
    };
  if (transaction.oneoffName)
    return { name: transaction.oneoffName, caption: 'Разовий', missing: false };
  return { name: '—', caption: null, missing: false };
}

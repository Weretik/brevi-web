export const financeAccountTypes = ['Bank', 'Card', 'Cash', 'Other'] as const;
export type FinanceAccountType = (typeof financeAccountTypes)[number];

export const financeAccountTypeLabels: Record<FinanceAccountType, string> = {
  Bank: 'Банківський рахунок',
  Card: 'Картка',
  Cash: 'Каса',
  Other: 'Інше',
};

/** An account of «Рахунки і каси»; money is in kopecks, `version` goes back with the next change. */
export interface FinanceAccount {
  id: string;
  name: string;
  type: FinanceAccountType;
  currency: string;
  iban: string;
  openingMinor: number;
  /** YYYY-MM-DD. */
  openingDate: string;
  cutoverBalanceMinor: number | null;
  cutoverConfirmed: boolean;
  cutoverConfirmedAt: string | null;
  cutoverConfirmedBy: string | null;
  note: string;
  active: boolean;
  sortOrder: number;
  version: number;
  createdAt: string;
  updatedAt: string;
}

/** Body of a create; an update adds `version`. */
export interface FinanceAccountBody {
  name: string;
  type: FinanceAccountType;
  currency: string;
  iban: string | null;
  openingMinor: number;
  openingDate: string;
  note: string | null;
  sortOrder: number;
}

export interface FinanceAccountCutoverBody {
  balanceMinor: number | null;
  confirmed: boolean;
  version: number;
}

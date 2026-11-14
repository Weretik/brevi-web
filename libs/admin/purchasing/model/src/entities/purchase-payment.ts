/**
 * A linked payment of an invoice: the expense of «Бухгалтерія» as it is now. `missing` — the
 * operation is not found (its fields are null); `voided` — it was voided after linking.
 */
export interface PurchaseInvoicePayment {
  transactionId: string;
  date: string | null;
  amountMinor: number | null;
  currency: string | null;
  accountName: string | null;
  description: string | null;
  counterpartyName: string | null;
  missing: boolean;
  voided: boolean;
  linkedBy: string;
  linkedAt: string;
}

/** An expense offered for «Прив'язати оплату»; `sameAmount` — it equals the invoice total. */
export interface PurchasePaymentCandidate {
  transactionId: string;
  date: string;
  amountMinor: number;
  currency: string;
  accountName: string;
  description: string;
  counterpartyName: string | null;
  sameAmount: boolean;
}

/** The payments of one invoice after a change, with the new review version. */
export interface PurchaseInvoicePayments {
  messageId: string;
  reviewVersion: number;
  totalPayableMinor: number | null;
  payments: readonly PurchaseInvoicePayment[];
  paymentIssues: readonly string[];
}

/** Body of «Прив'язати» / «Відв'язати»: the review version the user saw. */
export interface PurchasePaymentInput {
  messageId: string;
  transactionId: string;
  version: number;
}

/** Kopecks as «1 560,00 ₴» (other currencies keep their code). */
export function formatPurchaseMinor(minor: number, currency = 'UAH'): string {
  const sign = minor < 0 ? '−' : '';
  const value = Math.abs(minor);
  const whole = Math.trunc(value / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const fraction = (value % 100).toString().padStart(2, '0');
  return `${sign}${whole},${fraction} ${currency === 'UAH' ? '₴' : currency}`;
}

/** «06.11.2026» from YYYY-MM-DD. */
export const formatPurchasePaymentDate = (date: string): string =>
  date.split('-').reverse().join('.');

/** «06.11.2026 · 1 560,00 ₴ · Банк · Оплата рахунку 15». */
export function describePurchasePayment(
  payment: Pick<
    PurchaseInvoicePayment,
    'date' | 'amountMinor' | 'currency' | 'accountName' | 'description'
  >,
): string {
  return [
    payment.date ? formatPurchasePaymentDate(payment.date) : null,
    payment.amountMinor !== null
      ? formatPurchaseMinor(payment.amountMinor, payment.currency ?? 'UAH')
      : null,
    payment.accountName,
    payment.description || null,
  ]
    .filter(Boolean)
    .join(' · ');
}

import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PurchaseInvoicePayments } from './purchase-invoice-payments';

import type { PurchaseInvoice } from '@admin/purchasing/model';

const fixture = vi.hoisted(() => ({
  link: vi.fn(),
  unlink: vi.fn(),
  queries: [] as unknown[],
}));

const paid = {
  transactionId: 't1',
  date: '2026-11-06',
  amountMinor: 156_000,
  currency: 'UAH',
  accountName: 'Банк',
  description: 'Оплата рахунку 15',
  counterpartyName: 'Текстиль-Контакт',
  missing: false,
  voided: false,
  linkedBy: 'director@brevi.com.ua',
  linkedAt: '2026-11-08T10:00:00+00:00',
};

vi.mock('@admin/purchasing/data-access', () => ({
  useGetPurchasePaymentCandidatesQuery: (args: unknown) => {
    fixture.queries.push(args);
    return {
      data: [
        {
          transactionId: 't1',
          date: '2026-11-06',
          amountMinor: 156_000,
          currency: 'UAH',
          accountName: 'Банк',
          description: 'Оплата рахунку 15',
          counterpartyName: 'Текстиль-Контакт',
          sameAmount: true,
        },
      ],
      isFetching: false,
      error: undefined,
    };
  },
  useLinkPurchasePaymentMutation: () => [fixture.link, { isLoading: false }],
  useUnlinkPurchasePaymentMutation: () => [fixture.unlink, { isLoading: false }],
}));

const invoice = {
  messageId: 'm1',
  reviewVersion: 3,
  totalPayableMinor: 156_000,
  payments: [],
  paymentIssues: [],
} as unknown as PurchaseInvoice;

afterEach(() => {
  cleanup();
  fixture.link.mockReset();
  fixture.unlink.mockReset();
  fixture.queries = [];
});

describe('«Оплата» of a purchase invoice', () => {
  it('offers the supplier expenses and links one with the review version the user saw', async () => {
    fixture.link.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          messageId: 'm1',
          reviewVersion: 4,
          totalPayableMinor: 156_000,
          payments: [paid],
          paymentIssues: [],
        }),
    });
    render(<PurchaseInvoicePayments invoice={invoice} />);
    const user = userEvent.setup();

    expect(screen.getByText('Сума рахунку: 1 560,00 ₴')).toBeVisible();
    expect(screen.getByText('Оплату ще не привʼязано.')).toBeVisible();
    expect(fixture.queries.every((query) => typeof query === 'symbol')).toBe(true);
    await user.click(screen.getByRole('button', { name: 'Привʼязати оплату' }));

    const offered = screen.getByRole('list', { name: 'Витрати для оплати' });
    expect(within(offered).getByText('Текстиль-Контакт · сума як у рахунку')).toBeVisible();
    await user.click(within(offered).getByRole('button', { name: 'Привʼязати' }));

    expect(fixture.link).toHaveBeenCalledWith({ messageId: 'm1', transactionId: 't1', version: 3 });
    const linked = await screen.findByRole('list', { name: 'Привʼязані оплати' });
    expect(linked).toHaveTextContent('06.11.2026 · 1 560,00 ₴ · Банк · Оплата рахунку 15');
    expect(screen.queryByRole('list', { name: 'Витрати для оплати' })).not.toBeInTheDocument();
  });

  it('shows payment problems and unlinks with the current version', async () => {
    fixture.unlink.mockReturnValue({
      unwrap: () => Promise.reject({ status: 409, message: 'Цей рахунок уже змінили.' }),
    });
    render(
      <PurchaseInvoicePayments
        invoice={
          {
            ...invoice,
            payments: [{ ...paid, voided: true }],
            paymentIssues: ['Оплату 06.11.2026 на 1 560,00 ₴ анульовано в «Бухгалтерії».'],
          } as PurchaseInvoice
        }
      />,
    );
    const user = userEvent.setup();

    expect(
      screen.getByText('Оплату 06.11.2026 на 1 560,00 ₴ анульовано в «Бухгалтерії».'),
    ).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Відвʼязати' }));

    expect(fixture.unlink).toHaveBeenCalledWith({
      messageId: 'm1',
      transactionId: 't1',
      version: 3,
    });
    await waitFor(() => expect(screen.getByRole('alert')).toBeVisible());
    expect(fixture.queries.every((query) => typeof query === 'symbol')).toBe(true);
  });
});

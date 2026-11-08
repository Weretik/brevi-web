import { describePurchasePayment, formatPurchaseMinor } from '@admin/purchasing/model';
import { Button, Stack, TextField, Typography } from '@mui/material';

import type { PurchaseInvoicePayment, PurchasePaymentCandidate } from '@admin/purchasing/model';

interface PaymentsProps {
  payments: readonly PurchaseInvoicePayment[];
  issues: readonly string[];
  totalPayableMinor: number | null;
  busy: boolean;
  onUnlink: (payment: PurchaseInvoicePayment) => void;
}

/**
 * «Оплата» of an invoice: the linked expenses of «Бухгалтерія» and their problems only (a voided
 * operation, another amount). The invoice total comes from the checked documents.
 */
export function PurchasePaymentsView({
  payments,
  issues,
  totalPayableMinor,
  busy,
  onUnlink,
}: PaymentsProps) {
  return (
    <Stack sx={{ gap: 1.5 }}>
      {totalPayableMinor !== null && (
        <Typography variant="body2" color="text.secondary">
          Сума рахунку: {formatPurchaseMinor(totalPayableMinor)}
        </Typography>
      )}
      {payments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Оплату ще не привʼязано.
        </Typography>
      ) : (
        <Stack component="ul" aria-label="Привʼязані оплати" sx={{ m: 0, p: 0, gap: 1 }}>
          {payments.map((payment) => (
            <Stack
              key={payment.transactionId}
              component="li"
              direction="row"
              sx={{ gap: 1, alignItems: 'center', listStyle: 'none' }}
            >
              <Typography
                variant="body2"
                sx={{
                  flex: 1,
                  minWidth: 0,
                  textDecoration: payment.voided ? 'line-through' : undefined,
                  color: payment.missing || payment.voided ? 'text.disabled' : undefined,
                }}
              >
                {payment.missing ? 'Операцію не знайдено' : describePurchasePayment(payment)}
              </Typography>
              <Button
                size="small"
                color="inherit"
                disabled={busy}
                onClick={() => onUnlink(payment)}
              >
                Відвʼязати
              </Button>
            </Stack>
          ))}
        </Stack>
      )}
      {issues.length > 0 && (
        <Stack component="ul" sx={{ m: 0, pl: 2.5, gap: 0.5 }}>
          {issues.map((issue) => (
            <Typography key={issue} component="li" variant="body2" color="warning.main">
              {issue}
            </Typography>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

interface CandidatesProps {
  search: string;
  candidates: readonly PurchasePaymentCandidate[];
  loading: boolean;
  error: string | null;
  busy: boolean;
  onSearch: (search: string) => void;
  onLink: (candidate: PurchasePaymentCandidate) => void;
  onCancel: () => void;
}

/**
 * «Прив'язати оплату»: expenses of the supplier (or equal to the invoice total) first; a search
 * by text or amount finds any expense. The ones equal to the invoice total are marked.
 */
export function PurchasePaymentCandidates({
  search,
  candidates,
  loading,
  error,
  busy,
  onSearch,
  onLink,
  onCancel,
}: CandidatesProps) {
  return (
    <Stack sx={{ gap: 1.5 }}>
      <TextField
        size="small"
        label="Знайти витрату"
        placeholder="Опис або сума, наприклад 1 560,00"
        value={search}
        onChange={(event) => onSearch(event.target.value)}
      />
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}
      {!error && !loading && candidates.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          {search.trim()
            ? 'Таких витрат немає.'
            : 'Витрат цього постачальника немає. Знайдіть витрату за описом або сумою.'}
        </Typography>
      )}
      {candidates.length > 0 && (
        <Stack component="ul" aria-label="Витрати для оплати" sx={{ m: 0, p: 0, gap: 1 }}>
          {candidates.map((candidate) => (
            <Stack
              key={candidate.transactionId}
              component="li"
              direction="row"
              sx={{ gap: 1, alignItems: 'center', listStyle: 'none' }}
            >
              <Stack sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2">{describePurchasePayment(candidate)}</Typography>
                {(candidate.counterpartyName || candidate.sameAmount) && (
                  <Typography variant="caption" color="text.secondary">
                    {[candidate.counterpartyName, candidate.sameAmount ? 'сума як у рахунку' : null]
                      .filter(Boolean)
                      .join(' · ')}
                  </Typography>
                )}
              </Stack>
              <Button
                size="small"
                variant="outlined"
                disabled={busy}
                onClick={() => onLink(candidate)}
              >
                Привʼязати
              </Button>
            </Stack>
          ))}
        </Stack>
      )}
      <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onCancel}>Закрити пошук</Button>
      </Stack>
    </Stack>
  );
}

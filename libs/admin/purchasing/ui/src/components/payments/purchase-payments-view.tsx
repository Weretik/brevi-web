import { describePurchasePayment, formatPurchaseMinor } from '@admin/purchasing/model';
import { usePageRights } from '@admin/shared/ui';
import { Button, Stack, Typography } from '@mui/material';

import type { PurchaseInvoicePayment } from '@admin/purchasing/model';

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
  // Every change of the register is «Редагування» on «Рахунки на закупку», also where it sits on another page.
  const canChange = usePageRights().can('edit', 'purchase-invoices');
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
              {canChange && (
                <Button
                  size="small"
                  color="inherit"
                  disabled={busy}
                  onClick={() => onUnlink(payment)}
                >
                  Відвʼязати
                </Button>
              )}
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

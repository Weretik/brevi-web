import { PurchasePaymentCandidates, PurchasePaymentsView } from '@admin/purchasing/ui';
import { Alert, Button, Stack } from '@mui/material';

import { usePurchasePayments } from '../../hooks/payments/use-purchase-payments';

import type { PurchaseInvoice } from '@admin/purchasing/model';

/** Section «Оплата» of the invoice panel: linked expenses of «Бухгалтерія» and «Прив'язати оплату». */
export function PurchaseInvoicePayments({ invoice }: { invoice: PurchaseInvoice }) {
  const payments = usePurchasePayments(invoice);
  return (
    <Stack sx={{ gap: 1.5 }}>
      {payments.message && <Alert severity="error">{payments.message}</Alert>}
      <PurchasePaymentsView
        payments={payments.payments}
        issues={payments.paymentIssues}
        totalPayableMinor={payments.totalPayableMinor}
        busy={payments.busy}
        onUnlink={payments.unlink}
      />
      {payments.picking ? (
        <PurchasePaymentCandidates
          search={payments.search}
          candidates={payments.candidates}
          loading={payments.candidatesLoading}
          error={payments.candidatesError}
          busy={payments.busy}
          onSearch={payments.setSearch}
          onLink={(candidate) => void payments.link(candidate)}
          onCancel={payments.stopPicking}
        />
      ) : (
        <Stack direction="row">
          <Button variant="outlined" disabled={payments.busy} onClick={payments.startPicking}>
            Привʼязати оплату
          </Button>
        </Stack>
      )}
    </Stack>
  );
}

import { purchaseInvoiceStatusLabels } from '@admin/purchasing/model';
import { Chip } from '@mui/material';

import type { PurchaseDocumentVat, PurchaseInvoiceStatus } from '@admin/purchasing/model';

const look: Record<PurchaseInvoiceStatus, { mark: string; color: string }> = {
  Recognized: { mark: '✓', color: 'success' },
  Warning: { mark: '!', color: 'warning' },
  Error: { mark: '✕', color: 'error' },
  NotRecognized: { mark: '○', color: 'default' },
};

/** «✓ Розпізнано», «! Попередження», «✕ Помилка», «○ Не розпізнано»: always with a text label. */
export function PurchaseStatusChip({
  status,
  label,
}: {
  status: PurchaseInvoiceStatus;
  /** Shorter text, e.g. «1 помилка»; the status name by default. */
  label?: string;
}) {
  const { mark, color } = look[status];
  return (
    <Chip
      size="small"
      label={`${mark} ${label ?? purchaseInvoiceStatusLabels[status]}`}
      sx={{
        height: 22,
        fontWeight: 600,
        bgcolor: color === 'default' ? 'action.hover' : `${color}.light`,
        color: color === 'default' ? 'text.secondary' : `${color}.main`,
      }}
    />
  );
}

/** «Без ПДВ» stands out in blue; «З ПДВ» stays quiet. */
export function PurchaseVatChip({ vat }: { vat: PurchaseDocumentVat }) {
  return vat === 'WithoutVat' ? (
    <Chip
      size="small"
      label="Без ПДВ"
      sx={{ height: 22, fontWeight: 600, bgcolor: 'info.light', color: 'info.main' }}
    />
  ) : (
    <Chip size="small" variant="outlined" label="З ПДВ" sx={{ height: 22 }} />
  );
}

import {
  formatPurchaseDocumentDate,
  formatPurchaseMessageAt,
  formatPurchaseMoney,
  purchaseInvoiceStatus,
} from '@admin/purchasing/model';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { IconButton, TableCell, TableRow, Typography } from '@mui/material';

import { PurchaseStatusChip, PurchaseVatChip } from '../../components/status/purchase-status-chip';

import type { PurchaseInvoice } from '@admin/purchasing/model';

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** One invoice message: arrow, state, time and UID, supplier and chat, invoice number, sum, VAT, sheet mark. */
export function PurchaseInvoiceRow({
  invoice,
  open,
  onToggle,
}: {
  invoice: PurchaseInvoice;
  open: boolean;
  onToggle: () => void;
}) {
  const { status } = purchaseInvoiceStatus(invoice);
  const documents = invoice.links.flatMap((link) => (link.document ? [link.document] : []));
  const first = documents[0];
  const supplier = first?.supplierName ?? invoice.supplierName;
  return (
    <TableRow
      hover
      onClick={onToggle}
      sx={{
        cursor: 'pointer',
        '& > td': { borderBottom: open ? 0 : undefined },
        bgcolor: open ? 'action.hover' : undefined,
      }}
    >
      <TableCell padding="checkbox">
        <IconButton
          size="small"
          aria-expanded={open}
          aria-label={`${open ? 'Згорнути' : 'Розгорнути'} рахунок UID ${invoice.sourceUid}`}
          onClick={(event) => {
            event.stopPropagation();
            onToggle();
          }}
        >
          {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
        </IconButton>
      </TableCell>
      <TableCell>
        <PurchaseStatusChip status={status} />
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Typography variant="body2" sx={mono}>
          {formatPurchaseMessageAt(invoice.messageAt)}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={mono}>
          UID {invoice.sourceUid}
        </Typography>
      </TableCell>
      <TableCell sx={{ minWidth: 180, maxWidth: 260 }}>
        <Typography
          variant="body2"
          noWrap
          title={supplier ?? undefined}
          color={supplier ? 'text.primary' : 'text.secondary'}
        >
          {supplier ?? '—'}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          noWrap
          component="div"
          title={invoice.text}
        >
          {[invoice.chatName, invoice.fromUser].filter(Boolean).join(' · ') || invoice.text || '—'}
        </Typography>
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {first ? (
          <>
            <Typography variant="body2" sx={mono}>
              № {first.documentNumber}
              {documents.length > 1 && (
                <Typography component="span" variant="caption" color="text.secondary">
                  {' '}
                  +{documents.length - 1}
                </Typography>
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={mono}>
              від {formatPurchaseDocumentDate(first.documentDate)}
            </Typography>
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {invoice.links.length > 1 ? `Оригіналів: ${invoice.links.length}` : '—'}
          </Typography>
        )}
      </TableCell>
      <TableCell align="right" sx={{ ...mono, whiteSpace: 'nowrap' }}>
        {first ? formatPurchaseMoney(first.totalPayable) : ''}
      </TableCell>
      <TableCell>{first && <PurchaseVatChip vat={first.vat} />}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {invoice.markedPaid && (
          <Typography
            variant="body2"
            title={[invoice.markBy, invoice.markAt].filter(Boolean).join(' · ')}
          >
            Відмічено
          </Typography>
        )}
      </TableCell>
    </TableRow>
  );
}

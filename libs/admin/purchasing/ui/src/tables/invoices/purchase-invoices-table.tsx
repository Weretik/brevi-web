import { purchaseInvoicePageSizes } from '@admin/purchasing/model';
import {
  Box,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { Fragment, useState } from 'react';

import { PurchaseInvoiceDetailsRow, purchaseInvoiceColumns } from './purchase-invoice-details-row';
import { PurchaseInvoiceRow } from './purchase-invoice-row';

import type { PurchaseInvoice, PurchaseInvoicePage } from '@admin/purchasing/model';
import type { ReactNode } from 'react';

interface Props {
  page: PurchaseInvoicePage | undefined;
  loading: boolean;
  /** Search or a filter is on: an empty page means «nothing found», not «empty register». */
  narrowed: boolean;
  unavailable: boolean;
  /** Zero-based page, as the table counts. */
  onPageChange: (model: { page: number; pageSize: number }) => void;
  /** What a row shows when its arrow is open: positions, message, originals, buttons. */
  renderDetails: (invoice: PurchaseInvoice) => ReactNode;
}

/**
 * «Рахунки на закупку»: one row per Telegram message with its state, supplier, invoice number, sum
 * and VAT. The arrow opens what the AI read. «СПЛАЧЕНО» in the sheet is a source mark, not a payment.
 */
export function PurchaseInvoicesTable({
  page,
  loading,
  narrowed,
  unavailable,
  onPageChange,
  renderDetails,
}: Props) {
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());
  const items = page?.items ?? [];
  const toggle = (id: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const empty = unavailable
    ? 'Реєстр недоступний. Повторіть запит.'
    : narrowed
      ? 'Рахунків за цими умовами не знайдено.'
      : 'Реєстр порожній. Натисніть «Оновити зараз».';

  return (
    <Box sx={{ minWidth: 0 }}>
      {loading && <LinearProgress aria-label="Завантаження рахунків" />}
      {/* Same frame as the other tables: fixed height, own scroll both ways, header stays on top. */}
      <TableContainer
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          maxHeight: 'var(--admin-table-height)',
          overflow: 'auto',
        }}
      >
        <Table
          size="small"
          stickyHeader
          aria-label="Рахунки на закупку"
          sx={{ minWidth: 820, '& td, & th': { px: 1.25 } }}
        >
          <TableHead sx={{ '& th': { bgcolor: 'background.paper' } }}>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>Стан</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Постачальник</TableCell>
              <TableCell>Рахунок</TableCell>
              <TableCell align="right">Сума</TableCell>
              <TableCell>ПДВ</TableCell>
              <TableCell>Оплата</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={purchaseInvoiceColumns}>
                  <Stack sx={{ py: 4, alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {empty}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              items.map((invoice) => (
                <Fragment key={invoice.messageId}>
                  <PurchaseInvoiceRow
                    invoice={invoice}
                    open={open.has(invoice.messageId)}
                    onToggle={() => toggle(invoice.messageId)}
                  />
                  <PurchaseInvoiceDetailsRow open={open.has(invoice.messageId)}>
                    {open.has(invoice.messageId) ? renderDetails(invoice) : null}
                  </PurchaseInvoiceDetailsRow>
                </Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={page?.total ?? 0}
        page={Math.max(0, (page?.page ?? 1) - 1)}
        rowsPerPage={page?.pageSize ?? 50}
        rowsPerPageOptions={[...purchaseInvoicePageSizes]}
        labelRowsPerPage="Рядків на сторінці"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} з ${count}`}
        onPageChange={(_, next) => onPageChange({ page: next, pageSize: page?.pageSize ?? 50 })}
        onRowsPerPageChange={(event) =>
          onPageChange({ page: 0, pageSize: Number(event.target.value) })
        }
      />
    </Box>
  );
}

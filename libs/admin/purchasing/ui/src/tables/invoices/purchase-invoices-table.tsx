import {
  formatPurchaseMessageAt,
  formatPurchaseDocumentDate,
  formatPurchaseMoney,
  purchaseInvoicePageSizes,
  purchaseInvoiceStatus,
} from '@admin/purchasing/model';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  Box,
  Collapse,
  IconButton,
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

import { PurchaseStatusChip, PurchaseVatChip } from '../../components/status/purchase-status-chip';

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

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };
const columns = 8;

function InvoiceRow({
  invoice,
  open,
  onToggle,
  details,
}: {
  invoice: PurchaseInvoice;
  open: boolean;
  onToggle: () => void;
  details: ReactNode;
}) {
  const { status } = purchaseInvoiceStatus(invoice);
  const documents = invoice.links.flatMap((link) => (link.document ? [link.document] : []));
  const first = documents[0];
  const supplier = first?.supplierName ?? invoice.supplierName;
  return (
    <Fragment>
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
            {[invoice.chatName, invoice.fromUser].filter(Boolean).join(' · ') ||
              invoice.text ||
              '—'}
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
      <TableRow>
        <TableCell
          colSpan={columns}
          sx={{ p: 0, borderBottom: open ? 1 : 0, borderColor: 'divider' }}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ bgcolor: 'action.hover' }}>
              {/* Stays in view while the table scrolls sideways and keeps a readable width. */}
              <Box
                sx={{
                  position: 'sticky',
                  left: 0,
                  maxWidth: 880,
                  px: { xs: 1.5, sm: 2 },
                  pb: 2,
                  pt: 0.5,
                  pl: { sm: 7 },
                }}
              >
                {details}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
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
                <TableCell colSpan={columns}>
                  <Stack sx={{ py: 4, alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {empty}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              items.map((invoice) => (
                <InvoiceRow
                  key={invoice.messageId}
                  invoice={invoice}
                  open={open.has(invoice.messageId)}
                  onToggle={() => toggle(invoice.messageId)}
                  details={open.has(invoice.messageId) ? renderDetails(invoice) : null}
                />
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

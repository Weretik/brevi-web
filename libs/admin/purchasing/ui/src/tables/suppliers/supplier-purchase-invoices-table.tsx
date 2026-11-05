import {
  formatPurchaseMessageAt,
  formatPurchaseDocumentDate,
  formatPurchaseMoney,
  purchaseInvoiceStatus,
} from '@admin/purchasing/model';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';

import { PurchaseStatusChip, PurchaseVatChip } from '../../components/status/purchase-status-chip';

import type { PurchaseInvoice, PurchaseInvoicePage } from '@admin/purchasing/model';

interface Props {
  page: PurchaseInvoicePage;
  /** Zero-based page, as the table counts. */
  onPageChange: (page: number) => void;
  onOpen: (invoice: PurchaseInvoice) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** Compact list of one supplier's purchase invoices for the supplier card; a row opens it in the register. */
export function SupplierPurchaseInvoicesTable({ page, onPageChange, onOpen }: Props) {
  return (
    <>
      <Table size="small" aria-label="Рахунки постачальника">
        <TableHead>
          <TableRow>
            <TableCell>Стан</TableCell>
            <TableCell>Рахунок</TableCell>
            <TableCell align="right">Сума</TableCell>
            <TableCell>ПДВ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {page.items.map((invoice) => {
            const document = invoice.links.find((link) => link.document)?.document;
            return (
              <TableRow
                key={invoice.messageId}
                hover
                tabIndex={0}
                aria-label={`Відкрити рахунок UID ${invoice.sourceUid} у реєстрі`}
                onClick={() => onOpen(invoice)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onOpen(invoice);
                  }
                }}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <PurchaseStatusChip status={purchaseInvoiceStatus(invoice).status} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={mono}>
                    {document
                      ? `№ ${document.documentNumber} · ${formatPurchaseDocumentDate(document.documentDate)}`
                      : formatPurchaseMessageAt(invoice.messageAt)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={mono}>
                    UID {invoice.sourceUid}
                    {invoice.markedPaid ? ' · Відмічено оплату' : ''}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ ...mono, whiteSpace: 'nowrap' }}>
                  {document ? formatPurchaseMoney(document.totalPayable) : ''}
                </TableCell>
                <TableCell>{document && <PurchaseVatChip vat={document.vat} />}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {page.total > page.pageSize && (
        <TablePagination
          component="div"
          count={page.total}
          page={page.page - 1}
          rowsPerPage={page.pageSize}
          rowsPerPageOptions={[]}
          onPageChange={(_, next) => onPageChange(next)}
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} з ${count}`}
        />
      )}
    </>
  );
}

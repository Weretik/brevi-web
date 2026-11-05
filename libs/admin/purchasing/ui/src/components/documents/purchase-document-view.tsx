import {
  describePurchaseDocument,
  formatPurchaseMoney,
  purchaseLineDiscount,
} from '@admin/purchasing/model';
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { PurchaseVatChip } from '../status/purchase-status-chip';

import type { PurchaseDocument } from '@admin/purchasing/model';

interface Props {
  document: PurchaseDocument;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };
const formatTime = (value: string) =>
  new Date(value).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' });

/** Checked facts of one original: header, positions as printed (with discounts) and totals. */
export function PurchaseDocumentView({ document }: Props) {
  const withVat = document.vat === 'WithVat';
  const priceLabel = withVat ? (document.pricesIncludeVat ? 'з ПДВ' : 'без ПДВ') : '';
  const discounts = document.items.map(purchaseLineDiscount);
  const anyDiscount = discounts.some((x) => x !== null);
  return (
    <Stack sx={{ gap: 1, minWidth: 0 }}>
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="subtitle2">{describePurchaseDocument(document)}</Typography>
        <PurchaseVatChip vat={document.vat} />
      </Stack>
      <Typography variant="body2" color="text.secondary">
        {document.supplierName}
      </Typography>
      <TableContainer sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <Table size="small" aria-label="Позиції рахунку">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 32 }}>#</TableCell>
              <TableCell>Назва</TableCell>
              <TableCell align="right">Кількість</TableCell>
              <TableCell align="right">Ціна {priceLabel}</TableCell>
              <TableCell align="right">Сума {priceLabel}</TableCell>
              {anyDiscount && <TableCell />}
            </TableRow>
          </TableHead>
          <TableBody>
            {document.items.map((item, index) => (
              <TableRow key={item.position}>
                <TableCell sx={{ ...mono, color: 'text.secondary' }}>{item.position}</TableCell>
                <TableCell sx={{ wordBreak: 'break-word' }}>{item.name}</TableCell>
                <TableCell align="right" sx={{ ...mono, whiteSpace: 'nowrap' }}>
                  {item.quantity}
                  {item.unit ? ` ${item.unit}` : ''}
                </TableCell>
                <TableCell align="right" sx={{ ...mono, whiteSpace: 'nowrap' }}>
                  {item.price}
                </TableCell>
                <TableCell align="right" sx={{ ...mono, whiteSpace: 'nowrap' }}>
                  {item.sum}
                </TableCell>
                {anyDiscount && (
                  <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                    {discounts[index] !== null ? `знижка ${discounts[index]} %` : ''}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack sx={{ gap: 0.25, alignItems: 'flex-end' }}>
        {withVat && document.vatAmount && (
          <Typography variant="body2" sx={mono}>
            ПДВ: {formatPurchaseMoney(document.vatAmount)}
          </Typography>
        )}
        <Typography variant="subtitle2" sx={mono}>
          До оплати: {formatPurchaseMoney(document.totalPayable)}
        </Typography>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        {document.source === 'Ai'
          ? `Розпізнав ШІ (${document.model ?? 'модель'})`
          : 'Перевірено вручну'}
        {` · ${formatTime(document.checkedAt)} · ${document.checkedBy}`}
      </Typography>
    </Stack>
  );
}

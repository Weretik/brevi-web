import {
  describePurchaseDocument,
  formatPurchaseMoney,
  purchaseVatLabel,
} from '@admin/purchasing/model';
import {
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { PurchaseDocument } from '@admin/purchasing/model';

interface Props {
  document: PurchaseDocument;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };
const formatTime = (value: string) =>
  new Date(value).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' });

/** Checked facts of one original: header, positions as printed and totals. */
export function PurchaseDocumentView({ document }: Props) {
  const withVat = document.vat === 'WithVat';
  const priceLabel = withVat ? (document.pricesIncludeVat ? 'з ПДВ' : 'без ПДВ') : '';
  return (
    <Stack sx={{ gap: 1 }}>
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="subtitle2">{describePurchaseDocument(document)}</Typography>
        <Chip size="small" variant="outlined" label={purchaseVatLabel(document)} />
      </Stack>
      <Typography variant="body2" color="text.secondary">
        {document.supplierName}
      </Typography>
      <Table size="small" aria-label="Позиції рахунку">
        <TableHead>
          <TableRow>
            <TableCell>Назва</TableCell>
            <TableCell align="right">Кількість</TableCell>
            <TableCell align="right">Ціна {priceLabel}</TableCell>
            <TableCell align="right">Сума {priceLabel}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {document.items.map((item) => (
            <TableRow key={item.position}>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
          : 'Завантажено вручну'}
        {` · ${formatTime(document.checkedAt)} · ${document.checkedBy}`}
      </Typography>
    </Stack>
  );
}

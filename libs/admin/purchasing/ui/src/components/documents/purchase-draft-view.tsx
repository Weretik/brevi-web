import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import type { PurchaseDocumentCheck, PurchaseDocumentFormValues } from '@admin/purchasing/model';

interface Props {
  values: PurchaseDocumentFormValues;
  check: PurchaseDocumentCheck;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** What the AI read from an original that failed the checks; wrong lines are highlighted. */
export function PurchaseDraftView({ values, check }: Props) {
  return (
    <TableContainer sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
      <Table size="small" aria-label="Що прочитав ШІ">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 32 }}>#</TableCell>
            <TableCell>Назва</TableCell>
            <TableCell align="right">Кількість</TableCell>
            <TableCell align="right">Ціна</TableCell>
            <TableCell align="right">Сума</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {values.items.map((item, index) => {
            const error = check.itemErrors[item.key];
            const discount = check.discounts[item.key];
            return (
              <TableRow key={item.key} sx={error ? { bgcolor: 'error.light' } : undefined}>
                <TableCell sx={{ ...mono, color: 'text.secondary' }}>{index + 1}</TableCell>
                <TableCell sx={{ wordBreak: 'break-word' }}>{item.name || '—'}</TableCell>
                <TableCell align="right" sx={{ ...mono, whiteSpace: 'nowrap' }}>
                  {item.quantity} {item.unit}
                </TableCell>
                <TableCell align="right" sx={mono}>
                  {item.price}
                </TableCell>
                <TableCell align="right" sx={mono}>
                  {item.sum}
                </TableCell>
                <TableCell sx={{ color: error ? 'error.main' : 'text.secondary' }}>
                  {error ?? (discount !== undefined ? `знижка ${discount} %` : '')}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

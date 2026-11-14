import {
  compositionLineKindLabels,
  compositionMaterialText,
  forBatch,
} from '@admin/production/model';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

import { compositionHead, compositionMono, compositionQuantity } from './composition-table-style';

import type { ModelCompositionLine } from '@admin/production/model';

/** The rest of the model's composition from «Товари»: kind, material, per item and per batch. */
export function ModelCompositionRest({
  name,
  rest,
  batchLabel,
  batchSize,
}: {
  name: string;
  rest: readonly ModelCompositionLine[];
  batchLabel: string | null;
  batchSize: number | null;
}) {
  if (rest.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ px: 2, pb: 2 }}>
        У «Товари» склад ще не задано.
      </Typography>
    );
  }
  return (
    <Table size="small" aria-label={`Решта складу: ${name}`}>
      <TableHead>
        <TableRow>
          <TableCell sx={{ ...compositionHead, width: 100 }}>Вид</TableCell>
          <TableCell sx={compositionHead}>Матеріал</TableCell>
          <TableCell sx={{ ...compositionHead, width: 100 }} align="right">
            На виріб
          </TableCell>
          {batchLabel && (
            <TableCell sx={{ ...compositionHead, width: 110 }} align="right">
              {batchLabel}
            </TableCell>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {rest.map((line, index) => (
          <TableRow key={`${line.kind}-${line.code ?? ''}-${index}`}>
            <TableCell>{compositionLineKindLabels[line.kind]}</TableCell>
            <TableCell>
              {compositionMaterialText(line)}
              {line.article && (
                <Typography variant="caption" color="text.secondary" component="div">
                  Артикул {line.article}
                </Typography>
              )}
            </TableCell>
            <TableCell align="right" sx={compositionMono}>
              {compositionQuantity(line.quantity, line.unit)}
            </TableCell>
            {batchSize !== null && (
              <TableCell align="right" sx={{ ...compositionMono, fontWeight: 600 }}>
                {compositionQuantity(forBatch(line.quantity, batchSize), line.unit)}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

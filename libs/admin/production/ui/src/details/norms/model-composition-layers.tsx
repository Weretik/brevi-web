import { compositionMaterialText, forBatch } from '@admin/production/model';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

import { compositionHead, compositionMono, compositionQuantity } from './composition-table-style';

import type { ModelComposition } from '@admin/production/model';

/** Lining, insulation and fleece of the model: purpose, material, per item and per batch. */
export function ModelCompositionLayers({
  name,
  layers,
  batchLabel,
  batchSize,
}: {
  name: string;
  layers: ModelComposition['layers'];
  batchLabel: string | null;
  batchSize: number | null;
}) {
  if (layers.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ px: 2, pb: 2 }}>
        Немає: модель без підкладки та утеплення.
      </Typography>
    );
  }
  return (
    <Table size="small" aria-label={`Підкладка і утеплювач: ${name}`}>
      <TableHead>
        <TableRow>
          <TableCell sx={compositionHead}>Матеріал</TableCell>
          <TableCell sx={{ ...compositionHead, width: 110 }} align="right">
            На виріб
          </TableCell>
          {batchLabel && (
            <TableCell sx={{ ...compositionHead, width: 120 }} align="right">
              {batchLabel}
            </TableCell>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {layers.map((layer, index) => (
          <TableRow key={`${layer.code ?? ''}-${index}`}>
            <TableCell>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {layer.purpose}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {compositionMaterialText(layer)}
              </Typography>
            </TableCell>
            <TableCell align="right" sx={compositionMono}>
              {compositionQuantity(layer.quantity, layer.unit)}
            </TableCell>
            {batchSize !== null && (
              <TableCell align="right" sx={{ ...compositionMono, fontWeight: 600 }}>
                {compositionQuantity(forBatch(layer.quantity, batchSize), layer.unit)}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

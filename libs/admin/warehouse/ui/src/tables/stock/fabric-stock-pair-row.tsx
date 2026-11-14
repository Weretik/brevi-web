import {
  formatMeters,
  formatMetersNumber as number,
  stockLastMovementLabel,
} from '@admin/warehouse/model';
import { Box, Chip, TableCell, TableRow, Typography } from '@mui/material';

import type { FabricStockColor, FabricStockFabric, FabricStockPair } from '@admin/warehouse/model';
import type { KeyboardEvent } from 'react';

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** Only problems get a mark: below zero, or the plans need more than there is. */
function PairMarks({ color }: { color: FabricStockColor }) {
  if (color.meters < 0)
    return <Chip size="small" color="error" variant="outlined" label="Відʼємний" />;
  if (color.toOrder > 0)
    return (
      <Chip
        size="small"
        color="warning"
        variant="outlined"
        label={`Замовити ${number(color.toOrder)}`}
        sx={mono}
      />
    );
  return null;
}

const activate = (event: KeyboardEvent, action: () => void) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    action();
  }
};

/** A fabric and colour pair under its fabric: metres, booked, free, problem marks and the last operation. */
export function FabricStockPairRow({
  fabric,
  color,
  onOpen,
}: {
  fabric: FabricStockFabric;
  color: FabricStockColor;
  onOpen: (pair: FabricStockPair) => void;
}) {
  return (
    <TableRow
      hover
      tabIndex={0}
      aria-label={`${fabric.fabricName}, ${color.color}: ${formatMeters(color.meters)}`}
      sx={{
        cursor: 'pointer',
        '&:focus-visible': { outline: 2, outlineColor: 'primary.main' },
      }}
      onClick={() => onOpen({ fabric, color })}
      onKeyDown={(event) => activate(event, () => onOpen({ fabric, color }))}
    >
      <TableCell sx={{ pl: 6.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2">{color.color}</Typography>
          <PairMarks color={color} />
        </Box>
      </TableCell>
      <TableCell align="right" sx={{ ...mono, color: color.meters < 0 ? 'error.main' : undefined }}>
        {number(color.meters)}
      </TableCell>
      <TableCell align="right" sx={{ ...mono, color: 'text.secondary' }}>
        {color.booked === 0 ? '0' : number(color.booked)}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          ...mono,
          color: color.free < 0 ? 'error.main' : undefined,
          fontWeight: color.free < 0 ? 600 : undefined,
        }}
      >
        {number(color.free)}
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary" noWrap>
          {color.lastMovement ? stockLastMovementLabel(color.lastMovement) : '—'}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

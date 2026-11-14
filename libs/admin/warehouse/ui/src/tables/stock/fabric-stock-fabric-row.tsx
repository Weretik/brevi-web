import { formatMetersNumber as number } from '@admin/warehouse/model';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { Box, IconButton, TableCell, TableRow, Typography } from '@mui/material';

import type { FabricStockFabric } from '@admin/warehouse/model';

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** A fabric row with its codes, composition and totals; it folds and unfolds its colours. */
export function FabricStockFabricRow({
  fabric,
  open,
  onToggle,
}: {
  fabric: FabricStockFabric;
  open: boolean;
  onToggle: (fabricCode: string) => void;
}) {
  const details = [fabric.composition, fabric.density].filter(Boolean).join(' · ');
  return (
    <TableRow
      hover
      sx={{ bgcolor: 'action.hover', cursor: 'pointer' }}
      onClick={() => onToggle(fabric.fabricCode)}
    >
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="small"
            aria-expanded={open}
            aria-label={`${open ? 'Згорнути' : 'Розгорнути'}: ${fabric.fabricName}`}
            onClick={(event) => {
              event.stopPropagation();
              onToggle(fabric.fabricCode);
            }}
          >
            {open ? (
              <ExpandMoreOutlinedIcon fontSize="small" />
            ) : (
              <ChevronRightOutlinedIcon fontSize="small" />
            )}
          </IconButton>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
              {fabric.fabricName}
            </Typography>
            <Typography variant="caption" color="text.secondary" component="span">
              {' '}
              <Box component="span" sx={mono}>
                {fabric.codes.join(' = ')}
              </Box>
              {details && ` · ${details}`}
              {!open && ` · ${fabric.colors.length} кол.`}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell
        align="right"
        sx={{
          ...mono,
          fontWeight: 600,
          color: fabric.meters < 0 ? 'error.main' : undefined,
        }}
      >
        {number(fabric.meters)}
      </TableCell>
      <TableCell align="right" sx={{ ...mono, fontWeight: 600 }}>
        {number(fabric.booked)}
      </TableCell>
      <TableCell
        align="right"
        sx={{
          ...mono,
          fontWeight: 600,
          color: fabric.free < 0 ? 'error.main' : undefined,
        }}
      >
        {number(fabric.free)}
      </TableCell>
      <TableCell />
    </TableRow>
  );
}

import {
  formatDiscount,
  formatImportTime,
  priceFileLabel,
  priceSourceMethodLabel,
} from '@admin/references/model';
import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { PriceSource } from '@admin/references/model';

interface Props {
  sources: PriceSource[];
  loading: boolean;
  onOpen: (source: PriceSource) => void;
}

/** «Імпорт цін» table: one row per supplier; a row opens its side panel. */
export function PriceSourcesTable({ sources, loading, onOpen }: Props) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table aria-label="Постачальники ЗІЗ та оновлення цін" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Постачальник</TableCell>
            <TableCell>Як оновлюється</TableCell>
            <TableCell align="right">Знижка</TableCell>
            <TableCell align="right">Товарів</TableCell>
            <TableCell>Останнє оновлення</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && sources.length === 0
            ? [0, 1, 2].map((index) => (
                <TableRow key={index}>
                  <TableCell colSpan={5}>
                    <Skeleton />
                  </TableCell>
                </TableRow>
              ))
            : sources.map((source) => (
                <TableRow
                  key={source.key}
                  hover
                  tabIndex={0}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => onOpen(source)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onOpen(source);
                    }
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {source.title}
                    </Typography>
                    {!source.supplierName && (
                      <Typography variant="caption" color="error">
                        Немає в «Постачальники»
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {priceFileLabel(source.fileKind, source.fileCount) ??
                        priceSourceMethodLabel(source.method)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {source.schedule}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" className="reference-mono">
                    {formatDiscount(source.discountPercent)}
                  </TableCell>
                  <TableCell align="right" className="reference-mono">
                    {source.productCount}
                  </TableCell>
                  <TableCell>
                    <LastRunCell source={source} />
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function LastRunCell({ source }: { source: PriceSource }) {
  const run = source.lastRun;
  if (!run) return <Typography variant="body2">—</Typography>;
  return (
    <Box>
      <Typography variant="body2" className="reference-mono">
        {formatImportTime(run.finishedAt)}
      </Typography>
      {run.problems.length > 0 && (
        <Typography variant="caption" color="warning.main">
          Проблем: {run.problems.length}
        </Typography>
      )}
    </Box>
  );
}

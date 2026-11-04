import { fabricStockProblem, formatMeters, formatMoney } from '@admin/production/model';
import {
  Alert,
  Box,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import type { FabricStockLine } from '@admin/production/model';

interface Props {
  line: FabricStockLine;
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ minWidth: 110 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontFamily: 'var(--admin-font-mono)' }}>
        {value}
      </Typography>
    </Box>
  );
}

/** Balance, reservation and the open orders that hold this fabric and colour. */
export function FabricStockLineDetails({ line }: Props) {
  const row = line.line;
  const problem = fabricStockProblem(row);
  return (
    <Stack sx={{ gap: 2 }}>
      {problem && <Alert severity="error">{problem}</Alert>}
      <Stack direction="row" sx={{ gap: 3, flexWrap: 'wrap' }}>
        <Figure label="Залишок" value={formatMeters(row.meters)} />
        <Figure label="Бронь" value={formatMeters(row.reserved)} />
        <Figure label="Доступно" value={formatMeters(row.available)} />
        {line.permissions.seesValue && <Figure label="Вартість" value={formatMoney(row.value)} />}
      </Stack>
      {line.reservations.length > 0 && (
        <Stack sx={{ gap: 1 }}>
          <Typography variant="subtitle2">Під замовлення «Нове»</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small" aria-label="Бронь">
              <TableHead>
                <TableRow>
                  <TableCell>Завдання</TableCell>
                  <TableCell>Модель</TableCell>
                  <TableCell align="right">План</TableCell>
                  <TableCell align="right">Видано</TableCell>
                  <TableCell align="right">Бронь</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {line.reservations.map((item) => (
                  <TableRow key={item.itemId}>
                    <TableCell>
                      <Link component={RouterLink} to={`/production/orders/${item.orderId}`}>
                        № {item.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{item.modelName}</TableCell>
                    <TableCell align="right">{formatMeters(item.planned)}</TableCell>
                    <TableCell align="right">{formatMeters(item.covered)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      {formatMeters(item.reserved)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}
    </Stack>
  );
}

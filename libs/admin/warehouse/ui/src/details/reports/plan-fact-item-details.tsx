import {
  fabricLayerLabels,
  formatDay,
  formatMeters,
  planFactResultLabels,
} from '@admin/warehouse/model';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

import { reportMono } from '../../components/reports/expandable-row';
import { OrderLink } from '../../components/reports/order-link';
import { signed } from '../../tables/reports/plan-fact/plan-fact-format';

import type { PlanFactItem } from '@admin/warehouse/model';

export function PlanFactItemDetails({ item }: { item: PlanFactItem }) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, mb: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        <OrderLink orderId={item.orderId} orderNumber={item.orderNumber} /> · {item.clientName} ·{' '}
        {item.products} шт{item.issuedOn ? ` · видано ${formatDay(item.issuedOn)}` : ''}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={reportMono}>
        план {formatMeters(item.plan)}, факт {formatMeters(item.fact)}, різниця{' '}
        {signed(item.difference, formatMeters)} · {planFactResultLabels[item.result]}
      </Typography>
      {item.reason && (
        <Typography variant="caption" color="warning.main" component="div">
          {item.reason}
        </Typography>
      )}
      <Table size="small" aria-label={`Тканини завдання Ц-${item.orderNumber}`}>
        <TableHead>
          <TableRow>
            <TableCell>Роль</TableCell>
            <TableCell>План: тканина і колір</TableCell>
            <TableCell align="right">План</TableCell>
            <TableCell align="right">Факт</TableCell>
            <TableCell align="right">Різниця</TableCell>
            <TableCell>Фактично видано</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {item.materials.map((material, index) => (
            <TableRow key={index}>
              <TableCell>
                {material.layer ? fabricLayerLabels[material.layer] : 'Роль не вказана'}
              </TableCell>
              <TableCell>
                {material.planFabricCode
                  ? `${material.planFabricName ?? material.planFabricCode} · ${material.planColor ?? ''}`
                  : 'Поза планом'}
              </TableCell>
              <TableCell align="right" sx={reportMono}>
                {formatMeters(material.plan)}
              </TableCell>
              <TableCell align="right" sx={reportMono}>
                {material.fact === null ? 'не зафіксовано' : formatMeters(material.fact)}
              </TableCell>
              <TableCell align="right" sx={reportMono}>
                {signed(material.difference, formatMeters)}
              </TableCell>
              <TableCell>{material.used.join(', ') || '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

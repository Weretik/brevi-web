import {
  fabricLayerLabels,
  formatDay,
  formatMeters,
  formatMetersNumber,
  formatPerProduct,
  isPlanFactOverrun,
  planFactDeviation,
  planFactResultLabels,
} from '@admin/warehouse/model';
import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { reportMono } from '../../components/reports/expandable-row';
import { OrderLink } from '../../components/reports/order-link';

import type { PlanFactItem, PlanFactModel, PlanFactSummary } from '@admin/warehouse/model';
import type { KeyboardEvent } from 'react';

interface Props {
  models: readonly PlanFactModel[];
  total: PlanFactSummary;
  /** A search or a chip hides everything. */
  filtered: boolean;
  onOpen: (model: PlanFactModel) => void;
}

const signed = (value: number | null, format: (x: number | null) => string) =>
  value === null ? '—' : `${value > 0 ? '+' : ''}${format(value)}`;

const percent = new Intl.NumberFormat('uk-UA', {
  maximumFractionDigits: 1,
  signDisplay: 'exceptZero',
});

/** «+9,8%» red above the threshold; a mark when it cannot be compared; otherwise only the number. */
export function PlanFactDeviation({ summary }: { summary: PlanFactSummary }) {
  const deviation = planFactDeviation(summary);
  if (deviation === null)
    return (
      <Chip
        size="small"
        color="warning"
        variant="outlined"
        label={summary.planPerProduct === null ? 'Немає норми' : 'Не порівняти'}
      />
    );
  if (isPlanFactOverrun(summary))
    return (
      <Chip
        size="small"
        color="error"
        variant="outlined"
        label={`${percent.format(deviation)}%`}
        sx={reportMono}
      />
    );
  return (
    <Typography variant="body2" component="span" sx={reportMono}>
      {percent.format(deviation)}%
    </Typography>
  );
}

function SummaryCells({ summary }: { summary: PlanFactSummary }) {
  return (
    <>
      <TableCell align="right" sx={reportMono}>
        {summary.orders}
      </TableCell>
      <TableCell align="right" sx={reportMono}>
        {formatPerProduct(summary.planPerProduct)}
      </TableCell>
      <TableCell align="right" sx={reportMono}>
        {formatPerProduct(summary.factPerProduct)}
      </TableCell>
      <TableCell>
        <PlanFactDeviation summary={summary} />
      </TableCell>
      <TableCell
        align="right"
        sx={{ ...reportMono, color: isPlanFactOverrun(summary) ? 'error.main' : undefined }}
      >
        {summary.difference === null
          ? '—'
          : signed(summary.difference, (x) => formatMetersNumber(x ?? 0))}
      </TableCell>
    </>
  );
}

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

const activate = (event: KeyboardEvent, action: () => void) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    action();
  }
};

/**
 * «План і факт» by model: per product plan and fact, the deviation (red only above 5% overspending) and the
 * difference in metres. A model opens its tasks and fabrics in a side panel.
 */
export function PlanFactTable({ models, total, filtered, onOpen }: Props) {
  if (models.length === 0)
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary">
          {filtered
            ? 'За цим пошуком, фільтром і періодом нічого немає.'
            : 'Немає завдань, тканину яких видано на всі вироби.'}
        </Typography>
      </Paper>
    );
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ maxHeight: 'var(--admin-table-height)', overflow: 'auto' }}
    >
      <Table
        size="small"
        stickyHeader
        aria-label="План і факт основної тканини за моделями"
        sx={{ minWidth: 720, '& td, & th': { px: 1.25 } }}
      >
        <TableHead sx={{ '& th': { bgcolor: 'background.paper' } }}>
          <TableRow>
            <TableCell>Модель</TableCell>
            <TableCell align="right" sx={{ width: 90 }}>
              Завдань
            </TableCell>
            <TableCell align="right" sx={{ width: 120 }}>
              План / виріб
            </TableCell>
            <TableCell align="right" sx={{ width: 120 }}>
              Факт / виріб
            </TableCell>
            <TableCell sx={{ width: 140 }}>Відхилення</TableCell>
            <TableCell align="right" sx={{ width: 120 }}>
              Різниця, м
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {models.map((model) => (
            <TableRow
              key={`${model.modelCode ?? ''}|${model.modelName}`}
              hover
              tabIndex={0}
              aria-label={model.modelName}
              sx={{ cursor: 'pointer' }}
              onClick={() => onOpen(model)}
              onKeyDown={(event) => activate(event, () => onOpen(model))}
            >
              <TableCell>
                <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
                  {model.modelName}
                </Typography>
                <Typography variant="caption" color="text.secondary" component="div">
                  {model.modelCode && (
                    <Typography component="span" variant="caption" sx={reportMono}>
                      {model.modelCode} ·{' '}
                    </Typography>
                  )}
                  {model.summary.products} виробів
                </Typography>
              </TableCell>
              <SummaryCells summary={model.summary} />
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Разом за звітом</TableCell>
            <SummaryCells summary={total} />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

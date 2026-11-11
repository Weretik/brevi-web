import {
  fabricLayerLabels,
  formatMeters,
  formatPerProduct,
  planFactResultLabels,
} from '@admin/warehouse/model';
import {
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

import { ExpandableRow, reportMono } from '../../components/reports/expandable-row';
import { OrderLink } from '../../components/reports/order-link';

import type {
  PlanFactItem,
  PlanFactModel,
  PlanFactReport,
  PlanFactSummary,
} from '@admin/warehouse/model';

interface Props {
  report: PlanFactReport;
}

const signed = (value: number | null, format: (x: number | null) => string) =>
  value === null ? '—' : `${value > 0 ? '+' : ''}${format(value)}`;

/** Only what needs attention is coloured: overspending and items that cannot be compared. */
function ResultText({
  summary,
}: {
  summary: Pick<PlanFactSummary, 'result' | 'uncomparableItems'>;
}) {
  const color =
    summary.result === 'Overrun'
      ? 'error.main'
      : summary.result === 'NeedsCheck'
        ? 'warning.main'
        : undefined;
  return (
    <Typography variant="body2" sx={{ color }}>
      {planFactResultLabels[summary.result]}
      {summary.result === 'NeedsCheck' && summary.uncomparableItems > 0 && (
        <Typography variant="caption" component="div" color="text.secondary">
          без оцінки: {summary.uncomparableItems}
        </Typography>
      )}
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
        {summary.products}
      </TableCell>
      <TableCell align="right" sx={reportMono}>
        {formatPerProduct(summary.planPerProduct)}
      </TableCell>
      <TableCell align="right" sx={reportMono}>
        {formatPerProduct(summary.factPerProduct)}
      </TableCell>
      <TableCell align="right" sx={reportMono}>
        {signed(summary.differencePerProduct, formatPerProduct)}
      </TableCell>
      <TableCell>
        <ResultText summary={summary} />
      </TableCell>
    </>
  );
}

function ItemDetails({ item }: { item: PlanFactItem }) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, mb: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        <OrderLink orderId={item.orderId} orderNumber={item.orderNumber} /> · {item.clientName} ·{' '}
        {item.products} шт · план {formatMeters(item.plan)}, факт {formatMeters(item.fact)}, різниця{' '}
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

const modelLabel = (model: PlanFactModel) =>
  model.modelCode ? `${model.modelName} (${model.modelCode})` : model.modelName;

/** «План і факт основної тканини за моделями» with «Замовлення і тканини» under each model. */
export function PlanFactTable({ report }: Props) {
  if (report.models.length === 0)
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Немає завдань, тканину яких видано на всі вироби, за цим фільтром.
        </Typography>
      </Paper>
    );
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="План і факт основної тканини за моделями">
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell />
            <TableCell>Модель</TableCell>
            <TableCell align="right">Замовлень</TableCell>
            <TableCell align="right">Виробів</TableCell>
            <TableCell align="right">План м/виріб</TableCell>
            <TableCell align="right">Факт м/виріб</TableCell>
            <TableCell align="right">Різниця м/виріб</TableCell>
            <TableCell>Результат</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {report.models.map((model) => (
            <ExpandableRow
              key={`${model.modelCode ?? ''}|${model.modelName}`}
              label={modelLabel(model)}
              columns={8}
              cells={
                <>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {model.modelName}
                    </Typography>
                    {model.modelCode && (
                      <Typography variant="caption" color="text.secondary" sx={reportMono}>
                        {model.modelCode}
                      </Typography>
                    )}
                  </TableCell>
                  <SummaryCells summary={model.summary} />
                </>
              }
            >
              <Typography variant="overline" color="text.secondary">
                Замовлення і тканини
              </Typography>
              {model.items.map((item) => (
                <ItemDetails key={item.itemId} item={item} />
              ))}
            </ExpandableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell />
            <TableCell>Разом</TableCell>
            <SummaryCells summary={report.total} />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

import { applicationText, formatDay, formatMeters } from '@admin/production/model';
import { Box, GlobalStyles, Typography } from '@mui/material';

import type { ProductionOrder } from '@admin/production/model';

/**
 * The order on paper for the workshop: hidden on screen, the only thing printed. No prices: the
 * sheet goes to the seamstresses.
 */
const printOnlySheet = {
  '@media print': {
    'body *': { visibility: 'hidden' },
    '.production-order-print, .production-order-print *': { visibility: 'visible' },
    '.production-order-print': { position: 'absolute', left: 0, top: 0, width: '100%' },
  },
} as const;

export function ProductionOrderPrint({ order }: { order: ProductionOrder }) {
  return (
    <>
      <GlobalStyles styles={printOnlySheet} />
      <Box
        className="production-order-print"
        sx={{
          display: 'none',
          '@media print': { display: 'block', color: '#000', bgcolor: '#fff', fontSize: 12 },
        }}
      >
        <Typography component="h1" variant="h5">
          Виробниче завдання № {order.number}
        </Typography>
        <p>
          Клієнт: {order.clientName}
          <br />
          КП: {order.quoteNumber ?? '—'} · Менеджер: {order.managerName} · Створено:{' '}
          {formatDay(order.orderDate)}
        </p>
        {order.comment && <p>Коментар: {order.comment}</p>}
        <Box
          component="table"
          sx={{
            width: '100%',
            borderCollapse: 'collapse',
            '& td, & th': {
              border: '1px solid #000',
              p: 0.5,
              verticalAlign: 'top',
              textAlign: 'left',
            },
          }}
        >
          <thead>
            <tr>
              <th>№</th>
              <th>Модель і тканина</th>
              <th>Шт.</th>
              <th>Готово до</th>
              <th>Кольори</th>
              <th>Розміри</th>
              <th>Технічні зміни, нанесення</th>
              <th>Тканина, м</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.position}</td>
                <td>
                  {item.modelName} {item.modelCode ? `(${item.modelCode})` : ''}
                  <br />
                  {item.fabricName ?? ''}
                </td>
                <td>{item.quantity}</td>
                <td>{formatDay(item.dueDate)}</td>
                <td>{[item.mainColor, ...item.additionalColors].join(' + ')}</td>
                <td style={{ whiteSpace: 'pre-line' }}>{item.sizesText ?? ''}</td>
                <td style={{ whiteSpace: 'pre-line' }}>
                  {[item.technicalChanges, item.comment, ...item.applications.map(applicationText)]
                    .filter(Boolean)
                    .join('\n')}
                </td>
                <td>{formatMeters(item.plannedFabricMeters)}</td>
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>
    </>
  );
}

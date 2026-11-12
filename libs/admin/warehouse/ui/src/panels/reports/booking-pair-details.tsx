import { ReferenceFormSection } from '@admin/references/ui';
import {
  fabricLayerLabels,
  formatDay,
  formatMeters,
  formatMetersNumber,
  isDueSoon,
} from '@admin/warehouse/model';
import { Alert, Box, Stack, Typography } from '@mui/material';

import { reportMono } from '../../components/reports/expandable-row';
import { OrderLink } from '../../components/reports/order-link';

import type { BookingPair } from '@admin/warehouse/model';

interface Props {
  pair: BookingPair;
  /** Today in Kyiv, yyyy-mm-dd. */
  today: string;
}

function Figure({ label, value, danger }: { label: string; value: number; danger?: boolean }) {
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="overline" color="text.secondary" component="div">
        {label}
      </Typography>
      <Typography variant="h6" sx={{ ...reportMono, color: danger ? 'error.main' : undefined }}>
        {formatMetersNumber(value)}
      </Typography>
    </Box>
  );
}

/**
 * The side panel of a pair to order: its figures and the queue of tasks in order of the orders (earlier tasks get
 * the fabric first), each with its date, what it still needs and what of it is missing.
 */
export function BookingPairDetails({ pair, today }: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <Stack direction="row" sx={{ gap: 2 }}>
        <Figure label="На складі" value={pair.stock} danger={pair.stock < 0} />
        <Figure label="Потреба" value={pair.need} />
        <Figure label="У броні" value={pair.reserved} />
        <Figure label="Замовити" value={pair.toOrder} danger={pair.toOrder > 0} />
      </Stack>
      {pair.shortage > 0 && (
        <Alert severity="error">
          На складі вже мінус {formatMeters(pair.shortage)}: його теж треба замовити.
        </Alert>
      )}
      {pair.free > 0 && (
        <Typography variant="body2" color="text.secondary">
          Після броні вільно {formatMeters(pair.free)}.
        </Typography>
      )}
      <ReferenceFormSection title="Черга завдань">
        <Typography variant="body2" color="text.secondary">
          Раніші завдання отримують тканину першими. Розрахунок нічого не бронює і не списує.
        </Typography>
        {pair.items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Відкриті завдання цю пару не потребують.
          </Typography>
        ) : (
          <Stack component="ol" sx={{ m: 0, p: 0, listStyle: 'none', gap: 1.25 }}>
            {pair.items.map((item) => (
              <Stack
                component="li"
                key={`${item.itemId}|${item.layer}`}
                direction="row"
                sx={{ gap: 1.5, alignItems: 'baseline' }}
              >
                <Typography variant="body2" sx={{ ...reportMono, fontWeight: 600, minWidth: 48 }}>
                  <OrderLink orderId={item.orderId} orderNumber={item.orderNumber} />
                </Typography>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" noWrap>
                    {item.clientName} · {item.modelName}
                    {item.layer !== 'Upper' && ` · ${fabricLayerLabels[item.layer]}`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" component="div">
                    {item.dueDate && (
                      <Box
                        component="span"
                        sx={{
                          color:
                            item.toOrder > 0 && isDueSoon(item.dueDate, today)
                              ? 'error.main'
                              : undefined,
                        }}
                      >
                        до {formatDay(item.dueDate)} ·{' '}
                      </Box>
                    )}
                    план {formatMetersNumber(item.plan)}
                    {item.covered > 0 && `, видано ${formatMetersNumber(item.covered)}`}
                  </Typography>
                  {item.toOrder > 0 && (
                    <Typography variant="caption" color="error.main" component="div">
                      не вистачає {formatMeters(item.toOrder)}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" sx={reportMono} title="Ще потрібно">
                  {formatMetersNumber(item.remaining)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </ReferenceFormSection>
    </Stack>
  );
}

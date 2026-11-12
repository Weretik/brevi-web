import { ReferenceFormSection } from '@admin/references/ui';
import {
  formatDay,
  formatMeters,
  formatMetersNumber,
  movementOperationLabel,
  movementSource,
} from '@admin/warehouse/model';
import { Alert, Box, Link, Stack, Typography } from '@mui/material';

import type { FabricMovementRow, FabricStockPair } from '@admin/warehouse/model';

interface Props {
  pair: FabricStockPair;
  /** The latest movements of the pair; null while they load. */
  movements: readonly FabricMovementRow[] | null;
  movementsError: boolean;
  onAllHistory: () => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

function Figure({ label, value, danger }: { label: string; value: number; danger?: boolean }) {
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="overline" color="text.secondary" component="div">
        {label}
      </Typography>
      <Typography variant="h6" sx={{ ...mono, color: danger ? 'error.main' : undefined }}>
        {formatMetersNumber(value)}
      </Typography>
    </Box>
  );
}

/** The side panel of a pair: its figures, the tasks that book it and its latest movements. */
export function FabricStockPairDetails({ pair, movements, movementsError, onAllHistory }: Props) {
  const { fabric, color } = pair;
  return (
    <Stack sx={{ gap: 2 }}>
      <Stack direction="row" sx={{ gap: 2 }}>
        <Figure label="Залишок" value={color.meters} danger={color.meters < 0} />
        <Figure label="У броні" value={color.booked} />
        <Figure label="Вільно" value={color.free} danger={color.free < 0} />
      </Stack>
      {color.toOrder > 0 && (
        <Alert severity="warning">
          Під завдання не вистачає {formatMeters(color.toOrder)}: треба замовити.
        </Alert>
      )}
      {fabric.codes.length > 1 && color.sources.length > 1 && (
        <Typography variant="body2" color="text.secondary">
          За кодами:{' '}
          {color.sources.map((x) => `${x.fabricCode} ${formatMeters(x.meters)}`).join(' · ')}
        </Typography>
      )}
      <ReferenceFormSection title="Під які завдання заброньовано">
        {color.bookings.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Відкриті завдання цю пару не потребують.
          </Typography>
        ) : (
          <Stack component="ul" sx={{ m: 0, p: 0, listStyle: 'none', gap: 1 }}>
            {color.bookings.map((booking) => (
              <Stack
                component="li"
                key={`${booking.orderId}-${booking.modelName}`}
                direction="row"
                sx={{ gap: 1.5, alignItems: 'baseline' }}
              >
                <Typography variant="body2" sx={{ ...mono, fontWeight: 600, minWidth: 48 }}>
                  Ц-{booking.orderNumber}
                </Typography>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" noWrap>
                    {booking.clientName} · {booking.modelName}
                  </Typography>
                  {booking.toOrder > 0 && (
                    <Typography variant="caption" color="warning.main">
                      не вистачає {formatMeters(booking.toOrder)}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" sx={mono}>
                  {formatMetersNumber(booking.need)}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </ReferenceFormSection>
      <ReferenceFormSection title="Останні рухи">
        {movementsError && <Alert severity="error">Не вдалося завантажити рухи.</Alert>}
        {!movementsError && movements === null && (
          <Typography variant="body2" color="text.secondary">
            Завантажую…
          </Typography>
        )}
        {movements !== null && movements.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Рухів ще немає.
          </Typography>
        )}
        {movements !== null && movements.length > 0 && (
          <Stack component="ul" sx={{ m: 0, p: 0, listStyle: 'none', gap: 1 }}>
            {movements.map((row) => (
              <Stack
                component="li"
                key={row.id}
                direction="row"
                sx={{ gap: 1.5, alignItems: 'baseline' }}
              >
                <Typography variant="body2" sx={{ ...mono, minWidth: 84 }} color="text.secondary">
                  {formatDay(row.operationDate)}
                </Typography>
                <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }} noWrap>
                  {movementOperationLabel(row)}
                  {movementSource(row) ? ` · ${movementSource(row)}` : ''}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ ...mono, color: row.delta > 0 ? 'success.main' : undefined }}
                >
                  {row.delta > 0 ? '+' : row.delta < 0 ? '−' : ''}
                  {formatMetersNumber(Math.abs(row.delta))}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
        <Link
          component="button"
          type="button"
          underline="hover"
          onClick={onAllHistory}
          sx={{ alignSelf: 'flex-start' }}
        >
          Уся історія в «Рух тканини» →
        </Link>
      </ReferenceFormSection>
    </Stack>
  );
}

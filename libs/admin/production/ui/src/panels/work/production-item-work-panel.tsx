import { formatMoney } from '@admin/production/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Alert, Button, Stack, Typography } from '@mui/material';

import { ProductionWorkTable } from '../../tables/work/production-work-table';

import type { ProductionItemWorkCard, ProductionWork } from '@admin/production/model';

interface Props {
  work: ProductionItemWorkCard;
  busy?: boolean;
  onRecord?: () => void;
  onVoid?: (row: ProductionWork) => void;
}

/** «Робота» of an item: plan pieces sewn and cut, and the records. */
export function ProductionItemWorkPanel({ work, busy = false, onRecord, onVoid }: Props) {
  return (
    <Stack sx={{ gap: 1.5 }}>
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          Пошито {work.sewn} з {work.quantity} · покроєно {work.cut} з {work.quantity}
          {work.sewingRate !== null && ` · розцінка ${formatMoney(work.sewingRate)}`}
        </Typography>
        {onRecord && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddOutlinedIcon />}
            disabled={busy}
            onClick={onRecord}
          >
            Додати роботу
          </Button>
        )}
      </Stack>
      {work.cannotRecord && work.sewingRate === null && (
        <Alert severity="warning">{work.cannotRecord}</Alert>
      )}
      <ProductionWorkTable rows={work.rows} busy={busy} onVoid={onVoid} />
    </Stack>
  );
}

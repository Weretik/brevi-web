import { ReferenceEditorDrawer } from '@admin/references/ui';
import { useGetFabricConsumptionQuery } from '@admin/warehouse/data-access';
import { kyivToday } from '@admin/warehouse/model';
import { FabricConsumptionTable } from '@admin/warehouse/ui';
import { Alert, LinearProgress, Stack, TextField } from '@mui/material';
import { useState } from 'react';

interface Props {
  onClose: () => void;
}

/** «Зведення витрати» from the first day of this month up to today, or another period. */
export function FabricConsumptionDrawer({ onClose }: Props) {
  const today = kyivToday();
  const [from, setFrom] = useState(`${today.slice(0, 8)}01`);
  const [to, setTo] = useState(today);
  const valid = Boolean(from && to && from <= to);
  const { data, isFetching, error } = useGetFabricConsumptionQuery({ from, to }, { skip: !valid });
  return (
    <ReferenceEditorDrawer
      titleId="fabric-consumption-title"
      title="Зведення витрати"
      description="Скільки тканини прийшло, видано й скориговано за період."
      formId="fabric-consumption"
      paperWidth={820}
      readOnly
      editLabel={null}
      saving={false}
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={() => undefined}
    >
      <Stack sx={{ gap: 2 }}>
        <Stack direction="row" sx={{ gap: 2 }}>
          <TextField
            label="З"
            type="date"
            value={from}
            slotProps={{ inputLabel: { shrink: true } }}
            onChange={(event) => setFrom(event.target.value)}
          />
          <TextField
            label="По"
            type="date"
            value={to}
            error={!valid}
            helperText={valid ? undefined : 'Кінець не раніше початку.'}
            slotProps={{ inputLabel: { shrink: true } }}
            onChange={(event) => setTo(event.target.value)}
          />
        </Stack>
        {isFetching && <LinearProgress />}
        {error && <Alert severity="error">Не вдалося зібрати зведення.</Alert>}
        {data && valid && <FabricConsumptionTable consumption={data} />}
      </Stack>
    </ReferenceEditorDrawer>
  );
}

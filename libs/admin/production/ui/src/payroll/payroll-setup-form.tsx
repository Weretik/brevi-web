import { formatShare } from '@admin/production/model';
import { Autocomplete, Button, Paper, Stack, TextField, Typography } from '@mui/material';

import type { PayrollMonth, PayrollPerson } from '@admin/production/model';

export interface PayrollPersonOption {
  employeeId: number;
  name: string;
  position: string;
}

export interface PayrollSetupValues {
  masterId: number | null;
  chiefId: number | null;
  stitches: string;
  embroideryId: number | null;
}

interface Props {
  month: PayrollMonth;
  people: readonly PayrollPersonOption[];
  values: PayrollSetupValues;
  canEdit: boolean;
  busy: boolean;
  stitchesError: string | null;
  onChange: (values: PayrollSetupValues) => void;
  onSaveRoles: () => void;
  onSaveEmbroidery: () => void;
}

const found = (person: PayrollPerson | null) =>
  person && !person.isAssigned ? `Знайдено за посадою: ${person.name}` : undefined;

function PersonPicker({
  label,
  people,
  value,
  helper,
  disabled,
  onChange,
}: {
  label: string;
  people: readonly PayrollPersonOption[];
  value: number | null;
  helper?: string;
  disabled: boolean;
  onChange: (id: number | null) => void;
}) {
  return (
    <Autocomplete
      size="small"
      sx={{ minWidth: 240, flex: 1 }}
      options={people}
      value={people.find((x) => x.employeeId === value) ?? null}
      disabled={disabled}
      getOptionLabel={(option) => `${option.name} · ${option.position}`}
      isOptionEqualToValue={(option, selected) => option.employeeId === selected.employeeId}
      onChange={(_event, selected) => onChange(selected?.employeeId ?? null)}
      renderInput={(params) => <TextField {...params} label={label} helperText={helper} />}
    />
  );
}

/** «Керівні частки» (master and chief, for every open month) and «Вишивка» of the month. */
export function PayrollSetupForm({
  month,
  people,
  values,
  canEdit,
  busy,
  stitchesError,
  onChange,
  onSaveRoles,
  onSaveEmbroidery,
}: Props) {
  const disabled = !canEdit || busy;
  return (
    <Stack direction={{ xs: 'column', lg: 'row' }} sx={{ gap: 2 }}>
      <Paper variant="outlined" sx={{ p: 2, flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2">Керівні частки</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Майстер {formatShare(month.rates.master)}, начальник {formatShare(month.rates.chief)} від
          пошиву всіх швачок. Діє для всіх відкритих місяців.
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ gap: 1.5, alignItems: { sm: 'flex-start' } }}
        >
          <PersonPicker
            label="Майстер цеху"
            people={people}
            value={values.masterId}
            helper={found(month.master)}
            disabled={disabled}
            onChange={(masterId) => onChange({ ...values, masterId })}
          />
          <PersonPicker
            label="Начальник цеху"
            people={people}
            value={values.chiefId}
            helper={found(month.chief)}
            disabled={disabled}
            onChange={(chiefId) => onChange({ ...values, chiefId })}
          />
          {canEdit && (
            <Button variant="outlined" disabled={busy} onClick={onSaveRoles}>
              Зберегти
            </Button>
          )}
        </Stack>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2, flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2">Вишивка</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {month.rates.embroidery === null
            ? 'Ставка за 1000 стібків не заповнена.'
            : `${month.rates.embroidery} грн за 1000 стібків.`}{' '}
          Не обрано — нараховується начальнику цеху.
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ gap: 1.5, alignItems: { sm: 'flex-start' } }}
        >
          <TextField
            size="small"
            label="Стібків за місяць"
            value={values.stitches}
            disabled={disabled}
            error={stitchesError !== null}
            helperText={stitchesError ?? undefined}
            sx={{ width: 180 }}
            onChange={(event) => onChange({ ...values, stitches: event.target.value })}
            slotProps={{ htmlInput: { inputMode: 'numeric' } }}
          />
          <PersonPicker
            label="Кому"
            people={people}
            value={values.embroideryId}
            helper={found(month.embroideryEmployee)}
            disabled={disabled}
            onChange={(embroideryId) => onChange({ ...values, embroideryId })}
          />
          {canEdit && (
            <Button variant="outlined" disabled={busy} onClick={onSaveEmbroidery}>
              Зберегти
            </Button>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}

import {
  PRODUCTION_WORK_COMMENT_MAX_LENGTH,
  productionWorkKindLabels,
  productionWorkKinds,
  workTarget,
} from '@admin/production/model';
import { ReferenceFormSection } from '@admin/references/ui';
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import type {
  ProductionWorkErrors,
  ProductionWorkFormValues,
  ProductionWorkKind,
  WorkChoices,
  WorkItemChoice,
} from '@admin/production/model';

interface Props {
  values: ProductionWorkFormValues;
  errors: ProductionWorkErrors;
  choices: WorkChoices;
  /** From an item: the item is fixed and not shown. */
  fixedItem: boolean;
  /** Pieces of the plan left for the chosen item and kind; null before an item is chosen. */
  left: number | null;
  today: string;
  disabled: boolean;
  onChange: (values: ProductionWorkFormValues) => void;
}

const itemLabel = (item: WorkItemChoice) =>
  `№ ${item.orderNumber} · ${item.modelName} · ${item.clientName}`;

/** «Додати роботу»: who, what, how many pieces and when. */
export function ProductionWorkForm({
  values,
  errors,
  choices,
  fixedItem,
  left,
  today,
  disabled,
  onChange,
}: Props) {
  const set = (patch: Partial<ProductionWorkFormValues>) => onChange({ ...values, ...patch });
  const item = choices.items.find((x) => workTarget(x.orderId, x.itemId) === values.target) ?? null;
  const employee = choices.employees.find((x) => x.id === values.employeeId) ?? null;
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Робота">
        {!fixedItem && (
          <Autocomplete
            options={choices.items}
            value={item}
            disabled={disabled}
            getOptionLabel={itemLabel}
            isOptionEqualToValue={(option, value) =>
              option.orderId === value.orderId && option.itemId === value.itemId
            }
            onChange={(_event, value) =>
              set({ target: value ? workTarget(value.orderId, value.itemId) : '' })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Позиція завдання"
                required
                error={Boolean(errors.target) || (item !== null && item.sewingRate === null)}
                helperText={
                  errors.target ??
                  (item && item.sewingRate === null
                    ? 'У позиції немає розцінки пошиття: спершу вкажіть її в картці позиції.'
                    : 'Позиції завдань «Нове».')
                }
              />
            )}
          />
        )}
        <Autocomplete
          options={choices.employees}
          value={employee}
          disabled={disabled}
          getOptionLabel={(option) => `${option.fullName} · ${option.position}`}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(_event, value) => set({ employeeId: value?.id ?? null })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Працівник"
              required
              error={Boolean(errors.employeeId)}
              helperText={errors.employeeId ?? 'З «Працівники цеху».'}
            />
          )}
        />
        <ToggleButtonGroup
          exclusive
          size="small"
          value={values.kind}
          disabled={disabled}
          aria-label="Вид роботи"
          onChange={(_event, kind: ProductionWorkKind | null) => kind && set({ kind })}
        >
          {productionWorkKinds.map((kind) => (
            <ToggleButton key={kind} value={kind}>
              {productionWorkKindLabels[kind]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <TextField
          label="Кількість, шт."
          required
          value={values.quantity}
          error={Boolean(errors.quantity)}
          helperText={
            errors.quantity ??
            (left !== null && !values.overPlan ? `За планом залишилось ${left} шт.` : undefined)
          }
          disabled={disabled}
          slotProps={{ htmlInput: { inputMode: 'numeric' } }}
          onChange={(event) => set({ quantity: event.target.value })}
        />
        <TextField
          label="Дата роботи"
          type="date"
          required
          value={values.workDate}
          error={Boolean(errors.workDate)}
          helperText={errors.workDate}
          disabled={disabled}
          slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: today } }}
          onChange={(event) => set({ workDate: event.target.value })}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Понад план">
        <FormControlLabel
          control={
            <Checkbox
              checked={values.overPlan}
              disabled={disabled}
              onChange={(event) => set({ overPlan: event.target.checked, reason: '' })}
            />
          }
          label="Робота понад кількість у позиції"
        />
        {values.overPlan && (
          <TextField
            select
            label="Причина"
            required
            value={values.reason}
            error={Boolean(errors.reason)}
            helperText={errors.reason ?? 'Така робота не зараховується в план позиції.'}
            disabled={disabled}
            onChange={(event) => set({ reason: event.target.value })}
          >
            {choices.overPlanReasons.map((reason) => (
              <MenuItem key={reason} value={reason}>
                {reason}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          label="Коментар"
          multiline
          minRows={2}
          value={values.comment}
          error={Boolean(errors.comment)}
          helperText={errors.comment}
          disabled={disabled}
          slotProps={{ htmlInput: { maxLength: PRODUCTION_WORK_COMMENT_MAX_LENGTH } }}
          onChange={(event) => set({ comment: event.target.value })}
        />
      </ReferenceFormSection>
    </Stack>
  );
}

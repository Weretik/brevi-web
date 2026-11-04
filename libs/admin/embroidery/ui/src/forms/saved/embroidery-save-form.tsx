import { Autocomplete, Stack, TextField } from '@mui/material';

export interface EmbroideryCustomerOption {
  publicId: string;
  name: string;
}

export interface EmbroiderySaveValues {
  name: string;
  customer: EmbroideryCustomerOption | null;
}

interface Props {
  values: EmbroiderySaveValues;
  disabled: boolean;
  customers: readonly EmbroideryCustomerOption[];
  onCustomerSearch: (text: string) => void;
  onChange: (values: EmbroiderySaveValues) => void;
}

/** «Зберегти розрахунок»: both fields are optional. */
export function EmbroiderySaveForm({
  values,
  disabled,
  customers,
  onCustomerSearch,
  onChange,
}: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <TextField
        label="Назва"
        value={values.name}
        disabled={disabled}
        autoFocus
        slotProps={{ htmlInput: { maxLength: 120 } }}
        helperText="Необов'язково, наприклад «Логотип на поло»"
        onChange={(event) => onChange({ ...values, name: event.target.value })}
      />
      <Autocomplete
        options={customers as EmbroideryCustomerOption[]}
        value={values.customer}
        disabled={disabled}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.publicId === value.publicId}
        filterOptions={(options) => options}
        noOptionsText="Почніть вводити назву клієнта"
        onInputChange={(_event, text, reason) => {
          if (reason === 'input') onCustomerSearch(text);
        }}
        onChange={(_event, customer) => onChange({ ...values, customer })}
        renderInput={(params) => (
          <TextField {...params} label="Клієнт" helperText="Необов'язково, з «Контрагентів»" />
        )}
      />
    </Stack>
  );
}

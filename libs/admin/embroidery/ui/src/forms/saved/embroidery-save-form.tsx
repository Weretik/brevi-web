import { formatEmbroideryUnitPrice } from '@admin/embroidery/model';
import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material';

import type { EmbroideryPrice } from '@admin/embroidery/model';

export interface EmbroideryCustomerOption {
  publicId: string;
  name: string;
}

export interface EmbroiderySaveValues {
  name: string;
  customer: EmbroideryCustomerOption | null;
  /** The one price category kept for the client. */
  category: string;
}

interface Props {
  values: EmbroiderySaveValues;
  /** The current prices of the categories to choose from. */
  prices: readonly EmbroideryPrice[];
  disabled: boolean;
  customers: readonly EmbroideryCustomerOption[];
  onCustomerSearch: (text: string) => void;
  onChange: (values: EmbroiderySaveValues) => void;
}

/** «Зберегти розрахунок»: one price category is chosen; the name and the client are optional. */
export function EmbroiderySaveForm({
  values,
  prices,
  disabled,
  customers,
  onCustomerSearch,
  onChange,
}: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <FormControl disabled={disabled}>
        <FormLabel id="embroidery-save-category">Категорія ціни</FormLabel>
        <RadioGroup
          aria-labelledby="embroidery-save-category"
          value={values.category}
          onChange={(event) => onChange({ ...values, category: event.target.value })}
        >
          {prices.map((price) => (
            <FormControlLabel
              key={price.name}
              value={price.name}
              control={<Radio size="small" />}
              label={formatEmbroideryUnitPrice(price)}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <TextField
        label="Назва"
        value={values.name}
        disabled={disabled}
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

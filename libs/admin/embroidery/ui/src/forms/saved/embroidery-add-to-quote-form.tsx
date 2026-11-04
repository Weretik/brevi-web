import { formatEmbroideryMoney } from '@admin/embroidery/model';
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

import type { EmbroiderySavedPrice } from '@admin/embroidery/model';

export interface EmbroideryQuoteOption {
  id: number;
  /** «КП-2026-11-0042 · ТОВ «Агро»». */
  label: string;
}

export interface EmbroideryAddToQuoteValues {
  level: string;
  quote: EmbroideryQuoteOption | null;
}

interface Props {
  values: EmbroideryAddToQuoteValues;
  prices: readonly EmbroiderySavedPrice[];
  quotes: readonly EmbroideryQuoteOption[];
  loadingQuotes: boolean;
  disabled: boolean;
  onQuoteSearch: (text: string) => void;
  onChange: (values: EmbroideryAddToQuoteValues) => void;
}

/** «Додати в КП»: which saved price the client sees, and which КП gets the row. */
export function EmbroideryAddToQuoteForm({
  values,
  prices,
  quotes,
  loadingQuotes,
  disabled,
  onQuoteSearch,
  onChange,
}: Props) {
  return (
    <Stack sx={{ gap: 2.5 }}>
      <FormControl disabled={disabled}>
        <FormLabel id="embroidery-quote-level">Ціна для клієнта</FormLabel>
        <RadioGroup
          aria-labelledby="embroidery-quote-level"
          value={values.level}
          onChange={(event) => onChange({ ...values, level: event.target.value })}
        >
          {prices.map((price) => (
            <FormControlLabel
              key={price.name}
              value={price.name}
              control={<Radio size="small" />}
              label={`${price.name} — ${formatEmbroideryMoney(price.unit)} грн за 1 шт`}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Autocomplete
        options={quotes as EmbroideryQuoteOption[]}
        value={values.quote}
        disabled={disabled}
        loading={loadingQuotes}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        filterOptions={(options) => options}
        noOptionsText="КП не знайдено"
        onInputChange={(_event, text, reason) => {
          if (reason === 'input') onQuoteSearch(text);
        }}
        onChange={(_event, quote) => onChange({ ...values, quote })}
        renderInput={(params) => (
          <TextField
            {...params}
            required
            label="КП"
            helperText="Номер або клієнт. Ціна стане в усі три колонки КП."
          />
        )}
      />
    </Stack>
  );
}

import { formatEmbroideryUnitPrice } from '@admin/embroidery/model';
import { Autocomplete, Box, Stack, TextField, Typography } from '@mui/material';

import type { EmbroiderySavedPrice } from '@admin/embroidery/model';

export interface EmbroideryQuoteOption {
  id: number;
  /** «КП-2026-11-0042 · ТОВ «Агро»». */
  label: string;
}

export interface EmbroideryAddToQuoteValues {
  quote: EmbroideryQuoteOption | null;
}

interface Props {
  values: EmbroideryAddToQuoteValues;
  /** The one saved price category the client sees. */
  price: EmbroiderySavedPrice | null;
  quotes: readonly EmbroideryQuoteOption[];
  loadingQuotes: boolean;
  disabled: boolean;
  onQuoteSearch: (text: string) => void;
  onChange: (values: EmbroideryAddToQuoteValues) => void;
}

/** «Додати в КП»: the saved price the client sees, and which КП gets the row. */
export function EmbroideryAddToQuoteForm({
  values,
  price,
  quotes,
  loadingQuotes,
  disabled,
  onQuoteSearch,
  onChange,
}: Props) {
  return (
    <Stack sx={{ gap: 2.5 }}>
      <Box>
        <Typography variant="caption" color="text.secondary">
          Ціна для клієнта
        </Typography>
        <Typography variant="body1">{price ? formatEmbroideryUnitPrice(price) : '—'}</Typography>
      </Box>
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

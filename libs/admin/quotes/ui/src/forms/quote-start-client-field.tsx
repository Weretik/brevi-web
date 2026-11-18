import { quoteNameMaxLength } from '@admin/quotes/model';
import { Autocomplete, Box, TextField, Typography } from '@mui/material';

import type { QuoteClientSuggestion } from '@admin/quotes/model';

interface Props {
  name: string;
  client: QuoteClientSuggestion | null;
  clients: readonly QuoteClientSuggestion[];
  error?: string;
  onNameChange: (name: string) => void;
  onClientChange: (client: QuoteClientSuggestion | null) => void;
}

/** «Клієнт або запит»: a client found in KeepinCRM, or any typed name. */
export function QuoteStartClientField({
  name,
  client,
  clients,
  error,
  onNameChange,
  onClientChange,
}: Props) {
  return (
    <Autocomplete
      freeSolo
      options={clients as QuoteClientSuggestion[]}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      filterOptions={(options) => options}
      inputValue={name}
      value={client}
      onInputChange={(_event, value, reason) => {
        onNameChange(value);
        if (reason === 'input') onClientChange(null);
      }}
      onChange={(_event, value) => onClientChange(typeof value === 'string' ? null : value)}
      renderOption={({ key, ...props }, option) => (
        <li key={key} {...props}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {option.name}
            </Typography>
            {(option.companyName || option.contactName) && (
              <Typography variant="caption" color="text.secondary">
                {[option.companyName, option.contactName].filter(Boolean).join(' · ')}
              </Typography>
            )}
          </Box>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          autoFocus
          label="Клієнт або запит"
          placeholder="Почніть вводити назву клієнта з KeepinCRM"
          error={Boolean(error)}
          helperText={
            error ??
            'Немає в KeepinCRM? Просто напишіть назву. Компанія й отримувач підставляться самі, їх можна змінити в КП.'
          }
          slotProps={{
            ...params.slotProps,
            // The panel checks the name itself and shows the error under the field.
            htmlInput: {
              ...params.slotProps.htmlInput,
              maxLength: quoteNameMaxLength,
              required: false,
            },
          }}
          sx={{ mt: 1 }}
        />
      )}
    />
  );
}

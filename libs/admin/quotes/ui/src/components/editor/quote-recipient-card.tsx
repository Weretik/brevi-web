import { quoteNameMaxLength } from '@admin/quotes/model';
import { Autocomplete, Box, Card, TextField, Typography } from '@mui/material';

import type { QuoteClientSuggestion, QuoteDraft } from '@admin/quotes/model';

interface Props {
  draft: QuoteDraft;
  /** KeepinCRM clients for the client field; free text is allowed. */
  clients: readonly QuoteClientSuggestion[];
  headerError: string | undefined;
  onChange: (patch: Partial<QuoteDraft>) => void;
  onClientSearch: (text: string) => void;
}

/** The id the «Перед надсиланням» link scrolls to. */
export const quoteRecipientAnchor = 'quote-recipient';

/** «Кому»: the client or request (for the list), the recipient and the company shown in the КП. */
export function QuoteRecipientCard({
  draft,
  clients,
  headerError,
  onChange,
  onClientSearch,
}: Props) {
  return (
    <Card variant="outlined" sx={{ p: 2, scrollMarginTop: 96 }} id={quoteRecipientAnchor}>
      <Typography variant="overline" color="text.secondary" component="h2">
        Кому
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          mt: 1,
          gridTemplateColumns: { xs: '1fr', md: '3fr 2fr 2fr' },
        }}
      >
        <Autocomplete
          freeSolo
          options={clients as QuoteClientSuggestion[]}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          filterOptions={(options) => options}
          inputValue={draft.internalName}
          onInputChange={(_event, value) => {
            onChange({ internalName: value });
            onClientSearch(value);
          }}
          onChange={(_event, value) => {
            if (!value || typeof value === 'string') return;
            onChange({
              internalName: value.name,
              companyName: draft.companyName || value.companyName || value.name,
              recipientName: draft.recipientName || value.contactName || '',
            });
          }}
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
              required
              size="small"
              label="Клієнт або запит"
              error={Boolean(headerError)}
              helperText={
                headerError ?? 'Оберіть клієнта з KeepinCRM або напишіть. Бачите лише ви.'
              }
              slotProps={{
                ...params.slotProps,
                htmlInput: { ...params.slotProps.htmlInput, maxLength: quoteNameMaxLength },
              }}
            />
          )}
        />
        <TextField
          size="small"
          label="Отримувач"
          value={draft.recipientName}
          onChange={(event) => onChange({ recipientName: event.target.value })}
          slotProps={{ htmlInput: { maxLength: quoteNameMaxLength } }}
        />
        <TextField
          size="small"
          label="Підприємство в КП"
          value={draft.companyName}
          onChange={(event) => onChange({ companyName: event.target.value })}
          slotProps={{ htmlInput: { maxLength: quoteNameMaxLength } }}
        />
      </Box>
    </Card>
  );
}

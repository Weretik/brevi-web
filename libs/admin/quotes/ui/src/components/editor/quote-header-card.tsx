import { quoteNameMaxLength } from '@admin/quotes/model';
import { Autocomplete, Box, Card, Stack, TextField, Typography } from '@mui/material';

import type { QuoteDraft, QuotePerson } from '@admin/quotes/model';

interface Props {
  number: string | null;
  author: QuotePerson | null;
  responsible: QuotePerson | null;
  draft: QuoteDraft;
  /** Client names from KeepinCRM for the internal name; free text is allowed. */
  clientNames: readonly string[];
  headerError: string | undefined;
  onChange: (patch: Partial<QuoteDraft>) => void;
  onClientSearch: (text: string) => void;
}

const Person = ({ label, person }: { label: string; person: QuotePerson | null }) => (
  <Box>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 600 }}>
      {person?.name ?? 'Ви'}
    </Typography>
  </Box>
);

/** Number, people and who the КП is for. */
export function QuoteHeaderCard({
  number,
  author,
  responsible,
  draft,
  clientNames,
  headerError,
  onChange,
  onClientSearch,
}: Props) {
  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 3, mb: 2 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Номер КП
          </Typography>
          <Typography sx={{ fontFamily: 'var(--admin-font-mono)', fontWeight: 600 }}>
            {number ?? 'Буде присвоєно після збереження'}
          </Typography>
        </Box>
        <Person label="Створив(-ла)" person={author} />
        <Person label="Відповідальний(-а)" person={responsible} />
      </Stack>
      <Box
        sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' } }}
      >
        <Autocomplete
          freeSolo
          options={clientNames as string[]}
          inputValue={draft.internalName}
          onInputChange={(_event, value) => {
            onChange({ internalName: value });
            onClientSearch(value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              size="small"
              label="Внутрішня назва клієнта / запиту"
              error={Boolean(headerError)}
              helperText={
                headerError ?? 'Лише для менеджера. Можна обрати клієнта з KeepinCRM або написати.'
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
          label="Ім'я отримувача"
          value={draft.recipientName}
          onChange={(event) => onChange({ recipientName: event.target.value })}
          slotProps={{ htmlInput: { maxLength: quoteNameMaxLength } }}
        />
        <TextField
          size="small"
          label="Назва підприємства"
          value={draft.companyName}
          onChange={(event) => onChange({ companyName: event.target.value })}
          slotProps={{ htmlInput: { maxLength: quoteNameMaxLength } }}
        />
      </Box>
    </Card>
  );
}

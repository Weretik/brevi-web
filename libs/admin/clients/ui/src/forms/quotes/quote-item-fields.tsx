import { Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';

import type { QuoteItemDraft } from '@admin/clients/model';

export function QuoteItemFields({
  item,
  disabled,
  onChange,
}: {
  item: QuoteItemDraft;
  disabled: boolean;
  onChange: (item: QuoteItemDraft) => void;
}) {
  return (
    <Stack spacing={2}>
      <TextField
        label="Назва позиції"
        value={item.title}
        disabled={disabled}
        onChange={(event) => onChange({ ...item, title: event.target.value })}
        required
      />
      <TextField
        label="Опис для клієнта"
        multiline
        minRows={2}
        value={item.publicDescription}
        disabled={disabled}
        onChange={(event) => onChange({ ...item, publicDescription: event.target.value })}
      />
      <TextField
        label="Коментар для клієнта"
        multiline
        value={item.publicComment}
        disabled={disabled}
        onChange={(event) => onChange({ ...item, publicComment: event.target.value })}
      />
      <TextField
        label="Внутрішня нотатка — не для клієнта"
        multiline
        value={item.internalNote}
        disabled={disabled}
        onChange={(event) => onChange({ ...item, internalNote: event.target.value })}
      />
      <FormControlLabel
        control={
          <Checkbox
            disabled={disabled}
            checked={item.included}
            onChange={(_, included) => onChange({ ...item, included })}
          />
        }
        label="Включити позицію до пропозиції"
      />
    </Stack>
  );
}

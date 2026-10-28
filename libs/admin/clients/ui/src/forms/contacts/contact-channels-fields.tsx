import { Button, MenuItem, Stack, TextField } from '@mui/material';

import type { CustomerChannel } from '@admin/clients/model';

export interface ContactChannelsFieldsProps {
  channels: readonly CustomerChannel[];
  disabled: boolean;
  errors: Record<string, string>;
  onChange: (channels: readonly CustomerChannel[]) => void;
}
export function ContactChannelsFields({
  channels,
  disabled,
  errors,
  onChange,
}: ContactChannelsFieldsProps) {
  return (
    <Stack spacing={1}>
      {channels.map((channel, index) => (
        <Stack key={index} direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <TextField
            select
            label={`Тип каналу ${index + 1}`}
            value={channel.kind}
            disabled={disabled}
            onChange={(event) =>
              onChange(
                channels.map((c, i) =>
                  i === index ? { ...c, kind: event.target.value as CustomerChannel['kind'] } : c,
                ),
              )
            }
          >
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="phone">Телефон</MenuItem>
          </TextField>
          <TextField
            label={`Значення каналу ${index + 1}`}
            value={channel.value}
            disabled={disabled}
            error={!!errors[`channel.${index}`]}
            helperText={errors[`channel.${index}`]}
            onChange={(event) =>
              onChange(
                channels.map((c, i) => (i === index ? { ...c, value: event.target.value } : c)),
              )
            }
          />
          <Button
            disabled={disabled}
            aria-label={`Прибрати канал ${index + 1}`}
            onClick={() => onChange(channels.filter((_, i) => i !== index))}
          >
            Прибрати
          </Button>
        </Stack>
      ))}
      <Button
        disabled={disabled || channels.length >= 10}
        onClick={() => onChange([...channels, { kind: 'email', value: '' }])}
      >
        Додати канал зв’язку
      </Button>
    </Stack>
  );
}

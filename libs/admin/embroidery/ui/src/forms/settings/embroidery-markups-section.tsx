import { Box, TextField } from '@mui/material';

import { EmbroideryFormCard } from '../embroidery-form-card';
import { EmbroideryNumberField } from '../embroidery-number-field';

import type { EmbroiderySettingsDraft, EmbroiderySettingsErrors } from '@admin/embroidery/model';

interface Props {
  markups: EmbroiderySettingsDraft['markups'];
  errors: EmbroiderySettingsErrors;
  onChange: (index: number, patch: Partial<EmbroiderySettingsDraft['markups'][number]>) => void;
}

/** «Націнки»: always three price levels; a Manager sees only their names. */
export function EmbroideryMarkupsSection({ markups, errors, onChange }: Props) {
  return (
    <EmbroideryFormCard title="Націнки" id="embroidery-settings-markups">
      {markups.map((markup, index) => (
        <Box
          key={index}
          sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' } }}
        >
          <TextField
            label={`Назва ${index + 1}`}
            value={markup.name}
            error={Boolean(errors[`markups.${index}.name`])}
            helperText={errors[`markups.${index}.name`]}
            onChange={(event) => onChange(index, { name: event.target.value })}
          />
          <EmbroideryNumberField
            label="Націнка"
            unit="%"
            value={markup.percent}
            error={errors[`markups.${index}.percent`]}
            onChange={(percent) => onChange(index, { percent })}
          />
        </Box>
      ))}
    </EmbroideryFormCard>
  );
}

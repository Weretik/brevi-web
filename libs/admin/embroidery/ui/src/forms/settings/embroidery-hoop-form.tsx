import { Box, Stack, TextField } from '@mui/material';

import { EmbroideryNumberField } from '../embroidery-number-field';

import type { EmbroideryHoopDraft } from '@admin/embroidery/model';

interface Props {
  formId: string;
  hoop: EmbroideryHoopDraft;
  errors: Readonly<Record<string, string>>;
  onChange: (patch: Partial<EmbroideryHoopDraft>) => void;
  onSubmit: () => void;
}

/** The fields of one hoop in its side panel. */
export function EmbroideryHoopForm({ formId, hoop, errors, onChange, onSubmit }: Props) {
  return (
    <Stack
      component="form"
      id={formId}
      noValidate
      sx={{ gap: 2 }}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <TextField
        label="Назва"
        placeholder="18 см"
        autoFocus
        value={hoop.label}
        error={Boolean(errors['label'])}
        helperText={errors['label']}
        onChange={(event) => onChange({ label: event.target.value })}
      />
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
        <EmbroideryNumberField
          label="Ширина заготовки"
          unit="см"
          value={hoop.blankWidthCm}
          error={errors['blankWidthCm']}
          onChange={(blankWidthCm) => onChange({ blankWidthCm })}
        />
        <EmbroideryNumberField
          label="Довжина заготовки"
          unit="см"
          value={hoop.blankLengthCm}
          error={errors['blankLengthCm']}
          onChange={(blankLengthCm) => onChange({ blankLengthCm })}
        />
      </Box>
      <EmbroideryNumberField
        label="Клей на одне зап’ялювання"
        unit="грн"
        value={hoop.glueRate}
        error={errors['glueRate']}
        helperText="Порожньо — береться загальна ставка «Клей»."
        onChange={(glueRate) => onChange({ glueRate })}
      />
    </Stack>
  );
}

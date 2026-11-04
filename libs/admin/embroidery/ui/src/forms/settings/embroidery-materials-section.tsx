import { Box, Typography } from '@mui/material';

import { EmbroideryFormCard } from '../embroidery-form-card';
import { EmbroideryNumberField } from '../embroidery-number-field';

import type { EmbroiderySettingsDraft, EmbroiderySettingsErrors } from '@admin/embroidery/model';

type Material = EmbroiderySettingsDraft['stabilizer'];

interface Props {
  draft: EmbroiderySettingsDraft;
  errors: EmbroiderySettingsErrors;
  onChange: (
    patch: Partial<
      Pick<EmbroiderySettingsDraft, 'stabilizer' | 'fabric' | 'fabricIncreasePercent'>
    >,
  ) => void;
}

const grid = { display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' } };

/** «Матеріали»: the stabilizer and chevron fabric rolls, and how much bigger a fabric blank is. */
export function EmbroideryMaterialsSection({ draft, errors, onChange }: Props) {
  const material = (key: 'stabilizer' | 'fabric', title: string) => {
    const value: Material = draft[key];
    return (
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Box sx={grid}>
          <EmbroideryNumberField
            label="Ціна за метр"
            unit="грн"
            value={value.pricePerMetre}
            error={errors[`${key}.pricePerMetre`]}
            onChange={(pricePerMetre) => onChange({ [key]: { ...value, pricePerMetre } })}
          />
          <EmbroideryNumberField
            label="Ширина рулону"
            unit="см"
            value={value.widthCm}
            error={errors[`${key}.widthCm`]}
            onChange={(widthCm) => onChange({ [key]: { ...value, widthCm } })}
          />
        </Box>
      </Box>
    );
  };
  return (
    <EmbroideryFormCard title="Матеріали" id="embroidery-settings-materials">
      {material('stabilizer', 'Флізелін')}
      {material('fabric', 'Тканина для шевронів')}
      <EmbroideryNumberField
        label="Заготовка тканини більша за флізелін на"
        unit="%"
        value={draft.fabricIncreasePercent}
        error={errors['fabricIncreasePercent']}
        onChange={(fabricIncreasePercent) => onChange({ fabricIncreasePercent })}
        sx={{ maxWidth: { sm: 'calc(50% - 8px)' } }}
      />
    </EmbroideryFormCard>
  );
}

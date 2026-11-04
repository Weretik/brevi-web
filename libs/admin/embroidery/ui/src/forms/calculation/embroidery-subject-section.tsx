import { embroideryModeLabels, formatEmbroideryNumber } from '@admin/embroidery/model';
import { Box, ButtonBase, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

import { EmbroideryFormCard } from '../embroidery-form-card';
import { EmbroideryNumberField } from '../embroidery-number-field';

import type {
  EmbroideryCalculationErrors,
  EmbroideryCalculationValues,
  EmbroideryFormHoop,
  EmbroideryMode,
} from '@admin/embroidery/model';

interface Props {
  values: EmbroideryCalculationValues;
  hoops: readonly EmbroideryFormHoop[];
  errors: EmbroideryCalculationErrors;
  onChange: (patch: Partial<EmbroideryCalculationValues>) => void;
}

const fields = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
};

/** «1 · Що вишиваємо»: mode, quantity, stitches, layers and the hoop. */
export function EmbroiderySubjectSection({ values, hoops, errors, onChange }: Props) {
  const chevron = values.mode === 'Chevron';
  return (
    <EmbroideryFormCard title="1 · Що вишиваємо">
      <ToggleButtonGroup
        exclusive
        size="small"
        color="primary"
        aria-label="Що вишиваємо"
        value={values.mode}
        onChange={(_event, mode: EmbroideryMode | null) => mode && onChange({ mode })}
        sx={{ alignSelf: 'flex-start' }}
      >
        {(Object.keys(embroideryModeLabels) as EmbroideryMode[]).map((mode) => (
          <ToggleButton key={mode} value={mode}>
            {embroideryModeLabels[mode]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Box sx={fields}>
        <EmbroideryNumberField
          label={chevron ? 'Шевронів, шт' : 'Кількість, шт'}
          integer
          value={values.quantity}
          error={errors.quantity}
          onChange={(quantity) => onChange({ quantity })}
        />
        <EmbroideryNumberField
          label={chevron ? 'Стежків на шеврон' : 'Стежків на одиницю'}
          integer
          value={values.stitchesPerUnit}
          error={errors.stitchesPerUnit}
          onChange={(stitchesPerUnit) => onChange({ stitchesPerUnit })}
        />
        <EmbroideryNumberField
          label="Шарів флізеліну"
          integer
          value={values.stabilizerLayers}
          error={errors.stabilizerLayers}
          onChange={(stabilizerLayers) => onChange({ stabilizerLayers })}
        />
        {chevron && (
          <>
            <EmbroideryNumberField
              label="Шевронів в одних п’яльцях"
              integer
              value={values.unitsPerHoop}
              error={errors.unitsPerHoop}
              onChange={(unitsPerHoop) => onChange({ unitsPerHoop })}
            />
            <EmbroideryNumberField
              label="Шарів тканини"
              integer
              value={values.fabricLayers}
              error={errors.fabricLayers}
              onChange={(fabricLayers) => onChange({ fabricLayers })}
            />
          </>
        )}
      </Box>

      <Box role="radiogroup" aria-label="П’яльця">
        <Typography variant="overline" color="text.secondary" component="p">
          П’яльця
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 1,
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          }}
        >
          {hoops.map((hoop) => {
            const selected = hoop.id === values.hoopId;
            return (
              <ButtonBase
                key={hoop.id}
                role="radio"
                aria-checked={selected}
                onClick={() => onChange({ hoopId: hoop.id })}
                sx={{
                  display: 'block',
                  textAlign: 'left',
                  p: 1.25,
                  borderRadius: 1.5,
                  border: 1,
                  borderColor: selected ? 'primary.main' : 'divider',
                  bgcolor: selected ? 'primary.light' : 'background.paper',
                }}
              >
                <Typography variant="subtitle2">{hoop.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  заготовка{' '}
                  <Box component="span" sx={{ fontFamily: 'var(--admin-font-mono)' }}>
                    {formatEmbroideryNumber(hoop.blankWidthCm)}×
                    {formatEmbroideryNumber(hoop.blankLengthCm)}
                  </Box>
                </Typography>
              </ButtonBase>
            );
          })}
        </Box>
        {errors.hoopId && (
          <Typography variant="caption" color="error">
            {errors.hoopId}
          </Typography>
        )}
      </Box>
    </EmbroideryFormCard>
  );
}

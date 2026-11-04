import {
  embroideryProgramLabels,
  embroideryProgramMinuteChips,
  formatEmbroideryMinutes,
} from '@admin/embroidery/model';
import { Chip, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

import { EmbroideryFormCard } from '../embroidery-form-card';
import { EmbroideryNumberField } from '../embroidery-number-field';

import type {
  EmbroideryCalculationErrors,
  EmbroideryCalculationValues,
  EmbroideryProgram,
} from '@admin/embroidery/model';

interface Props {
  values: EmbroideryCalculationValues;
  errors: EmbroideryCalculationErrors;
  /** The program cost for Director and Admin; null for a Manager or before the first price. */
  programCost: string | null;
  onChange: (patch: Partial<EmbroideryCalculationValues>) => void;
}

/** «2 · Програма вишивки»: new, adjusted or ready; the time in hours and minutes. */
export function EmbroideryProgramSection({ values, errors, programCost, onChange }: Props) {
  const minutes = values.programMinutes;
  const hours = minutes === null ? null : Math.floor(minutes / 60);
  const rest = minutes === null ? null : minutes - Math.floor(minutes / 60) * 60;
  const setTime = (nextHours: number | null, nextMinutes: number | null) =>
    onChange({
      programMinutes:
        nextHours === null && nextMinutes === null
          ? null
          : (nextHours ?? 0) * 60 + (nextMinutes ?? 0),
    });

  return (
    <EmbroideryFormCard title="2 · Програма вишивки">
      <ToggleButtonGroup
        exclusive
        size="small"
        color="primary"
        aria-label="Програма"
        value={values.program}
        onChange={(_event, program: EmbroideryProgram | null) => program && onChange({ program })}
        sx={{ alignSelf: 'flex-start' }}
      >
        {(Object.keys(embroideryProgramLabels) as EmbroideryProgram[]).map((program) => (
          <ToggleButton key={program} value={program}>
            {embroideryProgramLabels[program]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {values.program === 'Ready' ? (
        <Typography variant="body2" color="text.secondary">
          Програма вже є: розробку не рахуємо.
        </Typography>
      ) : (
        <>
          <Stack direction="row" sx={{ gap: 1.5, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <EmbroideryNumberField
              label="Розробка, год"
              integer
              value={hours}
              onChange={(next) => setTime(next, rest)}
              sx={{ width: 130 }}
            />
            <EmbroideryNumberField
              label="хв"
              integer
              value={rest}
              onChange={(next) => setTime(hours, next)}
              sx={{ width: 100 }}
            />
            <Stack direction="row" sx={{ gap: 0.75, flexWrap: 'wrap', pt: 1 }}>
              {embroideryProgramMinuteChips.map((chip) => (
                <Chip
                  key={chip}
                  label={formatEmbroideryMinutes(chip)}
                  size="small"
                  color={minutes === chip ? 'secondary' : 'default'}
                  variant={minutes === chip ? 'filled' : 'outlined'}
                  onClick={() => onChange({ programMinutes: chip })}
                />
              ))}
            </Stack>
          </Stack>
          {errors.programMinutes && (
            <Typography variant="caption" color="error">
              {errors.programMinutes}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            {programCost && (
              <>
                ={' '}
                <Typography
                  component="span"
                  variant="body2"
                  sx={{
                    fontFamily: 'var(--admin-font-mono)',
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  {programCost} грн
                </Typography>
                ,{' '}
              </>
            )}
            один раз на партію. У ціні повтору не враховується.
          </Typography>
        </>
      )}
    </EmbroideryFormCard>
  );
}

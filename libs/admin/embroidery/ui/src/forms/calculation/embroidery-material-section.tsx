import {
  embroideryMaterialModeLabels,
  formatEmbroideryMoney,
  formatEmbroideryNumber,
} from '@admin/embroidery/model';
import { Box, ButtonBase, Typography } from '@mui/material';

import { EmbroideryFormCard } from '../embroidery-form-card';

import type {
  EmbroideryCalculation,
  EmbroideryCut,
  EmbroideryMaterialMode,
  EmbroideryMode,
} from '@admin/embroidery/model';

interface Props {
  mode: EmbroideryMode;
  value: EmbroideryMaterialMode;
  calculation: EmbroideryCalculation | null;
  onChange: (materialMode: EmbroideryMaterialMode) => void;
}

const cuts = (calculation: EmbroideryCalculation | null): EmbroideryCut[] =>
  [calculation?.stabilizer, calculation?.fabric].filter((cut): cut is EmbroideryCut =>
    Boolean(cut),
  );

function sum(list: EmbroideryCut[], pick: (cut: EmbroideryCut) => number | null): string | null {
  if (list.length === 0 || list.some((cut) => pick(cut) === null)) return null;
  return formatEmbroideryMoney(list.reduce((total, cut) => total + (pick(cut) ?? 0), 0));
}

function note(mode: EmbroideryMaterialMode, list: EmbroideryCut[]): string | null {
  const stabilizer = list[0];
  if (!stabilizer) return null;
  if (mode === 'FullCut') return `${formatEmbroideryNumber(stabilizer.cutMetres)} м флізеліну`;
  return stabilizer.spare > 0
    ? `${formatEmbroideryNumber(stabilizer.spare)} зайвих заготовок лишаються в цеху`
    : 'Зайвих заготовок немає';
}

/** «3 · Як рахувати флізелін»: only the blanks used, or the whole cut; the sums for Director and Admin. */
export function EmbroideryMaterialSection({ mode, value, calculation, onChange }: Props) {
  const list = cuts(calculation);
  const options: { mode: EmbroideryMaterialMode; amount: string | null }[] = [
    { mode: 'UsedBlanks', amount: sum(list, (cut) => cut.blankCost) },
    { mode: 'FullCut', amount: sum(list, (cut) => cut.wholeCost) },
  ];
  return (
    <EmbroideryFormCard
      title={mode === 'Chevron' ? '3 · Як рахувати флізелін і тканину' : '3 · Як рахувати флізелін'}
    >
      <Box
        role="radiogroup"
        aria-label="Як рахувати матеріали"
        sx={{ display: 'grid', gap: 1, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}
      >
        {options.map((option) => {
          const selected = option.mode === value;
          return (
            <ButtonBase
              key={option.mode}
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.mode)}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 1,
                textAlign: 'left',
                p: 1.5,
                borderRadius: 1.5,
                border: 1,
                borderColor: selected ? 'primary.main' : 'divider',
                bgcolor: selected ? 'primary.light' : 'background.paper',
              }}
            >
              <Box>
                <Typography variant="subtitle2">
                  {embroideryMaterialModeLabels[option.mode]}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {note(option.mode, list)}
                </Typography>
              </Box>
              {option.amount && (
                <Typography
                  variant="body2"
                  sx={{ fontFamily: 'var(--admin-font-mono)', fontWeight: 600 }}
                >
                  {option.amount}
                </Typography>
              )}
            </ButtonBase>
          );
        })}
      </Box>
    </EmbroideryFormCard>
  );
}

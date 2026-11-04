import {
  embroideryMaterialModeLabels,
  embroideryModeLabels,
  embroideryProgramLabels,
  formatEmbroideryDateTime,
  formatEmbroideryMinutes,
  formatEmbroideryMoney,
  formatEmbroideryNumber,
} from '@admin/embroidery/model';
import { Box, Paper, Typography } from '@mui/material';

import type { EmbroiderySavedCalculation } from '@admin/embroidery/model';
import type { ReactNode } from 'react';

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

function Facts({ title, rows }: { title: string; rows: readonly [string, ReactNode][] }) {
  return (
    <Paper variant="outlined" component="section" aria-label={title} sx={{ p: 2 }}>
      <Typography component="h3" variant="subtitle1" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Box
        component="dl"
        sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 2, rowGap: 0.5, m: 0 }}
      >
        {rows.map(([label, value]) => (
          <Box key={label} sx={{ display: 'contents' }}>
            <Typography component="dt" variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography component="dd" variant="body2" sx={{ m: 0, textAlign: 'right' }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

/** What was calculated, by whom, and the rates frozen at saving (Director and Admin). */
export function EmbroiderySavedSummaryView({ saved }: { saved: EmbroiderySavedCalculation }) {
  const { summary, input, rates } = saved;
  const chevron = input.mode === 'Chevron';
  const form: [string, ReactNode][] = [
    ['Клієнт', summary.customerName ?? '—'],
    ['Що вишиваємо', embroideryModeLabels[input.mode]],
    ['Кількість', <span style={mono}>{formatEmbroideryNumber(input.quantity)} шт</span>],
    ['Стежків на 1 шт', <span style={mono}>{formatEmbroideryNumber(input.stitchesPerUnit)}</span>],
    ['П’яльця', summary.hoopLabel],
    ...(chevron
      ? ([['Шевронів за зап’ялювання', formatEmbroideryNumber(input.unitsPerHoop)]] as [
          string,
          ReactNode,
        ][])
      : []),
    [
      'Програма',
      input.program === 'Ready'
        ? embroideryProgramLabels.Ready
        : `${embroideryProgramLabels[input.program]}, ${formatEmbroideryMinutes(input.programMinutes)}`,
    ],
    ['Матеріал', embroideryMaterialModeLabels[input.materialMode]],
    ['Збережено', `${formatEmbroideryDateTime(summary.createdAt)}, ${summary.createdByName}`],
  ];
  return (
    <>
      <Facts title="Розрахунок" rows={form} />
      {rates && (
        <Facts
          title="Ставки на момент збереження"
          rows={[
            ['Вишивка за 1000 стежків', formatEmbroideryMoney(rates.stitchRate)],
            ['Нитки за 1000 стежків', formatEmbroideryMoney(rates.rates.threadRate)],
            ['Зап’ялювання', formatEmbroideryMoney(rates.rates.hoopingRate)],
            ['Програма, година', formatEmbroideryMoney(rates.rates.programHourRate)],
            ['Податок', `${formatEmbroideryNumber(rates.rates.taxPercent)}%`],
            ...rates.markups.map(
              (markup) =>
                [markup.name, `+${formatEmbroideryNumber(markup.percent)}%`] as [string, ReactNode],
            ),
          ]}
        />
      )}
    </>
  );
}

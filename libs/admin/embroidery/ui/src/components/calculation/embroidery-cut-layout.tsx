import { formatEmbroideryMoney, formatEmbroideryNumber } from '@admin/embroidery/model';
import { Box, Paper, Stack, Typography } from '@mui/material';

import type { EmbroideryCut } from '@admin/embroidery/model';

interface Props {
  title: string;
  cut: EmbroideryCut;
}

/** Rows drawn before «⋮ ще N рядів». */
const shownRows = 2;
const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** How the blanks lie across the roll: the first rows, the side waste and the numbers of the cut. */
export function EmbroideryCutLayout({ title, cut }: Props) {
  const facts: [string, string][] = [
    [
      'Заготовка',
      `${formatEmbroideryNumber(cut.blankWidthCm)} × ${formatEmbroideryNumber(cut.blankLengthCm)} см`,
    ],
    ['У ряду', `${cut.across} шт · відхід ${formatEmbroideryNumber(cut.sideWasteCm)} см`],
    ['Рядів', formatEmbroideryNumber(cut.rows)],
    ['Відріз', `${formatEmbroideryNumber(cut.cutMetres)} м`],
    ['Вихід', `${cut.produced}${cut.spare > 0 ? ` · зайвих ${cut.spare}` : ''}`],
  ];
  if (cut.blankCost !== null)
    facts.push(['1 заготовка', `${formatEmbroideryMoney(cut.blankCost)} грн`]);
  const used = (cut.across * cut.blankWidthCm) / cut.rollWidthCm;

  return (
    <Paper variant="outlined" component="section" aria-label={title} sx={{ p: 2 }}>
      <Typography component="h2" variant="h6" sx={{ mb: 1.5 }}>
        {title} · {formatEmbroideryNumber(cut.rollWidthCm)} см
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} sx={{ gap: 2 }}>
        <Box aria-hidden sx={{ flex: 1, minWidth: 0 }}>
          {Array.from({ length: Math.min(shownRows, cut.rows) }, (_, row) => (
            <Box
              key={row}
              sx={{
                display: 'flex',
                gap: 0.5,
                mb: 0.5,
                p: 0.5,
                bgcolor: 'action.hover',
                borderRadius: 1,
              }}
            >
              <Box sx={{ display: 'flex', gap: 0.5, width: `${Math.max(used, 0.05) * 100}%` }}>
                {Array.from({ length: cut.across }, (_, blank) => (
                  <Box
                    key={blank}
                    sx={{
                      flex: 1,
                      height: 28,
                      borderRadius: 0.5,
                      bgcolor: 'primary.light',
                      border: 1,
                      borderColor: 'primary.main',
                    }}
                  />
                ))}
              </Box>
            </Box>
          ))}
          {cut.rows > shownRows && (
            <Typography variant="caption" color="text.secondary">
              ⋮ ще {cut.rows - shownRows} рядів
            </Typography>
          )}
        </Box>
        <Box
          component="dl"
          sx={{
            m: 0,
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            columnGap: 2,
            rowGap: 0.5,
          }}
        >
          {facts.map(([label, value]) => (
            <Box key={label} sx={{ display: 'contents' }}>
              <Typography component="dt" variant="body2" color="text.secondary">
                {label}
              </Typography>
              <Typography component="dd" variant="body2" sx={{ ...mono, m: 0, textAlign: 'right' }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Stack>
    </Paper>
  );
}

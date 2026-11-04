import { quoteTierLabels, quoteTiers } from '@admin/quotes/model';
import { Box, Card, Divider, FormControlLabel, Switch, Typography } from '@mui/material';

import type { QuoteTier, QuoteTierVisibility } from '@admin/quotes/model';

interface Props {
  items: number;
  options: number;
  shownPrices: number;
  tiers: Readonly<Record<QuoteTier, QuoteTierVisibility>>;
  disabled: boolean;
  onTierShown: (tier: QuoteTier, shown: boolean) => void;
}

const Count = ({ label, value }: { label: string; value: number }) => (
  <>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography
      variant="body2"
      sx={{
        fontFamily: 'var(--admin-font-mono)',
        fontVariantNumeric: 'tabular-nums',
        textAlign: 'right',
      }}
    >
      {value}
    </Typography>
  </>
);

/** «Підсумок»: what goes to the client, and which quantity prices the whole КП shows. */
export function QuoteSummaryCard({
  items,
  options,
  shownPrices,
  tiers,
  disabled,
  onTierShown,
}: Props) {
  return (
    <Card variant="outlined" sx={{ p: 2 }} aria-label="Підсумок">
      <Typography variant="overline" color="text.secondary" component="h2">
        Підсумок
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', rowGap: 0.75, mt: 1 }}>
        <Count label="Позицій" value={items} />
        <Count label="Варіантів з цінами" value={options} />
        <Count label="Цін у КП" value={shownPrices} />
      </Box>
      <Divider sx={{ my: 1.75 }} />
      <Typography variant="subtitle2" component="h3" sx={{ fontWeight: 700 }}>
        Показувати ціни
      </Typography>
      <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 0.25, mb: 1 }}>
        Для всіх позицій. Окрему ціну можна сховати в меню рядка.
      </Typography>
      {quoteTiers.map((tier) => (
        <FormControlLabel
          key={tier}
          labelPlacement="start"
          disabled={disabled}
          sx={{ display: 'flex', justifyContent: 'space-between', mx: 0 }}
          label={
            <Typography variant="body2">
              {quoteTierLabels[tier]}
              {tiers[tier] === 'some' && (
                <Typography component="span" variant="caption" color="text.secondary">
                  {' '}
                  · не в усіх
                </Typography>
              )}
            </Typography>
          }
          control={
            <Switch
              checked={tiers[tier] !== 'none'}
              onChange={(event) => onTierShown(tier, event.target.checked)}
              slotProps={{
                input: { role: 'switch', 'aria-label': `Показувати ціни ${quoteTierLabels[tier]}` },
              }}
            />
          }
        />
      ))}
    </Card>
  );
}

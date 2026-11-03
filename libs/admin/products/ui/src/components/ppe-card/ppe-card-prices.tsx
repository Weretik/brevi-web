import { Paper, Stack, Typography } from '@mui/material';

import { SewingCardStatusPill } from '../sewing-card/sewing-card-status-pill';
import { sewingPriceFormat } from '../sewing-pricing/sewing-price-format';

import type { PpePriceTiers } from '@admin/products/model';

export interface PpeCardRule {
  retailMarkup: number;
  wholesaleMarkup: number;
  largeWholesaleMarkup: number;
  priceNote: string | null;
}

interface Props {
  prices: PpePriceTiers | null;
  reasons: readonly string[];
  readyLabel: string;
  rule: PpeCardRule | null;
  insightWholesale: number | null;
  insightRetail: number | null;
}

/** Markups are fractions (0.45 = 45 %), as in «Параметри ціноутворення». */
const percent = (value: number) =>
  `${(value * 100).toLocaleString('uk-UA', { maximumFractionDigits: 2 })} %`;

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
      <Typography component="dt" variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography
        component="dd"
        variant="body2"
        sx={{ m: 0, fontFamily: 'var(--admin-font-mono)' }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

/** Three prices of a PPE product as in «Прайс на сайт» H–J, with the reasons when they are missing. */
export function PpeCardPrices(props: Props) {
  const { prices, rule } = props;
  return (
    <Paper variant="outlined" component="section" aria-label="Ціни" sx={{ p: 2 }}>
      <Stack sx={{ gap: 2 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1 }}
        >
          <Typography variant="h6" component="h2">
            Ціни
          </Typography>
          <SewingCardStatusPill
            label={prices ? props.readyLabel : 'Не розраховано'}
            tone={prices ? 'success' : 'warning'}
          />
        </Stack>
        {prices ? (
          <Stack component="dl" sx={{ m: 0, gap: 1 }}>
            <Row label="Роздріб, від 1 шт." value={sewingPriceFormat(prices.retail)} />
            <Row label="Опт, від 11 шт." value={sewingPriceFormat(prices.wholesale)} />
            <Row label="Великий опт, від 41 шт." value={sewingPriceFormat(prices.largeWholesale)} />
          </Stack>
        ) : (
          <Stack component="ul" sx={{ m: 0, pl: 2.5, gap: 0.5 }}>
            {props.reasons.map((reason) => (
              <Typography key={reason} component="li" variant="body2">
                {reason}
              </Typography>
            ))}
          </Stack>
        )}
        {rule && (
          <Stack component="dl" sx={{ m: 0, gap: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
            <Row label="Націнка роздріб" value={percent(rule.retailMarkup)} />
            <Row label="Націнка опт" value={percent(rule.wholesaleMarkup)} />
            <Row label="Націнка великий опт" value={percent(rule.largeWholesaleMarkup)} />
          </Stack>
        )}
        {rule?.priceNote && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Примітка в прайсі: {rule.priceNote}
          </Typography>
        )}
        {(props.insightWholesale !== null || props.insightRetail !== null) && (
          <Stack component="dl" sx={{ m: 0, gap: 1, pt: 1, borderTop: 1, borderColor: 'divider' }}>
            {props.insightRetail !== null && (
              <Row label="Insight роздріб (XML)" value={sewingPriceFormat(props.insightRetail)} />
            )}
            {props.insightWholesale !== null && (
              <Row label="Insight опт (XML)" value={sewingPriceFormat(props.insightWholesale)} />
            )}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

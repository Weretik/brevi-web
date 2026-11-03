import { Paper, Stack, Typography } from '@mui/material';

import { ppeMarkupPercent } from './ppe-markup-format';
import { PpePriceRow, PpePriceTierRows } from './ppe-price-rows';
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
          <PpePriceTierRows prices={prices} />
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
            <PpePriceRow label="Націнка роздріб" value={ppeMarkupPercent(rule.retailMarkup)} />
            <PpePriceRow label="Націнка опт" value={ppeMarkupPercent(rule.wholesaleMarkup)} />
            <PpePriceRow
              label="Націнка великий опт"
              value={ppeMarkupPercent(rule.largeWholesaleMarkup)}
            />
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
              <PpePriceRow
                label="Insight роздріб (XML)"
                value={sewingPriceFormat(props.insightRetail)}
              />
            )}
            {props.insightWholesale !== null && (
              <PpePriceRow
                label="Insight опт (XML)"
                value={sewingPriceFormat(props.insightWholesale)}
              />
            )}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

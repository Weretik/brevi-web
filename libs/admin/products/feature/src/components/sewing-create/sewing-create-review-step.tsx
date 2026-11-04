import { sewingVariantRows } from '@admin/products/model';
import { Alert, FormControlLabel, Stack, Switch } from '@mui/material';
import { useState } from 'react';

import { SewingCardMetrics } from '../sewing-card/sewing-card-metrics';
import { SewingCardPricingTab } from '../sewing-card/sewing-card-pricing-tab';

import type { SewingModel } from '../../hooks/sewing-model/use-sewing-model';
import type { SewingArticleSummaryRow, SewingCardTotals } from '@admin/products/model';

interface Props {
  productId: number;
  model: SewingModel;
  summary: SewingArticleSummaryRow[];
  totals: SewingCardTotals;
  labourMinutes: number;
  active: boolean;
  saving: boolean;
  message: string | null;
  onActiveChange: (active: boolean) => void;
}

/** Step 5 «Перевірка»: live prices of the fabrics and whether the model goes to the price list. */
export function SewingCreateReviewStep(props: Props) {
  const [articleId, setArticleId] = useState<number | null>(null);
  return (
    <Stack sx={{ gap: 2 }}>
      <SewingCardMetrics totals={props.totals} labourMinutes={props.labourMinutes} />
      <Alert severity="warning">
        Кожна ціна має бути вища за повну собівартість, перевірте назву і тканину.
      </Alert>
      <SewingCardPricingTab
        productId={props.productId}
        variants={sewingVariantRows(props.model.variants, props.summary, props.model.fabrics)}
        articleId={articleId}
        onSelect={setArticleId}
      />
      {props.message && <Alert severity="error">{props.message}</Alert>}
      <FormControlLabel
        control={
          <Switch
            checked={props.active}
            disabled={props.saving}
            onChange={(event) => props.onActiveChange(event.target.checked)}
          />
        }
        label="Активна · показувати в прайсі"
      />
    </Stack>
  );
}

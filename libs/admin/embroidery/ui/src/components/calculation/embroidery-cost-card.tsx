import { formatEmbroideryMoney } from '@admin/embroidery/model';
import { Paper, Stack, Typography } from '@mui/material';

import { embroideryCostShares } from './embroidery-cost-text';

import type { EmbroideryCost } from '@admin/embroidery/model';

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** Director and Admin: the cost per unit and per batch with its shares. */
export function EmbroideryCostCard({ cost }: { cost: EmbroideryCost }) {
  return (
    <Paper variant="outlined" component="section" aria-label="Собівартість" sx={{ p: 2 }}>
      <Typography component="h2" variant="h6" sx={{ mb: 1.5 }}>
        Собівартість
      </Typography>
      <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
        <div>
          <Typography variant="overline" color="text.secondary" component="p">
            1 шт
          </Typography>
          <Typography sx={{ ...mono, fontSize: 22, fontWeight: 600 }}>
            {formatEmbroideryMoney(cost.perUnit)}
          </Typography>
        </div>
        <div>
          <Typography
            variant="overline"
            color="text.secondary"
            component="p"
            sx={{ textAlign: 'right' }}
          >
            Партія
          </Typography>
          <Typography sx={{ ...mono, fontSize: 22, fontWeight: 600, textAlign: 'right' }}>
            {formatEmbroideryMoney(cost.total)}
          </Typography>
        </div>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        {embroideryCostShares(cost.rows, cost.total)}
      </Typography>
    </Paper>
  );
}

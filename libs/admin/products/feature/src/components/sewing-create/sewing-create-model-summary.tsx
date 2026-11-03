import { ProductOverviewDetails } from '@admin/products/ui';
import { Alert, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import type { ProductOverview } from '@admin/products/model';

interface Props {
  productId: number;
  row: ProductOverview | null;
  sectionName: string | null;
  loading: boolean;
}

/** Step 1 of a saved draft: the model fields read-only; they are changed on the card. */
export function SewingCreateModelSummary({ productId, row, sectionName, loading }: Props) {
  if (!row)
    return loading ? (
      <CircularProgress aria-label="Завантаження моделі" />
    ) : (
      <Alert severity="warning">Модель не знайдено.</Alert>
    );
  return (
    <Stack sx={{ gap: 2 }}>
      <Stack
        direction="row"
        sx={{ gap: 1, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Модель уже збережена як чернетка.
        </Typography>
        <Button component={Link} to={`/references/products/${productId}`} size="small">
          Змінити в картці
        </Button>
      </Stack>
      <ProductOverviewDetails row={row} sectionName={sectionName} />
    </Stack>
  );
}

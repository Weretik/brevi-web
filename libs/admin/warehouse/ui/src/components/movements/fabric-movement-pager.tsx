import { FABRIC_MOVEMENTS_PAGE_SIZE } from '@admin/warehouse/model';
import { Button, Stack, Typography } from '@mui/material';

interface Props {
  page: number;
  hasMore: boolean;
  /** Rows of the filter on every page; 0 while the server gives none. */
  total: number;
  /** Rows on this page. */
  shown: number;
  disabled: boolean;
  onPage: (page: number) => void;
}

/** «1–50 із 312» with «Назад» and «Далі», blocked at the edges. */
export function FabricMovementPager({ page, hasMore, total, shown, disabled, onPage }: Props) {
  const first = (page - 1) * FABRIC_MOVEMENTS_PAGE_SIZE + 1;
  const last = first + shown - 1;
  if (page === 1 && !hasMore && shown <= FABRIC_MOVEMENTS_PAGE_SIZE && total <= shown) return null;
  return (
    <Stack
      direction="row"
      sx={{ gap: 1.5, mt: 1.5, alignItems: 'center', justifyContent: 'flex-end' }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        aria-live="polite"
        sx={{ fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' }}
      >
        {shown === 0 ? `Сторінка ${page}` : `${first}–${last}${total > 0 ? ` із ${total}` : ''}`}
      </Typography>
      <Button variant="outlined" disabled={disabled || page <= 1} onClick={() => onPage(page - 1)}>
        Назад
      </Button>
      <Button variant="outlined" disabled={disabled || !hasMore} onClick={() => onPage(page + 1)}>
        Далі
      </Button>
    </Stack>
  );
}

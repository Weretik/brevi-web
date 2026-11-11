import { Button, Stack, Typography } from '@mui/material';

interface Props {
  page: number;
  hasMore: boolean;
  disabled: boolean;
  onPage: (page: number) => void;
}

/** «Назад», the page number and «Далі», blocked at the edges. */
export function FabricMovementPager({ page, hasMore, disabled, onPage }: Props) {
  return (
    <Stack
      direction="row"
      sx={{ gap: 1.5, mt: 2, alignItems: 'center', justifyContent: 'flex-end' }}
    >
      <Button variant="outlined" disabled={disabled || page <= 1} onClick={() => onPage(page - 1)}>
        Назад
      </Button>
      <Typography variant="body2" aria-live="polite">
        Сторінка {page}
      </Typography>
      <Button variant="outlined" disabled={disabled || !hasMore} onClick={() => onPage(page + 1)}>
        Далі
      </Button>
    </Stack>
  );
}

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs, Button, CircularProgress, Link, Stack, Typography } from '@mui/material';

interface Props {
  /** The PPE tab of «Товари»; «Скасувати» and the breadcrumb lead there. */
  listHref: string;
  canSubmit: boolean;
  saving: boolean;
}

/** Header of «Новий ЗІЗ»; «Створити ЗІЗ» submits the surrounding form. */
export function PpeCreateHeader({ listHref, canSubmit, saving }: Props) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{ gap: 2, justifyContent: 'space-between', alignItems: { md: 'flex-end' } }}
    >
      <Stack sx={{ gap: 1, minWidth: 0 }}>
        <Breadcrumbs aria-label="Шлях" separator={<NavigateNextIcon fontSize="small" />}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Довідники
          </Typography>
          <Link href={listHref} variant="body2" underline="hover" sx={{ color: 'primary.dark' }}>
            Товари
          </Link>
          <Typography variant="body2" aria-current="page" sx={{ color: 'text.primary' }}>
            Новий ЗІЗ
          </Typography>
        </Breadcrumbs>
        <Typography variant="h1">Новий ЗІЗ</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Перепродаж: ціна рахується від ціни постачальника і правила націнки
        </Typography>
      </Stack>
      <Stack direction="row" sx={{ gap: 1, flexShrink: 0 }}>
        <Button variant="outlined" href={listHref} disabled={saving}>
          Скасувати
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!canSubmit || saving}
          aria-busy={saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          Створити ЗІЗ
        </Button>
      </Stack>
    </Stack>
  );
}

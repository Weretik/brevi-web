import {
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import type { IntroductionSavedTemplateView } from '@admin/clients/model';

export function IntroductionTemplatesList({
  rows,
  selectedId,
  loading = false,
  onSelect,
  onArchive,
  onReuse,
}: {
  rows: readonly IntroductionSavedTemplateView[];
  selectedId?: string | null;
  loading?: boolean;
  onSelect: (id: string) => void;
  onArchive: (id: string) => void;
  onReuse?: (id: string) => void;
}) {
  return (
    <Stack spacing={2} aria-label="Збережені сезонні добірки">
      {loading && <CircularProgress size={24} aria-label="Завантаження добірок" />}
      {!loading && rows.length === 0 && (
        <Typography color="text.secondary">
          Збережених добірок ще немає. Створіть добірку та збережіть її для повторного використання.
        </Typography>
      )}
      {rows.map((row) => (
        <Card
          key={row.id}
          variant="outlined"
          sx={{ borderColor: selectedId === row.id ? 'primary.main' : undefined }}
        >
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="subtitle1">{row.name}</Typography>
              {row.formatLabel && <Typography color="text.secondary">{row.formatLabel}</Typography>}
              {row.archived && (
                <Chip label="В архіві" size="small" sx={{ alignSelf: 'flex-start' }} />
              )}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button disabled={loading} onClick={() => onSelect(row.id)}>
                  Відкрити
                </Button>
                {onReuse && (
                  <Button disabled={loading || row.archived} onClick={() => onReuse(row.id)}>
                    Використати
                  </Button>
                )}
                <Button disabled={loading} onClick={() => onArchive(row.id)}>
                  {row.archived ? 'Відновити' : 'Архівувати'}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}

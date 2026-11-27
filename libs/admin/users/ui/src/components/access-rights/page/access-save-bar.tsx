import { Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';

interface AccessSaveBarProps {
  roleTitle: string;
  /** Titles of the changed pages, in menu order. */
  changedTitles: readonly string[];
  saving: boolean;
  onShowChanges: () => void;
  onDiscard: () => void;
  onSave: () => void;
}

const changesWord = (count: number): string => {
  const tens = count % 100;
  const ones = count % 10;
  if (tens >= 11 && tens <= 14) return 'змін';
  if (ones === 1) return 'зміна';
  return ones >= 2 && ones <= 4 ? 'зміни' : 'змін';
};

const listTitles = (titles: readonly string[]): string =>
  titles.length <= 3
    ? titles.join(', ')
    : `${titles.slice(0, 3).join(', ')} і ще ${titles.length - 3}`;

/** Sticks to the bottom while a role has unsaved changes: how many, on which pages, and save. */
export function AccessSaveBar({
  changedTitles,
  onDiscard,
  onSave,
  onShowChanges,
  roleTitle,
  saving,
}: AccessSaveBarProps) {
  const count = changedTitles.length;
  return (
    <Paper
      aria-label="Незбережені зміни"
      component="section"
      elevation={3}
      sx={{ bottom: 16, position: 'sticky', px: 2, py: 1.5, zIndex: 2 }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{ alignItems: { md: 'center' }, gap: 1.5, justifyContent: 'space-between' }}
      >
        <Typography variant="body2">
          <strong>
            {count} {changesWord(count)} у ролі «{roleTitle}»
          </strong>
          {count > 0 ? `: ${listTitles(changedTitles)}` : ''}
        </Typography>
        <Stack direction="row" sx={{ flexShrink: 0, flexWrap: 'wrap', gap: 1 }}>
          <Button onClick={onShowChanges} size="small">
            Показати зміни
          </Button>
          <Button disabled={saving} onClick={onDiscard} size="small" variant="outlined">
            Скасувати
          </Button>
          <Button disabled={saving} onClick={onSave} size="small" variant="contained">
            {saving ? <CircularProgress color="inherit" size={16} sx={{ mr: 1 }} /> : null}
            Зберегти
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

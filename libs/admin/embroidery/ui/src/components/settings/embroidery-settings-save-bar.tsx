import { embroiderySettingsSections } from '@admin/embroidery/model';
import { Box, Button, Link, Paper, Stack, Typography } from '@mui/material';

import type { EmbroiderySettingsSectionId } from '@admin/embroidery/model';

interface Props {
  changed: readonly EmbroiderySettingsSectionId[];
  /** Problems by section; shown after the first «Зберегти». */
  errorCounts: Partial<Record<EmbroiderySettingsSectionId, number>>;
  saving: boolean;
  /** Settings never saved can be saved as they are, to confirm the old site's rates. */
  canSaveUnchanged: boolean;
  onGoTo: (id: EmbroiderySettingsSectionId) => void;
  onDiscard: () => void;
  onSave: () => void;
}

const titleOf = (id: EmbroiderySettingsSectionId) =>
  embroiderySettingsSections.find((section) => section.id === id)?.title ?? id;

/** The sticky bottom bar of «Налаштування»: what changed, where the problems are, and the buttons. */
export function EmbroiderySettingsSaveBar({
  changed,
  errorCounts,
  saving,
  canSaveUnchanged,
  onGoTo,
  onDiscard,
  onSave,
}: Props) {
  const problems = embroiderySettingsSections
    .map((section) => section.id)
    .filter((id) => (errorCounts[id] ?? 0) > 0);
  const dirty = changed.length > 0;
  return (
    <Paper
      variant="outlined"
      sx={{
        position: 'sticky',
        bottom: 16,
        mt: 3,
        px: 2,
        py: 1.25,
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        flexWrap: 'wrap',
        zIndex: 2,
        boxShadow: 4,
      }}
    >
      <Box sx={{ mr: 'auto', minWidth: 0 }}>
        {problems.length > 0 ? (
          <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
            Виправте:{' '}
            {problems.map((id, index) => (
              <span key={id}>
                {index > 0 && ', '}
                <Link component="button" type="button" color="inherit" onClick={() => onGoTo(id)}>
                  {titleOf(id)}
                </Link>
              </span>
            ))}
          </Typography>
        ) : dirty ? (
          <Typography variant="body2">
            Змінено: <b>{changed.map(titleOf).join(', ')}</b>
          </Typography>
        ) : canSaveUnchanged ? (
          <Typography variant="body2" color="warning.main">
            Ставки перенесено зі старого сайту. Перевірте їх і натисніть «Зберегти».
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Змін немає
          </Typography>
        )}
      </Box>
      <Stack direction="row" sx={{ gap: 1 }}>
        {dirty && (
          <Button onClick={onDiscard} disabled={saving}>
            Скасувати зміни
          </Button>
        )}
        <Button
          variant="contained"
          onClick={onSave}
          disabled={saving || (!dirty && !canSaveUnchanged)}
        >
          {saving ? 'Зберігаємо…' : 'Зберегти'}
        </Button>
      </Stack>
    </Paper>
  );
}

import { quoteSettingsSections } from '@admin/quotes/model';
import { Box, Button, Link, Paper, Stack, Typography } from '@mui/material';

import { quoteSettingsProblemsLabel } from '../form/quote-settings-layout';

import type { QuoteSettingsSectionId } from '@admin/quotes/model';
import type { ReactNode } from 'react';

interface Props {
  changed: readonly QuoteSettingsSectionId[];
  /** Problems by section; shown after the first «Зберегти». */
  errorCounts: Partial<Record<QuoteSettingsSectionId, number>>;
  saving: boolean;
  /** Settings that were never saved can be saved as they are. */
  canSaveUnchanged: boolean;
  /** «Перегляд» on screens without the preview column. */
  previewButton?: ReactNode;
  onGoTo: (id: QuoteSettingsSectionId) => void;
  onDiscard: () => void;
  onSave: () => void;
}

const titleOf = (id: QuoteSettingsSectionId) =>
  quoteSettingsSections.find((section) => section.id === id)?.title ?? id;

/** The sticky bottom bar: what changed, where the problems are, «Скасувати зміни» and «Зберегти». */
export function QuoteSettingsSaveBar({
  changed,
  errorCounts,
  saving,
  canSaveUnchanged,
  previewButton,
  onGoTo,
  onDiscard,
  onSave,
}: Props) {
  const problems = (Object.keys(errorCounts) as QuoteSettingsSectionId[]).filter(
    (id) => (errorCounts[id] ?? 0) > 0,
  );
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
        boxShadow: '0 -4px 16px rgba(0,0,0,.06)',
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
                  {titleOf(id)} — {quoteSettingsProblemsLabel(errorCounts[id] ?? 0)}
                </Link>
              </span>
            ))}
          </Typography>
        ) : dirty ? (
          <Typography variant="body2">
            Змінено: <b>{changed.map(titleOf).join(', ')}</b>
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Змін немає
          </Typography>
        )}
      </Box>
      <Stack direction="row" sx={{ gap: 1 }}>
        {previewButton}
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

import { useSetEmbroideryMockupMutation } from '@admin/embroidery/data-access';
import { MediaPickerDrawer } from '@admin/media/feature';
import { usePageRights } from '@admin/shared/ui';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { Alert, Box, Button, Link, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import type { EmbroiderySavedSummary } from '@admin/embroidery/model';

interface Props {
  summary: EmbroiderySavedSummary;
}

/** «Макет»: a photo of the design from «Медіа»; the workshop sees it in the order. */
export function EmbroideryMockupSection({ summary }: Props) {
  const [picking, setPicking] = useState(false);
  const [save, saving] = useSetEmbroideryMockupMutation();
  const mockup = summary.mockup;
  const { canEdit } = usePageRights();
  const set = (mediaFileId: number | null) => void save({ id: summary.id, mediaFileId });

  return (
    <Box component="section" aria-label="Макет">
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Макет
      </Typography>
      {saving.isError && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {(saving.error as { message?: string } | undefined)?.message ??
            'Не вдалося змінити макет.'}
        </Alert>
      )}
      <Stack direction="row" sx={{ gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        {mockup ? (
          <Link href={mockup.url} target="_blank" rel="noopener" aria-label="Відкрити макет">
            <Box
              component="img"
              src={mockup.thumbnailUrl ?? mockup.url}
              alt={mockup.fileName}
              sx={{
                display: 'block',
                width: 96,
                height: 96,
                objectFit: 'contain',
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
                bgcolor: 'action.hover',
              }}
            />
          </Link>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Цех побачить макет у завданні, коли ви його оберете.
          </Typography>
        )}
        {canEdit && (
          <Stack direction="row" sx={{ gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddPhotoAlternateOutlinedIcon />}
              disabled={saving.isLoading}
              onClick={() => setPicking(true)}
            >
              {mockup ? 'Змінити макет' : 'Обрати макет'}
            </Button>
            {mockup && (
              <Button
                size="small"
                color="inherit"
                disabled={saving.isLoading}
                onClick={() => set(null)}
              >
                Прибрати
              </Button>
            )}
          </Stack>
        )}
      </Stack>
      {picking && (
        <MediaPickerDrawer
          alreadyAddedIds={mockup ? [mockup.mediaFileId] : []}
          onClose={() => setPicking(false)}
          onPick={(files) => {
            setPicking(false);
            const file = files.find((x) => x.id !== mockup?.mediaFileId) ?? files[0];
            if (file) set(file.id);
          }}
        />
      )}
    </Box>
  );
}

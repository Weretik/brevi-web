import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';

import type { ArticleCoverValue } from '@admin/content/model';

/** The cover of an article: a preview, and «Обрати» or «Змінити» from «Фото» with «Прибрати». */
export function ArticleCoverField({
  cover,
  disabled,
  onPick,
  onClear,
}: {
  cover: ArticleCoverValue | null;
  disabled: boolean;
  onPick: () => void;
  onClear: () => void;
}) {
  return (
    <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
      <Box
        role="img"
        aria-label={cover ? 'Обкладинка статті' : 'Обкладинку не обрано'}
        sx={{
          width: 144,
          height: 96,
          flexShrink: 0,
          borderRadius: 1,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'action.hover',
          backgroundImage: cover?.url ? `url("${cover.url}")` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Stack sx={{ gap: 1, minWidth: 0 }}>
        <Typography variant="body2" color={cover && !cover.url ? 'warning.dark' : 'text.secondary'}>
          {cover && !cover.url
            ? 'Обкладинку видалено з бібліотеки «Фото». Оберіть іншу.'
            : 'Обкладинка: фото статті у списку статей і вгорі сторінки. Береться з бібліотеки «Фото».'}
        </Typography>
        <Stack direction="row" sx={{ gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<AddPhotoAlternateOutlinedIcon />}
            disabled={disabled}
            onClick={onPick}
          >
            {cover ? 'Змінити обкладинку' : 'Обрати обкладинку'}
          </Button>
          {cover && (
            <Button disabled={disabled} onClick={onClear}>
              Прибрати
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

import { Button, Stack, Typography } from '@mui/material';

interface Props {
  scope: 'Model' | 'Article';
  articleSku?: string;
  onSelectModel: () => void;
}

export function CompositionScopeHeader({ scope, articleSku, onSelectModel }: Props) {
  return (
    <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
      <Button variant={scope === 'Model' ? 'contained' : 'outlined'} onClick={onSelectModel}>
        Спільний склад моделі
      </Button>
      {scope === 'Article' && articleSku && (
        <Typography component="p" sx={{ alignSelf: 'center' }}>
          Редагується артикул {articleSku}
        </Typography>
      )}
    </Stack>
  );
}

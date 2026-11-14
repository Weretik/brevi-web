import { Box, ButtonBase, Tooltip } from '@mui/material';

interface Props {
  photoUrl: string | null;
  label: string;
  /** «Змінити фото»; without it the photo is only shown. */
  onChange?: () => void;
}

/** About 2.5 times the old 56 px thumbnail, so the model is clearly seen while the КП is made. */
const frame = {
  width: { xs: 96, sm: 140 },
  height: { xs: 96, sm: 140 },
  borderRadius: 1,
  flexShrink: 0,
  border: 1,
  borderColor: 'divider',
  bgcolor: 'action.hover',
  overflow: 'hidden',
} as const;

/** The item photo in the КП; a click opens «Змінити фото» when the item has a Catalog product. */
export function QuoteItemPhoto({ photoUrl, label, onChange }: Props) {
  const image = photoUrl ? (
    <Box
      component="img"
      src={photoUrl}
      alt=""
      sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
    />
  ) : null;
  if (!onChange) return <Box sx={frame}>{image}</Box>;
  return (
    <Tooltip title="Змінити фото">
      <ButtonBase
        aria-label={`Змінити фото: ${label}`}
        onClick={onChange}
        sx={{ ...frame, '&:hover, &.Mui-focusVisible': { borderColor: 'primary.main' } }}
      >
        {image}
      </ButtonBase>
    </Tooltip>
  );
}

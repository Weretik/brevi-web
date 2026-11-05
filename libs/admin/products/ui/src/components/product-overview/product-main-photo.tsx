import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { Box, Typography } from '@mui/material';

interface Props {
  url: string | null;
  name: string;
}

/** The main photo in the quick view (CAT-019): the whole photo, full height, never cut to a square. */
export function ProductMainPhoto({ url, name }: Props) {
  return (
    <Box
      sx={{
        height: 280,
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'action.hover',
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
      }}
    >
      {url ? (
        <Box
          component="img"
          src={url}
          alt={`Головне фото: ${name}`}
          sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      ) : (
        <Box sx={{ display: 'grid', placeItems: 'center', gap: 0.5, color: 'text.disabled' }}>
          <ImageOutlinedIcon />
          <Typography variant="caption">
            Без фото. Додайте його в картці на вкладці «Фото».
          </Typography>
        </Box>
      )}
    </Box>
  );
}

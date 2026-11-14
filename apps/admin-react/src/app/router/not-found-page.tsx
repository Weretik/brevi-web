import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Box>
      <Typography component="h1" gutterBottom variant="h4">
        Сторінку не знайдено
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Перевірте адресу або поверніться на початок.
      </Typography>
      <Button component={Link} to="/" variant="contained">
        На початок
      </Button>
    </Box>
  );
}

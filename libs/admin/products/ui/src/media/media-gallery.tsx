import BrokenImageOutlined from '@mui/icons-material/BrokenImageOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import type { ProductMedia } from '@admin/products/model';

interface MediaGalleryProps {
  items: readonly ProductMedia[];
  loading: boolean;
  emptyMessage: string;
  onDelete: (item: ProductMedia) => void;
}

function MediaPreview({ item }: { item: ProductMedia }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <Stack
        sx={{
          aspectRatio: '4 / 3',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'action.hover',
        }}
      >
        <BrokenImageOutlined aria-hidden="true" />
        <Typography variant="body2">Прев’ю недоступне</Typography>
      </Stack>
    );
  }
  return (
    <Box
      component="img"
      src={item.publicUrl}
      alt={item.originalFileName}
      onError={() => setFailed(true)}
      sx={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'contain', bgcolor: 'action.hover' }}
    />
  );
}

export function MediaGallery({ items, loading, emptyMessage, onDelete }: MediaGalleryProps) {
  if (!loading && items.length === 0) {
    return <Typography sx={{ py: 6, textAlign: 'center' }}>{emptyMessage}</Typography>;
  }

  return (
    <Box
      component="ul"
      aria-label="Галерея фото"
      aria-busy={loading}
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
        gap: 2,
        listStyle: 'none',
        m: 0,
        p: 0,
      }}
    >
      {items.map((item) => (
        <Card component="li" key={item.id} variant="outlined" sx={{ minWidth: 0 }}>
          <MediaPreview item={item} />
          <CardContent>
            <Typography title={item.originalFileName} noWrap>
              {item.originalFileName}
            </Typography>
            <Chip
              size="small"
              color={item.status === 'Ready' ? 'success' : 'default'}
              label={item.status === 'Ready' ? 'Готове' : 'Обробляється'}
              sx={{ mt: 1 }}
            />
          </CardContent>
          <CardActions>
            <Button
              color="error"
              startIcon={<DeleteOutlined />}
              aria-label={`Видалити ${item.originalFileName}`}
              onClick={() => onDelete(item)}
            >
              Видалити
            </Button>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
}

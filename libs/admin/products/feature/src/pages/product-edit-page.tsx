import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

import { ProductEditor } from '../components/product-editor';
import { useProduct } from '../hooks/use-product';
import { draftFromDetail } from '../model/product-draft';

export function ProductEditPage() {
  const { id: idText } = useParams();
  const id = Number(idText);
  const { product, loading, error, notFound, reload } = useProduct(id);
  if (!Number.isInteger(id) || id < 1 || notFound)
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Товар не знайдено.</Alert>
        <Button component={Link} to="/references/products">
          До товарів
        </Button>
      </Box>
    );
  if (loading)
    return (
      <Box sx={{ p: 3 }}>
        <CircularProgress aria-label="Завантаження товару" />
      </Box>
    );
  if (error)
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" action={<Button onClick={reload}>Повторити</Button>}>
          {error}
        </Alert>
      </Box>
    );
  if (!product) return null;
  try {
    return (
      <ProductEditor key={product.id} initial={draftFromDetail(product)} productId={product.id} />
    );
  } catch (cause) {
    return (
      <Alert severity="error">
        {cause instanceof Error ? cause.message : 'Неповні дані товару.'}
      </Alert>
    );
  }
}

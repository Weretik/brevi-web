import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { Link, useLocation, useNavigate, useNavigationType, useParams } from 'react-router-dom';

import { PpeProductCard } from '../../components/ppe-card/ppe-product-card';
import { SewingProductCard } from '../../components/sewing-card/sewing-product-card';
import { useProduct } from '../../hooks/product-detail/use-product';

import type { ProductDetail } from '@admin/products/model';

/** Product card page: the sewing model card (CAT-007) or the PPE card (CAT-008). */
export function ProductDetailPage() {
  const { id: idText } = useParams();
  const id = Number(idText);
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const responseProduct = (location.state as { product?: ProductDetail } | null)?.product;
  const initial =
    navigationType !== 'POP' && responseProduct?.id === id ? responseProduct : undefined;
  const { product, loading, error, notFound, reload } = useProduct(id, initial);
  if (!Number.isInteger(id) || id < 1)
    return (
      <Alert
        severity="warning"
        action={
          <Button component={Link} to="/references/products">
            До товарів
          </Button>
        }
      >
        Товар не знайдено.
      </Alert>
    );

  const ready = product && !loading && !notFound && !error;
  const onDeleted = () => navigate('/references/products');
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1440 }}>
      <Button component={Link} to="/references/products">
        ← До товарів
      </Button>
      {loading && <CircularProgress aria-label="Завантаження товару" />}
      {notFound && <Alert severity="warning">Товар не знайдено.</Alert>}
      {error && (
        <Alert severity="error" action={<Button onClick={reload}>Повторити</Button>}>
          {error}
        </Alert>
      )}
      {ready && (
        <Box sx={{ mt: 2 }}>
          {product.type === 'Sewing' ? (
            <SewingProductCard product={product} onDeleted={onDeleted} />
          ) : (
            <PpeProductCard product={product} onDeleted={onDeleted} />
          )}
        </Box>
      )}
    </Box>
  );
}

export default ProductDetailPage;

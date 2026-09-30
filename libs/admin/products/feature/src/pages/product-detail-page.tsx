import { Alert, Box, Button, CircularProgress, Divider, Stack } from '@mui/material';
import { useState } from 'react';
import { Link, useLocation, useNavigate, useNavigationType, useParams } from 'react-router-dom';

import { PpeProductDetail } from '../components/ppe-product-detail';
import { ProductDeleteDialog } from '../components/product-delete-dialog';
import { ProductDetailContent } from '../components/product-detail-content';
import { ProductDetailGallery } from '../components/product-detail-gallery';
import { ProductDetailHeader } from '../components/product-detail-header';
import { SewingProductDetail } from '../components/sewing-product-detail';
import { useProduct } from '../hooks/use-product';

import type { ProductDetail } from '@admin/products/data-access';

export function ProductDetailPage() {
  const { id: idText } = useParams();
  const id = Number(idText);
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const responseProduct = (location.state as { product?: ProductDetail } | null)?.product;
  const initial =
    navigationType !== 'POP' && responseProduct?.id === id ? responseProduct : undefined;
  const [confirmDelete, setConfirmDelete] = useState(false);
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

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1080 }}>
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
      {product && !loading && !notFound && !error && (
        <>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            sx={{ justifyContent: 'space-between', gap: 2, my: 2 }}
          >
            <ProductDetailHeader product={product} />
            <Stack direction="row" sx={{ gap: 1, alignSelf: 'flex-start' }}>
              <Button component={Link} to={`/references/products/${id}/edit`} variant="contained">
                Редагувати
              </Button>
              <Button color="error" onClick={() => setConfirmDelete(true)}>
                Видалити
              </Button>
            </Stack>
          </Stack>
          <ProductDetailGallery photos={product.photos} />
          <Divider sx={{ my: 2 }} />
          <ProductDetailContent product={product} />
          {product.type === 'Sewing' && product.sewing && (
            <SewingProductDetail sewing={product.sewing} />
          )}
          {product.type === 'Ppe' && product.ppe && <PpeProductDetail ppe={product.ppe} />}
        </>
      )}
      <ProductDeleteDialog
        id={confirmDelete ? id : null}
        name={product?.name ?? ''}
        onClose={() => setConfirmDelete(false)}
        onDeleted={() => navigate('/references/products')}
      />
    </Box>
  );
}

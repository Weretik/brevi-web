import {
  PpeProductDetail,
  ProductDetailContent,
  ProductDetailGallery,
  ProductDetailHeader,
  ProductDetailSection,
  SewingProductDetail,
} from '@admin/products/ui';
import { Alert, Box, Button, CircularProgress, Stack } from '@mui/material';
import { useState } from 'react';
import { Link, useLocation, useNavigate, useNavigationType, useParams } from 'react-router-dom';

import { ProductDeleteDialog } from '../../components/product-deletion/product-delete-dialog';
import { useProduct } from '../../hooks/product-detail/use-product';

import type { ProductDetail } from '@admin/products/model';

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
          <Stack sx={{ gap: 2, my: 2 }}>
            <ProductDetailSection label="Основні дані">
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                sx={{ justifyContent: 'space-between', gap: 2 }}
              >
                <ProductDetailHeader product={product} />
                <Stack direction="row" sx={{ gap: 1, alignSelf: 'flex-start' }}>
                  <Button
                    component={Link}
                    to={`/references/products/${id}/edit`}
                    variant="contained"
                  >
                    Редагувати
                  </Button>
                  <Button color="error" onClick={() => setConfirmDelete(true)}>
                    Видалити
                  </Button>
                </Stack>
              </Stack>
            </ProductDetailSection>
            <ProductDetailGallery photos={product.photos} />
            <ProductDetailContent product={product} />
            {product.type === 'Sewing' && product.sewing && (
              <SewingProductDetail sewing={product.sewing} />
            )}
            {product.type === 'Ppe' && product.ppe && <PpeProductDetail ppe={product.ppe} />}
          </Stack>
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

export default ProductDetailPage;

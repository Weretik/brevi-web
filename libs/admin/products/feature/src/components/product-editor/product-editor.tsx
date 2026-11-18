import { ProductTypeChangeDialog } from '@admin/products/ui';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { ProductEditorForm } from './product-editor-form';
import { ProductEditorNotices } from './product-editor-notices';
import { useProductForm } from '../../hooks/product-editor/use-product-form';
import { useProductLookups } from '../../hooks/product-editor/use-product-lookups';

import type { ProductDraft } from '@admin/products/model';

interface Props {
  initial?: ProductDraft;
  productId?: number;
  legacyNormsLocked?: boolean;
  legacyNormsLoading?: boolean;
  legacyNormsMessage?: string;
  legacyNormsError?: string | null;
  onRetryLegacyNorms?: () => void;
}

export function ProductEditor({
  initial,
  productId,
  legacyNormsLocked = false,
  legacyNormsLoading = false,
  legacyNormsMessage,
  legacyNormsError,
  onRetryLegacyNorms,
}: Props) {
  const form = useProductForm({ initial, productId });
  const {
    lookups,
    error: lookupError,
    loading: lookupsLoading,
    reload: reloadLookups,
  } = useProductLookups();

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200 }}>
      <Button
        component={Link}
        to={productId ? `/references/products/${productId}` : '/references/products'}
      >
        ← Назад
      </Button>
      <Typography variant="h4" component="h1" sx={{ my: 2 }}>
        {productId ? 'Редагування товару' : 'Новий товар'}
      </Typography>
      <ProductEditorNotices
        form={form}
        lookups={lookups}
        lookupError={lookupError}
        lookupsLoading={lookupsLoading}
        reloadLookups={reloadLookups}
        legacy={{
          locked: legacyNormsLocked,
          loading: legacyNormsLoading,
          message: legacyNormsMessage,
          error: legacyNormsError,
          onRetry: onRetryLegacyNorms,
        }}
        productId={productId}
      />
      {lookupsLoading && <CircularProgress aria-label="Завантаження довідників" />}
      {!lookupsLoading && (
        <ProductEditorForm
          form={form}
          lookups={lookups}
          lookupError={lookupError}
          productId={productId}
          legacyNormsLocked={legacyNormsLocked}
        />
      )}
      <ProductTypeChangeDialog
        open={form.pendingType !== null}
        onCancel={form.cancelType}
        onConfirm={form.confirmType}
      />
    </Box>
  );
}

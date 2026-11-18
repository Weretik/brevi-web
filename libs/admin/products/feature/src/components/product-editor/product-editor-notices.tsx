import { Alert, Button } from '@mui/material';
import { Link } from 'react-router-dom';

import { LegacySewingNormLockNotice } from './legacy-sewing-norm-lock-notice';

import type { useProductForm } from '../../hooks/product-editor/use-product-form';
import type { useProductLookups } from '../../hooks/product-editor/use-product-lookups';

interface Props {
  form: ReturnType<typeof useProductForm>;
  lookups: ReturnType<typeof useProductLookups>['lookups'];
  lookupError: string | null | undefined;
  lookupsLoading: boolean;
  reloadLookups: () => void;
  legacy: {
    locked: boolean;
    loading: boolean;
    message?: string;
    error?: string | null;
    onRetry?: () => void;
  };
  productId?: number;
}

/** Above the product form: lookup and save errors, the old-norms lock and empty reference lists. */
export function ProductEditorNotices({
  form,
  lookups,
  lookupError,
  lookupsLoading,
  reloadLookups,
  legacy,
  productId,
}: Props) {
  return (
    <>
      {lookupError && (
        <Alert
          severity="error"
          action={<Button onClick={reloadLookups}>Повторити</Button>}
          sx={{ mb: 2 }}
        >
          {lookupError}
        </Alert>
      )}
      <LegacySewingNormLockNotice
        locked={legacy.locked}
        loading={legacy.loading}
        message={legacy.message}
        error={legacy.error}
        productId={productId}
        onRetry={legacy.onRetry}
      />
      {form.message && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {form.message}
          {form.message === 'Товар не знайдено.' && (
            <Button component={Link} to="/references/products">
              До товарів
            </Button>
          )}
        </Alert>
      )}
      {!lookupsLoading && !lookupError && lookups.categories.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Категорій поки немає.
        </Alert>
      )}
      {!lookupsLoading &&
        !lookupError &&
        form.draft.type === 'Sewing' &&
        lookups.fabrics.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Тканин поки немає.
          </Alert>
        )}
      {!lookupsLoading &&
        !lookupError &&
        form.draft.type === 'Ppe' &&
        lookups.suppliers.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Постачальників поки немає.
          </Alert>
        )}
    </>
  );
}

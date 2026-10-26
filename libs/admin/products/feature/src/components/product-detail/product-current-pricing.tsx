import { ProductDetailSection } from '@admin/products/ui';
import { Alert, Button } from '@mui/material';

import { PpePricingFeature } from '../ppe-pricing/ppe-pricing-feature';

import type { ProductDetail } from '@admin/products/model';

interface Props {
  product: ProductDetail;
  error: string | null;
  onRetry: () => void;
}

export function ProductCurrentPricing({ product, error, onRetry }: Props) {
  return (
    <>
      {error && (
        <Alert
          severity="error"
          action={<Button onClick={onRetry}>Повторити завантаження цін</Button>}
        >
          {error}
        </Alert>
      )}
      {product.type === 'Ppe' && (
        <ProductDetailSection label="Розрахунок цін ЗІЗ">
          <PpePricingFeature
            key={product.id}
            productId={product.id}
            initialSupplierCost={product.ppe?.basePrice}
          />
        </ProductDetailSection>
      )}
    </>
  );
}

import { ProductFormSection, ProductTypeFields } from '@admin/products/ui';
import { Box } from '@mui/material';

import type { useProductForm } from '../../hooks/product-editor/use-product-form';
import type { useProductLookups } from '../../hooks/product-editor/use-product-lookups';

interface Props {
  form: ReturnType<typeof useProductForm>;
  lookups: ReturnType<typeof useProductLookups>['lookups'];
  existingProduct: boolean;
  /** Old-format sewing norms: the fields are shown but locked. */
  locked: boolean;
}

/** «Швейний товар» or «Засіб індивідуального захисту». */
export function ProductTypeSection({ form, lookups, existingProduct, locked }: Props) {
  const { draft, setDraft, errors } = form;
  return (
    <ProductFormSection
      label={draft.type === 'Sewing' ? 'Швейний товар' : 'Засіб індивідуального захисту'}
    >
      {draft.type === 'Sewing' && locked ? (
        <Box component="fieldset" disabled sx={{ border: 0, m: 0, p: 0, minWidth: 0 }}>
          <Box
            component="legend"
            sx={{
              position: 'absolute',
              width: 1,
              height: 1,
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
            }}
          >
            Швейні норми старого формату
          </Box>
          <ProductTypeFields
            existingProduct={existingProduct}
            draft={draft}
            setDraft={setDraft}
            errors={errors}
            lookups={lookups}
          />
        </Box>
      ) : (
        <ProductTypeFields
          existingProduct={existingProduct}
          draft={draft}
          setDraft={setDraft}
          errors={errors}
          lookups={lookups}
        />
      )}
    </ProductFormSection>
  );
}

import { PpeProductFields } from '../ppe/ppe-product-fields';
import { SewingProductFields } from '../sewing/sewing-product-fields';

import type { ProductLookups } from './product-lookups';
import type { ProductDraft } from '@admin/products/model';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  draft: ProductDraft;
  setDraft: Dispatch<SetStateAction<ProductDraft>>;
  errors: Record<string, string>;
  lookups: ProductLookups;
}

export function ProductTypeFields(props: Props) {
  return props.draft.type === 'Sewing' ? (
    <SewingProductFields {...props} />
  ) : (
    <PpeProductFields {...props} />
  );
}

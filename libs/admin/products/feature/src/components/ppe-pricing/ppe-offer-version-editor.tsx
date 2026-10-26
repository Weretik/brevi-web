import { PpeOfferForm } from '@admin/products/ui';
import { useState } from 'react';

import type { PpeOfferValues, PpeOfferVersion } from '@admin/products/model';

export function PpeOfferVersionEditor({
  version,
  initialSupplierCost,
  disabled,
  onSave,
}: {
  version: PpeOfferVersion | null;
  initialSupplierCost?: number;
  disabled: boolean;
  onSave: (expected: string | null, values: PpeOfferValues) => void;
}) {
  const [value, setValue] = useState<PpeOfferValues>(
    version?.values ?? {
      ruleCode: null,
      supplierCost: initialSupplierCost && initialSupplierCost > 0 ? initialSupplierCost : null,
      externalRetail: null,
      externalWholesale: null,
      source: initialSupplierCost ? 'Product onboarding metadata' : 'Admin entry',
      sourceDate: new Date().toISOString(),
      sourceReviewed: false,
    },
  );
  return (
    <PpeOfferForm
      value={value}
      onChange={(next) =>
        setValue({
          ...next,
          source: 'Admin revision',
          sourceDate: new Date().toISOString(),
          sourceReviewed: false,
        })
      }
      disabled={disabled}
      onSave={() =>
        onSave(version?.id ?? null, { ...value, ruleCode: value.ruleCode?.trim() || null })
      }
    />
  );
}

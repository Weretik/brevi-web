import { listProductCategories, listProductMedia } from '@admin/products/data-access';
import {
  listAdditionalReferences,
  listFabrics,
  listGarmentAccessories,
  listGarmentPartOperations,
  listSuppliers,
} from '@admin/references/data-access';
import { useEffect, useState } from 'react';

import type { ProductCategory, ProductMedia } from '@admin/products/data-access';
import type {
  AdditionalReference,
  Fabric,
  GarmentAccessory,
  GarmentPartOperation,
  Supplier,
} from '@admin/references/data-access';

export interface ProductLookups {
  categories: ProductCategory[];
  media: ProductMedia[];
  fabrics: Fabric[];
  accessories: GarmentAccessory[];
  operations: GarmentPartOperation[];
  suppliers: Supplier[];
  references: AdditionalReference[];
}

const empty: ProductLookups = {
  categories: [],
  media: [],
  fabrics: [],
  accessories: [],
  operations: [],
  suppliers: [],
  references: [],
};

async function optionalLookup<T>(request: Promise<T[]>): Promise<T[]> {
  try {
    return await request;
  } catch (cause) {
    if (cause && typeof cause === 'object' && 'status' in cause && cause.status === 404) return [];
    throw cause;
  }
}

export function useProductLookups() {
  const [lookups, setLookups] = useState<ProductLookups>(empty);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    Promise.all([
      optionalLookup(listProductCategories(controller.signal)),
      optionalLookup(listProductMedia(controller.signal)),
      optionalLookup(listFabrics(controller.signal)),
      optionalLookup(listGarmentAccessories(controller.signal)),
      optionalLookup(listGarmentPartOperations(controller.signal)),
      optionalLookup(listSuppliers(controller.signal)),
      optionalLookup(listAdditionalReferences(controller.signal)),
    ])
      .then(([categories, media, fabrics, accessories, operations, suppliers, references]) => {
        if (!controller.signal.aborted)
          setLookups({
            categories,
            media,
            fabrics,
            accessories,
            operations,
            suppliers,
            references,
          });
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted)
          setError(cause instanceof Error ? cause.message : 'Не вдалося завантажити довідники.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [revision]);
  return {
    lookups,
    error,
    loading,
    reload: () => {
      setError(null);
      setRevision((value) => value + 1);
    },
    setLookups,
  };
}

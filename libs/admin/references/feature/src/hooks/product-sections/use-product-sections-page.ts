import { useDeleteProductSectionMutation } from '@admin/references/data-access';
import { filterProductSections } from '@admin/references/model';
import { useMemo, useState } from 'react';

import { useProductSections } from './use-product-sections';
import { useReferenceDeletion } from '../reference-lists/use-reference-deletion';

import type {
  PricingEditorMode,
  ProductSection,
  ProductSectionTypeFilter,
} from '@admin/references/model';

/** «Розділи товарів»: the sections with the search and type chip, the side panel, the message and deletion. */
export function useProductSectionsPage() {
  const { rows, loading, error, reload } = useProductSections();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<ProductSectionTypeFilter>(null);
  const [active, setActive] = useState<{
    mode: PricingEditorMode;
    section: ProductSection | null;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [deleteSection] = useDeleteProductSectionMutation();
  const deletion = useReferenceDeletion((id) => deleteSection(id).unwrap(), setActionMessage);
  const filteredRows = useMemo(
    () => filterProductSections(rows, search, type),
    [rows, search, type],
  );
  return {
    rows,
    loading,
    error,
    reload,
    search,
    setSearch,
    type,
    setType,
    active,
    setActive,
    actionMessage,
    setActionMessage,
    deletion,
    filteredRows,
  };
}

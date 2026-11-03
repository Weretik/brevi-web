import { useDeleteProductSectionMutation } from '@admin/references/data-access';
import { countProductSectionsByType, filterProductSections } from '@admin/references/model';
import {
  ProductSectionDeleteDialog,
  ProductSectionsGrid,
  ProductSectionTypeChips,
  ReferenceBulkDeleteButton,
  ReferenceFilterRow,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
} from '@admin/references/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, Paper } from '@mui/material';
import { useMemo, useState } from 'react';

import { ProductSectionDrawer } from '../../components/product-sections/product-section-drawer';
import { nextSortOrder } from '../../hooks/pricing-parameters/use-pricing-lists';
import { useProductSections } from '../../hooks/product-sections/use-product-sections';
import { useReferenceDeletion } from '../../hooks/reference-lists/use-reference-deletion';

import type {
  PricingEditorMode,
  ProductSection,
  ProductSectionTypeFilter,
} from '@admin/references/model';

/** «Типи і розділи»: product sections of the Calculator sheet, sewing and PPE. */
export function ProductSectionsPage() {
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

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Типи і розділи"
        subtitle="Розділи швейної продукції та ЗІЗ. Згодом із них будуть категорії на сайті"
        actions={
          <>
            <ReferenceBulkDeleteButton
              selectedCount={deletion.selectedIds.length}
              disabled={deletion.deleting || loading}
              onDelete={() => deletion.requestDelete(deletion.selectedIds)}
            />
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              disabled={loading || Boolean(error)}
              onClick={() => setActive({ mode: 'create', section: null })}
            >
              Додати розділ
            </Button>
          </>
        }
      />
      <ReferenceListAlerts
        error={error}
        loading={loading}
        onRetry={() => void reload()}
        actionMessage={actionMessage}
        onCloseActionMessage={() => setActionMessage(null)}
      />
      <ReferenceSearchBar
        placeholder="Знайти розділ за назвою або коментарем"
        label="Пошук розділів"
        value={search}
        onChange={setSearch}
      />
      <ReferenceFilterRow
        filters={
          <ProductSectionTypeChips
            counts={countProductSectionsByType(rows)}
            total={rows.length}
            value={type}
            onChange={setType}
          />
        }
        count={filteredRows.length}
        total={rows.length}
        countLabel="Кількість розділів"
        selectedCount={deletion.selectedIds.length}
        onClearSelection={deletion.clearSelection}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <ProductSectionsGrid
          rows={filteredRows}
          loading={loading}
          searching={rows.length > 0}
          unavailable={Boolean(error)}
          selection={deletion.selection}
          onSelectionChange={deletion.setSelection}
          onView={(section) => setActive({ mode: 'view', section })}
          onEdit={(section) => setActive({ mode: 'edit', section })}
          onDelete={(id) => deletion.requestDelete([id])}
        />
      </Paper>
      {active && (
        <ProductSectionDrawer
          key={`${active.mode}-${active.section?.id ?? 'new'}`}
          mode={active.mode}
          section={active.section}
          newType={type ?? 'Sewing'}
          newSortOrder={nextSortOrder(rows)}
          onClose={() => setActive(null)}
          onSaved={() => {
            setActive(null);
            setActionMessage('Розділ збережено.');
          }}
        />
      )}
      <ProductSectionDeleteDialog
        ids={deletion.pendingDeleteIds}
        deleting={deletion.deleting}
        onClose={deletion.cancelDelete}
        onConfirm={() => void deletion.confirmDelete()}
      />
    </Box>
  );
}

export default ProductSectionsPage;

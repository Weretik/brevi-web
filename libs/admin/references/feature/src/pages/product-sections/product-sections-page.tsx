import { countProductSectionsByType } from '@admin/references/model';
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
import { usePageRights } from '@admin/shared/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, Paper } from '@mui/material';

import { ProductSectionDrawer } from '../../components/product-sections/product-section-drawer';
import { nextSortOrder } from '../../hooks/pricing-parameters/use-pricing-lists';
import { useProductSectionsPage } from '../../hooks/product-sections/use-product-sections-page';

/** «Типи і розділи»: product sections of the Calculator sheet, sewing and PPE. */
export function ProductSectionsPage() {
  const { canCreate } = usePageRights();
  const {
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
  } = useProductSectionsPage();
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
            {canCreate && (
              <Button
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                disabled={loading || Boolean(error)}
                onClick={() => setActive({ mode: 'create', section: null })}
              >
                Додати розділ
              </Button>
            )}
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

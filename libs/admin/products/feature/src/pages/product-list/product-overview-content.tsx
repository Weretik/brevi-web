import { useDeleteProductMutation } from '@admin/products/data-access';
import { countProductsBySection, filterProductOverview } from '@admin/products/model';
import {
  ProductOverviewDeleteDialog,
  ProductOverviewGrid,
  ProductOverviewSectionChips,
} from '@admin/products/ui';
import { useReferenceDeletion } from '@admin/references/feature';
import {
  ReferenceBulkDeleteButton,
  ReferenceFilterRow,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
} from '@admin/references/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, Paper } from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { ProductOverviewDrawer } from '../../components/product-overview/product-overview-drawer';
import { useProductOverview } from '../../hooks/product-overview/use-product-overview';

import type { ProductOverviewEditorMode } from '../../hooks/product-overview/use-product-overview-editor';
import type {
  ProductOverview,
  ProductOverviewType,
  ProductSectionFilter,
} from '@admin/products/model';
import type { ReactNode } from 'react';

interface Props {
  type: ProductOverviewType;
  tabs: ReactNode;
}

/** One «Товари» tab: sewing models (sheet «Товари») or PPE (sheet «ЗІЗ»). */
export function ProductOverviewContent({ type, tabs }: Props) {
  const { rows, sections, sectionNames, loading, error, reload } = useProductOverview(type);
  const [search, setSearch] = useState('');
  const [section, setSection] = useState<ProductSectionFilter>(null);
  const [active, setActive] = useState<{
    mode: ProductOverviewEditorMode;
    row: ProductOverview;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [deleteProduct] = useDeleteProductMutation();
  const deletion = useReferenceDeletion((id) => deleteProduct(id).unwrap(), setActionMessage);
  const filteredRows = useMemo(
    () => filterProductOverview(rows, search, section),
    [rows, search, section],
  );
  const counts = useMemo(
    () =>
      countProductsBySection(
        rows,
        sections.map((item) => item.id),
      ),
    [rows, sections],
  );
  const sewing = type === 'Sewing';

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Товари"
        subtitle="Швейна продукція — одна модель в рядку, ЗІЗ — один артикул сайту. Тексти і фото сайту згодом будуть у «Контенті сайту»"
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
              component={RouterLink}
              to="/references/products/create"
            >
              Додати товар
            </Button>
          </>
        }
      />
      {tabs}
      <ReferenceListAlerts
        error={error}
        loading={loading}
        onRetry={reload}
        actionMessage={actionMessage}
        onCloseActionMessage={() => setActionMessage(null)}
      />
      <ReferenceSearchBar
        placeholder={
          sewing
            ? 'Знайти модель за ID, назвою або описом'
            : 'Знайти ЗІЗ за артикулом, назвою або описом'
        }
        label="Пошук товарів"
        value={search}
        onChange={setSearch}
      />
      <ReferenceFilterRow
        filters={
          <ProductOverviewSectionChips
            counts={counts}
            sectionNames={sectionNames}
            total={rows.length}
            value={section}
            onChange={setSection}
          />
        }
        count={filteredRows.length}
        total={rows.length}
        countLabel="Кількість товарів"
        selectedCount={deletion.selectedIds.length}
        onClearSelection={deletion.clearSelection}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <ProductOverviewGrid
          type={type}
          rows={filteredRows}
          sectionNames={sectionNames}
          loading={loading}
          searching={rows.length > 0}
          unavailable={Boolean(error)}
          selection={deletion.selection}
          onSelectionChange={deletion.setSelection}
          onView={(row) => setActive({ mode: 'view', row })}
          onEdit={(row) => setActive({ mode: 'edit', row })}
          onDelete={(id) => deletion.requestDelete([id])}
        />
      </Paper>
      {active && (
        <ProductOverviewDrawer
          key={`${active.mode}-${active.row.id}`}
          mode={active.mode}
          row={active.row}
          sections={sections}
          sectionNames={sectionNames}
          onClose={() => setActive(null)}
          onSaved={() => {
            setActive(null);
            setActionMessage('Товар збережено.');
          }}
        />
      )}
      <ProductOverviewDeleteDialog
        ids={deletion.pendingDeleteIds}
        deleting={deletion.deleting}
        onClose={deletion.cancelDelete}
        onConfirm={() => void deletion.confirmDelete()}
      />
    </Box>
  );
}

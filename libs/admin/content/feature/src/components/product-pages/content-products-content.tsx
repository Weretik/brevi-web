import { useGetSiteCategoriesQuery } from '@admin/content/data-access';
import { ContentProductsTable, OldSiteImportDialog } from '@admin/content/ui';
import { ReferenceListAlerts, ReferencePageHeader, ReferenceSearchBar } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Alert, Box, Button, Paper } from '@mui/material';
import { useState } from 'react';

import { ContentProductDrawer } from './content-product-drawer';
import { ContentProductFilters } from './content-product-filters';
import { useContentProductList } from '../../hooks/product-pages/use-content-product-list';
import { useContentProductVisibility } from '../../hooks/product-pages/use-content-product-visibility';
import { useOldSiteImport } from '../../hooks/product-pages/use-old-site-import';

import type { ContentProductRow, ContentProductsViewer } from '@admin/content/model';

/**
 * «Контент → Товари»: what the public site shows about each product of «Товари». The switch puts a
 * product on the site; the side panel edits its address, SEO and texts in two languages.
 */
export function ContentProductsContent({ viewer }: { viewer: ContentProductsViewer }) {
  const state = useContentProductList();
  const transfer = useOldSiteImport();
  const visibility = useContentProductVisibility();
  const { notice, setNotice } = visibility;
  const [opened, setOpened] = useState<ContentProductRow | null>(null);
  // Without the right to see «Розділи сайту» the list does not load and the filter is not offered.
  const categories = useGetSiteCategoriesQuery().currentData ?? null;
  const { list } = state;
  const page = list.currentData;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Товари сайту"
        actions={
          viewer.canCreate ? (
            <Button variant="outlined" onClick={transfer.start}>
              Перенести зі старого сайту
            </Button>
          ) : null
        }
        subtitle="Що публічний сайт показує про кожен товар: адреса сторінки, SEO, опис і характеристики двома мовами. Назва, фото, тканини й ціни беруться з «Товари»."
      />
      {notice && (
        <Alert
          severity={notice.ok ? 'success' : 'warning'}
          onClose={() => setNotice(null)}
          sx={{ mb: 2 }}
        >
          {notice.text}
        </Alert>
      )}
      <ReferenceListAlerts
        error={
          list.error ? adminApiErrorMessage(list.error, 'Не вдалося завантажити товари.') : null
        }
        loading={list.isLoading}
        onRetry={() => void list.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      <ReferenceSearchBar
        placeholder="Знайти за назвою, кодом або адресою сторінки"
        label="Пошук товарів сайту"
        value={state.term}
        onChange={state.setTerm}
      />
      <ContentProductFilters state={state} categories={categories} total={page?.total ?? 0} />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <ContentProductsTable
          page={page}
          categories={categories}
          loading={list.isFetching}
          narrowed={state.narrowed}
          unavailable={Boolean(list.error)}
          canEdit={viewer.canEdit}
          savingId={visibility.savingId}
          onPageChange={state.setPage}
          onOpen={setOpened}
          onToggle={(row, showOnSite) => void visibility.toggle(row, showOnSite)}
        />
      </Paper>
      <OldSiteImportDialog
        open={transfer.open}
        fileName={transfer.fileName}
        options={transfer.options}
        report={transfer.report}
        message={transfer.message}
        running={transfer.running}
        canTransfer={transfer.canTransfer}
        onPick={transfer.pick}
        onOptions={transfer.setOptions}
        onTransfer={transfer.transfer}
        onClose={transfer.close}
      />
      {opened && (
        <ContentProductDrawer
          key={opened.productId}
          row={opened}
          viewer={viewer}
          onClose={() => setOpened(null)}
          onDone={(text) => {
            setOpened(null);
            setNotice({ text, ok: true });
          }}
        />
      )}
    </Box>
  );
}

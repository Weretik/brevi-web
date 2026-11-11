import { useSetContentProductVisibilityMutation } from '@admin/content/data-access';
import { contentProductTypeLabel, contentProductTypes } from '@admin/content/model';
import { ContentProductsTable, OldSiteImportDialog } from '@admin/content/ui';
import {
  ReferenceFilterChip,
  ReferenceFilterRow,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
} from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Alert, Box, Button, Divider, Paper } from '@mui/material';
import { useState } from 'react';

import { ContentProductDrawer } from './content-product-drawer';
import { useContentProductList } from '../../hooks/product-pages/use-content-product-list';
import { useOldSiteImport } from '../../hooks/product-pages/use-old-site-import';

import type { ContentProductRow, ContentProductsViewer } from '@admin/content/model';

const siteFilters = [
  ['all', 'Усі'],
  ['onSite', 'На сайті'],
  ['offSite', 'Не на сайті'],
] as const;

/**
 * «Контент → Товари»: what the public site shows about each product of «Товари». The switch puts a
 * product on the site; the side panel edits its address, SEO and texts in two languages.
 */
export function ContentProductsContent({ viewer }: { viewer: ContentProductsViewer }) {
  const state = useContentProductList();
  const transfer = useOldSiteImport();
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);
  const [opened, setOpened] = useState<ContentProductRow | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [setVisibility] = useSetContentProductVisibilityMutation();
  const { list } = state;
  const page = list.currentData;

  async function toggle(row: ContentProductRow, showOnSite: boolean) {
    setSavingId(row.productId);
    setNotice(null);
    try {
      const saved = await setVisibility({ productId: row.productId, showOnSite }).unwrap();
      if (saved.showOnSite && !saved.onSite)
        setNotice({
          text: `«${row.name}» позначено для сайту, але товар вимкнено в «Товари», тому сайт його не покаже.`,
          ok: false,
        });
    } catch (error) {
      setNotice({
        text: adminApiErrorMessage(error, `Не вдалося змінити показ товару «${row.name}».`),
        ok: false,
      });
    } finally {
      setSavingId(null);
    }
  }

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
      <ReferenceFilterRow
        filters={
          <>
            {siteFilters.map(([value, label]) => (
              <ReferenceFilterChip
                key={value}
                label={label}
                count={state.counts[value]}
                selected={state.site === value}
                onClick={() => state.setSite(value)}
              />
            ))}
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            <ReferenceFilterChip
              label="Усі типи"
              selected={state.type === null}
              onClick={() => state.setType(null)}
            />
            {contentProductTypes.map((type) => (
              <ReferenceFilterChip
                key={type}
                label={contentProductTypeLabel(type)}
                selected={state.type === type}
                onClick={() => state.setType(type)}
              />
            ))}
          </>
        }
        count={page?.total ?? 0}
        total={state.counts[state.site]}
        countLabel="Кількість товарів"
        selectedCount={0}
        onClearSelection={() => undefined}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <ContentProductsTable
          page={page}
          loading={list.isFetching}
          narrowed={state.narrowed}
          unavailable={Boolean(list.error)}
          canEdit={viewer.canEdit}
          savingId={savingId}
          onPageChange={state.setPage}
          onOpen={setOpened}
          onToggle={(row, showOnSite) => void toggle(row, showOnSite)}
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

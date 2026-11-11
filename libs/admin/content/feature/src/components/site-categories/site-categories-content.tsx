import {
  useGetSiteCategoriesQuery,
  useReorderSiteCategoriesMutation,
  useSetSiteCategoryVisibilityMutation,
} from '@admin/content/data-access';
import { filterSiteCategories, moveSiteCategory, siteCategoryName } from '@admin/content/model';
import { OldSiteImportDialog, SiteCategoriesTable } from '@admin/content/ui';
import { ReferenceListAlerts, ReferencePageHeader, ReferenceSearchBar } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Alert, Box, Button, Paper, Stack } from '@mui/material';
import { useMemo, useState } from 'react';

import { SiteCategoryDrawer } from './site-category-drawer';
import { useOldSiteCategoryImport } from '../../hooks/site-categories/use-old-site-category-import';

import type { SiteCategoryTarget } from '../../hooks/site-categories/use-site-category-editor';
import type { SiteCategoriesViewer, SiteCategoryRow } from '@admin/content/model';
import type { OldSiteImportCopy } from '@admin/content/ui';

const transferCopy: OldSiteImportCopy = {
  title: 'Перенести розділи зі старого сайту',
  intro:
    'Файл перенесення містить розділи й підрозділи старого сайту з назвами, SEO і текстами двома мовами та товари кожного розділу. Товар знаходимо за посиланням старого сайту з картки товару. Спершу показуємо, що буде зроблено; нічого не зберігається, доки не натиснути «Перенести».',
  showOnSite: 'Одразу показувати перенесені розділи на сайті',
  overwrite: 'Замінити назви, SEO і тексти розділів, які вже є',
  done: 'Розділи перенесено.',
  total: 'Розділів у файлі',
  notMatched: 'Не знайдено товар у «Товари»',
};

const noRows: SiteCategoryRow[] = [];

/**
 * «Контент → Розділи»: the category tree of the public site. Staff add categories and subcategories,
 * change their order, show or hide them, and edit the address, SEO and text in the side panel.
 */
export function SiteCategoriesContent({ viewer }: { viewer: SiteCategoriesViewer }) {
  const list = useGetSiteCategoriesQuery();
  const rows = list.currentData ?? noRows;
  const [term, setTerm] = useState('');
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);
  const [opened, setOpened] = useState<SiteCategoryTarget | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [setVisibility] = useSetSiteCategoryVisibilityMutation();
  const [reorder] = useReorderSiteCategoriesMutation();
  const transfer = useOldSiteCategoryImport();
  const shown = useMemo(() => filterSiteCategories(rows, term), [rows, term]);
  const narrowed = term.trim().length > 0;

  async function run(row: SiteCategoryRow, action: () => Promise<void>, failure: string) {
    setSavingId(row.id);
    setNotice(null);
    try {
      await action();
    } catch (error) {
      setNotice({ text: adminApiErrorMessage(error, failure), ok: false });
    } finally {
      setSavingId(null);
    }
  }

  const toggle = (row: SiteCategoryRow, showOnSite: boolean) =>
    run(
      row,
      async () => {
        const saved = await setVisibility({ id: row.id, showOnSite }).unwrap();
        if (saved.showOnSite && !saved.onSite)
          setNotice({
            text: `«${siteCategoryName(row)}» позначено для сайту, але його розділ верхнього рівня приховано, тому сайт його не покаже.`,
            ok: false,
          });
      },
      `Не вдалося змінити показ розділу «${siteCategoryName(row)}».`,
    );

  const move = (row: SiteCategoryRow, step: -1 | 1) => {
    const order = moveSiteCategory(rows, row.id, step);
    if (!order) return;
    void run(
      row,
      async () => {
        await reorder(order).unwrap();
      },
      `Не вдалося змінити місце розділу «${siteCategoryName(row)}».`,
    );
  };

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Розділи сайту"
        actions={
          viewer.canCreate ? (
            <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
              <Button variant="outlined" onClick={transfer.start}>
                Перенести зі старого сайту
              </Button>
              <Button variant="contained" onClick={() => setOpened({ id: null, parentId: null })}>
                Додати розділ
              </Button>
            </Stack>
          ) : null
        }
        subtitle="Каталог публічного сайту: розділи та підрозділи, їхній порядок, адреси, SEO і тексти двома мовами. Прихований розділ сайт не показує."
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
          list.error ? adminApiErrorMessage(list.error, 'Не вдалося завантажити розділи.') : null
        }
        loading={list.isLoading}
        onRetry={() => void list.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      <ReferenceSearchBar
        placeholder="Знайти за назвою або адресою розділу"
        label="Пошук розділів сайту"
        value={term}
        onChange={setTerm}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <SiteCategoriesTable
          rows={shown}
          loading={list.isFetching}
          narrowed={narrowed}
          unavailable={Boolean(list.error)}
          canCreate={viewer.canCreate}
          canEdit={viewer.canEdit}
          savingId={savingId}
          onOpen={(row) => setOpened({ id: row.id })}
          onToggle={(row, showOnSite) => void toggle(row, showOnSite)}
          onMove={move}
          onAddChild={(row) => setOpened({ id: null, parentId: row.id })}
        />
      </Paper>
      <OldSiteImportDialog
        open={transfer.open}
        copy={transferCopy}
        productLinks={transfer.report?.productLinks ?? null}
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
        <SiteCategoryDrawer
          key={opened.id ?? `new-${opened.parentId ?? 'top'}`}
          target={opened}
          rows={rows}
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

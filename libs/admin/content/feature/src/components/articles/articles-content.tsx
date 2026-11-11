import {
  useGetContentArticlesQuery,
  useSetContentArticleVisibilityMutation,
} from '@admin/content/data-access';
import { articleTitle, filterArticles } from '@admin/content/model';
import { ArticlesTable, OldSiteImportDialog } from '@admin/content/ui';
import { ReferenceListAlerts, ReferencePageHeader, ReferenceSearchBar } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Alert, Box, Button, Paper, Stack } from '@mui/material';
import { useMemo, useState } from 'react';

import { ArticleDrawer } from './article-drawer';
import { useOldSiteArticleImport } from '../../hooks/articles/use-old-site-article-import';

import type { ArticleRow, ArticlesViewer } from '@admin/content/model';
import type { OldSiteImportCopy } from '@admin/content/ui';

const transferCopy: OldSiteImportCopy = {
  title: 'Перенести статті зі старого сайту',
  intro:
    'Файл перенесення містить статті старого сайту з датами, назвами, SEO і текстами двома мовами. Фото статей завантажуємо у «Фото», папка «Старий сайт / Статті», тому перенесення триває кілька хвилин. Спершу показуємо, що буде зроблено; нічого не зберігається, доки не натиснути «Перенести».',
  showOnSite: 'Одразу показувати перенесені статті на сайті',
  overwrite: 'Замінити статті, які вже є',
  done: 'Статті перенесено.',
  total: 'Статей у файлі',
  notMatched: '',
};

const noRows: ArticleRow[] = [];

/**
 * «Контент → Статті»: articles of the public site. Staff add an article, show or hide it, and edit
 * the date, address, cover, SEO and text with photos in the side panel.
 */
export function ArticlesContent({ viewer }: { viewer: ArticlesViewer }) {
  const list = useGetContentArticlesQuery();
  const rows = list.currentData ?? noRows;
  const [term, setTerm] = useState('');
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);
  // `undefined` keeps the panel closed, null opens a new article.
  const [opened, setOpened] = useState<number | null | undefined>(undefined);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [setVisibility] = useSetContentArticleVisibilityMutation();
  const transfer = useOldSiteArticleImport();
  const shown = useMemo(() => filterArticles(rows, term), [rows, term]);

  async function toggle(row: ArticleRow, showOnSite: boolean) {
    setSavingId(row.id);
    setNotice(null);
    try {
      await setVisibility({ id: row.id, showOnSite }).unwrap();
    } catch (error) {
      setNotice({
        text: adminApiErrorMessage(
          error,
          `Не вдалося змінити показ статті «${articleTitle(row)}».`,
        ),
        ok: false,
      });
    } finally {
      setSavingId(null);
    }
  }

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Статті"
        actions={
          viewer.canCreate ? (
            <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
              <Button variant="outlined" onClick={transfer.start}>
                Перенести зі старого сайту
              </Button>
              <Button variant="contained" onClick={() => setOpened(null)}>
                Додати статтю
              </Button>
            </Stack>
          ) : null
        }
        subtitle="Статті публічного сайту: дата, адреса, обкладинка, SEO і текст із фото двома мовами. Приховану статтю сайт не показує."
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
          list.error ? adminApiErrorMessage(list.error, 'Не вдалося завантажити статті.') : null
        }
        loading={list.isLoading}
        onRetry={() => void list.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      <ReferenceSearchBar
        placeholder="Знайти за назвою або адресою статті"
        label="Пошук статей"
        value={term}
        onChange={setTerm}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <ArticlesTable
          rows={shown}
          loading={list.isFetching}
          narrowed={term.trim().length > 0}
          unavailable={Boolean(list.error)}
          canEdit={viewer.canEdit}
          savingId={savingId}
          onOpen={(row) => setOpened(row.id)}
          onToggle={(row, showOnSite) => void toggle(row, showOnSite)}
        />
      </Paper>
      <OldSiteImportDialog
        open={transfer.open}
        copy={transferCopy}
        photos={transfer.report?.photos ?? null}
        progress={transfer.progress}
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
      {opened !== undefined && (
        <ArticleDrawer
          key={opened ?? 'new'}
          id={opened}
          viewer={viewer}
          onClose={() => setOpened(undefined)}
          onDone={(text) => {
            setOpened(undefined);
            setNotice({ text, ok: true });
          }}
        />
      )}
    </Box>
  );
}

import { useGetSiteRedirectsQuery } from '@admin/content/data-access';
import { filterRedirects, redirectSourceLabel, siteRedirectSources } from '@admin/content/model';
import { OldSiteImportDialog, RedirectsTable } from '@admin/content/ui';
import { ReferenceListAlerts, ReferencePageHeader, ReferenceSearchBar } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Alert, Box, Button, MenuItem, Paper, Stack, TextField } from '@mui/material';
import { useMemo, useState } from 'react';

import { RedirectDrawer } from './redirect-drawer';
import {
  redirectTransferReport,
  useOldSiteRedirectImport,
} from '../../hooks/redirects/use-old-site-redirect-import';

import type { RedirectsViewer, SiteRedirect, SiteRedirectSource } from '@admin/content/model';
import type { OldSiteImportCopy } from '@admin/content/ui';

const transferCopy: OldSiteImportCopy = {
  title: 'Перенести адреси старого сайту',
  intro:
    'Файл містить адреси старого сайту brevi.com.ua. Для кожної адреси знаходимо сторінку нового сайту: статтю, розділ або товар; адреси з /ru/ ведуть на російську версію. Спершу показуємо, що буде зроблено; нічого не зберігається, доки не натиснути «Перенести». Переадресації, змінені вручну, не змінюються.',
  showOnSite: '',
  overwrite: 'Замінити переадресації, які вже є',
  done: 'Адреси перенесено.',
  total: 'Адрес у файлі',
  notMatched: 'Не знайдено сторінку (додайте вручну)',
};

const noRows: SiteRedirect[] = [];

/**
 * «Контент → Переадресації»: old addresses that lead to pages of the new site with a 301. Staff
 * transfer the old-site addresses, add and change redirects; an address change of a product,
 * category or article adds one by itself.
 */
export function RedirectsContent({ viewer }: { viewer: RedirectsViewer }) {
  const list = useGetSiteRedirectsQuery();
  const rows = list.currentData ?? noRows;
  const [term, setTerm] = useState('');
  const [source, setSource] = useState<SiteRedirectSource | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  // `undefined` keeps the panel closed, null opens a new redirect.
  const [opened, setOpened] = useState<SiteRedirect | null | undefined>(undefined);
  const transfer = useOldSiteRedirectImport();
  const shown = useMemo(() => filterRedirects(rows, term, source), [rows, term, source]);

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Переадресації"
        actions={
          viewer.canCreate ? (
            <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
              <Button variant="outlined" onClick={transfer.start}>
                Перенести зі старого сайту
              </Button>
              <Button variant="contained" onClick={() => setOpened(null)}>
                Додати переадресацію
              </Button>
            </Stack>
          ) : null
        }
        subtitle="Старі адреси, що ведуть на сторінки нового сайту (301). Так пошукові системи переносять позиції, а збережені посилання працюють."
      />
      {notice && (
        <Alert severity="success" onClose={() => setNotice(null)} sx={{ mb: 2 }}>
          {notice}
        </Alert>
      )}
      <ReferenceListAlerts
        error={
          list.error
            ? adminApiErrorMessage(list.error, 'Не вдалося завантажити переадресації.')
            : null
        }
        loading={list.isLoading}
        onRetry={() => void list.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ gap: 1.5, alignItems: { sm: 'flex-start' } }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <ReferenceSearchBar
            placeholder="Знайти за адресою або приміткою"
            label="Пошук переадресацій"
            value={term}
            onChange={setTerm}
          />
        </Box>
        <TextField
          select
          size="small"
          label="Звідки"
          value={source ?? ''}
          onChange={(event) =>
            setSource(event.target.value === '' ? null : (event.target.value as SiteRedirectSource))
          }
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Усі</MenuItem>
          {siteRedirectSources.map((value) => (
            <MenuItem key={value} value={value}>
              {redirectSourceLabel(value)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <RedirectsTable
          rows={shown}
          loading={list.isFetching}
          narrowed={term.trim().length > 0 || source !== null}
          unavailable={Boolean(list.error)}
          onOpen={setOpened}
        />
      </Paper>
      <OldSiteImportDialog
        open={transfer.open}
        copy={transferCopy}
        fileName={transfer.fileName}
        options={transfer.options}
        report={transfer.report ? redirectTransferReport(transfer.report) : null}
        message={transfer.message}
        running={transfer.running}
        canTransfer={transfer.canTransfer}
        onPick={transfer.pick}
        onOptions={transfer.setOptions}
        onTransfer={transfer.transfer}
        onClose={transfer.close}
      />
      {opened !== undefined && (
        <RedirectDrawer
          key={opened?.id ?? 'new'}
          redirect={opened}
          viewer={viewer}
          onClose={() => setOpened(undefined)}
          onDone={(text) => {
            setOpened(undefined);
            setNotice(text);
          }}
        />
      )}
    </Box>
  );
}

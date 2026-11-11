import { useGetSiteGalleryQuery } from '@admin/content/data-access';
import {
  moveSiteGalleryItem,
  newSiteGalleryItem,
  siteGalleryLabels,
  siteGalleryLimits,
} from '@admin/content/model';
import { SiteGalleryDeleteDialog, SiteGalleryGrid } from '@admin/content/ui';
import { MediaPickerDrawer } from '@admin/media/feature';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Alert, Box, Button, Stack } from '@mui/material';
import { useState } from 'react';

import { SiteGalleryItemDrawer } from './site-gallery-item-drawer';
import { useSiteGalleryActions } from '../../hooks/galleries/use-site-gallery-actions';

import type { SiteGalleryItem, SiteGalleryKind, SiteGalleryViewer } from '@admin/content/model';

interface Props {
  kind: SiteGalleryKind;
  viewer: SiteGalleryViewer;
}

interface Editing {
  /** Null for a new picture added at the end. */
  index: number | null;
  item: SiteGalleryItem;
}

/**
 * «Контент → Наші роботи» and «Контент → Сертифікати»: the pictures of the site page in order. Each change saves the
 * whole list. Pictures the site still keeps as its own files move to «Фото» with «Перенести у бібліотеку фото».
 */
export function SiteGalleryContent({ kind, viewer }: Props) {
  const labels = siteGalleryLabels[kind];
  const query = useGetSiteGalleryQuery(kind);
  const gallery = query.currentData;
  const actions = useSiteGalleryActions(kind);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const items = gallery?.items ?? [];
  const takenIds = items.flatMap((x) => (x.photoId === null ? [] : [x.photoId]));
  const full = items.length >= siteGalleryLimits[kind];
  const busy = actions.saving || actions.transferring;

  async function saveList(next: SiteGalleryItem[], done: string) {
    if (!gallery) return 'Сторінка ще не завантажилась.';
    const reason = await actions.saveItems(gallery, next);
    setError(reason);
    if (!reason) setNotice(done);
    return reason;
  }

  const nameOf = (index: number) => items[index]?.title.uk || `${labels.item} ${index + 1}`;
  const report = actions.report;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title={labels.title}
        subtitle={labels.subtitle}
        actions={
          viewer.canEdit && gallery ? (
            <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
              {gallery.legacyCount > 0 && (
                <Button variant="outlined" disabled={busy} onClick={() => void actions.transfer()}>
                  {actions.transferring
                    ? 'Переносимо…'
                    : `Перенести у бібліотеку фото (${gallery.legacyCount})`}
                </Button>
              )}
              <Button variant="contained" disabled={busy || full} onClick={() => setAdding(true)}>
                {kind === 'certificates' ? 'Додати документ' : 'Додати фото'}
              </Button>
            </Stack>
          ) : null
        }
      />
      {notice && (
        <Alert severity="success" onClose={() => setNotice(null)} sx={{ mb: 2 }}>
          {notice}
        </Alert>
      )}
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {report && (
        <Alert
          severity={report.problems.length > 0 ? 'warning' : 'info'}
          onClose={actions.transferring ? undefined : actions.clearReport}
          sx={{ mb: 2 }}
        >
          Перенесено в «Фото»: {report.moved}.{report.left > 0 ? ` Лишилось: ${report.left}.` : ''}
          {report.problems.map((problem) => (
            <Box key={problem}>{problem}</Box>
          ))}
        </Alert>
      )}
      <ReferenceListAlerts
        error={
          query.error ? adminApiErrorMessage(query.error, 'Не вдалося завантажити сторінку.') : null
        }
        loading={query.isLoading}
        onRetry={() => void query.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      {gallery && (
        <SiteGalleryGrid
          kind={kind}
          items={items}
          canEdit={viewer.canEdit}
          disabled={busy}
          onEdit={(index) => setEditing({ index, item: items[index] })}
          onMove={(index, by) =>
            void saveList(moveSiteGalleryItem(items, index, by), 'Порядок збережено.')
          }
          onDelete={setDeleting}
        />
      )}
      {adding && (
        <MediaPickerDrawer
          alreadyAddedIds={takenIds}
          onClose={() => setAdding(false)}
          onPick={(files) => {
            setAdding(false);
            const fresh = files
              .filter((file) => !takenIds.includes(file.id))
              .map(newSiteGalleryItem);
            if (fresh.length === 0) return;
            // A document needs a title first; work photos are added at once.
            if (kind === 'certificates') setEditing({ index: null, item: fresh[0] });
            else void saveList([...items, ...fresh], `Додано фото: ${fresh.length}.`);
          }}
        />
      )}
      {editing && (
        <SiteGalleryItemDrawer
          key={editing.index ?? 'new'}
          kind={kind}
          item={editing.item}
          isNew={editing.index === null}
          saving={actions.saving}
          takenIds={takenIds}
          onClose={() => setEditing(null)}
          onSubmit={async (item) => {
            const at = editing.index;
            const next =
              at === null ? [...items, item] : items.map((x, i) => (i === at ? item : x));
            const reason = await saveList(
              next,
              'Збережено. Сайт покаже зміни протягом кількох хвилин.',
            );
            if (!reason) setEditing(null);
            return reason;
          }}
        />
      )}
      <SiteGalleryDeleteDialog
        name={deleting === null ? null : nameOf(deleting)}
        deleting={actions.saving}
        onClose={() => setDeleting(null)}
        onConfirm={() => {
          const at = deleting;
          setDeleting(null);
          if (at !== null)
            void saveList(
              items.filter((_, i) => i !== at),
              'Прибрано з сайту.',
            );
        }}
      />
    </Box>
  );
}

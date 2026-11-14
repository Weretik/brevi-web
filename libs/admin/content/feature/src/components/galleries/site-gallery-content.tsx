import { moveSiteGalleryItem, newSiteGalleryItem } from '@admin/content/model';
import { SiteGalleryDeleteDialog, SiteGalleryGrid } from '@admin/content/ui';
import { MediaPickerDrawer } from '@admin/media/feature';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Alert, Box, Button, Stack } from '@mui/material';

import { SiteGalleryItemDrawer } from './site-gallery-item-drawer';
import { useSiteGalleryContent } from '../../hooks/galleries/use-site-gallery-content';

import type { SiteGalleryKind, SiteGalleryViewer } from '@admin/content/model';

interface Props {
  kind: SiteGalleryKind;
  viewer: SiteGalleryViewer;
}

/**
 * «Контент → Наші роботи» and «Контент → Сертифікати»: the pictures of the site page in order. Each change saves the
 * whole list. Pictures the site still keeps as its own files move to «Фото» with «Перенести у бібліотеку фото».
 */
export function SiteGalleryContent({ kind, viewer }: Props) {
  const {
    labels,
    query,
    gallery,
    actions,
    editing,
    setEditing,
    adding,
    setAdding,
    deleting,
    setDeleting,
    notice,
    setNotice,
    error,
    setError,
    items,
    takenIds,
    full,
    busy,
    saveList,
    nameOf,
    report,
  } = useSiteGalleryContent({ kind });
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

import { moveSiteGalleryItem, newSiteGalleryItem } from '@admin/content/model';
import { SiteGalleryDeleteDialog, SiteGalleryGrid } from '@admin/content/ui';
import { MediaPickerDrawer } from '@admin/media/feature';
import { ReferenceListAlerts } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Box } from '@mui/material';

import { SiteGalleryHeader } from './site-gallery-header';
import { SiteGalleryItemDrawer } from './site-gallery-item-drawer';
import { SiteGalleryNotices } from './site-gallery-notices';
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
      <SiteGalleryHeader
        kind={kind}
        labels={labels}
        canEdit={viewer.canEdit}
        gallery={gallery}
        actions={actions}
        busy={busy}
        full={full}
        onAdd={() => setAdding(true)}
      />
      <SiteGalleryNotices
        notice={notice}
        onCloseNotice={() => setNotice(null)}
        error={error}
        onCloseError={() => setError(null)}
        report={report}
        onCloseReport={actions.transferring ? undefined : actions.clearReport}
      />
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

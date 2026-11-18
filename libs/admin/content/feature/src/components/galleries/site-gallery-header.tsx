import { ReferencePageHeader } from '@admin/references/ui';
import { Button, Stack } from '@mui/material';

import type { useSiteGalleryContent } from '../../hooks/galleries/use-site-gallery-content';
import type { SiteGalleryKind } from '@admin/content/model';

type Gallery = ReturnType<typeof useSiteGalleryContent>;

/** Header of a site gallery with «Перенести у бібліотеку фото» while old files remain, and «Додати». */
export function SiteGalleryHeader({
  kind,
  labels,
  canEdit,
  gallery,
  actions,
  busy,
  full,
  onAdd,
}: {
  kind: SiteGalleryKind;
  labels: Gallery['labels'];
  canEdit: boolean;
  gallery: Gallery['gallery'];
  actions: Gallery['actions'];
  busy: boolean;
  full: boolean;
  onAdd: () => void;
}) {
  return (
    <ReferencePageHeader
      title={labels.title}
      subtitle={labels.subtitle}
      actions={
        canEdit && gallery ? (
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            {gallery.legacyCount > 0 && (
              <Button variant="outlined" disabled={busy} onClick={() => void actions.transfer()}>
                {actions.transferring
                  ? 'Переносимо…'
                  : `Перенести у бібліотеку фото (${gallery.legacyCount})`}
              </Button>
            )}
            <Button variant="contained" disabled={busy || full} onClick={onAdd}>
              {kind === 'certificates' ? 'Додати документ' : 'Додати фото'}
            </Button>
          </Stack>
        ) : null
      }
    />
  );
}

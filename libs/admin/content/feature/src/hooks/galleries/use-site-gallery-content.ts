import { useGetSiteGalleryQuery } from '@admin/content/data-access';
import { siteGalleryLabels, siteGalleryLimits } from '@admin/content/model';
import { useState } from 'react';

import { useSiteGalleryActions } from './use-site-gallery-actions';

import type { SiteGalleryItem, SiteGalleryKind } from '@admin/content/model';

interface Editing {
  /** Null for a new picture added at the end. */
  index: number | null;
  item: SiteGalleryItem;
}

/** A site gallery: its pictures, the open editor, adding and deleting, and saving the whole list. */
export function useSiteGalleryContent({ kind }: { kind: SiteGalleryKind }) {
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
  return {
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
  };
}

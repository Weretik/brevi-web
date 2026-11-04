import { useState } from 'react';

/** Which line the side panel shows: `new` adds one; `readOnly` is the view before «Редагувати». */
export type SewingLinePanel<Key> = { key: Key | 'new'; readOnly: boolean } | null;

/** Open side panel and pending deletion of one table of the sewing card. */
export function useSewingLinePanel<Key>() {
  const [panel, setPanel] = useState<SewingLinePanel<Key>>(null);
  const [deleting, setDeleting] = useState<Key | null>(null);
  return {
    panel,
    deleting,
    add: () => setPanel({ key: 'new', readOnly: false }),
    view: (key: Key) => setPanel({ key, readOnly: true }),
    edit: (key: Key) => setPanel({ key, readOnly: false }),
    close: () => setPanel(null),
    askDelete: (key: Key) => setDeleting(key),
    cancelDelete: () => setDeleting(null),
  };
}

import { useGetSiteRedirectsQuery } from '@admin/content/data-access';
import { filterRedirects } from '@admin/content/model';
import { useMemo, useState } from 'react';

import { useOldSiteRedirectImport } from './use-old-site-redirect-import';

import type { SiteRedirect, SiteRedirectSource } from '@admin/content/model';

const noRows: SiteRedirect[] = [];

/** «Переадресації»: the list with its search and source chip, the open side panel, and the transfer from the old site. */
export function useRedirectsContent() {
  const list = useGetSiteRedirectsQuery();
  const rows = list.currentData ?? noRows;
  const [term, setTerm] = useState('');
  const [source, setSource] = useState<SiteRedirectSource | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  // `undefined` keeps the panel closed, null opens a new redirect.
  const [opened, setOpened] = useState<SiteRedirect | null | undefined>(undefined);
  const transfer = useOldSiteRedirectImport();
  const shown = useMemo(() => filterRedirects(rows, term, source), [rows, term, source]);
  return {
    list,
    rows,
    term,
    setTerm,
    source,
    setSource,
    notice,
    setNotice,
    opened,
    setOpened,
    transfer,
    shown,
  };
}

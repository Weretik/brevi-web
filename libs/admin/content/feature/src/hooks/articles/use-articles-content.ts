import {
  useGetContentArticlesQuery,
  useSetContentArticleVisibilityMutation,
} from '@admin/content/data-access';
import { articleTitle, filterArticles } from '@admin/content/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useMemo, useState } from 'react';

import { useOldSiteArticleImport } from './use-old-site-article-import';

import type { ArticleRow } from '@admin/content/model';

const noRows: ArticleRow[] = [];

/** «Статті»: the list with its search, the open side panel, showing an article on the site, and the transfer from the old site. */
export function useArticlesContent() {
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
  return {
    list,
    rows,
    term,
    setTerm,
    notice,
    setNotice,
    opened,
    setOpened,
    savingId,
    transfer,
    shown,
    toggle,
  };
}

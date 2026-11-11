import { useImportOldSiteArticlesMutation } from '@admin/content/data-access';
import {
  articleImportBatches,
  readArticleImportFile,
  sumArticleImportReports,
} from '@admin/content/model';
import { useState } from 'react';

import { useOldSiteTransfer } from '../old-site/use-old-site-transfer';

import type { ArticleImportReport } from '@admin/content/model';

/**
 * Transfer of old-site articles on «Статті». The check goes in one request; the transfer itself is
 * sent in small parts, because the server downloads the pictures of every article while it runs.
 * A part that fails stops the transfer; articles already moved stay and a repeated run keeps them.
 */
export function useOldSiteArticleImport() {
  const [send] = useImportOldSiteArticlesMutation();
  const [progress, setProgress] = useState<string | null>(null);
  const transfer = useOldSiteTransfer<ArticleImportReport>({
    read: readArticleImportFile,
    send: async ({ items, dryRun, ...options }) => {
      if (dryRun) return send({ items, dryRun, ...options }).unwrap();
      const reports: ArticleImportReport[] = [];
      let moved = 0;
      try {
        for (const part of articleImportBatches(items)) {
          setProgress(`Перенесено статей: ${moved} з ${items.length}`);
          reports.push(await send({ items: part, dryRun: false, ...options }).unwrap());
          moved += part.length;
        }
      } finally {
        setProgress(null);
      }
      return sumArticleImportReports(reports);
    },
    changes: (report) => report.created + report.updated > 0,
    failure:
      'Не вдалося перенести всі статті. Перенесені статті збережено; оберіть файл ще раз, щоб перенести решту.',
  });
  return { ...transfer, progress };
}

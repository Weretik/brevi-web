import { useImportOldSiteCategoriesMutation } from '@admin/content/data-access';
import { readSiteCategoryImportFile } from '@admin/content/model';

import { useOldSiteTransfer } from '../old-site/use-old-site-transfer';

/** Transfer of the old-site category tree with its products on «Розділи сайту». */
export function useOldSiteCategoryImport() {
  const [send] = useImportOldSiteCategoriesMutation();
  return useOldSiteTransfer({
    read: readSiteCategoryImportFile,
    send: (request) => send(request).unwrap(),
    changes: (report) => report.created + report.updated + report.productLinks > 0,
    failure: 'Не вдалося перенести розділи.',
  });
}

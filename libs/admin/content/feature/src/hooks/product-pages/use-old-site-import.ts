import { useImportOldSiteProductPagesMutation } from '@admin/content/data-access';
import { readOldSiteImportFile } from '@admin/content/model';

import { useOldSiteTransfer } from '../old-site/use-old-site-transfer';

/** Transfer of old-site product texts on «Товари сайту». */
export function useOldSiteImport() {
  const [send] = useImportOldSiteProductPagesMutation();
  return useOldSiteTransfer({
    read: readOldSiteImportFile,
    send: (request) => send(request).unwrap(),
    changes: (report) => report.created + report.updated > 0,
    failure: 'Не вдалося перенести тексти.',
  });
}

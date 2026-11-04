import { useImportOldSitePhotosMutation } from '@admin/products/data-access';
import { addOldSitePhotoImportReports, parseOldSitePhotoImportFile } from '@admin/products/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useRef, useState } from 'react';

import type { OldSitePhotoImportFile, OldSitePhotoImportReport } from '@admin/products/model';

/** The server takes at most 20 products in a real run (CAT-018 R-08). */
export const OLD_SITE_IMPORT_PART = 20;

/**
 * «Імпорт зі старого сайту» (CAT-018): read the file, check it (dry run, nothing is written), then
 * import it in parts of 20 products with progress. A repeat adds nothing twice.
 */
export function useOldSitePhotoImport() {
  const [send] = useImportOldSitePhotosMutation();
  const [file, setFile] = useState<{ name: string; data: OldSitePhotoImportFile } | null>(null);
  const [report, setReport] = useState<OldSitePhotoImportReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<'check' | 'import' | null>(null);
  const [done, setDone] = useState(0);
  const stopped = useRef(false);

  async function pick(picked: File) {
    setReport(null);
    setError(null);
    const data = parseOldSitePhotoImportFile(await picked.text());
    if (!data) {
      setFile(null);
      setError('Це не файл імпорту фото старого сайту (old-site-photo-import.json).');
      return;
    }
    setFile({ name: picked.name, data });
  }

  async function check() {
    if (!file || busy) return;
    setBusy('check');
    setError(null);
    try {
      setReport(
        await send({
          dryRun: true,
          baseUrl: file.data.baseUrl,
          products: file.data.products,
        }).unwrap(),
      );
    } catch (cause) {
      setError(adminApiErrorMessage(cause, 'Не вдалося перевірити файл.'));
    } finally {
      setBusy(null);
    }
  }

  async function run() {
    if (!file || busy) return;
    setBusy('import');
    setError(null);
    setDone(0);
    stopped.current = false;
    let total: OldSitePhotoImportReport | null = null;
    const { baseUrl, products } = file.data;
    try {
      for (
        let start = 0;
        start < products.length && !stopped.current;
        start += OLD_SITE_IMPORT_PART
      ) {
        const part = products.slice(start, start + OLD_SITE_IMPORT_PART);
        total = addOldSitePhotoImportReports(
          total,
          await send({ dryRun: false, baseUrl, products: part }).unwrap(),
        );
        setReport(total);
        setDone(start + part.length);
      }
    } catch (cause) {
      setError(
        adminApiErrorMessage(
          cause,
          'Імпорт зупинився. Запустіть його ще раз: зроблене не повториться.',
        ),
      );
    } finally {
      setBusy(null);
    }
  }

  return {
    fileName: file?.name ?? null,
    productCount: file?.data.products.length ?? 0,
    report,
    error,
    busy,
    done,
    pick: (picked: File) => void pick(picked),
    check: () => void check(),
    run: () => void run(),
    stop: () => {
      stopped.current = true;
    },
  };
}

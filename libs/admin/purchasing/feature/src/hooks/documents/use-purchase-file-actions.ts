import { useRecognizePurchaseFileMutation } from '@admin/purchasing/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { PurchaseInvoiceLink, PurchaseRecognition } from '@admin/purchasing/model';

export interface PurchaseFileNotice {
  fileId: string;
  text: string;
  ok: boolean;
}

const resultText = (result: PurchaseRecognition) => {
  if (result.result === 'Recognized') return 'Розпізнано і перевірено до копійки.';
  const reason = result.problems.length > 0 ? `: ${result.problems.join('; ')}` : '.';
  if (result.result === 'Skipped') return `Файл не прочитано${reason}`;
  if (result.result === 'Failed') return `Не вдалося розпізнати${reason}`;
  return `Потребує перевірки${reason}`;
};

/** «Розпізнати» / «Розпізнати знову» of one original; one file at a time. */
export function usePurchaseFileActions() {
  const [recognizeFile] = useRecognizePurchaseFileMutation();
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<PurchaseFileNotice | null>(null);

  async function run(fileId: string, action: () => Promise<PurchaseFileNotice | null>) {
    if (busy) return;
    setBusy(fileId);
    setNotice(null);
    try {
      setNotice(await action());
    } finally {
      setBusy(null);
    }
  }

  const recognize = (link: PurchaseInvoiceLink) =>
    run(link.id, async () => {
      try {
        const result = await recognizeFile(link.id).unwrap();
        return { fileId: link.id, text: resultText(result), ok: result.result === 'Recognized' };
      } catch (error) {
        return {
          fileId: link.id,
          text: adminApiErrorMessage(error, 'Не вдалося розпізнати оригінал.'),
          ok: false,
        };
      }
    });

  return { busy, notice, recognize };
}

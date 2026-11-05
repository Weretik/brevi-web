import {
  useLazyGetPurchaseDocumentTemplateQuery,
  useRecognizePurchaseFileMutation,
  useSavePurchaseDocumentMutation,
} from '@admin/purchasing/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import { downloadJson } from './download-json';

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

const replaceQuestion =
  'Для цього оригіналу вже є перевірені дані. Замінити їх даними з файлу? Старі дані залишаться в історії.';

/**
 * Actions of one original in the side panel: «Розпізнати» / «Розпізнати знову», «Шаблон JSON»
 * and «Завантажити JSON» (replacing checked facts asks first). One action at a time.
 */
export function usePurchaseFileActions() {
  const [recognizeFile] = useRecognizePurchaseFileMutation();
  const [saveDocument] = useSavePurchaseDocumentMutation();
  const [loadTemplate] = useLazyGetPurchaseDocumentTemplateQuery();
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

  const downloadTemplate = (link: PurchaseInvoiceLink) =>
    run(link.id, async () => {
      try {
        downloadJson(await loadTemplate(link.id).unwrap(), `rakhunok-${link.id.slice(0, 8)}.json`);
        return null;
      } catch (error) {
        return {
          fileId: link.id,
          text: adminApiErrorMessage(error, 'Не вдалося отримати шаблон JSON.'),
          ok: false,
        };
      }
    });

  const upload = (link: PurchaseInvoiceLink, file: File) =>
    run(link.id, async () => {
      let document: unknown;
      try {
        document = JSON.parse(await file.text());
      } catch {
        return { fileId: link.id, text: 'Файл не є JSON.', ok: false };
      }
      const save = (replace: boolean) =>
        saveDocument({ fileId: link.id, document, replace }).unwrap();
      try {
        const saved = await save(false);
        return {
          fileId: link.id,
          text: saved.unchanged ? 'Ці дані вже збережені.' : 'Дані з JSON збережено.',
          ok: true,
        };
      } catch (error) {
        const conflict = (error as { status?: unknown } | null)?.status === 409;
        if (!conflict) {
          return {
            fileId: link.id,
            text: adminApiErrorMessage(error, 'Не вдалося зберегти JSON.'),
            ok: false,
          };
        }
        if (!window.confirm(replaceQuestion)) return null;
        try {
          await save(true);
          return { fileId: link.id, text: 'Дані замінено, старі збережено в історії.', ok: true };
        } catch (retryError) {
          return {
            fileId: link.id,
            text: adminApiErrorMessage(retryError, 'Не вдалося зберегти JSON.'),
            ok: false,
          };
        }
      }
    });

  return { busy, notice, recognize, downloadTemplate, upload };
}

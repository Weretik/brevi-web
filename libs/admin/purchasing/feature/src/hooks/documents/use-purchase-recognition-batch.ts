import { useRecognizeNewPurchaseFilesMutation } from '@admin/purchasing/data-access';
import { describePurchaseRecognitionBatch } from '@admin/purchasing/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useRef, useState } from 'react';

import type { PurchaseRecognitionBatch } from '@admin/purchasing/model';

const empty: PurchaseRecognitionBatch = {
  recognized: 0,
  needsReview: 0,
  failed: 0,
  skipped: 0,
  remaining: 0,
  costUsd: 0,
  stopReason: null,
};

const processedOf = (batch: PurchaseRecognitionBatch) =>
  batch.recognized + batch.needsReview + batch.failed + batch.skipped;

/**
 * «Розпізнати всі нові»: repeats one server batch (files never tried, newest first) until none
 * remain, the server stops (AI off, limit, someone else runs it) or «Зупинити» is pressed.
 */
export function usePurchaseRecognitionBatch(onResult: (message: string, ok: boolean) => void) {
  const [recognizeNew] = useRecognizeNewPurchaseFilesMutation();
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const stopped = useRef(false);

  async function start() {
    if (running) return;
    stopped.current = false;
    setRunning(true);
    let done = empty;
    let total = 0;
    try {
      for (;;) {
        const batch = await recognizeNew().unwrap();
        done = {
          recognized: done.recognized + batch.recognized,
          needsReview: done.needsReview + batch.needsReview,
          failed: done.failed + batch.failed,
          skipped: done.skipped + batch.skipped,
          remaining: batch.remaining,
          costUsd: done.costUsd + batch.costUsd,
          stopReason: batch.stopReason,
        };
        total = processedOf(done) + batch.remaining;
        if (batch.stopReason) {
          onResult(`${batch.stopReason} ${describePurchaseRecognitionBatch(done, total)}`, false);
          return;
        }
        if (batch.remaining === 0 || processedOf(batch) === 0) {
          onResult(
            total === 0
              ? 'Нових оригіналів для розпізнавання немає.'
              : describePurchaseRecognitionBatch(done, total),
            true,
          );
          return;
        }
        if (stopped.current) {
          onResult(`Зупинено. ${describePurchaseRecognitionBatch(done, total)}`, true);
          return;
        }
        setProgress(describePurchaseRecognitionBatch(done, total));
      }
    } catch (error) {
      const reason = adminApiErrorMessage(error, 'Не вдалося розпізнати оригінали.');
      onResult(
        processedOf(done) > 0
          ? `${reason} ${describePurchaseRecognitionBatch(done, total)}`
          : reason,
        false,
      );
    } finally {
      setRunning(false);
      setProgress(null);
    }
  }

  return {
    start,
    stop: () => {
      stopped.current = true;
    },
    running,
    progress,
  };
}

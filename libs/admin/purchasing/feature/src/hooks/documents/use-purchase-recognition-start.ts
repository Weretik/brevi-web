import { useStartNewPurchaseFilesRecognitionMutation } from '@admin/purchasing/data-access';
import { describePurchaseRecognitionStart } from '@admin/purchasing/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';

/**
 * «Розпізнати всі нові»: starts the «Фонові задачі» task that reads the new originals by AI.
 * The page does not wait for the files; a running or waiting task comes back as the server reason.
 */
export function usePurchaseRecognitionStart(onResult: (message: string, ok: boolean) => void) {
  const [startRecognition, { isLoading }] = useStartNewPurchaseFilesRecognitionMutation();

  async function start() {
    if (isLoading) return;
    try {
      onResult(describePurchaseRecognitionStart(await startRecognition().unwrap()), true);
    } catch (error) {
      onResult(adminApiErrorMessage(error, 'Не вдалося запустити розпізнавання.'), false);
    }
  }

  return { start, starting: isLoading };
}

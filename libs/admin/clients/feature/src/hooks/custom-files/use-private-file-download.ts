import { getCustomFileContent } from '@admin/clients/data-access';
import { isAdminApiError } from '@admin/shared/api-client';
import { useEffect, useRef, useState } from 'react';

export function usePrivateFileDownload(onAccessLost: () => void) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const busy = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const download = async (fileId: string, versionId?: string, quoteId?: string) => {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError('');
    try {
      const blob = await getCustomFileContent({ fileId, versionId, quoteId });
      if (!mounted.current) return;
      const url = URL.createObjectURL(blob);
      try {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileId;
        link.click();
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch (failure) {
      if (!mounted.current) return;
      if (isAdminApiError(failure) && (failure.status === 401 || failure.status === 403))
        onAccessLost();
      setError(
        isAdminApiError(failure) && failure.status === 404
          ? 'Файл відсутній або недоступний. Метадані не підтверджують наявність байтів.'
          : 'Не вдалося отримати приватний файл. Повторіть завантаження.',
      );
    } finally {
      busy.current = false;
      if (mounted.current) setPending(false);
    }
  };
  return { pending, error, download };
}

import {
  downloadQuotePdfArtifact,
  useGetIssuerSettingsQuery,
  useLazyGetQuotePdfArtifactQuery,
  usePrepareQuoteMutation,
  useRenderQuotePdfMutation,
} from '@admin/clients/data-access';
import { isAdminApiError } from '@admin/shared/api-client';
import { useEffect, useRef, useState } from 'react';

import { saveQuotePdf } from './save-quote-pdf';

import type { QuoteDetail, QuotePdfView } from '@admin/clients/model';

function accessLost(error: unknown): boolean {
  return isAdminApiError(error) && (error.status === 403 || error.status === 404);
}

function message(error: unknown): string {
  if (isAdminApiError(error)) {
    if (Object.values(error.fieldErrors ?? {}).includes('introduction_public_layout_too_large'))
      return 'Текст не вміщується в сезонний макет. Скоротіть вступ, контактний блок або описи моделей і повторіть підготовку КП.';
    return error.message;
  }
  return error instanceof Error
    ? error.message
    : 'Сервер відхилив дію. Оновіть КП і перевірте його стан.';
}

export function useQuoteDocuments(
  detail: QuoteDetail,
  disabled: boolean,
  onAccepted: (value: QuoteDetail) => void,
  onLock: (pending: boolean, uncertain: boolean) => void,
) {
  const issuer = useGetIssuerSettingsQuery();
  const [prepare] = usePrepareQuoteMutation();
  const [render] = useRenderQuotePdfMutation();
  const [getArtifact] = useLazyGetQuotePdfArtifactQuery();
  const [artifact, setArtifact] = useState<QuotePdfView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const readyRequestId = useRef<string | null>(null);
  const current = useRef(detail);
  current.current = detail;

  useEffect(() => {
    setArtifact(null);
    readyRequestId.current = null;
  }, [detail.publicId, detail.versionId]);

  useEffect(() => {
    if (error || !artifact || !['queued', 'processing'].includes(artifact.status)) return;
    const timer = window.setInterval(() => {
      void getArtifact(
        { quoteId: current.current.publicId, artifactId: artifact.artifactId },
        false,
      )
        .unwrap()
        .then(setArtifact)
        .catch((reason: unknown) => {
          if (accessLost(reason)) setArtifact(null);
          setError(message(reason));
        });
    }, 3000);
    return () => window.clearInterval(timer);
  }, [artifact, error, getArtifact]);

  const run = async (action: () => Promise<void>) => {
    if (busy || disabled) return;
    setBusy(true);
    setError(null);
    onLock(true, false);
    try {
      await action();
    } catch (reason) {
      if (accessLost(reason)) setArtifact(null);
      setError(message(reason));
      // Preserve requestId; an uncertain prepare can be retried with the same key.
    } finally {
      onLock(false, false);
      setBusy(false);
    }
  };

  const prepareReady = () =>
    void run(async () => {
      readyRequestId.current ??= crypto.randomUUID();
      const result = await prepare({
        quoteId: detail.publicId,
        body: {
          requestId: readyRequestId.current,
          expectedRevision: detail.revision,
          versionId: detail.versionId,
        },
      }).unwrap();
      readyRequestId.current = null;
      onAccepted(result);
    });
  const renderPdf = () =>
    void run(async () => {
      setArtifact(
        await render({ quoteId: detail.publicId, body: { versionId: detail.versionId } }).unwrap(),
      );
    });
  const refresh = () =>
    void run(async () => {
      if (!artifact) return;
      setArtifact(
        await getArtifact(
          { quoteId: detail.publicId, artifactId: artifact.artifactId },
          false,
        ).unwrap(),
      );
    });
  const download = () =>
    void run(async () => {
      if (!artifact || artifact.status !== 'succeeded') return;
      const blob = await downloadQuotePdfArtifact(detail.publicId, artifact.artifactId);
      saveQuotePdf(blob, `${(detail.number ?? 'KP').replaceAll('/', '-')}.pdf`);
    });

  const availability =
    issuer.isLoading || issuer.isFetching
      ? 'loading'
      : issuer.error
        ? 'error'
        : issuer.data?.active
          ? 'active'
          : 'missing';
  return {
    availability,
    artifact,
    error,
    busy,
    prepareReady,
    renderPdf,
    refresh,
    download,
  } as const;
}

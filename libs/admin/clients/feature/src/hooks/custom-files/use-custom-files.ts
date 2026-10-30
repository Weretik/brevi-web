import {
  useGetCustomFilesQuery,
  useSetCustomFilesMutation,
  useUploadCustomFileMutation,
} from '@admin/clients/data-access';
import { isAdminApiError } from '@admin/shared/api-client';
import { useEffect, useRef, useState } from 'react';

import type { CustomDetail, CustomPrivateFile, CustomFileSelection } from '@admin/clients/model';

const selections = (rows: readonly CustomPrivateFile[]): CustomFileSelection[] =>
  rows.map(({ id, showInQuote, production }) => ({ fileId: id, showInQuote, production }));

export function useCustomFiles({
  detail,
  disabled,
  versionId,
  quoteId,
  onAccepted,
  onAccessLost,
}: {
  detail: CustomDetail;
  disabled: boolean;
  versionId?: string;
  quoteId?: string;
  onAccepted: (detail: CustomDetail) => void;
  onAccessLost?: () => void;
}) {
  const query = useGetCustomFilesQuery(
    { id: detail.id, versionId, quoteId },
    { refetchOnMountOrArgChange: true },
  );
  const [upload] = useUploadCustomFileMutation();
  const [setFiles] = useSetCustomFilesMutation();
  const [rows, setRows] = useState<readonly CustomPrivateFile[]>([]);
  const [baseline, setBaseline] = useState('[]');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const busy = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const lastRead = useRef<readonly CustomPrivateFile[] | undefined>(undefined);
  const deniedNotified = useRef(false);
  const captured = useRef<null | { kind: 'upload' | 'save'; run: () => Promise<void> }>(null);
  const dirty = JSON.stringify(selections(rows)) !== baseline;
  const readOnly = !!versionId || !!quoteId || !detail.canEdit;
  const locked = pending || uncertain || forbidden;
  useEffect(() => {
    if (
      query.error ||
      !query.currentData ||
      dirty ||
      captured.current ||
      lastRead.current === query.currentData
    )
      return;
    lastRead.current = query.currentData;
    setRows(query.currentData);
    setBaseline(JSON.stringify(selections(query.currentData)));
  }, [query.currentData, query.error, dirty]);
  const deny = () => {
    setForbidden(true);
    setRows([]);
    setBaseline('[]');
    captured.current = null;
    setUncertain(false);
    if (!deniedNotified.current) {
      deniedNotified.current = true;
      onAccessLost?.();
    }
  };
  useEffect(() => {
    if (isAdminApiError(query.error) && [401, 403, 404].includes(query.error.status)) {
      setForbidden(true);
      setRows([]);
      setBaseline('[]');
      captured.current = null;
      setUncertain(false);
      if (!deniedNotified.current) {
        deniedNotified.current = true;
        onAccessLost?.();
      }
    }
  }, [query.error, onAccessLost]);
  const run = async () => {
    if (busy.current || !captured.current || forbidden) return;
    busy.current = true;
    setPending(true);
    setError('');
    try {
      await captured.current.run();
      captured.current = null;
      setUncertain(false);
    } catch (failure) {
      if (!mounted.current) return;
      const unknown =
        !isAdminApiError(failure) ||
        failure.status === 0 ||
        failure.status === 408 ||
        failure.status >= 500;
      setUncertain(unknown);
      if (!unknown) captured.current = null;
      if (
        isAdminApiError(failure) &&
        (failure.status === 401 || failure.status === 403 || failure.status === 404)
      )
        deny();
      setError(
        isAdminApiError(failure) && failure.status === 409
          ? 'Конфігурацію змінено або термін тимчасового файлу минув. Скасуйте локальні зміни прив’язок і оновіть конфігурацію перед повтором.'
          : isAdminApiError(failure)
            ? failure.message
            : 'Дію не завершено. Повторіть той самий запит.',
      );
    } finally {
      busy.current = false;
      if (mounted.current) setPending(false);
    }
  };
  const stage = async (file: File) => {
    if (
      disabled ||
      readOnly ||
      locked ||
      captured.current ||
      query.error ||
      !query.currentData ||
      rows.length >= 30
    )
      return;
    if (
      !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type) ||
      file.size < 1 ||
      file.size > 20971520
    ) {
      setError('Дозволені PDF, JPEG та PNG розміром до 20 МіБ.');
      return;
    }
    const requestId = crypto.randomUUID();
    captured.current = {
      kind: 'upload',
      run: async () => {
        const result = await upload({ id: detail.id, requestId, file }).unwrap();
        if (!mounted.current) return;
        setRows((current) =>
          current.some((row) => row.id === result.id) ? current : [...current, result],
        );
      },
    };
    await run();
  };
  const save = async () => {
    if (
      disabled ||
      readOnly ||
      locked ||
      captured.current ||
      query.error ||
      !query.currentData ||
      !dirty
    )
      return;
    const intent = {
      id: detail.id,
      revision: detail.revision,
      requestId: crypto.randomUUID(),
      files: selections(rows),
    };
    captured.current = {
      kind: 'save',
      run: async () => {
        const result = await setFiles(intent).unwrap();
        if (!mounted.current) return;
        setRows((current) => current.map((row) => ({ ...row, isFinalized: true })));
        setBaseline(JSON.stringify(intent.files));
        onAccepted(result);
        void query.refetch();
      },
    };
    await run();
  };
  return {
    rows: query.error || forbidden ? [] : rows,
    query,
    dirty,
    error,
    pending,
    uncertain,
    forbidden,
    locked,
    readOnly,
    retryKind: captured.current?.kind,
    stage,
    save,
    retry: run,
    deny,
    discard: () => {
      if (disabled || readOnly || locked || captured.current || query.error || !query.currentData)
        return;
      setRows(query.currentData);
      setBaseline(JSON.stringify(selections(query.currentData)));
      lastRead.current = query.currentData;
      setError('');
    },
    change: (id: string, flags: { showInQuote: boolean; production: boolean }) => {
      if (!disabled && !readOnly && !locked && !query.error)
        setRows((current) => current.map((row) => (row.id === id ? { ...row, ...flags } : row)));
    },
    remove: (id: string) => {
      if (!disabled && !readOnly && !locked && !query.error)
        setRows((current) => current.filter((row) => row.id !== id));
    },
  };
}

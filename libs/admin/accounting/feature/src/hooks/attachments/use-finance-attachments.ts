import {
  fetchFinanceAttachmentContent,
  useDeleteFinanceAttachmentMutation,
  useGetFinanceAttachmentsQuery,
  useUploadFinanceAttachmentMutation,
} from '@admin/accounting/data-access';
import { financeAttachmentFileProblem } from '@admin/accounting/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useState } from 'react';

import type { FinanceAttachment, FinanceTransaction } from '@admin/accounting/model';

/** The server's reason for a refused file (wrong type, too large, storage off), else the fallback. */
function reason(error: unknown, fallback: string): string {
  if (isAdminApiError(error) && error.fieldErrors['file']) return error.fieldErrors['file'];
  return adminApiErrorMessage(error, fallback);
}

/** A blob URL lives a minute: long enough for the new tab to load it. */
const urlLifetimeMs = 60_000;

/**
 * «Файли» of one operation in its side panel: list, add several at once (each checked first),
 * open in a new tab through the session, delete after a confirmation.
 */
export function useFinanceAttachments(transaction: FinanceTransaction | null) {
  const id = transaction?.id ?? '';
  const query = useGetFinanceAttachmentsQuery(id, { skip: !transaction });
  const [upload, uploadState] = useUploadFinanceAttachmentMutation();
  const [remove, removeState] = useDeleteFinanceAttachmentMutation();
  const [error, setError] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<FinanceAttachment | null>(null);
  const editable = transaction?.status === 'Active';

  async function add(files: File[]) {
    if (!transaction) return;
    setError(null);
    const problems: string[] = [];
    for (const file of files) {
      const problem = financeAttachmentFileProblem(file);
      if (problem) {
        problems.push(`«${file.name}»: ${problem}`);
        continue;
      }
      try {
        await upload({ transactionId: transaction.id, file }).unwrap();
      } catch (failure) {
        problems.push(`«${file.name}»: ${reason(failure, 'Не вдалося додати файл.')}`);
      }
    }
    if (problems.length) setError(problems.join(' '));
  }

  async function open(file: FinanceAttachment) {
    setError(null);
    // The tab opens on the click itself, so the browser does not block it while the file loads.
    const tab = window.open('', '_blank');
    setOpening(true);
    try {
      const blob = await fetchFinanceAttachmentContent(file.id);
      const url = URL.createObjectURL(new Blob([blob], { type: file.contentType }));
      if (tab) {
        tab.location.href = url;
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.download = file.fileName;
        document.body.append(link);
        link.click();
        link.remove();
      }
      setTimeout(() => URL.revokeObjectURL(url), urlLifetimeMs);
    } catch (failure) {
      tab?.close();
      setError(adminApiErrorMessage(failure, 'Не вдалося відкрити файл.'));
    } finally {
      setOpening(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setError(null);
    try {
      await remove({ id: pendingDelete.id, transactionId: pendingDelete.transactionId }).unwrap();
      setPendingDelete(null);
    } catch (failure) {
      setPendingDelete(null);
      setError(adminApiErrorMessage(failure, 'Не вдалося видалити файл.'));
    }
  }

  return {
    list: {
      files: query.data ?? [],
      loading: query.isLoading,
      error:
        error ??
        (query.error ? adminApiErrorMessage(query.error, 'Не вдалося завантажити файли.') : null),
      busy: uploadState.isLoading || removeState.isLoading || opening,
      onAdd: editable ? (files: File[]) => void add(files) : null,
      onOpen: (file: FinanceAttachment) => void open(file),
      onDelete: editable ? setPendingDelete : null,
    },
    pendingDelete,
    deleting: removeState.isLoading,
    cancelDelete: () => setPendingDelete(null),
    confirmDelete: () => void confirmDelete(),
  };
}

import {
  useActivateQuoteEmailTemplateMutation,
  useCreateQuoteEmailTemplateMutation,
  useGetQuoteEmailTemplatesQuery,
  useGetQuoteEmailTemplateSettingsQuery,
  useLazyGetQuoteEmailTemplateQuery,
} from '@admin/clients/data-access';
import { emailTemplateDraftErrors, emptyEmailTemplateDraft } from '@admin/clients/model';
import { isAdminApiError } from '@admin/shared/api-client';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useEmailTemplateSession } from './email-template-session';
import { useTemplateAction } from '../../custom-templates/use-template-action';

import type {
  EmailTemplateDraft,
  EmailTemplateDraftErrors,
  EmailTemplateDetailView,
} from '@admin/clients/model';

const denied = (error: unknown) => isAdminApiError(error) && [401, 403, 404].includes(error.status);

export function useEmailTemplateRegistry() {
  const roles = useEmailTemplateSession();
  const [page, setPage] = useState(1);
  const [readDenied, setReadDenied] = useState(false);
  const sessionDenied =
    denied(roles.error) ||
    (roles.currentData !== undefined &&
      !roles.isLoading &&
      !roles.isFetching &&
      !roles.error &&
      !roles.currentData.some((role) => role === 'Admin' || role === 'Manager'));
  const skipReads = readDenied || sessionDenied;
  const list = useGetQuoteEmailTemplatesQuery({ page }, { skip: skipReads });
  const settings = useGetQuoteEmailTemplateSettingsQuery(undefined, { skip: skipReads });
  const [get] = useLazyGetQuoteEmailTemplateQuery();
  const [create] = useCreateQuoteEmailTemplateMutation();
  const [activateVersion] = useActivateQuoteEmailTemplateMutation();
  const [draft, setDraft] = useState<EmailTemplateDraft>(emptyEmailTemplateDraft);
  const [errors, setErrors] = useState<EmailTemplateDraftErrors>({});
  const [selected, setSelected] = useState<EmailTemplateDetailView | null>(null);
  const [loading, setLoading] = useState(false);
  const [readError, setReadError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmActivation, setConfirmActivation] = useState(false);
  const reads = useRef({ epoch: 0, mounted: true, denied: false });
  const clear = useCallback(() => {
    reads.current.epoch += 1;
    setSelected(null);
    setDraft(emptyEmailTemplateDraft);
    setErrors({});
    setNotice('');
    setReadError('');
    setLoading(false);
    setConfirmActivation(false);
  }, []);
  const action = useTemplateAction(clear);
  const accessDenied =
    readDenied || sessionDenied || denied(list.error) || denied(settings.error) || action.forbidden;
  reads.current.denied = accessDenied;
  const canManage =
    !accessDenied && !roles.error && !roles.isFetching && !!roles.currentData?.includes('Admin');
  const busy = loading || action.pending || action.uncertain || accessDenied;
  useEffect(() => {
    reads.current.mounted = true;
    return () => {
      reads.current.mounted = false;
      reads.current.epoch += 1;
    };
  }, []);
  useEffect(() => {
    if (!accessDenied) return;
    setReadDenied(true);
    clear();
  }, [accessDenied, clear]);

  const open = async (id: string) => {
    if (accessDenied || action.pending || action.uncertain) return;
    const epoch = ++reads.current.epoch;
    setSelected(null);
    setLoading(true);
    setReadError('');
    setConfirmActivation(false);
    const current = () =>
      reads.current.mounted && !reads.current.denied && reads.current.epoch === epoch;
    try {
      const detail = await get({ id }, false).unwrap();
      if (current()) setSelected(detail);
    } catch (failure) {
      if (!current()) return;
      if (denied(failure)) {
        setReadDenied(true);
        clear();
      }
      setReadError('Не вдалося відкрити версію шаблону. Оновіть список і повторіть.');
    } finally {
      if (current()) setLoading(false);
    }
  };
  const change = (value: EmailTemplateDraft) => {
    if (!canManage || busy) return;
    setDraft(value);
    setErrors({});
    setNotice('');
  };
  const copySelected = () => {
    if (!selected || !canManage || busy) return;
    change({ name: selected.label, subject: selected.subject, body: selected.body });
  };
  const save = () => {
    if (!canManage || busy) return;
    const nextErrors = emailTemplateDraftErrors(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const body = {
      requestId: crypto.randomUUID(),
      name: draft.name.trim(),
      subject: draft.subject.trim(),
      body: draft.body.trim(),
    };
    setNotice('');
    void action.execute(async () => {
      const detail = await create(body).unwrap();
      if (action.isCurrent() && !reads.current.denied) {
        setSelected(detail);
        setNotice(`Створено версію ${detail.number}. Активація виконується окремо.`);
      }
    });
  };
  const activate = () => {
    if (
      !canManage ||
      busy ||
      !selected ||
      !settings.currentData ||
      settings.error ||
      settings.isFetching
    )
      return;
    const body = {
      requestId: crypto.randomUUID(),
      expectedRevision: settings.currentData.revision,
      versionId: selected.id,
    };
    setConfirmActivation(false);
    setNotice('');
    void action.execute(async () => {
      try {
        await activateVersion(body).unwrap();
        if (action.isCurrent() && !reads.current.denied)
          setNotice('Версію шаблону листа активовано.');
      } catch (failure) {
        if (isAdminApiError(failure) && failure.status === 409) void settings.refetch();
        throw failure;
      }
    });
  };
  return {
    roles,
    retryReadAccess: () => {
      if (action.forbidden) return;
      setReadDenied(false);
      void roles.refetch();
    },
    list,
    settings,
    page,
    setPage,
    draft,
    errors,
    selected,
    loading,
    readError,
    notice,
    action,
    accessDenied,
    canManage,
    busy,
    open,
    change,
    copySelected,
    save,
    activate,
    confirmActivation,
    setConfirmActivation,
  };
}

import {
  useApplyIntroductionTemplateMutation,
  useArchiveIntroductionTemplateMutation,
  useCreateIntroductionTemplateMutation,
  useGetIntroductionFeaturedMappingQuery,
  useGetIntroductionTemplatesQuery,
  useLazyCheckIntroductionTemplateQuery,
  useLazyGetIntroductionTemplateQuery,
  useReviseIntroductionTemplateMutation,
} from '@admin/clients/data-access';
import { introductionLayout } from '@admin/clients/model';
import { isAdminApiError } from '@admin/shared/api-client';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  introductionEditorValues,
  introductionWriteSelections,
} from './introduction-editor-values';
import { introductionErrorMessage } from './introduction-error-message';
import { useIntroductionDraft } from './use-introduction-draft';
import { useTemplateAction } from '../custom-templates/use-template-action';

import type { IntroductionPreparedDraft, IntroductionTemplateDetail } from '@admin/clients/model';

export function useIntroductionEditor() {
  const navigate = useNavigate();
  const draft = useIntroductionDraft();
  const [page, setPage] = useState(1);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [prepared, setPrepared] = useState<IntroductionPreparedDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [readError, setReadError] = useState('');
  const list = useGetIntroductionTemplatesQuery({ page, includeArchived });
  const mapping = useGetIntroductionFeaturedMappingQuery();
  const selectionToken = `${draft.selectionToken}:${mapping.currentData?.versionId ?? 'no-mapping'}`;
  const currentToken = useRef(selectionToken);
  currentToken.current = selectionToken;
  const [get] = useLazyGetIntroductionTemplateQuery();
  const [create] = useCreateIntroductionTemplateMutation();
  const [revise] = useReviseIntroductionTemplateMutation();
  const [archive] = useArchiveIntroductionTemplateMutation();
  const [check] = useLazyCheckIntroductionTemplateQuery();
  const [apply] = useApplyIntroductionTemplateMutation();
  const action = useTemplateAction(() => {
    draft.reset();
    setPrepared(null);
  });
  const accessDenied = isAdminApiError(list.error) && [401, 403, 404].includes(list.error.status);
  const busy = loading || action.pending || action.uncertain || action.forbidden || accessDenied;
  const reads = useRef({ epoch: 0, mounted: true, denied: false });
  reads.current.denied = accessDenied;
  useEffect(() => {
    reads.current.mounted = true;
    return () => {
      reads.current.mounted = false;
      reads.current.epoch += 1;
    };
  }, []);
  const resetDraft = draft.reset;
  useEffect(() => {
    if (accessDenied) {
      reads.current.epoch += 1;
      setLoading(false);
      resetDraft();
      setPrepared(null);
    }
  }, [accessDenied, resetDraft]);
  const load = (detail: IntroductionTemplateDetail) => {
    const next = introductionEditorValues(detail);
    draft.load(next.values, next.slots, next.source);
    setPrepared(null);
  };
  const open = async (id: string) => {
    if (busy) return;
    const epoch = ++reads.current.epoch;
    const isCurrent = () =>
      reads.current.mounted && !reads.current.denied && reads.current.epoch === epoch;
    setLoading(true);
    setReadError('');
    try {
      const detail = await get({ id }, false).unwrap();
      if (isCurrent()) load(detail);
    } catch (failure) {
      if (!isCurrent()) return;
      if (isAdminApiError(failure) && [401, 403, 404].includes(failure.status)) {
        draft.reset();
        setPrepared(null);
      }
      setReadError('Не вдалося відкрити добірку. Оновіть список і повторіть.');
    } finally {
      if (isCurrent()) setLoading(false);
    }
  };
  const save = () => {
    const requestId = crypto.randomUUID();
    const values = draft.values;
    const source = draft.source;
    let selections;
    try {
      if (!values.name.trim() || !values.emailTemplateVersionId)
        throw new Error('Вкажіть назву та чинну версію шаблону листа.');
      selections = introductionWriteSelections(values.format, draft.slots);
    } catch (failure) {
      setReadError(failure instanceof Error ? failure.message : 'Перевірте добірку.');
      return;
    }
    setReadError('');
    const body = {
      requestId,
      name: values.name.trim(),
      format: values.format,
      emailTemplateVersionId: values.emailTemplateVersionId,
      selections,
    };
    void action.execute(async () => {
      const detail = source
        ? await revise({ ...body, id: source.id, revision: source.revision }).unwrap()
        : await create(body).unwrap();
      if (action.isCurrent()) load(detail);
    });
  };
  const setArchived = (id: string) => {
    const row = list.currentData?.rows.find((value) => value.id === id);
    if (!row) return;
    const request = {
      id,
      revision: row.revision,
      requestId: crypto.randomUUID(),
      archived: !row.archived,
    };
    void action.execute(async () => {
      const detail = await archive(request).unwrap();
      if (action.isCurrent() && draft.source?.id === id) load(detail);
    });
  };
  const checkSelection = async (selectionToken: string) => {
    if (!draft.source || draft.dirty)
      return { approved: false, blockers: ['Спочатку збережіть поточну добірку.'] };
    if (!mapping.currentData || mapping.currentData.versionId !== draft.source.mappingVersionId)
      return {
        approved: false,
        blockers: [
          'Конфігурація головних моделей змінилася або недоступна. Оновіть і збережіть добірку.',
        ],
      };
    let result: IntroductionPreparedDraft;
    try {
      result = await check(
        { id: draft.source.id, versionId: draft.source.versionId },
        false,
      ).unwrap();
    } catch (failure) {
      if (isAdminApiError(failure) && [401, 403, 404].includes(failure.status)) {
        draft.reset();
        setPrepared(null);
      }
      throw new Error(introductionErrorMessage(failure));
    }
    if (currentToken.current === selectionToken) setPrepared(result);
    return { approved: true, blockers: [] };
  };
  const applySelection = async () => {
    if (!draft.source || draft.dirty || !recipientName.trim())
      throw new Error('Збережіть добірку та вкажіть одержувача КП.');
    const request = {
      id: draft.source.id,
      versionId: draft.source.versionId,
      requestId: crypto.randomUUID(),
      customerId: null,
      contactId: null,
      recipientName: recipientName.trim(),
    };
    await action.execute(async () => {
      const quote = await apply(request).unwrap();
      if (action.isCurrent()) navigate(`/crm/quotes/${quote.publicId}`);
    });
  };
  const slotViews = introductionLayout(draft.values.format).map((slot) => {
    const selection = draft.slots.find((row) => row.key === slot.key);
    const uid = (slot.season === 'summer' ? 100 : 200) + slot.position - 1;
    const checked = !draft.dirty ? prepared?.slots.find((row) => row.slotUid === uid) : null;
    return {
      slot,
      productLabel: checked?.modelName ?? selection?.productLabel ?? null,
      fabricLabel: checked?.fabricName ?? selection?.fabricLabel ?? null,
      blockers: [
        !selection?.productId ? 'Оберіть модель.' : '',
        !selection?.articleId ? 'Оберіть тканину.' : '',
      ].filter(Boolean),
    };
  });
  return {
    draft,
    page,
    setPage,
    includeArchived,
    setIncludeArchived,
    recipientName,
    setRecipientName,
    list,
    mapping,
    action,
    busy,
    readError,
    open,
    save,
    setArchived,
    checkSelection,
    applySelection,
    slotViews,
    selectionToken,
    accessDenied,
    reset: () => {
      draft.reset();
      setPrepared(null);
      setReadError('');
    },
  };
}

import {
  useActivateIssuerSettingsMutation,
  useCreateIssuerSettingsVersionMutation,
  useGetIssuerSettingsQuery,
} from '@admin/clients/data-access';
import {
  documentTemplateErrors,
  emptyDocumentTemplateDraft,
  emptyIssuerSettingsDraft,
  issuerSettingsErrors,
} from '@admin/clients/model';
import { useRef, useState } from 'react';

import { issuerSettingsError } from '../../errors/documents/issuer-settings-error';

import type { IssuerSettingsVersion } from '@admin/clients/data-access';
import type { DocumentTemplateDraft, IssuerSettingsDraft } from '@admin/clients/model';

export function useIssuerSettingsEditor() {
  const query = useGetIssuerSettingsQuery();
  const [createVersion, creating] = useCreateIssuerSettingsVersionMutation();
  const [activate, activating] = useActivateIssuerSettingsMutation();
  const [issuer, setIssuer] = useState<IssuerSettingsDraft>(emptyIssuerSettingsDraft);
  const [template, setTemplate] = useState<DocumentTemplateDraft>(emptyDocumentTemplateDraft);
  const [issuerErrors, setIssuerErrors] = useState<ReturnType<typeof issuerSettingsErrors>>({});
  const [templateErrors, setTemplateErrors] = useState<ReturnType<typeof documentTemplateErrors>>(
    {},
  );
  const [created, setCreated] = useState<IssuerSettingsVersion | null>(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const createRequestId = useRef<string | null>(null);
  const activateRequestId = useRef<string | null>(null);
  const busy = creating.isLoading || activating.isLoading;

  const changeIssuer = (value: IssuerSettingsDraft) => {
    setIssuer(value);
    setCreated(null);
    setNotice('');
    createRequestId.current = null;
    activateRequestId.current = null;
  };
  const changeTemplate = (value: DocumentTemplateDraft) => {
    setTemplate(value);
    setCreated(null);
    setNotice('');
    createRequestId.current = null;
    activateRequestId.current = null;
  };
  const loadActive = () => {
    const active = query.data?.active;
    if (!active) return;
    changeIssuer({
      ...active.issuer,
      bankName: active.issuer.bankName ?? '',
      mfo: active.issuer.mfo ?? '',
      logoAssetKey: active.issuer.logoAssetKey ?? '',
    });
    changeTemplate(active.template);
    setNotice('Активну версію завантажено до форми.');
  };
  const save = async () => {
    const nextIssuerErrors = issuerSettingsErrors(issuer);
    const nextTemplateErrors = documentTemplateErrors(template);
    setIssuerErrors(nextIssuerErrors);
    setTemplateErrors(nextTemplateErrors);
    if (Object.keys(nextIssuerErrors).length || Object.keys(nextTemplateErrors).length) return;
    setError('');
    setNotice('');
    try {
      createRequestId.current ??= crypto.randomUUID();
      const result = await createVersion({
        requestId: createRequestId.current,
        issuer: {
          ...issuer,
          bankName: issuer.bankName || null,
          mfo: issuer.mfo || null,
          logoAssetKey: issuer.logoAssetKey || null,
        },
        template,
      }).unwrap();
      setCreated(result);
      createRequestId.current = null;
      setNotice(`Створено версію ${result.versionNumber}. Активуйте її окремою дією.`);
    } catch (reason) {
      setError(issuerSettingsError(reason));
    }
  };
  const activateCreated = async () => {
    if (!created || !query.data) return;
    setError('');
    try {
      activateRequestId.current ??= crypto.randomUUID();
      await activate({
        requestId: activateRequestId.current,
        expectedRevision: query.data.revision,
        issuerVersionId: created.issuerVersionId,
        templateVersionId: created.templateVersionId,
      }).unwrap();
      setCreated(null);
      activateRequestId.current = null;
      setNotice('Версію реквізитів і шаблону активовано.');
    } catch (reason) {
      setError(issuerSettingsError(reason));
    }
  };
  return {
    query,
    issuer,
    template,
    issuerErrors,
    templateErrors,
    created,
    notice,
    error,
    busy,
    changeIssuer,
    changeTemplate,
    loadActive,
    save,
    activateCreated,
  } as const;
}

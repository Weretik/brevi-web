import { useCreateCatalogProductMutation } from '@admin/products/data-access';
import {
  emptySewingModelForm,
  sewingModelCreateInput,
  validateSewingModel,
} from '@admin/products/model';
import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';
import { useEffect, useState } from 'react';

import { useSewingModelCodeCheck } from './use-sewing-model-code-check';

import type {
  SewingModelField,
  SewingModelFieldErrors,
  SewingModelFormValues,
} from '@admin/products/model';

const fields: readonly SewingModelField[] = [
  'code',
  'name',
  'sectionId',
  'season',
  'currentSiteUrl',
  'quoteDescription',
];

/**
 * Step 1 before the draft exists: the form prefilled with the suggested code, its validation and
 * creating the inactive, unverified draft. Resolves with the new product id.
 */
export function useSewingModelForm() {
  const [values, setValues] = useState<SewingModelFormValues>(emptySewingModelForm);
  const [codeTouched, setCodeTouched] = useState(false);
  const [errors, setErrors] = useState<SewingModelFieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [create, createState] = useCreateCatalogProductMutation();
  const code = useSewingModelCodeCheck(values.code);
  const { suggestedCode } = code;

  useEffect(() => {
    if (!codeTouched && suggestedCode)
      setValues((current) => (current.code ? current : { ...current, code: suggestedCode }));
  }, [codeTouched, suggestedCode]);

  const codeError = validateSewingModel(values, code.check).code;
  const liveErrors: SewingModelFieldErrors = {
    ...errors,
    ...(code.check?.isAvailable === false && codeError ? { code: codeError } : {}),
  };

  function change<Field extends SewingModelField>(
    field: Field,
    value: SewingModelFormValues[Field],
  ) {
    if (field === 'code') setCodeTouched(true);
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function submit(): Promise<number | null> {
    if (createState.isLoading) return null;
    const validation = validateSewingModel(values, code.check);
    setErrors(validation);
    if (Object.keys(validation).length) return null;
    setMessage(null);
    try {
      const created = await create(sewingModelCreateInput(values)).unwrap();
      return created.id;
    } catch (error) {
      if (isAdminApiError(error)) {
        const known = Object.fromEntries(
          Object.entries(error.fieldErrors).filter(([key]) =>
            (fields as readonly string[]).includes(key),
          ),
        );
        setErrors(known);
      }
      setMessage(adminApiErrorMessage(error, 'Не вдалося створити модель.'));
      return null;
    }
  }

  return {
    values,
    errors: liveErrors,
    message,
    creating: createState.isLoading,
    checkingCode: code.checking,
    codeNote: code.available && !liveErrors.code ? 'Код вільний.' : null,
    change,
    submit,
  };
}

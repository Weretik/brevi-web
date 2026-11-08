import type { LeadCallFormValues, LeadCallResultFormValues } from '@admin/leads/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

/** `datetime-local` (local time) → ISO with offset; the date is ignored for results that end the work. */
export function toRecordLeadCallInput(
  values: LeadCallFormValues,
  version: number,
): Schemas['CrmRecordLeadCallInput'] {
  const comment = values.comment.trim();
  return {
    resultId: values.resultId ?? 0,
    comment: comment || null,
    nextContactAt: values.nextContactAt ? new Date(values.nextContactAt).toISOString() : null,
    version,
  };
}

export const toSaveLeadCallResultInput = (
  values: LeadCallResultFormValues,
): Schemas['CrmSaveLeadCallResultInput'] => ({
  name: values.name.trim(),
  outcome: values.outcome,
  retryDays: values.outcome === 'Retry' ? Number(values.retryDays) || 1 : null,
  isActive: values.isActive,
  position: Number(values.position) || 0,
});

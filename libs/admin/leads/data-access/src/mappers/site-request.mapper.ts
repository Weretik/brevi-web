import type { SiteRequest, SiteRequestPage } from '@admin/leads/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

export const mapSiteRequest = (value: Schemas['CrmSiteRequest']): SiteRequest => ({
  id: value.id,
  phone: value.phone,
  workwear: value.workwear ?? null,
  quantity: value.quantity ?? null,
  comment: value.comment ?? null,
  locale: value.locale,
  fileName: value.fileName ?? null,
  fileUrl: value.fileUrl ?? null,
  status: value.status,
  ownerUserId: value.ownerUserId ?? null,
  ownerName: value.ownerName ?? null,
  takenAt: value.takenAt ?? null,
  closedAt: value.closedAt ?? null,
  note: value.note ?? null,
  createdAt: value.createdAt,
  notifyError: value.notifyError ?? null,
  version: value.version,
});

export const mapSiteRequestPage = (value: Schemas['CrmSiteRequestPage']): SiteRequestPage => ({
  items: value.items.map(mapSiteRequest),
  total: value.total,
  counts: { ...value.counts },
});

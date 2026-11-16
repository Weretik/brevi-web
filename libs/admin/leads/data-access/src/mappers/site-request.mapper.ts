import type { SiteRequest, SiteRequestPage, SiteRequestStatus } from '@admin/leads/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

export const mapSiteRequest = (value: Schemas['SiteRequestResponse']): SiteRequest => ({
  id: value.id,
  phone: value.phone,
  workwear: value.workwear ?? null,
  quantity: value.quantity ?? null,
  comment: value.comment ?? null,
  locale: value.locale as 'uk' | 'ru',
  fileName: value.fileName ?? null,
  fileUrl: value.fileUrl ?? null,
  status: value.status as SiteRequestStatus,
  ownerUserId: value.ownerUserId ?? null,
  ownerName: value.ownerName ?? null,
  takenAt: value.takenAt ?? null,
  closedAt: value.closedAt ?? null,
  note: value.note ?? null,
  createdAt: value.createdAt,
  notifyError: value.notifyError ?? null,
  version: value.version,
});

export const mapSiteRequestPage = (value: Schemas['SiteRequestPageResponse']): SiteRequestPage => ({
  items: value.items.map(mapSiteRequest),
  total: value.total,
  counts: { ...value.counts },
});

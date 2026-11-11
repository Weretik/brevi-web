import type {
  SiteRequest,
  SiteRequestAction,
  SiteRequestCounts,
  SiteRequestScope,
  SiteRequestStatus,
  SiteRequestViewer,
} from '../entities/site-request';

export const siteRequestStatusLabels: Record<SiteRequestStatus, string> = {
  New: 'Нова',
  InWork: 'У роботі',
  Done: 'Готово',
  Spam: 'Не заявка',
};

export const siteRequestStatusTones: Record<SiteRequestStatus, 'warning' | 'info' | 'default'> = {
  New: 'warning',
  InWork: 'info',
  Done: 'default',
  Spam: 'default',
};

export const siteRequestScopes: readonly {
  scope: SiteRequestScope;
  label: string;
  count: (counts: SiteRequestCounts) => number;
}[] = [
  { scope: 'Open', label: 'Нові та в роботі', count: (c) => c.new + c.inWork },
  { scope: 'Mine', label: 'Мої', count: (c) => c.mine },
  { scope: 'Closed', label: 'Закриті', count: (c) => c.closed },
  { scope: 'All', label: 'Усі', count: (c) => c.new + c.inWork + c.closed },
];

export const siteRequestNoteMaxLength = 1000;

export const isSiteRequestOpen = (request: SiteRequest) =>
  request.status === 'New' || request.status === 'InWork';

/**
 * What the viewer may press (LEAD-002 R-05): anyone with edit takes a free request; the owner or an Admin closes or
 * frees a taken one. The server checks the same rules.
 */
export function siteRequestActions(
  request: SiteRequest,
  viewer: SiteRequestViewer,
): readonly SiteRequestAction[] {
  if (!viewer.canEdit) return [];
  const free = request.ownerUserId === null;
  const mine = viewer.userId !== null && request.ownerUserId === viewer.userId;
  const manage = viewer.isAdmin || free || mine;
  if (!isSiteRequestOpen(request)) return manage ? ['Reopen'] : [];
  const actions: SiteRequestAction[] = [];
  if (free) actions.push('Take');
  if (manage) actions.push('Done', 'Spam');
  if (manage && !free) actions.push('Reopen');
  return actions;
}

export const siteRequestActionLabels: Record<SiteRequestAction, string> = {
  Take: 'Беру',
  Done: 'Готово',
  Spam: 'Не заявка',
  Reopen: 'Повернути в нові',
};

/** «050 469 86 75» from what the visitor typed; anything unexpected stays as it was. */
export function formatSiteRequestPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const local = digits.length === 12 && digits.startsWith('380') ? `0${digits.slice(3)}` : digits;
  if (local.length !== 10 || !local.startsWith('0')) return phone;
  return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6, 8)} ${local.slice(8)}`;
}

/** `tel:` link in the international form, so it dials from any phone. */
export function siteRequestPhoneHref(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10 && digits.startsWith('0')) return `tel:+38${digits}`;
  return `tel:+${digits}`;
}

export function formatSiteRequestMoment(value: string): string {
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Kyiv',
  }).format(new Date(value));
}

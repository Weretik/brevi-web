import type { QuoteListQuery } from '@admin/clients/model';

export function quoteListQuery(params: URLSearchParams, archivedView: boolean): QuoteListQuery {
  const rawPage = Number(params.get('page') ?? 1);
  const page = Number.isSafeInteger(rawPage) && rawPage >= 1 && rawPage <= 1000000 ? rawPage : 1;
  const state = params.get('state');
  const owner = Number(params.get('ownerId'));
  const source = params.get('sourceQuoteId') ?? '';
  const date = (key: string) => {
    const value = params.get(key);
    return value && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : undefined;
  };
  const from = date('createdFrom');
  const before = date('createdBefore');
  return {
    page,
    pageSize: 25,
    search: (params.get('search') ?? '').slice(0, 300),
    state: state === 'draft' || state === 'ready' || state === 'sent' ? state : undefined,
    archived: archivedView || params.get('archived') === 'true',
    ...(Number.isSafeInteger(owner) && owner > 0 ? { ownerId: owner } : {}),
    ...(from ? { createdFrom: from } : {}),
    ...(before ? { createdBefore: before } : {}),
    ...(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(source)
      ? { sourceQuoteId: source }
      : {}),
  };
}

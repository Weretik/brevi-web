import {
  useGetQuoteQuery,
  useGetQuoteVersionsQuery,
  useGetQuoteVersionQuery,
  useGetQuoteEventsQuery,
} from '@admin/clients/data-access';
import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useClientDirtyGuard } from '../../navigation/use-client-dirty-guard';

const pageNumber = (value: string | null) => {
  const n = Number(value ?? 1);
  return Number.isInteger(n) && n >= 1 && n <= 1000000 ? n : 1;
};

export function useQuoteHistory() {
  const { quoteId = '' } = useParams<{ quoteId: string }>();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [locked, setLocked] = useState(false);
  const guard = useClientDirtyGuard(locked);
  const root = useGetQuoteQuery(quoteId, { refetchOnMountOrArgChange: true });
  const detail = root.currentData;
  const accessible = !!detail && !root.error;
  const versionId = params.get('version') ?? detail?.versionId ?? '';
  const validVersion = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(
    versionId,
  );
  const versions = useGetQuoteVersionsQuery(
    { quoteId, page: pageNumber(params.get('versionPage')), pageSize: 25 },
    { skip: !accessible },
  );
  const events = useGetQuoteEventsQuery(
    { quoteId, page: pageNumber(params.get('eventPage')), pageSize: 25 },
    { skip: !accessible },
  );
  const snapshot = useGetQuoteVersionQuery(
    { quoteId, versionId },
    { skip: !accessible || !validVersion },
  );
  const selected = versions.currentData?.rows.find((row) => row.publicId === versionId);
  const parentId = selected?.parentVersionId ?? '';
  const comparison = useGetQuoteVersionQuery(
    { quoteId, versionId: parentId },
    { skip: !accessible || !parentId || params.get('compare') !== 'parent' },
  );
  const change = (key: string, value: string) => {
    if (locked) return;
    const next = new URLSearchParams(params);
    next.set(key, value);
    if (key === 'version') next.delete('compare');
    setParams(next);
  };

  return {
    quoteId,
    params,
    navigate,
    detail,
    root,
    accessible,
    versionId,
    validVersion,
    versions,
    events,
    snapshot,
    selected,
    parentId,
    comparison,
    locked,
    setLocked,
    guard,
    change,
    versionPage: pageNumber(params.get('versionPage')),
    eventPage: pageNumber(params.get('eventPage')),
  };
}

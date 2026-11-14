import { useImportFabricNormsMutation } from '@admin/production/data-access';
import { filterFabricNorms, parseBatchSize } from '@admin/production/model';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useFabricNormDeletion } from './use-fabric-norm-deletion';
import { useFabricNorms } from './use-fabric-norms';
import { useModelCompositions } from './use-model-compositions';

import type { FabricNormFilter, FabricNormRow } from '@admin/production/model';

/** «Норми витрати тканини»: the models with their search and chip, the model open from the address, its composition, the batch size, editing, import and deletion. */
export function useFabricNormsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { rows, loading, error, reload } = useFabricNorms();
  const compositions = useModelCompositions();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FabricNormFilter>(null);
  const [batchText, setBatchText] = useState('');
  const [editing, setEditing] = useState<FabricNormRow | null>(null);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const deletion = useFabricNormDeletion(setMessage);
  const [importNorms] = useImportFabricNormsMutation();
  const filtered = useMemo(() => filterFabricNorms(rows, search, filter), [rows, search, filter]);

  const requested = searchParams.get('model');
  const selected = filtered.find((row) => row.modelCode === requested) ?? filtered[0] ?? null;
  const composition = selected
    ? compositions.rows.find((model) => model.modelCode === selected.modelCode)
    : undefined;
  const batchSize = parseBatchSize(batchText);

  const select = (row: FabricNormRow) =>
    setSearchParams({ model: row.modelCode }, { replace: true });
  return {
    rows,
    loading,
    error,
    reload,
    compositions,
    search,
    setSearch,
    filter,
    setFilter,
    batchText,
    setBatchText,
    editing,
    setEditing,
    importing,
    setImporting,
    message,
    setMessage,
    deletion,
    importNorms,
    filtered,
    selected,
    composition,
    batchSize,
    select,
  };
}

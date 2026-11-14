import { useDeletePricingParameterMutation } from '@admin/references/data-access';
import { filterPricingParameters, listPricingParameterSections } from '@admin/references/model';
import { useMemo, useState } from 'react';

import { usePricingParameters } from './use-pricing-lists';
import { useReferenceDeletion } from '../reference-lists/use-reference-deletion';

import type {
  PricingEditorMode,
  PricingParameter,
  PricingParameterSectionFilter,
} from '@admin/references/model';

/** «Параметри ціноутворення»: the parameters with the search and section chip, the side panel, the message and deletion. */
export function usePricingParametersContent() {
  const { rows, loading, error, reload } = usePricingParameters();
  const [search, setSearch] = useState('');
  const [section, setSection] = useState<PricingParameterSectionFilter>(null);
  const [active, setActive] = useState<{
    mode: PricingEditorMode;
    parameter: PricingParameter | null;
  } | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [deleteParameter] = useDeletePricingParameterMutation();
  const deletion = useReferenceDeletion((id) => deleteParameter(id).unwrap(), setActionMessage);
  const sections = useMemo(() => listPricingParameterSections(rows), [rows]);
  const filteredRows = useMemo(
    () => filterPricingParameters(rows, search, section),
    [rows, search, section],
  );
  return {
    rows,
    loading,
    error,
    reload,
    search,
    setSearch,
    section,
    setSection,
    active,
    setActive,
    actionMessage,
    setActionMessage,
    deletion,
    sections,
    filteredRows,
  };
}

import { useDeletePpeMarkupRuleMutation } from '@admin/references/data-access';
import { filterPpeMarkupRules } from '@admin/references/model';
import {
  PpeMarkupRulesGrid,
  PricingDeleteDialog,
  ReferenceBulkDeleteButton,
  ReferenceFilterRow,
  ReferenceListAlerts,
  ReferencePageHeader,
  ReferenceSearchBar,
} from '@admin/references/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, Paper } from '@mui/material';
import { useMemo, useState } from 'react';

import { PpeMarkupRuleDrawer } from '../../components/pricing-parameters/ppe-markup-rule-drawer';
import { nextSortOrder, usePpeMarkupRules } from '../../hooks/pricing-parameters/use-pricing-lists';
import { useReferenceDeletion } from '../../hooks/reference-lists/use-reference-deletion';

import type { PpeMarkupRule, PricingEditorMode } from '@admin/references/model';
import type { ReactNode } from 'react';

interface Props {
  /** The «Параметри / Націнки ЗІЗ» switch shown under the header. */
  tabs: ReactNode;
}

export function PpeMarkupRulesContent({ tabs }: Props) {
  const { rows, loading, error, reload } = usePpeMarkupRules();
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<{ mode: PricingEditorMode; rule: PpeMarkupRule | null } | null>(
    null,
  );
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [deleteRule] = useDeletePpeMarkupRuleMutation();
  const deletion = useReferenceDeletion((id) => deleteRule(id).unwrap(), setActionMessage);
  const filteredRows = useMemo(() => filterPpeMarkupRules(rows, search), [rows, search]);

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Параметри ціноутворення"
        subtitle="Націнки ЗІЗ: ціна = ціна постачальника × (1 + націнка)"
        actions={
          <>
            <ReferenceBulkDeleteButton
              selectedCount={deletion.selectedIds.length}
              disabled={deletion.deleting || loading}
              onDelete={() => deletion.requestDelete(deletion.selectedIds)}
            />
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              disabled={loading || Boolean(error)}
              onClick={() => setActive({ mode: 'create', rule: null })}
            >
              Додати правило
            </Button>
          </>
        }
      />
      {tabs}
      <ReferenceListAlerts
        error={error}
        loading={loading}
        onRetry={() => void reload()}
        actionMessage={actionMessage}
        onCloseActionMessage={() => setActionMessage(null)}
      />
      <ReferenceSearchBar
        placeholder="Знайти правило за назвою, приміткою або товарами"
        label="Пошук правил націнки"
        value={search}
        onChange={setSearch}
      />
      <ReferenceFilterRow
        filters={null}
        count={filteredRows.length}
        total={rows.length}
        countLabel="Кількість правил"
        selectedCount={deletion.selectedIds.length}
        onClearSelection={deletion.clearSelection}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <PpeMarkupRulesGrid
          rows={filteredRows}
          loading={loading}
          searching={rows.length > 0}
          unavailable={Boolean(error)}
          selection={deletion.selection}
          onSelectionChange={deletion.setSelection}
          onView={(rule) => setActive({ mode: 'view', rule })}
          onEdit={(rule) => setActive({ mode: 'edit', rule })}
          onDelete={(id) => deletion.requestDelete([id])}
        />
      </Paper>
      {active && (
        <PpeMarkupRuleDrawer
          key={`${active.mode}-${active.rule?.id ?? 'new'}`}
          mode={active.mode}
          rule={active.rule}
          newSortOrder={nextSortOrder(rows)}
          onClose={() => setActive(null)}
          onSaved={() => {
            setActive(null);
            setActionMessage('Правило збережено.');
          }}
        />
      )}
      <PricingDeleteDialog
        ids={deletion.pendingDeleteIds}
        deleting={deletion.deleting}
        what="правил"
        onClose={deletion.cancelDelete}
        onConfirm={() => void deletion.confirmDelete()}
      />
    </Box>
  );
}

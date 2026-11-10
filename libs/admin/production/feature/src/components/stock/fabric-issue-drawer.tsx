import { FabricIssueForm } from '@admin/production/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { useFabricIssue } from '../../hooks/stock/use-fabric-issue';

import type { FabricStockFabricChoice, ProductionItemFabric } from '@admin/production/model';

interface Props {
  modelName: string;
  fabric: ProductionItemFabric;
  fabrics: readonly FabricStockFabricChoice[];
  colors: readonly string[];
  onClose: () => void;
  onSaved: (message: string) => void;
}

export function FabricIssueDrawer({ modelName, fabric, fabrics, colors, onClose, onSaved }: Props) {
  const issue = useFabricIssue(fabric, fabrics, onSaved);
  return (
    <ReferenceEditorDrawer
      titleId="fabric-issue-title"
      title={`Видача тканини: ${modelName}`}
      description="Залишок плану вже підставлено. Змініть метри або додайте заміну чи додаткову тканину."
      formId="fabric-issue-form"
      paperWidth={720}
      readOnly={false}
      editLabel={null}
      saving={issue.saving}
      submitLabel="Видати"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={issue.save}
    >
      <Stack sx={{ gap: 2 }}>
        {issue.message && <Alert severity="error">{issue.message}</Alert>}
        <FabricIssueForm
          values={issue.values}
          errors={issue.errors}
          fabric={fabric}
          fabrics={fabrics}
          colors={colors}
          itemFabricId={issue.itemFabricId}
          disabled={issue.saving}
          onChange={issue.change}
        />
      </Stack>
    </ReferenceEditorDrawer>
  );
}

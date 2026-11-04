import { FabricReceiptForm } from '@admin/production/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { useFabricReceipt } from '../../hooks/stock/use-fabric-receipt';

import type { FabricStockChoices, FabricStockRow } from '@admin/production/model';

interface Props {
  /** From a line card; null for any fabric and colour. */
  line: FabricStockRow | null;
  choices: FabricStockChoices;
  versionOf: (fabricId: number, color: string) => number | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

export function FabricReceiptDrawer({ line, choices, versionOf, onClose, onSaved }: Props) {
  const receipt = useFabricReceipt(line, versionOf, onSaved);
  return (
    <ReferenceEditorDrawer
      titleId="fabric-receipt-title"
      title={line ? `Прихід: ${line.fabricCode} · ${line.color}` : 'Прихід тканини'}
      description="Метри, що прийшли на склад. Новий колір з’явиться на складі сам."
      formId="fabric-receipt-form"
      paperWidth={520}
      readOnly={false}
      editLabel={null}
      saving={receipt.saving}
      submitLabel="Зберегти"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={receipt.save}
    >
      <Stack sx={{ gap: 2 }}>
        {receipt.message && <Alert severity="error">{receipt.message}</Alert>}
        <FabricReceiptForm
          values={receipt.values}
          errors={receipt.errors}
          choices={choices}
          fixedLine={line !== null}
          allowOpening={line === null}
          disabled={receipt.saving}
          onChange={receipt.change}
        />
      </Stack>
    </ReferenceEditorDrawer>
  );
}

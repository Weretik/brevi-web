import { FabricCorrectionForm } from '@admin/production/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, Stack } from '@mui/material';

import { useFabricCorrection } from '../../hooks/stock/use-fabric-correction';

import type { FabricStockRow } from '@admin/production/model';

interface Props {
  line: FabricStockRow;
  onClose: () => void;
  onSaved: (message: string) => void;
}

export function FabricCorrectionDrawer({ line, onClose, onSaved }: Props) {
  const correction = useFabricCorrection(line, onSaved);
  return (
    <ReferenceEditorDrawer
      titleId="fabric-correction-title"
      title={`Коригування: ${line.fabricCode} · ${line.color}`}
      description="Залишок стане таким, як пораховано. Різниця запишеться окремим рухом з причиною."
      formId="fabric-correction-form"
      paperWidth={480}
      readOnly={false}
      editLabel={null}
      saving={correction.saving}
      submitLabel="Зберегти"
      onClose={onClose}
      onEdit={() => undefined}
      onSubmit={correction.save}
    >
      <Stack sx={{ gap: 2 }}>
        {correction.message && <Alert severity="error">{correction.message}</Alert>}
        <FabricCorrectionForm
          values={correction.values}
          errors={correction.errors}
          meters={line.meters}
          disabled={correction.saving}
          onChange={correction.change}
        />
      </Stack>
    </ReferenceEditorDrawer>
  );
}

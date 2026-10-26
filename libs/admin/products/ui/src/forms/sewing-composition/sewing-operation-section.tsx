import { Button, Stack, Typography } from '@mui/material';

import { SewingOperationRow } from './sewing-operation-row';

import type { ProductLookups } from '../../product-editor/core/product-lookups';
import type { SewingOperationDraft } from '@admin/products/model';

interface Props {
  operations: SewingOperationDraft[];
  lookups: Pick<ProductLookups, 'operations'>;
  readonly: boolean;
  canManage: boolean;
  saving: boolean;
  operationError: (index: number, field: string) => string | undefined;
  updateOperation: (index: number, update: Partial<SewingOperationDraft>) => void;
  onOperationsChange: (items: SewingOperationDraft[]) => void;
  addOperation: () => void;
}
export function SewingOperationSection({
  operations,
  lookups,
  readonly,
  canManage,
  saving,
  operationError,
  updateOperation,
  onOperationsChange,
  addOperation,
}: Props) {
  return (
    <Stack sx={{ gap: 1 }}>
      <Typography variant="subtitle1" component="h3">
        Спільні операції
      </Typography>
      {operations.length === 0 && (
        <Typography color="text.secondary">Операцій поки немає.</Typography>
      )}
      {operations.map((operation, index) => (
        <SewingOperationRow
          key={operation.clientId}
          operation={operation}
          error={(field) => operationError(index, field)}
          lookups={lookups}
          readonly={readonly}
          canManage={canManage}
          saving={saving}
          onChange={(update) => updateOperation(index, update)}
          onRemove={() =>
            onOperationsChange(
              operations
                .filter((_, position) => position !== index)
                .map((item, position) => ({ ...item, sortOrder: position })),
            )
          }
        />
      ))}
      {canManage && (
        <Button onClick={addOperation} disabled={saving}>
          Додати операцію
        </Button>
      )}
    </Stack>
  );
}

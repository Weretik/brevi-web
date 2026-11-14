import { ProductionOrderHistory } from '@admin/production/ui';
import { ReferenceEditorDrawer } from '@admin/references/ui';
import { Alert, LinearProgress } from '@mui/material';

import type { ProductionOrderChange } from '@admin/production/model';

interface Props {
  number: number;
  changes: readonly ProductionOrderChange[];
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

/** «Історія змін» of an order in a read-only side panel. */
export function ProductionOrderHistoryDrawer({ number, changes, loading, error, onClose }: Props) {
  return (
    <ReferenceEditorDrawer
      titleId="production-order-history-title"
      title="Історія змін"
      description={`Завдання № ${number}: хто, що і коли змінив`}
      formId="production-order-history"
      paperWidth={520}
      readOnly
      saving={false}
      editLabel={null}
      onClose={onClose}
      onEdit={onClose}
      onSubmit={onClose}
    >
      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : loading && changes.length === 0 ? (
        <LinearProgress aria-label="Завантаження історії" />
      ) : (
        <ProductionOrderHistory changes={changes} />
      )}
    </ReferenceEditorDrawer>
  );
}

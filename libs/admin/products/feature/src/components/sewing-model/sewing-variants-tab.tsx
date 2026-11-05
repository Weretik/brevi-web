import { sewingVariantRows } from '@admin/products/model';
import { SewingLineDeleteDialog, SewingVariantsGrid } from '@admin/products/ui';
import AddIcon from '@mui/icons-material/Add';
import { Button, Stack } from '@mui/material';

import { SewingModelState } from './sewing-model-state';
import { SewingVariantDrawer } from './sewing-variant-drawer';
import { useCanSeeCost } from '../../hooks/product-access/use-can-see-cost';
import { useSewingLinePanel } from '../../hooks/sewing-model/use-sewing-line-panel';

import type { SewingModel } from '../../hooks/sewing-model/use-sewing-model';
import type { SewingModelWrites } from '../../hooks/sewing-model/use-sewing-model-writes';

interface Props {
  model: SewingModel;
  writes: SewingModelWrites;
}

/** «Тканини»: every fabric of the model with its live cost and prices; add or change in a panel. */
export function SewingVariantsTab({ model, writes }: Props) {
  const lines = useSewingLinePanel<number>();
  const showCost = useCanSeeCost();
  const rows = sewingVariantRows(model.summary);
  const open = lines.panel;
  const variant =
    open && open.key !== 'new'
      ? (model.variants.find((item) => item.id === open.key) ?? null)
      : null;
  const deleting = rows.find((row) => row.id === lines.deleting) ?? null;

  if (model.error) return <SewingModelState model={model} label="Завантаження тканин" />;
  return (
    <Stack sx={{ gap: 2 }}>
      {model.canManage && (
        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            disabled={model.loading || !model.draft}
            onClick={() => {
              writes.clearError();
              lines.add();
            }}
          >
            Додати тканину
          </Button>
        </Stack>
      )}
      <SewingVariantsGrid
        rows={rows}
        loading={model.loading || model.refreshing}
        canManage={model.canManage}
        showCost={showCost}
        onOpen={(row) => {
          writes.clearError();
          lines.view(row.id);
        }}
        onEdit={(row) => {
          writes.clearError();
          lines.edit(row.id);
        }}
        onDelete={(row) => {
          writes.clearError();
          lines.askDelete(row.id);
        }}
      />
      {open && (open.key === 'new' || variant) && (
        <SewingVariantDrawer
          key={`${open.key}:${open.readOnly}`}
          variant={variant}
          variants={model.variants}
          version={model.version}
          readOnly={open.readOnly || !model.canManage}
          saving={writes.busy}
          error={writes.error}
          onEdit={() => variant && model.canManage && lines.edit(variant.id)}
          onClose={lines.close}
          onSave={writes.saveVariant}
        />
      )}
      <SewingLineDeleteDialog
        name={deleting ? (deleting.fabricName ?? `Артикул ${deleting.saleSku}`) : null}
        deleting={writes.busy}
        error={writes.error}
        onClose={lines.cancelDelete}
        onConfirm={() => {
          if (!deleting) return;
          void writes.deleteVariant(deleting.id).then((done) => done && lines.cancelDelete());
        }}
      />
    </Stack>
  );
}
